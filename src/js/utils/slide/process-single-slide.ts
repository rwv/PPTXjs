/**
 * Process a single slide and generate its HTML representation
 *
 * This function orchestrates the complete rendering of a single slide by:
 * 1. Reading slide relationships to find layout and master references
 * 2. Loading layout and master XML files
 * 3. Loading theme data
 * 4. Building a warpObj containing all resources
 * 5. Rendering background elements
 * 6. Processing all slide content nodes (shapes, images, charts, etc.)
 *
 * @param archive - PPTX archive instance
 * @param sldFileName - Path to slide XML file (e.g., "ppt/slides/slide1.xml")
 * @param index - Slide index number (0-based)
 * @param slideSize - Object containing slide width and height
 * @param defaultTextStyle - Default text styling from presentation
 * @param app_verssion - PowerPoint app version (used for XML parsing)
 * @param processFullTheme - Theme processing setting (true/false/"colorsAndImageOnly")
 * @param tableStyles - Table styles from presentation
 * @param isFirstBr - Mutable object tracking first line break state
 * @param styleTable - Global CSS style table
 * @param rtlLangsArray - Array of RTL language codes
 * @param slideFactor - EMU to pixel conversion factor
 * @param fontSizeFactor - Font size scaling factor
 * @param chartID - Chart ID counter (modified in place)
 * @param MsgQueue - Message queue for chart processing
 * @param settings - Plugin settings
 * @returns HTML string for the slide
 */

import type { PptxArchive } from "../../archive/pptx-archive";
import { readXmlFile, indexNodes } from "../xml";
import { getTextByPathList } from "../object";
import { getSlideBackgroundFill } from "../fill";
import { getBackground } from "./get-background";
import {
  processNodesInSlide,
  processSpNode,
  processGraphicFrameNode,
  processGroupSpNode,
} from "../node";
import { processCxnSpNode, genShape } from "../shape";
import { processPicNode } from "../media";
import { genTable } from "../table";
import { genChart } from "../chart";
import { genDiagram } from "../diagram";

export function processSingleSlide(
  archive: PptxArchive,
  sldFileName: any,
  index: any,
  slideSize: any,
  defaultTextStyle: any,
  app_verssion: any,
  processFullTheme: any,
  tableStyles: any,
  isFirstBr: { value: boolean },
  styleTable: any,
  rtlLangsArray: string[],
  slideFactor: number,
  fontSizeFactor: number,
  chartID: any,
  MsgQueue: any,
  settings: any
): string {
  /*
            self.postMessage({
                "type": "INFO",
                "data": "Processing slide" + (index + 1)
            });
            */
  // =====< Step 1 >=====
  // Read relationship filename of the slide (Get slideLayoutXX.xml)
  // @sldFileName: ppt/slides/slide1.xml
  // @resName: ppt/slides/_rels/slide1.xml.rels
  const resName = sldFileName.replace("slides/slide", "slides/_rels/slide") + ".rels";
  const resContent = readXmlFile(archive, resName);
  let RelationshipArray = resContent["Relationships"]["Relationship"];
  //console.log("RelationshipArray: " , RelationshipArray)
  let layoutFilename = "";
  let diagramFilename = "";
  const slideResObj = {};
  if (RelationshipArray.constructor === Array) {
    for (var i = 0; i < RelationshipArray.length; i++) {
      switch (RelationshipArray[i]["attrs"]["Type"]) {
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout":
          layoutFilename = RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/");
          break;
        case "http://schemas.microsoft.com/office/2007/relationships/diagramDrawing":
          diagramFilename = RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/");
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          slideResObj[RelationshipArray[i]["attrs"]["Id"]] = {
            type: RelationshipArray[i]["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/"),
          };
          break;
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide":
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image":
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart":
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink":
        default:
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          slideResObj[RelationshipArray[i]["attrs"]["Id"]] = {
            type: RelationshipArray[i]["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/"),
          };
      }
    }
  } else {
    layoutFilename = RelationshipArray["attrs"]["Target"].replace("../", "ppt/");
  }
  //console.log(slideResObj);
  // Open slideLayoutXX.xml
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const slideLayoutContent = readXmlFile(archive, layoutFilename);
  const slideLayoutTables = indexNodes(slideLayoutContent);
  const sldLayoutClrOvr = getTextByPathList(slideLayoutContent, [
    "p:sldLayout",
    "p:clrMapOvr",
    "a:overrideClrMapping",
  ]);

  //console.log(slideLayoutClrOvride);
  let slideLayoutClrOvride;
  if (sldLayoutClrOvr !== undefined) {
    slideLayoutClrOvride = sldLayoutClrOvr["attrs"];
  }
  // =====< Step 2 >=====
  // Read slide master filename of the slidelayout (Get slideMasterXX.xml)
  // @resName: ppt/slideLayouts/slideLayout1.xml
  // @masterName: ppt/slideLayouts/_rels/slideLayout1.xml.rels
  const slideLayoutResFilename =
    layoutFilename.replace("slideLayouts/slideLayout", "slideLayouts/_rels/slideLayout") + ".rels";
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const slideLayoutResContent = readXmlFile(archive, slideLayoutResFilename);
  RelationshipArray = slideLayoutResContent["Relationships"]["Relationship"];
  let masterFilename = "";
  const layoutResObj = {};
  if (RelationshipArray.constructor === Array) {
    for (var i = 0; i < RelationshipArray.length; i++) {
      switch (RelationshipArray[i]["attrs"]["Type"]) {
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster":
          masterFilename = RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/");
          break;
        default:
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          layoutResObj[RelationshipArray[i]["attrs"]["Id"]] = {
            type: RelationshipArray[i]["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/"),
          };
      }
    }
  } else {
    masterFilename = RelationshipArray["attrs"]["Target"].replace("../", "ppt/");
  }
  // Open slideMasterXX.xml
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const slideMasterContent = readXmlFile(archive, masterFilename);
  const slideMasterTextStyles = getTextByPathList(slideMasterContent, [
    "p:sldMaster",
    "p:txStyles",
  ]);
  const slideMasterTables = indexNodes(slideMasterContent);

  /////////////////Amir/////////////
  //Open slideMasterXX.xml.rels
  const slideMasterResFilename =
    masterFilename.replace("slideMasters/slideMaster", "slideMasters/_rels/slideMaster") + ".rels";
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const slideMasterResContent = readXmlFile(archive, slideMasterResFilename);
  RelationshipArray = slideMasterResContent["Relationships"]["Relationship"];
  var themeFilename = "";
  const masterResObj = {};
  if (RelationshipArray.constructor === Array) {
    for (var i = 0; i < RelationshipArray.length; i++) {
      switch (RelationshipArray[i]["attrs"]["Type"]) {
        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme":
          themeFilename = RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/");
          break;
        default:
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          masterResObj[RelationshipArray[i]["attrs"]["Id"]] = {
            type: RelationshipArray[i]["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/"),
          };
      }
    }
  } else {
    themeFilename = RelationshipArray["attrs"]["Target"].replace("../", "ppt/");
  }
  //console.log(themeFilename)
  //Load Theme file
  const themeResObj = {};
  if (themeFilename !== undefined) {
    const themeName = themeFilename.split("/").pop();
    // @ts-expect-error TS(2769): No overload matches this call.
    const themeResFileName = themeFilename.replace(themeName, "_rels/" + themeName) + ".rels";
    //console.log("themeFilename: ", themeFilename, ", themeName: ", themeName, ", themeResFileName: ", themeResFileName)
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    var themeContent = readXmlFile(archive, themeFilename);
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const themeResContent = readXmlFile(archive, themeResFileName);
    if (themeResContent !== null) {
      var relationshipArray = themeResContent["Relationships"]["Relationship"];
      if (relationshipArray !== undefined) {
        var themeFilename = "";
        if (relationshipArray.constructor === Array) {
          for (var i = 0; i < relationshipArray.length; i++) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            themeResObj[relationshipArray[i]["attrs"]["Id"]] = {
              type: relationshipArray[i]["attrs"]["Type"].replace(
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
                ""
              ),
              target: relationshipArray[i]["attrs"]["Target"].replace("../", "ppt/"),
            };
          }
        } else {
          //console.log("theme relationshipArray : ", relationshipArray)
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          themeResObj[relationshipArray["attrs"]["Id"]] = {
            type: relationshipArray["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: relationshipArray["attrs"]["Target"].replace("../", "ppt/"),
          };
        }
      }
    }
  }
  //Load diagram file
  const diagramResObj = {};
  let digramFileContent = {};
  if (diagramFilename !== undefined) {
    const diagName = diagramFilename.split("/").pop();
    // @ts-expect-error TS(2769): No overload matches this call.
    const diagramResFileName = diagramFilename.replace(diagName, "_rels/" + diagName) + ".rels";
    //console.log("diagramFilename: ", diagramFilename, ", themeName: ", themeName, ", diagramResFileName: ", diagramResFileName)
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    digramFileContent = readXmlFile(archive, diagramFilename);
    if (digramFileContent !== null && digramFileContent !== undefined && digramFileContent != "") {
      let digramFileContentObjToStr = JSON.stringify(digramFileContent);
      digramFileContentObjToStr = digramFileContentObjToStr.replace(/dsp:/g, "p:");
      digramFileContent = JSON.parse(digramFileContentObjToStr);
    }

    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    const digramResContent = readXmlFile(archive, diagramResFileName);
    if (digramResContent !== null) {
      var relationshipArray = digramResContent["Relationships"]["Relationship"];
      var themeFilename = "";
      if (relationshipArray.constructor === Array) {
        for (var i = 0; i < relationshipArray.length; i++) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          diagramResObj[relationshipArray[i]["attrs"]["Id"]] = {
            type: relationshipArray[i]["attrs"]["Type"].replace(
              "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
              ""
            ),
            target: relationshipArray[i]["attrs"]["Target"].replace("../", "ppt/"),
          };
        }
      } else {
        //console.log("theme relationshipArray : ", relationshipArray)
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        diagramResObj[relationshipArray["attrs"]["Id"]] = {
          type: relationshipArray["attrs"]["Type"].replace(
            "http://schemas.openxmlformats.org/officeDocument/2006/relationships/",
            ""
          ),
          target: relationshipArray["attrs"]["Target"].replace("../", "ppt/"),
        };
      }
    }
  }
  //console.log("diagramResObj: " , diagramResObj)
  // =====< Step 3 >=====
  const slideContent = readXmlFile(archive, sldFileName, true, slideSize.appVersion);
  const nodes = slideContent["p:sld"]["p:cSld"]["p:spTree"];
  const warpObj = {
    archive: archive,
    slideLayoutContent: slideLayoutContent,
    slideLayoutTables: slideLayoutTables,
    slideMasterContent: slideMasterContent,
    slideMasterTables: slideMasterTables,
    slideContent: slideContent,
    slideResObj: slideResObj,
    slideMasterTextStyles: slideMasterTextStyles,
    layoutResObj: layoutResObj,
    masterResObj: masterResObj,
    themeContent: themeContent,
    themeResObj: themeResObj,
    digramFileContent: digramFileContent,
    diagramResObj: diagramResObj,
    defaultTextStyle: defaultTextStyle,
  };
  let bgResult = "";
  if (settings.themeProcess === true) {
    bgResult = getBackground(
      warpObj,
      slideSize,
      index,
      tableStyles,
      isFirstBr,
      styleTable,
      rtlLangsArray,
      slideFactor,
      fontSizeFactor,
      chartID,
      MsgQueue,
      settings,
      processNodesInSlide,
      processSpNode,
      processCxnSpNode,
      processPicNode,
      processGraphicFrameNode,
      processGroupSpNode,
      genShape,
      genTable,
      genChart,
      genDiagram
    );
  }

  let bgColor = "";
  if (settings.themeProcess === "colorsAndImageOnly") {
    const fillResult = getSlideBackgroundFill(warpObj, index);
    bgColor = fillResult !== undefined ? fillResult : "";
  }

  if (settings.slideMode && settings.slideType == "revealjs") {
    var result =
      "<section class='slide' style='width:" +
      slideSize.width +
      "px; height:" +
      slideSize.height +
      "px;" +
      bgColor +
      "'>";
  } else {
    var result =
      "<div class='slide' style='width:" +
      slideSize.width +
      "px; height:" +
      slideSize.height +
      "px;" +
      bgColor +
      "'>";
  }
  result += bgResult;
  for (const nodeKey in nodes) {
    if (nodes[nodeKey].constructor === Array) {
      for (var i = 0; i < nodes[nodeKey].length; i++) {
        result += processNodesInSlide(
          nodeKey,
          nodes[nodeKey][i],
          nodes,
          warpObj,
          "slide",
          undefined,
          tableStyles,
          isFirstBr,
          styleTable,
          rtlLangsArray,
          slideFactor,
          fontSizeFactor,
          chartID,
          MsgQueue,
          settings
        );
      }
    } else {
      result += processNodesInSlide(
        nodeKey,
        nodes[nodeKey],
        nodes,
        warpObj,
        "slide",
        undefined,
        tableStyles,
        isFirstBr,
        styleTable,
        rtlLangsArray,
        slideFactor,
        fontSizeFactor,
        chartID,
        MsgQueue,
        settings
      );
    }
  }
  if (settings.slideMode && settings.slideType == "revealjs") {
    return result + "</div></section>";
  } else {
    return result + "</div></div>";
  }
}
