import { getTextByPathList } from "../object";
import { getSolidFill } from "../color";
import { getTableBorders } from "../border";
import { getPosition, getSize } from "../layout";
import { getTableCellParams } from "./get-table-cell-params";

/**
 * Generate HTML table from PPTX table node
 *
 * Processes PPTX table structure (a:tbl) to create HTML table with:
 * - Table-level styling (borders, background color, RTL direction)
 * - Row-level styling (height, colors, fonts) based on table style attributes
 * - Special row styling (first row, last row, banded rows)
 * - Column styling (first column, last column, banded columns)
 * - Cell-level processing via getTableCellParams
 * - Support for rowSpan and colSpan
 *
 * Table style attributes (from a:tblPr):
 * - firstRow: Apply first row styling
 * - lastRow: Apply last row styling
 * - firstCol: Apply first column styling
 * - lastCol: Apply last column styling
 * - bandRow: Apply alternating row bands (band1H/band2H)
 * - bandCol: Apply alternating column bands (band1V/band2V)
 *
 * @param node - Graphic frame node containing table (p:graphicFrame)
 * @param warpObj - Warp object containing slide resources and styles
 * @param tableStyles - Table styles from presentation (a:tblStyleLst)
 * @param isFirstBr - Object {value: boolean} for line break state tracking
 * @param styleTable - CSS style table for class generation (modified in place)
 * @param rtlLangsArray - Array of RTL language codes
 * @param slideFactor - EMU to pixel conversion factor
 * @param fontSizeFactor - Font size scaling factor
 * @returns HTML string for the table
 */
export function genTable(
    node: any,
    warpObj: any,
    tableStyles: any,
    isFirstBr: { value: boolean },
    styleTable: any,
    rtlLangsArray: string[],
    slideFactor: number,
    fontSizeFactor: number
): string {
    var order = node["attrs"]["order"];
    var tableNode = getTextByPathList(node, ["a:graphic", "a:graphicData", "a:tbl"]);
    var xfrmNode = getTextByPathList(node, ["p:xfrm"]);
    /////////////////////////////////////////Amir////////////////////////////////////////////////
    var getTblPr = getTextByPathList(node, ["a:graphic", "a:graphicData", "a:tbl", "a:tblPr"]);
    var getColsGrid = getTextByPathList(node, ["a:graphic", "a:graphicData", "a:tbl", "a:tblGrid", "a:gridCol"]);
    var tblDir = "";
    if (getTblPr !== undefined) {
        var isRTL = getTblPr["attrs"]["rtl"];
        tblDir = (isRTL == 1 ? "dir=rtl" : "dir=ltr");
    }
    var firstRowAttr = getTblPr["attrs"]["firstRow"]; //associated element <a:firstRow> in the table styles
    var firstColAttr = getTblPr["attrs"]["firstCol"]; //associated element <a:firstCol> in the table styles
    var lastRowAttr = getTblPr["attrs"]["lastRow"]; //associated element <a:lastRow> in the table styles
    var lastColAttr = getTblPr["attrs"]["lastCol"]; //associated element <a:lastCol> in the table styles
    var bandRowAttr = getTblPr["attrs"]["bandRow"]; //associated element <a:band1H>, <a:band2H> in the table styles
    var bandColAttr = getTblPr["attrs"]["bandCol"]; //associated element <a:band1V>, <a:band2V> in the table styles
    //console.log("getTblPr: ", getTblPr);
    var tblStylAttrObj = {
        isFrstRowAttr: (firstRowAttr !== undefined && firstRowAttr == "1") ? 1 : 0,
        isFrstColAttr: (firstColAttr !== undefined && firstColAttr == "1") ? 1 : 0,
        isLstRowAttr: (lastRowAttr !== undefined && lastRowAttr == "1") ? 1 : 0,
        isLstColAttr: (lastColAttr !== undefined && lastColAttr == "1") ? 1 : 0,
        isBandRowAttr: (bandRowAttr !== undefined && bandRowAttr == "1") ? 1 : 0,
        isBandColAttr: (bandColAttr !== undefined && bandColAttr == "1") ? 1 : 0
    }

    var thisTblStyle;
    var tbleStyleId = getTblPr["a:tableStyleId"];
    if (tbleStyleId !== undefined) {
        var tbleStylList = tableStyles["a:tblStyleLst"]["a:tblStyle"];
        if (tbleStylList !== undefined) {
            if (tbleStylList.constructor === Array) {
                for (var k = 0; k < tbleStylList.length; k++) {
                    if (tbleStylList[k]["attrs"]["styleId"] == tbleStyleId) {
                        thisTblStyle = tbleStylList[k];
                    }
                }
            } else {
                if (tbleStylList["attrs"]["styleId"] == tbleStyleId) {
                    thisTblStyle = tbleStylList;
                }
            }
        }
    }
    if (thisTblStyle !== undefined) {
        thisTblStyle["tblStylAttrObj"] = tblStylAttrObj;
        warpObj["thisTbiStyle"] = thisTblStyle;
    }
    var tblStyl = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle"]);
    var tblBorderStyl = getTextByPathList(tblStyl, ["a:tcBdr"]);
    var tbl_borders = "";
    if (tblBorderStyl !== undefined) {
        tbl_borders = getTableBorders(tblBorderStyl, warpObj);
    }
    var tbl_bgcolor = "";
    var tbl_opacity = 1;
    var tbl_bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:tblBg", "a:fillRef"]);
    //console.log( "thisTblStyle:", thisTblStyle, "warpObj:", warpObj)
    if (tbl_bgFillschemeClr !== undefined) {
        // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
        tbl_bgcolor = getSolidFill(tbl_bgFillschemeClr, undefined, undefined, warpObj);
    }
    if (tbl_bgFillschemeClr === undefined) {
        tbl_bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:fill", "a:solidFill"]);
        // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
        tbl_bgcolor = getSolidFill(tbl_bgFillschemeClr, undefined, undefined, warpObj);
    }
    if (tbl_bgcolor !== "") {
        tbl_bgcolor = "background-color: #" + tbl_bgcolor + ";";
    }
    ////////////////////////////////////////////////////////////////////////////////////////////
    var tableHtml = "<table " + tblDir + " style='border-collapse: collapse;" +
        getPosition(xfrmNode, node, undefined, undefined, undefined, slideFactor) +
        getSize(xfrmNode, undefined, undefined, slideFactor) +
        " z-index: " + order + ";" +
        tbl_borders + ";" +
        tbl_bgcolor + "'>";

    var trNodes = tableNode["a:tr"];
    if (trNodes.constructor !== Array) {
        trNodes = [trNodes];
    }
    //if (trNodes.constructor === Array) {
        //multi rows
        var totalrowSpan = 0;
        var rowSpanAry: any = [];
        for (var i = 0; i < trNodes.length; i++) {
            //////////////rows Style ////////////Amir
            var rowHeightParam = trNodes[i]["attrs"]["h"];
            var rowHeight = 0;
            var rowsStyl = "";
            if (rowHeightParam !== undefined) {
                rowHeight = parseInt(rowHeightParam) * slideFactor;
                rowsStyl += "height:" + rowHeight + "px;";
            }
            var fillColor = "";
            var row_borders = "";
            var fontClrPr = "";
            var fontWeight = "";
            var band_1H_fillColor;
            var band_2H_fillColor;

            if (thisTblStyle !== undefined && thisTblStyle["a:wholeTbl"] !== undefined) {
                var bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:fill", "a:solidFill"]);
                if (bgFillschemeClr !== undefined) {
                    var local_fillColor = getSolidFill(bgFillschemeClr, undefined, undefined, warpObj);
                    if (local_fillColor !== undefined) {
                        fillColor = local_fillColor;
                    }
                }
                var rowTxtStyl = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcTxStyle"]);
                if (rowTxtStyl !== undefined) {
                    var local_fontColor = getSolidFill(rowTxtStyl, undefined, undefined, warpObj);
                    if (local_fontColor !== undefined) {
                        fontClrPr = local_fontColor;
                    }

                    var local_fontWeight = ((getTextByPathList(rowTxtStyl, ["attrs", "b"]) == "on") ? "bold" : "");
                    if (local_fontWeight != "") {
                        fontWeight = local_fontWeight
                    }
                }
            }

            if (i == 0 && tblStylAttrObj["isFrstRowAttr"] == 1 && thisTblStyle !== undefined) {

                var bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:firstRow", "a:tcStyle", "a:fill", "a:solidFill"]);
                if (bgFillschemeClr !== undefined) {
                    var local_fillColor = getSolidFill(bgFillschemeClr, undefined, undefined, warpObj);
                    if (local_fillColor !== undefined) {
                        fillColor = local_fillColor;
                    }
                }
                var borderStyl = getTextByPathList(thisTblStyle, ["a:firstRow", "a:tcStyle", "a:tcBdr"]);
                if (borderStyl !== undefined) {
                    var local_row_borders = getTableBorders(borderStyl, warpObj);
                    if (local_row_borders != "") {
                        row_borders = local_row_borders;
                    }
                }
                var rowTxtStyl = getTextByPathList(thisTblStyle, ["a:firstRow", "a:tcTxStyle"]);
                if (rowTxtStyl !== undefined) {
                    var local_fontClrPr = getSolidFill(rowTxtStyl, undefined, undefined, warpObj);
                    if (local_fontClrPr !== undefined) {
                        fontClrPr = local_fontClrPr;
                    }
                    var local_fontWeight = ((getTextByPathList(rowTxtStyl, ["attrs", "b"]) == "on") ? "bold" : "");
                    if (local_fontWeight !== "") {
                        fontWeight = local_fontWeight;
                    }
                }

            } else if (i > 0 && tblStylAttrObj["isBandRowAttr"] == 1 && thisTblStyle !== undefined) {
                fillColor = "";
                // @ts-expect-error TS(2322): Type 'undefined' is not assignable to type 'string... Remove this comment to see the full error message
                row_borders = undefined;
                if ((i % 2) == 0 && thisTblStyle["a:band2H"] !== undefined) {
                    // console.log("i: ", i, 'thisTblStyle["a:band2H"]:', thisTblStyle["a:band2H"])
                    //check if there is a row bg
                    var bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:band2H", "a:tcStyle", "a:fill", "a:solidFill"]);
                    if (bgFillschemeClr !== undefined) {
                        var local_fillColor = getSolidFill(bgFillschemeClr, undefined, undefined, warpObj);
                        if (local_fillColor !== "") {
                            // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
                            fillColor = local_fillColor;
                            band_2H_fillColor = local_fillColor;
                        }
                    }


                    var borderStyl = getTextByPathList(thisTblStyle, ["a:band2H", "a:tcStyle", "a:tcBdr"]);
                    if (borderStyl !== undefined) {
                        var local_row_borders = getTableBorders(borderStyl, warpObj);
                        if (local_row_borders != "") {
                            row_borders = local_row_borders;
                        }
                    }
                    var rowTxtStyl = getTextByPathList(thisTblStyle, ["a:band2H", "a:tcTxStyle"]);
                    if (rowTxtStyl !== undefined) {
                        var local_fontClrPr = getSolidFill(rowTxtStyl, undefined, undefined, warpObj);
                        if (local_fontClrPr !== undefined) {
                            fontClrPr = local_fontClrPr;
                        }
                    }

                    var local_fontWeight = ((getTextByPathList(rowTxtStyl, ["attrs", "b"]) == "on") ? "bold" : "");

                    if (local_fontWeight !== "") {
                        fontWeight = local_fontWeight;
                    }
                }
                if ((i % 2) != 0 && thisTblStyle["a:band1H"] !== undefined) {
                    var bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:band1H", "a:tcStyle", "a:fill", "a:solidFill"]);
                    if (bgFillschemeClr !== undefined) {
                        var local_fillColor = getSolidFill(bgFillschemeClr, undefined, undefined, warpObj);
                        if (local_fillColor !== undefined) {
                            fillColor = local_fillColor;
                            band_1H_fillColor = local_fillColor;
                        }
                    }
                    var borderStyl = getTextByPathList(thisTblStyle, ["a:band1H", "a:tcStyle", "a:tcBdr"]);
                    if (borderStyl !== undefined) {
                        var local_row_borders = getTableBorders(borderStyl, warpObj);
                        if (local_row_borders != "") {
                            row_borders = local_row_borders;
                        }
                    }
                    var rowTxtStyl = getTextByPathList(thisTblStyle, ["a:band1H", "a:tcTxStyle"]);
                    if (rowTxtStyl !== undefined) {
                        var local_fontClrPr = getSolidFill(rowTxtStyl, undefined, undefined, warpObj);
                        if (local_fontClrPr !== undefined) {
                            fontClrPr = local_fontClrPr;
                        }
                        var local_fontWeight = ((getTextByPathList(rowTxtStyl, ["attrs", "b"]) == "on") ? "bold" : "");
                        if (local_fontWeight != "") {
                            fontWeight = local_fontWeight;
                        }
                    }
                }

            }
            //last row
            if (i == (trNodes.length - 1) && tblStylAttrObj["isLstRowAttr"] == 1 && thisTblStyle !== undefined) {
                var bgFillschemeClr = getTextByPathList(thisTblStyle, ["a:lastRow", "a:tcStyle", "a:fill", "a:solidFill"]);
                if (bgFillschemeClr !== undefined) {
                    var local_fillColor = getSolidFill(bgFillschemeClr, undefined, undefined, warpObj);
                    if (local_fillColor !== undefined) {
                        fillColor = local_fillColor;
                    }
                    // var local_colorOpacity = getColorOpacity(bgFillschemeClr);
                    // if(local_colorOpacity !== undefined){
                    //     colorOpacity = local_colorOpacity;
                    // }
                }
                var borderStyl = getTextByPathList(thisTblStyle, ["a:lastRow", "a:tcStyle", "a:tcBdr"]);
                if (borderStyl !== undefined) {
                    var local_row_borders = getTableBorders(borderStyl, warpObj);
                    if (local_row_borders != "") {
                        row_borders = local_row_borders;
                    }
                }
                var rowTxtStyl = getTextByPathList(thisTblStyle, ["a:lastRow", "a:tcTxStyle"]);
                if (rowTxtStyl !== undefined) {
                    var local_fontClrPr = getSolidFill(rowTxtStyl, undefined, undefined, warpObj);
                    if (local_fontClrPr !== undefined) {
                        fontClrPr = local_fontClrPr;
                    }

                    var local_fontWeight = ((getTextByPathList(rowTxtStyl, ["attrs", "b"]) == "on") ? "bold" : "");
                    if (local_fontWeight !== "") {
                        fontWeight = local_fontWeight;
                    }
                }
            }
            rowsStyl += ((row_borders !== undefined) ? row_borders : "");
            rowsStyl += ((fontClrPr !== undefined) ? " color: #" + fontClrPr + ";" : "");
            rowsStyl += ((fontWeight != "") ? " font-weight:" + fontWeight + ";" : "");
            if (fillColor !== undefined && fillColor != "") {
                //rowsStyl += "background-color: rgba(" + hexToRgbNew(fillColor) + "," + colorOpacity + ");";
                rowsStyl += "background-color: #" + fillColor + ";";
            }
            tableHtml += "<tr style='" + rowsStyl + "'>";
            ////////////////////////////////////////////////

            var tcNodes = trNodes[i]["a:tc"];
            if (tcNodes !== undefined) {
                if (tcNodes.constructor === Array) {
                    //multi columns
                    var j = 0;
                    if (rowSpanAry.length == 0) {
                        rowSpanAry = Array.apply(null, Array(tcNodes.length)).map(function () { return 0 });
                    }
                    var totalColSpan = 0;
                    while (j < tcNodes.length) {
                        if (rowSpanAry[j] == 0 && totalColSpan == 0) {
                            var a_sorce;
                            //j=0 : first col
                            if (j == 0 && tblStylAttrObj["isFrstColAttr"] == 1) {
                                a_sorce = "a:firstCol";
                                if (tblStylAttrObj["isLstRowAttr"] == 1 && i == (trNodes.length - 1) &&
                                    getTextByPathList(thisTblStyle, ["a:seCell"]) !== undefined) {
                                    a_sorce = "a:seCell";
                                } else if (tblStylAttrObj["isFrstRowAttr"] == 1 && i == 0 &&
                                    getTextByPathList(thisTblStyle, ["a:neCell"]) !== undefined) {
                                    a_sorce = "a:neCell";
                                }
                            } else if ((j > 0 && tblStylAttrObj["isBandColAttr"] == 1) &&
                                !(tblStylAttrObj["isFrstColAttr"] == 1 && i == 0) &&
                                !(tblStylAttrObj["isLstRowAttr"] == 1 && i == (trNodes.length - 1)) &&
                                j != (tcNodes.length - 1)) {

                                if ((j % 2) != 0) {

                                    var aBandNode = getTextByPathList(thisTblStyle, ["a:band2V"]);
                                    if (aBandNode === undefined) {
                                        aBandNode = getTextByPathList(thisTblStyle, ["a:band1V"]);
                                        if (aBandNode !== undefined) {
                                            a_sorce = "a:band2V";
                                        }
                                    } else {
                                        a_sorce = "a:band2V";
                                    }

                                }
                            }

                            if (j == (tcNodes.length - 1) && tblStylAttrObj["isLstColAttr"] == 1) {
                                a_sorce = "a:lastCol";
                                if (tblStylAttrObj["isLstRowAttr"] == 1 && i == (trNodes.length - 1) && getTextByPathList(thisTblStyle, ["a:swCell"]) !== undefined) {
                                    a_sorce = "a:swCell";
                                } else if (tblStylAttrObj["isFrstRowAttr"] == 1 && i == 0 && getTextByPathList(thisTblStyle, ["a:nwCell"]) !== undefined) {
                                    a_sorce = "a:nwCell";
                                }
                            }

                            var cellParmAry = getTableCellParams(tcNodes[j], getColsGrid, i , j , thisTblStyle, a_sorce, warpObj, isFirstBr, styleTable, rtlLangsArray, slideFactor, fontSizeFactor)
                            var text = cellParmAry[0];
                            var colStyl = cellParmAry[1];
                            var cssName = cellParmAry[2];
                            var rowSpan = cellParmAry[3];
                            var colSpan = cellParmAry[4];



                            if (rowSpan !== undefined) {
                                totalrowSpan++;
                                rowSpanAry[j] = parseInt(rowSpan) - 1;
                                tableHtml += "<td class='" + cssName + "' data-row='" + i + "," + j + "' rowspan ='" +
                                    parseInt(rowSpan) + "' style='" + colStyl + "'>" + text + "</td>";
                            } else if (colSpan !== undefined) {
                                tableHtml += "<td class='" + cssName + "' data-row='" + i + "," + j + "' colspan = '" +
                                    parseInt(colSpan) + "' style='" + colStyl + "'>" + text + "</td>";
                                totalColSpan = parseInt(colSpan) - 1;
                            } else {
                                tableHtml += "<td class='" + cssName + "' data-row='" + i + "," + j + "' style = '" + colStyl + "'>" + text + "</td>";
                            }

                        } else {
                            if (rowSpanAry[j] != 0) {
                                rowSpanAry[j] -= 1;
                            }
                            if (totalColSpan != 0) {
                                totalColSpan--;
                            }
                        }
                        j++;
                    }
                } else {
                    //single column

                    var a_sorce;
                    if (tblStylAttrObj["isFrstColAttr"] == 1 && !(tblStylAttrObj["isLstRowAttr"] == 1)) {
                        a_sorce = "a:firstCol";

                    } else if ((tblStylAttrObj["isBandColAttr"] == 1) && !(tblStylAttrObj["isLstRowAttr"] == 1)) {

                        var aBandNode = getTextByPathList(thisTblStyle, ["a:band2V"]);
                        if (aBandNode === undefined) {
                            aBandNode = getTextByPathList(thisTblStyle, ["a:band1V"]);
                            if (aBandNode !== undefined) {
                                a_sorce = "a:band2V";
                            }
                        } else {
                            a_sorce = "a:band2V";
                        }
                    }

                    if (tblStylAttrObj["isLstColAttr"] == 1 && !(tblStylAttrObj["isLstRowAttr"] == 1)) {
                        a_sorce = "a:lastCol";
                    }


                    var cellParmAry = getTableCellParams(tcNodes, getColsGrid , i , undefined , thisTblStyle, a_sorce, warpObj, isFirstBr, styleTable, rtlLangsArray, slideFactor, fontSizeFactor)
                    var text = cellParmAry[0];
                    var colStyl = cellParmAry[1];
                    var cssName = cellParmAry[2];
                    var rowSpan = cellParmAry[3];

                    if (rowSpan !== undefined) {
                        tableHtml += "<td  class='" + cssName + "' rowspan='" + parseInt(rowSpan) + "' style = '" + colStyl + "'>" + text + "</td>";
                    } else {
                        tableHtml += "<td class='" + cssName + "' style='" + colStyl + "'>" + text + "</td>";
                    }
                }
            }
            tableHtml += "</tr>";
        }
        //////////////////////////////////////////////////////////////////////////////////


    return tableHtml;
}
