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

export function getSvgImagePattern(node: any, fill: any, shpId: any, warpObj: any): string {
  var pic_dim = getBase64ImageDimensions(fill);
  var width = pic_dim?.[0];
  var height = pic_dim?.[1];

  var blipFillNode = node["p:spPr"]["a:blipFill"];
  var tileNode = getTextByPathList(blipFillNode, ["a:tile", "attrs"]);
  var sx: number | undefined;
  var sy: number | undefined;

  if (tileNode !== undefined && tileNode["sx"] !== undefined && width && height) {
    sx = (parseInt(tileNode["sx"]) / 100000) * width;
    sy = (parseInt(tileNode["sy"]) / 100000) * height;
  }

  var blipNode = node["p:spPr"]["a:blipFill"]["a:blip"];
  var tialphaModFixNode = getTextByPathList(blipNode, ["a:alphaModFix", "attrs"]);
  var imgOpacity = "";

  if (tialphaModFixNode !== undefined && tialphaModFixNode["amt"] !== undefined && tialphaModFixNode["amt"] != "") {
    var amt = parseInt(tialphaModFixNode["amt"]) / 100000;
    var opacity = amt;
    imgOpacity = "opacity='" + opacity + "'";
  }

  var ptrn: string;
  if (sx !== undefined && sx != 0) {
    ptrn = '<pattern id="imgPtrn_' + shpId + '" x="0" y="0"  width="' + sx + '" height="' + sy + '" patternUnits="userSpaceOnUse">';
  } else {
    ptrn = '<pattern id="imgPtrn_' + shpId + '"  patternContentUnits="objectBoundingBox"  width="1" height="1">';
  }

  var duotoneNode = getTextByPathList(blipNode, ["a:duotone"]);
  var fillterNode = "";
  var filterUrl = "";

  if (duotoneNode !== undefined) {
    var clr_ary: any[] = [];
    Object.keys(duotoneNode).forEach(function (clr_type) {
      if (clr_type != "attrs") {
        var obj: any = {};
        obj[clr_type] = duotoneNode[clr_type];
        var hexClr = getSolidFill(obj, undefined, undefined, warpObj);
        var color = tinycolor("#" + hexClr);
        clr_ary.push(color.toRgb());
      }
    });

    if (clr_ary.length == 2) {
      fillterNode = '<filter id="svg_image_duotone"> ' +
        '<feColorMatrix type="matrix" values=".33 .33 .33 0 0' +
        '.33 .33 .33 0 0' +
        '.33 .33 .33 0 0' +
        '0 0 0 1 0">' +
        '</feColorMatrix>' +
        '<feComponentTransfer color-interpolation-filters="sRGB">' +
        '<feFuncR type="table" tableValues="' + clr_ary[0].r / 255 + ' ' + clr_ary[1].r / 255 + '"></feFuncR>' +
        '<feFuncG type="table" tableValues="' + clr_ary[0].g / 255 + ' ' + clr_ary[1].g / 255 + '"></feFuncG>' +
        '<feFuncB type="table" tableValues="' + clr_ary[0].b / 255 + ' ' + clr_ary[1].b / 255 + '"></feFuncB>' +
        '</feComponentTransfer>' +
        ' </filter>';
    }

    filterUrl = 'filter="url(#svg_image_duotone)"';
    ptrn += fillterNode;
  }

  fill = escapeHtml(fill);

  if (sx !== undefined && sx != 0) {
    ptrn += '<image  xlink:href="' + fill + '" x="0" y="0" width="' + sx + '" height="' + sy + '" ' + imgOpacity + ' ' + filterUrl + '></image>';
  } else {
    ptrn += '<image  xlink:href="' + fill + '" preserveAspectRatio="none" width="1" height="1" ' + imgOpacity + ' ' + filterUrl + '></image>';
  }
  ptrn += '</pattern>';

  return ptrn;
}
