/**
 * Ribbon and wave shape rendering module.
 *
 * Handles ribbon and wave shapes:
 * - leftRightRibbon, ribbon, ribbon2
 * - wave, doubleWave
 * - ellipseRibbon, ellipseRibbon2
 */

// Export shared utilities and types
export type { RibbonContext } from "./shared";
export { getFillAttr, getStrokeAttrs, createPath } from "./shared";

// Export individual renderers
export { renderLeftRightRibbon } from "./left-right-ribbon";
export { renderRibbon } from "./ribbon";
export { renderWave } from "./wave";
export { renderEllipseRibbon } from "./ellipse-ribbon";

// Import for building the renderers map
import type { RibbonContext } from "./shared";
import { renderLeftRightRibbon } from "./left-right-ribbon";
import { renderRibbon } from "./ribbon";
import { renderWave } from "./wave";
import { renderEllipseRibbon } from "./ellipse-ribbon";

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

/**
 * Registry mapping shape types to their render functions
 */
const RIBBON_RENDERERS: Record<string, (ctx: RibbonContext, shapType: string) => string> = {
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
export function isRibbonShape(shapType: string): boolean {
  return shapType in RIBBON_RENDERERS;
}

/**
 * Render a ribbon shape
 * @returns SVG string for the shape, or empty string if not a ribbon shape
 */
export function renderRibbonShape(shapType: string, ctx: RibbonContext): string {
  const renderer = RIBBON_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
