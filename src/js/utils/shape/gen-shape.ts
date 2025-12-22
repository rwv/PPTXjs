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
import { isStarShape, renderStarShape, isFlowchartShape, renderFlowchartShape, isActionButtonShape, renderActionButtonShape, isArrowShape, renderArrowShape, isCurvedArrowShape, renderCurvedArrowShape, isCalloutShape, renderCalloutShape, isRibbonShape, renderRibbonShape, isMathShape, renderMathShapeType, isBracketShape, renderBracketShape, isArcShape, renderArcShape, isPolygonShape, renderPolygonShape, isScrollShape, renderScrollShapeType, isMiscSymbolShape, renderMiscSymbolShape, isPlateCylinderShape, renderPlateCylinderShape, isConnectorShape, renderConnectorShape } from "./shapes";

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
                } else if (isArcShape(shapType)) {
                    // Handle arc shapes via dedicated module
                    result += renderArcShape(shapType, {
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
                } else if (isPolygonShape(shapType)) {
                    // Handle polygon shapes via dedicated module
                    result += renderPolygonShape(shapType, {
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
                } else if (isScrollShape(shapType)) {
                    // Handle scroll shapes via dedicated module
                    result += renderScrollShapeType(shapType, {
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
                } else if (isMiscSymbolShape(shapType)) {
                    // Handle misc symbol shapes via dedicated module
                    result += renderMiscSymbolShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        fillColor,
                        grndFillFlg,
                        imgFillFlg,
                        border,
                        slideFactor,
                        setTxtRotate: (angle: number) => { txtRotate = angle; }
                    });
                } else if (isPlateCylinderShape(shapType)) {
                    // Handle plate and cylinder shapes via dedicated module
                    result += renderPlateCylinderShape(shapType, {
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
                } else if (isConnectorShape(shapType)) {
                    // Handle connector shapes via dedicated module
                    result += renderConnectorShape(shapType, {
                        node,
                        w,
                        h,
                        shpId,
                        border
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
