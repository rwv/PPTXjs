/**
 * Callout shape rendering functions.
 *
 * Handles callout shapes:
 * - wedgeEllipseCallout, wedgeRectCallout, wedgeRoundRectCallout
 * - borderCallout1/2/3, callout1/2/3
 * - accentBorderCallout1/2/3, accentCallout1/2/3
 */

import type { CalloutContext } from "./callouts/types";
import {
  renderWedgeEllipseCallout,
  renderWedgeRectCallout,
  renderWedgeRoundRectCallout,
} from "./callouts/wedge";
import { renderBorderAccentCallout } from "./callouts/border-accent";

export type { CalloutContext } from "./callouts/types";

type CalloutRendererOptions = {
  ctx: CalloutContext;
  shapeType: string;
};

/**
 * List of callout shape types handled by this module
 */
export const CALLOUT_SHAPE_TYPES = [
  "wedgeEllipseCallout",
  "wedgeRectCallout",
  "wedgeRoundRectCallout",
  "accentBorderCallout1",
  "accentBorderCallout2",
  "accentBorderCallout3",
  "borderCallout1",
  "borderCallout2",
  "borderCallout3",
  "accentCallout1",
  "accentCallout2",
  "accentCallout3",
  "callout1",
  "callout2",
  "callout3",
] as const;

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const CALLOUT_RENDERERS: Record<string, (options: CalloutRendererOptions) => string> = {
  wedgeEllipseCallout: (ctx) => renderWedgeEllipseCallout(ctx),
  wedgeRectCallout: (ctx) => renderWedgeRectCallout(ctx),
  wedgeRoundRectCallout: (ctx) => renderWedgeRoundRectCallout(ctx),
  accentBorderCallout1: renderBorderAccentCallout,
  accentBorderCallout2: renderBorderAccentCallout,
  accentBorderCallout3: renderBorderAccentCallout,
  borderCallout1: renderBorderAccentCallout,
  borderCallout2: renderBorderAccentCallout,
  borderCallout3: renderBorderAccentCallout,
  accentCallout1: renderBorderAccentCallout,
  accentCallout2: renderBorderAccentCallout,
  accentCallout3: renderBorderAccentCallout,
  callout1: renderBorderAccentCallout,
  callout2: renderBorderAccentCallout,
  callout3: renderBorderAccentCallout,
};

/**
 * Check if a shape type is a callout shape handled by this module
 */
type IsCalloutShapeOptions = {
  shapeType: string | undefined;
};

export function isCalloutShape({ shapeType }: IsCalloutShapeOptions): boolean {
  return shapeType !== undefined && shapeType in CALLOUT_RENDERERS;
}

/**
 * Render a callout shape
 * @returns SVG string for the shape, or empty string if not a callout shape
 */
type RenderCalloutShapeOptions = {
  shapeType: string;
  ctx: CalloutContext;
};

export function renderCalloutShape({ shapeType, ctx }: RenderCalloutShapeOptions): string {
  const renderer = CALLOUT_RENDERERS[shapeType];
  return renderer ? renderer({ ctx, shapeType }) : "";
}
