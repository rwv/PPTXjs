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
import type { PptxNode, WarpObject } from "../../types";
import { getTextByPathList } from "../object";
import { getFillType } from "./get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getGradientFill } from "./get-gradient-fill";
import { getPatternFill } from "./get-pattern-fill";
import { getPicFill } from "./get-pic-fill";
import tinycolor from "tinycolor2";

export function getShapeFill(
  node: PptxNode,
  pNode: PptxNode,
  isSvgMode: any,
  warpObj: WarpObject,
  source: any
): any {
  // 1. presentationML
  // p:spPr/ [a:noFill, solidFill, gradFill, blipFill, pattFill, grpFill]
  // From slide
  // Fill Type:
  const fillType = getFillType(getTextByPathList(node, ["p:spPr"]));
  let fillColor;

  if (fillType === "NO_FILL") {
    return isSvgMode ? "none" : "";
  } else if (fillType === "SOLID_FILL") {
    const shpFill = node["p:spPr"]["a:solidFill"];
    fillColor = getSolidFill(shpFill, undefined, undefined, warpObj);
  } else if (fillType === "GRADIENT_FILL") {
    const shpFill = node["p:spPr"]["a:gradFill"];
    fillColor = getGradientFill(shpFill, warpObj);
  } else if (fillType === "PATTERN_FILL") {
    const shpFill = node["p:spPr"]["a:pattFill"];
    fillColor = getPatternFill(shpFill, warpObj);
  } else if (fillType === "PIC_FILL") {
    const shpFill = node["p:spPr"]["a:blipFill"];
    fillColor = getPicFill(source, shpFill, warpObj);
  }

  // 2. drawingML namespace
  if (fillColor === undefined) {
    const clrName = getTextByPathList(node, ["p:style", "a:fillRef"]);
    const idx = parseInt(getTextByPathList(node, ["p:style", "a:fillRef", "attrs", "idx"]));
    if (idx === 0 || idx === 1000) {
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
    const grpFill = getTextByPathList(node, ["p:spPr", "a:grpFill"]);
    if (grpFill !== undefined) {
      // get parent fill style
      const grpShpFill = pNode["p:grpSpPr"];
      const spShpNode = { "p:spPr": grpShpFill };
      return getShapeFill(spShpNode, node, isSvgMode, warpObj, source);
    } else if (fillType === "NO_FILL") {
      return isSvgMode ? "none" : "";
    }
  }

  if (fillColor !== undefined) {
    if (fillType === "GRADIENT_FILL") {
      if (isSvgMode) {
        return fillColor;
      } else {
        const colorAry = fillColor.color;
        const rot = fillColor.rot;

        let bgcolor = "background: linear-gradient(" + rot + "deg,";
        for (let i = 0; i < colorAry.length; i++) {
          if (i === colorAry.length - 1) {
            bgcolor += "#" + colorAry[i] + ");";
          } else {
            bgcolor += "#" + colorAry[i] + ", ";
          }
        }
        return bgcolor;
      }
    } else if (fillType === "PIC_FILL") {
      if (isSvgMode) {
        return fillColor;
      } else {
        return "background-image:url(" + fillColor + ");";
      }
    } else if (fillType === "PATTERN_FILL") {
      let bgPtrn = "",
        bgSize = "",
        bgPos = "";
      bgPtrn = fillColor[0];
      if (fillColor[1] !== null && fillColor[1] !== undefined && fillColor[1] !== "") {
        bgSize = " background-size:" + fillColor[1] + ";";
      }
      if (fillColor[2] !== null && fillColor[2] !== undefined && fillColor[2] !== "") {
        bgPos = " background-position:" + fillColor[2] + ";";
      }
      return "background: " + bgPtrn + ";" + bgSize + bgPos;
    } else {
      if (isSvgMode) {
        const color = tinycolor(fillColor);
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
