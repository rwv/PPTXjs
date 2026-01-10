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
 * @param backgroundProps - Background properties node from PPTX
 * @param sourceType - Source type (slide, slideLayoutBg, etc.)
 * @param warpContext - Container object with ZIP file and resources
 * @param placeholderColor - Placeholder color for theme color resolution
 * @returns CSS background style string with z-index
 */
export async function getBgPicFill(
  backgroundProps: Record<string, unknown>,
  sourceType: string,
  warpContext: Record<string, unknown>,
  placeholderColor: string | undefined
): Promise<string> {
  const blipFillNode = backgroundProps["a:blipFill"] as Record<string, unknown>;
  const pictureFillDataUrl = await getPicFill(
    sourceType,
    blipFillNode,
    warpContext as PicFillWarpObj
  );
  const zIndexOrder = (backgroundProps["attrs"] as Record<string, string | number>)["order"];
  const blipNode = getTextByPathList<Record<string, unknown>>(backgroundProps, [
    "a:blipFill",
    "a:blip",
  ]);

  const duotoneNode = getTextByPathList<Record<string, unknown>>(blipNode, ["a:duotone"]);
  if (duotoneNode !== undefined) {
    const duotonePalette: Array<string | undefined> = [];
    Object.keys(duotoneNode).forEach(function (colorType) {
      if (colorType !== "attrs") {
        const colorNode: Record<string, unknown> = {};
        colorNode[colorType] = duotoneNode[colorType];
        duotonePalette.push(
          getSolidFill(colorNode as SolidFillNode, undefined, placeholderColor, warpContext)
        );
      }
    });
  }

  const alphaModFixNode = getTextByPathList<Record<string, string>>(blipNode, [
    "a:alphaModFix",
    "attrs",
  ]);
  let imageOpacityStyle = "";
  if (
    alphaModFixNode !== undefined &&
    alphaModFixNode["amt"] !== undefined &&
    alphaModFixNode["amt"] !== ""
  ) {
    const opacityAmount = parseInt(alphaModFixNode["amt"]) / 100000;
    imageOpacityStyle = "opacity:" + opacityAmount + ";";
  }

  const tileAttrs = getTextByPathList<Record<string, string>>(backgroundProps, [
    "a:blipFill",
    "a:tile",
    "attrs",
  ]);
  let backgroundCss = "";
  if (tileAttrs !== undefined && tileAttrs["sx"] !== undefined) {
    backgroundCss += "background-repeat: round;";
  }

  const stretchNode = getTextByPathList<Record<string, unknown>>(backgroundProps, [
    "a:blipFill",
    "a:stretch",
  ]);
  if (stretchNode !== undefined) {
    const fillRectAttrs = getTextByPathList<Record<string, string>>(stretchNode, [
      "a:fillRect",
      "attrs",
    ]);
    backgroundCss += "background-repeat: no-repeat;";
    backgroundCss += "background-position: center;";
    if (fillRectAttrs !== undefined) {
      backgroundCss += "background-size:  100% 100%;;";
    }
  }
  const composedCss =
    "background: url(" +
    pictureFillDataUrl +
    ");  z-index: " +
    zIndexOrder +
    ";" +
    backgroundCss +
    imageOpacityStyle;

  return composedCss;
}
