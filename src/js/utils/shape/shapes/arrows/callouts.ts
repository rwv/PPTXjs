import { getTextByPathList } from "../../../object";
import type { ArrowShapeContext } from "./types";
import { createPath } from "./helpers";

/**
 * Render rightArrowCallout shape
 */
export function renderRightArrowCallout(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  let adj4 = 64977 * slideFactor;
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
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      }
    }
  }

  const vc = h / 2;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * h) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const maxAdj1 = a2 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const maxAdj3 = (cnstVal2 * w) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const q2 = (a3 * ss) / w;
  const maxAdj4 = cnstVal2 - q2;
  const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const dy1 = (ss * a2) / cnstVal2;
  const dy2 = (ss * a1) / cnstVal3;
  const y1 = vc - dy1;
  const y2 = vc - dy2;
  const y3 = vc + dy2;
  const y4 = vc + dy1;
  const dx3 = (ss * a3) / cnstVal2;
  const x3 = w - dx3;
  const x2 = (w * a4) / cnstVal2;

  const d = `M0,0 L${x2},0 L${x2},${y2} L${x3},${y2} L${x3},${y1} L${w},${vc} L${x3},${y4} L${x3},${y3} L${x2},${y3} L${x2},${h} L0,${h} z`;

  return createPath(d, ctx);
}

export function renderDownArrowCallout(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  let adj4 = 64977 * slideFactor;
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
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      }
    }
  }

  const hc = w / 2;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * w) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const maxAdj1 = a2 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const maxAdj3 = (cnstVal2 * h) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const q2 = (a3 * ss) / h;
  const maxAdj4 = cnstVal2 - q2;
  const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const dx1 = (ss * a2) / cnstVal2;
  const dx2 = (ss * a1) / cnstVal3;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc + dx2;
  const x4 = hc + dx1;
  const dy3 = (ss * a3) / cnstVal2;
  const y3 = h - dy3;
  const y2 = (h * a4) / cnstVal2;

  const d = `M0,0 L${w},0 L${w},${y2} L${x3},${y2} L${x3},${y3} L${x4},${y3} L${hc},${h} L${x1},${y3} L${x2},${y3} L${x2},${y2} L0,${y2} z`;

  return createPath(d, ctx);
}

export function renderLeftArrowCallout(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  let adj4 = 64977 * slideFactor;
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
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      }
    }
  }

  const vc = h / 2;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * h) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const maxAdj1 = a2 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const maxAdj3 = (cnstVal2 * w) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const q2 = (a3 * ss) / w;
  const maxAdj4 = cnstVal2 - q2;
  const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const dy1 = (ss * a2) / cnstVal2;
  const dy2 = (ss * a1) / cnstVal3;
  const y1 = vc - dy1;
  const y2 = vc - dy2;
  const y3 = vc + dy2;
  const y4 = vc + dy1;
  const x3 = (ss * a3) / cnstVal2;
  const x2 = w - (w * a4) / cnstVal2;

  const d = `M${w},0 L${w},${h} L${x2},${h} L${x2},${y3} L${x3},${y3} L${x3},${y4} L0,${vc} L${x3},${y1} L${x3},${y2} L${x2},${y2} L${x2},0 z`;

  return createPath(d, ctx);
}

export function renderUpArrowCallout(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  let adj4 = 64977 * slideFactor;
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
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      }
    }
  }

  const hc = w / 2;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * w) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const maxAdj1 = a2 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const maxAdj3 = (cnstVal2 * h) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const q2 = (a3 * ss) / h;
  const maxAdj4 = cnstVal2 - q2;
  const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const dx1 = (ss * a2) / cnstVal2;
  const dx2 = (ss * a1) / cnstVal3;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc + dx2;
  const x4 = hc + dx1;
  const y3 = (ss * a3) / cnstVal2;
  const y2 = h - (h * a4) / cnstVal2;

  const d = `M0,${h} L0,${y2} L${x2},${y2} L${x2},${y3} L${x1},${y3} L${hc},0 L${x4},${y3} L${x3},${y3} L${x3},${y2} L${w},${y2} L${w},${h} z`;

  return createPath(d, ctx);
}

export function renderLeftRightArrowCallout(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  let adj4 = 48123 * slideFactor;
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
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      }
    }
  }

  const vc = h / 2;
  const hc = w / 2;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * h) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const maxAdj1 = a2 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const maxAdj3 = (cnstVal1 * w) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const q2 = (a3 * ss) / hc;
  const maxAdj4 = cnstVal2 - q2;
  const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const dy1 = (ss * a2) / cnstVal2;
  const dy2 = (ss * a1) / cnstVal3;
  const y1 = vc - dy1;
  const y2 = vc - dy2;
  const y3 = vc + dy2;
  const y4 = vc + dy1;
  const x3 = (ss * a3) / cnstVal2;
  const x4 = w - x3;
  const x1 = (hc * a4) / cnstVal2;
  const x2 = w - x1;

  const d = `M0,${vc} L${x3},${y1} L${x3},${y2} L${x1},${y2} L${x1},0 L${x2},0 L${x2},${y2} L${x4},${y2} L${x4},${y1} L${w},${vc} L${x4},${y4} L${x4},${y3} L${x2},${y3} L${x2},${h} L${x1},${h} L${x1},${y3} L${x3},${y3} L${x3},${y4} z`;

  return createPath(d, ctx);
}

export function renderQuadArrowCallout(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 18515 * slideFactor;
  let adj2 = 18515 * slideFactor;
  let adj3 = 18515 * slideFactor;
  let adj4 = 48123 * slideFactor;
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
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      }
    }
  }

  const vc = h / 2;
  const hc = w / 2;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * ss) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const maxAdj1 = a2 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const maxAdj3 = cnstVal1 - a2;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const q2 = a3 * 2;
  const maxAdj4 = cnstVal2 - q2;
  const a4 = adj4 < a1 ? a1 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const dy1 = (ss * a2) / cnstVal2;
  const dy2 = (ss * a1) / cnstVal3;
  const y1 = vc - dy1;
  const y2 = vc - dy2;
  const y3 = vc + dy2;
  const y4 = vc + dy1;
  const x1 = hc - dy1;
  const x2 = hc - dy2;
  const x3 = hc + dy2;
  const x4 = hc + dy1;
  const dx3 = (ss * a3) / cnstVal2;
  const dx4 = (ss * a4) / cnstVal3;
  const x7 = hc - dx4;
  const x8 = hc + dx4;
  const y7 = vc - dx4;
  const y8 = vc + dx4;

  const d = `M0,${vc} L${dx3},${y1} L${dx3},${y2} L${x7},${y2} L${x7},${y7} L${x2},${y7} L${x2},${dx3} L${x1},${dx3} L${hc},0 L${x4},${dx3} L${x3},${dx3} L${x3},${y7} L${x8},${y7} L${x8},${y2} L${w - dx3},${y2} L${w - dx3},${y1} L${w},${vc} L${w - dx3},${y4} L${w - dx3},${y3} L${x8},${y3} L${x8},${y8} L${x3},${y8} L${x3},${h - dx3} L${x4},${h - dx3} L${hc},${h} L${x1},${h - dx3} L${x2},${h - dx3} L${x2},${y8} L${x7},${y8} L${x7},${y3} L${dx3},${y3} L${dx3},${y4} z`;

  return createPath(d, ctx);
}

export function renderUpDownArrowCallout(ctx: ArrowShapeContext): string {
  const { node, w, h, slideFactor } = ctx;
  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  let adj1 = 25000 * slideFactor;
  let adj2 = 25000 * slideFactor;
  let adj3 = 25000 * slideFactor;
  let adj4 = 48123 * slideFactor;
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
      } else if (sAdj_name === "adj4") {
        const sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * slideFactor;
      }
    }
  }

  const vc = h / 2;
  const hc = w / 2;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * w) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const maxAdj1 = a2 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const maxAdj3 = (cnstVal1 * h) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const q2 = (a3 * ss) / vc;
  const maxAdj4 = cnstVal2 - q2;
  const a4 = adj4 < 0 ? 0 : adj4 > maxAdj4 ? maxAdj4 : adj4;
  const dx1 = (ss * a2) / cnstVal2;
  const dx2 = (ss * a1) / cnstVal3;
  const x1 = hc - dx1;
  const x2 = hc - dx2;
  const x3 = hc + dx2;
  const x4 = hc + dx1;
  const y3 = (ss * a3) / cnstVal2;
  const y4 = h - y3;
  const y1 = (vc * a4) / cnstVal2;
  const y2 = h - y1;

  const d = `M0,${y1} L${x2},${y1} L${x2},${y3} L${x1},${y3} L${hc},0 L${x4},${y3} L${x3},${y3} L${x3},${y1} L${w},${y1} L${w},${y2} L${x3},${y2} L${x3},${y4} L${x4},${y4} L${hc},${h} L${x1},${y4} L${x2},${y4} L${x2},${y2} L0,${y2} z`;

  return createPath(d, ctx);
}
