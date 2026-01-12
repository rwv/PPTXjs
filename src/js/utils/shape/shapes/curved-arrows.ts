/**
 * Curved arrow shape rendering functions.
 *
 * Handles curved and circular arrow shapes:
 * - curvedDownArrow, curvedLeftArrow, curvedRightArrow, curvedUpArrow
 * - swooshArrow
 * - circularArrow, leftCircularArrow
 */

import type { CurvedArrowContext } from "./curved-arrows/types";
import {
  renderCurvedDownArrow,
  renderCurvedLeftArrow,
  renderCurvedRightArrow,
  renderCurvedUpArrow,
} from "./curved-arrows/curved-basic";
import { renderSwooshArrow } from "./curved-arrows/swoosh";
import { renderCircularArrow, renderLeftCircularArrow } from "./curved-arrows/circular";

export type { CurvedArrowContext } from "./curved-arrows/types";

/**
 * List of curved arrow shape types handled by this module
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

// =============================================================================
// Shape Registry
// =============================================================================

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
type IsCurvedArrowShapeOptions = {
  shapeType: string | undefined;
};

export function isCurvedArrowShape({ shapeType }: IsCurvedArrowShapeOptions): boolean {
  return shapeType !== undefined && shapeType in CURVED_ARROW_RENDERERS;
}

/**
 * Render a curved arrow shape
 * @returns SVG string for the shape, or empty string if not a curved arrow shape
 */
type RenderCurvedArrowShapeOptions = {
  shapeType: string;
  ctx: CurvedArrowContext;
};

export function renderCurvedArrowShape({ shapeType, ctx }: RenderCurvedArrowShapeOptions): string {
  const renderer = CURVED_ARROW_RENDERERS[shapeType];
  return renderer ? renderer(ctx) : "";
}
