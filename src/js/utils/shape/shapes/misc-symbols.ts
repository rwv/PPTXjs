/**
 * Miscellaneous symbol shape rendering functions.
 *
 * Handles misc shapes:
 * - moon, corner, diagStripe, gear6, gear9
 * - plus, teardrop, plaque, sun
 * - heart, lightningBolt, cube, bevel, foldedCorner
 * - cloud, cloudCallout, smileyFace
 */

import { shapeArc } from "./helpers/arc";
import { shapeGear } from "./helpers/gear";
import { getTextByPathList } from "../../object";

/**
 * Context for rendering misc symbol shapes
 */
export interface MiscSymbolContext {
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
    setTxtRotate?: (angle: number) => void;
}

/**
 * List of misc symbol shape types handled by this module
 */
export const MISC_SYMBOL_TYPES = [
    "moon",
    "corner",
    "diagStripe",
    "gear6",
    "gear9",
    "plus",
    "teardrop",
    "plaque",
    "sun",
    "heart",
    "lightningBolt",
    "cube",
    "bevel",
    "foldedCorner",
    "cloud",
    "cloudCallout",
    "smileyFace"
] as const;

/**
 * Generate fill attribute string for SVG
 */
function getFillAttr(ctx: MiscSymbolContext): string {
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
function getStrokeAttrs(ctx: MiscSymbolContext): string {
    const { border } = ctx;
    return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

/**
 * Create SVG path element
 */
function createPath(d: string, ctx: MiscSymbolContext, transform?: string): string {
    const transformAttr = transform ? ` transform='${transform}'` : "";
    return `<path   d='${d}'${transformAttr}  fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Shape Renderers
// =============================================================================

function renderMoon(ctx: MiscSymbolContext): string {
    const { node, w, h } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var adj = 0.5;
    if (shapAdjst !== undefined) {
        adj = parseInt(shapAdjst.substr(4)) / 100000;
    }
    var hd2 = h / 2;
    var cd2 = 180;
    var cd4 = 90;
    var adj2 = (1 - adj) * w;
    var d = "M" + w + "," + h +
        shapeArc(w, hd2, w, hd2, cd4, (cd4 + cd2), false).replace("M", "L") +
        shapeArc(w, hd2, adj2, hd2, (cd4 + cd2), cd4, false).replace("M", "L") +
        " z";
    return createPath(d, ctx);
}

function renderCorner(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
    var sAdj1_val = 50000 * slideFactor;
    var sAdj2_val = 50000 * slideFactor;
    var cnsVal = 100000 * slideFactor;
    if (shapAdjst_ary !== undefined) {
        for (var i = 0; i < shapAdjst_ary.length; i++) {
            var sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
            if (sAdj_name == "adj1") {
                var sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                sAdj1_val = parseInt(sAdj1.substr(4)) * slideFactor;
            } else if (sAdj_name == "adj2") {
                var sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                sAdj2_val = parseInt(sAdj2.substr(4)) * slideFactor;
            }
        }
    }
    var minWH = Math.min(w, h);
    var maxAdj1 = cnsVal * h / minWH;
    var maxAdj2 = cnsVal * w / minWH;
    var a1, a2, x1, dy1, y1;
    if (sAdj1_val < 0) a1 = 0
    else if (sAdj1_val > maxAdj1) a1 = maxAdj1
    else a1 = sAdj1_val
    if (sAdj2_val < 0) a2 = 0
    else if (sAdj2_val > maxAdj2) a2 = maxAdj2
    else a2 = sAdj2_val
    x1 = minWH * a2 / cnsVal;
    dy1 = minWH * a1 / cnsVal;
    y1 = h - dy1;
    var d = "M0,0 L" + x1 + ",0 L" + x1 + "," + y1 + " L" + w + "," + y1 + " L" + w + "," + h + " L0," + h + " z";
    return createPath(d, ctx);
}

function renderDiagStripe(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var sAdj1_val = 50000 * slideFactor;
    var cnsVal = 100000 * slideFactor;
    if (shapAdjst !== undefined) {
        sAdj1_val = parseInt(shapAdjst.substr(4)) * slideFactor;
    }
    var a1, x2, y2;
    if (sAdj1_val < 0) a1 = 0
    else if (sAdj1_val > cnsVal) a1 = cnsVal
    else a1 = sAdj1_val
    x2 = w * a1 / cnsVal;
    y2 = h * a1 / cnsVal;
    var d = "M0," + y2 + " L" + x2 + ",0 L" + w + ",0 L0," + h + " z";
    return createPath(d, ctx);
}

function renderGear(ctx: MiscSymbolContext, shapType: string): string {
    const { w, h, setTxtRotate } = ctx;
    if (setTxtRotate) setTxtRotate(0);
    var gearNum = shapType.substr(4);
    var d = shapeGear(w, h / 3.5, parseInt(gearNum));
    return createPath(d, ctx, `rotate(20,${(3 / 7) * h},${(3 / 7) * h})`);
}

function renderPlus(ctx: MiscSymbolContext): string {
    const { node, w, h } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var adj1 = 0.25;
    if (shapAdjst !== undefined) {
        adj1 = parseInt(shapAdjst.substr(4)) / 100000;
    }
    var adj2 = (1 - adj1);
    return ` <polygon points='${adj1 * w} 0,${adj1 * w} ${adj1 * h},0 ${adj1 * h},0 ${adj2 * h},${adj1 * w} ${adj2 * h},${adj1 * w} ${h},${adj2 * w} ${h},${adj2 * w} ${adj2 * h},${w} ${adj2 * h},${w} ${adj1 * h},${adj2 * w} ${adj1 * h},${adj2 * w} 0' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

function renderTeardrop(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var adj1 = 100000 * slideFactor;
    var cnsVal1 = adj1;
    var cnsVal2 = 200000 * slideFactor;
    if (shapAdjst !== undefined) {
        adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
    }
    var a1, r2, tw, th, sw, sh, dx1, dy1, x1, y1, x2, y2, rd45;
    if (adj1 < 0) a1 = 0
    else if (adj1 > cnsVal2) a1 = cnsVal2
    else a1 = adj1
    r2 = Math.sqrt(2);
    tw = r2 * (w / 2);
    th = r2 * (h / 2);
    sw = (tw * a1) / cnsVal1;
    sh = (th * a1) / cnsVal1;
    rd45 = (45 * (Math.PI) / 180);
    dx1 = sw * (Math.cos(rd45));
    dy1 = sh * (Math.cos(rd45));
    x1 = (w / 2) + dx1;
    y1 = (h / 2) - dy1;
    x2 = ((w / 2) + x1) / 2;
    y2 = ((h / 2) + y1) / 2;
    var d_val = shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false) +
        "Q " + x2 + ",0 " + x1 + "," + y1 +
        "Q " + w + "," + y2 + " " + w + "," + h / 2 +
        shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
        shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") + " z";
    return createPath(d_val, ctx);
}

function renderPlaque(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var adj1 = 16667 * slideFactor;
    var cnsVal1 = 50000 * slideFactor;
    var cnsVal2 = 100000 * slideFactor;
    if (shapAdjst !== undefined) {
        adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
    }
    var a1, x1, x2, y2;
    if (adj1 < 0) a1 = 0
    else if (adj1 > cnsVal1) a1 = cnsVal1
    else a1 = adj1
    x1 = a1 * (Math.min(w, h)) / cnsVal2;
    x2 = w - x1;
    y2 = h - x1;
    var d_val = "M0," + x1 +
        shapeArc(0, 0, x1, x1, 90, 0, false).replace("M", "L") +
        " L" + x2 + ",0" +
        shapeArc(w, 0, x1, x1, 180, 90, false).replace("M", "L") +
        " L" + w + "," + y2 +
        shapeArc(w, h, x1, x1, 270, 180, false).replace("M", "L") +
        " L" + x1 + "," + h +
        shapeArc(0, h, x1, x1, 0, -90, false).replace("M", "L") + " z";
    return createPath(d_val, ctx);
}

function renderSun(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var refr = slideFactor;
    var adj1 = 25000 * refr;
    var cnstVal1 = 12500 * refr;
    var cnstVal2 = 46875 * refr;
    if (shapAdjst !== undefined) {
        adj1 = parseInt(shapAdjst.substr(4)) * refr;
    }
    var a1 = (adj1 < cnstVal1) ? cnstVal1 : (adj1 > cnstVal2) ? cnstVal2 : adj1;
    var cnstVa3 = 50000 * refr;
    var cnstVa4 = 100000 * refr;
    var g0 = cnstVa3 - a1,
        g1 = g0 * (30274 * refr) / (32768 * refr),
        g2 = g0 * (12540 * refr) / (32768 * refr),
        g3 = g1 + cnstVa3,
        g4 = g2 + cnstVa3,
        g5 = cnstVa3 - g1,
        g6 = cnstVa3 - g2,
        g7 = g0 * (23170 * refr) / (32768 * refr),
        g8 = cnstVa3 + g7,
        g9 = cnstVa3 - g7,
        g10 = g5 * 3 / 4,
        g11 = g6 * 3 / 4,
        g12 = g10 + 3662 * refr,
        g13 = g11 + 36620 * refr,
        g14 = g11 + 12500 * refr,
        g15 = cnstVa4 - g10,
        g16 = cnstVa4 - g12,
        g17 = cnstVa4 - g13,
        g18 = cnstVa4 - g14,
        ox1 = w * (18436 * refr) / (21600 * refr),
        oy1 = h * (3163 * refr) / (21600 * refr),
        ox2 = w * (3163 * refr) / (21600 * refr),
        oy2 = h * (18436 * refr) / (21600 * refr),
        x8 = w * g8 / cnstVa4,
        x9 = w * g9 / cnstVa4,
        x10 = w * g10 / cnstVa4,
        x12 = w * g12 / cnstVa4,
        x13 = w * g13 / cnstVa4,
        x14 = w * g14 / cnstVa4,
        x15 = w * g15 / cnstVa4,
        x16 = w * g16 / cnstVa4,
        x17 = w * g17 / cnstVa4,
        x18 = w * g18 / cnstVa4,
        x19 = w * a1 / cnstVa4,
        wR = w * g0 / cnstVa4,
        hR = h * g0 / cnstVa4,
        y8 = h * g8 / cnstVa4,
        y9 = h * g9 / cnstVa4,
        y10 = h * g10 / cnstVa4,
        y12 = h * g12 / cnstVa4,
        y13 = h * g13 / cnstVa4,
        y14 = h * g14 / cnstVa4,
        y15 = h * g15 / cnstVa4,
        y16 = h * g16 / cnstVa4,
        y17 = h * g17 / cnstVa4,
        y18 = h * g18 / cnstVa4;

    var d_val = "M" + w + "," + h / 2 +
        " L" + x15 + "," + y18 + " L" + x15 + "," + y14 + "z" +
        " M" + ox1 + "," + oy1 + " L" + x16 + "," + y17 + " L" + x13 + "," + y12 + "z" +
        " M" + w / 2 + ",0 L" + x18 + "," + y10 + " L" + x14 + "," + y10 + "z" +
        " M" + ox2 + "," + oy1 + " L" + x17 + "," + y12 + " L" + x12 + "," + y17 + "z" +
        " M0," + h / 2 + " L" + x10 + "," + y14 + " L" + x10 + "," + y18 + "z" +
        " M" + ox2 + "," + oy2 + " L" + x12 + "," + y13 + " L" + x17 + "," + y16 + "z" +
        " M" + w / 2 + "," + h + " L" + x14 + "," + y15 + " L" + x18 + "," + y15 + "z" +
        " M" + ox1 + "," + oy2 + " L" + x13 + "," + y16 + " L" + x16 + "," + y13 + " z" +
        " M" + x19 + "," + h / 2 +
        shapeArc(w / 2, h / 2, wR, hR, 180, 540, false).replace("M", "L") + " z";
    return createPath(d_val, ctx);
}

function renderHeart(ctx: MiscSymbolContext): string {
    const { w, h } = ctx;
    var dx1 = w * 49 / 48,
        dx2 = w * 10 / 48,
        x1 = w / 2 - dx1,
        x2 = w / 2 - dx2,
        x3 = w / 2 + dx2,
        x4 = w / 2 + dx1,
        y1 = -h / 3;
    var d_val = "M" + w / 2 + "," + h / 4 +
        "C" + x3 + "," + y1 + " " + x4 + "," + h / 4 + " " + w / 2 + "," + h +
        "C" + x1 + "," + h / 4 + " " + x2 + "," + y1 + " " + w / 2 + "," + h / 4 + " z";
    return `<path   d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

function renderLightningBolt(ctx: MiscSymbolContext): string {
    const { w, h } = ctx;
    var x1 = w * 5022 / 21600, x2 = w * 11050 / 21600, x3 = w * 8472 / 21600,
        x4 = w * 8757 / 21600, x5 = w * 10012 / 21600, x6 = w * 14767 / 21600,
        x7 = w * 12222 / 21600, x8 = w * 12860 / 21600, x9 = w * 13917 / 21600,
        x10 = w * 7602 / 21600, x11 = w * 16577 / 21600,
        y1 = h * 3890 / 21600, y2 = h * 6080 / 21600, y3 = h * 6797 / 21600,
        y4 = h * 7437 / 21600, y5 = h * 12877 / 21600, y6 = h * 9705 / 21600,
        y7 = h * 12007 / 21600, y8 = h * 13987 / 21600, y9 = h * 8382 / 21600,
        y10 = h * 14277 / 21600, y11 = h * 14915 / 21600;
    var d_val = "M" + x3 + ",0 L" + x8 + "," + y2 + " L" + x2 + "," + y3 + " L" + x11 + "," + y7 +
        " L" + x6 + "," + y5 + " L" + w + "," + h + " L" + x5 + "," + y11 + " L" + x7 + "," + y8 +
        " L" + x1 + "," + y6 + " L" + x10 + "," + y9 + " L0," + y1 + " z";
    return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

function renderCube(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var refr = slideFactor;
    var adj = 25000 * refr;
    if (shapAdjst !== undefined) {
        adj = parseInt(shapAdjst.substr(4)) * refr;
    }
    var cnstVal2 = 100000 * refr;
    var ss = Math.min(w, h);
    var a = (adj < 0) ? 0 : (adj > cnstVal2) ? cnstVal2 : adj;
    var y1 = ss * a / cnstVal2;
    var y4 = h - y1;
    var x4 = w - y1;
    var d_val = "M0," + y1 + " L" + y1 + ",0 L" + w + ",0 L" + w + "," + y4 + " L" + x4 + "," + h + " L0," + h + " z" +
        "M0," + y1 + " L" + x4 + "," + y1 + " M" + x4 + "," + y1 + " L" + w + ",0" +
        "M" + x4 + "," + y1 + " L" + x4 + "," + h;
    return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

function renderBevel(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var refr = slideFactor;
    var adj = 12500 * refr;
    if (shapAdjst !== undefined) {
        adj = parseInt(shapAdjst.substr(4)) * refr;
    }
    var cnstVal1 = 50000 * refr;
    var cnstVal2 = 100000 * refr;
    var ss = Math.min(w, h);
    var a = (adj < 0) ? 0 : (adj > cnstVal1) ? cnstVal1 : adj;
    var x1 = ss * a / cnstVal2;
    var x2 = w - x1;
    var y2 = h - x1;
    var d_val = "M0,0 L" + w + ",0 L" + w + "," + h + " L0," + h + " z" +
        " M" + x1 + "," + x1 + " L" + x2 + "," + x1 + " L" + x2 + "," + y2 + " L" + x1 + "," + y2 + " z" +
        " M0,0 L" + x1 + "," + x1 + " M0," + h + " L" + x1 + "," + y2 +
        " M" + w + ",0 L" + x2 + "," + x1 + " M" + w + "," + h + " L" + x2 + "," + y2;
    return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

function renderFoldedCorner(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var refr = slideFactor;
    var adj = 16667 * refr;
    if (shapAdjst !== undefined) {
        adj = parseInt(shapAdjst.substr(4)) * refr;
    }
    var cnstVal1 = 50000 * refr;
    var cnstVal2 = 100000 * refr;
    var ss = Math.min(w, h);
    var a = (adj < 0) ? 0 : (adj > cnstVal1) ? cnstVal1 : adj;
    var dy2 = ss * a / cnstVal2;
    var dy1 = dy2 / 5;
    var x1 = w - dy2;
    var x2 = x1 + dy1;
    var y2 = h - dy2;
    var y1 = y2 + dy1;
    var d_val = "M" + x1 + "," + h + " L" + x2 + "," + y1 + " L" + w + "," + y2 + " L" + x1 + "," + h +
        " L0," + h + " L0,0 L" + w + ",0 L" + w + "," + y2;
    return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

function renderCloud(ctx: MiscSymbolContext): string {
    const { w, h } = ctx;
    var x0 = w * 3900 / 43200, x1 = w * 4693 / 43200, x2 = w * 6928 / 43200, x3 = w * 16478 / 43200,
        x4 = w * 28827 / 43200, x5 = w * 34129 / 43200, x6 = w * 41798 / 43200, x7 = w * 38324 / 43200,
        x8 = w * 29078 / 43200, x9 = w * 22141 / 43200, x10 = w * 14000 / 43200, x11 = w * 4127 / 43200;
    var y0 = h * 14370 / 43200, y1 = h * 26177 / 43200, y2 = h * 34899 / 43200, y3 = h * 39090 / 43200,
        y4 = h * 34751 / 43200, y5 = h * 22954 / 43200, y6 = h * 15354 / 43200, y7 = h * 5426 / 43200,
        y8 = h * 3952 / 43200, y9 = h * 4720 / 43200, y10 = h * 5192 / 43200, y11 = h * 15789 / 43200;
    var rX1 = w * 6753 / 43200, rY1 = h * 9190 / 43200, rX2 = w * 5333 / 43200, rY2 = h * 7267 / 43200,
        rX3 = w * 4365 / 43200, rY3 = h * 5945 / 43200, rX4 = w * 4857 / 43200, rY4 = h * 6595 / 43200,
        rY5 = h * 7273 / 43200, rX6 = w * 6775 / 43200, rY6 = h * 9220 / 43200, rX7 = w * 5785 / 43200,
        rY7 = h * 7867 / 43200, rX8 = w * 6752 / 43200, rY8 = h * 9215 / 43200, rX9 = w * 7720 / 43200,
        rY9 = h * 10543 / 43200, rX10 = w * 4360 / 43200, rY10 = h * 5918 / 43200, rX11 = w * 4345 / 43200,
        rY11 = h * 5945 / 43200, rX12 = w * 6928 / 43200, rY12 = h * 9407 / 43200;
    var d = shapeArc(x11, y11, rX12, rY12, 122, 180, false) +
        shapeArc(x0, y0, rX11, rY11, 122, 182, false).replace("M", "L") +
        shapeArc(x1, y7, rX10, rY10, 142, 232, false).replace("M", "L") +
        shapeArc(x2, y8, rX9, rY9, 172, 257, false).replace("M", "L") +
        shapeArc(x3, y9, rX8, rY8, 190, 280, false).replace("M", "L") +
        shapeArc(x4, y10, rX7, rY7, 213, 317, false).replace("M", "L") +
        shapeArc(x5, y7, rX6, rY6, 253, 357, false).replace("M", "L") +
        shapeArc(x6, y6, rX4, rY5, 284, 380, false).replace("M", "L") +
        shapeArc(x7, y5, rX4, rY4, 322, 416, false).replace("M", "L") +
        shapeArc(x8, y4, rX3, rY3, 357, 451, false).replace("M", "L") +
        shapeArc(x9, y3, rX2, rY2, 29, 118, false).replace("M", "L") +
        shapeArc(x10, y2, rX1, rY1, 64, 151, false).replace("M", "L") +
        shapeArc(x11, y1, rX12, rY12, 84, 121, false).replace("M", "L") + " z";
    return createPath(d, ctx);
}

function renderSmileyFace(ctx: MiscSymbolContext): string {
    const { node, w, h, slideFactor } = ctx;
    var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
    var refr = slideFactor;
    var adj = 4653 * refr;
    if (shapAdjst !== undefined) {
        adj = parseInt(shapAdjst.substr(4)) * refr;
    }
    var cnstVal1 = 50000 * refr;
    var cnstVal2 = 100000 * refr;
    var cnstVal3 = 4653 * refr;
    var ss = Math.min(w, h);
    var wd2 = w / 2, hd2 = h / 2;
    var a = (adj < -cnstVal3) ? -cnstVal3 : (adj > cnstVal3) ? cnstVal3 : adj;
    var x1 = w * 4969 / 21699, x2 = w * 6215 / 21600, x3 = w * 13135 / 21600, x4 = w * 16640 / 21600;
    var y1 = h * 7570 / 21600, y3 = h * 16515 / 21600;
    var dy2 = h * a / cnstVal2;
    var y2 = y3 - dy2;
    var y4 = y3 + dy2;
    var dy3 = h * a / cnstVal1;
    var y5 = y4 + dy3;
    var wR = w * 1125 / 21600, hR = h * 1125 / 21600;
    var cX1 = x2 - wR * Math.cos(Math.PI);
    var cY1 = y1 - hR * Math.sin(Math.PI);
    var cX2 = x3 - wR * Math.cos(Math.PI);
    var d_val = shapeArc(cX1, cY1, wR, hR, 180, 540, false) +
        shapeArc(cX2, cY1, wR, hR, 180, 540, false) +
        " M" + x1 + "," + y2 + " Q" + wd2 + "," + y5 + " " + x4 + "," + y2 +
        " Q" + wd2 + "," + y5 + " " + x1 + "," + y2 +
        " M0," + hd2 + shapeArc(wd2, hd2, wd2, hd2, 180, 540, false).replace("M", "L") + " z";
    return `<path d='${d_val}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

// =============================================================================
// Shape Registry
// =============================================================================

const MISC_SYMBOL_RENDERERS: Record<string, (ctx: MiscSymbolContext, shapType: string) => string> = {
    "moon": (ctx) => renderMoon(ctx),
    "corner": (ctx) => renderCorner(ctx),
    "diagStripe": (ctx) => renderDiagStripe(ctx),
    "gear6": renderGear,
    "gear9": renderGear,
    "plus": (ctx) => renderPlus(ctx),
    "teardrop": (ctx) => renderTeardrop(ctx),
    "plaque": (ctx) => renderPlaque(ctx),
    "sun": (ctx) => renderSun(ctx),
    "heart": (ctx) => renderHeart(ctx),
    "lightningBolt": (ctx) => renderLightningBolt(ctx),
    "cube": (ctx) => renderCube(ctx),
    "bevel": (ctx) => renderBevel(ctx),
    "foldedCorner": (ctx) => renderFoldedCorner(ctx),
    "cloud": (ctx) => renderCloud(ctx),
    "cloudCallout": (ctx) => renderCloud(ctx),
    "smileyFace": (ctx) => renderSmileyFace(ctx)
};

export function isMiscSymbolShape(shapType: string): boolean {
    return shapType in MISC_SYMBOL_RENDERERS;
}

export function renderMiscSymbolShape(shapType: string, ctx: MiscSymbolContext): string {
    const renderer = MISC_SYMBOL_RENDERERS[shapType];
    return renderer ? renderer(ctx, shapType) : "";
}
