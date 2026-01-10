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
 * @param settings - Plugin settings
 * @returns HTML string for the group
 */
export function processGroupSpNode(
  node: unknown,
  warpObj: unknown,
  source: string,
  slideFactor: number,
  tableStyles: unknown,
  isFirstBr: { value: boolean },
  styleTable: unknown,
  rtlLangsArray: string[],
  fontSizeFactor: number,
  chartID: { value: number },
  MsgQueue: unknown,
  settings: { mediaProcess: boolean } & Record<string, unknown>
): string {
  //console.log("processGroupSpNode: node: ", node)
  const nodeRecord = node as Record<string, unknown>;
  const xfrmNode = getTextByPathList<Record<string, unknown>>(nodeRecord, ["p:grpSpPr", "a:xfrm"]);
  let rotStr = ""; //;" border: 3px solid black;";
  let top;
  let left;
  let width;
  let height;
  let sType = "group";
  if (xfrmNode !== undefined) {
    const xfrmOffAttrs = (xfrmNode["a:off"] as Record<string, unknown>)["attrs"] as Record<
      string,
      string
    >;
    const xfrmChOffAttrs = (xfrmNode["a:chOff"] as Record<string, unknown>)["attrs"] as Record<
      string,
      string
    >;
    const xfrmExtAttrs = (xfrmNode["a:ext"] as Record<string, unknown>)["attrs"] as Record<
      string,
      string
    >;
    const xfrmChExtAttrs = (xfrmNode["a:chExt"] as Record<string, unknown>)["attrs"] as Record<
      string,
      string
    >;
    const x = parseInt(xfrmOffAttrs["x"]) * slideFactor;
    const y = parseInt(xfrmOffAttrs["y"]) * slideFactor;
    const chx = parseInt(xfrmChOffAttrs["x"]) * slideFactor;
    const chy = parseInt(xfrmChOffAttrs["y"]) * slideFactor;
    const cx = parseInt(xfrmExtAttrs["cx"]) * slideFactor;
    const cy = parseInt(xfrmExtAttrs["cy"]) * slideFactor;
    const chcx = parseInt(xfrmChExtAttrs["cx"]) * slideFactor;
    const chcy = parseInt(xfrmChExtAttrs["cy"]) * slideFactor;
    let rotate = parseInt((xfrmNode["attrs"] as Record<string, string>)["rot"]);
    // angleToDegrees(getTextByPathList(slideXfrmNode, ["attrs", "rot"]));
    // var rotX = 0;
    // var rotY = 0;
    top = y - chy;
    left = x - chx;
    width = cx - chcx;
    height = cy - chcy;
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
  const order = (nodeRecord["attrs"] as Record<string, string | number>)["order"];

  let result =
    "<div class='block group' style='z-index: " +
    order +
    ";" +
    grpStyle +
    " border:1px solid red;'>";

  // Procsee all child nodes
  for (const nodeKey in nodeRecord) {
    const child = nodeRecord[nodeKey] as Record<string, unknown> | Array<Record<string, unknown>>;
    if (Array.isArray(child)) {
      for (let i = 0; i < child.length; i++) {
        result += processNodesInSlide(
          nodeKey,
          child[i],
          nodeRecord,
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
        child,
        nodeRecord,
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
