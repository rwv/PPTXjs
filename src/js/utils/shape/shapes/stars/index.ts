/**
 * Star shape rendering module.
 *
 * Handles star shapes with 4-32 points:
 * - star4, star5, star6, star7, star8 (small stars)
 * - star10, star12, star16, star24, star32 (large stars)
 */

// Export shared utilities and types
export type { StarShapeContext } from "./shared";
export { createStarPath, parseSingleAdj, parseMultiAdj, clamp } from "./shared";

// Export individual star renderers
export { renderStar4 } from "./star4";
export { renderStar5 } from "./star5";
export { renderStar6 } from "./star6";
export { renderStar7 } from "./star7";
export { renderStar8 } from "./star8";
export { renderStar10 } from "./star10";
export { renderStar12 } from "./star12";
export { renderStar16 } from "./star16";
export { renderStar24 } from "./star24";
export { renderStar32 } from "./star32";

// Import for building the renderers map
import type { StarShapeContext } from "./shared";
import { renderStar4 } from "./star4";
import { renderStar5 } from "./star5";
import { renderStar6 } from "./star6";
import { renderStar7 } from "./star7";
import { renderStar8 } from "./star8";
import { renderStar10 } from "./star10";
import { renderStar12 } from "./star12";
import { renderStar16 } from "./star16";
import { renderStar24 } from "./star24";
import { renderStar32 } from "./star32";

/**
 * Star shape type to renderer mapping
 */
const STAR_RENDERERS: Record<string, (ctx: StarShapeContext) => string> = {
  star4: renderStar4,
  star5: renderStar5,
  star6: renderStar6,
  star7: renderStar7,
  star8: renderStar8,
  star10: renderStar10,
  star12: renderStar12,
  star16: renderStar16,
  star24: renderStar24,
  star32: renderStar32,
};

/**
 * List of all supported star shape types
 */
export const STAR_SHAPE_TYPES = Object.keys(STAR_RENDERERS);

/**
 * Check if a shape type is a star shape
 */
export function isStarShape(shapType: string): boolean {
  return shapType in STAR_RENDERERS;
}

/**
 * Render a star shape SVG path
 *
 * @param shapType - The star shape type (star4, star5, etc.)
 * @param ctx - The shape rendering context
 * @returns SVG path string or empty string if not a star shape
 */
export function renderStarShape(shapType: string, ctx: StarShapeContext): string {
  const renderer = STAR_RENDERERS[shapType];
  if (renderer) {
    return renderer(ctx);
  }
  return "";
}
