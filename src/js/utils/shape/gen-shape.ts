/**
 * Core shape rendering function that generates HTML/SVG for all PowerPoint shape types.
 * 
 * Handles 300+ preset shape types including:
 * - Text boxes, titles, body text
 * - Basic shapes (rectangles, ellipses, lines)
 * - Flow chart shapes
 * - Arrows and callouts
 * - Complex custom geometry shapes
 * 
 * @param node - Shape node from slide XML
 * @param pNode - Parent node
 * @param slideLayoutSpNode - Layout node for inheritance
 * @param slideMasterSpNode - Master node for inheritance
 * @param id - Shape ID
 * @param name - Shape name
 * @param idx - Shape index
 * @param type - Shape type (textBox, title, body, pic, etc.)
 * @param order - z-index ordering
 * @param warpObj - Object containing all slide resources (theme, relationships, etc.)
 * @param isUserDrawnBg - Whether this is a user-drawn background shape
 * @param sType - Shape type context
 * @param source - Source context (slide, layout, master)
 * @param slideFactor - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeFactor - Font size scaling factor
 * @param rtlLangsArray - Array of RTL language codes
 * @param isFirstBr - Mutable object tracking first line break state
 * @returns HTML string with SVG shape
 */

import { getTextByPathList } from "../object";
import { getPosition, getSize, getVerticalAlign, angleToDegrees, getContentDir } from "../layout";
import { getFillType, getShapeFill } from "../fill";
import { getBorder } from "../border";
import { genTextBody } from "../text";
import { getSolidFill } from "../color";
import { shapePie } from "./shape-pie";
import { shapeArc } from "./shape-arc";
import { shapeGear } from "./shape-gear";
import { shapeSnipRoundRect } from "./shape-snip-round-rect";
import { getSvgGradient, getSvgImagePattern } from "../svg";
import { renderCustomGeometry } from "./render-custom-geometry";
import { processShapeEffects } from "./process-shape-effects";
import { initShapeContext } from "./init-shape-context";
import { isStarShape, renderStarShape, isFlowchartShape, renderFlowchartShape, isActionButtonShape, renderActionButtonShape, isArrowShape, renderArrowShape, isCurvedArrowShape, renderCurvedArrowShape, isCalloutShape, renderCalloutShape, isRibbonShape, renderRibbonShape, isMathShape, renderMathShapeType, isBracketShape, renderBracketShape } from "./shapes";

export function genShape(
    node: any,
    pNode: any,
    slideLayoutSpNode: any,
    slideMasterSpNode: any,
    id: any,
    name: any,
    idx: any,
    type: any,
    order: any,
    warpObj: any,
    isUserDrawnBg: any,
    sType: any,
    source: any,
    slideFactor: number,
    styleTable: any,
    fontSizeFactor: number,
    rtlLangsArray: string[],
    isFirstBr: { value: boolean }
): string {
    // Initialize shape rendering context
    const context = initShapeContext(
        node,
        pNode,
        slideLayoutSpNode,
        slideMasterSpNode,
        id,
        idx,
        type,
        name,
        order,
        sType,
        source,
        warpObj,
        slideFactor,
        styleTable
    );

    if (!context) {
        // No valid shape type found, return empty result
        return "";
    }

    // Destructure context
    const {
        slideXfrmNode,
        slideLayoutXfrmNode,
        slideMasterXfrmNode,
        shpId,
        shapType,
        custShapType,
        rotate,
        txtRotate,
        flip,
        x,
        y,
        w,
        h,
        svgCssName,
        effectsClassName,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        clrFillType,
        border
    } = context;
    const headEndNodeAttrs = getTextByPathList(node, ["p:spPr", "a:ln", "a:headEnd", "attrs"]);
    const tailEndNodeAttrs = getTextByPathList(node, ["p:spPr", "a:ln", "a:tailEnd", "attrs"]);

    var result = context.svgHeader;
    result += '<defs>';
    result += context.defsContent;


                // Process shape effects (shadows, markers)
                const effectsResult = processShapeEffects(
                    node,
                    shpId,
                    svgCssName,
                    border,
                    warpObj,
                    slideFactor,
                    styleTable
                );
                result += effectsResult.defsContent;

                result += '</defs>'
            if (shapType !== undefined && custShapType === undefined) {
                //console.log("shapType: ", shapType)

                // Handle star shapes via dedicated module
                if (isStarShape(shapType)) {
                    result += renderStarShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor
                    });
                } else if (isFlowchartShape(shapType)) {
                    // Handle independent flowchart shapes via dedicated module
                    result += renderFlowchartShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor
                    });
                } else if (isActionButtonShape(shapType)) {
                    // Handle action button shapes via dedicated module
                    result += renderActionButtonShape(shapType, {
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border
                    });
                } else if (isArrowShape(shapType)) {
                    // Handle arrow shapes via dedicated module
                    result += renderArrowShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor
                    });
                } else if (isCurvedArrowShape(shapType)) {
                    // Handle curved arrow shapes via dedicated module
                    result += renderCurvedArrowShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor
                    });
                } else if (isCalloutShape(shapType)) {
                    // Handle callout shapes via dedicated module
                    result += renderCalloutShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor
                    });
                } else if (isRibbonShape(shapType)) {
                    // Handle ribbon shapes via dedicated module
                    result += renderRibbonShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor
                    });
                } else if (isMathShape(shapType)) {
                    // Handle math shapes via dedicated module
                    result += renderMathShapeType(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor
                    });
                } else if (isBracketShape(shapType)) {
                    // Handle bracket shapes via dedicated module
                    result += renderBracketShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor
                    });
                } else switch (shapType) {
                    case "rect":
                    case "flowChartProcess":
                    case "flowChartPredefinedProcess":
                    case "flowChartInternalStorage":
                    case "actionButtonBlank":
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += "<rect x='0' y='0' width='" + w + "' height='" + h + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "'  />";

                        if (shapType == "flowChartPredefinedProcess") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            result += "<rect x='" + w * (1 / 8) + "' y='0' width='" + w * (6 / 8) + "' height='" + h + "' fill='none' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        } else if (shapType == "flowChartInternalStorage") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            result += " <polyline points='" + w * (1 / 8) + " 0," + w * (1 / 8) + " " + h + "' fill='none' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            result += " <polyline points='0 " + h * (1 / 8) + "," + w + " " + h * (1 / 8) + "' fill='none' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        }
                        break;
                    case "irregularSeal1":
                    case "irregularSeal2":
                        if (shapType == "irregularSeal1") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            var d = "M" + w * 10800 / 21600 + "," + h * 5800 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 14522 / 21600 + "," + 0 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 14155 / 21600 + "," + h * 5325 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 18380 / 21600 + "," + h * 4457 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 16702 / 21600 + "," + h * 7315 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 21097 / 21600 + "," + h * 8137 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 17607 / 21600 + "," + h * 10475 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w + "," + h * 13290 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 16837 / 21600 + "," + h * 12942 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 18145 / 21600 + "," + h * 18095 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 14020 / 21600 + "," + h * 14457 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 13247 / 21600 + "," + h * 19737 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 10532 / 21600 + "," + h * 14935 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 8485 / 21600 + "," + h +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 7715 / 21600 + "," + h * 15627 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 4762 / 21600 + "," + h * 17617 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 5667 / 21600 + "," + h * 13937 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 135 / 21600 + "," + h * 14587 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 3722 / 21600 + "," + h * 11775 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                                " L" + 0 + "," + h * 8615 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 4627 / 21600 + "," + h * 7617 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 370 / 21600 + "," + h * 2295 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 7312 / 21600 + "," + h * 6320 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 8352 / 21600 + "," + h * 2295 / 21600 +
                                " z";
                        } else if (shapType == "irregularSeal2") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            var d = "M" + w * 11462 / 21600 + "," + h * 4342 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 14790 / 21600 + "," + 0 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 14525 / 21600 + "," + h * 5777 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 18007 / 21600 + "," + h * 3172 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 16380 / 21600 + "," + h * 6532 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w + "," + h * 6645 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 16985 / 21600 + "," + h * 9402 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 18270 / 21600 + "," + h * 11290 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 16380 / 21600 + "," + h * 12310 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 18877 / 21600 + "," + h * 15632 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 14640 / 21600 + "," + h * 14350 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 14942 / 21600 + "," + h * 17370 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 12180 / 21600 + "," + h * 15935 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 11612 / 21600 + "," + h * 18842 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 9872 / 21600 + "," + h * 17370 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 8700 / 21600 + "," + h * 19712 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 7527 / 21600 + "," + h * 18125 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 4917 / 21600 + "," + h +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 4805 / 21600 + "," + h * 18240 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 1285 / 21600 + "," + h * 17825 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 3330 / 21600 + "," + h * 15370 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                                " L" + 0 + "," + h * 12877 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 3935 / 21600 + "," + h * 11592 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 1172 / 21600 + "," + h * 8270 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 5372 / 21600 + "," + h * 7817 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 4502 / 21600 + "," + h * 3625 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 8550 / 21600 + "," + h * 6382 / 21600 +
                                // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                                " L" + w * 9722 / 21600 + "," + h * 1887 / 21600 +
                                " z";
                        }
                        // @ts-expect-error TS(2454): Variable 'd' is used before being assigned.
                        result += "<path d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "ellipse":
                    case "flowChartConnector":
                    case "flowChartSummingJunction":
                    case "flowChartOr":
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += "<ellipse cx='" + (w / 2) + "' cy='" + (h / 2) + "' rx='" + (w / 2) + "' ry='" + (h / 2) + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        if (shapType == "flowChartOr") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            result += " <polyline points='" + w / 2 + " " + 0 + "," + w / 2 + " " + h + "' fill='none' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            result += " <polyline points='" + 0 + " " + h / 2 + "," + w + " " + h / 2 + "' fill='none' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        } else if (shapType == "flowChartSummingJunction") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            var iDx, idy, il, ir, it, ib, hc = w / 2, vc = h / 2, wd2 = w / 2, hd2 = h / 2;
                            var angVal = Math.PI / 4;
                            iDx = wd2 * Math.cos(angVal);
                            idy = hd2 * Math.sin(angVal);
                            il = hc - iDx;
                            ir = hc + iDx;
                            it = vc - idy;
                            ib = vc + idy;
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            result += " <polyline points='" + il + " " + it + "," + ir + " " + ib + "' fill='none' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            result += " <polyline points='" + ir + " " + it + "," + il + " " + ib + "' fill='none' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
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
                        var sAdj1, sAdj1_val;// = 0.33334;
                        var sAdj2, sAdj2_val;// = 0.33334;
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
                            var sAdj = getTextByPathList(shapAdjst_ary, ["attrs", "fmla"]);
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
                                    // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
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
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var d_val = shapeSnipRoundRect(w, h, sAdj1_val, sAdj2_val, shpTyp, adjTyp);
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path " + tranglRott + "  d='" + d_val + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "snipRoundRect":
                        var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj1, sAdj1_val = 0.33334;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj2, sAdj2_val = 0.33334;
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
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val = "M0," + h + " L" + w + "," + h + " L" + w + "," + (h / 2) * sAdj2_val +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + (w / 2 + (w / 2) * (1 - sAdj2_val)) + ",0 L" + (w / 2) * sAdj1_val + ",0 Q0,0 0," + (h / 2) * sAdj1_val + " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d_val + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "bentConnector2":
                        var d = "";
                        // if (isFlipV) {
                        //     d = "M 0 " + w + " L " + h + " " + w + " L " + h + " 0";
                        // } else {
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        d = "M " + w + " 0 L " + w + " " + h + " L 0 " + h;
                        //}
                        // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                        result += "<path d='" + d + "' stroke='" + border.color +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' fill='none' ";
                        if (headEndNodeAttrs !== undefined && (headEndNodeAttrs["type"] === "triangle" || headEndNodeAttrs["type"] === "arrow")) {
                            result += "marker-start='url(#markerTriangle_" + shpId + ")' ";
                        }
                        if (tailEndNodeAttrs !== undefined && (tailEndNodeAttrs["type"] === "triangle" || tailEndNodeAttrs["type"] === "arrow")) {
                            result += "marker-end='url(#markerTriangle_" + shpId + ")' ";
                        }
                        result += "/>";
                        break;
                    case "rtTriangle":
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        result += " <polygon points='0 0,0 " + h + "," + w + " " + h + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "triangle":
                    case "flowChartExtract":
                    case "flowChartMerge":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var shapAdjst_val = 0.5;
                        if (shapAdjst !== undefined) {
                            shapAdjst_val = parseInt(shapAdjst.substr(4)) * slideFactor;
                            //console.log("w: "+w+"\nh: "+h+"\nshapAdjst: "+shapAdjst+"\nshapAdjst_val: "+shapAdjst_val);
                        }
                        var tranglRott = "";
                        if (shapType == "flowChartMerge") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            tranglRott = "transform='rotate(180 " + w / 2 + "," + h / 2 + ")'";
                        }
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon " + tranglRott + " points='" + (w * shapAdjst_val) + " 0,0 " + h + "," + w + " " + h + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "diamond":
                    case "flowChartDecision":
                    case "flowChartSort":
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon points='" + (w / 2) + " 0,0 " + (h / 2) + "," + (w / 2) + " " + h + "," + w + " " + (h / 2) + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        if (shapType == "flowChartSort") {
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            result += " <polyline points='0 " + h / 2 + "," + w + " " + h / 2 + "' fill='none' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        }
                        break;
                    case "trapezoid":
                    case "flowChartManualOperation":
                    case "flowChartManualInput":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adjst_val = 0.2;
                        var max_adj_const = 0.7407;
                        if (shapAdjst !== undefined) {
                            var adjst = parseInt(shapAdjst.substr(4)) * slideFactor;
                            adjst_val = (adjst * 0.5) / max_adj_const;
                            // console.log("w: "+w+"\nh: "+h+"\nshapAdjst: "+shapAdjst+"\nadjst_val: "+adjst_val);
                        }
                        var cnstVal = 0;
                        var tranglRott = "";
                        if (shapType == "flowChartManualOperation") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            tranglRott = "transform='rotate(180 " + w / 2 + "," + h / 2 + ")'";
                        }
                        if (shapType == "flowChartManualInput") {
                            adjst_val = 0;
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            cnstVal = h / 5;
                        }
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon " + tranglRott + " points='" + (w * adjst_val) + " " + cnstVal + ",0 " + h + "," + w + " " + h + "," + (1 - adjst_val) * w + " 0' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "parallelogram":
                    case "flowChartInputOutput":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adjst_val = 0.25;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var max_adj_const;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        if (w > h) {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            max_adj_const = w / h;
                        } else {
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            max_adj_const = h / w;
                        }
                        if (shapAdjst !== undefined) {
                            var adjst = parseInt(shapAdjst.substr(4)) / 100000;
                            adjst_val = adjst / max_adj_const;
                            //console.log("w: "+w+"\nh: "+h+"\nadjst: "+adjst_val+"\nmax_adj_const: "+max_adj_const);
                        }
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon points='" + adjst_val * w + " 0,0 " + h + "," + (1 - adjst_val) * w + " " + h + "," + w + " 0' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;

                        break;
                    case "pentagon":
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon points='" + (0.5 * w) + " 0,0 " + (0.375 * h) + "," + (0.15 * w) + " " + h + "," + 0.85 * w + " " + h + "," + w + " " + 0.375 * h + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "hexagon":
                    case "flowChartPreparation":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj = 25000 * slideFactor;
                        var vf = 115470 * slideFactor;;
                        var cnstVal1 = 50000 * slideFactor;
                        var cnstVal2 = 100000 * slideFactor;
                        var angVal1 = 60 * Math.PI / 180;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var maxAdj, a, shd2, x1, x2, dy1, y1, y2, vc = h / 2, hd2 = h / 2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var ss = Math.min(w, h);
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        maxAdj = cnstVal1 * w / ss;
                        a = (adj < 0) ? 0 : (adj > maxAdj) ? maxAdj : adj;
                        shd2 = hd2 * vf / cnstVal2;
                        x1 = ss * a / cnstVal2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w - x1;
                        dy1 = shd2 * Math.sin(angVal1);
                        y1 = vc - dy1;
                        y2 = vc + dy1;

                        var d = "M" + 0 + "," + vc +
                            " L" + x1 + "," + y1 +
                            " L" + x2 + "," + y1 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + vc +
                            " L" + x2 + "," + y2 +
                            " L" + x1 + "," + y2 +
                            " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "heptagon":
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon points='" + (0.5 * w) + " 0," + w / 8 + " " + h / 4 + ",0 " + (5 / 8) * h + "," + w / 4 + " " + h + "," + (3 / 4) * w + " " + h + "," +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            w + " " + (5 / 8) * h + "," + (7 / 8) * w + " " + h / 4 + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "octagon":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj1 = 0.25;
                        if (shapAdjst !== undefined) {
                            adj1 = parseInt(shapAdjst.substr(4)) / 100000;

                        }
                        var adj2 = (1 - adj1);
                        //console.log("adj1: "+adj1+"\nadj2: "+adj2);
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon points='" + adj1 * w + " 0,0 " + adj1 * h + ",0 " + adj2 * h + "," + adj1 * w + " " + h + "," + adj2 * w + " " + h + "," +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            w + " " + adj2 * h + "," + w + " " + adj1 * h + "," + adj2 * w + " 0' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "decagon":
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon points='" + (3 / 8) * w + " 0," + w / 8 + " " + h / 8 + ",0 " + h / 2 + "," + w / 8 + " " + (7 / 8) * h + "," + (3 / 8) * w + " " + h + "," +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            (5 / 8) * w + " " + h + "," + (7 / 8) * w + " " + (7 / 8) * h + "," + w + " " + h / 2 + "," + (7 / 8) * w + " " + h / 8 + "," + (5 / 8) * w + " 0' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "dodecagon":
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon points='" + (3 / 8) * w + " 0," + w / 8 + " " + h / 8 + ",0 " + (3 / 8) * h + ",0 " + (5 / 8) * h + "," + w / 8 + " " + (7 / 8) * h + "," + (3 / 8) * w + " " + h + "," +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            (5 / 8) * w + " " + h + "," + (7 / 8) * w + " " + (7 / 8) * h + "," + w + " " + (5 / 8) * h + "," + w + " " + (3 / 8) * h + "," + (7 / 8) * w + " " + h / 8 + "," + (5 / 8) * w + " 0' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    // Star shapes (star4-star32) handled by shapes/stars.ts module

                    case "pie":
                    case "pieWedge":
                    case "arc":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var adj1, adj2, H, shapAdjst1, shapAdjst2, isClose;
                        if (shapType == "pie") {
                            adj1 = 0;
                            adj2 = 270;
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            H = h;
                            isClose = true;
                        } else if (shapType == "pieWedge") {
                            adj1 = 180;
                            adj2 = 270;
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            H = 2 * h;
                            isClose = true;
                        } else if (shapType == "arc") {
                            adj1 = 270;
                            adj2 = 0;
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            H = h;
                            isClose = false;
                        }
                        if (shapAdjst !== undefined) {
                            shapAdjst1 = getTextByPathList(shapAdjst, ["attrs", "fmla"]);
                            shapAdjst2 = shapAdjst1;
                            if (shapAdjst1 === undefined) {
                                shapAdjst1 = shapAdjst[0]["attrs"]["fmla"];
                                shapAdjst2 = shapAdjst[1]["attrs"]["fmla"];
                            }
                            if (shapAdjst1 !== undefined) {
                                adj1 = parseInt(shapAdjst1.substr(4)) / 60000;
                            }
                            if (shapAdjst2 !== undefined) {
                                adj2 = parseInt(shapAdjst2.substr(4)) / 60000;
                            }
                        }
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var pieVals = shapePie(H, w, adj1, adj2, isClose);
                        //console.log("shapType: ",shapType,"\nimgFillFlg: ",imgFillFlg,"\ngrndFillFlg: ",grndFillFlg,"\nshpId: ",shpId,"\nfillColor: ",fillColor);
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + pieVals[0] + "' transform='" + pieVals[1] + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "chord":
                        var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj1, sAdj1_val = 45;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj2, sAdj2_val = 270;
                        if (shapAdjst_ary !== undefined) {
                            for (var i = 0; i < shapAdjst_ary.length; i++) {
                                var sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
                                if (sAdj_name == "adj1") {
                                    sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    sAdj1_val = parseInt(sAdj1.substr(4)) / 60000;
                                } else if (sAdj_name == "adj2") {
                                    sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    sAdj2_val = parseInt(sAdj2.substr(4)) / 60000;
                                }
                            }
                        }
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var hR = h / 2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var wR = w / 2;
                        var d_val = shapeArc(wR, hR, wR, hR, sAdj1_val, sAdj2_val, true);
                        //console.log("shapType: ",shapType,", sAdj1_val: ",sAdj1_val,", sAdj2_val: ",sAdj2_val)
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "frame":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj1 = 12500 * slideFactor;
                        var cnstVal1 = 50000 * slideFactor;
                        var cnstVal2 = 100000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        var a1, x1, x4, y4;
                        if (adj1 < 0) a1 = 0
                        else if (adj1 > cnstVal1) a1 = cnstVal1
                        else a1 = adj1
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = Math.min(w, h) * a1 / cnstVal2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x4 = w - x1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y4 = h - x1;
                        var d = "M" + 0 + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + h +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + 0 + "," + h +
                            " z" +
                            "M" + x1 + "," + x1 +
                            " L" + x1 + "," + y4 +
                            " L" + x4 + "," + y4 +
                            " L" + x4 + "," + x1 +
                            " z";
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "donut":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj = 25000 * slideFactor;
                        var cnstVal1 = 50000 * slideFactor;
                        var cnstVal2 = 100000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        var a, dr, iwd2, ihd2;
                        if (adj < 0) a = 0
                        else if (adj > cnstVal1) a = cnstVal1
                        else a = adj
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        dr = Math.min(w, h) * a / cnstVal2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        iwd2 = w / 2 - dr;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        ihd2 = h / 2 - dr;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var d = "M" + 0 + "," + h / 2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 270, 360, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") +
                            " z" +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            "M" + dr + "," + h / 2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, iwd2, ihd2, 180, 90, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, iwd2, ihd2, 90, 0, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, iwd2, ihd2, 0, -90, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, iwd2, ihd2, 270, 180, false).replace("M", "L") +
                            " z";
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "noSmoking":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj = 18750 * slideFactor;
                        var cnstVal1 = 50000 * slideFactor;
                        var cnstVal2 = 100000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        var a, dr, iwd2, ihd2, ang, ang2rad, ct, st, m, n, drd2, dang, dang2, swAng, t3, stAng1, stAng2;
                        if (adj < 0) a = 0
                        else if (adj > cnstVal1) a = cnstVal1
                        else a = adj
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        dr = Math.min(w, h) * a / cnstVal2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        iwd2 = w / 2 - dr;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        ihd2 = h / 2 - dr;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        ang = Math.atan(h / w);
                        //ang2rad = ang*Math.PI/180;
                        ct = ihd2 * Math.cos(ang);
                        st = iwd2 * Math.sin(ang);
                        m = Math.sqrt(ct * ct + st * st); //"mod ct st 0"
                        n = iwd2 * ihd2 / m;
                        drd2 = dr / 2;
                        dang = Math.atan(drd2 / n);
                        dang2 = dang * 2;
                        swAng = -Math.PI + dang2;
                        //t3 = Math.atan(h/w);
                        stAng1 = ang - dang;
                        stAng2 = stAng1 - Math.PI;
                        var ct1, st1, m1, n1, dx1, dy1, x1, y1, y1, y2;
                        ct1 = ihd2 * Math.cos(stAng1);
                        st1 = iwd2 * Math.sin(stAng1);
                        m1 = Math.sqrt(ct1 * ct1 + st1 * st1); //"mod ct1 st1 0"
                        n1 = iwd2 * ihd2 / m1;
                        dx1 = n1 * Math.cos(stAng1);
                        dy1 = n1 * Math.sin(stAng1);
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = w / 2 + dx1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y1 = h / 2 + dy1;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w / 2 - dx1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y2 = h / 2 - dy1;
                        var stAng1deg = stAng1 * 180 / Math.PI;
                        var stAng2deg = stAng2 * 180 / Math.PI;
                        var swAng2deg = swAng * 180 / Math.PI;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var d = "M" + 0 + "," + h / 2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 270, 360, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") +
                            " z" +
                            "M" + x1 + "," + y1 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, iwd2, ihd2, stAng1deg, (stAng1deg + swAng2deg), false).replace("M", "L") +
                            " z" +
                            "M" + x2 + "," + y2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, iwd2, ihd2, stAng2deg, (stAng2deg + swAng2deg), false).replace("M", "L") +
                            " z";
                        //console.log("adj: ",adj,"x1:",x1,",y1:",y1," x2:",x2,",y2:",y2,",stAng1:",stAng1,",stAng1deg:",stAng1deg,",stAng2:",stAng2,",stAng2deg:",stAng2deg,",swAng:",swAng,",swAng2deg:",swAng2deg)

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "halfFrame":
                        var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj1, sAdj1_val = 3.5;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj2, sAdj2_val = 3.5;
                        var cnsVal = 100000 * slideFactor;
                        if (shapAdjst_ary !== undefined) {
                            for (var i = 0; i < shapAdjst_ary.length; i++) {
                                var sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
                                if (sAdj_name == "adj1") {
                                    sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    sAdj1_val = parseInt(sAdj1.substr(4)) * slideFactor;
                                } else if (sAdj_name == "adj2") {
                                    sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    sAdj2_val = parseInt(sAdj2.substr(4)) * slideFactor;
                                }
                            }
                        }
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var minWH = Math.min(w, h);
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var maxAdj2 = (cnsVal * w) / minWH;
                        var a1, a2;
                        if (sAdj2_val < 0) a2 = 0
                        else if (sAdj2_val > maxAdj2) a2 = maxAdj2
                        else a2 = sAdj2_val
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var x1 = (minWH * a2) / cnsVal;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var g1 = h * x1 / w;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var g2 = h - g1;
                        var maxAdj1 = (cnsVal * g2) / minWH;
                        if (sAdj1_val < 0) a1 = 0
                        else if (sAdj1_val > maxAdj1) a1 = maxAdj1
                        else a1 = sAdj1_val
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var y1 = minWH * a1 / cnsVal;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var dx2 = y1 * w / h;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var x2 = w - dx2;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var dy2 = x1 * h / w;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var y2 = h - dy2;
                        var d = "M0,0" +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + 0 +
                            " L" + x2 + "," + y1 +
                            " L" + x1 + "," + y1 +
                            " L" + x1 + "," + y2 +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L0," + h + " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        //console.log("w: ",w,", h: ",h,", sAdj1_val: ",sAdj1_val,", sAdj2_val: ",sAdj2_val,",maxAdj1: ",maxAdj1,",maxAdj2: ",maxAdj2)
                        break;
                    case "blockArc":
                        var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
                        var sAdj1, adj1 = 180;
                        var sAdj2, adj2 = 0;
                        var sAdj3, adj3 = 25000 * slideFactor;
                        var cnstVal1 = 50000 * slideFactor;
                        var cnstVal2 = 100000 * slideFactor;
                        if (shapAdjst_ary !== undefined) {
                            for (var i = 0; i < shapAdjst_ary.length; i++) {
                                var sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
                                if (sAdj_name == "adj1") {
                                    sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    adj1 = parseInt(sAdj1.substr(4)) / 60000;
                                } else if (sAdj_name == "adj2") {
                                    sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    adj2 = parseInt(sAdj2.substr(4)) / 60000;
                                } else if (sAdj_name == "adj3") {
                                    sAdj3 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    adj3 = parseInt(sAdj3.substr(4)) * slideFactor;
                                }
                            }
                        }

                        var stAng, istAng, a3, sw11, sw12, swAng, iswAng;
                        var cd1 = 360;
                        if (adj1 < 0) stAng = 0
                        else if (adj1 > cd1) stAng = cd1
                        else stAng = adj1 //180

                        if (adj2 < 0) istAng = 0
                        else if (adj2 > cd1) istAng = cd1
                        else istAng = adj2 //0

                        if (adj3 < 0) a3 = 0
                        else if (adj3 > cnstVal1) a3 = cnstVal1
                        else a3 = adj3

                        sw11 = istAng - stAng; // -180
                        sw12 = sw11 + cd1; //180
                        swAng = (sw11 > 0) ? sw11 : sw12; //180
                        iswAng = -swAng; //-180

                        var endAng = stAng + swAng;
                        var iendAng = istAng + iswAng;

                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var wt1, ht1, dx1, dy1, x1, y1, stRd, istRd, wd2, hd2, hc, vc;
                        stRd = stAng * (Math.PI) / 180;
                        istRd = istAng * (Math.PI) / 180;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        wd2 = w / 2;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        hd2 = h / 2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        hc = w / 2;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        vc = h / 2;
                        if (stAng > 90 && stAng < 270) {
                            wt1 = wd2 * (Math.sin((Math.PI) / 2 - stRd));
                            ht1 = hd2 * (Math.cos((Math.PI) / 2 - stRd));

                            dx1 = wd2 * (Math.cos(Math.atan(ht1 / wt1)));
                            dy1 = hd2 * (Math.sin(Math.atan(ht1 / wt1)));

                            x1 = hc - dx1;
                            y1 = vc - dy1;
                        } else {
                            wt1 = wd2 * (Math.sin(stRd));
                            ht1 = hd2 * (Math.cos(stRd));

                            dx1 = wd2 * (Math.cos(Math.atan(wt1 / ht1)));
                            dy1 = hd2 * (Math.sin(Math.atan(wt1 / ht1)));

                            x1 = hc + dx1;
                            y1 = vc + dy1;
                        }
                        var dr, iwd2, ihd2, wt2, ht2, dx2, dy2, x2, y2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        dr = Math.min(w, h) * a3 / cnstVal2;
                        iwd2 = wd2 - dr;
                        ihd2 = hd2 - dr;
                        //console.log("stAng: ",stAng," swAng: ",swAng ," endAng:",endAng)
                        if ((endAng <= 450 && endAng > 270) || ((endAng >= 630 && endAng < 720))) {
                            wt2 = iwd2 * (Math.sin(istRd));
                            ht2 = ihd2 * (Math.cos(istRd));
                            dx2 = iwd2 * (Math.cos(Math.atan(wt2 / ht2)));
                            dy2 = ihd2 * (Math.sin(Math.atan(wt2 / ht2)));
                            x2 = hc + dx2;
                            y2 = vc + dy2;
                        } else {
                            wt2 = iwd2 * (Math.sin((Math.PI) / 2 - istRd));
                            ht2 = ihd2 * (Math.cos((Math.PI) / 2 - istRd));

                            dx2 = iwd2 * (Math.cos(Math.atan(ht2 / wt2)));
                            dy2 = ihd2 * (Math.sin(Math.atan(ht2 / wt2)));
                            x2 = hc - dx2;
                            y2 = vc - dy2;
                        }
                        var d = "M" + x1 + "," + y1 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(wd2, hd2, wd2, hd2, stAng, endAng, false).replace("M", "L") +
                            " L" + x2 + "," + y2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(wd2, hd2, iwd2, ihd2, istAng, iendAng, false).replace("M", "L") +
                            " z";
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "moon":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj = 0.5;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) / 100000;//*96/914400;;
                        }
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var hd2, cd2, cd4;

                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        hd2 = h / 2;
                        cd2 = 180;
                        cd4 = 90;

                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var adj2 = (1 - adj) * w;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var d = "M" + w + "," + h +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w, hd2, w, hd2, cd4, (cd4 + cd2), false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w, hd2, adj2, hd2, (cd4 + cd2), cd4, false).replace("M", "L") +
                            " z";
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "corner":
                        var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj1, sAdj1_val = 50000 * slideFactor;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj2, sAdj2_val = 50000 * slideFactor;
                        var cnsVal = 100000 * slideFactor;
                        if (shapAdjst_ary !== undefined) {
                            for (var i = 0; i < shapAdjst_ary.length; i++) {
                                var sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
                                if (sAdj_name == "adj1") {
                                    sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    sAdj1_val = parseInt(sAdj1.substr(4)) * slideFactor;
                                } else if (sAdj_name == "adj2") {
                                    sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                    sAdj2_val = parseInt(sAdj2.substr(4)) * slideFactor;
                                }
                            }
                        }
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var minWH = Math.min(w, h);
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var maxAdj1 = cnsVal * h / minWH;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var maxAdj2 = cnsVal * w / minWH;
                        var a1, a2, x1, dy1, y1;
                        if (sAdj1_val < 0) a1 = 0
                        else if (sAdj1_val > maxAdj1) a1 = maxAdj1
                        else a1 = sAdj1_val

                        if (sAdj2_val < 0) a2 = 0
                        else if (sAdj2_val > maxAdj2) a2 = maxAdj2
                        else a2 = sAdj2_val
                        x1 = minWH * a2 / cnsVal;
                        dy1 = minWH * a1 / cnsVal;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y1 = h - dy1;

                        var d = "M0,0" +
                            " L" + x1 + "," + 0 +
                            " L" + x1 + "," + y1 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + y1 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + h +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L0," + h + " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "diagStripe":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var sAdj1_val = 50000 * slideFactor;
                        var cnsVal = 100000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            sAdj1_val = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        var a1, x2, y2;
                        if (sAdj1_val < 0) a1 = 0
                        else if (sAdj1_val > cnsVal) a1 = cnsVal
                        else a1 = sAdj1_val
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w * a1 / cnsVal;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y2 = h * a1 / cnsVal;
                        var d = "M" + 0 + "," + y2 +
                            " L" + x2 + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + 0 + "," + h + " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d + "'  fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "gear6":
                    case "gear9":
                        txtRotate = 0;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var gearNum = shapType.substr(4), d;
                        if (gearNum == "6") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            d = shapeGear(w, h / 3.5, parseInt(gearNum));
                        } else { //gearNum=="9"
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            d = shapeGear(w, h / 3.5, parseInt(gearNum));
                        }
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        result += "<path   d='" + d + "' transform='rotate(20," + (3 / 7) * h + "," + (3 / 7) * h + ")' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "bentConnector3":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var shapAdjst_val = 0.5;
                        if (shapAdjst !== undefined) {
                            shapAdjst_val = parseInt(shapAdjst.substr(4)) / 100000;
                            // if (isFlipV) {
                            //     result += " <polyline points='" + w + " 0," + ((1 - shapAdjst_val) * w) + " 0," + ((1 - shapAdjst_val) * w) + " " + h + ",0 " + h + "' fill='transparent'" +
                            //         "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' ";
                            // } else {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            result += " <polyline points='0 0," + (shapAdjst_val) * w + " 0," + (shapAdjst_val) * w + " " + h + "," + w + " " + h + "' fill='transparent'" +
                                // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                                "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' ";
                            //}
                            if (headEndNodeAttrs !== undefined && (headEndNodeAttrs["type"] === "triangle" || headEndNodeAttrs["type"] === "arrow")) {
                                result += "marker-start='url(#markerTriangle_" + shpId + ")' ";
                            }
                            if (tailEndNodeAttrs !== undefined && (tailEndNodeAttrs["type"] === "triangle" || tailEndNodeAttrs["type"] === "arrow")) {
                                result += "marker-end='url(#markerTriangle_" + shpId + ")' ";
                            }
                            result += "/>";
                        }
                        break;
                    case "plus":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj1 = 0.25;
                        if (shapAdjst !== undefined) {
                            adj1 = parseInt(shapAdjst.substr(4)) / 100000;

                        }
                        var adj2 = (1 - adj1);
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += " <polygon points='" + adj1 * w + " 0," + adj1 * w + " " + adj1 * h + ",0 " + adj1 * h + ",0 " + adj2 * h + "," +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            adj1 * w + " " + adj2 * h + "," + adj1 * w + " " + h + "," + adj2 * w + " " + h + "," + adj2 * w + " " + adj2 * h + "," + w + " " + adj2 * h + "," +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            +w + " " + adj1 * h + "," + adj2 * w + " " + adj1 * h + "," + adj2 * w + " 0' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";
                        break;
                    case "teardrop":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj1 = 100000 * slideFactor;
                        var cnsVal1 = adj1;
                        var cnsVal2 = 200000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        var a1, r2, tw, th, sw, sh, dx1, dy1, x1, y1, x2, y2, rd45;
                        if (adj1 < 0) a1 = 0
                        else if (adj1 > cnsVal2) a1 = cnsVal2
                        else a1 = adj1
                        r2 = Math.sqrt(2);
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        tw = r2 * (w / 2);
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        th = r2 * (h / 2);
                        sw = (tw * a1) / cnsVal1;
                        sh = (th * a1) / cnsVal1;
                        rd45 = (45 * (Math.PI) / 180);
                        dx1 = sw * (Math.cos(rd45));
                        dy1 = sh * (Math.cos(rd45));
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = (w / 2) + dx1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y1 = (h / 2) - dy1;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = ((w / 2) + x1) / 2;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y2 = ((h / 2) + y1) / 2;

                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val = shapeArc(w / 2, h / 2, w / 2, h / 2, 180, 270, false) +
                            "Q " + x2 + ",0 " + x1 + "," + y1 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            "Q " + w + "," + y2 + " " + w + "," + h / 2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 0, 90, false).replace("M", "L") +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, w / 2, h / 2, 90, 180, false).replace("M", "L") + " z";
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        // console.log("shapAdjst: ",shapAdjst,", adj1: ",adj1);
                        break;
                    case "plaque":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj1 = 16667 * slideFactor;
                        var cnsVal1 = 50000 * slideFactor;
                        var cnsVal2 = 100000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            adj1 = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        var a1, x1, x2, y2;
                        if (adj1 < 0) a1 = 0
                        else if (adj1 > cnsVal1) a1 = cnsVal1
                        else a1 = adj1
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = a1 * (Math.min(w, h)) / cnsVal2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w - x1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y2 = h - x1;

                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val = "M0," + x1 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(0, 0, x1, x1, 90, 0, false).replace("M", "L") +
                            " L" + x2 + "," + 0 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w, 0, x1, x1, 180, 90, false).replace("M", "L") +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + y2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w, h, x1, x1, 270, 180, false).replace("M", "L") +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + x1 + "," + h +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(0, h, x1, x1, 0, -90, false).replace("M", "L") + " z";
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "sun":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var refr = slideFactor;
                        var adj1 = 25000 * refr;
                        var cnstVal1 = 12500 * refr;
                        var cnstVal2 = 46875 * refr;
                        if (shapAdjst !== undefined) {
                            adj1 = parseInt(shapAdjst.substr(4)) * refr;
                        }
                        var a1;
                        if (adj1 < cnstVal1) a1 = cnstVal1
                        else if (adj1 > cnstVal2) a1 = cnstVal2
                        else a1 = adj1

                        var cnstVa3 = 50000 * refr;
                        var cnstVa4 = 100000 * refr;
                        var g0 = cnstVa3 - a1,
                            g1 = g0 * (30274 * refr) / (32768 * refr),
                            g2 = g0 * (12540 * refr) / (32768 * refr),
                            g3 = g1 + cnstVa3,
                            g4 = g2 + cnstVa3,
                            g5 = cnstVa3 - g1,
                            g6 = cnstVa3 - g2,
                            g7 = g0 * (23170 * refr) / (32768 * refr),
                            g8 = cnstVa3 + g7,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g9 = cnstVa3 - g7,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g10 = g5 * 3 / 4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g11 = g6 * 3 / 4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g12 = g10 + 3662 * refr,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g13 = g11 + 36620 * refr,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g14 = g11 + 12500 * refr,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g15 = cnstVa4 - g10,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g16 = cnstVa4 - g12,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g17 = cnstVa4 - g13,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            g18 = cnstVa4 - g14,
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            ox1 = w * (18436 * refr) / (21600 * refr),
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            oy1 = h * (3163 * refr) / (21600 * refr),
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            ox2 = w * (3163 * refr) / (21600 * refr),
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            oy2 = h * (18436 * refr) / (21600 * refr),
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x8 = w * g8 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x9 = w * g9 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x10 = w * g10 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x12 = w * g12 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x13 = w * g13 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x14 = w * g14 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            x15 = w * g15 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            x16 = w * g16 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            x17 = w * g17 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            x18 = w * g18 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            x19 = w * a1 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            wR = w * g0 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            hR = h * g0 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y8 = h * g8 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y9 = h * g9 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y10 = h * g10 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y12 = h * g12 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y13 = h * g13 / cnstVa4,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y14 = h * g14 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            y15 = h * g15 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            y16 = h * g16 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            y17 = h * g17 / cnstVa4,
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            y18 = h * g18 / cnstVa4;

                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val = "M" + w + "," + h / 2 +
                            " L" + x15 + "," + y18 +
                            " L" + x15 + "," + y14 +
                            "z" +
                            " M" + ox1 + "," + oy1 +
                            " L" + x16 + "," + y17 +
                            " L" + x13 + "," + y12 +
                            "z" +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " M" + w / 2 + "," + 0 +
                            " L" + x18 + "," + y10 +
                            " L" + x14 + "," + y10 +
                            "z" +
                            " M" + ox2 + "," + oy1 +
                            " L" + x17 + "," + y12 +
                            " L" + x12 + "," + y17 +
                            "z" +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " M" + 0 + "," + h / 2 +
                            " L" + x10 + "," + y14 +
                            " L" + x10 + "," + y18 +
                            "z" +
                            " M" + ox2 + "," + oy2 +
                            " L" + x12 + "," + y13 +
                            " L" + x17 + "," + y16 +
                            "z" +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " M" + w / 2 + "," + h +
                            " L" + x14 + "," + y15 +
                            " L" + x18 + "," + y15 +
                            "z" +
                            " M" + ox1 + "," + oy2 +
                            " L" + x13 + "," + y16 +
                            " L" + x16 + "," + y13 +
                            " z" +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " M" + x19 + "," + h / 2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(w / 2, h / 2, wR, hR, 180, 540, false).replace("M", "L") +
                            " z";
                        //console.log("adj1: ",adj1,d_val);
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";


                        break;
                    case "heart":
                        var dx1, dx2, x1, x2, x3, x4, y1;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        dx1 = w * 49 / 48;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        dx2 = w * 10 / 48
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = w / 2 - dx1
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w / 2 - dx2
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x3 = w / 2 + dx2
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x4 = w / 2 + dx1
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y1 = -h / 3;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val = "M" + w / 2 + "," + h / 4 +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            "C" + x3 + "," + y1 + " " + x4 + "," + h / 4 + " " + w / 2 + "," + h +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            "C" + x1 + "," + h / 4 + " " + x2 + "," + y1 + " " + w / 2 + "," + h / 4 + " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path   d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "lightningBolt":
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var x1 = w * 5022 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x2 = w * 11050 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x3 = w * 8472 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x4 = w * 8757 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x5 = w * 10012 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x6 = w * 14767 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x7 = w * 12222 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x8 = w * 12860 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x9 = w * 13917 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x10 = w * 7602 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            x11 = w * 16577 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y1 = h * 3890 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y2 = h * 6080 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y3 = h * 6797 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y4 = h * 7437 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y5 = h * 12877 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y6 = h * 9705 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y7 = h * 12007 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y8 = h * 13987 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y9 = h * 8382 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y10 = h * 14277 / 21600,
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            y11 = h * 14915 / 21600;

                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val = "M" + x3 + "," + 0 +
                            " L" + x8 + "," + y2 +
                            " L" + x2 + "," + y3 +
                            " L" + x11 + "," + y7 +
                            " L" + x6 + "," + y5 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + h +
                            " L" + x5 + "," + y11 +
                            " L" + x7 + "," + y8 +
                            " L" + x1 + "," + y6 +
                            " L" + x10 + "," + y9 +
                            " L" + 0 + "," + y1 + " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "cube":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var refr = slideFactor;
                        var adj = 25000 * refr;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * refr;
                        }
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val;
                        var cnstVal2 = 100000 * refr;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var ss = Math.min(w, h);
                        var a, y1, y4, x4;
                        a = (adj < 0) ? 0 : (adj > cnstVal2) ? cnstVal2 : adj;
                        y1 = ss * a / cnstVal2;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y4 = h - y1;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x4 = w - y1;
                        d_val = "M" + 0 + "," + y1 +
                            " L" + y1 + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + y4 +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + x4 + "," + h +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + 0 + "," + h +
                            " z" +
                            "M" + 0 + "," + y1 +
                            " L" + x4 + "," + y1 +
                            " M" + x4 + "," + y1 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + 0 +
                            "M" + x4 + "," + y1 +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + x4 + "," + h;

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "bevel":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var refr = slideFactor;
                        var adj = 12500 * refr;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * refr;
                        }
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val;
                        var cnstVal1 = 50000 * refr;
                        var cnstVal2 = 100000 * refr;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var ss = Math.min(w, h);
                        var a, x1, x2, y2;
                        a = (adj < 0) ? 0 : (adj > cnstVal1) ? cnstVal1 : adj;
                        x1 = ss * a / cnstVal2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w - x1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y2 = h - x1;
                        d_val = "M" + 0 + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + h +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + 0 + "," + h +
                            " z" +
                            " M" + x1 + "," + x1 +
                            " L" + x2 + "," + x1 +
                            " L" + x2 + "," + y2 +
                            " L" + x1 + "," + y2 +
                            " z" +
                            " M" + 0 + "," + 0 +
                            " L" + x1 + "," + x1 +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " M" + 0 + "," + h +
                            " L" + x1 + "," + y2 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " M" + w + "," + 0 +
                            " L" + x2 + "," + x1 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " M" + w + "," + h +
                            " L" + x2 + "," + y2;

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "foldedCorner":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var refr = slideFactor;
                        var adj = 16667 * refr;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * refr;
                        }
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val;
                        var cnstVal1 = 50000 * refr;
                        var cnstVal2 = 100000 * refr;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var ss = Math.min(w, h);
                        var a, dy2, dy1, x1, x2, y2, y1;
                        a = (adj < 0) ? 0 : (adj > cnstVal1) ? cnstVal1 : adj;
                        dy2 = ss * a / cnstVal2;
                        dy1 = dy2 / 5;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = w - dy2;
                        x2 = x1 + dy1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y2 = h - dy2;
                        y1 = y2 + dy1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        d_val = "M" + x1 + "," + h +
                            " L" + x2 + "," + y1 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + y2 +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + x1 + "," + h +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + 0 + "," + h +
                            " L" + 0 + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + y2;

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "cloud":
                    case "cloudCallout":
                        var x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, y10, y11,
                            rx1, rx2, rx3, rx4, rx5, rx6, rx7, rx8, rx9, rx10, rx11, ry1, ry2, ry3, ry4, ry5, ry6, ry7, ry8, ry9, ry10, ry11;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x0 = w * 3900 / 43200;;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = w * 4693 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w * 6928 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x3 = w * 16478 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x4 = w * 28827 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x5 = w * 34129 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x6 = w * 41798 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x7 = w * 38324 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x8 = w * 29078 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x9 = w * 22141 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x10 = w * 14000 / 43200;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x11 = w * 4127 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y0 = h * 14370 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y1 = h * 26177 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y2 = h * 34899 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y3 = h * 39090 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y4 = h * 34751 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y5 = h * 22954 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y6 = h * 15354 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y7 = h * 5426 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y8 = h * 3952 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y9 = h * 4720 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y10 = h * 5192 / 43200;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y11 = h * 15789 / 43200;
                        //Path:
                        //(path attrs: w = 43200; h = 43200; )
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var rX1 = w * 6753 / 43200, rY1 = h * 9190 / 43200, rX2 = w * 5333 / 43200, rY2 = h * 7267 / 43200, rX3 = w * 4365 / 43200,
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            rY3 = h * 5945 / 43200, rX4 = w * 4857 / 43200, rY4 = h * 6595 / 43200, rY5 = h * 7273 / 43200, rX6 = w * 6775 / 43200,
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            rY6 = h * 9220 / 43200, rX7 = w * 5785 / 43200, rY7 = h * 7867 / 43200, rX8 = w * 6752 / 43200, rY8 = h * 9215 / 43200,
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            rX9 = w * 7720 / 43200, rY9 = h * 10543 / 43200, rX10 = w * 4360 / 43200, rY10 = h * 5918 / 43200, rX11 = w * 4345 / 43200;
                        var sA1 = -11429249 / 60000, wA1 = 7426832 / 60000, sA2 = -8646143 / 60000, wA2 = 5396714 / 60000, sA3 = -8748475 / 60000,
                            wA3 = 5983381 / 60000, sA4 = -7859164 / 60000, wA4 = 7034504 / 60000, sA5 = -4722533 / 60000, wA5 = 6541615 / 60000,
                            sA6 = -2776035 / 60000, wA6 = 7816140 / 60000, sA7 = 37501 / 60000, wA7 = 6842000 / 60000, sA8 = 1347096 / 60000,
                            wA8 = 6910353 / 60000, sA9 = 3974558 / 60000, wA9 = 4542661 / 60000, sA10 = -16496525 / 60000, wA10 = 8804134 / 60000,
                            sA11 = -14809710 / 60000, wA11 = 9151131 / 60000;

                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var cX0, cX1, cX2, cX3, cX4, cX5, cX6, cX7, cX8, cX9, cX10, cY0, cY1, cY2, cY3, cY4, cY5, cY6, cY7, cY8, cY9, cY10;
                        var arc1, arc2, arc3, arc4, arc5, arc6, arc7, arc8, arc9, arc10, arc11;
                        var lxy1, lxy2, lxy3, lxy4, lxy5, lxy6, lxy7, lxy8, lxy9, lxy10;

                        cX0 = x0 - rX1 * Math.cos(sA1 * Math.PI / 180);
                        cY0 = y0 - rY1 * Math.sin(sA1 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc1 = shapeArc(cX0, cY0, rX1, rY1, sA1, sA1 + wA1, false).replace("M", "L");
                        lxy1 = arc1.substr(arc1.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX1 = parseInt(lxy1[0]) - rX2 * Math.cos(sA2 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY1 = parseInt(lxy1[1]) - rY2 * Math.sin(sA2 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc2 = shapeArc(cX1, cY1, rX2, rY2, sA2, sA2 + wA2, false).replace("M", "L");
                        lxy2 = arc2.substr(arc2.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX2 = parseInt(lxy2[0]) - rX3 * Math.cos(sA3 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY2 = parseInt(lxy2[1]) - rY3 * Math.sin(sA3 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc3 = shapeArc(cX2, cY2, rX3, rY3, sA3, sA3 + wA3, false).replace("M", "L");
                        lxy3 = arc3.substr(arc3.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX3 = parseInt(lxy3[0]) - rX4 * Math.cos(sA4 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY3 = parseInt(lxy3[1]) - rY4 * Math.sin(sA4 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc4 = shapeArc(cX3, cY3, rX4, rY4, sA4, sA4 + wA4, false).replace("M", "L");
                        lxy4 = arc4.substr(arc4.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX4 = parseInt(lxy4[0]) - rX2 * Math.cos(sA5 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY4 = parseInt(lxy4[1]) - rY5 * Math.sin(sA5 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc5 = shapeArc(cX4, cY4, rX2, rY5, sA5, sA5 + wA5, false).replace("M", "L");
                        lxy5 = arc5.substr(arc5.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX5 = parseInt(lxy5[0]) - rX6 * Math.cos(sA6 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY5 = parseInt(lxy5[1]) - rY6 * Math.sin(sA6 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc6 = shapeArc(cX5, cY5, rX6, rY6, sA6, sA6 + wA6, false).replace("M", "L");
                        lxy6 = arc6.substr(arc6.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX6 = parseInt(lxy6[0]) - rX7 * Math.cos(sA7 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY6 = parseInt(lxy6[1]) - rY7 * Math.sin(sA7 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc7 = shapeArc(cX6, cY6, rX7, rY7, sA7, sA7 + wA7, false).replace("M", "L");
                        lxy7 = arc7.substr(arc7.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX7 = parseInt(lxy7[0]) - rX8 * Math.cos(sA8 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY7 = parseInt(lxy7[1]) - rY8 * Math.sin(sA8 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc8 = shapeArc(cX7, cY7, rX8, rY8, sA8, sA8 + wA8, false).replace("M", "L");
                        lxy8 = arc8.substr(arc8.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX8 = parseInt(lxy8[0]) - rX9 * Math.cos(sA9 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY8 = parseInt(lxy8[1]) - rY9 * Math.sin(sA9 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc9 = shapeArc(cX8, cY8, rX9, rY9, sA9, sA9 + wA9, false).replace("M", "L");
                        lxy9 = arc9.substr(arc9.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX9 = parseInt(lxy9[0]) - rX10 * Math.cos(sA10 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY9 = parseInt(lxy9[1]) - rY10 * Math.sin(sA10 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc10 = shapeArc(cX9, cY9, rX10, rY10, sA10, sA10 + wA10, false).replace("M", "L");
                        lxy10 = arc10.substr(arc10.lastIndexOf("L") + 1).split(" ");
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cX10 = parseInt(lxy10[0]) - rX11 * Math.cos(sA11 * Math.PI / 180);
                        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
                        cY10 = parseInt(lxy10[1]) - rY3 * Math.sin(sA11 * Math.PI / 180);
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        arc11 = shapeArc(cX10, cY10, rX11, rY3, sA11, sA11 + wA11, false).replace("M", "L");

                        var d1 = "M" + x0 + "," + y0 +
                            arc1 +
                            arc2 +
                            arc3 +
                            arc4 +
                            arc5 +
                            arc6 +
                            arc7 +
                            arc8 +
                            arc9 +
                            arc10 +
                            arc11 +
                            " z";
                        if (shapType == "cloudCallout") {
                            var shapAdjst_ary = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd"]);
                            var refr = slideFactor;
                            var sAdj1, adj1 = -20833 * refr;
                            var sAdj2, adj2 = 62500 * refr;
                            if (shapAdjst_ary !== undefined) {
                                for (var i = 0; i < shapAdjst_ary.length; i++) {
                                    var sAdj_name = getTextByPathList(shapAdjst_ary[i], ["attrs", "name"]);
                                    if (sAdj_name == "adj1") {
                                        sAdj1 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                        adj1 = parseInt(sAdj1.substr(4)) * refr;
                                    } else if (sAdj_name == "adj2") {
                                        sAdj2 = getTextByPathList(shapAdjst_ary[i], ["attrs", "fmla"]);
                                        adj2 = parseInt(sAdj2.substr(4)) * refr;
                                    }
                                }
                            }
                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            var d_val;
                            var cnstVal2 = 100000 * refr;
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            var ss = Math.min(w, h);
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            var wd2 = w / 2, hd2 = h / 2;

                            // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                            var dxPos, dyPos, xPos, yPos, ht, wt, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15, g16,
                                g17, g18, g19, g20, g21, g22, g23, g24, g25, g26, x23, x24, x25;

                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            dxPos = w * adj1 / cnstVal2;
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            dyPos = h * adj2 / cnstVal2;
                            xPos = wd2 + dxPos;
                            yPos = hd2 + dyPos;
                            ht = hd2 * Math.cos(Math.atan(dyPos / dxPos));
                            wt = wd2 * Math.sin(Math.atan(dyPos / dxPos));
                            g2 = wd2 * Math.cos(Math.atan(wt / ht));
                            g3 = hd2 * Math.sin(Math.atan(wt / ht));
                            //console.log("adj1: ",adj1,"adj2: ",adj2)
                            if (adj1 >= 0) {
                                g4 = wd2 + g2;
                                g5 = hd2 + g3;
                            } else {
                                g4 = wd2 - g2;
                                g5 = hd2 - g3;
                            }
                            g6 = g4 - xPos;
                            g7 = g5 - yPos;
                            g8 = Math.sqrt(g6 * g6 + g7 * g7);
                            g9 = ss * 6600 / 21600;
                            g10 = g8 - g9;
                            g11 = g10 / 3;
                            g12 = ss * 1800 / 21600;
                            g13 = g11 + g12;
                            g14 = g13 * g6 / g8;
                            g15 = g13 * g7 / g8;
                            g16 = g14 + xPos;
                            g17 = g15 + yPos;
                            g18 = ss * 4800 / 21600;
                            g19 = g11 * 2;
                            g20 = g18 + g19;
                            g21 = g20 * g6 / g8;
                            g22 = g20 * g7 / g8;
                            g23 = g21 + xPos;
                            g24 = g22 + yPos;
                            g25 = ss * 1200 / 21600;
                            g26 = ss * 600 / 21600;
                            x23 = xPos + g26;
                            x24 = g16 + g25;
                            x25 = g23 + g12;

                            d_val = //" M" + x23 + "," + yPos + 
                                shapeArc(x23 - g26, yPos, g26, g26, 0, 360, false) + //.replace("M","L") +
                                " z" +
                                " M" + x24 + "," + g17 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x24 - g25, g17, g25, g25, 0, 360, false).replace("M", "L") +
                                " z" +
                                " M" + x25 + "," + g24 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x25 - g12, g24, g12, g12, 0, 360, false).replace("M", "L") +
                                " z";
                            d1 += d_val;
                        }
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d1 + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "smileyFace":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var refr = slideFactor;
                        var adj = 4653 * refr;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * refr;
                        }
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val;
                        var cnstVal1 = 50000 * refr;
                        var cnstVal2 = 100000 * refr;
                        var cnstVal3 = 4653 * refr;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var ss = Math.min(w, h);
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var a, x1, x2, x3, x4, y1, y3, dy2, y2, y4, dy3, y5, wR, hR, wd2, hd2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        wd2 = w / 2;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        hd2 = h / 2;
                        a = (adj < -cnstVal3) ? -cnstVal3 : (adj > cnstVal3) ? cnstVal3 : adj;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = w * 4969 / 21699;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w * 6215 / 21600;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x3 = w * 13135 / 21600;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x4 = w * 16640 / 21600;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y1 = h * 7570 / 21600;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y3 = h * 16515 / 21600;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        dy2 = h * a / cnstVal2;
                        y2 = y3 - dy2;
                        y4 = y3 + dy2;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        dy3 = h * a / cnstVal1;
                        y5 = y4 + dy3;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        wR = w * 1125 / 21600;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        hR = h * 1125 / 21600;
                        var cX1 = x2 - wR * Math.cos(Math.PI);
                        var cY1 = y1 - hR * Math.sin(Math.PI);
                        var cX2 = x3 - wR * Math.cos(Math.PI);
                        d_val = //eyes
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(cX1, cY1, wR, hR, 180, 540, false) +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(cX2, cY1, wR, hR, 180, 540, false) +
                            //mouth
                            " M" + x1 + "," + y2 +
                            " Q" + wd2 + "," + y5 + " " + x4 + "," + y2 +
                            " Q" + wd2 + "," + y5 + " " + x1 + "," + y2 +
                            //head
                            " M" + 0 + "," + hd2 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(wd2, hd2, wd2, hd2, 180, 540, false).replace("M", "L") +
                            " z";
                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "verticalScroll":
                    case "horizontalScroll":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var refr = slideFactor;
                        var adj = 12500 * refr;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * refr;
                        }
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val;
                        var cnstVal1 = 25000 * refr;
                        var cnstVal2 = 100000 * refr;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var ss = Math.min(w, h);
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var t = 0, l = 0, b = h, r = w;
                        var a, ch, ch2, ch4;
                        a = (adj < 0) ? 0 : (adj > cnstVal1) ? cnstVal1 : adj;
                        ch = ss * a / cnstVal2;
                        ch2 = ch / 2;
                        ch4 = ch / 4;
                        if (shapType == "verticalScroll") {
                            var x3, x4, x6, x7, x5, y3, y4;
                            x3 = ch + ch2;
                            x4 = ch + ch;
                            x6 = r - ch;
                            x7 = r - ch2;
                            x5 = x6 - ch2;
                            y3 = b - ch;
                            y4 = b - ch2;

                            d_val = "M" + ch + "," + y3 +
                                " L" + ch + "," + ch2 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x3, ch2, ch2, ch2, 180, 270, false).replace("M", "L") +
                                " L" + x7 + "," + t +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x7, ch2, ch2, ch2, 270, 450, false).replace("M", "L") +
                                " L" + x6 + "," + ch +
                                " L" + x6 + "," + y4 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x5, y4, ch2, ch2, 0, 90, false).replace("M", "L") +
                                " L" + ch2 + "," + b +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(ch2, y4, ch2, ch2, 90, 270, false).replace("M", "L") +
                                " z" +
                                " M" + x3 + "," + t +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x3, ch2, ch2, ch2, 270, 450, false).replace("M", "L") +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x3, x3 / 2, ch4, ch4, 90, 270, false).replace("M", "L") +
                                " L" + x4 + "," + ch2 +
                                " M" + x6 + "," + ch +
                                " L" + x3 + "," + ch +
                                " M" + ch + "," + y4 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(ch2, y4, ch2, ch2, 0, 270, false).replace("M", "L") +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(ch2, (y4 + y3) / 2, ch4, ch4, 270, 450, false).replace("M", "L") +
                                " z" +
                                " M" + ch + "," + y4 +
                                " L" + ch + "," + y3;
                        } else if (shapType == "horizontalScroll") {
                            var y3, y4, y6, y7, y5, x3, x4;
                            y3 = ch + ch2;
                            y4 = ch + ch;
                            y6 = b - ch;
                            y7 = b - ch2;
                            y5 = y6 - ch2;
                            x3 = r - ch;
                            x4 = r - ch2;

                            d_val = "M" + l + "," + y3 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(ch2, y3, ch2, ch2, 180, 270, false).replace("M", "L") +
                                " L" + x3 + "," + ch +
                                " L" + x3 + "," + ch2 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x4, ch2, ch2, ch2, 180, 360, false).replace("M", "L") +
                                " L" + r + "," + y5 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x4, y5, ch2, ch2, 0, 90, false).replace("M", "L") +
                                " L" + ch + "," + y6 +
                                " L" + ch + "," + y7 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(ch2, y7, ch2, ch2, 0, 180, false).replace("M", "L") +
                                " z" +
                                "M" + x4 + "," + ch +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(x4, ch2, ch2, ch2, 90, -180, false).replace("M", "L") +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc((x3 + x4) / 2, ch2, ch4, ch4, 180, 0, false).replace("M", "L") +
                                " z" +
                                " M" + x4 + "," + ch +
                                " L" + x3 + "," + ch +
                                " M" + ch2 + "," + y4 +
                                " L" + ch2 + "," + y3 +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(y3 / 2, y3, ch4, ch4, 180, 360, false).replace("M", "L") +
                                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                                shapeArc(ch2, y3, ch2, ch2, 0, 180, false).replace("M", "L") +
                                " M" + ch + "," + y3 +
                                " L" + ch + "," + y6;
                        }

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "line":
                    case "straightConnector1":
                    case "bentConnector4":
                    case "bentConnector5":
                    case "curvedConnector2":
                    case "curvedConnector3":
                    case "curvedConnector4":
                    case "curvedConnector5":
                        // if (isFlipV) {
                        //     result += "<line x1='" + w + "' y1='0' x2='0' y2='" + h + "' stroke='" + border.color +
                        //         "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' ";
                        // } else {
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        result += "<line x1='0' y1='0' x2='" + w + "' y2='" + h + "' stroke='" + border.color +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' ";
                        //}
                        if (headEndNodeAttrs !== undefined && (headEndNodeAttrs["type"] === "triangle" || headEndNodeAttrs["type"] === "arrow")) {
                            result += "marker-start='url(#markerTriangle_" + shpId + ")' ";
                        }
                        if (tailEndNodeAttrs !== undefined && (tailEndNodeAttrs["type"] === "triangle" || tailEndNodeAttrs["type"] === "arrow")) {
                            result += "marker-end='url(#markerTriangle_" + shpId + ")' ";
                        }
                        result += "/>";
                        break;
                    case "homePlate":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj = 50000 * slideFactor;
                        var cnstVal1 = 100000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var a, x1, dx1, maxAdj, vc = h / 2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var minWH = Math.min(w, h);
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        maxAdj = cnstVal1 * w / minWH;
                        if (adj < 0) a = 0
                        else if (adj > maxAdj) a = maxAdj
                        else a = adj
                        dx1 = minWH * a / cnstVal1;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x1 = w - dx1;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val = "M" + 0 + "," + 0 +
                            " L" + x1 + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + vc +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + x1 + "," + h +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + 0 + "," + h + " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path  d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

                        break;
                    case "chevron":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj = 50000 * slideFactor;
                        var cnstVal1 = 100000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        var a, x1, dx1, x2, maxAdj, vc = h / 2;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var minWH = Math.min(w, h);
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        maxAdj = cnstVal1 * w / minWH;
                        if (adj < 0) a = 0
                        else if (adj > maxAdj) a = maxAdj
                        else a = adj
                        x1 = minWH * a / cnstVal1;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        x2 = w - x1;
                        // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                        var d_val = "M" + 0 + "," + 0 +
                            " L" + x2 + "," + 0 +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + vc +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + x2 + "," + h +
                            // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                            " L" + 0 + "," + h +
                            " L" + x1 + "," + vc + " z";

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path d='" + d_val + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";


                        break;
                    case "can":
                    case "flowChartMagneticDisk":
                    case "flowChartMagneticDrum":
                        var shapAdjst = getTextByPathList(node, ["p:spPr", "a:prstGeom", "a:avLst", "a:gd", "attrs", "fmla"]);
                        var adj = 25000 * slideFactor;
                        var cnstVal1 = 50000 * slideFactor;
                        var cnstVal2 = 200000 * slideFactor;
                        if (shapAdjst !== undefined) {
                            adj = parseInt(shapAdjst.substr(4)) * slideFactor;
                        }
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var ss = Math.min(w, h);
                        var maxAdj, a, y1, y2, y3, dVal;
                        if (shapType == "flowChartMagneticDisk" || shapType == "flowChartMagneticDrum") {
                            adj = 50000 * slideFactor;
                        }
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        maxAdj = cnstVal1 * h / ss;
                        a = (adj < 0) ? 0 : (adj > maxAdj) ? maxAdj : adj;
                        y1 = ss * a / cnstVal2;
                        y2 = y1 + y1;
                        // @ts-expect-error TS(2454): Variable 'h' is used before being assigned.
                        y3 = h - y1;
                        // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                        var cd2 = 180, wd2 = w / 2;

                        var tranglRott = "";
                        if (shapType == "flowChartMagneticDrum") {
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            tranglRott = "transform='rotate(90 " + w / 2 + "," + h / 2 + ")'";
                        }
                        dVal = shapeArc(wd2, y1, wd2, y1, 0, cd2, false) +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(wd2, y1, wd2, y1, cd2, cd2 + cd2, false).replace("M", "L") +
                            // @ts-expect-error TS(2454): Variable 'w' is used before being assigned.
                            " L" + w + "," + y3 +
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            shapeArc(wd2, y3, wd2, y1, 0, cd2, false).replace("M", "L") +
                            " L" + 0 + "," + y1;

                        // @ts-expect-error TS(2454): Variable 'imgFillFlg' is used before being assigne... Remove this comment to see the full error message
                        result += "<path " + tranglRott + " d='" + dVal + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
                            // @ts-expect-error TS(2454): Variable 'border' is used before being assigned.
                            "' stroke='" + border.color + "' stroke-width='" + border.width + "' stroke-dasharray='" + border.strokeDasharray + "' />";

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

                result += "</svg>";

                result += "<div class='block " + getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode, type) + //block content
                    " " + getContentDir(node, type, warpObj) +
                    "' _id='" + id + "' _idx='" + idx + "' _type='" + type + "' _name='" + name +
                    "' style='" +
                    getPosition(slideXfrmNode, pNode, slideLayoutXfrmNode, slideMasterXfrmNode, sType, slideFactor) +
                    getSize(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode, slideFactor) +
                    " z-index: " + order + ";" +
                    "transform: rotate(" + ((txtRotate !== undefined) ? txtRotate : 0) + "deg);" +
                    "'>";

                // TextBody
                if (node["p:txBody"] !== undefined && (isUserDrawnBg === undefined || isUserDrawnBg === true)) {
                    if (type != "diagram" && type != "textBox") {
                        type = "shape";
                    }
                    // @ts-expect-error TS(2554): Expected 8 arguments, but got 7.
                    result += genTextBody(node["p:txBody"], node, slideLayoutSpNode, slideMasterSpNode, type, idx, warpObj, undefined, isFirstBr, styleTable, rtlLangsArray, slideFactor, fontSizeFactor); //type='shape'
                }
                result += "</div>";
            } else if (custShapType !== undefined) {
                result += renderCustomGeometry(
                    custShapType,
                    node,
                    slideLayoutSpNode,
                    slideMasterSpNode,
                    slideXfrmNode,
                    slideLayoutXfrmNode,
                    pNode,
                    slideMasterXfrmNode,
                    w,
                    h,
                    shpId,
                    imgFillFlg,
                    grndFillFlg,
                    fillColor,
                    border,
                    id,
                    idx,
                    type,
                    name,
                    order,
                    sType,
                    txtRotate,
                    warpObj,
                    isUserDrawnBg,
                    isFirstBr,
                    styleTable,
                    rtlLangsArray,
                    slideFactor,
                    fontSizeFactor
                );

            } else {

                result += "<div class='block " + getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode, type) +//block content 
                    " " + getContentDir(node, type, warpObj) +
                    "' _id='" + id + "' _idx='" + idx + "' _type='" + type + "' _name='" + name +
                    "' style='" +
                    getPosition(slideXfrmNode, pNode, slideLayoutXfrmNode, slideMasterXfrmNode, sType, slideFactor) +
                    getSize(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode, slideFactor) +
                    getBorder(node, pNode, false, "shape", warpObj) +
                    getShapeFill(node, pNode, false, warpObj, source) +
                    " z-index: " + order + ";" +
                    "transform: rotate(" + ((txtRotate !== undefined) ? txtRotate : 0) + "deg);" +
                    "'>";

                // TextBody
                if (node["p:txBody"] !== undefined && (isUserDrawnBg === undefined || isUserDrawnBg === true)) {
                    result += genTextBody(node["p:txBody"], node, slideLayoutSpNode, slideMasterSpNode, type, idx, warpObj, undefined, isFirstBr, styleTable, rtlLangsArray, slideFactor, fontSizeFactor);
                }
                result += "</div>";

            }
            //console.log("div block result:\n", result)
            return result;
        }
