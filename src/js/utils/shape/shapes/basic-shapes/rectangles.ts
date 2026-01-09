import type { BasicShapeParams } from "./types";

export function renderRectLike(shapType: string, params: BasicShapeParams): string {
  const { w, h, shpId, fillColor, grndFillFlg, imgFillFlg, border } = params;
  let result = "";
  result +=
    "<rect x='0' y='0' width='" +
    w +
    "' height='" +
    h +
    "' fill='" +
    (!imgFillFlg
      ? grndFillFlg
        ? "url(#linGrd_" + shpId + ")"
        : fillColor
      : "url(#imgPtrn_" + shpId + ")") +
    "' stroke='" +
    border.color +
    "' stroke-width='" +
    border.width +
    "' stroke-dasharray='" +
    border.strokeDasharray +
    "' />";

  if (shapType === "flowChartPredefinedProcess") {
    result +=
      "<rect x='" +
      w * (1 / 8) +
      "' y='0' width='" +
      w * (6 / 8) +
      "' height='" +
      h +
      "' fill='none' stroke='" +
      border.color +
      "' stroke-width='" +
      border.width +
      "' stroke-dasharray='" +
      border.strokeDasharray +
      "' />";
  } else if (shapType === "flowChartInternalStorage") {
    result +=
      " <polyline points='" +
      w * (1 / 8) +
      " 0," +
      w * (1 / 8) +
      " " +
      h +
      "' fill='none' stroke='" +
      border.color +
      "' stroke-width='" +
      border.width +
      "' stroke-dasharray='" +
      border.strokeDasharray +
      "' />";
    result +=
      " <polyline points='0 " +
      h * (1 / 8) +
      "," +
      w +
      " " +
      h * (1 / 8) +
      "' fill='none' stroke='" +
      border.color +
      "' stroke-width='" +
      border.width +
      "' stroke-dasharray='" +
      border.strokeDasharray +
      "' />";
  }
  return result;
}
