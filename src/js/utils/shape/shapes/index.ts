/**
 * Shape category modules
 *
 * Each module handles a specific category of PowerPoint shapes.
 */

export { isStarShape, renderStarShape, STAR_SHAPE_TYPES } from "./stars";
export type { StarShapeContext } from "./stars";

export { isFlowchartShape, renderFlowchartShape, FLOWCHART_SHAPE_TYPES } from "./flowchart";
export type { FlowchartShapeContext } from "./flowchart";

export { isActionButtonShape, renderActionButtonShape, ACTION_BUTTON_TYPES } from "./action-buttons";
export type { ActionButtonContext } from "./action-buttons";

export { isArrowShape, renderArrowShape, ARROW_SHAPE_TYPES } from "./arrows";
export type { ArrowShapeContext } from "./arrows";

export { isCurvedArrowShape, renderCurvedArrowShape, CURVED_ARROW_TYPES } from "./curved-arrows";
export type { CurvedArrowContext } from "./curved-arrows";
