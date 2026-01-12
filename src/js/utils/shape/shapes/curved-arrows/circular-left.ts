import { shapeArc } from "../helpers/arc";
import { getTextByPathList } from "../../../object";
import type { CurvedArrowContext } from "./types";
import { createPath, getShapeAdjustments } from "./helpers";

/**
 * Render leftCircularArrow shape
 */
export function renderLeftCircularArrow(ctx: CurvedArrowContext): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1,
    adj1 = 12500 * slideFactor;
  let sAdj2,
    adj2 = ((-1142319 / 60000) * Math.PI) / 180;
  let sAdj3,
    adj3 = ((1142319 / 60000) * Math.PI) / 180;
  let sAdj4,
    adj4 = ((10800000 / 60000) * Math.PI) / 180;
  let sAdj5,
    adj5 = 12500 * slideFactor;
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
        adj2 = ((parseInt(sAdj2.substr(4)) / 60000) * Math.PI) / 180;
      }
    } else if (sAdj_name === "adj3") {
      sAdj3 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj3 !== undefined) {
        adj3 = ((parseInt(sAdj3.substr(4)) / 60000) * Math.PI) / 180;
      }
    } else if (sAdj_name === "adj4") {
      sAdj4 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj4 !== undefined) {
        adj4 = ((parseInt(sAdj4.substr(4)) / 60000) * Math.PI) / 180;
      }
    } else if (sAdj_name === "adj5") {
      sAdj5 = getTextByPathList<string>({ node: shapAdjst_ary[i], path: ["attrs", "fmla"] });
      if (sAdj5 !== undefined) {
        adj5 = parseInt(sAdj5.substr(4)) * slideFactor;
      }
    }
  }
  const vc = h / 2;
  const hc = w / 2;
  const wd2 = w / 2;
  const hd2 = h / 2;
  const ss = Math.min(w, h);
  const cnstVal1 = 25000 * slideFactor;
  const cnstVal2 = 100000 * slideFactor;
  const rdAngVal1 = ((1 / 60000) * Math.PI) / 180;
  const rdAngVal2 = ((21599999 / 60000) * Math.PI) / 180;
  const rdAngVal3 = 2 * Math.PI;
  const cd2 = 180;
  const a5 = adj5 < 0 ? 0 : adj5 > cnstVal1 ? cnstVal1 : adj5;
  const maxAdj1 = a5 * 2;
  const a1 = adj1 < 0 ? 0 : adj1 > maxAdj1 ? maxAdj1 : adj1;
  const enAng = adj3 < rdAngVal1 ? rdAngVal1 : adj3 > rdAngVal2 ? rdAngVal2 : adj3;
  const stAng = adj4 < 0 ? 0 : adj4 > rdAngVal2 ? rdAngVal2 : adj4;
  const th = (ss * a1) / cnstVal2;
  const thh = (ss * a5) / cnstVal2;
  const th2 = th / 2;
  const rw1 = wd2 + th2 - thh;
  const rh1 = hd2 + th2 - thh;
  const rw2 = rw1 - th;
  const rh2 = rh1 - th;
  const rw3 = rw2 + th2;
  const rh3 = rh2 + th2;
  const wtH = rw3 * Math.sin(enAng);
  const htH = rh3 * Math.cos(enAng);
  const dxH = rw3 * Math.cos(Math.atan2(wtH, htH));
  const dyH = rh3 * Math.sin(Math.atan2(wtH, htH));
  const xH = hc + dxH;
  const yH = vc + dyH;
  const rI = rw2 < rh2 ? rw2 : rh2;
  const u1 = dxH * dxH;
  const u2 = dyH * dyH;
  const u3 = rI * rI;
  const u4 = u1 - u3;
  const u5 = u2 - u3;
  const u6 = (u4 * u5) / u1;
  const u7 = u6 / u2;
  const u8 = 1 - u7;
  const u9 = Math.sqrt(u8);
  const u10 = u4 / dxH;
  const u11 = u10 / dyH;
  const u12 = (1 + u9) / u11;
  const u13 = Math.atan2(u12, 1);
  const u14 = u13 + rdAngVal3;
  const u15 = u13 > 0 ? u13 : u14;
  const u16 = u15 - enAng;
  const u17 = u16 + rdAngVal3;
  const u18 = u16 > 0 ? u16 : u17;
  const u19 = u18 - cd2;
  const u20 = u18 - rdAngVal3;
  const u21 = u19 > 0 ? u20 : u18;
  const u22 = Math.abs(u21);
  const minAng = u22 * -1;
  const u23 = Math.abs(adj2);
  const a2 = u23 * -1;
  const aAng = a2 < minAng ? minAng : a2 > 0 ? 0 : a2;
  const ptAng = enAng + aAng;
  const wtA = rw3 * Math.sin(ptAng);
  const htA = rh3 * Math.cos(ptAng);
  const dxA = rw3 * Math.cos(Math.atan2(wtA, htA));
  const dyA = rh3 * Math.sin(Math.atan2(wtA, htA));
  const xA = hc + dxA;
  const yA = vc + dyA;
  const wtE = rw1 * Math.sin(stAng);
  const htE = rh1 * Math.cos(stAng);
  const dxE = rw1 * Math.cos(Math.atan2(wtE, htE));
  const dyE = rh1 * Math.sin(Math.atan2(wtE, htE));
  const xE = hc + dxE;
  const yE = vc + dyE;
  const wtD = rw2 * Math.sin(stAng);
  const htD = rh2 * Math.cos(stAng);
  const dxD = rw2 * Math.cos(Math.atan2(wtD, htD));
  const dyD = rh2 * Math.sin(Math.atan2(wtD, htD));
  const xD = hc + dxD;
  const yD = vc + dyD;
  const dxG = thh * Math.cos(ptAng);
  const dyG = thh * Math.sin(ptAng);
  const xG = xH + dxG;
  const yG = yH + dyG;
  const dxB = thh * Math.cos(ptAng);
  const dyB = thh * Math.sin(ptAng);
  const xB = xH - dxB;
  const yB = yH - dyB;
  const sx1 = xB - hc;
  const sy1 = yB - vc;
  const sx2 = xG - hc;
  const sy2 = yG - vc;
  const rO = rw1 < rh1 ? rw1 : rh1;
  const x1O = (sx1 * rO) / rw1;
  const y1O = (sy1 * rO) / rh1;
  const x2O = (sx2 * rO) / rw1;
  const y2O = (sy2 * rO) / rh1;
  const dxO = x2O - x1O;
  const dyO = y2O - y1O;
  const dO = Math.sqrt(dxO * dxO + dyO * dyO);
  const q1 = x1O * y2O;
  const q2 = x2O * y1O;
  const DO = q1 - q2;
  const q3 = rO * rO;
  const q4 = dO * dO;
  const q5 = q3 * q4;
  const q6 = DO * DO;
  const q7 = q5 - q6;
  const q8 = q7 > 0 ? q7 : 0;
  const sdelO = Math.sqrt(q8);
  const ndyO = dyO * -1;
  const sdyO = ndyO > 0 ? -1 : 1;
  const q9 = sdyO * dxO;
  const q10 = q9 * sdelO;
  const q11 = DO * dyO;
  const dxF1 = (q11 + q10) / q4;
  const q12 = q11 - q10;
  const dxF2 = q12 / q4;
  const adyO = Math.abs(dyO);
  const q13 = adyO * sdelO;
  const q14 = (DO * dxO) / -1;
  const dyF1 = (q14 + q13) / q4;
  const q15 = q14 - q13;
  const dyF2 = q15 / q4;
  const q16 = x2O - dxF1;
  const q17 = x2O - dxF2;
  const q18 = y2O - dyF1;
  const q19 = y2O - dyF2;
  const q20 = Math.sqrt(q16 * q16 + q18 * q18);
  const q21 = Math.sqrt(q17 * q17 + q19 * q19);
  const q22 = q21 - q20;
  const dxF = q22 > 0 ? dxF1 : dxF2;
  const dyF = q22 > 0 ? dyF1 : dyF2;
  const sdxF = (dxF * rw1) / rO;
  const sdyF = (dyF * rh1) / rO;
  const xF = hc + sdxF;
  const yF = vc + sdyF;
  const x1I = (sx1 * rI) / rw2;
  const y1I = (sy1 * rI) / rh2;
  const x2I = (sx2 * rI) / rw2;
  const y2I = (sy2 * rI) / rh2;
  const dxI = x2I - x1I;
  const dyI = y2I - y1I;
  const dI = Math.sqrt(dxI * dxI + dyI * dyI);
  const v1 = x1I * y2I;
  const v2 = x2I * y1I;
  const DI = v1 - v2;
  const v3 = rI * rI;
  const v4 = dI * dI;
  const v5 = v3 * v4;
  const v6 = DI * DI;
  const v7 = v5 - v6;
  const v8 = v7 > 0 ? v7 : 0;
  const sdelI = Math.sqrt(v8);
  const v9 = sdyO * dxI;
  const v10 = v9 * sdelI;
  const v11 = DI * dyI;
  const dxC1 = (v11 + v10) / v4;
  const v12 = v11 - v10;
  const dxC2 = v12 / v4;
  const adyI = Math.abs(dyI);
  const v13 = adyI * sdelI;
  const v14 = (DI * dxI) / -1;
  const dyC1 = (v14 + v13) / v4;
  const v15 = v14 - v13;
  const dyC2 = v15 / v4;
  const v16 = x1I - dxC1;
  const v17 = x1I - dxC2;
  const v18 = y1I - dyC1;
  const v19 = y1I - dyC2;
  const v20 = Math.sqrt(v16 * v16 + v18 * v18);
  const v21 = Math.sqrt(v17 * v17 + v19 * v19);
  const v22 = v21 - v20;
  const dxC = v22 > 0 ? dxC1 : dxC2;
  const dyC = v22 > 0 ? dyC1 : dyC2;
  const sdxC = (dxC * rw2) / rI;
  const sdyC = (dyC * rh2) / rI;
  const xC = hc + sdxC;
  const yC = vc + sdyC;
  const ist0 = Math.atan2(sdyC, sdxC);
  const ist1 = ist0 + rdAngVal3;
  const istAng0 = ist0 > 0 ? ist0 : ist1;
  const isw1 = stAng - istAng0;
  const isw2 = isw1 + rdAngVal3;
  const iswAng0 = isw1 > 0 ? isw1 : isw2;
  const istAng = istAng0 + iswAng0;
  const iswAng = -iswAng0;
  const p1 = xF - xC;
  const p2 = yF - yC;
  const p3 = Math.sqrt(p1 * p1 + p2 * p2);
  const p4 = p3 / 2;
  const p5 = p4 - thh;
  const xGp = p5 > 0 ? xF : xG;
  const yGp = p5 > 0 ? yF : yG;
  const xBp = p5 > 0 ? xC : xB;
  const yBp = p5 > 0 ? yC : yB;
  const en0 = Math.atan2(sdyF, sdxF);
  const en1 = en0 + rdAngVal3;
  const en2 = en0 > 0 ? en0 : en1;
  const sw0 = en2 - stAng;
  const sw1 = sw0 - rdAngVal3;
  const swAng = sw0 > 0 ? sw1 : sw0;
  const stAng0 = stAng + swAng;

  const strtAng = (stAng0 * 180) / Math.PI;
  const endAng = (stAng * 180) / Math.PI;
  const stiAng = (istAng * 180) / Math.PI;
  const swiAng = (iswAng * 180) / Math.PI;
  const ediAng = stiAng + swiAng;

  const d_val =
    "M" +
    xE +
    "," +
    yE +
    " L" +
    xD +
    "," +
    yD +
    shapeArc(w / 2, h / 2, rw2, rh2, stiAng, ediAng, false).replace("M", "L") +
    " L" +
    xBp +
    "," +
    yBp +
    " L" +
    xA +
    "," +
    yA +
    " L" +
    xGp +
    "," +
    yGp +
    " L" +
    xF +
    "," +
    yF +
    shapeArc(w / 2, h / 2, rw1, rh1, strtAng, endAng, false).replace("M", "L") +
    " z";
  return createPath(d_val, ctx);
}

// =============================================================================
