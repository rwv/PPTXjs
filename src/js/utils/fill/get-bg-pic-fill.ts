import { getTextByPathList } from "../object/get-text-by-path-list";
import { getSolidFill } from "../color/get-solid-fill";
import { getPicFill } from "./get-pic-fill";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

type PicFillOptions = Parameters<typeof getPicFill>[0];
type PicFillWarpObj = PicFillOptions["warpContext"];
type SolidFillOptions = Parameters<typeof getSolidFill>[0];
type SolidFillNode = SolidFillOptions["fillNode"];

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type GetBgPicFillOptions = {
  backgroundProps: XmlNode;
  sourceType: string;
  warpContext: PicFillWarpObj;
  placeholderColor: string | undefined;
};

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
export async function getBgPicFill({
  backgroundProps,
  sourceType,
  warpContext,
  placeholderColor,
}: GetBgPicFillOptions): Promise<string> {
  const blipFillNodeValue = backgroundProps["a:blipFill"];
  const blipFillNode = isXmlNode(blipFillNodeValue) ? blipFillNodeValue : undefined;
  if (blipFillNode === undefined) {
    return "";
  }
  const pictureFillDataUrl = await getPicFill({ sourceType, blipFillNode, warpContext });
  const zIndexOrder = backgroundProps.attrs?.order;
  const blipNodeValue = getTextByPathList({
    node: backgroundProps,
    path: ["a:blipFill", "a:blip"],
  });
  const blipNode = blipNodeValue && isXmlNode(blipNodeValue) ? blipNodeValue : undefined;

  const duotoneNodeValue =
    blipNode !== undefined ? getTextByPathList({ node: blipNode, path: ["a:duotone"] }) : undefined;
  const duotoneNode =
    duotoneNodeValue && isXmlNode(duotoneNodeValue) ? duotoneNodeValue : undefined;
  if (duotoneNode !== undefined) {
    const duotonePalette: Array<string | undefined> = [];
    Object.keys(duotoneNode).forEach(function (colorType) {
      if (colorType !== "attrs") {
        const colorNode: XmlNode = {};
        colorNode[colorType] = duotoneNode[colorType];
        duotonePalette.push(
          getSolidFill({
            fillNode: colorNode as SolidFillNode,
            colorMap: undefined,
            placeholderColor,
            warpContext: warpContext as WarpContext,
          })
        );
      }
    });
  }

  const alphaModFixValue =
    blipNode !== undefined
      ? getTextByPathList({ node: blipNode, path: ["a:alphaModFix", "attrs"] })
      : undefined;
  const alphaModFixNode =
    alphaModFixValue && isXmlNode(alphaModFixValue) ? alphaModFixValue : undefined;
  let imageOpacityStyle = "";
  if (
    alphaModFixNode !== undefined &&
    alphaModFixNode["amt"] !== undefined &&
    alphaModFixNode["amt"] !== ""
  ) {
    const opacityAmount = parseInt(String(alphaModFixNode["amt"]), 10) / 100000;
    imageOpacityStyle = "opacity:" + opacityAmount + ";";
  }

  const tileAttrsValue = getTextByPathList({
    node: backgroundProps,
    path: ["a:blipFill", "a:tile", "attrs"],
  });
  const tileAttrs = tileAttrsValue && isXmlNode(tileAttrsValue) ? tileAttrsValue : undefined;
  let backgroundCss = "";
  if (tileAttrs !== undefined && tileAttrs["sx"] !== undefined) {
    backgroundCss += "background-repeat: round;";
  }

  const stretchNodeValue = getTextByPathList({
    node: backgroundProps,
    path: ["a:blipFill", "a:stretch"],
  });
  const stretchNode =
    stretchNodeValue && isXmlNode(stretchNodeValue) ? stretchNodeValue : undefined;
  if (stretchNode !== undefined) {
    const fillRectAttrsValue = getTextByPathList({
      node: stretchNode,
      path: ["a:fillRect", "attrs"],
    });
    const fillRectAttrs =
      fillRectAttrsValue && isXmlNode(fillRectAttrsValue) ? fillRectAttrsValue : undefined;
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
    String(zIndexOrder ?? "") +
    ";" +
    backgroundCss +
    imageOpacityStyle;

  return composedCss;
}
