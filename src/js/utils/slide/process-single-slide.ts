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
 * @param appVersion - PowerPoint app version (used for XML parsing)
 * @param processFullTheme - Theme processing setting (true/false/"colorsAndImageOnly")
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
import type { XmlNode } from "../../types/pptx-xml";
import { readXmlFile, indexNodes } from "../xml";
import { getTextByPathList } from "../object";
import { getSlideBackgroundFill } from "../fill";
import { getBackground } from "./get-background";
import { processNodesInSlide } from "../node";

export async function processSingleSlide(
  archive: PptxArchive,
  slideFilePath: string,
  slideIndex: number,
  slideDimensions: { width: number; height: number; appVersion: number; defaultTextStyle: any },
  defaultTextStyle: any,
  appVersion: number,
  processFullTheme: boolean,
  tableStyles: any,
  firstLineBreak: { value: boolean },
  styleTable: any,
  rtlLanguages: string[],
  emuToPx: number,
  fontSizeScale: number,
  chartId: { value: number },
  messageQueue: any,
  settings: any
): Promise<string> {
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
  const slideRelContent = await readXmlFile(archive, slideRelPath);
  let relationshipEntries = slideRelContent["Relationships"]["Relationship"];
  //console.log("RelationshipArray: " , RelationshipArray)
  let layoutFilePath = "";
  let diagramFilePath = "";
  const slideResourceMap = {};
  if (relationshipEntries.constructor === Array) {
    for (let i = 0; i < relationshipEntries.length; i++) {
      const relationship = relationshipEntries[i];
      switch (relationship["attrs"]["Type"]) {
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout":
          layoutFilePath = relationship["attrs"]["Target"].replace("../", "ppt/");
          break;
        case "http://schemas.microsoft.com/office/2007/relationships/diagramDrawing":
          diagramFilePath = relationship["attrs"]["Target"].replace("../", "ppt/");
          slideResourceMap[relationship["attrs"]["Id"]] = {
            type: relationship["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: relationship["attrs"]["Target"].replace("../", "ppt/"),
          };
          break;
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide":
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image":
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart":
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink":
        default:
          slideResourceMap[relationship["attrs"]["Id"]] = {
            type: relationship["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: relationship["attrs"]["Target"].replace("../", "ppt/"),
          };
      }
    }
  } else {
    layoutFilePath = relationshipEntries["attrs"]["Target"].replace("../", "ppt/");
  }
  //console.log(slideResObj);
  // Open slideLayoutXX.xml
  const slideLayoutXml = await readXmlFile(archive, layoutFilePath);
  const slideLayoutIndex = indexNodes(slideLayoutXml);
  const slideLayoutColorOverride = getTextByPathList(slideLayoutXml, [
    "p:sldLayout",
    "p:clrMapOvr",
    "a:overrideClrMapping",
  ]);

  //console.log(slideLayoutClrOvride);
  if (slideLayoutColorOverride !== undefined) {
    void slideLayoutColorOverride["attrs"];
  }
  // =====< Step 2 >=====
  // Read slide master filename of the slidelayout (Get slideMasterXX.xml)
  // @layoutFilePath: ppt/slideLayouts/slideLayout1.xml
  // @slideLayoutRelPath: ppt/slideLayouts/_rels/slideLayout1.xml.rels
  const slideLayoutRelPath =
    layoutFilePath.replace("slideLayouts/slideLayout", "slideLayouts/_rels/slideLayout") + ".rels";
  const slideLayoutRelContent = await readXmlFile(archive, slideLayoutRelPath);
  relationshipEntries = slideLayoutRelContent["Relationships"]["Relationship"];
  let masterFilePath = "";
  const layoutResourceMap = {};
  if (relationshipEntries.constructor === Array) {
    for (let i = 0; i < relationshipEntries.length; i++) {
      const relationship = relationshipEntries[i];
      switch (relationship["attrs"]["Type"]) {
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster":
          masterFilePath = relationship["attrs"]["Target"].replace("../", "ppt/");
          break;
        default:
          layoutResourceMap[relationship["attrs"]["Id"]] = {
            type: relationship["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: relationship["attrs"]["Target"].replace("../", "ppt/"),
          };
      }
    }
  } else {
    masterFilePath = relationshipEntries["attrs"]["Target"].replace("../", "ppt/");
  }
  // Open slideMasterXX.xml
  const slideMasterXml = await readXmlFile(archive, masterFilePath);
  const slideMasterTextStyles = getTextByPathList<XmlNode>(slideMasterXml, [
    "p:sldMaster",
    "p:txStyles",
  ]);
  const slideMasterIndex = indexNodes(slideMasterXml);

  /////////////////Amir/////////////
  //Open slideMasterXX.xml.rels
  const slideMasterRelPath =
    masterFilePath.replace("slideMasters/slideMaster", "slideMasters/_rels/slideMaster") + ".rels";
  const slideMasterRelContent = await readXmlFile(archive, slideMasterRelPath);
  relationshipEntries = slideMasterRelContent["Relationships"]["Relationship"];
  let themeFilePath = "";
  const masterResourceMap = {};
  if (relationshipEntries.constructor === Array) {
    for (let i = 0; i < relationshipEntries.length; i++) {
      const relationship = relationshipEntries[i];
      switch (relationship["attrs"]["Type"]) {
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme":
          themeFilePath = relationship["attrs"]["Target"].replace("../", "ppt/");
          break;
        default:
          masterResourceMap[relationship["attrs"]["Id"]] = {
            type: relationship["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: relationship["attrs"]["Target"].replace("../", "ppt/"),
          };
      }
    }
  } else {
    themeFilePath = relationshipEntries["attrs"]["Target"].replace("../", "ppt/");
  }
  //console.log(themeFilePath)
  //Load Theme file
  const themeResourceMap = {};
  let themeXml = null;
  if (themeFilePath !== undefined) {
    const themeFileName = themeFilePath.split("/").pop();
    const themeRelPath = themeFilePath.replace(themeFileName, "_rels/" + themeFileName) + ".rels";
    //console.log("themeFilename: ", themeFilePath, ", themeName: ", themeFileName, ", themeRelPath: ", themeRelPath)
    themeXml = await readXmlFile(archive, themeFilePath);
    const themeRelContent = await readXmlFile(archive, themeRelPath);
    if (themeRelContent !== null) {
      const themeRelationshipEntries = themeRelContent["Relationships"]["Relationship"];
      if (themeRelationshipEntries !== undefined) {
        if (themeRelationshipEntries.constructor === Array) {
          for (let i = 0; i < themeRelationshipEntries.length; i++) {
            const relationship = themeRelationshipEntries[i];
            themeResourceMap[relationship["attrs"]["Id"]] = {
              type: relationship["attrs"]["Type"].replace(
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
                ""
              ),
              target: relationship["attrs"]["Target"].replace("../", "ppt/"),
            };
          }
        } else {
          //console.log("theme relationshipEntries: ", themeRelationshipEntries)
          themeResourceMap[themeRelationshipEntries["attrs"]["Id"]] = {
            type: themeRelationshipEntries["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: themeRelationshipEntries["attrs"]["Target"].replace("../", "ppt/"),
          };
        }
      }
    }
  }
  //Load diagram file
  const diagramResourceMap = {};
  let diagramFileContent = {};
  if (diagramFilePath !== undefined) {
    const diagramFileName = diagramFilePath.split("/").pop();
    const diagramRelPath =
      diagramFilePath.replace(diagramFileName, "_rels/" + diagramFileName) + ".rels";
    //console.log("diagramFilename: ", diagramFilePath, ", diagramRelPath: ", diagramRelPath)
    diagramFileContent = await readXmlFile(archive, diagramFilePath);
    if (
      diagramFileContent !== null &&
      diagramFileContent !== undefined &&
      diagramFileContent !== ""
    ) {
      let diagramFileContentJson = JSON.stringify(diagramFileContent);
      diagramFileContentJson = diagramFileContentJson.replace(/dsp:/g, "p:");
      diagramFileContent = JSON.parse(diagramFileContentJson);
    }

    const diagramRelContent = await readXmlFile(archive, diagramRelPath);
    if (diagramRelContent !== null) {
      const diagramRelationshipEntries = diagramRelContent["Relationships"]["Relationship"];
      if (diagramRelationshipEntries.constructor === Array) {
        for (let i = 0; i < diagramRelationshipEntries.length; i++) {
          const relationship = diagramRelationshipEntries[i];
          diagramResourceMap[relationship["attrs"]["Id"]] = {
            type: relationship["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: relationship["attrs"]["Target"].replace("../", "ppt/"),
          };
        }
      } else {
        //console.log("diagram relationshipEntries: ", diagramRelationshipEntries)
        diagramResourceMap[diagramRelationshipEntries["attrs"]["Id"]] = {
          type: diagramRelationshipEntries["attrs"]["Type"].replace(
            "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
            ""
          ),
          target: diagramRelationshipEntries["attrs"]["Target"].replace("../", "ppt/"),
        };
      }
    }
  }
  //console.log("diagramResObj: " , diagramResourceMap)
  // =====< Step 3 >=====
  const slideXml = await readXmlFile(archive, slideFilePath, true, slideDimensions.appVersion);
  const slideNodeTree = slideXml["p:sld"]["p:cSld"]["p:spTree"];
  const warpContext = {
    archive: archive,
    slideLayoutContent: slideLayoutXml,
    slideLayoutTables: slideLayoutIndex,
    slideMasterContent: slideMasterXml,
    slideMasterTables: slideMasterIndex,
    slideContent: slideXml,
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
    backgroundHtml = await getBackground(
      warpContext,
      slideDimensions,
      slideIndex,
      tableStyles,
      firstLineBreak,
      styleTable,
      rtlLanguages,
      emuToPx,
      fontSizeScale,
      chartId,
      messageQueue,
      settings
    );
  }

  let backgroundCss = "";
  if (settings.themeProcess === "colorsAndImageOnly") {
    const fillResult = await getSlideBackgroundFill(warpContext, slideIndex);
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
    if (slideNodeTree[nodeType].constructor === Array) {
      for (let i = 0; i < slideNodeTree[nodeType].length; i++) {
        slideHtml += await processNodesInSlide(
          nodeType,
          slideNodeTree[nodeType][i],
          slideNodeTree,
          warpContext,
          "slide",
          undefined,
          tableStyles,
          firstLineBreak,
          styleTable,
          rtlLanguages,
          emuToPx,
          fontSizeScale,
          chartId,
          messageQueue,
          settings
        );
      }
    } else {
      slideHtml += await processNodesInSlide(
        nodeType,
        slideNodeTree[nodeType],
        slideNodeTree,
        warpContext,
        "slide",
        undefined,
        tableStyles,
        firstLineBreak,
        styleTable,
        rtlLanguages,
        emuToPx,
        fontSizeScale,
        chartId,
        messageQueue,
        settings
      );
    }
  }
  if (settings.slideMode && settings.slideType === "revealjs") {
    return slideHtml + "</div></section>";
  } else {
    return slideHtml + "</div></div>";
  }
}
