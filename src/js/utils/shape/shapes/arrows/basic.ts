import { getTextByPathList } from "../../../object";
import type { XmlNode } from "../../../../types/pptx-xml";
import type { ArrowShapeContext } from "./types";
import { createPolygon } from "./helpers";

const getShapeAdjustments = (node: XmlNode): XmlNode[] => {
  const shapAdjst = getTextByPathList<XmlNode | XmlNode[]>(node, [
    "p:spPr",
    "a:prstGeom",
    "a:avLst",
    "a:gd",
  ]);
  return Array.isArray(shapAdjst) ? shapAdjst : shapAdjst ? [shapAdjst] : [];
};

/**
 * Render rightArrow shape
 */
export function renderRightArrow(ctx: ArrowShapeContext): string {
  const { node, w, h } = ctx;
  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1_val = 0.25,
    sAdj2_val = 0.5;
  const max_sAdj2_const = w / h;

  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        sAdj1_val = 0.5 - parseInt(sAdj1.substr(4)) / 200000;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        const sAdj2_val2 = parseInt(sAdj2.substr(4)) / 100000;
        sAdj2_val = 1 - sAdj2_val2 / max_sAdj2_const;
      }
    }
  }

  const points = `${w} ${h / 2},${sAdj2_val * w} 0,${sAdj2_val * w} ${sAdj1_val * h},0 ${sAdj1_val * h},0 ${(1 - sAdj1_val) * h},${sAdj2_val * w} ${(1 - sAdj1_val) * h},${sAdj2_val * w} ${h}`;
  return " " + createPolygon(points, ctx);
}

export function renderLeftArrow(ctx: ArrowShapeContext): string {
  const { node, w, h } = ctx;
  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1_val = 0.25,
    sAdj2_val = 0.5;
  const max_sAdj2_const = w / h;

  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        sAdj1_val = 0.5 - parseInt(sAdj1.substr(4)) / 200000;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        const sAdj2_val2 = parseInt(sAdj2.substr(4)) / 100000;
        sAdj2_val = sAdj2_val2 / max_sAdj2_const;
      }
    }
  }

  const points = `0 ${h / 2},${sAdj2_val * w} ${h},${sAdj2_val * w} ${(1 - sAdj1_val) * h},${w} ${(1 - sAdj1_val) * h},${w} ${sAdj1_val * h},${sAdj2_val * w} ${sAdj1_val * h},${sAdj2_val * w} 0`;
  return " " + createPolygon(points, ctx);
}

export function renderDownArrow(ctx: ArrowShapeContext, shapType: string): string {
  const { node, w, h } = ctx;
  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1_val = 0.25,
    sAdj2_val = 0.5;
  const max_sAdj2_const = h / w;

  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        sAdj1_val = parseInt(sAdj1.substr(4)) / 200000;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        const sAdj2_val2 = parseInt(sAdj2.substr(4)) / 100000;
        sAdj2_val = sAdj2_val2 / max_sAdj2_const;
      }
    }
  }

  if (shapType === "flowChartOffpageConnector") {
    sAdj1_val = 0.5;
    sAdj2_val = 0.212;
  }

  const points = `${(0.5 - sAdj1_val) * w} 0,${(0.5 - sAdj1_val) * w} ${(1 - sAdj2_val) * h},0 ${(1 - sAdj2_val) * h},${w / 2} ${h},${w} ${(1 - sAdj2_val) * h},${(0.5 + sAdj1_val) * w} ${(1 - sAdj2_val) * h},${(0.5 + sAdj1_val) * w} 0`;
  return " " + createPolygon(points, ctx);
}

export function renderUpArrow(ctx: ArrowShapeContext): string {
  const { node, w, h } = ctx;
  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1_val = 0.25,
    sAdj2_val = 0.5;
  const max_sAdj2_const = h / w;

  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        sAdj1_val = parseInt(sAdj1.substr(4)) / 200000;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        const sAdj2_val2 = parseInt(sAdj2.substr(4)) / 100000;
        sAdj2_val = sAdj2_val2 / max_sAdj2_const;
      }
    }
  }

  const points = `${w / 2} 0,0 ${sAdj2_val * h},${(0.5 - sAdj1_val) * w} ${sAdj2_val * h},${(0.5 - sAdj1_val) * w} ${h},${(0.5 + sAdj1_val) * w} ${h},${(0.5 + sAdj1_val) * w} ${sAdj2_val * h},${w} ${sAdj2_val * h}`;
  return " " + createPolygon(points, ctx);
}

export function renderLeftRightArrow(ctx: ArrowShapeContext): string {
  const { node, w, h } = ctx;
  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1_val = 0.25,
    sAdj2_val = 0.25;
  const max_sAdj2_const = w / h;

  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        sAdj1_val = 0.5 - parseInt(sAdj1.substr(4)) / 200000;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        const sAdj2_val2 = parseInt(sAdj2.substr(4)) / 100000;
        sAdj2_val = sAdj2_val2 / max_sAdj2_const;
      }
    }
  }

  const points = `0 ${h / 2},${sAdj2_val * w} ${h},${sAdj2_val * w} ${(1 - sAdj1_val) * h},${(1 - sAdj2_val) * w} ${(1 - sAdj1_val) * h},${(1 - sAdj2_val) * w} ${h},${w} ${h / 2},${(1 - sAdj2_val) * w} 0,${(1 - sAdj2_val) * w} ${sAdj1_val * h},${sAdj2_val * w} ${sAdj1_val * h},${sAdj2_val * w} 0`;
  return " " + createPolygon(points, ctx);
}

export function renderUpDownArrow(ctx: ArrowShapeContext): string {
  const { node, w, h } = ctx;
  const shapAdjst_ary = getShapeAdjustments(node);
  let sAdj1_val = 0.25,
    sAdj2_val = 0.25;
  const max_sAdj2_const = h / w;

  for (let i = 0; i < shapAdjst_ary.length; i++) {
    const sAdj_name = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "name"]);
    if (sAdj_name === "adj1") {
      const sAdj1 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj1 !== undefined) {
        sAdj1_val = 0.5 - parseInt(sAdj1.substr(4)) / 200000;
      }
    } else if (sAdj_name === "adj2") {
      const sAdj2 = getTextByPathList<string>(shapAdjst_ary[i], ["attrs", "fmla"]);
      if (sAdj2 !== undefined) {
        const sAdj2_val2 = parseInt(sAdj2.substr(4)) / 100000;
        sAdj2_val = sAdj2_val2 / max_sAdj2_const;
      }
    }
  }

  const points = `${w / 2} 0,0 ${sAdj2_val * h},${sAdj1_val * w} ${sAdj2_val * h},${sAdj1_val * w} ${(1 - sAdj2_val) * h},0 ${(1 - sAdj2_val) * h},${w / 2} ${h},${w} ${(1 - sAdj2_val) * h},${(1 - sAdj1_val) * w} ${(1 - sAdj2_val) * h},${(1 - sAdj1_val) * w} ${sAdj2_val * h},${w} ${sAdj2_val * h}`;
  return " " + createPolygon(points, ctx);
}

// =============================================================================
// Complex Arrow Shapes
// =============================================================================
