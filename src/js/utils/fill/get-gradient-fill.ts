import { getSolidFill } from "../color/get-solid-fill";
import { angleToDegrees } from "../layout/angle-to-degrees";

/**
 * Extracts gradient fill information from PPTX node
 *
 * Parses gradient stop colors and rotation angle to create CSS linear gradient.
 * Handles multiple color stops (a:gs) and linear gradient direction (a:lin).
 *
 * @param node - Gradient fill node from PPTX (a:gradFill)
 * @param warpObj - Container object with theme and color information
 * @returns Object with color array and rotation angle for CSS gradient
 */
export function getGradientFill(node: any, warpObj: any) {
  var gsLst = node["a:gsLst"]["a:gs"];
  var color_ary = [];
  var tint_ary = [];
  for (var i = 0; i < gsLst.length; i++) {
    var lo_tint;
    var lo_color = getSolidFill(gsLst[i], undefined, undefined, warpObj);
    color_ary[i] = lo_color;
  }
  var lin = node["a:lin"];
  var rot = 0;
  if (lin !== undefined) {
    rot = angleToDegrees(lin["attrs"]["ang"]) + 90;
  }
  return {
    "color": color_ary,
    "rot": rot
  }
}
