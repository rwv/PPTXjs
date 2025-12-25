/**
 * Border/accent callout shape renderer.
 *
 * Handles: borderCallout1/2/3, callout1/2/3, accentBorderCallout1/2/3, accentCallout1/2/3
 */

import { getTextByPathList } from "../../../object";
import type { CalloutContext } from "./shared";
import { createPath } from "./shared";

export function renderBorderAccentCallout(ctx: CalloutContext, shapType: string): string {
  const { node, w, h, slideFactor } = ctx;

  const shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
  const refr = slideFactor;
  let sAdj1,
    adj1 = 18750 * refr;
  let sAdj2,
    adj2 = -8333 * refr;
  let sAdj3,
    adj3 = 18750 * refr;
  let sAdj4,
    adj4 = -16667 * refr;
  let sAdj5,
    adj5 = 100000 * refr;
  let sAdj6,
    adj6 = -16667 * refr;
  let sAdj7,
    adj7 = 112963 * refr;
  let sAdj8,
    adj8 = -8333 * refr;
  if (shapAdjst_ary !== undefined) {
    for (let i = 0; i < shapAdjst_ary.length; i++) {
      const sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
      if (sAdj_name === "adj1") {
        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj1 = parseInt(sAdj1.substr(4)) * refr;
      } else if (sAdj_name === "adj2") {
        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj2 = parseInt(sAdj2.substr(4)) * refr;
      } else if (sAdj_name === "adj3") {
        sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj3 = parseInt(sAdj3.substr(4)) * refr;
      } else if (sAdj_name === "adj4") {
        sAdj4 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj4 = parseInt(sAdj4.substr(4)) * refr;
      } else if (sAdj_name === "adj5") {
        sAdj5 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj5 = parseInt(sAdj5.substr(4)) * refr;
      } else if (sAdj_name === "adj6") {
        sAdj6 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj6 = parseInt(sAdj6.substr(4)) * refr;
      } else if (sAdj_name === "adj7") {
        sAdj7 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj7 = parseInt(sAdj7.substr(4)) * refr;
      } else if (sAdj_name === "adj8") {
        sAdj8 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
        adj8 = parseInt(sAdj8.substr(4)) * refr;
      }
    }
  }
  const cnstVal1 = 100000 * refr;
  let d_val;

  switch (shapType) {
    case "borderCallout1":
    case "callout1": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 112500 * refr;
        adj4 = -38333 * refr;
      }
      const y1 = (h * adj1) / cnstVal1;
      const x1 = (w * adj2) / cnstVal1;
      const y2 = (h * adj3) / cnstVal1;
      const x2 = (w * adj4) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1 +
        "," +
        y1 +
        " L" +
        x2 +
        "," +
        y2;
      break;
    }
    case "borderCallout2":
    case "callout2": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;

        adj5 = 112500 * refr;
        adj6 = -46667 * refr;
      }
      const y1_2 = (h * adj1) / cnstVal1;
      const x1_2 = (w * adj2) / cnstVal1;
      const y2_2 = (h * adj3) / cnstVal1;
      const x2_2 = (w * adj4) / cnstVal1;

      const y3 = (h * adj5) / cnstVal1;
      const x3 = (w * adj6) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1_2 +
        "," +
        y1_2 +
        " L" +
        x2_2 +
        "," +
        y2_2 +
        " L" +
        x3 +
        "," +
        y3 +
        " L" +
        x2_2 +
        "," +
        y2_2;

      break;
    }
    case "borderCallout3":
    case "callout3": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;

        adj5 = 100000 * refr;
        adj6 = -16667 * refr;

        adj7 = 112963 * refr;
        adj8 = -8333 * refr;
      }
      const y1_3 = (h * adj1) / cnstVal1;
      const x1_3 = (w * adj2) / cnstVal1;
      const y2_3 = (h * adj3) / cnstVal1;
      const x2_3 = (w * adj4) / cnstVal1;

      const y3_3 = (h * adj5) / cnstVal1;
      const x3_3 = (w * adj6) / cnstVal1;

      const y4 = (h * adj7) / cnstVal1;
      const x4 = (w * adj8) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1_3 +
        "," +
        y1_3 +
        " L" +
        x2_3 +
        "," +
        y2_3 +
        " L" +
        x3_3 +
        "," +
        y3_3 +
        " L" +
        x4 +
        "," +
        y4 +
        " L" +
        x3_3 +
        "," +
        y3_3 +
        " L" +
        x2_3 +
        "," +
        y2_3;
      break;
    }
    case "accentBorderCallout1":
    case "accentCallout1": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 112500 * refr;
        adj4 = -38333 * refr;
      }
      const y1_4 = (h * adj1) / cnstVal1;
      const x1_4 = (w * adj2) / cnstVal1;
      const y2_4 = (h * adj3) / cnstVal1;
      const x2_4 = (w * adj4) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1_4 +
        "," +
        y1_4 +
        " L" +
        x2_4 +
        "," +
        y2_4 +
        " M" +
        x1_4 +
        "," +
        0 +
        " L" +
        x1_4 +
        "," +
        h;
      break;
    }
    case "accentBorderCallout2":
    case "accentCallout2": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;
        adj5 = 112500 * refr;
        adj6 = -46667 * refr;
      }
      const y1_5 = (h * adj1) / cnstVal1;
      const x1_5 = (w * adj2) / cnstVal1;
      const y2_5 = (h * adj3) / cnstVal1;
      const x2_5 = (w * adj4) / cnstVal1;
      const y3_5 = (h * adj5) / cnstVal1;
      const x3_5 = (w * adj6) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1_5 +
        "," +
        y1_5 +
        " L" +
        x2_5 +
        "," +
        y2_5 +
        " L" +
        x3_5 +
        "," +
        y3_5 +
        " L" +
        x2_5 +
        "," +
        y2_5 +
        " M" +
        x1_5 +
        "," +
        0 +
        " L" +
        x1_5 +
        "," +
        h;

      break;
    }
    case "accentBorderCallout3":
    case "accentCallout3": {
      if (shapAdjst_ary === undefined) {
        adj1 = 18750 * refr;
        adj2 = -8333 * refr;
        adj3 = 18750 * refr;
        adj4 = -16667 * refr;
        adj5 = 100000 * refr;
        adj6 = -16667 * refr;
        adj7 = 112963 * refr;
        adj8 = -8333 * refr;
      }
      const y1_6 = (h * adj1) / cnstVal1;
      const x1_6 = (w * adj2) / cnstVal1;
      const y2_6 = (h * adj3) / cnstVal1;
      const x2_6 = (w * adj4) / cnstVal1;
      const y3_6 = (h * adj5) / cnstVal1;
      const x3_6 = (w * adj6) / cnstVal1;
      const y4_6 = (h * adj7) / cnstVal1;
      const x4_6 = (w * adj8) / cnstVal1;
      d_val =
        "M" +
        0 +
        "," +
        0 +
        " L" +
        w +
        "," +
        0 +
        " L" +
        w +
        "," +
        h +
        " L" +
        0 +
        "," +
        h +
        " z" +
        " M" +
        x1_6 +
        "," +
        y1_6 +
        " L" +
        x2_6 +
        "," +
        y2_6 +
        " L" +
        x3_6 +
        "," +
        y3_6 +
        " L" +
        x4_6 +
        "," +
        y4_6 +
        " L" +
        x3_6 +
        "," +
        y3_6 +
        " L" +
        x2_6 +
        "," +
        y2_6 +
        " M" +
        x1_6 +
        "," +
        0 +
        " L" +
        x1_6 +
        "," +
        h;
      break;
    }
    default:
      d_val = "";
  }

  return createPath(d_val, ctx);
}
