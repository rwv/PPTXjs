/**
 * Curved arrow shape rendering functions.
 *
 * This module re-exports all curved arrow shapes from their specialized modules:
 * - Directional curved arrows (curvedDownArrow, curvedLeftArrow, curvedRightArrow, curvedUpArrow)
 * - Swoosh arrow (swooshArrow)
 * - Circular arrows (circularArrow, leftCircularArrow)
 */

import type { PptxNode } from "../../../types";

// Re-export from specialized modules
export {
  DirectionalCurvedArrowContext,
  DIRECTIONAL_CURVED_ARROW_TYPES,
  isDirectionalCurvedArrowShape,
  renderDirectionalCurvedArrowShape,
} from "./directional-curved-arrows";

export {
  SwooshArrowContext,
  SWOOSH_ARROW_TYPES,
  isSwooshArrowShape,
  renderSwooshArrowShape,
} from "./swoosh-arrow";

export {
  CircularArrowContext,
  CIRCULAR_ARROW_TYPES,
  isCircularArrowShape,
  renderCircularArrowShape,
} from "./circular-arrows";

/**
 * Context for rendering curved arrow shapes (unified interface for backward compatibility)
 */
export interface CurvedArrowContext {
  node: PptxNode;
  w: number;
  h: number;
  shpId: string;
  fillColor: string;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  border: {
    color: string;
    width: string;
    strokeDasharray: string;
  };
  slideFactor: number;
}

/**
 * List of all curved arrow shape types handled by this module
 */
export const CURVED_ARROW_TYPES = [
  "curvedDownArrow",
  "curvedLeftArrow",
  "curvedRightArrow",
  "curvedUpArrow",
  "swooshArrow",
  "circularArrow",
  "leftCircularArrow",
] as const;

// Import render functions for unified API
import { renderDirectionalCurvedArrowShape } from "./directional-curved-arrows";
import { renderSwooshArrowShape } from "./swoosh-arrow";
import { renderCircularArrowShape } from "./circular-arrows";

/**
 * Check if a shape type is a curved arrow shape handled by this module
 */
export function isCurvedArrowShape(shapType: string): boolean {
  return (CURVED_ARROW_TYPES as readonly string[]).includes(shapType);
}

/**
 * Render a curved arrow shape
 * @returns SVG string for the shape, or empty string if not a curved arrow shape
 */
export function renderCurvedArrowShape(shapType: string, ctx: CurvedArrowContext): string {
  // Try directional curved arrows
  if (
    shapType === "curvedDownArrow" ||
    shapType === "curvedLeftArrow" ||
    shapType === "curvedRightArrow" ||
    shapType === "curvedUpArrow"
  ) {
    return renderDirectionalCurvedArrowShape(shapType, ctx);
  }

  // Try swoosh arrow
  if (shapType === "swooshArrow") {
    return renderSwooshArrowShape(shapType, ctx);
  }

  // Try circular arrows
  if (shapType === "circularArrow" || shapType === "leftCircularArrow") {
    return renderCircularArrowShape(shapType, ctx);
  }

  return "";
}
