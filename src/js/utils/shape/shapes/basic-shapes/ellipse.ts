/**
 * Ellipse shape renderer.
 *
 * Handles: ellipse, flowChartConnector, flowChartSummingJunction, flowChartOr
 */

import type { BasicShapeParams } from "./shared";
import { getFillAttr } from "./shared";

export function renderEllipse(shapType: string, params: BasicShapeParams): string {
  const { w, h, border } = params;
  let result =
    "<ellipse cx='" +
    w / 2 +
    "' cy='" +
    h / 2 +
    "' rx='" +
    w / 2 +
    "' ry='" +
    h / 2 +
    "' fill='" +
    getFillAttr(params) +
    "' stroke='" +
    border.color +
    "' stroke-width='" +
    border.width +
    "' stroke-dasharray='" +
    border.strokeDasharray +
    "' />";

  if (shapType === "flowChartOr") {
    result +=
      " <polyline points='" +
      w / 2 +
      " " +
      0 +
      "," +
      w / 2 +
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
      " <polyline points='" +
      0 +
      " " +
      h / 2 +
      "," +
      w +
      " " +
      h / 2 +
      "' fill='none' stroke='" +
      border.color +
      "' stroke-width='" +
      border.width +
      "' stroke-dasharray='" +
      border.strokeDasharray +
      "' />";
  } else if (shapType === "flowChartSummingJunction") {
    const hc = w / 2;
    const vc = h / 2;
    const wd2 = w / 2;
    const hd2 = h / 2;
    const angVal = Math.PI / 4;
    const iDx = wd2 * Math.cos(angVal);
    const idy = hd2 * Math.sin(angVal);
    const il = hc - iDx;
    const ir = hc + iDx;
    const it = vc - idy;
    const ib = vc + idy;
    result +=
      " <polyline points='" +
      il +
      " " +
      it +
      "," +
      ir +
      " " +
      ib +
      "' fill='none' stroke='" +
      border.color +
      "' stroke-width='" +
      border.width +
      "' stroke-dasharray='" +
      border.strokeDasharray +
      "' />";
    result +=
      " <polyline points='" +
      ir +
      " " +
      it +
      "," +
      il +
      " " +
      ib +
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
