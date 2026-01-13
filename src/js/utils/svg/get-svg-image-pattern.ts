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

type GetSvgImagePatternOptions = {
  shapeNode: XmlNode;
  imageDataUrl: string;
  shapeId: string | number;
  warpContext: WarpContext;
};

export function getSvgImagePattern({
  shapeNode,
  imageDataUrl,
  shapeId,
  warpContext,
}: GetSvgImagePatternOptions): string {
  const imageDimensions = getBase64ImageDimensions({ imgSrc: imageDataUrl });
  const width = imageDimensions?.[0];
  const height = imageDimensions?.[1];

  const blipFillNode = getTextByPathList<XmlNode>({
    node: shapeNode,
    path: ["p:spPr", "a:blipFill"],
  });
  if (blipFillNode === undefined) {
    return "";
  }
  const tileAttrs = getTextByPathList<XmlAttrs>({ node: blipFillNode, path: ["a:tile", "attrs"] });
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
    const scaleX = Number(tileScaleX);
    const scaleY = Number(tileScaleY);
    if (Number.isFinite(scaleX) && Number.isFinite(scaleY)) {
      tileWidth = (scaleX / 100000) * width;
      tileHeight = (scaleY / 100000) * height;
    }
  }

  const blipNode = getTextByPathList<XmlNode>({ node: blipFillNode, path: ["a:blip"] });
  const alphaModFixNode =
    blipNode !== undefined
      ? getTextByPathList<XmlAttrs>({ node: blipNode, path: ["a:alphaModFix", "attrs"] })
      : undefined;
  let imageOpacityAttr = "";

  const alphaAmount = alphaModFixNode?.["amt"];
  if (alphaAmount !== undefined && alphaAmount !== "") {
    const parsedOpacity = Number(alphaAmount);
    if (Number.isFinite(parsedOpacity)) {
      const opacity = Math.min(1, Math.max(0, parsedOpacity / 100000));
      imageOpacityAttr = "opacity='" + opacity + "'";
    }
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
    blipNode !== undefined
      ? getTextByPathList<XmlNode>({ node: blipNode, path: ["a:duotone"] })
      : undefined;
  let filterMarkup = "";
  let filterAttr = "";

  if (duotoneNode !== undefined) {
    const duotoneColors: RgbColor[] = [];
    Object.keys(duotoneNode).forEach(function (colorType) {
      if (colorType !== "attrs") {
        const colorNode: XmlNode = {};
        colorNode[colorType] = duotoneNode[colorType];
        const hexColor = getSolidFill({
          fillNode: colorNode,
          colorMap: undefined,
          placeholderColor: undefined,
          warpContext,
        });
        if (hexColor) {
          const duotoneColor = tinycolor("#" + hexColor);
          duotoneColors.push(duotoneColor.toRgb());
        }
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

  const escapedImageDataUrl = escapeHtml({ text: imageDataUrl });

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
