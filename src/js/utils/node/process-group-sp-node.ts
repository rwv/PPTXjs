import { getTextByPathList } from "../object";
import { angleToDegrees } from "../layout";

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
 * @param processNodesInSlide - Function to process child nodes
 * @returns HTML string for the group
 */
export function processGroupSpNode(
  node: any,
  warpObj: any,
  source: any,
  slideFactor: number,
  processNodesInSlide: any
): string {
  //console.log("processGroupSpNode: node: ", node)
  var xfrmNode = getTextByPathList(node, ["p:grpSpPr", "a:xfrm"]);
  if (xfrmNode !== undefined) {
    var x = parseInt(xfrmNode["a:off"]["attrs"]["x"]) * slideFactor;
    var y = parseInt(xfrmNode["a:off"]["attrs"]["y"]) * slideFactor;
    var chx = parseInt(xfrmNode["a:chOff"]["attrs"]["x"]) * slideFactor;
    var chy = parseInt(xfrmNode["a:chOff"]["attrs"]["y"]) * slideFactor;
    var cx = parseInt(xfrmNode["a:ext"]["attrs"]["cx"]) * slideFactor;
    var cy = parseInt(xfrmNode["a:ext"]["attrs"]["cy"]) * slideFactor;
    var chcx = parseInt(xfrmNode["a:chExt"]["attrs"]["cx"]) * slideFactor;
    var chcy = parseInt(xfrmNode["a:chExt"]["attrs"]["cy"]) * slideFactor;
    var rotate = parseInt(xfrmNode["attrs"]["rot"]);
    var rotStr = ""; //;" border: 3px solid black;";
    // angleToDegrees(getTextByPathList(slideXfrmNode, ["attrs", "rot"]));
    // var rotX = 0;
    // var rotY = 0;
    var top = y - chy,
      left = x - chx,
      width = cx - chcx,
      height = cy - chcy;

    var sType = "group";
    if (!isNaN(rotate)) {
      rotate = angleToDegrees(rotate);
      rotStr += "transform: rotate(" + rotate + "deg) ; transform-origin: center;";
      // var cLin = Math.sqrt(Math.pow((chy), 2) + Math.pow((chx), 2));
      // var rdian = degreesToRadians(rotate);
      // rotX = cLin * Math.cos(rdian);
      // rotY = cLin * Math.sin(rdian);
      if (rotate != 0) {
        top = y;
        left = x;
        width = cx;
        height = cy;
        sType = "group-rotate";
      }
    }
  }
  var grpStyle = "";

  // @ts-expect-error TS(2454): Variable 'rotStr' is used before being assigned.
  if (rotStr !== undefined && rotStr != "") {
    grpStyle += rotStr;
  }

  // @ts-expect-error TS(2454): Variable 'top' is used before being assigned.
  if (top !== undefined) {
    grpStyle += "top: " + top + "px;";
  }
  // @ts-expect-error TS(2454): Variable 'left' is used before being assigned.
  if (left !== undefined) {
    grpStyle += "left: " + left + "px;";
  }
  // @ts-expect-error TS(2454): Variable 'width' is used before being assigned.
  if (width !== undefined) {
    grpStyle += "width:" + width + "px;";
  }
  // @ts-expect-error TS(2454): Variable 'height' is used before being assigned.
  if (height !== undefined) {
    grpStyle += "height: " + height + "px;";
  }
  var order = node["attrs"]["order"];

  var result =
    "<div class='block group' style='z-index: " +
    order +
    ";" +
    grpStyle +
    " border:1px solid red;'>";

  // Procsee all child nodes
  for (var nodeKey in node) {
    if (node[nodeKey].constructor === Array) {
      for (var i = 0; i < node[nodeKey].length; i++) {
        // @ts-expect-error TS(2454): Variable 'sType' is used before being assigned.
        result += processNodesInSlide(nodeKey, node[nodeKey][i], node, warpObj, source, sType);
      }
    } else {
      // @ts-expect-error TS(2454): Variable 'sType' is used before being assigned.
      result += processNodesInSlide(nodeKey, node[nodeKey], node, warpObj, source, sType);
    }
  }

  result += "</div>";

  return result;
}
