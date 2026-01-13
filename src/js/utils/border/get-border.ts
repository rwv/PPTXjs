/**
 * Get border style for shapes and text
 *
 * @param shapeNode - The XML node containing border properties
 * @param isSvgMode - Whether to return SVG format or CSS format
 * @param borderType - Border type: "shape" or "text"
 * @param warpContext - The warp object containing theme and other resources
 * @returns Border style as CSS string or SVG object
 */
import { getTextByPathList } from "../object";
import { getFillType } from "../fill/get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getGradientFill } from "../fill/get-gradient-fill";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

type GetBorderOptions = {
  shapeNode: XmlNode;
  isSvgMode: boolean;
  borderType: "shape" | "text";
  warpContext: WarpContext;
};

export function getBorder({ shapeNode, isSvgMode, borderType, warpContext }: GetBorderOptions):
  | string
  | {
      color: string;
      width: number | undefined;
      type: string | undefined;
      strokeDasharray: string;
    } {
  type SolidFillOptions = Parameters<typeof getSolidFill>[0];
  type SolidFillNode = SolidFillOptions["fillNode"];
  type GradientFillOptions = Parameters<typeof getGradientFill>[0];
  type GradientFillNode = GradientFillOptions["gradientFillNode"];
  const defaultBorderWidthPx = 4 / 3;
  // Map OOXML dash styles to CSS + SVG dasharrays.
  const dashStyles: Record<string, { css: string; dasharray: string }> = {
    solid: { css: "solid", dasharray: "0" },
    dash: { css: "dashed", dasharray: "5" },
    dashDot: { css: "dashed", dasharray: "5, 5, 1, 5" },
    dashDotDot: { css: "dashed", dasharray: "5, 5, 1, 5, 1, 5" },
    dot: { css: "dotted", dasharray: "1, 5" },
    lgDash: { css: "dashed", dasharray: "10, 5" },
    lgDashDot: { css: "dashed", dasharray: "10, 5, 1, 5" },
    lgDashDotDot: { css: "dashed", dasharray: "10, 5, 1, 5, 1, 5" },
    sysDash: { css: "dashed", dasharray: "5, 2" },
    sysDashDot: { css: "dashed", dasharray: "5, 2, 1, 5" },
    sysDashDotDot: { css: "dashed", dasharray: "5, 2, 1, 5, 1, 5" },
    sysDot: { css: "dotted", dasharray: "2, 5" },
  };

  // Avoid NaN cascades when PPTX attributes are missing or non-numeric.
  const parseNumber = (value: string | number | undefined): number | undefined => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  };

  // Preserve special keywords; otherwise normalize to hex with a leading #.
  const normalizeColor = (value: string | undefined): string | undefined => {
    if (!value) {
      return undefined;
    }
    if (value === "none" || value === "transparent" || value === "currentColor") {
      return value;
    }
    return value.startsWith("#") ? value : `#${value}`;
  };

  // A line node can be a direct a:ln or a table-style a:ln variant.
  const isLineNode = (node: XmlNode): boolean =>
    node["a:solidFill"] !== undefined ||
    node["a:gradFill"] !== undefined ||
    node["a:pattFill"] !== undefined ||
    node["a:noFill"] !== undefined ||
    node["a:prstDash"] !== undefined ||
    node.attrs?.w !== undefined;

  // Theme fallback for shapes that only reference a:lnRef.
  const resolveThemeLineNode = (): XmlNode | undefined => {
    const lineRefNode = getTextByPathList<XmlNode>({
      node: shapeNode,
      path: ["p:style", "a:lnRef"],
    });
    if (lineRefNode === undefined || warpContext.themeContent === undefined) {
      return undefined;
    }
    const lineIndexValue = getTextByPathList<string | number>({
      node: lineRefNode,
      path: ["attrs", "idx"],
    });
    const lineIndex = parseNumber(lineIndexValue);
    if (lineIndex === undefined || lineIndex < 1) {
      return undefined;
    }
    const lineStyleListValue = getTextByPathList<XmlNode[]>({
      node: warpContext.themeContent,
      path: ["a:theme", "a:themeElements", "a:fmtScheme", "a:lnStyleLst", "a:ln"],
    });
    const lineStyleList = Array.isArray(lineStyleListValue) ? lineStyleListValue : undefined;
    return lineStyleList ? lineStyleList[lineIndex - 1] : undefined;
  };

  // Resolve which XML node actually carries line properties.
  const resolveLineNode = (): { lineNode: XmlNode | undefined; prefix: string } => {
    if (borderType === "text") {
      const textLineNode = getTextByPathList<XmlNode>({
        node: shapeNode,
        path: ["a:rPr", "a:ln"],
      });
      if (textLineNode !== undefined) {
        return { lineNode: textLineNode, prefix: "" };
      }
      return { lineNode: isLineNode(shapeNode) ? shapeNode : undefined, prefix: "" };
    }

    const shapeLineNode = getTextByPathList<XmlNode>({
      node: shapeNode,
      path: ["p:spPr", "a:ln"],
    });
    if (shapeLineNode !== undefined) {
      return { lineNode: shapeLineNode, prefix: "border: " };
    }
    if (isLineNode(shapeNode)) {
      return { lineNode: shapeNode, prefix: "" };
    }
    return { lineNode: resolveThemeLineNode(), prefix: "border: " };
  };

  // Pattern fills don't translate to CSS borders; pick a solid color if available.
  const resolvePatternColor = (patternFillNode: XmlNode): string | undefined => {
    const foregroundNode = getTextByPathList<XmlNode>({ node: patternFillNode, path: ["a:fgClr"] });
    const backgroundNode = getTextByPathList<XmlNode>({ node: patternFillNode, path: ["a:bgClr"] });
    return (
      getSolidFill({
        fillNode: foregroundNode as SolidFillNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      }) ??
      getSolidFill({
        fillNode: backgroundNode as SolidFillNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      })
    );
  };

  // Pick a safe color for borders across fill types.
  const resolveLineColor = (lineNode: XmlNode): string | undefined => {
    const fillType = getFillType({ shapePropsNode: lineNode });
    if (fillType === "NO_FILL") {
      return "none";
    }
    if (fillType === "SOLID_FILL") {
      const solidFillNode = getTextByPathList<XmlNode>({ node: lineNode, path: ["a:solidFill"] });
      return getSolidFill({
        fillNode: solidFillNode as SolidFillNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      });
    }
    if (fillType === "GRADIENT_FILL") {
      const gradientFillNode = getTextByPathList<XmlNode>({
        node: lineNode,
        path: ["a:gradFill"],
      });
      if (gradientFillNode !== undefined) {
        const gradient = getGradientFill({
          gradientFillNode: gradientFillNode as GradientFillNode,
          warpContext,
        });
        return gradient.color.find((color) => color);
      }
    }
    if (fillType === "PATTERN_FILL") {
      const patternFillNode = getTextByPathList<XmlNode>({
        node: lineNode,
        path: ["a:pattFill"],
      });
      if (patternFillNode !== undefined) {
        return resolvePatternColor(patternFillNode);
      }
    }
    return undefined;
  };

  const { lineNode, prefix } = resolveLineNode();
  if (lineNode === undefined) {
    if (isSvgMode) {
      return { color: "none", width: 0, type: undefined, strokeDasharray: "0" };
    }
    return borderType === "text" ? "" : prefix ? "border: none;" : "none";
  }

  const hasNoFill = getTextByPathList<XmlNode>({ node: lineNode, path: ["a:noFill"] });
  if (hasNoFill !== undefined) {
    if (isSvgMode) {
      return { color: "none", width: 0, type: undefined, strokeDasharray: "0" };
    }
    return borderType === "text" ? "" : prefix ? "border: none;" : "none";
  }

  // Border width: 1pt = 12700 EMUs; default to ~1.33px if missing.
  const borderWidthValue = getTextByPathList<string | number>({
    node: lineNode,
    path: ["attrs", "w"],
  });
  const borderWidthPt = parseNumber(borderWidthValue);
  const borderWidth = borderWidthPt !== undefined ? borderWidthPt / 12700 : undefined;
  const borderWidthPx =
    borderWidth === undefined || Number.isNaN(borderWidth) || borderWidth < 1
      ? defaultBorderWidthPx
      : borderWidth;

  const dashValue = getTextByPathList<string | number>({
    node: lineNode,
    path: ["a:prstDash", "attrs", "val"],
  });
  const dashStyle = dashValue !== undefined ? String(dashValue) : undefined;
  const cmpdValue =
    dashStyle === undefined
      ? getTextByPathList<string | number>({ node: lineNode, path: ["attrs", "cmpd"] })
      : undefined;
  const lineStyleType = dashStyle ?? (cmpdValue !== undefined ? String(cmpdValue) : undefined);
  // CSS cannot represent PPTX "dbl" directly; keep "double" for CSS but neutral dash for SVG.
  const dashSpec =
    lineStyleType === "dbl" ? { css: "double", dasharray: "0" } : dashStyles[lineStyleType ?? ""];
  const lineStyle = dashSpec?.css ?? "solid";
  const strokeDasharray = dashSpec?.dasharray ?? "0";

  let borderColor = resolveLineColor(lineNode);
  if (borderColor === "none") {
    if (isSvgMode) {
      return { color: "none", width: 0, type: lineStyleType, strokeDasharray: "0" };
    }
    return borderType === "text" ? "" : prefix ? "border: none;" : "none";
  }
  if (borderColor === undefined && borderType === "shape") {
    const lineRefNode = getTextByPathList<XmlNode>({
      node: shapeNode,
      path: ["p:style", "a:lnRef"],
    });
    if (lineRefNode !== undefined) {
      borderColor = getSolidFill({
        fillNode: lineRefNode as SolidFillNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      });
    }
  }

  const normalizedColor =
    normalizeColor(borderColor) ?? (borderType === "text" ? "currentColor" : undefined);
  if (!normalizedColor) {
    if (isSvgMode) {
      return { color: "none", width: 0, type: lineStyleType, strokeDasharray: "0" };
    }
    return borderType === "text" ? "" : prefix ? "border: none;" : "none";
  }

  if (isSvgMode) {
    return {
      color: normalizedColor,
      width: borderWidthPx,
      type: lineStyleType,
      strokeDasharray,
    };
  }

  const borderValue = `${borderWidthPx}px ${lineStyle} ${normalizedColor}`;
  return prefix ? `${prefix}${borderValue};` : borderValue;
}
