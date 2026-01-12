/**
 * Math shape rendering functions.
 *
 * Handles mathematical symbol shapes:
 * - mathDivide, mathEqual, mathMinus
 * - mathMultiply, mathNotEqual, mathPlus
 */

import type { MathShapeContext } from "./math-shapes/types";
import { renderMathDivide } from "./math-shapes/divide";
import { renderMathEqual } from "./math-shapes/equal";
import { renderMathMinus } from "./math-shapes/minus";
import { renderMathMultiply } from "./math-shapes/multiply";
import { renderMathNotEqual } from "./math-shapes/not-equal";
import { renderMathPlus } from "./math-shapes/plus";

export type { MathShapeContext } from "./math-shapes/types";

/**
 * List of math shape types handled by this module
 */
export const MATH_SHAPE_TYPES = [
  "mathDivide",
  "mathEqual",
  "mathMinus",
  "mathMultiply",
  "mathNotEqual",
  "mathPlus",
] as const;

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const MATH_SHAPE_RENDERERS: Record<string, (ctx: MathShapeContext) => string> = {
  mathDivide: renderMathDivide,
  mathEqual: renderMathEqual,
  mathMinus: renderMathMinus,
  mathMultiply: renderMathMultiply,
  mathNotEqual: renderMathNotEqual,
  mathPlus: renderMathPlus,
};

/**
 * Check if a shape type is a math shape handled by this module
 */
type IsMathShapeOptions = {
  shapeType: string | undefined;
};

export function isMathShape({ shapeType }: IsMathShapeOptions): boolean {
  return shapeType !== undefined && shapeType in MATH_SHAPE_RENDERERS;
}

/**
 * Render a math shape
 * @returns SVG string for the shape, or empty string if not a math shape
 */
type RenderMathShapeTypeOptions = {
  shapeType: string;
  ctx: MathShapeContext;
};

export function renderMathShapeType({ shapeType, ctx }: RenderMathShapeTypeOptions): string {
  const renderer = MATH_SHAPE_RENDERERS[shapeType];
  return renderer ? renderer(ctx) : "";
}
