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
 * @param rowIndex - Row index
 * @param colIndex - Column index
 * @param tableStyle - Table style object
 * @param cellSource - Cell style source (e.g., "a:firstCol", "a:band2V")
 * @param warpContext - Warp object containing slide resources and styles
 * @param firstLineBreak - Object {value: boolean} for line break state tracking
 * @param styleTable - CSS style table for class generation (modified in place)
 * @param rtlLanguages - Array of RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @returns Array [text, colStyl, cssName, rowSpan, colSpan]
 */
export async function getTableCellParams(
  tcNodes: any,
  getColsGrid: any,
  rowIndex: number,
  colIndex: number,
  tableStyle: any,
  cellSource: string | undefined,
  warpContext: any,
  firstLineBreak: { value: boolean },
  styleTable: any,
  rtlLanguages: string[],
  emuToPx: number,
  fontSizeScale: number
): Promise<[string, string, string, any, any]> {
  //tableStyle["a:band1V"] => tableStyle[cellSource]
  //text, cell-width, cell-borders,
  //var text = genTextBody(tcNodes["a:txBody"], tcNodes, undefined, undefined, undefined, undefined, warpContext);//tableStyles
  const rowSpan = getTextByPathList(tcNodes, ["attrs", "rowSpan"]);
  const colSpan = getTextByPathList(tcNodes, ["attrs", "gridSpan"]);
  let colStyl = "word-wrap: break-word;";
  let colWidth;
  let cellFillColor = "";
  let colFontColor = "";
  let colFontWeight = "";
  let bottomLine = "",
    topLine = "",
    leftLine = "",
    rightLine = "";

  const colSpanInt = parseInt(colSpan);
  let totalColumnWidth = 0;
  if (!isNaN(colSpanInt) && colSpanInt > 1) {
    for (let k = 0; k < colSpanInt; k++) {
      totalColumnWidth += parseInt(getTextByPathList(getColsGrid[colIndex + k], ["attrs", "w"]));
    }
  } else {
    totalColumnWidth = getTextByPathList(
      colIndex === undefined ? getColsGrid : getColsGrid[colIndex],
      ["attrs", "w"]
    );
  }

  const text = await genTextBody(
    tcNodes["a:txBody"],
    tcNodes,
    undefined,
    undefined,
    undefined,
    undefined,
    warpContext,
    totalColumnWidth,
    firstLineBreak,
    styleTable,
    rtlLanguages,
    emuToPx,
    fontSizeScale
  ); //tableStyles

  if (totalColumnWidth !== 0 /*&& rowIndex == 0*/) {
    colWidth = parseInt(String(totalColumnWidth), 10) * emuToPx;
    colStyl += "width:" + colWidth + "px;";
  }

  //cell bords
  bottomLine = getTextByPathList(tcNodes, ["a:tcPr", "a:lnB"]);
  if (bottomLine === undefined && cellSource !== undefined) {
    if (cellSource !== undefined)
      bottomLine = getTextByPathList(tableStyle[cellSource], [
        "a:tcStyle",
        "a:tcBdr",
        "a:bottom",
        "a:ln",
      ]);
    if (bottomLine === undefined) {
      bottomLine = getTextByPathList(tableStyle, [
        "a:wholeTbl",
        "a:tcStyle",
        "a:tcBdr",
        "a:bottom",
        "a:ln",
      ]);
    }
  }
  topLine = getTextByPathList(tcNodes, ["a:tcPr", "a:lnT"]);
  if (topLine === undefined) {
    if (cellSource !== undefined)
      topLine = getTextByPathList(tableStyle[cellSource], [
        "a:tcStyle",
        "a:tcBdr",
        "a:top",
        "a:ln",
      ]);
    if (topLine === undefined) {
      topLine = getTextByPathList(tableStyle, [
        "a:wholeTbl",
        "a:tcStyle",
        "a:tcBdr",
        "a:top",
        "a:ln",
      ]);
    }
  }
  leftLine = getTextByPathList(tcNodes, ["a:tcPr", "a:lnL"]);
  if (leftLine === undefined) {
    if (cellSource !== undefined)
      leftLine = getTextByPathList(tableStyle[cellSource], [
        "a:tcStyle",
        "a:tcBdr",
        "a:left",
        "a:ln",
      ]);
    if (leftLine === undefined) {
      leftLine = getTextByPathList(tableStyle, [
        "a:wholeTbl",
        "a:tcStyle",
        "a:tcBdr",
        "a:left",
        "a:ln",
      ]);
    }
  }
  rightLine = getTextByPathList(tcNodes, ["a:tcPr", "a:lnR"]);
  if (rightLine === undefined) {
    if (cellSource !== undefined)
      rightLine = getTextByPathList(tableStyle[cellSource], [
        "a:tcStyle",
        "a:tcBdr",
        "a:right",
        "a:ln",
      ]);
    if (rightLine === undefined) {
      rightLine = getTextByPathList(tableStyle, [
        "a:wholeTbl",
        "a:tcStyle",
        "a:tcBdr",
        "a:right",
        "a:ln",
      ]);
    }
  }
  void getTextByPathList(tcNodes, ["a:tcPr", "a:lnBlToTr"]);
  void getTextByPathList(tcNodes, ["a:tcPr", "a:InTlToBr"]);

  if (bottomLine !== undefined && bottomLine !== "") {
    const bottomLineBorder = getBorder(bottomLine, undefined, false, "", warpContext);
    if (bottomLineBorder !== "") {
      colStyl += "border-bottom:" + bottomLineBorder + ";";
    }
  }
  if (topLine !== undefined && topLine !== "") {
    const topLineBorder = getBorder(topLine, undefined, false, "", warpContext);
    if (topLineBorder !== "") {
      colStyl += "border-top: " + topLineBorder + ";";
    }
  }
  if (leftLine !== undefined && leftLine !== "") {
    const leftLineBorder = getBorder(leftLine, undefined, false, "", warpContext);
    if (leftLineBorder !== "") {
      colStyl += "border-left: " + leftLineBorder + ";";
    }
  }
  if (rightLine !== undefined && rightLine !== "") {
    const rightLineBorder = getBorder(rightLine, undefined, false, "", warpContext);
    if (rightLineBorder !== "") {
      colStyl += "border-right:" + rightLineBorder + ";";
    }
  }

  //cell fill color custom
  const getCelFill = getTextByPathList(tcNodes, ["a:tcPr"]);
  if (getCelFill !== undefined && getCelFill !== "") {
    const cellObj = {
      "p:spPr": getCelFill,
    };
    cellFillColor = await getShapeFill(cellObj, undefined, false, warpContext, "slide");
  }

  //cell fill color theme
  if (cellFillColor === "" || cellFillColor === "background-color: inherit;") {
    let bgFillschemeClr;
    if (cellSource !== undefined)
      bgFillschemeClr = getTextByPathList(tableStyle, [
        cellSource,
        "a:tcStyle",
        "a:fill",
        "a:solidFill",
      ]);
    if (bgFillschemeClr !== undefined) {
      const resolvedFillColor = getSolidFill(bgFillschemeClr, undefined, undefined, warpContext);
      if (resolvedFillColor !== undefined) {
        cellFillColor = " background-color: #" + resolvedFillColor + ";";
      }
    }
  }
  let cssName = "";
  if (cellFillColor !== undefined && cellFillColor !== "") {
    if (cellFillColor in styleTable) {
      cssName = styleTable[cellFillColor]["name"];
    } else {
      cssName = "_tbl_cell_css_" + (Object.keys(styleTable).length + 1);
      styleTable[cellFillColor] = {
        name: cssName,
        text: cellFillColor,
      };
    }
  }

  //border
  // var borderStyl = getTextByPathList(tableStyle, [cellSource, "a:tcStyle", "a:tcBdr"]);
  // if (borderStyl !== undefined) {
  //     var local_col_borders = getTableBorders(borderStyl, warpContext);
  //     if (local_col_borders != "") {
  //         col_borders = local_col_borders;
  //     }
  // }
  // if (col_borders != "") {
  //     colStyl += col_borders;
  // }

  //Text style
  let rowTextStyle;
  if (cellSource !== undefined) {
    rowTextStyle = getTextByPathList(tableStyle, [cellSource, "a:tcTxStyle"]);
  }
  // if (rowTextStyle === undefined) {
  //     rowTextStyle = getTextByPathList(tableStyle, ["a:wholeTbl", "a:tcTxStyle"]);
  // }
  if (rowTextStyle !== undefined) {
    const resolvedFontColor = getSolidFill(rowTextStyle, undefined, undefined, warpContext);
    if (resolvedFontColor !== undefined) {
      colFontColor = resolvedFontColor;
    }
    const resolvedFontWeight =
      getTextByPathList(rowTextStyle, ["attrs", "b"]) === "on" ? "bold" : "";
    if (resolvedFontWeight !== "") {
      colFontWeight = resolvedFontWeight;
    }
  }
  colStyl += colFontColor !== "" ? "color: #" + colFontColor + ";" : "";
  colStyl += colFontWeight !== "" ? " font-weight:" + colFontWeight + ";" : "";

  return [text, colStyl, cssName, rowSpan, colSpan];
}
