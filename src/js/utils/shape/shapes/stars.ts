/**
 * Star shape rendering functions.
 *
 * Handles star shapes with 4-32 points:
 * - star4, star5, star6, star7, star8
 * - star10, star12, star16, star24, star32
 */

import type { StarShapeContext } from "./stars/types";
import { renderStar4, renderStar5, renderStar6, renderStar7, renderStar8 } from "./stars/star-4-8";
import {
  renderStar10,
  renderStar12,
  renderStar16,
  renderStar24,
  renderStar32,
} from "./stars/star-10-32";

export type { StarShapeContext } from "./stars/types";

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
type IsStarShapeOptions = {
  shapeType: string | undefined;
};

export function isStarShape({ shapeType }: IsStarShapeOptions): boolean {
  return shapeType !== undefined && shapeType in STAR_RENDERERS;
}

/**
 * Render a star shape SVG path
 *
 * @param shapeType - The star shape type (star4, star5, etc.)
 * @param ctx - The shape rendering context
 * @returns SVG path string or empty string if not a star shape
 */
type RenderStarShapeOptions = {
  shapeType: string;
  ctx: StarShapeContext;
};

export function renderStarShape({ shapeType, ctx }: RenderStarShapeOptions): string {
  const renderer = STAR_RENDERERS[shapeType];
  if (renderer) {
    return renderer(ctx);
  }
  return "";
}
