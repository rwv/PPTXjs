/**
 * Get SVG image pattern for shape fills
 *
 * @param node - The XML node containing blip fill properties
 * @param fill - The base64 image data
 * @param shpId - Shape ID for unique pattern naming
 * @param warpObj - The warp object containing theme and other resources
 * @returns SVG pattern element string
 */
import { getTextByPathList } from "../object";
import { getSolidFill } from "../color/get-solid-fill";
import { getBase64ImageDimensions } from "../media/get-base64-image-dimensions";
import { escapeHtml } from "../string/escape-html";
import tinycolor from "tinycolor2";

type XmlNode = Record<string, unknown>;
type AttrsNode = Record<string, string>;
type RgbColor = { r: number; g: number; b: number; a?: number };

export function getSvgImagePattern(
  node: XmlNode,
  fill: string,
  shpId: string | number,
  warpObj: unknown
): string {
  const pic_dim = getBase64ImageDimensions(fill);
  const width = pic_dim?.[0];
  const height = pic_dim?.[1];

  const blipFillNode = (node["p:spPr"] as XmlNode)["a:blipFill"] as XmlNode;
  const tileNode = getTextByPathList<AttrsNode>(blipFillNode, ["a:tile", "attrs"]);
  let sx: number | undefined;
  let sy: number | undefined;

  const tileSx = tileNode?.["sx"];
  const tileSy = tileNode?.["sy"];
  if (
    tileNode !== undefined &&
    typeof tileSx === "string" &&
    typeof tileSy === "string" &&
    width &&
    height
  ) {
    sx = (parseInt(tileSx) / 100000) * width;
    sy = (parseInt(tileSy) / 100000) * height;
  }

  const blipNode = blipFillNode["a:blip"] as XmlNode;
  const tialphaModFixNode = getTextByPathList<AttrsNode>(blipNode, ["a:alphaModFix", "attrs"]);
  let imgOpacity = "";

  const alphaAmt = tialphaModFixNode?.["amt"];
  if (typeof alphaAmt === "string" && alphaAmt !== "") {
    const amt = parseInt(alphaAmt) / 100000;
    const opacity = amt;
    imgOpacity = "opacity='" + opacity + "'";
  }

  let ptrn: string;
  if (sx !== undefined && sx !== 0) {
    ptrn =
      '<pattern id="imgPtrn_' +
      shpId +
      '" x="0" y="0"  width="' +
      sx +
      '" height="' +
      sy +
      '" patternUnits="userSpaceOnUse">';
  } else {
    ptrn =
      '<pattern id="imgPtrn_' +
      shpId +
      '"  patternContentUnits="objectBoundingBox"  width="1" height="1">';
  }

  const duotoneNode = getTextByPathList<Record<string, unknown>>(blipNode, ["a:duotone"]);
  let fillterNode = "";
  let filterUrl = "";

  if (duotoneNode !== undefined) {
    const clr_ary: RgbColor[] = [];
    Object.keys(duotoneNode).forEach(function (clr_type) {
      if (clr_type !== "attrs") {
        const obj: Record<string, unknown> = {};
        obj[clr_type] = duotoneNode[clr_type];
        const hexClr = getSolidFill(obj, undefined, undefined, warpObj);
        const color = tinycolor("#" + hexClr);
        clr_ary.push(color.toRgb());
      }
    });

    if (clr_ary.length === 2) {
      fillterNode =
        '<filter id="svg_image_duotone"> ' +
        '<feColorMatrix type="matrix" values=".33 .33 .33 0 0' +
        ".33 .33 .33 0 0" +
        ".33 .33 .33 0 0" +
        '0 0 0 1 0">' +
        "</feColorMatrix>" +
        '<feComponentTransfer color-interpolation-filters="sRGB">' +
        '<feFuncR type="table" tableValues="' +
        clr_ary[0].r / 255 +
        " " +
        clr_ary[1].r / 255 +
        '"></feFuncR>' +
        '<feFuncG type="table" tableValues="' +
        clr_ary[0].g / 255 +
        " " +
        clr_ary[1].g / 255 +
        '"></feFuncG>' +
        '<feFuncB type="table" tableValues="' +
        clr_ary[0].b / 255 +
        " " +
        clr_ary[1].b / 255 +
        '"></feFuncB>' +
        "</feComponentTransfer>" +
        " </filter>";
    }

    filterUrl = 'filter="url(#svg_image_duotone)"';
    ptrn += fillterNode;
  }

  fill = escapeHtml(fill);

  if (sx !== undefined && sx !== 0) {
    ptrn +=
      '<image  xlink:href="' +
      fill +
      '" x="0" y="0" width="' +
      sx +
      '" height="' +
      sy +
      '" ' +
      imgOpacity +
      " " +
      filterUrl +
      "></image>";
  } else {
    ptrn +=
      '<image  xlink:href="' +
      fill +
      '" preserveAspectRatio="none" width="1" height="1" ' +
      imgOpacity +
      " " +
      filterUrl +
      "></image>";
  }
  ptrn += "</pattern>";

  return ptrn;
}
