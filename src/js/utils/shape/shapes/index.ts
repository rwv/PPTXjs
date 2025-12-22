/**
 * Shape category modules
 *
 * Each module handles a specific category of PowerPoint shapes.
 */

export { isStarShape, renderStarShape, STAR_SHAPE_TYPES } from "./stars";
export type { StarShapeContext } from "./stars";

export { isFlowchartShape, renderFlowchartShape, FLOWCHART_SHAPE_TYPES } from "./flowchart";
export type { FlowchartShapeContext } from "./flowchart";
