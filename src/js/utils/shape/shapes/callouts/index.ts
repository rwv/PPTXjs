/**
 * Callout shape rendering module.
 *
 * Handles callout shapes:
 * - wedgeEllipseCallout, wedgeRectCallout, wedgeRoundRectCallout
 * - borderCallout1/2/3, callout1/2/3
 * - accentBorderCallout1/2/3, accentCallout1/2/3
 */

// Export shared utilities and types
export type { CalloutContext } from "./shared";
export { getFillAttr, getStrokeAttrs, createPath } from "./shared";

// Export individual renderers
export { renderWedgeEllipseCallout } from "./wedge-ellipse-callout";
export { renderWedgeRectCallout } from "./wedge-rect-callout";
export { renderWedgeRoundRectCallout } from "./wedge-round-rect-callout";
export { renderBorderAccentCallout } from "./border-accent-callout";

// Import for building the renderers map
import type { CalloutContext } from "./shared";
import { renderWedgeEllipseCallout } from "./wedge-ellipse-callout";
import { renderWedgeRectCallout } from "./wedge-rect-callout";
import { renderWedgeRoundRectCallout } from "./wedge-round-rect-callout";
import { renderBorderAccentCallout } from "./border-accent-callout";

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

/**
 * Registry mapping shape types to their render functions
 */
const CALLOUT_RENDERERS: Record<string, (ctx: CalloutContext, shapType: string) => string> = {
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
export function isCalloutShape(shapType: string): boolean {
  return shapType in CALLOUT_RENDERERS;
}

/**
 * Render a callout shape
 * @returns SVG string for the shape, or empty string if not a callout shape
 */
export function renderCalloutShape(shapType: string, ctx: CalloutContext): string {
  const renderer = CALLOUT_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
