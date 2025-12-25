import type { PptxNode, WarpObject, SlideFactor, FontSizeFactor, PptxSettings } from "../../types";
import { getTextByPathList } from "../object";
import { angleToDegrees } from "../layout";
import { processNodesInSlide } from "./process-nodes-in-slide";

/**
 * Process group shape node (p:grpSp) to generate HTML
 *
 * Group shapes are containers that hold multiple child shapes together.
 * They have their own transform properties that affect all children.
 *
 * Processes group transforms:
 * - Position offset (a:off) and child offset (a:chOff)
 * - Extents (a:ext) and child extents (a:chExt)
 * - Rotation with transform-origin at center
 *
 * Creates wrapper div with positioning and recursively processes children
 * via processNodesInSlide.
 *
 * @param node - Group shape node (p:grpSp)
 * @param warpObj - Warp object containing slide resources
 * @param source - Source context
 * @param slideFactor - EMU to pixel conversion factor
 * @param tableStyles - Table styles from presentation
 * @param isFirstBr - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLangsArray - RTL language codes
 * @param fontSizeFactor - Font size scaling factor
 * @param chartID - Chart ID counter
 * @param MsgQueue - Message queue for chart processing
 * @param settings - PPTXjs plugin settings
 * @returns HTML string for the group
 */
export function processGroupSpNode(
  node: PptxNode,
  warpObj: WarpObject,
  source: string,
  slideFactor: SlideFactor,
  tableStyles: PptxNode,
  isFirstBr: { value: boolean },
  styleTable: Record<string, { name: string; text: string }>,
  rtlLangsArray: string[],
  fontSizeFactor: FontSizeFactor,
  chartID: number,
  MsgQueue: any[],
  settings: PptxSettings
): string {
  //console.log("processGroupSpNode: node: ", node)
  // Declare variables outside the if block so they're accessible later
  let rotStr: string | undefined;
  let top: number | undefined;
  let left: number | undefined;
  let width: number | undefined;
  let height: number | undefined;
  let sType: string | undefined;

  const xfrmNode = getTextByPathList(node, ["p:grpSpPr", "a:xfrm"]);
  if (xfrmNode !== undefined) {
    const x = parseInt(xfrmNode["a:off"]["attrs"]["x"]) * slideFactor;
    const y = parseInt(xfrmNode["a:off"]["attrs"]["y"]) * slideFactor;
    const chx = parseInt(xfrmNode["a:chOff"]["attrs"]["x"]) * slideFactor;
    const chy = parseInt(xfrmNode["a:chOff"]["attrs"]["y"]) * slideFactor;
    const cx = parseInt(xfrmNode["a:ext"]["attrs"]["cx"]) * slideFactor;
    const cy = parseInt(xfrmNode["a:ext"]["attrs"]["cy"]) * slideFactor;
    const chcx = parseInt(xfrmNode["a:chExt"]["attrs"]["cx"]) * slideFactor;
    const chcy = parseInt(xfrmNode["a:chExt"]["attrs"]["cy"]) * slideFactor;
    let rotate = parseInt(xfrmNode["attrs"]["rot"]);
    rotStr = ""; //;" border: 3px solid black;";
    // angleToDegrees(getTextByPathList(slideXfrmNode, ["attrs", "rot"]));
    // var rotX = 0;
    // var rotY = 0;
    top = y - chy;
    left = x - chx;
    width = cx - chcx;
    height = cy - chcy;

    sType = "group";
    if (!isNaN(rotate)) {
      rotate = angleToDegrees(rotate);
      rotStr += "transform: rotate(" + rotate + "deg) ; transform-origin: center;";
      // var cLin = Math.sqrt(Math.pow((chy), 2) + Math.pow((chx), 2));
      // var rdian = degreesToRadians(rotate);
      // rotX = cLin * Math.cos(rdian);
      // rotY = cLin * Math.sin(rdian);
      if (rotate !== 0) {
        top = y;
        left = x;
        width = cx;
        height = cy;
        sType = "group-rotate";
      }
    }
  }
  let grpStyle = "";

  if (rotStr !== undefined && rotStr !== "") {
    grpStyle += rotStr;
  }

  if (top !== undefined) {
    grpStyle += "top: " + top + "px;";
  }
  if (left !== undefined) {
    grpStyle += "left: " + left + "px;";
  }
  if (width !== undefined) {
    grpStyle += "width:" + width + "px;";
  }
  if (height !== undefined) {
    grpStyle += "height: " + height + "px;";
  }
  const order = node["attrs"]["order"];

  let result =
    "<div class='block group' style='z-index: " +
    order +
    ";" +
    grpStyle +
    " border:1px solid red;'>";

  // Procsee all child nodes
  for (const nodeKey in node) {
    if (node[nodeKey].constructor === Array) {
      for (let i = 0; i < node[nodeKey].length; i++) {
        result += processNodesInSlide(
          nodeKey,
          node[nodeKey][i],
          node,
          warpObj,
          source,
          sType,
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
        node[nodeKey],
        node,
        warpObj,
        source,
        sType,
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

  result += "</div>";

  return result;
}
