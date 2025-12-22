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

export { isCalloutShape, renderCalloutShape, CALLOUT_SHAPE_TYPES } from "./callouts";
export type { CalloutContext } from "./callouts";

export { isRibbonShape, renderRibbonShape, RIBBON_SHAPE_TYPES } from "./ribbons";
export type { RibbonContext } from "./ribbons";

export { isMathShape, renderMathShapeType, MATH_SHAPE_TYPES } from "./math-shapes";
export type { MathShapeContext } from "./math-shapes";

export { isBracketShape, renderBracketShape, BRACKET_SHAPE_TYPES } from "./brackets";
export type { BracketShapeContext } from "./brackets";

export { isArcShape, renderArcShape, ARC_SHAPE_TYPES } from "./arc-shapes";
export type { ArcShapeContext } from "./arc-shapes";

export { isPolygonShape, renderPolygonShape, POLYGON_SHAPE_TYPES } from "./polygons";
export type { PolygonShapeContext } from "./polygons";

export { isScrollShape, renderScrollShapeType, SCROLL_SHAPE_TYPES } from "./scrolls";
export type { ScrollShapeContext } from "./scrolls";

export { isMiscSymbolShape, renderMiscSymbolShape, MISC_SYMBOL_TYPES } from "./misc-symbols";
export type { MiscSymbolContext } from "./misc-symbols";

export { isPlateCylinderShape, renderPlateCylinderShape, PLATE_CYLINDER_TYPES } from "./plate-cylinder";
export type { PlateCylinderContext } from "./plate-cylinder";
