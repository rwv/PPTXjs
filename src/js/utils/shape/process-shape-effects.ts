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
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

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
  shapeNode: XmlNode,
  shapeId: number | string,
  svgClassName: string,
  border: any,
  warpContext: WarpContext,
  emuToPx: number,
  styleTable: Record<string, { name: string; text: string }>
): ShapeEffectsResult {
  let defsContent = "";
  const effectsClassName = svgClassName + "_effects";

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
  const outerShadowNode = asXmlNode(
    getTextByPathList(shapeNode, ["p:spPr", "a:effectLst", "a:outerShdw"])
  );
  if (outerShadowNode !== undefined) {
    const shadowColor = getSolidFill(outerShadowNode, undefined, undefined, warpContext);
    const outerShadowAttrs = outerShadowNode.attrs ?? {};

    //var algn = outerShdwAttrs["algn"];
    const directionValue = outerShadowAttrs["dir"];
    const directionDegrees = directionValue ? parseInt(String(directionValue), 10) / 60000 : 0;
    const distanceValue = outerShadowAttrs["dist"];
    const shadowDistancePx = parseInt(String(distanceValue ?? "0"), 10) * emuToPx; //(px) //* (3 / 4); //(pt)
    //var rotWithShape = outerShdwAttrs["rotWithShape"];
    const blurValue = outerShadowAttrs["blurRad"];
    const blurRadiusPx = blurValue ? parseInt(String(blurValue), 10) * emuToPx : ""; //+ "px"
    //var sx = (outerShdwAttrs["sx"]) ? (parseInt(outerShdwAttrs["sx"]) / 100000) : 1;
    //var sy = (outerShdwAttrs["sy"]) ? (parseInt(outerShdwAttrs["sy"]) / 100000) : 1;
    const offsetY = shadowDistancePx * Math.sin((directionDegrees * Math.PI) / 180);
    const offsetX = shadowDistancePx * Math.cos((directionDegrees * Math.PI) / 180);
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
    let svgShadowStyle =
      "filter:drop-shadow(" +
      offsetX +
      "px " +
      offsetY +
      "px " +
      blurRadiusPx +
      "px #" +
      shadowColor +
      ");";

    if (svgShadowStyle in styleTable) {
      svgShadowStyle += "do-nothing: " + svgClassName + ";";
    }

    styleTable[svgShadowStyle] = {
      name: effectsClassName,
      text: svgShadowStyle,
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////

  // Arrow/triangle markers for line ends
  const headEndAttributes = getTextByPathList(shapeNode, ["p:spPr", "a:ln", "a:headEnd", "attrs"]);
  const tailEndAttributes = getTextByPathList(shapeNode, ["p:spPr", "a:ln", "a:tailEnd", "attrs"]);
  // type: none, triangle, stealth, diamond, oval, arrow

  if (
    (headEndAttributes !== undefined &&
      (headEndAttributes["type"] === "triangle" || headEndAttributes["type"] === "arrow")) ||
    (tailEndAttributes !== undefined &&
      (tailEndAttributes["type"] === "triangle" || tailEndAttributes["type"] === "arrow"))
  ) {
    const triangleMarkerSvg =
      "<marker id='markerTriangle_" +
      shapeId +
      "' viewBox='0 0 10 10' refX='1' refY='5' markerWidth='5' markerHeight='5' stroke='" +
      border.color +
      "' fill='" +
      border.color +
      "' orient='auto-start-reverse' markerUnits='strokeWidth'><path d='M 0 0 L 10 5 L 0 10 z' /></marker>";
    defsContent += triangleMarkerSvg;
  }

  return {
    defsContent,
    effectsClassName,
  };
}
