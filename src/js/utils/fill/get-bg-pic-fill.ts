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
export function getBgPicFill(
  bgPr: any,
  sorce: string,
  warpObj: any,
  phClr: string | undefined,
  _index: number | string
): string {
  const picFillBase64 = getPicFill(sorce, bgPr["a:blipFill"], warpObj);
  const ordr = bgPr["attrs"]["order"];
  const aBlipNode = bgPr["a:blipFill"]["a:blip"];

  const duotone = getTextByPathList(aBlipNode, ["a:duotone"]);
  if (duotone !== undefined) {
    const clr_ary = [];
    Object.keys(duotone).forEach(function (clr_type) {
      if (clr_type !== "attrs") {
        const obj = {};
        obj[clr_type] = duotone[clr_type];
        clr_ary.push(getSolidFill(obj, undefined, phClr, warpObj));
      }
    });
  }

  const aphaModFixNode = getTextByPathList(aBlipNode, ["a:alphaModFix", "attrs"]);
  let imgOpacity = "";
  if (
    aphaModFixNode !== undefined &&
    aphaModFixNode["amt"] !== undefined &&
    aphaModFixNode["amt"] !== ""
  ) {
    const amt = parseInt(aphaModFixNode["amt"]) / 100000;
    imgOpacity = "opacity:" + amt + ";";
  }

  const tileNode = getTextByPathList(bgPr, ["a:blipFill", "a:tile", "attrs"]);
  let prop_style = "";
  if (tileNode !== undefined && tileNode["sx"] !== undefined) {
    prop_style += "background-repeat: round;";
  }

  const stretch = getTextByPathList(bgPr, ["a:blipFill", "a:stretch"]);
  if (stretch !== undefined) {
    const fillRect = getTextByPathList(stretch, ["a:fillRect", "attrs"]);
    prop_style += "background-repeat: no-repeat;";
    prop_style += "background-position: center;";
    if (fillRect !== undefined) {
      prop_style += "background-size:  100% 100%;;";
    }
  }
  const bgcolor =
    "background: url(" + picFillBase64 + ");  z-index: " + ordr + ";" + prop_style + imgOpacity;

  return bgcolor;
}
