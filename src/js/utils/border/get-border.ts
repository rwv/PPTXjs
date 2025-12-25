/**
 * Get border style for shapes and text
 *
 * @param node - The XML node containing border properties
 * @param pNode - Parent node
 * @param isSvgMode - Whether to return SVG format or CSS format
 * @param bType - Border type: "shape" or "text"
 * @param warpObj - The warp object containing theme and other resources
 * @returns Border style as CSS string or SVG object
 */
import type { PptxNode, WarpObject } from "../../types";
import { getTextByPathList } from "../object";
import { getFillType } from "../fill/get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getGradientFill } from "../fill/get-gradient-fill";
import { getPatternFill } from "../fill/get-pattern-fill";

export function getBorder(
  node: PptxNode,
  pNode: PptxNode,
  isSvgMode: boolean,
  bType: string,
  warpObj: WarpObject
) {
  let cssText, lineNode, _subNodeTxt;

  if (bType === "shape") {
    cssText = "border: ";
    lineNode = node["p:spPr"]["a:ln"];
  } else if (bType === "text") {
    cssText = "";
    lineNode = node["a:rPr"]["a:ln"];
  }

  const is_noFill = getTextByPathList(lineNode, ["a:noFill"]);
  if (is_noFill !== undefined) {
    return "hidden";
  }

  if (lineNode === undefined) {
    const lnRefNode = getTextByPathList(node, ["p:style", "a:lnRef"]);
    if (lnRefNode !== undefined) {
      const lnIdx = getTextByPathList(lnRefNode, ["attrs", "idx"]);
      lineNode =
        warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:lnStyleLst"][
          "a:ln"
        ][Number(lnIdx) - 1];
    }
  }
  if (lineNode === undefined) {
    // is table
    cssText = "";
    lineNode = node;
  }

  let borderColor;
  let borderWidth: number | undefined;
  let borderType: string | undefined;
  let strokeDasharray = "0";

  if (lineNode !== undefined) {
    // Border width: 1pt = 12700, default = 0.75pt
    borderWidth = parseInt(getTextByPathList(lineNode, ["attrs", "w"])) / 12700;
    if (isNaN(borderWidth) || borderWidth < 1) {
      cssText += 4 / 3 + "px ";
    } else {
      cssText += borderWidth + "px ";
    }
    // Border type
    borderType = getTextByPathList(lineNode, ["a:prstDash", "attrs", "val"]);
    if (borderType === undefined) {
      borderType = getTextByPathList(lineNode, ["attrs", "cmpd"]);
    }
    switch (borderType) {
      case "solid":
        cssText += "solid";
        strokeDasharray = "0";
        break;
      case "dash":
        cssText += "dashed";
        strokeDasharray = "5";
        break;
      case "dashDot":
        cssText += "dashed";
        strokeDasharray = "5, 5, 1, 5";
        break;
      case "dot":
        cssText += "dotted";
        strokeDasharray = "1, 5";
        break;
      case "lgDash":
        cssText += "dashed";
        strokeDasharray = "10, 5";
        break;
      case "dbl":
        cssText += "double";
        strokeDasharray = "0";
        break;
      case "lgDashDotDot":
        cssText += "dashed";
        strokeDasharray = "10, 5, 1, 5, 1, 5";
        break;
      case "sysDash":
        cssText += "dashed";
        strokeDasharray = "5, 2";
        break;
      case "sysDashDot":
        cssText += "dashed";
        strokeDasharray = "5, 2, 1, 5";
        break;
      case "sysDashDotDot":
        cssText += "dashed";
        strokeDasharray = "5, 2, 1, 5, 1, 5";
        break;
      case "sysDot":
        cssText += "dotted";
        strokeDasharray = "2, 5";
        break;
      case undefined:
      default:
        cssText += "solid";
        strokeDasharray = "0";
    }
    // Border color
    const fillTyp = getFillType(lineNode);
    if (fillTyp === "NO_FILL") {
      borderColor = isSvgMode ? "none" : "";
    } else if (fillTyp === "SOLID_FILL") {
      borderColor = getSolidFill(lineNode["a:solidFill"], undefined, undefined, warpObj);
    } else if (fillTyp === "GRADIENT_FILL") {
      borderColor = getGradientFill(lineNode["a:gradFill"], warpObj);
    } else if (fillTyp === "PATTERN_FILL") {
      borderColor = getPatternFill(lineNode["a:pattFill"], warpObj);
    }
  }

  // 2. drawingML namespace
  if (borderColor === undefined) {
    const lnRefNode = getTextByPathList(node, ["p:style", "a:lnRef"]);
    if (lnRefNode !== undefined) {
      borderColor = getSolidFill(lnRefNode, undefined, undefined, warpObj);
    }
  }

  if (borderColor === undefined) {
    if (isSvgMode) {
      borderColor = "none";
    } else {
      borderColor = "hidden";
    }
  } else {
    borderColor = "#" + borderColor;
  }
  cssText += " " + borderColor + " ";

  if (isSvgMode) {
    return {
      color: borderColor,
      width: borderWidth,
      type: borderType,
      strokeDasharray: strokeDasharray,
    };
  } else {
    return cssText + ";";
  }
}
