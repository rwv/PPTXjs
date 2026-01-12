/**
 * Get border style for shapes and text
 *
 * @param shapeNode - The XML node containing border properties
 * @param parentNode - Parent node
 * @param isSvgMode - Whether to return SVG format or CSS format
 * @param targetType - Border type: "shape" or "text"
 * @param warpContext - The warp object containing theme and other resources
 * @returns Border style as CSS string or SVG object
 */
import { getTextByPathList } from "../object";
import { getFillType } from "../fill/get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getGradientFill } from "../fill/get-gradient-fill";
import { getPatternFill } from "../fill/get-pattern-fill";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

export function getBorder(
  shapeNode: XmlNode,
  parentNode: XmlNode | undefined,
  isSvgMode: boolean,
  targetType: "shape" | "text",
  warpContext: WarpContext
):
  | string
  | {
      color: string;
      width: number | undefined;
      type: string | undefined;
      strokeDasharray: string;
    } {
  void parentNode;
  let borderStyleText = "";
  let lineStyleNode: XmlNode | undefined;
  type SolidFillNode = Parameters<typeof getSolidFill>[0];
  type GradientFillNode = Parameters<typeof getGradientFill>[0];
  type PatternFillNode = Parameters<typeof getPatternFill>[0];

  if (targetType === "shape") {
    borderStyleText = "border: ";
    lineStyleNode = getTextByPathList<XmlNode>(shapeNode, ["p:spPr", "a:ln"]);
  } else {
    borderStyleText = "";
    lineStyleNode = getTextByPathList<XmlNode>(shapeNode, ["a:rPr", "a:ln"]);
  }

  const hasNoFill = lineStyleNode
    ? getTextByPathList<XmlNode>(lineStyleNode, ["a:noFill"])
    : undefined;
  if (hasNoFill !== undefined) {
    return "hidden";
  }

  if (lineStyleNode === undefined) {
    const lineRefNode = getTextByPathList<XmlNode>(shapeNode, ["p:style", "a:lnRef"]);
    if (lineRefNode !== undefined) {
      const lineIndexValue = getTextByPathList<string | number>(lineRefNode, ["attrs", "idx"]);
      const lineIndex = lineIndexValue !== undefined ? Number(lineIndexValue) : NaN;
      const lineStyleList = warpContext.themeContent
        ? getTextByPathList<XmlNode[]>(warpContext.themeContent, [
            "a:theme",
            "a:themeElements",
            "a:fmtScheme",
            "a:lnStyleLst",
            "a:ln",
          ])
        : undefined;
      if (lineStyleList && !Number.isNaN(lineIndex)) {
        lineStyleNode = lineStyleList[lineIndex - 1];
      }
    }
  }
  if (lineStyleNode === undefined) {
    // is table
    borderStyleText = "";
    lineStyleNode = shapeNode;
  }

  let borderColor;
  let borderWidth: number | undefined;
  let lineStyleType: string | undefined;
  let strokeDasharray = "0";

  if (lineStyleNode !== undefined) {
    // Border width: 1pt = 12700, default = 0.75pt
    const borderWidthValue = getTextByPathList<string | number>(lineStyleNode, ["attrs", "w"]);
    borderWidth = borderWidthValue !== undefined ? Number(borderWidthValue) / 12700 : NaN;
    if (isNaN(borderWidth) || borderWidth < 1) {
      borderStyleText += 4 / 3 + "px ";
    } else {
      borderStyleText += borderWidth + "px ";
    }
    // Border type
    const lineStyleTypeValue = getTextByPathList<string | number>(lineStyleNode, [
      "a:prstDash",
      "attrs",
      "val",
    ]);
    lineStyleType = lineStyleTypeValue !== undefined ? String(lineStyleTypeValue) : undefined;
    if (lineStyleType === undefined) {
      const lineStyleTypeAttr = getTextByPathList<string | number>(lineStyleNode, [
        "attrs",
        "cmpd",
      ]);
      lineStyleType = lineStyleTypeAttr !== undefined ? String(lineStyleTypeAttr) : undefined;
    }
    switch (lineStyleType) {
      case "solid":
        borderStyleText += "solid";
        strokeDasharray = "0";
        break;
      case "dash":
        borderStyleText += "dashed";
        strokeDasharray = "5";
        break;
      case "dashDot":
        borderStyleText += "dashed";
        strokeDasharray = "5, 5, 1, 5";
        break;
      case "dot":
        borderStyleText += "dotted";
        strokeDasharray = "1, 5";
        break;
      case "lgDash":
        borderStyleText += "dashed";
        strokeDasharray = "10, 5";
        break;
      case "dbl":
        borderStyleText += "double";
        strokeDasharray = "0";
        break;
      case "lgDashDotDot":
        borderStyleText += "dashed";
        strokeDasharray = "10, 5, 1, 5, 1, 5";
        break;
      case "sysDash":
        borderStyleText += "dashed";
        strokeDasharray = "5, 2";
        break;
      case "sysDashDot":
        borderStyleText += "dashed";
        strokeDasharray = "5, 2, 1, 5";
        break;
      case "sysDashDotDot":
        borderStyleText += "dashed";
        strokeDasharray = "5, 2, 1, 5, 1, 5";
        break;
      case "sysDot":
        borderStyleText += "dotted";
        strokeDasharray = "2, 5";
        break;
      case undefined:
      default:
        borderStyleText += "solid";
        strokeDasharray = "0";
    }
    // Border color
    const fillTyp = getFillType(lineStyleNode);
    if (fillTyp === "NO_FILL") {
      borderColor = isSvgMode ? "none" : "";
    } else if (fillTyp === "SOLID_FILL") {
      borderColor = getSolidFill(
        lineStyleNode["a:solidFill"] as SolidFillNode,
        undefined,
        undefined,
        warpContext
      );
    } else if (fillTyp === "GRADIENT_FILL") {
      borderColor = getGradientFill(lineStyleNode["a:gradFill"] as GradientFillNode, warpContext);
    } else if (fillTyp === "PATTERN_FILL") {
      borderColor = getPatternFill(lineStyleNode["a:pattFill"] as PatternFillNode, warpContext);
    }
  }

  // 2. drawingML namespace
  if (borderColor === undefined) {
    const lineRefNode = getTextByPathList<XmlNode>(shapeNode, ["p:style", "a:lnRef"]);
    if (lineRefNode !== undefined) {
      borderColor = getSolidFill(lineRefNode as SolidFillNode, undefined, undefined, warpContext);
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
  borderStyleText += " " + borderColor + " ";

  if (isSvgMode) {
    return {
      color: borderColor,
      width: borderWidth,
      type: lineStyleType,
      strokeDasharray: strokeDasharray,
    };
  } else {
    return borderStyleText + ";";
  }
}
