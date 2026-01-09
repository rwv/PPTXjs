import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { ArrowShapeContext } from "./types";
import { createPath } from "./helpers";

/**
 * Render quadArrow shape
 */
export function renderQuadArrow(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 22500 * slideFactor;
  let adj2 = 22500 * slideFactor;
  let adj3 = 22500 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const cnstVal3 = 200000 * slideFactor;

  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj3") {
        const sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }

  const vc = h / 2,
    hc = w / 2;
  const minWH = Math.min(w, h);
  const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
  const maxAdj1 = 2 * a2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const q1 = cnstVal2 - maxAdj1;
  const maxAdj3 = q1 / 2;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;

  const x1 = (minWH * a3) / cnstVal2;
  const dx2 = (minWH * a2) / cnstVal2;
  const x2 = hc - dx2;
  const x5 = hc + dx2;
  const dx3 = (minWH * a1) / cnstVal3;
  const x3 = hc - dx3;
  const x4 = hc + dx3;
  const x6 = w - x1;
  const y2 = vc - dx2;
  const y5 = vc + dx2;
  const y3 = vc - dx3;
  const y4 = vc + dx3;
  const y6 = h - x1;

  const d = `M0,${vc} L${x1},${y2} L${x1},${y3} L${x3},${y3} L${x3},${x1} L${x2},${x1} L${hc},0 L${x5},${x1} L${x4},${x1} L${x4},${y3} L${x6},${y3} L${x6},${y2} L${w},${vc} L${x6},${y5} L${x6},${y4} L${x4},${y4} L${x4},${y6} L${x5},${y6} L${hc},${h} L${x2},${y6} L${x3},${y6} L${x3},${y4} L${x1},${y4} L${x1},${y5} z`;

  return createPath(d, ctx);
}

export function renderLeftRightUpArrow(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const cnstVal3 = 200000 * slideFactor;

  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj3") {
        const sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }

  const hc = w / 2;
  const minWH = Math.min(w, h);
  const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
  const maxAdj1 = 2 * a2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const q1 = cnstVal2 - maxAdj1;
  const maxAdj3 = q1 / 2;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;

  const x1 = (minWH * a3) / cnstVal2;
  const dx2 = (minWH * a2) / cnstVal2;
  const x2 = hc - dx2;
  const x5 = hc + dx2;
  const dx3 = (minWH * a1) / cnstVal3;
  const x3 = hc - dx3;
  const x4 = hc + dx3;
  const x6 = w - x1;
  const dy2 = (minWH * a2) / cnstVal1;
  const y2 = h - dy2;
  const y4 = h - dx2;
  const y3 = y4 - dx3;
  const y5 = y4 + dx3;

  const d = `M0,${y4} L${x1},${y2} L${x1},${y3} L${x3},${y3} L${x3},${x1} L${x2},${x1} L${hc},0 L${x5},${x1} L${x4},${x1} L${x4},${y3} L${x6},${y3} L${x6},${y2} L${w},${y4} L${x6},${h} L${x6},${y5} L${x1},${y5} L${x1},${h} z`;

  return createPath(d, ctx);
}

export function renderLeftUpArrow(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const cnstVal3 = 200000 * slideFactor;

  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj3") {
        const sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }

  const minWH = Math.min(w, h);
  const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
  const maxAdj1 = 2 * a2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const maxAdj3 = cnstVal2 - maxAdj1;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;

  const x1 = (minWH * a3) / cnstVal2;
  const dx2 = (minWH * a2) / cnstVal1;
  const x2 = w - dx2;
  const y2 = h - dx2;
  const dx4 = (minWH * a2) / cnstVal2;
  const x4 = w - dx4;
  const y4 = h - dx4;
  const dx3 = (minWH * a1) / cnstVal3;
  const x3 = x4 - dx3;
  const x5 = x4 + dx3;
  const y3 = y4 - dx3;
  const y5 = y4 + dx3;

  const d = `M0,${y4} L${x1},${y2} L${x1},${y3} L${x3},${y3} L${x3},${x1} L${x2},${x1} L${x4},0 L${w},${x1} L${x5},${x1} L${x5},${y5} L${x1},${y5} L${x1},${h} z`;

  return createPath(d, ctx);
}

export function renderBentUpArrow(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const cnstVal3 = 200000 * slideFactor;

  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj3") {
        const sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }

  const minWH = Math.min(w, h);
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
  const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
  const a3 = adj3;

  const y1 = (minWH * a3) / cnstVal2;
  const dx1 = (minWH * a2) / cnstVal1;
  const x1 = w - dx1;
  const dx3 = (minWH * a2) / cnstVal2;
  const x3 = w - dx3;
  const dx2 = (minWH * a1) / cnstVal3;
  const x2 = x3 - dx2;
  const x4 = x3 + dx2;
  const dy2 = (minWH * a1) / cnstVal2;
  const y2 = h - dy2;

  const d = `M0,${y2} L${x2},${y2} L${x2},${y1} L${x1},${y1} L${x3},0 L${w},${y1} L${x4},${y1} L${x4},${h} L0,${h} z`;

  return createPath(d, ctx);
}

export function renderBentArrow(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  let adj4 = 43750 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;

  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj3") {
        const sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      }
    }
  }

  const minWH = Math.min(w, h);
  const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
  const maxAdj1 = 2 * a2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const a3 = adj3 < 0 ? 0 : adj3 > cnstVal1 ? cnstVal1 : adj3;

  const th = (minWH * a1) / cnstVal2;
  const aw2 = (minWH * a2) / cnstVal2;
  const th2 = th / 2;
  const dh2 = aw2 - th2;
  const ah = (minWH * a3) / cnstVal2;
  const bw = w - ah;
  const bh = h - dh2;
  const bs = Math.min(bw, bh);
  const maxAdj4 = (cnstVal2 * bs) / minWH;
  const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const bd = (minWH * a4) / cnstVal2;
  const bd3 = bd - th;
  const bd2 = bd3 > 0 ? bd3 : 0;
  const x3 = th + bd2;
  const x4 = w - ah;
  const y3 = dh2 + th;
  const y4 = y3 + dh2;
  const y5 = dh2 + bd;
  const y6 = y3 + bd2;

  const d =
    `M0,${h} L0,${y5}` +
    shapeArc(bd, y5, bd, bd, 180, 270, false).replace("M", "L") +
    ` L${x4},${dh2} L${x4},0 L${w},${aw2} L${x4},${y4} L${x4},${y3} L${x3},${y3}` +
    shapeArc(x3, y6, bd2, bd2, 270, 180, false).replace("M", "L") +
    ` L${th},${h} z`;

  return createPath(d, ctx);
}

export function renderUturnArrow(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  let adj4 = 43750 * slideFactor;
  let adj5 = 75000 * slideFactor;
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;

  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj3") {
        const sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj5") {
        const sAdj5 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj5 = parseInt(sAdj5.substr(4)) * slideFactor;
      }
    }
  }

  const minWH = Math.min(w, h);
  const a2 = adj2 < 0 ? 0 : adj2 > cnstVal1 ? cnstVal1 : adj2;
  const maxAdj1 = 2 * a2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const q2 = (a1 * minWH) / h;
  const q3 = cnstVal2 - q2;
  const maxAdj3 = (q3 * h) / minWH;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const q1 = a3 + a1;
  const minAdj5 = (q1 * minWH) / h;
  const a5 = adj5 < minAdj5 ? minAdj5 : adj5 > cnstVal2 ? cnstVal2 : adj5;

  const th = (minWH * a1) / cnstVal2;
  const aw2 = (minWH * a2) / cnstVal2;
  const th2 = th / 2;
  const dh2 = aw2 - th2;
  const y5 = (h * a5) / cnstVal2;
  const ah = (minWH * a3) / cnstVal2;
  const y4 = y5 - ah;
  const x9 = w - dh2;
  const bw = x9 / 2;
  const bs = Math.min(bw, y4);
  const maxAdj4 = (cnstVal2 * bs) / minWH;
  const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const bd = (minWH * a4) / cnstVal2;
  const bd3 = bd - th;
  const bd2 = bd3 > 0 ? bd3 : 0;
  const x3 = th + bd2;
  const x8 = w - aw2;
  const x6 = x8 - aw2;
  const x7 = x6 + dh2;
  const x4 = x9 - bd;
  const x5 = x7 - bd2;

  const d =
    `M0,${h} L0,${bd}` +
    shapeArc(bd, bd, bd, bd, 180, 270, false).replace("M", "L") +
    ` L${x4},0` +
    shapeArc(x4, bd, bd, bd, 270, 360, false).replace("M", "L") +
    ` L${x9},${y4} L${w},${y4} L${x8},${y5} L${x6},${y4} L${x7},${y4} L${x7},${x3}` +
    shapeArc(x5, x3, bd2, bd2, 0, -90, false).replace("M", "L") +
    ` L${x3},${th}` +
    shapeArc(x3, x3, bd2, bd2, 270, 180, false).replace("M", "L") +
    ` L${th},${h} z`;

  return createPath(d, ctx);
}

export function renderStripedRightArrow(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 50000 * slideFactor;
  let adj2 = 50000 * slideFactor;
  const cnstVal1 = 100000 * slideFactor;
  const cnstVal2 = 200000 * slideFactor;
  const cnstVal3 = 84375 * slideFactor;

  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }

  const vc = h / 2;
  const minWH = Math.min(w, h);
  const maxAdj2 = (cnstVal3 * w) / minWH;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const x4 = (minWH * 5) / 32;
  const dx5 = (minWH * a2) / cnstVal1;
  const x5 = w - dx5;
  const dy1 = (h * a1) / cnstVal2;
  const y1 = vc - dy1;
  const y2 = vc + dy1;
  const ssd8 = minWH / 8;
  const ssd16 = minWH / 16;
  const ssd32 = minWH / 32;

  const d =
    `M0,${y1} L${ssd32},${y1} L${ssd32},${y2} L0,${y2} z` +
    ` M${ssd16},${y1} L${ssd8},${y1} L${ssd8},${y2} L${ssd16},${y2} z` +
    ` M${x4},${y1} L${x5},${y1} L${x5},0 L${w},${vc} L${x5},${h} L${x5},${y2} L${x4},${y2} z`;

  return createPath(d, ctx);
}

export function renderNotchedRightArrow(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 50000 * slideFactor;
  let adj2 = 50000 * slideFactor;
  const cnstVal1 = 100000 * slideFactor;
  const cnstVal2 = 200000 * slideFactor;

  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        const sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      } else if (sAdj_name === "adj2") {
        const sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    }
  }

  const vc = h / 2;
  const hd2 = vc;
  const minWH = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * w) / minWH;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal1 ? cnstVal1 : adj1;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const dx2 = (minWH * a2) / cnstVal1;
  const x2 = w - dx2;
  const dy1 = (h * a1) / cnstVal2;
  const y1 = vc - dy1;
  const y2 = vc + dy1;
  const x1 = (dy1 * dx2) / hd2;

  const d = `M0,${y1} L${x2},${y1} L${x2},0 L${w},${vc} L${x2},${h} L${x2},${y2} L0,${y2} L${x1},${vc} z`;

  return createPath(d, ctx);
}

// =============================================================================
// Arrow Callout Shapes
// =============================================================================
