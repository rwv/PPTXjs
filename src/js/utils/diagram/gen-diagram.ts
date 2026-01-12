import { getTextByPathList } from "../object";
import { getPosition, getSize } from "../layout";
import { processSpNode } from "../node";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

type DiagramWarpContext = WarpContext & { digramFileContent?: XmlNode };
type TransformNode = XmlNode;
type ExtentNode = XmlNode;

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isXmlNodeArray(value: XmlValue): value is XmlNode[] {
  return Array.isArray(value);
}

/**
 * Generate HTML for SmartArt diagram
 *
 * SmartArt diagrams are defined by multiple XML files:
 * 1. colors#.xml - Color scheme
 * 2. data#.xml - Diagram data and structure
 * 3. layout#.xml - Layout definition
 * 4. quickStyle#.xml - Quick style settings
 * 5. drawing#.xml - Persisted layout information (Microsoft extension)
 *
 * This function:
 * - Reads the diagram definition files from the PPTX archive
 * - Extracts diagram shape array from drawing data
 * - Processes each shape using processSpNode
 * - Returns HTML div with positioned diagram content
 *
 * @param diagramNode - Diagram node (dgm:relIds containing file references)
 * @param warpContext - Warp object containing zip, slideResObj, digramFileContent
 * @param shapeType - Shape type context
 * @param emuToPx - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeFactor - Font size scaling factor
 * @param rtlLanguages - Array of RTL language codes
 * @param firstLineBreak - Mutable object tracking first line break state
 * @returns HTML string for the diagram
 */
type GenDiagramOptions = {
  diagramNode: XmlNode;
  warpContext: DiagramWarpContext;
  shapeType: string;
  emuToPx: number;
  styleTable: unknown;
  fontSizeFactor: number;
  rtlLanguages: string[];
  firstLineBreak: { value: boolean };
};

export async function genDiagram({
  diagramNode,
  warpContext,
  shapeType,
  emuToPx,
  styleTable,
  fontSizeFactor,
  rtlLanguages,
  firstLineBreak,
}: GenDiagramOptions): Promise<string> {
  //console.log(warpContext)
  const diagramNodeRecord = diagramNode;
  //readXmlFile(archive, sldFileName)
  /**files define the diagram:
   * 1-colors#.xml,
   * 2-data#.xml,
   * 3-layout#.xml,
   * 4-quickStyle#.xml.
   * 5-drawing#.xml, which Microsoft added as an extension for persisting diagram layout information.
   */
  ///get colors#.xml, data#.xml , layout#.xml , quickStyle#.xml
  const transformNodeValue = getTextByPathList({ node: diagramNodeRecord, path: ["p:xfrm"] });
  const transformNode = isXmlNode(transformNodeValue)
    ? (transformNodeValue as TransformNode)
    : undefined;
  const extentNode = transformNode as ExtentNode | undefined;
  //console.log(dgmClr,dgmData,dgmLayout,dgmQuickStyle)
  ///get drawing#.xml
  // var dgmDrwFileName = "";
  // var dataModelExt = getTextByPathList({ node: dgmData, path: ["dgm:dataModel", "dgm:extLst", "a:ext", "dsp:dataModelExt", "attrs"] });
  // if (dataModelExt !== undefined) {
  //     var dgmDrwFileId = dataModelExt["relId"];
  //     dgmDrwFileName = warpObj["slideResObj"][dgmDrwFileId]["target"];
  // }
  // var dgmDrwFile = "";
  // if (dgmDrwFileName != "") {
  //     dgmDrwFile = readXmlFile(archive, dgmDrwFileName);
  // }
  // var dgmDrwSpArray = getTextByPathList({ node: dgmDrwFile, path: ["dsp:drawing", "dsp:spTree", "dsp:sp"] });
  //var dgmDrwSpArray = getTextByPathList({ node: warpContext["digramFileContent"], path: ["dsp:drawing", "dsp:spTree", "dsp:sp"] });
  const diagramShapeNodes = getTextByPathList({
    node: (warpContext.digramFileContent ?? {}) as XmlNode,
    path: ["p:drawing", "p:spTree", "p:sp"],
  });
  let diagramHtml = "";
  if (diagramShapeNodes !== undefined && isXmlNodeArray(diagramShapeNodes)) {
    const diagramShapeCount = diagramShapeNodes.length;
    for (let i = 0; i < diagramShapeCount; i++) {
      const diagramShapeNode = diagramShapeNodes[i];
      // var dspSpObjToStr = JSON.stringify(dspSp);
      // var pSpStr = dspSpObjToStr.replace(/dsp:/g, "p:");
      // var pSpStrToObj = JSON.parse(pSpStr);
      //console.log("pSpStrToObj[" + i + "]: ", pSpStrToObj);
      //rslt += processSpNode(pSpStrToObj, node, warpObj, "diagramBg", sType)
      diagramHtml += await processSpNode({
        spNode: diagramShapeNode,
        parentNodes: diagramNodeRecord,
        warpContext,
        sourceType: "diagramBg",
        shapeType,
        emuToPx,
        styleTable,
        fontSizeScale: fontSizeFactor,
        rtlLanguages,
        firstLineBreak,
      });
    }
    // dgmDrwFile: "dsp:"-> "p:"
  }

  return (
    "<div class='block diagram-content' style='" +
    getPosition({
      slideSpNode: transformNode,
      parentNode: diagramNodeRecord,
      slideLayoutSpNode: undefined,
      slideMasterSpNode: undefined,
      shapeType,
      emuToPx,
    }) +
    getSize({
      slideSpNode: extentNode,
      slideLayoutSpNode: undefined,
      slideMasterSpNode: undefined,
      emuToPx,
    }) +
    "'>" +
    diagramHtml +
    "</div>"
  );
}
