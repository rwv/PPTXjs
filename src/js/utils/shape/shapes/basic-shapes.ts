/**
 * Basic shape rendering module
 *
 * Handles fundamental shape types including:
 * - Rectangles (rect, flowChartProcess, actionButtonBlank)
 * - Ellipses (ellipse, flowChartConnector, flowChartOr)
 * - Round rectangles (roundRect, round1Rect, round2DiagRect, etc.)
 * - Snip rectangles (snip1Rect, snip2DiagRect, etc.)
 * - Irregular seals (irregularSeal1, irregularSeal2)
 */

import { getTextByPathList } from "../../object";
import { shapeSnipRoundRect } from "./helpers/snip-round-rect";

export interface BasicShapeParams {
  node: any;
  w: number;
  h: number;
  shpId: any;
  fillColor: string;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  border: any;
}

/**
 * Check if shape type is a basic shape
 */
export function isBasicShape(shapType: string): boolean {
  const basicShapes = [
    "rect",
    "flowChartProcess",
    "flowChartPredefinedProcess",
    "flowChartInternalStorage",
    "actionButtonBlank",
    "irregularSeal1",
    "irregularSeal2",
    "ellipse",
    "flowChartConnector",
    "flowChartSummingJunction",
    "flowChartOr",
    "roundRect",
    "round1Rect",
    "round2DiagRect",
    "round2SameRect",
    "snip1Rect",
    "snip2DiagRect",
    "snip2SameRect",
    "flowChartAlternateProcess",
    "flowChartPunchedCard",
    "snipRoundRect",
  ];
  return basicShapes.includes(shapType);
}

/**
 * Render basic shape SVG
 */
export function renderBasicShape(shapType: string, params: BasicShapeParams): string {
  const { node, w, h, shpId, fillColor, grndFillFlg, imgFillFlg, border } = params;
  let result = "";

  switch (shapType) {
    case "rect":
    case "flowChartProcess":
    case "flowChartPredefinedProcess":
    case "flowChartInternalStorage":
    case "actionButtonBlank":
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

      if (shapType == "flowChartPredefinedProcess") {
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
      } else if (shapType == "flowChartInternalStorage") {
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
      break;
    case "irregularSeal1":
    case "irregularSeal2":
      if (shapType == "irregularSeal1") {
        var d =
          "M" +
          (w * 10800) / 21600 +
          "," +
          (h * 5800) / 21600 +
          " L" +
          (w * 14522) / 21600 +
          "," +
          0 +
          " L" +
          (w * 14155) / 21600 +
          "," +
          (h * 5325) / 21600 +
          " L" +
          (w * 18380) / 21600 +
          "," +
          (h * 4457) / 21600 +
          " L" +
          (w * 16702) / 21600 +
          "," +
          (h * 7315) / 21600 +
          " L" +
          (w * 21097) / 21600 +
          "," +
          (h * 8137) / 21600 +
          " L" +
          (w * 17607) / 21600 +
          "," +
          (h * 10475) / 21600 +
          " L" +
          w +
          "," +
          (h * 13290) / 21600 +
          " L" +
          (w * 16837) / 21600 +
          "," +
          (h * 12942) / 21600 +
          " L" +
          (w * 18145) / 21600 +
          "," +
          (h * 18095) / 21600 +
          " L" +
          (w * 14020) / 21600 +
          "," +
          (h * 14457) / 21600 +
          " L" +
          (w * 13247) / 21600 +
          "," +
          (h * 19737) / 21600 +
          " L" +
          (w * 10532) / 21600 +
          "," +
          (h * 14935) / 21600 +
          " L" +
          (w * 8485) / 21600 +
          "," +
          h +
          " L" +
          (w * 7715) / 21600 +
          "," +
          (h * 15627) / 21600 +
          " L" +
          (w * 4762) / 21600 +
          "," +
          (h * 17617) / 21600 +
          " L" +
          (w * 5667) / 21600 +
          "," +
          (h * 13937) / 21600 +
          " L" +
          (w * 135) / 21600 +
          "," +
          (h * 14587) / 21600 +
          " L" +
          (w * 3722) / 21600 +
          "," +
          (h * 11775) / 21600 +
          " L" +
          0 +
          "," +
          (h * 8615) / 21600 +
          " L" +
          (w * 4627) / 21600 +
          "," +
          (h * 7617) / 21600 +
          " L" +
          (w * 370) / 21600 +
          "," +
          (h * 2295) / 21600 +
          " L" +
          (w * 7312) / 21600 +
          "," +
          (h * 6320) / 21600 +
          " L" +
          (w * 8352) / 21600 +
          "," +
          (h * 2295) / 21600 +
          " z";
      } else if (shapType == "irregularSeal2") {
        var d =
          "M" +
          (w * 11462) / 21600 +
          "," +
          (h * 4342) / 21600 +
          " L" +
          (w * 14790) / 21600 +
          "," +
          0 +
          " L" +
          (w * 14525) / 21600 +
          "," +
          (h * 5777) / 21600 +
          " L" +
          (w * 18007) / 21600 +
          "," +
          (h * 3172) / 21600 +
          " L" +
          (w * 16380) / 21600 +
          "," +
          (h * 6532) / 21600 +
          " L" +
          w +
          "," +
          (h * 6645) / 21600 +
          " L" +
          (w * 16985) / 21600 +
          "," +
          (h * 9402) / 21600 +
          " L" +
          (w * 18270) / 21600 +
          "," +
          (h * 11290) / 21600 +
          " L" +
          (w * 16380) / 21600 +
          "," +
          (h * 12310) / 21600 +
          " L" +
          (w * 18877) / 21600 +
          "," +
          (h * 15632) / 21600 +
          " L" +
          (w * 14640) / 21600 +
          "," +
          (h * 14350) / 21600 +
          " L" +
          (w * 14942) / 21600 +
          "," +
          (h * 17370) / 21600 +
          " L" +
          (w * 12180) / 21600 +
          "," +
          (h * 15935) / 21600 +
          " L" +
          (w * 11612) / 21600 +
          "," +
          (h * 18842) / 21600 +
          " L" +
          (w * 9872) / 21600 +
          "," +
          (h * 17370) / 21600 +
          " L" +
          (w * 8700) / 21600 +
          "," +
          (h * 19712) / 21600 +
          " L" +
          (w * 7527) / 21600 +
          "," +
          (h * 18125) / 21600 +
          " L" +
          (w * 4917) / 21600 +
          "," +
          h +
          " L" +
          (w * 4805) / 21600 +
          "," +
          (h * 18240) / 21600 +
          " L" +
          (w * 1285) / 21600 +
          "," +
          (h * 17825) / 21600 +
          " L" +
          (w * 3330) / 21600 +
          "," +
          (h * 15370) / 21600 +
          " L" +
          0 +
          "," +
          (h * 12877) / 21600 +
          " L" +
          (w * 3935) / 21600 +
          "," +
          (h * 11592) / 21600 +
          " L" +
          (w * 1172) / 21600 +
          "," +
          (h * 8270) / 21600 +
          " L" +
          (w * 5372) / 21600 +
          "," +
          (h * 7817) / 21600 +
          " L" +
          (w * 4502) / 21600 +
          "," +
          (h * 3625) / 21600 +
          " L" +
          (w * 8550) / 21600 +
          "," +
          (h * 6382) / 21600 +
          " L" +
          (w * 9722) / 21600 +
          "," +
          (h * 1887) / 21600 +
          " z";
      }
      result +=
        "<path d='" +
        d +
        "'  fill='" +
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
      break;
    case "ellipse":
    case "flowChartConnector":
    case "flowChartSummingJunction":
    case "flowChartOr":
      result +=
        "<ellipse cx='" +
        w / 2 +
        "' cy='" +
        h / 2 +
        "' rx='" +
        w / 2 +
        "' ry='" +
        h / 2 +
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
      if (shapType == "flowChartOr") {
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
      } else if (shapType == "flowChartSummingJunction") {
        let iDx,
          idy,
          il,
          ir,
          it,
          ib,
          hc = w / 2,
          vc = h / 2,
          wd2 = w / 2,
          hd2 = h / 2;
        const angVal = Math.PI / 4;
        iDx = wd2 * Math.cos(angVal);
        idy = hd2 * Math.sin(angVal);
        il = hc - iDx;
        ir = hc + iDx;
        it = vc - idy;
        ib = vc + idy;
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
      break;
    case "roundRect":
    case "round1Rect":
    case "round2DiagRect":
    case "round2SameRect":
    case "snip1Rect":
    case "snip2DiagRect":
    case "snip2SameRect":
    case "flowChartAlternateProcess":
    case "flowChartPunchedCard":
      var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
      var sAdj1, sAdj1_val; // = 0.33334;
      var sAdj2, sAdj2_val; // = 0.33334;
      var shpTyp, adjTyp;
      if (shapAdjst_ary !== undefined && shapAdjst_ary.constructor === Array) {
        for (var i = 0; i < shapAdjst_ary.length; i++) {
          var sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
          if (sAdj_name == "adj1") {
            sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
            sAdj1_val = parseInt(sAdj1.substr(4)) / 50000;
          } else if (sAdj_name == "adj2") {
            sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
            sAdj2_val = parseInt(sAdj2.substr(4)) / 50000;
          }
        }
      } else if (shapAdjst_ary !== undefined && shapAdjst_ary.constructor !== Array) {
        const sAdj = getTextByPathList(shapAdjst_ary, ["attrs", "fmla"]);
        sAdj1_val = parseInt(sAdj.substr(4)) / 50000;
        sAdj2_val = 0;
      }
      //console.log("shapType: ",shapType,",node: ",node )
      var tranglRott = "";
      switch (shapType) {
        case "roundRect":
        case "flowChartAlternateProcess":
          shpTyp = "round";
          adjTyp = "cornrAll";
          if (sAdj1_val === undefined) sAdj1_val = 0.33334;
          sAdj2_val = 0;
          break;
        case "round1Rect":
          shpTyp = "round";
          adjTyp = "cornr1";
          if (sAdj1_val === undefined) sAdj1_val = 0.33334;
          sAdj2_val = 0;
          break;
        case "round2DiagRect":
          shpTyp = "round";
          adjTyp = "diag";
          if (sAdj1_val === undefined) sAdj1_val = 0.33334;
          if (sAdj2_val === undefined) sAdj2_val = 0;
          break;
        case "round2SameRect":
          shpTyp = "round";
          adjTyp = "cornr2";
          if (sAdj1_val === undefined) sAdj1_val = 0.33334;
          if (sAdj2_val === undefined) sAdj2_val = 0;
          break;
        case "snip1Rect":
        case "flowChartPunchedCard":
          shpTyp = "snip";
          adjTyp = "cornr1";
          if (sAdj1_val === undefined) sAdj1_val = 0.33334;
          sAdj2_val = 0;
          if (shapType == "flowChartPunchedCard") {
            tranglRott = "transform='translate(" + w + ",0) scale(-1,1)'";
          }
          break;
        case "snip2DiagRect":
          shpTyp = "snip";
          adjTyp = "diag";
          if (sAdj1_val === undefined) sAdj1_val = 0;
          if (sAdj2_val === undefined) sAdj2_val = 0.33334;
          break;
        case "snip2SameRect":
          shpTyp = "snip";
          adjTyp = "cornr2";
          if (sAdj1_val === undefined) sAdj1_val = 0.33334;
          if (sAdj2_val === undefined) sAdj2_val = 0;
          break;
      }
      var d_val = shapeSnipRoundRect(w, h, sAdj1_val, sAdj2_val, shpTyp, adjTyp);
      result +=
        "<path " +
        tranglRott +
        "  d='" +
        d_val +
        "'  fill='" +
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
      break;
    case "snipRoundRect":
      var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
      var sAdj1,
        sAdj1_val: any = 0.33334;
      var sAdj2,
        sAdj2_val: any = 0.33334;
      if (shapAdjst_ary !== undefined) {
        for (var i = 0; i < shapAdjst_ary.length; i++) {
          var sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
          if (sAdj_name == "adj1") {
            sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
            sAdj1_val = parseInt(sAdj1.substr(4)) / 50000;
          } else if (sAdj_name == "adj2") {
            sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
            sAdj2_val = parseInt(sAdj2.substr(4)) / 50000;
          }
        }
      }
      var d_val =
        "M0," +
        h +
        " L" +
        w +
        "," +
        h +
        " L" +
        w +
        "," +
        (h / 2) * sAdj2_val +
        " L" +
        (w / 2 + (w / 2) * (1 - sAdj2_val)) +
        ",0 L" +
        (w / 2) * sAdj1_val +
        ",0 Q0,0 0," +
        (h / 2) * sAdj1_val +
        " z";

      result +=
        "<path   d='" +
        d_val +
        "'  fill='" +
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
      break;
    case "leftRightCircularArrow":
    case "chartPlus":
    case "chartStar":
    case "chartX":
    case "cornerTabs":
    case "flowChartOfflineStorage":
    case "folderCorner":
    case "funnel":
    case "lineInv":
    case "nonIsoscelesTrapezoid":
    case "plaqueTabs":
    case "squareTabs":
    case "upDownArrowCallout":
      console.log(shapType, " -unsupported shape type.");
      break;
    case undefined:
    default:
      console.warn("Undefine shape type.(" + shapType + ")");
  }

  return result;
}
