/**
 * Get SVG image pattern for shape fills
 *
 * @param shapeNode - The XML node containing blip fill properties
 * @param imageDataUrl - The base64 image data
 * @param shapeId - Shape ID for unique pattern naming
 * @param warpContext - The warp object containing theme and other resources
 * @returns SVG pattern element string
 */
import { getTextByPathList } from "../object";
import { getSolidFill } from "../color/get-solid-fill";
import { getBase64ImageDimensions } from "../media/get-base64-image-dimensions";
import { escapeHtml } from "../string/escape-html";
import tinycolor from "tinycolor2";
import type { WarpContext, XmlAttrs, XmlNode } from "../../types/pptx-xml";

type RgbColor = { r: number; g: number; b: number; a?: number };

export function getSvgImagePattern(
  shapeNode: XmlNode,
  imageDataUrl: string,
  shapeId: string | number,
  warpContext: WarpContext
): string {
  const imageDimensions = getBase64ImageDimensions(imageDataUrl);
  const width = imageDimensions?.[0];
  const height = imageDimensions?.[1];

  const blipFillNode = getTextByPathList<XmlNode>(shapeNode, ["p:spPr", "a:blipFill"]);
  if (blipFillNode === undefined) {
    return "";
  }
  const tileAttrs = getTextByPathList<XmlAttrs>(blipFillNode, ["a:tile", "attrs"]);
  let tileWidth: number | undefined;
  let tileHeight: number | undefined;

  const tileScaleX = tileAttrs?.["sx"];
  const tileScaleY = tileAttrs?.["sy"];
  if (
    tileAttrs !== undefined &&
    tileScaleX !== undefined &&
    tileScaleY !== undefined &&
    width &&
    height
  ) {
    tileWidth = (Number(tileScaleX) / 100000) * width;
    tileHeight = (Number(tileScaleY) / 100000) * height;
  }

  const blipNode = getTextByPathList<XmlNode>(blipFillNode, ["a:blip"]);
  const alphaModFixNode =
    blipNode !== undefined
      ? getTextByPathList<XmlAttrs>(blipNode, ["a:alphaModFix", "attrs"])
      : undefined;
  let imageOpacityAttr = "";

  const alphaAmount = alphaModFixNode?.["amt"];
  if (alphaAmount !== undefined && alphaAmount !== "") {
    const opacityAmount = Number(alphaAmount) / 100000;
    const opacity = opacityAmount;
    imageOpacityAttr = "opacity='" + opacity + "'";
  }

  let patternMarkup: string;
  if (tileWidth !== undefined && tileWidth !== 0) {
    patternMarkup =
      '<pattern id="imgPtrn_' +
      shapeId +
      '" x="0" y="0"  width="' +
      tileWidth +
      '" height="' +
      tileHeight +
      '" patternUnits="userSpaceOnUse">';
  } else {
    patternMarkup =
      '<pattern id="imgPtrn_' +
      shapeId +
      '"  patternContentUnits="objectBoundingBox"  width="1" height="1">';
  }

  const duotoneNode =
    blipNode !== undefined ? getTextByPathList<XmlNode>(blipNode, ["a:duotone"]) : undefined;
  let filterMarkup = "";
  let filterAttr = "";

  if (duotoneNode !== undefined) {
    const duotoneColors: RgbColor[] = [];
    Object.keys(duotoneNode).forEach(function (colorType) {
      if (colorType !== "attrs") {
        const colorNode: XmlNode = {};
        colorNode[colorType] = duotoneNode[colorType];
        const hexColor = getSolidFill(colorNode, undefined, undefined, warpContext);
        const duotoneColor = tinycolor("#" + hexColor);
        duotoneColors.push(duotoneColor.toRgb());
      }
    });

    if (duotoneColors.length === 2) {
      filterMarkup =
        '<filter id="svg_image_duotone"> ' +
        '<feColorMatrix type="matrix" values=".33 .33 .33 0 0' +
        ".33 .33 .33 0 0" +
        ".33 .33 .33 0 0" +
        '0 0 0 1 0">' +
        "</feColorMatrix>" +
        '<feComponentTransfer color-interpolation-filters="sRGB">' +
        '<feFuncR type="table" tableValues="' +
        duotoneColors[0].r / 255 +
        " " +
        duotoneColors[1].r / 255 +
        '"></feFuncR>' +
        '<feFuncG type="table" tableValues="' +
        duotoneColors[0].g / 255 +
        " " +
        duotoneColors[1].g / 255 +
        '"></feFuncG>' +
        '<feFuncB type="table" tableValues="' +
        duotoneColors[0].b / 255 +
        " " +
        duotoneColors[1].b / 255 +
        '"></feFuncB>' +
        "</feComponentTransfer>" +
        " </filter>";
    }

    filterAttr = 'filter="url(#svg_image_duotone)"';
    patternMarkup += filterMarkup;
  }

  const escapedImageDataUrl = escapeHtml(imageDataUrl);

  if (tileWidth !== undefined && tileWidth !== 0) {
    patternMarkup +=
      '<image  xlink:href="' +
      escapedImageDataUrl +
      '" x="0" y="0" width="' +
      tileWidth +
      '" height="' +
      tileHeight +
      '" ' +
      imageOpacityAttr +
      " " +
      filterAttr +
      "></image>";
  } else {
    patternMarkup +=
      '<image  xlink:href="' +
      escapedImageDataUrl +
      '" preserveAspectRatio="none" width="1" height="1" ' +
      imageOpacityAttr +
      " " +
      filterAttr +
      "></image>";
  }
  patternMarkup += "</pattern>";

  return patternMarkup;
}
