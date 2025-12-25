/**
 * Action button shape rendering module.
 *
 * Handles PowerPoint action button shapes:
 * - Navigation: back/previous, forward/next, beginning, end
 * - Utility: home, help, information, return
 * - Media: document, movie, sound
 *
 * Note: actionButtonBlank shares rendering with rect and remains in gen-shape.ts
 */

// Export shared utilities and types
export type { ActionButtonContext } from "./shared";
export { getFillAttr, getStrokeAttrs, createPath } from "./shared";

// Export navigation button renderers
export {
  renderActionButtonBackPrevious,
  renderActionButtonForwardNext,
  renderActionButtonBeginning,
  renderActionButtonEnd,
} from "./navigation";

// Export utility button renderers
export {
  renderActionButtonHome,
  renderActionButtonHelp,
  renderActionButtonInformation,
  renderActionButtonReturn,
} from "./utility";

// Export media button renderers
export {
  renderActionButtonDocument,
  renderActionButtonMovie,
  renderActionButtonSound,
} from "./media";

// Import for building the renderers map
import type { ActionButtonContext } from "./shared";
import {
  renderActionButtonBackPrevious,
  renderActionButtonForwardNext,
  renderActionButtonBeginning,
  renderActionButtonEnd,
} from "./navigation";
import {
  renderActionButtonHome,
  renderActionButtonHelp,
  renderActionButtonInformation,
  renderActionButtonReturn,
} from "./utility";
import {
  renderActionButtonDocument,
  renderActionButtonMovie,
  renderActionButtonSound,
} from "./media";

/**
 * List of action button shape types handled by this module
 */
export const ACTION_BUTTON_TYPES = [
  "actionButtonBackPrevious",
  "actionButtonBeginning",
  "actionButtonDocument",
  "actionButtonEnd",
  "actionButtonForwardNext",
  "actionButtonHelp",
  "actionButtonHome",
  "actionButtonInformation",
  "actionButtonMovie",
  "actionButtonReturn",
  "actionButtonSound",
] as const;

/**
 * Action button shape type to renderer mapping
 */
const ACTION_BUTTON_RENDERERS: Record<string, (ctx: ActionButtonContext) => string> = {
  actionButtonBackPrevious: renderActionButtonBackPrevious,
  actionButtonBeginning: renderActionButtonBeginning,
  actionButtonDocument: renderActionButtonDocument,
  actionButtonEnd: renderActionButtonEnd,
  actionButtonForwardNext: renderActionButtonForwardNext,
  actionButtonHelp: renderActionButtonHelp,
  actionButtonHome: renderActionButtonHome,
  actionButtonInformation: renderActionButtonInformation,
  actionButtonMovie: renderActionButtonMovie,
  actionButtonReturn: renderActionButtonReturn,
  actionButtonSound: renderActionButtonSound,
};

/**
 * Check if a shape type is an action button shape
 */
export function isActionButtonShape(shapType: string): boolean {
  return shapType in ACTION_BUTTON_RENDERERS;
}

/**
 * Render an action button shape SVG path
 *
 * @param shapType - The action button shape type
 * @param ctx - The shape rendering context
 * @returns SVG path string or empty string if not an action button shape
 */
export function renderActionButtonShape(shapType: string, ctx: ActionButtonContext): string {
  const renderer = ACTION_BUTTON_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
