/**
 * Curved arrow shape rendering functions.
 *
 * This module handles all curved arrow shapes:
 * - Directional curved arrows (curvedDownArrow, curvedLeftArrow, curvedRightArrow, curvedUpArrow)
 * - Swoosh arrow (swooshArrow)
 * - Circular arrows (circularArrow, leftCircularArrow)
 */

// Re-export shared types and utilities
export { CurvedArrowContext, getFillAttr, getStrokeAttrs, createPath } from "./shared";

// Import individual renderers
import { renderCurvedDownArrow } from "./curved-down-arrow";
import { renderCurvedLeftArrow } from "./curved-left-arrow";
import { renderCurvedRightArrow } from "./curved-right-arrow";
import { renderCurvedUpArrow } from "./curved-up-arrow";
import { renderSwooshArrow } from "./swoosh-arrow";
import { renderCircularArrow } from "./circular-arrow";
import { renderLeftCircularArrow } from "./left-circular-arrow";

// Re-export individual renderers
export { renderCurvedDownArrow } from "./curved-down-arrow";
export { renderCurvedLeftArrow } from "./curved-left-arrow";
export { renderCurvedRightArrow } from "./curved-right-arrow";
export { renderCurvedUpArrow } from "./curved-up-arrow";
export { renderSwooshArrow } from "./swoosh-arrow";
export { renderCircularArrow } from "./circular-arrow";
export { renderLeftCircularArrow } from "./left-circular-arrow";

import type { CurvedArrowContext } from "./shared";

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

/**
 * Registry mapping shape types to their render functions
 */
const CURVED_ARROW_RENDERERS: Record<string, (ctx: CurvedArrowContext) => string> = {
  curvedDownArrow: renderCurvedDownArrow,
  curvedLeftArrow: renderCurvedLeftArrow,
  curvedRightArrow: renderCurvedRightArrow,
  curvedUpArrow: renderCurvedUpArrow,
  swooshArrow: renderSwooshArrow,
  circularArrow: renderCircularArrow,
  leftCircularArrow: renderLeftCircularArrow,
};

/**
 * Check if a shape type is a curved arrow shape handled by this module
 */
export function isCurvedArrowShape(shapType: string): boolean {
  return shapType in CURVED_ARROW_RENDERERS;
}

/**
 * Render a curved arrow shape
 * @returns SVG string for the shape, or empty string if not a curved arrow shape
 */
export function renderCurvedArrowShape(shapType: string, ctx: CurvedArrowContext): string {
  const renderer = CURVED_ARROW_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
