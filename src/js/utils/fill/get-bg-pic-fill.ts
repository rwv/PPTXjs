import { getTextByPathList } from "../object/get-text-by-path-list";
import { getSolidFill } from "../color/get-solid-fill";
import { getPicFill } from "./get-pic-fill";

type PicFillWarpObj = Parameters<typeof getPicFill>[2];
type SolidFillNode = Parameters<typeof getSolidFill>[0];

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
 * @returns CSS background style string with z-index
 */
export async function getBgPicFill(
  bgPr: Record<string, unknown>,
  sorce: string,
  warpObj: Record<string, unknown>,
  phClr: string | undefined
): Promise<string> {
  const blipFillNode = bgPr["a:blipFill"] as Record<string, unknown>;
  const picFillBase64 = await getPicFill(sorce, blipFillNode, warpObj as PicFillWarpObj);
  const ordr = (bgPr["attrs"] as Record<string, string | number>)["order"];
  const aBlipNode = getTextByPathList<Record<string, unknown>>(bgPr, ["a:blipFill", "a:blip"]);

  const duotone = getTextByPathList<Record<string, unknown>>(aBlipNode, ["a:duotone"]);
  if (duotone !== undefined) {
    const clr_ary: Array<string | undefined> = [];
    Object.keys(duotone).forEach(function (clr_type) {
      if (clr_type !== "attrs") {
        const obj: Record<string, unknown> = {};
        obj[clr_type] = duotone[clr_type];
        clr_ary.push(getSolidFill(obj as SolidFillNode, undefined, phClr, warpObj));
      }
    });
  }

  const aphaModFixNode = getTextByPathList<Record<string, string>>(aBlipNode, [
    "a:alphaModFix",
    "attrs",
  ]);
  let imgOpacity = "";
  if (
    aphaModFixNode !== undefined &&
    aphaModFixNode["amt"] !== undefined &&
    aphaModFixNode["amt"] !== ""
  ) {
    const amt = parseInt(aphaModFixNode["amt"]) / 100000;
    imgOpacity = "opacity:" + amt + ";";
  }

  const tileNode = getTextByPathList<Record<string, string>>(bgPr, [
    "a:blipFill",
    "a:tile",
    "attrs",
  ]);
  let prop_style = "";
  if (tileNode !== undefined && tileNode["sx"] !== undefined) {
    prop_style += "background-repeat: round;";
  }

  const stretch = getTextByPathList<Record<string, unknown>>(bgPr, ["a:blipFill", "a:stretch"]);
  if (stretch !== undefined) {
    const fillRect = getTextByPathList<Record<string, string>>(stretch, ["a:fillRect", "attrs"]);
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
