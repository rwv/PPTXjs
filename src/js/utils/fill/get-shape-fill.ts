/**
 * Get shape fill style
 *
 * @param node - The XML node containing shape properties
 * @param pNode - Parent node (for group fills)
 * @param isSvgMode - Whether to return SVG format or CSS format
 * @param warpObj - The warp object containing theme and other resources
 * @param source - Source type for image lookup
 * @returns Fill color/style as CSS string or SVG-compatible format
 */
import { getTextByPathList } from "../object";
import { getFillType } from "./get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getGradientFill } from "./get-gradient-fill";
import { getPatternFill } from "./get-pattern-fill";
import { getPicFill } from "./get-pic-fill";
import tinycolor from "tinycolor2";

export function getShapeFill(node: any, pNode: any, isSvgMode: any, warpObj: any, source: any): any {
  // 1. presentationML
  // p:spPr/ [a:noFill, solidFill, gradFill, blipFill, pattFill, grpFill]
  // From slide
  // Fill Type:
  var fillType = getFillType(getTextByPathList(node, ["p:spPr"]));
  var fillColor;

  if (fillType == "NO_FILL") {
    return isSvgMode ? "none" : "";
  } else if (fillType == "SOLID_FILL") {
    var shpFill = node["p:spPr"]["a:solidFill"];
    fillColor = getSolidFill(shpFill, undefined, undefined, warpObj);
  } else if (fillType == "GRADIENT_FILL") {
    var shpFill = node["p:spPr"]["a:gradFill"];
    fillColor = getGradientFill(shpFill, warpObj);
  } else if (fillType == "PATTERN_FILL") {
    var shpFill = node["p:spPr"]["a:pattFill"];
    fillColor = getPatternFill(shpFill, warpObj);
  } else if (fillType == "PIC_FILL") {
    var shpFill = node["p:spPr"]["a:blipFill"];
    fillColor = getPicFill(source, shpFill, warpObj);
  }

  // 2. drawingML namespace
  if (fillColor === undefined) {
    var clrName = getTextByPathList(node, ["p:style", "a:fillRef"]);
    var idx = parseInt(getTextByPathList(node, ["p:style", "a:fillRef", "attrs", "idx"]));
    if (idx == 0 || idx == 1000) {
      // no fill
      return isSvgMode ? "none" : "";
    } else if (idx > 0 && idx < 1000) {
      // <a:fillStyleLst> fill
    } else if (idx > 1000) {
      // <a:bgFillStyleLst>
    }
    fillColor = getSolidFill(clrName, undefined, undefined, warpObj);
  }

  // 3. is group fill
  if (fillColor === undefined) {
    var grpFill = getTextByPathList(node, ["p:spPr", "a:grpFill"]);
    if (grpFill !== undefined) {
      // get parent fill style
      var grpShpFill = pNode["p:grpSpPr"];
      var spShpNode = { "p:spPr": grpShpFill };
      return getShapeFill(spShpNode, node, isSvgMode, warpObj, source);
    } else if (fillType == "NO_FILL") {
      return isSvgMode ? "none" : "";
    }
  }

  if (fillColor !== undefined) {
    if (fillType == "GRADIENT_FILL") {
      if (isSvgMode) {
        return fillColor;
      } else {
        var colorAry = fillColor.color;
        var rot = fillColor.rot;

        var bgcolor = "background: linear-gradient(" + rot + "deg,";
        for (var i = 0; i < colorAry.length; i++) {
          if (i == colorAry.length - 1) {
            bgcolor += "#" + colorAry[i] + ");";
          } else {
            bgcolor += "#" + colorAry[i] + ", ";
          }
        }
        return bgcolor;
      }
    } else if (fillType == "PIC_FILL") {
      if (isSvgMode) {
        return fillColor;
      } else {
        return "background-image:url(" + fillColor + ");";
      }
    } else if (fillType == "PATTERN_FILL") {
      var bgPtrn = "", bgSize = "", bgPos = "";
      bgPtrn = fillColor[0];
      if (fillColor[1] !== null && fillColor[1] !== undefined && fillColor[1] != "") {
        bgSize = " background-size:" + fillColor[1] + ";";
      }
      if (fillColor[2] !== null && fillColor[2] !== undefined && fillColor[2] != "") {
        bgPos = " background-position:" + fillColor[2] + ";";
      }
      return "background: " + bgPtrn + ";" + bgSize + bgPos;
    } else {
      if (isSvgMode) {
        var color = tinycolor(fillColor);
        fillColor = color.toRgbString();
        return fillColor;
      } else {
        return "background-color: #" + fillColor + ";";
      }
    }
  } else {
    if (isSvgMode) {
      return "none";
    } else {
      return "background-color: inherit;";
    }
  }
}
