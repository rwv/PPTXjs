/**
 * Arrow shape rendering functions.
 *
 * Handles basic arrow shapes, complex arrows, and arrow callouts:
 * - Basic: rightArrow, leftArrow, downArrow, upArrow, leftRightArrow, upDownArrow
 * - Complex: quadArrow, leftRightUpArrow, leftUpArrow, bentUpArrow, bentArrow,
 *            uturnArrow, stripedRightArrow, notchedRightArrow
 * - Callouts: rightArrowCallout, downArrowCallout, leftArrowCallout, upArrowCallout,
 *             leftRightArrowCallout, quadArrowCallout, upDownArrowCallout
 *
 * Note: downArrow also handles flowChartOffpageConnector
 */

import type { ArrowShapeContext } from "./arrows/types";
import {
  renderDownArrow,
  renderLeftArrow,
  renderLeftRightArrow,
  renderRightArrow,
  renderUpArrow,
  renderUpDownArrow,
} from "./arrows/basic";
import {
  renderBentArrow,
  renderBentUpArrow,
  renderLeftRightUpArrow,
  renderLeftUpArrow,
  renderNotchedRightArrow,
  renderQuadArrow,
  renderStripedRightArrow,
  renderUturnArrow,
} from "./arrows/complex";
import {
  renderDownArrowCallout,
  renderLeftArrowCallout,
  renderLeftRightArrowCallout,
  renderQuadArrowCallout,
  renderRightArrowCallout,
  renderUpArrowCallout,
  renderUpDownArrowCallout,
} from "./arrows/callouts";

export type { ArrowShapeContext } from "./arrows/types";

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

// =============================================================================
// Shape Registry
// =============================================================================

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

export function isArrowShape(shapType: string): boolean {
  return shapType in ARROW_RENDERERS;
}

export function renderArrowShape(shapType: string, ctx: ArrowShapeContext): string {
  const renderer = ARROW_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
