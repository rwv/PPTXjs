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

import type { BasicShapeParams } from "./basic-shapes/types";
import { renderRectLike } from "./basic-shapes/rectangles";
import { renderIrregularSeal } from "./basic-shapes/irregular-seals";
import { renderEllipseLike } from "./basic-shapes/ellipses";
import { renderRoundSnipRect } from "./basic-shapes/round-snip";
import { renderSnipRoundRect } from "./basic-shapes/snip-round-rect";

export type { BasicShapeParams } from "./basic-shapes/types";

/**
 * Check if shape type is a basic shape
 */
export function isBasicShape(shapType: string): boolean {
  const basicShapes = [
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
  return basicShapes.includes(shapType);
}

/**
 * Render basic shape SVG
 */
export function renderBasicShape(shapType: string, params: BasicShapeParams): string {
  let result = "";

  switch (shapType) {
    case "rect":
    case "flowChartProcess":
    case "flowChartPredefinedProcess":
    case "flowChartInternalStorage":
    case "actionButtonBlank":
      result = renderRectLike(shapType, params);
      break;
    case "irregularSeal1":
    case "irregularSeal2":
      result = renderIrregularSeal(shapType, params);
      break;
    case "ellipse":
    case "flowChartConnector":
    case "flowChartSummingJunction":
    case "flowChartOr":
      result = renderEllipseLike(shapType, params);
      break;
    case "roundRect":
    case "round1Rect":
    case "round2DiagRect":
    case "round2SameRect":
    case "snip1Rect":
    case "snip2DiagRect":
    case "snip2SameRect":
    case "flowChartAlternateProcess":
    case "flowChartPunchedCard":
      result = renderRoundSnipRect(shapType, params);
      break;
    case "snipRoundRect":
      result = renderSnipRoundRect(params);
      break;
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
      break;
    case undefined:
    default:
      console.warn("Undefine shape type.(" + shapType + ")");
  }

  return result;
}
