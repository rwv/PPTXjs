import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { CurvedArrowContext } from "./types";
import { createPath, getShapeAdjustments } from "./helpers";

/**
 * Render curvedDownArrow shape
 */
export function renderCurvedDownArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1,
    adj1 = 25000 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  let sAdj3,
    adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj2") {
      sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj3") {
      sAdj3 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj3 !== undefined) {
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const wd2 = w / 2;
  const r = w;
  const b = h;
  const t = 0;
  const c3d4 = 270;
  const cd2 = 180;
  const cd4 = 90;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * w) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  const th = (ss * a1) / cnstVal2;
  const aw = (ss * a2) / cnstVal2;
  const q1 = (th + aw) / 4;
  const wR = wd2 - q1;
  const q7 = wR * 2;
  const q8 = q7 * q7;
  const q9 = th * th;
  const q10 = q8 - q9;
  const q11 = Math.sqrt(q10);
  const idy = (q11 * h) / q7;
  const maxAdj3 = (cnstVal2 * idy) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const ah = (ss * a3) / cnstVal2;
  const x3 = wR + th;
  const q2 = h * h;
  const q3 = ah * ah;
  const q4 = q2 - q3;
  const q5 = Math.sqrt(q4);
  const dx = (q5 * wR) / h;
  const x5 = wR + dx;
  const x7 = x3 + dx;
  const q6 = aw - th;
  const dh = q6 / 2;
  const x4 = x5 - dh;
  const x8 = x7 + dh;
  const aw2 = aw / 2;
  const x6 = r - aw2;
  const y1 = b - ah;
  const swAng = Math.atan(dx / ah);
  const swAngDeg = (swAng * 180) / Math.PI;
  const mswAng = -swAngDeg;
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / idy);
  const dang2Deg = (dang2 * 180) / Math.PI;
  const stAng = c3d4 + swAngDeg;
  const stAng2 = c3d4 - dang2Deg;
  const swAng2 = dang2Deg - cd4;
  const swAng3 = cd4 + dang2Deg;

  const d_val =
    "M" +
    x6 +
    "," +
    b +
    " L" +
    x4 +
    "," +
    y1 +
    " L" +
    x5 +
    "," +
    y1 +
    shapeArc({
      cX: wR,
      cY: h,
      rX: wR,
      rY: h,
      stAng: stAng,
      endAng: stAng + mswAng,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    x3 +
    "," +
    t +
    shapeArc({
      cX: x3,
      cY: h,
      rX: wR,
      rY: h,
      stAng: c3d4,
      endAng: c3d4 + swAngDeg,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    (x5 + th) +
    "," +
    y1 +
    " L" +
    x8 +
    "," +
    y1 +
    " z" +
    "M" +
    x3 +
    "," +
    t +
    shapeArc({
      cX: x3,
      cY: h,
      rX: wR,
      rY: h,
      stAng: stAng2,
      endAng: stAng2 + swAng2,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({
      cX: wR,
      cY: h,
      rX: wR,
      rY: h,
      stAng: cd2,
      endAng: cd2 + swAng3,
      isClose: false,
    }).replace("M", "L");

  return createPath({ d: d_val, ctx });
}

/**
 * Render curvedLeftArrow shape
 */
export function renderCurvedLeftArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1,
    adj1 = 25000 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  let sAdj3,
    adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj2") {
      sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj3") {
      sAdj3 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj3 !== undefined) {
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const hd2 = h / 2;
  const r = w;
  const b = h;
  const l = 0;
  const t = 0;
  const c3d4 = 270;
  const cd4 = 90;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * h) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const a1 = adj1 < 0 ? 0 : adj1 > a2 ? a2 : adj1;
  const th = (ss * a1) / cnstVal2;
  const aw = (ss * a2) / cnstVal2;
  const q1 = (th + aw) / 4;
  const hR = hd2 - q1;
  const q7 = hR * 2;
  const q8 = q7 * q7;
  const q9 = th * th;
  const q10 = q8 - q9;
  const q11 = Math.sqrt(q10);
  const iDx = (q11 * w) / q7;
  const maxAdj3 = (cnstVal2 * iDx) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const ah = (ss * a3) / cnstVal2;
  const y3 = hR + th;
  const q2 = w * w;
  const q3 = ah * ah;
  const q4 = q2 - q3;
  const q5 = Math.sqrt(q4);
  const dy = (q5 * hR) / w;
  const y5 = hR + dy;
  const y7 = y3 + dy;
  const q6 = aw - th;
  const dh = q6 / 2;
  const y4 = y5 - dh;
  const y8 = y7 + dh;
  const aw2 = aw / 2;
  const y6 = b - aw2;
  const x1 = l + ah;
  const swAng = Math.atan(dy / ah);
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / iDx);
  const swAng2 = dang2 - swAng;
  const swAngDg = (swAng * 180) / Math.PI;
  const swAng2Dg = (swAng2 * 180) / Math.PI;

  const d_val =
    "M" +
    r +
    "," +
    y3 +
    shapeArc({ cX: l, cY: hR, rX: w, rY: hR, stAng: 0, endAng: -cd4, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    l +
    "," +
    t +
    shapeArc({
      cX: l,
      cY: y3,
      rX: w,
      rY: hR,
      stAng: c3d4,
      endAng: c3d4 + cd4,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    r +
    "," +
    y3 +
    shapeArc({ cX: l, cY: y3, rX: w, rY: hR, stAng: 0, endAng: swAngDg, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    x1 +
    "," +
    y7 +
    " L" +
    x1 +
    "," +
    y8 +
    " L" +
    l +
    "," +
    y6 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    x1 +
    "," +
    y5 +
    shapeArc({
      cX: l,
      cY: hR,
      rX: w,
      rY: hR,
      stAng: swAngDg,
      endAng: swAngDg + swAng2Dg,
      isClose: false,
    }).replace("M", "L") +
    shapeArc({ cX: l, cY: hR, rX: w, rY: hR, stAng: 0, endAng: -cd4, isClose: false }).replace(
      "M",
      "L"
    ) +
    shapeArc({
      cX: l,
      cY: y3,
      rX: w,
      rY: hR,
      stAng: c3d4,
      endAng: c3d4 + cd4,
      isClose: false,
    }).replace("M", "L");

  return createPath({ d: d_val, ctx });
}

/**
 * Render curvedRightArrow shape
 */
export function renderCurvedRightArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1,
    adj1 = 25000 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  let sAdj3,
    adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj2") {
      sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj3") {
      sAdj3 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj3 !== undefined) {
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const hd2 = h / 2;
  const r = w;
  const b = h;
  const l = 0;
  const c3d4 = 270;
  const cd2 = 180;
  const cd4 = 90;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * h) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const a1 = adj1 < 0 ? 0 : adj1 > a2 ? a2 : adj1;
  const th = (ss * a1) / cnstVal2;
  const aw = (ss * a2) / cnstVal2;
  const q1 = (th + aw) / 4;
  const hR = hd2 - q1;
  const q7 = hR * 2;
  const q8 = q7 * q7;
  const q9 = th * th;
  const q10 = q8 - q9;
  const q11 = Math.sqrt(q10);
  const iDx = (q11 * w) / q7;
  const maxAdj3 = (cnstVal2 * iDx) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const ah = (ss * a3) / cnstVal2;
  const y3 = hR + th;
  const q2 = w * w;
  const q3 = ah * ah;
  const q4 = q2 - q3;
  const q5 = Math.sqrt(q4);
  const dy = (q5 * hR) / w;
  const y5 = hR + dy;
  const y7 = y3 + dy;
  const q6 = aw - th;
  const dh = q6 / 2;
  const y4 = y5 - dh;
  const y8 = y7 + dh;
  const aw2 = aw / 2;
  const y6 = b - aw2;
  const x1 = r - ah;
  const swAng = Math.atan(dy / ah);
  const stAng = Math.PI - swAng;
  const mswAng = -swAng;
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / iDx);
  const swAng2 = dang2 - Math.PI / 2;
  const stAngDg = (stAng * 180) / Math.PI;
  const mswAngDg = (mswAng * 180) / Math.PI;
  const swAngDg = (swAng * 180) / Math.PI;
  const swAng2dg = (swAng2 * 180) / Math.PI;

  const d_val =
    "M" +
    l +
    "," +
    hR +
    shapeArc({
      cX: w,
      cY: hR,
      rX: w,
      rY: hR,
      stAng: cd2,
      endAng: cd2 + mswAngDg,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    x1 +
    "," +
    y5 +
    " L" +
    x1 +
    "," +
    y4 +
    " L" +
    r +
    "," +
    y6 +
    " L" +
    x1 +
    "," +
    y8 +
    " L" +
    x1 +
    "," +
    y7 +
    shapeArc({
      cX: w,
      cY: y3,
      rX: w,
      rY: hR,
      stAng: stAngDg,
      endAng: stAngDg + swAngDg,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    l +
    "," +
    hR +
    shapeArc({
      cX: w,
      cY: hR,
      rX: w,
      rY: hR,
      stAng: cd2,
      endAng: cd2 + cd4,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    r +
    "," +
    th +
    shapeArc({
      cX: w,
      cY: y3,
      rX: w,
      rY: hR,
      stAng: c3d4,
      endAng: c3d4 + swAng2dg,
      isClose: false,
    }).replace("M", "L");
  return createPath({ d: d_val, ctx });
}

/**
 * Render curvedUpArrow shape
 */
export function renderCurvedUpArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1,
    adj1 = 25000 * slideFactor;
  let sAdj2,
    adj2 = 50000 * slideFactor;
  let sAdj3,
    adj3 = 25000 * slideFactor;
  const cnstVal1 = 50000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>({
      node: shapAdjst_ary[i],
      path: ["attrs", "name"],
    });
    if (sAdj_name === "adj1") {
      sAdj1 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj1 !== undefined) {
        adj1 = parseInt(sAdj1.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj2") {
      sAdj2 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj2 !== undefined) {
        adj2 = parseInt(sAdj2.substr(4)) * slideFactor;
      }
    } else if (sAdj_name === "adj3") {
      sAdj3 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj3 !== undefined) {
        adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
      }
    }
  }
  const wd2 = w / 2;
  const r = w;
  const b = h;
  const t = 0;
  const cd2 = 180;
  const cd4 = 90;
  const ss = Math.min(w, h);
  const maxAdj2 = (cnstVal1 * w) / ss;
  const a2 = adj2 < 0 ? 0 : adj2 > maxAdj2 ? maxAdj2 : adj2;
  const a1 = adj1 < 0 ? 0 : adj1 > cnstVal2 ? cnstVal2 : adj1;
  const th = (ss * a1) / cnstVal2;
  const aw = (ss * a2) / cnstVal2;
  const q1 = (th + aw) / 4;
  const wR = wd2 - q1;
  const q7 = wR * 2;
  const q8 = q7 * q7;
  const q9 = th * th;
  const q10 = q8 - q9;
  const q11 = Math.sqrt(q10);
  const idy = (q11 * h) / q7;
  const maxAdj3 = (cnstVal2 * idy) / ss;
  const a3 = adj3 < 0 ? 0 : adj3 > maxAdj3 ? maxAdj3 : adj3;
  const ah = (ss * a3) / cnstVal2;
  const x3 = wR + th;
  const q2 = h * h;
  const q3 = ah * ah;
  const q4 = q2 - q3;
  const q5 = Math.sqrt(q4);
  const dx = (q5 * wR) / h;
  const x5 = wR + dx;
  const x7 = x3 + dx;
  const q6 = aw - th;
  const dh = q6 / 2;
  const x4 = x5 - dh;
  const x8 = x7 + dh;
  const aw2 = aw / 2;
  const x6 = r - aw2;
  const y1 = t + ah;
  const swAng = Math.atan(dx / ah);
  const q12 = th / 2;
  const dang2 = Math.atan(q12 / idy);
  const swAng2 = dang2 - swAng;
  const stAng3 = Math.PI / 2 - swAng;
  const stAng2 = Math.PI / 2 - dang2;
  const stAng2dg = (stAng2 * 180) / Math.PI;
  const swAng2dg = (swAng2 * 180) / Math.PI;
  const stAng3dg = (stAng3 * 180) / Math.PI;
  const swAngDg = (swAng * 180) / Math.PI;

  const d_val =
    shapeArc({
      cX: wR,
      cY: 0,
      rX: wR,
      rY: h,
      stAng: stAng2dg,
      endAng: stAng2dg + swAng2dg,
      isClose: false,
    }) +
    " L" +
    x5 +
    "," +
    y1 +
    " L" +
    x4 +
    "," +
    y1 +
    " L" +
    x6 +
    "," +
    t +
    " L" +
    x8 +
    "," +
    y1 +
    " L" +
    x7 +
    "," +
    y1 +
    shapeArc({
      cX: x3,
      cY: 0,
      rX: wR,
      rY: h,
      stAng: stAng3dg,
      endAng: stAng3dg + swAngDg,
      isClose: false,
    }).replace("M", "L") +
    " L" +
    wR +
    "," +
    b +
    shapeArc({ cX: wR, cY: 0, rX: wR, rY: h, stAng: cd4, endAng: cd2, isClose: false }).replace(
      "M",
      "L"
    ) +
    " L" +
    th +
    "," +
    t +
    shapeArc({ cX: x3, cY: 0, rX: wR, rY: h, stAng: cd2, endAng: cd4, isClose: false }).replace(
      "M",
      "L"
    ) +
    "";
  return createPath({ d: d_val, ctx });
}

/**
 * Render swooshArrow shape
 */
