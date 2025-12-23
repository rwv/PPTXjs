import type { PptxNode, WarpObject, SlideFactor, FontSizeFactor } from "../../types";
import { getTextByPathList } from "../object";
import { readXmlFile } from "../xml";
import { getPosition, getSize } from "../layout";
import { processSpNode } from "../node";

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
 * @param node - Diagram node (dgm:relIds containing file references)
 * @param warpObj - Warp object containing zip, slideResObj, digramFileContent
 * @param source - Source context (e.g., "diagramBg")
 * @param sType - Shape type context
 * @param slideFactor - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeFactor - Font size scaling factor
 * @param rtlLangsArray - Array of RTL language codes
 * @param isFirstBr - Mutable object tracking first line break state
 * @returns HTML string for the diagram
 */
export function genDiagram(
  node: PptxNode,
  warpObj: WarpObject,
  source: any,
  sType: any,
  slideFactor: SlideFactor,
  styleTable: any,
  fontSizeFactor: FontSizeFactor,
  rtlLangsArray: string[],
  isFirstBr: { value: boolean }
): string {
  //console.log(warpObj)
  //readXmlFile(archive, sldFileName)
  /**files define the diagram:
   * 1-colors#.xml,
   * 2-data#.xml,
   * 3-layout#.xml,
   * 4-quickStyle#.xml.
   * 5-drawing#.xml, which Microsoft added as an extension for persisting diagram layout information.
   */
  ///get colors#.xml, data#.xml , layout#.xml , quickStyle#.xml
  const _order = node["attrs"]["order"];
  const archive = warpObj["archive"];
  const xfrmNode = getTextByPathList(node, ["p:xfrm"]);
  const dgmRelIds = getTextByPathList(node, ["a:graphic", "a:graphicData", "dgm:relIds", "attrs"]);
  //console.log(dgmRelIds)
  const dgmClrFileId = dgmRelIds["r:cs"];
  const dgmDataFileId = dgmRelIds["r:dm"];
  const dgmLayoutFileId = dgmRelIds["r:lo"];
  const dgmQuickStyleFileId = dgmRelIds["r:qs"];
  const dgmClrFileName = warpObj["slideResObj"][dgmClrFileId].target,
    dgmDataFileName = warpObj["slideResObj"][dgmDataFileId].target,
    dgmLayoutFileName = warpObj["slideResObj"][dgmLayoutFileId].target,
    dgmQuickStyleFileName = warpObj["slideResObj"][dgmQuickStyleFileId].target;
  //console.log("dgmClrFileName: " , dgmClrFileName,", dgmDataFileName: ",dgmDataFileName,", dgmLayoutFileName: ",dgmLayoutFileName,", dgmQuickStyleFileName: ",dgmQuickStyleFileName);
  const _dgmClr = readXmlFile(archive, dgmClrFileName);
  const _dgmData = readXmlFile(archive, dgmDataFileName);
  const _dgmLayout = readXmlFile(archive, dgmLayoutFileName);
  const _dgmQuickStyle = readXmlFile(archive, dgmQuickStyleFileName);
  //console.log(_dgmClr,_dgmData,_dgmLayout,_dgmQuickStyle)
  ///get drawing#.xml
  // var dgmDrwFileName = "";
  // var dataModelExt = getTextByPathList(dgmData, ["dgm:dataModel", "dgm:extLst", "a:ext", "dsp:dataModelExt", "attrs"]);
  // if (dataModelExt !== undefined) {
  //     var dgmDrwFileId = dataModelExt["relId"];
  //     dgmDrwFileName = warpObj["slideResObj"][dgmDrwFileId]["target"];
  // }
  // var dgmDrwFile = "";
  // if (dgmDrwFileName !== "") {
  //     dgmDrwFile = readXmlFile(archive, dgmDrwFileName);
  // }
  // var dgmDrwSpArray = getTextByPathList(dgmDrwFile, ["dsp:drawing", "dsp:spTree", "dsp:sp"]);
  //var dgmDrwSpArray = getTextByPathList(warpObj["digramFileContent"], ["dsp:drawing", "dsp:spTree", "dsp:sp"]);
  const dgmDrwSpArray = getTextByPathList(warpObj["digramFileContent"], [
    "p:drawing",
    "p:spTree",
    "p:sp",
  ]);
  let rslt = "";
  if (dgmDrwSpArray !== undefined) {
    const dgmDrwSpArrayLen = dgmDrwSpArray.length;
    for (let i = 0; i < dgmDrwSpArrayLen; i++) {
      const dspSp = dgmDrwSpArray[i];
      // var dspSpObjToStr = JSON.stringify(dspSp);
      // var pSpStr = dspSpObjToStr.replace(/dsp:/g, "p:");
      // var pSpStrToObj = JSON.parse(pSpStr);
      //console.log("pSpStrToObj[" + i + "]: ", pSpStrToObj);
      //rslt += processSpNode(pSpStrToObj, node, warpObj, "diagramBg", sType)
      rslt += processSpNode(
        dspSp,
        node,
        warpObj,
        "diagramBg",
        sType,
        slideFactor,
        styleTable,
        fontSizeFactor,
        rtlLangsArray,
        isFirstBr
      );
    }
    // dgmDrwFile: "dsp:"-> "p:"
  }

  return (
    "<div class='block diagram-content' style='" +
    getPosition(xfrmNode, node, undefined, undefined, sType, slideFactor) +
    getSize(xfrmNode, undefined, undefined, slideFactor) +
    "'>" +
    rslt +
    "</div>"
  );
}
