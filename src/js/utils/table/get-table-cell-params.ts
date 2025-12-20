import { getTextByPathList } from "../object";
import { getSolidFill } from "../color";
import { getShapeFill } from "../fill";
import { getBorder } from "../border";
import { genTextBody } from "../text";

/**
 * Generate table cell parameters (text, styling, CSS class, spans)
 *
 * Processes a single table cell (a:tc) to extract:
 * - Text content via genTextBody
 * - Cell width (from column grid, handling colSpan)
 * - Cell borders (bottom, top, left, right, diagonal)
 * - Cell fill color (custom or theme-based)
 * - Text styling (font color, font weight)
 * - rowSpan and colSpan attributes
 *
 * Returns array: [text, colStyl, cssName, rowSpan, colSpan]
 *
 * @param tcNodes - Table cell node (a:tc)
 * @param getColsGrid - Column grid definition (a:gridCol array)
 * @param row_idx - Row index
 * @param col_idx - Column index
 * @param thisTblStyle - Table style object
 * @param cellSource - Cell style source (e.g., "a:firstCol", "a:band2V")
 * @param warpObj - Warp object containing slide resources and styles
 * @param isFirstBr - Object {value: boolean} for line break state tracking
 * @param styleTable - CSS style table for class generation (modified in place)
 * @param rtlLangsArray - Array of RTL language codes
 * @param slideFactor - EMU to pixel conversion factor
 * @param fontSizeFactor - Font size scaling factor
 * @returns Array [text, colStyl, cssName, rowSpan, colSpan]
 */
export function getTableCellParams(
    tcNodes: any,
    getColsGrid: any,
    row_idx: any,
    col_idx: any,
    thisTblStyle: any,
    cellSource: any,
    warpObj: any,
    isFirstBr: { value: boolean },
    styleTable: any,
    rtlLangsArray: string[],
    slideFactor: number,
    fontSizeFactor: number
): [string, string, string, any, any] {
    //thisTblStyle["a:band1V"] => thisTblStyle[cellSource]
    //text, cell-width, cell-borders,
    //var text = genTextBody(tcNodes["a:txBody"], tcNodes, undefined, undefined, undefined, undefined, warpObj);//tableStyles
    var rowSpan = getTextByPathList(tcNodes, ["attrs", "rowSpan"]);
    var colSpan = getTextByPathList(tcNodes, ["attrs", "gridSpan"]);
    var vMerge = getTextByPathList(tcNodes, ["attrs", "vMerge"]);
    var hMerge = getTextByPathList(tcNodes, ["attrs", "hMerge"]);
    var colStyl = "word-wrap: break-word;";
    var colWidth;
    var celFillColor = "";
    var col_borders = "";
    var colFontClrPr = "";
    var colFontWeight = "";
    var lin_bottm = "",
        lin_top = "",
        lin_left = "",
        lin_right = "",
        lin_bottom_left_to_top_right = "",
        lin_top_left_to_bottom_right = "";

    var colSpanInt = parseInt(colSpan);
    var total_col_width = 0;
    if (!isNaN(colSpanInt) && colSpanInt > 1){
        for (var k = 0; k < colSpanInt ; k++) {
            total_col_width += parseInt(getTextByPathList(getColsGrid[col_idx + k], ["attrs", "w"]));
        }
    }else{
        total_col_width = getTextByPathList((col_idx === undefined) ? getColsGrid : getColsGrid[col_idx], ["attrs", "w"]);
    }


    var text = genTextBody(tcNodes["a:txBody"], tcNodes, undefined, undefined, undefined, undefined, warpObj, total_col_width, isFirstBr, styleTable, rtlLangsArray, slideFactor, fontSizeFactor);//tableStyles

    if (total_col_width != 0 /*&& row_idx == 0*/) {
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        colWidth = parseInt(total_col_width) * slideFactor;
        colStyl += "width:" + colWidth + "px;";
    }

    //cell bords
    lin_bottm = getTextByPathList(tcNodes, ["a:tcPr", "a:lnB"]);
    if (lin_bottm === undefined && cellSource !== undefined) {
        if (cellSource !== undefined)
            lin_bottm = getTextByPathList(thisTblStyle[cellSource], ["a:tcStyle", "a:tcBdr", "a:bottom", "a:ln"]);
        if (lin_bottm === undefined) {
            lin_bottm = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:bottom", "a:ln"]);
        }
    }
    lin_top = getTextByPathList(tcNodes, ["a:tcPr", "a:lnT"]);
    if (lin_top === undefined) {
        if (cellSource !== undefined)
            lin_top = getTextByPathList(thisTblStyle[cellSource], ["a:tcStyle", "a:tcBdr", "a:top", "a:ln"]);
        if (lin_top === undefined) {
            lin_top = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:top", "a:ln"]);
        }
    }
    lin_left = getTextByPathList(tcNodes, ["a:tcPr", "a:lnL"]);
    if (lin_left === undefined) {
        if (cellSource !== undefined)
            lin_left = getTextByPathList(thisTblStyle[cellSource], ["a:tcStyle", "a:tcBdr", "a:left", "a:ln"]);
        if (lin_left === undefined) {
            lin_left = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:left", "a:ln"]);
        }
    }
    lin_right = getTextByPathList(tcNodes, ["a:tcPr", "a:lnR"]);
    if (lin_right === undefined) {
        if (cellSource !== undefined)
            lin_right = getTextByPathList(thisTblStyle[cellSource], ["a:tcStyle", "a:tcBdr", "a:right", "a:ln"]);
        if (lin_right === undefined) {
            lin_right = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:right", "a:ln"]);
        }
    }
    lin_bottom_left_to_top_right = getTextByPathList(tcNodes, ["a:tcPr", "a:lnBlToTr"]);
    lin_top_left_to_bottom_right = getTextByPathList(tcNodes, ["a:tcPr", "a:InTlToBr"]);

    if (lin_bottm !== undefined && lin_bottm != "") {
        var bottom_line_border = getBorder(lin_bottm, undefined, false, "", warpObj)
        if (bottom_line_border != "") {
            colStyl += "border-bottom:" + bottom_line_border + ";";
        }
    }
    if (lin_top !== undefined && lin_top != "") {
        var top_line_border = getBorder(lin_top, undefined, false, "", warpObj);
        if (top_line_border != "") {
            colStyl += "border-top: " + top_line_border + ";";
        }
    }
    if (lin_left !== undefined && lin_left != "") {
        var left_line_border = getBorder(lin_left, undefined, false, "", warpObj)
        if (left_line_border != "") {
            colStyl += "border-left: " + left_line_border + ";";
        }
    }
    if (lin_right !== undefined && lin_right != "") {
        var right_line_border = getBorder(lin_right, undefined, false, "", warpObj)
        if (right_line_border != "") {
            colStyl += "border-right:" + right_line_border + ";";
        }
    }

    //cell fill color custom
    var getCelFill = getTextByPathList(tcNodes, ["a:tcPr"]);
    if (getCelFill !== undefined && getCelFill != "") {
        var cellObj = {
            "p:spPr": getCelFill
        };
        celFillColor = getShapeFill(cellObj, undefined, false, warpObj, "slide")
    }

    //cell fill color theme
    if (celFillColor == "" || celFillColor == "background-color: inherit;") {
        var bgFillschemeClr;
        if (cellSource !== undefined)
            bgFillschemeClr = getTextByPathList(thisTblStyle, [cellSource, "a:tcStyle", "a:fill", "a:solidFill"]);
        if (bgFillschemeClr !== undefined) {
            var local_fillColor = getSolidFill(bgFillschemeClr, undefined, undefined, warpObj);
            if (local_fillColor !== undefined) {
                celFillColor = " background-color: #" + local_fillColor + ";";
            }
        }
    }
    var cssName = "";
    if (celFillColor !== undefined && celFillColor != "") {
        if (celFillColor in styleTable) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            cssName = styleTable[celFillColor]["name"];
        } else {
            cssName = "_tbl_cell_css_" + (Object.keys(styleTable).length + 1);
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            styleTable[celFillColor] = {
                "name": cssName,
                "text": celFillColor
            };
        }

    }

    //border
    // var borderStyl = getTextByPathList(thisTblStyle, [cellSource, "a:tcStyle", "a:tcBdr"]);
    // if (borderStyl !== undefined) {
    //     var local_col_borders = getTableBorders(borderStyl, warpObj);
    //     if (local_col_borders != "") {
    //         col_borders = local_col_borders;
    //     }
    // }
    // if (col_borders != "") {
    //     colStyl += col_borders;
    // }

    //Text style
    var rowTxtStyl;
    if (cellSource !== undefined) {
        rowTxtStyl = getTextByPathList(thisTblStyle, [cellSource, "a:tcTxStyle"]);
    }
    // if (rowTxtStyl === undefined) {
    //     rowTxtStyl = getTextByPathList(thisTblStyle, ["a:wholeTbl", "a:tcTxStyle"]);
    // }
    if (rowTxtStyl !== undefined) {
        var local_fontClrPr = getSolidFill(rowTxtStyl, undefined, undefined, warpObj);
        if (local_fontClrPr !== undefined) {
            colFontClrPr = local_fontClrPr;
        }
        var local_fontWeight = ((getTextByPathList(rowTxtStyl, ["attrs", "b"]) == "on") ? "bold" : "");
        if (local_fontWeight !== "") {
            colFontWeight = local_fontWeight;
        }
    }
    colStyl += ((colFontClrPr !== "") ? "color: #" + colFontClrPr + ";" : "");
    colStyl += ((colFontWeight != "") ? " font-weight:" + colFontWeight + ";" : "");

    return [text, colStyl, cssName, rowSpan, colSpan];
}
