/**
 * Ribbon and wave shape rendering functions.
 *
 * Handles ribbon and wave shapes:
 * - leftRightRibbon, ribbon, ribbon2
 * - wave, doubleWave
 * - ellipseRibbon, ellipseRibbon2
 */

import type { RibbonContext } from "./ribbons/types";
import { renderLeftRightRibbon } from "./ribbons/left-right";
import { renderRibbon } from "./ribbons/ribbon";
import { renderWave } from "./ribbons/wave";
import { renderEllipseRibbon } from "./ribbons/ellipse";

export type { RibbonContext } from "./ribbons/types";

/**
 * List of ribbon shape types handled by this module
 */
export const RIBBON_SHAPE_TYPES = [
  "leftRightRibbon",
  "ribbon",
  "ribbon2",
  "wave",
  "doubleWave",
  "ellipseRibbon",
  "ellipseRibbon2",
] as const;

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const RIBBON_RENDERERS: Record<
  string,
  (options: { ctx: RibbonContext; shapeType: string }) => string
> = {
  leftRightRibbon: (ctx) => renderLeftRightRibbon(ctx),
  ribbon: renderRibbon,
  ribbon2: renderRibbon,
  wave: renderWave,
  doubleWave: renderWave,
  ellipseRibbon: renderEllipseRibbon,
  ellipseRibbon2: renderEllipseRibbon,
};

/**
 * Check if a shape type is a ribbon shape handled by this module
 */
type IsRibbonShapeOptions = {
  shapeType: string | undefined;
};

export function isRibbonShape({ shapeType }: IsRibbonShapeOptions): boolean {
  return shapeType !== undefined && shapeType in RIBBON_RENDERERS;
}

/**
 * Render a ribbon shape
 * @returns SVG string for the shape, or empty string if not a ribbon shape
 */
type RenderRibbonShapeOptions = {
  shapeType: string;
  ctx: RibbonContext;
};

export function renderRibbonShape({ shapeType, ctx }: RenderRibbonShapeOptions): string {
  const renderer = RIBBON_RENDERERS[shapeType];
  return renderer ? renderer({ ctx, shapeType }) : "";
}
