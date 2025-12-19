import { getTextByPathList } from "../object/get-text-by-path-list";
import { getSolidFill } from "../color/get-solid-fill";
import { getPicFill } from "./get-pic-fill";

/**
 * Extracts background picture fill with advanced styling options
 *
 * Handles complex background image fills with:
 * - Duotone color effects (a:duotone)
 * - Alpha transparency adjustments (a:alphaModFix)
 * - Tiling options with scale and offset (a:tile)
 * - Stretch options with fill rectangles (a:stretch)
 * - Z-index ordering for layered backgrounds
 *
 * Converts PPTX blip fill settings to CSS background properties including
 * background-image, background-repeat, background-position, and opacity.
 *
 * @param bgPr - Background properties node from PPTX
 * @param sorce - Source type (slide, slideLayoutBg, etc.)
 * @param warpObj - Container object with ZIP file and resources
 * @param phClr - Placeholder color for theme color resolution
 * @param index - Slide index for CSS class naming
 * @returns CSS background style string with z-index
 */
export function getBgPicFill(bgPr: any, sorce: any, warpObj: any, phClr: any, index: any): string {
  var bgcolor;
  var picFillBase64 = getPicFill(sorce, bgPr["a:blipFill"], warpObj);
  var ordr = bgPr["attrs"]["order"];
  var aBlipNode = bgPr["a:blipFill"]["a:blip"];

  var duotone = getTextByPathList(aBlipNode, ["a:duotone"]);
  if (duotone !== undefined) {
    var clr_ary = [];
    Object.keys(duotone).forEach(function (clr_type) {
      if (clr_type != "attrs") {
        var obj = {};
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        obj[clr_type] = duotone[clr_type];
        clr_ary.push(getSolidFill(obj, undefined, phClr, warpObj));
      }
    })
  }

  var aphaModFixNode = getTextByPathList(aBlipNode, ["a:alphaModFix", "attrs"])
  var imgOpacity = "";
  if (aphaModFixNode !== undefined && aphaModFixNode["amt"] !== undefined && aphaModFixNode["amt"] != "") {
    var amt = parseInt(aphaModFixNode["amt"]) / 100000;
    imgOpacity = "opacity:" + amt + ";";
  }

  var tileNode = getTextByPathList(bgPr, ["a:blipFill", "a:tile", "attrs"])
  var prop_style = "";
  if (tileNode !== undefined && tileNode["sx"] !== undefined) {
    var sx = (parseInt(tileNode["sx"]) / 100000);
    var sy = (parseInt(tileNode["sy"]) / 100000);
    var tx = (parseInt(tileNode["tx"]) / 100000);
    var ty = (parseInt(tileNode["ty"]) / 100000);
    var algn = tileNode["algn"];
    var flip = tileNode["flip"];

    prop_style += "background-repeat: round;";
  }

  var stretch = getTextByPathList(bgPr, ["a:blipFill", "a:stretch"]);
  if (stretch !== undefined) {
    var fillRect = getTextByPathList(stretch, ["a:fillRect", "attrs"]);
    prop_style += "background-repeat: no-repeat;";
    prop_style += "background-position: center;";
    if (fillRect !== undefined) {
      prop_style += "background-size:  100% 100%;;";
    }
  }
  bgcolor = "background: url(" + picFillBase64 + ");  z-index: " + ordr + ";" + prop_style + imgOpacity;

  return bgcolor;
}
