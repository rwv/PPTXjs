/**
 * Processes shape effects like shadows and arrow markers
 *
 * Currently supports:
 * - outerShdw (outer shadow with CSS drop-shadow filter)
 * - Arrow/triangle markers for line ends
 *
 * Not yet implemented (listed in PPTX spec):
 * - a:blur
 * - a:fillOverlay
 * - a:glow
 * - a:innerShdw
 * - a:prstShdw
 * - a:reflection
 * - a:softEdge
 * - 3D effects (a:scene3d, a:sp3d, bevel, extrusion, contour)
 */

import { getTextByPathList } from "../object";
import { getSolidFill } from "../color";

export interface ShapeEffectsResult {
  /** SVG defs content (markers, filters) */
  defsContent: string;
  /** CSS class name for effects */
  effectsClassName: string;
}

/**
 * Process shape effects and generate SVG defs
 */
export function processShapeEffects(
  node: any,
  shpId: number | string,
  svgCssName: string,
  border: any,
  warpObj: any,
  slideFactor: number,
  styleTable: any
): ShapeEffectsResult {
  let defsContent = "";
  const effectsClassName = svgCssName + "_effects";

  ////////////////////effects/////////////////////////////////////////////////////
  //p:spPr => a:effectLst =>
  //"a:blur"
  //"a:fillOverlay"
  //"a:glow"
  //"a:innerShdw"
  //"a:outerShdw"
  //"a:prstShdw"
  //"a:reflection"
  //"a:softEdge"
  //p:spPr => a:scene3d
  //"a:camera"
  //"a:lightRig"
  //"a:backdrop"
  //"a:extLst"?
  //p:spPr => a:sp3d
  //"a:bevelT"
  //"a:bevelB"
  //"a:extrusionClr"
  //"a:contourClr"
  //"a:extLst"?
  //////////////////////////////outerShdw///////////////////////////////////////////
  //not support sizing the shadow
  const outerShdwNode = getTextByPathList(node, ["p:spPr", "a:effectLst", "a:outerShdw"]);
  if (outerShdwNode !== undefined) {
    const chdwClrNode = getSolidFill(outerShdwNode, undefined, undefined, warpObj);
    const outerShdwAttrs = outerShdwNode["attrs"];

    //var algn = outerShdwAttrs["algn"];
    const dir = outerShdwAttrs["dir"] ? parseInt(outerShdwAttrs["dir"]) / 60000 : 0;
    const dist = parseInt(outerShdwAttrs["dist"]) * slideFactor; //(px) //* (3 / 4); //(pt)
    //var rotWithShape = outerShdwAttrs["rotWithShape"];
    const blurRad = outerShdwAttrs["blurRad"]
      ? parseInt(outerShdwAttrs["blurRad"]) * slideFactor
      : ""; //+ "px"
    //var sx = (outerShdwAttrs["sx"]) ? (parseInt(outerShdwAttrs["sx"]) / 100000) : 1;
    //var sy = (outerShdwAttrs["sy"]) ? (parseInt(outerShdwAttrs["sy"]) / 100000) : 1;
    const vx = dist * Math.sin((dir * Math.PI) / 180);
    const hx = dist * Math.cos((dir * Math.PI) / 180);
    //SVG
    //var oShadowId = "outerhadow_" + shpId;
    //oShadowSvgUrlStr = "filter='url(#" + oShadowId+")'";
    //var shadowFilterStr = '<filter id="' + oShadowId + '" x="0" y="0" width="' + w * (6 / 8) + '" height="' + h + '">';
    //1:
    //shadowFilterStr += '<feDropShadow dx="' + vx + '" dy="' + hx + '" stdDeviation="' + blurRad * (3 / 4) + '" flood-color="#' + chdwClrNode +'" flood-opacity="1" />'
    //2:
    //shadowFilterStr += '<feFlood result="floodColor" flood-color="red" flood-opacity="0.5"   width="' + w * (6 / 8) + '" height="' + h + '"  />'; //#' + chdwClrNode +'
    //shadowFilterStr += '<feOffset result="offOut" in="SourceGraph ccfsdf-+ic"  dx="' + vx + '" dy="' + hx + '"/>'; //how much to offset
    //shadowFilterStr += '<feGaussianBlur result="blurOut" in="offOut" stdDeviation="' + blurRad*(3/4) +'"/>'; //tdDeviation is how much to blur
    //shadowFilterStr += '<feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>'; //slope is the opacity of the shadow
    //shadowFilterStr += '<feBlend in="SourceGraphic" in2="blurOut"  mode="normal" />'; //this contains the element that the filter is applied to
    //shadowFilterStr += '</filter>';
    //result += shadowFilterStr;

    //css:
    let svg_css_shadow =
      "filter:drop-shadow(" + hx + "px " + vx + "px " + blurRad + "px #" + chdwClrNode + ");";

    if (svg_css_shadow in styleTable) {
      svg_css_shadow += "do-nothing: " + svgCssName + ";";
    }

    styleTable[svg_css_shadow] = {
      name: effectsClassName,
      text: svg_css_shadow,
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////

  // Arrow/triangle markers for line ends
  const headEndNodeAttrs = getTextByPathList(node, ["p:spPr", "a:ln", "a:headEnd", "attrs"]);
  const tailEndNodeAttrs = getTextByPathList(node, ["p:spPr", "a:ln", "a:tailEnd", "attrs"]);
  // type: none, triangle, stealth, diamond, oval, arrow

  if (
    (headEndNodeAttrs !== undefined &&
      (headEndNodeAttrs["type"] === "triangle" || headEndNodeAttrs["type"] === "arrow")) ||
    (tailEndNodeAttrs !== undefined &&
      (tailEndNodeAttrs["type"] === "triangle" || tailEndNodeAttrs["type"] === "arrow"))
  ) {
    const triangleMarker =
      "<marker id='markerTriangle_" +
      shpId +
      "' viewBox='0 0 10 10' refX='1' refY='5' markerWidth='5' markerHeight='5' stroke='" +
      border.color +
      "' fill='" +
      border.color +
      "' orient='auto-start-reverse' markerUnits='strokeWidth'><path d='M 0 0 L 10 5 L 0 10 z' /></marker>";
    defsContent += triangleMarker;
  }

  return {
    defsContent,
    effectsClassName,
  };
}
