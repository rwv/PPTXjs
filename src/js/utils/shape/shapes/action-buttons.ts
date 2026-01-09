/**
 * Action button shape rendering functions.
 *
 * Handles PowerPoint action button shapes:
 * - actionButtonBackPrevious, actionButtonBeginning, actionButtonDocument
 * - actionButtonEnd, actionButtonForwardNext, actionButtonHelp
 * - actionButtonHome, actionButtonInformation, actionButtonMovie
 * - actionButtonReturn, actionButtonSound
 *
 * Note: actionButtonBlank shares rendering with rect and remains in gen-shape.ts
 */

import type { ActionButtonContext } from "./action-buttons/types";
import {
  renderActionButtonBackPrevious,
  renderActionButtonBeginning,
  renderActionButtonEnd,
  renderActionButtonForwardNext,
  renderActionButtonReturn,
} from "./action-buttons/navigation";
import {
  renderActionButtonDocument,
  renderActionButtonHelp,
  renderActionButtonHome,
  renderActionButtonInformation,
} from "./action-buttons/info";
import { renderActionButtonMovie, renderActionButtonSound } from "./action-buttons/media";

export type { ActionButtonContext } from "./action-buttons/types";

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

// =============================================================================
// Shape Registry
// =============================================================================

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
 * Check if a shape type is an action button
 */
export function isActionButtonShape(shapType: string): boolean {
  return shapType in ACTION_BUTTON_RENDERERS;
}

/**
 * Render an action button shape
 */
export function renderActionButtonShape(shapType: string, ctx: ActionButtonContext): string {
  const renderer = ACTION_BUTTON_RENDERERS[shapType];
  return renderer ? renderer(ctx) : "";
}
