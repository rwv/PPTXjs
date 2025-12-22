/**
 * Plate and cylinder shape rendering functions.
 *
 * Handles plate shapes (arrow-like pentagons):
 * - homePlate, chevron
 *
 * Handles cylinder shapes (3D containers):
 * - can, flowChartMagneticDisk, flowChartMagneticDrum
 */

import { shapeArc } from "./helpers/arc";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering plate and cylinder shapes
 */
export interface PlateCylinderContext {
    node: any;
    w: number;
    h: number;
    shpId: string;
    fillColor: string;
    grndFillFlg: boolean;
    imgFillFlg: boolean;
    border: {
        color: string;
        width: string;
        strokeDasharray: string;
    };
    slideFactor: number;
}

/**
 * List of plate and cylinder shape types handled by this module
 */
export const PLATE_CYLINDER_TYPES = [
    "homePlate",
    "chevron",
    "can",
    "flowChartMagneticDisk",
    "flowChartMagneticDrum"
] as const;

/**
 * Generate fill attribute string for SVG
 */
function getFillAttr(ctx: PlateCylinderContext): string {
    const { imgFillFlg, grndFillFlg, shpId, fillColor } = ctx;
    if (imgFillFlg) {
        return `url(#imgPtrn_${shpId})`;
    }
    if (grndFillFlg) {
        return `url(#linGrd_${shpId})`;
    }
    return fillColor;
}

/**
 * Generate stroke attributes string for SVG
 */
function getStrokeAttrs(ctx: PlateCylinderContext): string {
    const { border } = ctx;
    return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

// =============================================================================
// Plate Shape Renderers (Arrow-like pentagons)
// =============================================================================

/**
 * Render homePlate shape (pentagon arrow pointing right)
 */
function renderHomePlate(ctx: PlateCylinderContext): string {
    const { node, w, h, slideFactor } = ctx;

    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var adj = 50000 * slideFactor;
    var cnstVal1 = 100000 * slideFactor;
    if (shapAdjst !== undefined) {
        adj = parseInt(shapAdjst.substr(4)) * slideFactor;
    }
    var a, x1, dx1, maxAdj, vc = h / 2;
    var minWH = Math.min(w, h);
    maxAdj = cnstVal1 * w / minWH;
    if (adj < 0) a = 0
    else if (adj > maxAdj) a = maxAdj
    else a = adj
    dx1 = minWH * a / cnstVal1;
    x1 = w - dx1;

    var d_val = "M" + 0 + "," + 0 +
        " L" + x1 + "," + 0 +
        " L" + w + "," + vc +
        " L" + x1 + "," + h +
        " L" + 0 + "," + h + " z";

    return `<path  d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

/**
 * Render chevron shape (hexagon arrow pointing right)
 */
function renderChevron(ctx: PlateCylinderContext): string {
    const { node, w, h, slideFactor } = ctx;

    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var adj = 50000 * slideFactor;
    var cnstVal1 = 100000 * slideFactor;
    if (shapAdjst !== undefined) {
        adj = parseInt(shapAdjst.substr(4)) * slideFactor;
    }
    var a, x1, x2, maxAdj, vc = h / 2;
    var minWH = Math.min(w, h);
    maxAdj = cnstVal1 * w / minWH;
    if (adj < 0) a = 0
    else if (adj > maxAdj) a = maxAdj
    else a = adj
    x1 = minWH * a / cnstVal1;
    x2 = w - x1;

    var d_val = "M" + 0 + "," + 0 +
        " L" + x2 + "," + 0 +
        " L" + w + "," + vc +
        " L" + x2 + "," + h +
        " L" + 0 + "," + h +
        " L" + x1 + "," + vc + " z";

    return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Cylinder Shape Renderers
// =============================================================================

/**
 * Render can/cylinder shapes (can, flowChartMagneticDisk, flowChartMagneticDrum)
 */
function renderCylinder(ctx: PlateCylinderContext, shapType: string): string {
    const { node, w, h, slideFactor } = ctx;

    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var adj = 25000 * slideFactor;
    var cnstVal1 = 50000 * slideFactor;
    var cnstVal2 = 200000 * slideFactor;
    if (shapAdjst !== undefined) {
        adj = parseInt(shapAdjst.substr(4)) * slideFactor;
    }
    var ss = Math.min(w, h);
    var maxAdj, a, y1, y2, y3, dVal;

    if (shapType == "flowChartMagneticDisk" || shapType == "flowChartMagneticDrum") {
        adj = 50000 * slideFactor;
    }

    maxAdj = cnstVal1 * h / ss;
    a = (adj < 0) ? 0 : (adj > maxAdj) ? maxAdj : adj;
    y1 = ss * a / cnstVal2;
    y2 = y1 + y1;
    y3 = h - y1;
    var cd2 = 180, wd2 = w / 2;

    var tranglRott = "";
    if (shapType == "flowChartMagneticDrum") {
        tranglRott = `transform='rotate(90 ${w / 2},${h / 2})'`;
    }

    dVal = shapeArc(wd2, y1, wd2, y1, 0, cd2, false) +
        shapeArc(wd2, y1, wd2, y1, cd2, cd2 + cd2, false).replace("M", "L") +
        " L" + w + "," + y3 +
        shapeArc(wd2, y3, wd2, y1, 0, cd2, false).replace("M", "L") +
        " L" + 0 + "," + y1;

    return `<path ${tranglRott} d='${dVal}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Shape Registry
// =============================================================================

/**
 * Registry mapping shape types to their render functions
 */
const PLATE_CYLINDER_RENDERERS: Record<string, (ctx: PlateCylinderContext, shapType: string) => string> = {
    "homePlate": (ctx) => renderHomePlate(ctx),
    "chevron": (ctx) => renderChevron(ctx),
    "can": renderCylinder,
    "flowChartMagneticDisk": renderCylinder,
    "flowChartMagneticDrum": renderCylinder
};

/**
 * Check if a shape type is a plate or cylinder shape handled by this module
 */
export function isPlateCylinderShape(shapType: string): boolean {
    return shapType in PLATE_CYLINDER_RENDERERS;
}

/**
 * Render a plate or cylinder shape
 * @returns SVG string for the shape, or empty string if not a plate/cylinder shape
 */
export function renderPlateCylinderShape(shapType: string, ctx: PlateCylinderContext): string {
    const renderer = PLATE_CYLINDER_RENDERERS[shapType];
    return renderer ? renderer(ctx, shapType) : "";
}
