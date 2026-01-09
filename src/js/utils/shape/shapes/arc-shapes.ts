/**
 * Arc and circular shape rendering functions.
 *
 * Handles arc/circular shapes:
 * - pie, pieWedge, arc, chord
 * - frame, donut, noSmoking
 * - halfFrame, blockArc
 */

import type { ArcShapeContext } from "./arc-shapes/types";
import { renderPieArcShape } from "./arc-shapes/pie-arc";
import { renderChord } from "./arc-shapes/chord";
import { renderFrame } from "./arc-shapes/frame";
import { renderDonut } from "./arc-shapes/donut";
import { renderNoSmoking } from "./arc-shapes/no-smoking";
import { renderHalfFrame } from "./arc-shapes/half-frame";
import { renderBlockArc } from "./arc-shapes/block-arc";

export type { ArcShapeContext } from "./arc-shapes/types";

/**
 * List of arc shape types handled by this module
 */
export const ARC_SHAPE_TYPES = [
  "pie",
  "pieWedge",
  "arc",
  "chord",
  "frame",
  "donut",
  "noSmoking",
  "halfFrame",
  "blockArc",
] as const;

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const ARC_SHAPE_RENDERERS: Record<string, (ctx: ArcShapeContext, shapType: string) => string> = {
  pie: renderPieArcShape,
  pieWedge: renderPieArcShape,
  arc: renderPieArcShape,
  chord: (ctx) => renderChord(ctx),
  frame: (ctx) => renderFrame(ctx),
  donut: (ctx) => renderDonut(ctx),
  noSmoking: (ctx) => renderNoSmoking(ctx),
  halfFrame: (ctx) => renderHalfFrame(ctx),
  blockArc: (ctx) => renderBlockArc(ctx),
};

/**
 * Check if a shape type is an arc shape handled by this module
 */
export function isArcShape(shapType: string): boolean {
  return shapType in ARC_SHAPE_RENDERERS;
}

/**
 * Render an arc shape
 */
export function renderArcShape(shapType: string, ctx: ArcShapeContext): string {
  const renderer = ARC_SHAPE_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
