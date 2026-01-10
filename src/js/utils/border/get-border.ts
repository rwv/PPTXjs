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

export function getBorder(
  shapeNode: any,
  parentNode: any,
  isSvgMode: boolean,
  targetType: string,
  warpContext: any
) {
  void parentNode;
  let borderStyleText, lineStyleNode;

  if (targetType === "shape") {
    borderStyleText = "border: ";
    lineStyleNode = shapeNode["p:spPr"]["a:ln"];
  } else if (targetType === "text") {
    borderStyleText = "";
    lineStyleNode = shapeNode["a:rPr"]["a:ln"];
  }

  const hasNoFill = getTextByPathList(lineStyleNode, ["a:noFill"]);
  if (hasNoFill !== undefined) {
    return "hidden";
  }

  if (lineStyleNode === undefined) {
    const lineRefNode = getTextByPathList(shapeNode, ["p:style", "a:lnRef"]);
    if (lineRefNode !== undefined) {
      const lineIndex = getTextByPathList(lineRefNode, ["attrs", "idx"]);
      lineStyleNode =
        warpContext["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:lnStyleLst"][
          "a:ln"
        ][Number(lineIndex) - 1];
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
    borderWidth = parseInt(getTextByPathList(lineStyleNode, ["attrs", "w"])) / 12700;
    if (isNaN(borderWidth) || borderWidth < 1) {
      borderStyleText += 4 / 3 + "px ";
    } else {
      borderStyleText += borderWidth + "px ";
    }
    // Border type
    lineStyleType = getTextByPathList(lineStyleNode, ["a:prstDash", "attrs", "val"]);
    if (lineStyleType === undefined) {
      lineStyleType = getTextByPathList(lineStyleNode, ["attrs", "cmpd"]);
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
      borderColor = getSolidFill(lineStyleNode["a:solidFill"], undefined, undefined, warpContext);
    } else if (fillTyp === "GRADIENT_FILL") {
      borderColor = getGradientFill(lineStyleNode["a:gradFill"], warpContext);
    } else if (fillTyp === "PATTERN_FILL") {
      borderColor = getPatternFill(lineStyleNode["a:pattFill"], warpContext);
    }
  }

  // 2. drawingML namespace
  if (borderColor === undefined) {
    const lineRefNode = getTextByPathList(shapeNode, ["p:style", "a:lnRef"]);
    if (lineRefNode !== undefined) {
      borderColor = getSolidFill(lineRefNode, undefined, undefined, warpContext);
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
