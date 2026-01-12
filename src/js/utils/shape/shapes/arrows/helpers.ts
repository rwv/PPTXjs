import type { ArrowShapeContext } from "./types";

export function getFillAttr(ctx: ArrowShapeContext): string {
  const { imgFillFlg, grndFillFlg, shpId, fillColor } = ctx;
  if (imgFillFlg) return `url(#imgPtrn_${shpId})`;
  if (grndFillFlg) return `url(#linGrd_${shpId})`;
  return fillColor;
}

export function getStrokeAttrs(ctx: ArrowShapeContext): string {
  const { border } = ctx;
  return `stroke='${border.color}' stroke-width='${border.width}' stroke-dasharray='${border.strokeDasharray}'`;
}

type CreatePolygonOptions = {
  points: string;
  ctx: ArrowShapeContext;
};

export function createPolygon({ points, ctx }: CreatePolygonOptions): string {
  return `<polygon points='${points}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}

type CreatePathOptions = {
  d: string;
  ctx: ArrowShapeContext;
};

export function createPath({ d, ctx }: CreatePathOptions): string {
  return `<path d='${d}' fill='${getFillAttr(ctx)}' ${getStrokeAttrs(ctx)} />`;
}
