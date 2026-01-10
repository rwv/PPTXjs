import { shapeArc } from "../helpers/arc";
import { shapeGear } from "../helpers/gear";
import { getTextByPathList } from "../../../object";
import type { MiscSymbolContext } from "./types";
import { createPath, getFillAttr, getStrokeAttrs } from "./helpers";

// =============================================================================
// Shape Renderers
// =============================================================================

export function renderMoon(ctx: MiscSymbolContext): string {
  const { node, w, h } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj = 0.5;
  if (shapAdjst !== undefined) {
    adj = parseInt(shapAdjst.substr(4)) / 100000;
  }
  const hd2 = h / 2;
  const cd2 = 180;
  const cd4 = 90;
  const adj2 = (1 - adj) * w;
  const d =
    "M" +
    w +
    "," +
    h +
    shapeArc(w, hd2, w, hd2, cd4, cd4 + cd2, false).replace("M", "L") +
    shapeArc(w, hd2, adj2, hd2, cd4 + cd2, cd4, false).replace("M", "L") +
    " z";
  return createPath(d, ctx);
}

export function renderCorner(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let sAdj1_val = 50000 * slideFactor;
  let sAdj2_val = 50000 * slideFactor;
  const cnsVal = 100000 * slideFactor;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj1_val = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        sAdj2_val = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }
  const minWH = Math.min(w, h);
  const maxAdj1 = (cnsVal * h) / minWH;
  const maxAdj2 = (cnsVal * w) / minWH;
  let a1;
  let a2;
  if (sAdj1_val < 0) a1 = 0;
  else if (sAdj1_val > maxAdj1) a1 = maxAdj1;
  else a1 = sAdj1_val;
  if (sAdj2_val < 0) a2 = 0;
  else if (sAdj2_val > maxAdj2) a2 = maxAdj2;
  else a2 = sAdj2_val;
  const x1 = (minWH * a2) / cnsVal;
  const dy1 = (minWH * a1) / cnsVal;
  const y1 = h - dy1;
  const d =
    "M0,0 L" +
    x1 +
    ",0 L" +
    x1 +
    "," +
    y1 +
    " L" +
    w +
    "," +
    y1 +
    " L" +
    w +
    "," +
    h +
    " L0," +
    h +
    " z";
  return createPath(d, ctx);
}

export function renderDiagStripe(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let sAdj1_val = 50000 * slideFactor;
  const cnsVal = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    sAdj1_val = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const a1 = sAdj1_val < 0 ? 0 : sAdj1_val > cnsVal ? cnsVal : sAdj1_val;
  const x2 = (w * a1) / cnsVal;
  const y2 = (h * a1) / cnsVal;
  const d = "M0," + y2 + " L" + x2 + ",0 L" + w + ",0 L0," + h + " z";
  return createPath(d, ctx);
}

export function renderGear(ctx: MiscSymbolContext, shapType: string): string {
  const { w, h, setTxtRotate } = ctx;
  if (setTxtRotate) setTxtRotate(0);
  const gearNum = shapType.substr(4);
  const d = shapeGear(w, h / 3.5, parseInt(gearNum));
  return createPath(d, ctx, `rotate(20,${(3 / 7) * h},${(3 / 7) * h})`);
}

export function renderPlus(ctx: MiscSymbolContext): string {
  const { node, w, h } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj1 = 0.25;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) / 100000;
  }
  const adj2 = 1 - adj1;
  return ` <polygon points='${adj1 * w} 0,${adj1 * w} ${adj1 * h},0 ${adj1 * h},0 ${adj2 * h},${adj1 * w} ${adj2 * h},${adj1 * w} ${h},${adj2 * w} ${h},${adj2 * w} ${adj2 * h},${w} ${adj2 * h},${w} ${adj1 * h},${adj2 * w} ${adj1 * h},${adj2 * w} 0' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

export function renderTeardrop(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj1 = 100000 * slideFactor;
  const cnsVal1 = adj1;
  const cnsVal2 = 200000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const a1 = adj1 < 0 ? 0 : adj1 > cnsVal2 ? cnsVal2 : adj1;
  const r2 = Math.sqrt(2);
  const tw = r2 * (w / 2);
  const th = r2 * (h / 2);
  const sw = (tw * a1) / cnsVal1;
  const sh = (th * a1) / cnsVal1;
  const rd45 = (45 * Math.PI) / 180;
  const dx1 = sw * Math.cos(rd45);
  const dy1 = sh * Math.cos(rd45);
  const x1 = w / 2 + dx1;
  const y1 = h / 2 - dy1;
  const x2 = (w / 2 + x1) / 2;
  const y2 = (h / 2 + y1) / 2;
  const d_val =
    shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false) +
    "Q " +
    x2 +
    ",0 " +
    x1 +
    "," +
    y1 +
    "Q " +
    w +
    "," +
    y2 +
    " " +
    w +
    "," +
    h / 2 +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
    shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}

export function renderPlaque(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  let adj1 = 16667 * slideFactor;
  const cnsVal1 = 50000 * slideFactor;
  const cnsVal2 = 100000 * slideFactor;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
  }
  const a1 = adj1 < 0 ? 0 : adj1 > cnsVal1 ? cnsVal1 : adj1;
  const x1 = (a1 * Math.min(w, h)) / cnsVal2;
  const x2 = w - x1;
  const y2 = h - x1;
  const d_val =
    "M0," +
    x1 +
    shapeArc(0, 0, x1, x1, 90, 0, false).replace("M", "L") +
    " L" +
    x2 +
    ",0" +
    shapeArc(w, 0, x1, x1, 180, 90, false).replace("M", "L") +
    " L" +
    w +
    "," +
    y2 +
    shapeArc(w, h, x1, x1, 270, 180, false).replace("M", "L") +
    " L" +
    x1 +
    "," +
    h +
    shapeArc(0, h, x1, x1, 0, -90, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}

export function renderSun(ctx: MiscSymbolContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst = getTextByPathList(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
    "attrs",
    "fmla",
  ]);
  const refr = slideFactor;
  let adj1 = 25000 * refr;
  const cnstVal1 = 12500 * refr;
  const cnstVal2 = 46875 * refr;
  if (shapAdjst !== undefined) {
    adj1 = parseInt(shapAdjst.substr(4)) * refr;
  }
  const a1 = adj1 < cnstVal1 ? cnstVal1 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  const cnstVa3 = 50000 * refr;
  const cnstVa4 = 100000 * refr;
  const g0 = cnstVa3 - a1,
    g1 = (g0 * (30274 * refr)) / (32768 * refr),
    g2 = (g0 * (12540 * refr)) / (32768 * refr),
    g5 = cnstVa3 - g1,
    g6 = cnstVa3 - g2,
    g10 = (g5 * 3) / 4,
    g11 = (g6 * 3) / 4,
    g12 = g10 + 3662 * refr,
    g13 = g11 + 36620 * refr,
    g14 = g11 + 12500 * refr,
    g15 = cnstVa4 - g10,
    g16 = cnstVa4 - g12,
    g17 = cnstVa4 - g13,
    g18 = cnstVa4 - g14,
    ox1 = (w * (18436 * refr)) / (21600 * refr),
    oy1 = (h * (3163 * refr)) / (21600 * refr),
    ox2 = (w * (3163 * refr)) / (21600 * refr),
    oy2 = (h * (18436 * refr)) / (21600 * refr),
    x10 = (w * g10) / cnstVa4,
    x12 = (w * g12) / cnstVa4,
    x13 = (w * g13) / cnstVa4,
    x14 = (w * g14) / cnstVa4,
    x15 = (w * g15) / cnstVa4,
    x16 = (w * g16) / cnstVa4,
    x17 = (w * g17) / cnstVa4,
    x18 = (w * g18) / cnstVa4,
    x19 = (w * a1) / cnstVa4,
    wR = (w * g0) / cnstVa4,
    hR = (h * g0) / cnstVa4,
    y10 = (h * g10) / cnstVa4,
    y12 = (h * g12) / cnstVa4,
    y13 = (h * g13) / cnstVa4,
    y14 = (h * g14) / cnstVa4,
    y15 = (h * g15) / cnstVa4,
    y16 = (h * g16) / cnstVa4,
    y17 = (h * g17) / cnstVa4,
    y18 = (h * g18) / cnstVa4;

  const d_val =
    "M" +
    w +
    "," +
    h / 2 +
    " L" +
    x15 +
    "," +
    y18 +
    " L" +
    x15 +
    "," +
    y14 +
    "z" +
    " M" +
    ox1 +
    "," +
    oy1 +
    " L" +
    x16 +
    "," +
    y17 +
    " L" +
    x13 +
    "," +
    y12 +
    "z" +
    " M" +
    w / 2 +
    ",0 L" +
    x18 +
    "," +
    y10 +
    " L" +
    x14 +
    "," +
    y10 +
    "z" +
    " M" +
    ox2 +
    "," +
    oy1 +
    " L" +
    x17 +
    "," +
    y12 +
    " L" +
    x12 +
    "," +
    y17 +
    "z" +
    " M0," +
    h / 2 +
    " L" +
    x10 +
    "," +
    y14 +
    " L" +
    x10 +
    "," +
    y18 +
    "z" +
    " M" +
    ox2 +
    "," +
    oy2 +
    " L" +
    x12 +
    "," +
    y13 +
    " L" +
    x17 +
    "," +
    y16 +
    "z" +
    " M" +
    w / 2 +
    "," +
    h +
    " L" +
    x14 +
    "," +
    y15 +
    " L" +
    x18 +
    "," +
    y15 +
    "z" +
    " M" +
    ox1 +
    "," +
    oy2 +
    " L" +
    x13 +
    "," +
    y16 +
    " L" +
    x16 +
    "," +
    y13 +
    " z" +
    " M" +
    x19 +
    "," +
    h / 2 +
    shapeArc(w / 2, h / 2, wR, hR, 180, 540, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}
