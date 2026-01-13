/**
 * Process a single slide and generate its HTML representation
 *
 * This function orchestrates the complete rendering of a single slide by:
 * 1. Reading slide relationships to find layout and master references
 * 2. Loading layout and master XML files
 * 3. Loading theme data
 * 4. Building a warpContext containing all resources
 * 5. Rendering background elements
 * 6. Processing all slide content nodes (shapes, images, charts, etc.)
 *
 * @param archive - PPTX archive instance
 * @param slideFilePath - Path to slide XML file (e.g., "ppt/slides/slide1.xml")
 * @param slideIndex - Slide index number (0-based)
 * @param slideDimensions - Object containing slide width and height
 * @param defaultTextStyle - Default text styling from presentation
 * @param tableStyles - Table styles from presentation
 * @param firstLineBreak - Mutable object tracking first line break state
 * @param styleTable - Global CSS style table
 * @param rtlLanguages - Array of RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @param chartId - Chart ID counter (modified in place)
 * @param messageQueue - Message queue for chart processing
 * @param settings - Plugin settings
 * @returns HTML string for the slide
 */

import type { PptxArchive } from "../../archive/pptx-archive";
import type { RenderSettings } from "../../types/pptx-settings";
import type { StyleTable } from "../../types/style";
import type { XmlNode } from "../../types/pptx-xml";
import { readXmlFile, indexNodes } from "../xml";
import { getTextByPathList } from "../object";
import { getSlideBackgroundFill } from "../fill";
import { getBackground } from "./get-background";
import { processNodesInSlide } from "../node";

const normalizeTarget = (value: string | number | undefined): string => {
  const target = String(value ?? "");
  return target.startsWith("../") ? target.replace("../", "ppt/") : target;
};
const relationshipPrefix = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/";
const getRelationshipType = (value: string | number | undefined): string => String(value ?? "");
const stripRelationshipPrefix = (value: string): string => value.replace(relationshipPrefix, "");
const getRelationshipId = (relationship: XmlNode): string | undefined => {
  const idValue = relationship.attrs?.Id;
  return idValue !== undefined ? String(idValue) : undefined;
};
// Normalize relationship nodes into a predictable array.
const asRelationshipArray = (value: XmlNode | XmlNode[] | undefined): XmlNode[] =>
  value ? (Array.isArray(value) ? value : [value]) : [];

type ProcessSingleSlideOptions = {
  archive: PptxArchive;
  slideFilePath: string;
  slideIndex: number;
  slideDimensions: { width: number; height: number; appVersion: number };
  defaultTextStyle: XmlNode | undefined;
  tableStyles: Record<string, unknown> | null;
  firstLineBreak: { value: boolean };
  styleTable: StyleTable;
  rtlLanguages: string[];
  emuToPx: number;
  fontSizeScale: number;
  chartId: { value: number };
  messageQueue: Array<{ data: unknown; type?: string }>;
  settings: RenderSettings;
};

export async function processSingleSlide({
  archive,
  slideFilePath,
  slideIndex,
  slideDimensions,
  defaultTextStyle,
  tableStyles,
  firstLineBreak,
  styleTable,
  rtlLanguages,
  emuToPx,
  fontSizeScale,
  chartId,
  messageQueue,
  settings,
}: ProcessSingleSlideOptions): Promise<string> {
  /*
            self.postMessage({
                "type": "INFO",
                "data": "Processing slide" + (index + 1)
            });
            */
  // =====< Step 1 >=====
  // Read relationship filename of the slide (Get slideLayoutXX.xml)
  // @slideFilePath: ppt/slides/slide1.xml
  // @slideRelPath: ppt/slides/_rels/slide1.xml.rels
  const slideRelPath = slideFilePath.replace("slides/slide", "slides/_rels/slide") + ".rels";
  const slideRelContent = await readXmlFile({ archive, filename: slideRelPath });
  if (!slideRelContent || typeof slideRelContent !== "object") {
    throw new Error(`Missing slide relationships: ${slideRelPath}`);
  }
  const relationshipEntries = getTextByPathList<XmlNode | XmlNode[]>({
    node: slideRelContent as XmlNode,
    path: ["Relationships", "Relationship"],
  });
  if (!relationshipEntries) {
    throw new Error(`Missing slide relationships entries: ${slideRelPath}`);
  }
  //console.log("RelationshipArray: " , RelationshipArray)
  let layoutFilePath = "";
  let diagramFilePath = "";
  const slideResourceMap: Record<string, { type: string; target: string }> = {};
  for (const relationship of asRelationshipArray(relationshipEntries)) {
    const relationshipType = getRelationshipType(relationship.attrs?.Type);
    const target = normalizeTarget(relationship.attrs?.Target);
    const relationshipId = getRelationshipId(relationship);
    switch (relationshipType) {
      case `${relationshipPrefix}slideLayout`:
        layoutFilePath = target;
        break;
      case "http://schemas.microsoft.com/office/2007/relationships/diagramDrawing":
        diagramFilePath = target;
        if (relationshipId) {
          slideResourceMap[relationshipId] = {
            type: stripRelationshipPrefix(relationshipType),
            target,
          };
        }
        break;
      case `${relationshipPrefix}notesSlide`:
      case `${relationshipPrefix}image`:
      case `${relationshipPrefix}chart`:
      case `${relationshipPrefix}hyperlink`:
      default:
        if (relationshipId) {
          slideResourceMap[relationshipId] = {
            type: stripRelationshipPrefix(relationshipType),
            target,
          };
        }
    }
  }
  if (!layoutFilePath) {
    throw new Error(`Missing slide layout relationship: ${slideRelPath}`);
  }
  //console.log(slideResObj);
  // Open slideLayoutXX.xml
  const slideLayoutXml = await readXmlFile({ archive, filename: layoutFilePath });
  if (!slideLayoutXml || typeof slideLayoutXml !== "object") {
    throw new Error(`Missing slide layout content: ${layoutFilePath}`);
  }
  const slideLayoutRecord = slideLayoutXml as XmlNode;
  const slideLayoutIndex = indexNodes({ content: slideLayoutRecord as Record<string, XmlNode> });
  const slideLayoutColorOverride = getTextByPathList<XmlNode>({
    node: slideLayoutRecord,
    path: ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping"],
  });

  //console.log(slideLayoutClrOvride);
  if (slideLayoutColorOverride !== undefined) {
    void slideLayoutColorOverride.attrs;
  }
  // =====< Step 2 >=====
  // Read slide master filename of the slidelayout (Get slideMasterXX.xml)
  // @layoutFilePath: ppt/slideLayouts/slideLayout1.xml
  // @slideLayoutRelPath: ppt/slideLayouts/_rels/slideLayout1.xml.rels
  const slideLayoutRelPath =
    layoutFilePath.replace("slideLayouts/slideLayout", "slideLayouts/_rels/slideLayout") + ".rels";
  const slideLayoutRelContent = await readXmlFile({ archive, filename: slideLayoutRelPath });
  if (!slideLayoutRelContent || typeof slideLayoutRelContent !== "object") {
    throw new Error(`Missing slide layout relationships: ${slideLayoutRelPath}`);
  }
  const layoutRelationshipEntries = getTextByPathList<XmlNode | XmlNode[]>({
    node: slideLayoutRelContent as XmlNode,
    path: ["Relationships", "Relationship"],
  });
  if (!layoutRelationshipEntries) {
    throw new Error(`Missing slide layout relationships entries: ${slideLayoutRelPath}`);
  }
  let masterFilePath = "";
  const layoutResourceMap: Record<string, { type: string; target: string }> = {};
  for (const relationship of asRelationshipArray(layoutRelationshipEntries)) {
    const relationshipType = getRelationshipType(relationship.attrs?.Type);
    const target = normalizeTarget(relationship.attrs?.Target);
    const relationshipId = getRelationshipId(relationship);
    switch (relationshipType) {
      case `${relationshipPrefix}slideMaster`:
        masterFilePath = target;
        break;
      default:
        if (relationshipId) {
          layoutResourceMap[relationshipId] = {
            type: stripRelationshipPrefix(relationshipType),
            target,
          };
        }
    }
  }
  if (!masterFilePath) {
    throw new Error(`Missing slide master relationship: ${slideLayoutRelPath}`);
  }
  // Open slideMasterXX.xml
  const slideMasterXml = await readXmlFile({ archive, filename: masterFilePath });
  if (!slideMasterXml || typeof slideMasterXml !== "object") {
    throw new Error(`Missing slide master content: ${masterFilePath}`);
  }
  const slideMasterRecord = slideMasterXml as XmlNode;
  const slideMasterTextStyles = getTextByPathList<XmlNode>({
    node: slideMasterRecord,
    path: ["p:sldMaster", "p:txStyles"],
  });
  const slideMasterIndex = indexNodes({ content: slideMasterRecord as Record<string, XmlNode> });

  /////////////////Amir/////////////
  //Open slideMasterXX.xml.rels
  const slideMasterRelPath =
    masterFilePath.replace("slideMasters/slideMaster", "slideMasters/_rels/slideMaster") + ".rels";
  const slideMasterRelContent = await readXmlFile({ archive, filename: slideMasterRelPath });
  if (!slideMasterRelContent || typeof slideMasterRelContent !== "object") {
    throw new Error(`Missing slide master relationships: ${slideMasterRelPath}`);
  }
  const masterRelationshipEntries = getTextByPathList<XmlNode | XmlNode[]>({
    node: slideMasterRelContent as XmlNode,
    path: ["Relationships", "Relationship"],
  });
  if (!masterRelationshipEntries) {
    throw new Error(`Missing slide master relationships entries: ${slideMasterRelPath}`);
  }
  let themeFilePath = "";
  const masterResourceMap: Record<string, { type: string; target: string }> = {};
  for (const relationship of asRelationshipArray(masterRelationshipEntries)) {
    const relationshipType = getRelationshipType(relationship.attrs?.Type);
    const target = normalizeTarget(relationship.attrs?.Target);
    const relationshipId = getRelationshipId(relationship);
    switch (relationshipType) {
      case `${relationshipPrefix}theme`:
        themeFilePath = target;
        break;
      default:
        if (relationshipId) {
          masterResourceMap[relationshipId] = {
            type: stripRelationshipPrefix(relationshipType),
            target,
          };
        }
    }
  }
  //console.log(themeFilePath)
  //Load Theme file
  const themeResourceMap: Record<string, { type: string; target: string }> = {};
  let themeXml: XmlNode | null = null;
  if (themeFilePath) {
    const themeFileName = themeFilePath.split("/").pop();
    if (!themeFileName) {
      throw new Error(`Invalid theme path: ${themeFilePath}`);
    }
    const themeRelPath = themeFilePath.replace(themeFileName, "_rels/" + themeFileName) + ".rels";
    //console.log("themeFilename: ", themeFilePath, ", themeName: ", themeFileName, ", themeRelPath: ", themeRelPath)
    const themeXmlContent = await readXmlFile({ archive, filename: themeFilePath });
    if (themeXmlContent && typeof themeXmlContent === "object") {
      themeXml = themeXmlContent as XmlNode;
    }
    const themeRelContent = await readXmlFile({ archive, filename: themeRelPath });
    if (themeRelContent && typeof themeRelContent === "object") {
      const themeRelationshipEntries = (themeRelContent as XmlNode)["Relationships"][
        "Relationship"
      ] as XmlNode | XmlNode[];
      if (themeRelationshipEntries !== undefined) {
        if (Array.isArray(themeRelationshipEntries)) {
          for (let i = 0; i < themeRelationshipEntries.length; i++) {
            const relationship = themeRelationshipEntries[i];
            const relationshipType = getRelationshipType(relationship.attrs?.Type);
            themeResourceMap[relationship["attrs"]["Id"]] = {
              type: stripRelationshipPrefix(relationshipType),
              target: normalizeTarget(relationship.attrs?.Target),
            };
          }
        } else {
          //console.log("theme relationshipEntries: ", themeRelationshipEntries)
          const relationshipType = getRelationshipType(themeRelationshipEntries.attrs?.Type);
          themeResourceMap[themeRelationshipEntries["attrs"]["Id"]] = {
            type: stripRelationshipPrefix(relationshipType),
            target: normalizeTarget(themeRelationshipEntries["attrs"]["Target"]),
          };
        }
      }
    }
  }
  //Load diagram file
  const diagramResourceMap: Record<string, { type: string; target: string }> = {};
  let diagramFileContent: XmlNode | Record<string, unknown> | null = {};
  if (diagramFilePath) {
    const diagramFileName = diagramFilePath.split("/").pop();
    if (!diagramFileName) {
      throw new Error(`Invalid diagram path: ${diagramFilePath}`);
    }
    const diagramRelPath =
      diagramFilePath.replace(diagramFileName, "_rels/" + diagramFileName) + ".rels";
    //console.log("diagramFilename: ", diagramFilePath, ", diagramRelPath: ", diagramRelPath)
    const diagramXmlContent = await readXmlFile({ archive, filename: diagramFilePath });
    if (diagramXmlContent && typeof diagramXmlContent === "object") {
      diagramFileContent = diagramXmlContent as XmlNode;
      let diagramFileContentJson = JSON.stringify(diagramFileContent);
      diagramFileContentJson = diagramFileContentJson.replace(/dsp:/g, "p:");
      diagramFileContent = JSON.parse(diagramFileContentJson);
    }

    const diagramRelContent = await readXmlFile({ archive, filename: diagramRelPath });
    if (diagramRelContent && typeof diagramRelContent === "object") {
      const diagramRelationshipEntries = (diagramRelContent as XmlNode)["Relationships"][
        "Relationship"
      ] as XmlNode | XmlNode[];
      for (const relationship of asRelationshipArray(diagramRelationshipEntries)) {
        const relationshipType = getRelationshipType(relationship.attrs?.Type);
        const relationshipId = getRelationshipId(relationship);
        if (!relationshipId) {
          continue;
        }
        diagramResourceMap[relationshipId] = {
          type: stripRelationshipPrefix(relationshipType),
          target: normalizeTarget(relationship.attrs?.Target),
        };
      }
    }
  }
  //console.log("diagramResObj: " , diagramResourceMap)
  // =====< Step 3 >=====
  const slideXml = await readXmlFile({
    archive,
    filename: slideFilePath,
    isSlideContent: true,
    appVersion: slideDimensions.appVersion,
  });
  if (!slideXml || typeof slideXml !== "object") {
    throw new Error(`Missing slide content: ${slideFilePath}`);
  }
  const slideRecord = slideXml as XmlNode;
  const slideNodeTreeValue = slideRecord["p:sld"]?.["p:cSld"]?.["p:spTree"];
  let slideNodeTree: XmlNode = {};
  if (
    slideNodeTreeValue &&
    typeof slideNodeTreeValue === "object" &&
    !Array.isArray(slideNodeTreeValue)
  ) {
    slideNodeTree = slideNodeTreeValue as XmlNode;
  }
  const warpContext = {
    archive: archive,
    slideLayoutContent: slideLayoutRecord,
    slideLayoutTables: slideLayoutIndex,
    slideMasterContent: slideMasterRecord,
    slideMasterTables: slideMasterIndex,
    slideContent: slideRecord,
    slideResObj: slideResourceMap,
    slideMasterTextStyles: slideMasterTextStyles,
    layoutResObj: layoutResourceMap,
    masterResObj: masterResourceMap,
    themeContent: themeXml,
    themeResObj: themeResourceMap,
    digramFileContent: diagramFileContent,
    diagramResObj: diagramResourceMap,
    defaultTextStyle: defaultTextStyle,
  };
  let backgroundHtml = "";
  if (settings.themeProcess === true) {
    backgroundHtml = await getBackground({
      warpContext,
      slideDimensions,
      slideIndex,
      tableStyles,
      firstLineBreak,
      styleTable,
      rtlLanguages,
      emuToPx,
      fontSizeScale,
      chartIdCounter: chartId,
      messageQueue,
      renderSettings: settings,
    });
  }

  let backgroundCss = "";
  if (settings.themeProcess === "colorsAndImageOnly") {
    const fillResult = await getSlideBackgroundFill({ warpContext });
    backgroundCss = fillResult !== undefined ? fillResult : "";
  }

  let slideHtml = "";
  if (settings.slideMode && settings.slideType === "revealjs") {
    slideHtml =
      "<section class='slide' style='width:" +
      slideDimensions.width +
      "px; height:" +
      slideDimensions.height +
      "px;" +
      backgroundCss +
      "'>";
  } else {
    slideHtml =
      "<div class='slide' style='width:" +
      slideDimensions.width +
      "px; height:" +
      slideDimensions.height +
      "px;" +
      backgroundCss +
      "'>";
  }
  slideHtml += backgroundHtml;
  for (const nodeType in slideNodeTree) {
    const nodeEntry = slideNodeTree[nodeType] as XmlNode | XmlNode[] | undefined;
    if (Array.isArray(nodeEntry)) {
      for (let i = 0; i < nodeEntry.length; i++) {
        slideHtml += await processNodesInSlide({
          nodeType,
          nodeData: nodeEntry[i],
          parentNodes: slideNodeTree,
          warpContext,
          sourceType: "slide",
          shapeType: undefined,
          tableStyles,
          firstLineBreak,
          styleTable,
          rtlLanguages,
          emuToPx,
          fontSizeScale,
          chartIdCounter: chartId,
          messageQueue,
          renderSettings: settings,
        });
      }
    } else if (nodeEntry !== undefined) {
      slideHtml += await processNodesInSlide({
        nodeType,
        nodeData: nodeEntry,
        parentNodes: slideNodeTree,
        warpContext,
        sourceType: "slide",
        shapeType: undefined,
        tableStyles,
        firstLineBreak,
        styleTable,
        rtlLanguages,
        emuToPx,
        fontSizeScale,
        chartIdCounter: chartId,
        messageQueue,
        renderSettings: settings,
      });
    }
  }
  if (settings.slideMode && settings.slideType === "revealjs") {
    return slideHtml + "</div></section>";
  } else {
    return slideHtml + "</div></div>";
  }
}
