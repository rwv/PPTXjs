/**
 * Math shape rendering module
 *
 * Handles mathematical symbol shapes:
 * - mathDivide, mathEqual, mathMinus
 * - mathMultiply, mathNotEqual, mathPlus
 */

// Export shared utilities and types
export type { MathShapeContext } from "./shared";
export { getFillAttr, getStrokeAttrs, createPath } from "./shared";

// Export individual renderers
export { renderMathNotEqual } from "./math-not-equal";
export { renderMathDivide } from "./math-divide";
export { renderMathEqual } from "./math-equal";
export { renderMathMinus } from "./math-minus";
export { renderMathMultiply } from "./math-multiply";
export { renderMathPlus } from "./math-plus";

// Import for main renderer
import type { MathShapeContext } from "./shared";
import { renderMathNotEqual } from "./math-not-equal";
import { renderMathDivide } from "./math-divide";
import { renderMathEqual } from "./math-equal";
import { renderMathMinus } from "./math-minus";
import { renderMathMultiply } from "./math-multiply";
import { renderMathPlus } from "./math-plus";

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
export function isMathShape(shapType: string): boolean {
  return shapType in MATH_SHAPE_RENDERERS;
}

/**
 * Render a math shape
 * @returns SVG string for the shape, or empty string if not a math shape
 */
export function renderMathShapeType(shapType: string, ctx: MathShapeContext): string {
  const renderer = MATH_SHAPE_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
