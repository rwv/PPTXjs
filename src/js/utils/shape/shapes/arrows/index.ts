/**
 * Arrow shape rendering module.
 *
 * Handles basic arrows, complex arrows, and arrow callouts.
 */

// Export shared utilities and types
export type { ArrowShapeContext } from "./shared";
export { getFillAttr, getStrokeAttrs, createPolygon, createPath } from "./shared";

// Export basic arrow renderers
export { renderRightArrow, renderLeftArrow, renderDownArrow, renderUpArrow, renderLeftRightArrow, renderUpDownArrow } from "./basic";

// Export complex arrow renderers
export {
  renderQuadArrow,
  renderLeftRightUpArrow,
  renderLeftUpArrow,
  renderBentUpArrow,
  renderBentArrow,
  renderUturnArrow,
  renderStripedRightArrow,
  renderNotchedRightArrow,
} from "./complex";

// Export arrow callout renderers
export {
  renderRightArrowCallout,
  renderDownArrowCallout,
  renderLeftArrowCallout,
  renderUpArrowCallout,
  renderLeftRightArrowCallout,
  renderQuadArrowCallout,
  renderUpDownArrowCallout,
} from "./callouts";

// Import for building the renderers map
import type { ArrowShapeContext } from "./shared";
import { renderRightArrow, renderLeftArrow, renderDownArrow, renderUpArrow, renderLeftRightArrow, renderUpDownArrow } from "./basic";
import {
  renderQuadArrow,
  renderLeftRightUpArrow,
  renderLeftUpArrow,
  renderBentUpArrow,
  renderBentArrow,
  renderUturnArrow,
  renderStripedRightArrow,
  renderNotchedRightArrow,
} from "./complex";
import {
  renderRightArrowCallout,
  renderDownArrowCallout,
  renderLeftArrowCallout,
  renderUpArrowCallout,
  renderLeftRightArrowCallout,
  renderQuadArrowCallout,
  renderUpDownArrowCallout,
} from "./callouts";

/**
 * List of arrow shape types handled by this module
 */
export const ARROW_SHAPE_TYPES = [
  // Basic arrows
  "rightArrow",
  "leftArrow",
  "downArrow",
  "upArrow",
  "leftRightArrow",
  "upDownArrow",
  // Complex arrows
  "quadArrow",
  "leftRightUpArrow",
  "leftUpArrow",
  "bentUpArrow",
  "bentArrow",
  "uturnArrow",
  "stripedRightArrow",
  "notchedRightArrow",
  // Arrow callouts
  "rightArrowCallout",
  "downArrowCallout",
  "leftArrowCallout",
  "upArrowCallout",
  "leftRightArrowCallout",
  "quadArrowCallout",
  "upDownArrowCallout",
  // Shared with flowchart
  "flowChartOffpageConnector",
] as const;

/**
 * Arrow shape type to renderer mapping
 */
const ARROW_RENDERERS: Record<string, (ctx: ArrowShapeContext, shapType?: string) => string> = {
  rightArrow: renderRightArrow,
  leftArrow: renderLeftArrow,
  downArrow: (ctx) => renderDownArrow(ctx, "downArrow"),
  flowChartOffpageConnector: (ctx) => renderDownArrow(ctx, "flowChartOffpageConnector"),
  upArrow: renderUpArrow,
  leftRightArrow: renderLeftRightArrow,
  upDownArrow: renderUpDownArrow,
  quadArrow: renderQuadArrow,
  leftRightUpArrow: renderLeftRightUpArrow,
  leftUpArrow: renderLeftUpArrow,
  bentUpArrow: renderBentUpArrow,
  bentArrow: renderBentArrow,
  uturnArrow: renderUturnArrow,
  stripedRightArrow: renderStripedRightArrow,
  notchedRightArrow: renderNotchedRightArrow,
  rightArrowCallout: renderRightArrowCallout,
  downArrowCallout: renderDownArrowCallout,
  leftArrowCallout: renderLeftArrowCallout,
  upArrowCallout: renderUpArrowCallout,
  leftRightArrowCallout: renderLeftRightArrowCallout,
  quadArrowCallout: renderQuadArrowCallout,
  upDownArrowCallout: renderUpDownArrowCallout,
};

/**
 * Check if a shape type is an arrow shape
 */
export function isArrowShape(shapType: string): boolean {
  return shapType in ARROW_RENDERERS;
}

/**
 * Render an arrow shape SVG path
 *
 * @param shapType - The arrow shape type
 * @param ctx - The shape rendering context
 * @returns SVG path/polygon string or empty string if not an arrow shape
 */
export function renderArrowShape(shapType: string, ctx: ArrowShapeContext): string {
  const renderer = ARROW_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
