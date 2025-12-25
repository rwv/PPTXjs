/**
 * Circular arrow shape rendering module
 *
 * Handles circular arrow shapes:
 * - circularArrow, leftCircularArrow
 */

// Export shared utilities and types
export type { CircularArrowContext } from "./shared";
export { getFillAttr, getStrokeAttrs, createPath } from "./shared";

// Export individual renderers
export { renderCircularArrow } from "./circular-arrow";
export { renderLeftCircularArrow } from "./left-circular-arrow";

// Import for main renderer
import type { CircularArrowContext } from "./shared";
import { renderCircularArrow } from "./circular-arrow";
import { renderLeftCircularArrow } from "./left-circular-arrow";

/**
 * List of circular arrow shape types handled by this module
 */
export const CIRCULAR_ARROW_TYPES = ["circularArrow", "leftCircularArrow"] as const;

/**
 * Registry mapping shape types to their render functions
 */
const CIRCULAR_ARROW_RENDERERS: Record<string, (ctx: CircularArrowContext) => string> = {
  circularArrow: renderCircularArrow,
  leftCircularArrow: renderLeftCircularArrow,
};

/**
 * Check if a shape type is a circular arrow shape handled by this module
 */
export function isCircularArrowShape(shapType: string): boolean {
  return shapType in CIRCULAR_ARROW_RENDERERS;
}

/**
 * Render a circular arrow shape
 * @returns SVG string for the shape, or empty string if not a circular arrow shape
 */
export function renderCircularArrowShape(shapType: string, ctx: CircularArrowContext): string {
  const renderer = CIRCULAR_ARROW_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
