import { getTextByPathList } from "../object";
import { getSolidFill } from "../color";
import { getShapeFill } from "../fill";
import { getBorder } from "../border";
import { genTextBody } from "../text";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

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
type GetTableCellParamsOptions = {
  tcNodes: XmlNode;
  getColsGrid: XmlNode[] | XmlNode;
  colIndex: number;
  tableStyle: XmlNode | undefined;
  cellSource: string | undefined;
  warpContext: WarpContext;
  firstLineBreak: { value: boolean };
  styleTable: any;
  rtlLanguages: string[];
  emuToPx: number;
  fontSizeScale: number;
};

export async function getTableCellParams({
  tcNodes,
  getColsGrid,
  colIndex,
  tableStyle,
  cellSource,
  warpContext,
  firstLineBreak,
  styleTable,
  rtlLanguages,
  emuToPx,
  fontSizeScale,
}: GetTableCellParamsOptions): Promise<[string, string, string, any, any]> {
  //tableStyle["a:band1V"] => tableStyle[cellSource]
  //text, cell-width, cell-borders,
  //var text = genTextBody(tcNodes["a:txBody"], tcNodes, undefined, undefined, undefined, undefined, warpContext);//tableStyles
  const rowSpan = getTextByPathList<string | number>({ node: tcNodes, path: ["attrs", "rowSpan"] });
  const colSpan = getTextByPathList<string | number>({
    node: tcNodes,
    path: ["attrs", "gridSpan"],
  });
  let colStyl = "word-wrap: break-word;";
  let colWidth;
  let cellFillColor = "";
  let colFontColor = "";
  let colFontWeight = "";
  let bottomLine: XmlNode | undefined;
  let topLine: XmlNode | undefined;
  let leftLine: XmlNode | undefined;
  let rightLine: XmlNode | undefined;

  const colSpanInt = parseInt(String(colSpan ?? ""), 10);
  let totalColumnWidth = 0;
  if (!isNaN(colSpanInt) && colSpanInt > 1) {
    for (let k = 0; k < colSpanInt; k++) {
      const colNode = Array.isArray(getColsGrid) ? getColsGrid[colIndex + k] : getColsGrid;
      const widthValue = colNode
        ? getTextByPathList<string | number>({ node: colNode, path: ["attrs", "w"] })
        : undefined;
      totalColumnWidth += parseInt(String(widthValue ?? "0"), 10);
    }
  } else {
    const colNode = Array.isArray(getColsGrid) ? getColsGrid[colIndex] : getColsGrid;
    const widthValue = colNode
      ? getTextByPathList<string | number>({ node: colNode, path: ["attrs", "w"] })
      : undefined;
    totalColumnWidth = parseInt(String(widthValue ?? "0"), 10);
  }

  const text = await genTextBody({
    textBodyNode: tcNodes["a:txBody"],
    spNode: tcNodes,
    shapeType: undefined,
    placeholderIndex: undefined,
    warpContext,
    tableColumnWidth: totalColumnWidth,
    firstLineBreak,
    styleTable,
    rtlLanguages,
    emuToPx,
    fontSizeScale,
  }); //tableStyles

  if (totalColumnWidth !== 0 /*&& rowIndex == 0*/) {
    colWidth = parseInt(String(totalColumnWidth), 10) * emuToPx;
    colStyl += "width:" + colWidth + "px;";
  }

  //cell bords
  bottomLine = getTextByPathList<XmlNode>({ node: tcNodes, path: ["a:tcPr", "a:lnB"] });
  if (bottomLine === undefined && cellSource !== undefined && tableStyle !== undefined) {
    bottomLine = getTextByPathList<XmlNode>({
      node: tableStyle,
      path: [cellSource, "a:tcStyle", "a:tcBdr", "a:bottom", "a:ln"],
    });
    if (bottomLine === undefined) {
      bottomLine = getTextByPathList<XmlNode>({
        node: tableStyle,
        path: ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:bottom", "a:ln"],
      });
    }
  }
  topLine = getTextByPathList<XmlNode>({ node: tcNodes, path: ["a:tcPr", "a:lnT"] });
  if (topLine === undefined) {
    if (cellSource !== undefined && tableStyle !== undefined) {
      topLine = getTextByPathList<XmlNode>({
        node: tableStyle,
        path: [cellSource, "a:tcStyle", "a:tcBdr", "a:top", "a:ln"],
      });
    }
    if (topLine === undefined && tableStyle !== undefined) {
      topLine = getTextByPathList<XmlNode>({
        node: tableStyle,
        path: ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:top", "a:ln"],
      });
    }
  }
  leftLine = getTextByPathList<XmlNode>({ node: tcNodes, path: ["a:tcPr", "a:lnL"] });
  if (leftLine === undefined) {
    if (cellSource !== undefined && tableStyle !== undefined) {
      leftLine = getTextByPathList<XmlNode>({
        node: tableStyle,
        path: [cellSource, "a:tcStyle", "a:tcBdr", "a:left", "a:ln"],
      });
    }
    if (leftLine === undefined && tableStyle !== undefined) {
      leftLine = getTextByPathList<XmlNode>({
        node: tableStyle,
        path: ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:left", "a:ln"],
      });
    }
  }
  rightLine = getTextByPathList<XmlNode>({ node: tcNodes, path: ["a:tcPr", "a:lnR"] });
  if (rightLine === undefined) {
    if (cellSource !== undefined && tableStyle !== undefined) {
      rightLine = getTextByPathList<XmlNode>({
        node: tableStyle,
        path: [cellSource, "a:tcStyle", "a:tcBdr", "a:right", "a:ln"],
      });
    }
    if (rightLine === undefined && tableStyle !== undefined) {
      rightLine = getTextByPathList<XmlNode>({
        node: tableStyle,
        path: ["a:wholeTbl", "a:tcStyle", "a:tcBdr", "a:right", "a:ln"],
      });
    }
  }
  void getTextByPathList<XmlNode>({ node: tcNodes, path: ["a:tcPr", "a:lnBlToTr"] });
  void getTextByPathList<XmlNode>({ node: tcNodes, path: ["a:tcPr", "a:InTlToBr"] });

  if (bottomLine !== undefined) {
    const bottomLineBorder = getBorder({
      shapeNode: bottomLine,
      isSvgMode: false,
      borderType: "shape",
      warpContext,
    });
    if (bottomLineBorder !== "") {
      colStyl += "border-bottom:" + bottomLineBorder + ";";
    }
  }
  if (topLine !== undefined) {
    const topLineBorder = getBorder({
      shapeNode: topLine,
      isSvgMode: false,
      borderType: "shape",
      warpContext,
    });
    if (topLineBorder !== "") {
      colStyl += "border-top: " + topLineBorder + ";";
    }
  }
  if (leftLine !== undefined) {
    const leftLineBorder = getBorder({
      shapeNode: leftLine,
      isSvgMode: false,
      borderType: "shape",
      warpContext,
    });
    if (leftLineBorder !== "") {
      colStyl += "border-left: " + leftLineBorder + ";";
    }
  }
  if (rightLine !== undefined) {
    const rightLineBorder = getBorder({
      shapeNode: rightLine,
      isSvgMode: false,
      borderType: "shape",
      warpContext,
    });
    if (rightLineBorder !== "") {
      colStyl += "border-right:" + rightLineBorder + ";";
    }
  }

  //cell fill color custom
  const getCelFill = getTextByPathList<XmlNode>({ node: tcNodes, path: ["a:tcPr"] });
  if (getCelFill !== undefined) {
    const cellObj = {
      "p:spPr": getCelFill,
    };
    const fillValue = await getShapeFill({
      shapeNode: cellObj,
      parentNode: undefined,
      isSvgMode: false,
      warpContext,
      sourceType: "slide",
    });
    cellFillColor = typeof fillValue === "string" ? fillValue : "";
  }

  //cell fill color theme
  if (cellFillColor === "" || cellFillColor === "background-color: inherit;") {
    let bgFillschemeClr;
    if (cellSource !== undefined && tableStyle !== undefined) {
      bgFillschemeClr = getTextByPathList<XmlNode>({
        node: tableStyle,
        path: [cellSource, "a:tcStyle", "a:fill", "a:solidFill"],
      });
    }
    if (bgFillschemeClr !== undefined) {
      const resolvedFillColor = getSolidFill({
        fillNode: bgFillschemeClr,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      });
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
  // var borderStyl = getTextByPathList({ node: tableStyle, path: [cellSource, "a:tcStyle", "a:tcBdr"] });
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
    rowTextStyle = getTextByPathList({ node: tableStyle, path: [cellSource, "a:tcTxStyle"] });
  }
  // if (rowTextStyle === undefined) {
  //     rowTextStyle = getTextByPathList({ node: tableStyle, path: ["a:wholeTbl", "a:tcTxStyle"] });
  // }
  if (rowTextStyle !== undefined) {
    const resolvedFontColor = getSolidFill({
      fillNode: rowTextStyle,
      colorMap: undefined,
      placeholderColor: undefined,
      warpContext,
    });
    if (resolvedFontColor !== undefined) {
      colFontColor = resolvedFontColor;
    }
    const resolvedFontWeight =
      getTextByPathList({ node: rowTextStyle, path: ["attrs", "b"] }) === "on" ? "bold" : "";
    if (resolvedFontWeight !== "") {
      colFontWeight = resolvedFontWeight;
    }
  }
  colStyl += colFontColor !== "" ? "color: #" + colFontColor + ";" : "";
  colStyl += colFontWeight !== "" ? " font-weight:" + colFontWeight + ";" : "";

  return [text, colStyl, cssName, rowSpan, colSpan];
}
