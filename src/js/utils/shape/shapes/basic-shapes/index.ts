/**
 * Basic shape rendering module
 *
 * Handles fundamental shape types including:
 * - Rectangles (rect, flowChartProcess, actionButtonBlank)
 * - Ellipses (ellipse, flowChartConnector, flowChartOr)
 * - Round rectangles (roundRect, round1Rect, round2DiagRect, etc.)
 * - Snip rectangles (snip1Rect, snip2DiagRect, etc.)
 * - Irregular seals (irregularSeal1, irregularSeal2)
 */

// Export shared utilities and types
export type { BasicShapeParams } from "./shared";
export { getFillAttr } from "./shared";

// Export individual renderers
export { renderRect } from "./rect";
export { renderIrregularSeal } from "./irregular-seal";
export { renderEllipse } from "./ellipse";
export { renderRoundSnipRect } from "./round-snip-rect";
export { renderSnipRoundRect } from "./snip-round-rect";

// Import for main renderer
import type { BasicShapeParams } from "./shared";
import { renderRect } from "./rect";
import { renderIrregularSeal } from "./irregular-seal";
import { renderEllipse } from "./ellipse";
import { renderRoundSnipRect } from "./round-snip-rect";
import { renderSnipRoundRect } from "./snip-round-rect";

/**
 * List of basic shape types
 */
const BASIC_SHAPE_TYPES = [
  "rect",
  "flowChartProcess",
  "flowChartPredefinedProcess",
  "flowChartInternalStorage",
  "actionButtonBlank",
  "irregularSeal1",
  "irregularSeal2",
  "ellipse",
  "flowChartConnector",
  "flowChartSummingJunction",
  "flowChartOr",
  "roundRect",
  "round1Rect",
  "round2DiagRect",
  "round2SameRect",
  "snip1Rect",
  "snip2DiagRect",
  "snip2SameRect",
  "flowChartAlternateProcess",
  "flowChartPunchedCard",
  "snipRoundRect",
];

/**
 * Check if shape type is a basic shape
 */
export function isBasicShape(shapType: string): boolean {
  return BASIC_SHAPE_TYPES.includes(shapType);
}

/**
 * Render basic shape SVG
 */
export function renderBasicShape(shapType: string, params: BasicShapeParams): string {
  switch (shapType) {
    case "rect":
    case "flowChartProcess":
    case "flowChartPredefinedProcess":
    case "flowChartInternalStorage":
    case "actionButtonBlank":
      return renderRect(shapType, params);

    case "irregularSeal1":
    case "irregularSeal2":
      return renderIrregularSeal(shapType, params);

    case "ellipse":
    case "flowChartConnector":
    case "flowChartSummingJunction":
    case "flowChartOr":
      return renderEllipse(shapType, params);

    case "roundRect":
    case "round1Rect":
    case "round2DiagRect":
    case "round2SameRect":
    case "snip1Rect":
    case "snip2DiagRect":
    case "snip2SameRect":
    case "flowChartAlternateProcess":
    case "flowChartPunchedCard":
      return renderRoundSnipRect(shapType, params);

    case "snipRoundRect":
      return renderSnipRoundRect(params);

    case "leftRightCircularArrow":
    case "chartPlus":
    case "chartStar":
    case "chartX":
    case "cornerTabs":
    case "flowChartOfflineStorage":
    case "folderCorner":
    case "funnel":
    case "lineInv":
    case "nonIsoscelesTrapezoid":
    case "plaqueTabs":
    case "squareTabs":
    case "upDownArrowCallout":
      console.log(shapType, " -unsupported shape type.");
      return "";

    case undefined:
    default:
      console.warn("Undefine shape type.(" + shapType + ")");
      return "";
  }
}
