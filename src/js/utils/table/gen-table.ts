import { getTextByPathList } from "../object";
import { getSolidFill } from "../color";
import { getTableBorders } from "../border";
import { getPosition, getSize } from "../layout";
import { getTableCellParams } from "./get-table-cell-params";
import { getTableRowStyle, getTableStyleById } from "./helpers";
import type { XmlNode } from "../../types/pptx-xml";

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
 * @param warpContext - Warp object containing slide resources and styles
 * @param tableStyles - Table styles from presentation (a:tblStyleLst)
 * @param firstLineBreak - Object {value: boolean} for line break state tracking
 * @param styleTable - CSS style table for class generation (modified in place)
 * @param rtlLanguages - Array of RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @returns HTML string for the table
 */
export async function genTable(
  node: any,
  warpContext: any,
  tableStyles: any,
  firstLineBreak: { value: boolean },
  styleTable: any,
  rtlLanguages: string[],
  emuToPx: number,
  fontSizeScale: number
): Promise<string> {
  const order = node["attrs"]["order"];
  const tableNode = getTextByPathList<XmlNode>(node, ["a:graphic", "a:graphicData", "a:tbl"]);
  const xfrmNode = getTextByPathList<XmlNode>(node, ["p:xfrm"]);
  /////////////////////////////////////////Amir////////////////////////////////////////////////
  const getTblPr = getTextByPathList<XmlNode>(node, [
    "a:graphic",
    "a:graphicData",
    "a:tbl",
    "a:tblPr",
  ]);
  const getColsGrid = getTextByPathList<XmlNode | XmlNode[]>(node, [
    "a:graphic",
    "a:graphicData",
    "a:tbl",
    "a:tblGrid",
    "a:gridCol",
  ]);
  let tblDir = "";
  if (getTblPr !== undefined) {
    const isRTL = getTblPr["attrs"]["rtl"];
    tblDir = String(isRTL) === "1" ? "dir=rtl" : "dir=ltr";
  }
  const firstRowAttr = getTblPr["attrs"]["firstRow"]; //associated element <a:firstRow> in the table styles
  const firstColAttr = getTblPr["attrs"]["firstCol"]; //associated element <a:firstCol> in the table styles
  const lastRowAttr = getTblPr["attrs"]["lastRow"]; //associated element <a:lastRow> in the table styles
  const lastColAttr = getTblPr["attrs"]["lastCol"]; //associated element <a:lastCol> in the table styles
  const bandRowAttr = getTblPr["attrs"]["bandRow"]; //associated element <a:band1H>, <a:band2H> in the table styles
  const bandColAttr = getTblPr["attrs"]["bandCol"]; //associated element <a:band1V>, <a:band2V> in the table styles
  //console.log("getTblPr: ", getTblPr);
  const tblStylAttrObj = {
    isFrstRowAttr: firstRowAttr !== undefined && firstRowAttr === "1" ? 1 : 0,
    isFrstColAttr: firstColAttr !== undefined && firstColAttr === "1" ? 1 : 0,
    isLstRowAttr: lastRowAttr !== undefined && lastRowAttr === "1" ? 1 : 0,
    isLstColAttr: lastColAttr !== undefined && lastColAttr === "1" ? 1 : 0,
    isBandRowAttr: bandRowAttr !== undefined && bandRowAttr === "1" ? 1 : 0,
    isBandColAttr: bandColAttr !== undefined && bandColAttr === "1" ? 1 : 0,
  };

  const tbleStyleId =
    getTblPr !== undefined ? getTextByPathList<string>(getTblPr, ["a:tableStyleId"]) : undefined;
  const thisTblStyle = getTableStyleById(tbleStyleId, tableStyles, tblStylAttrObj);
  if (thisTblStyle !== undefined) {
    warpContext["thisTbiStyle"] = thisTblStyle;
  }
  const tblStyl =
    thisTblStyle !== undefined
      ? getTextByPathList<XmlNode>(thisTblStyle, ["a:wholeTbl", "a:tcStyle"])
      : undefined;
  const tblBorderStyl =
    tblStyl !== undefined ? getTextByPathList<XmlNode>(tblStyl, ["a:tcBdr"]) : undefined;
  let tbl_borders = "";
  if (tblBorderStyl !== undefined) {
    tbl_borders = getTableBorders(tblBorderStyl, warpContext);
  }
  let tbl_bgcolor = "";
  let tbl_bgFillschemeClr =
    thisTblStyle !== undefined
      ? getTextByPathList<XmlNode>(thisTblStyle, ["a:tblBg", "a:fillRef"])
      : undefined;
  //console.log( "thisTblStyle:", thisTblStyle, "warpContext:", warpContext)
  if (tbl_bgFillschemeClr !== undefined) {
    tbl_bgcolor = getSolidFill(tbl_bgFillschemeClr, undefined, undefined, warpContext);
  }
  if (tbl_bgFillschemeClr === undefined && thisTblStyle !== undefined) {
    tbl_bgFillschemeClr = getTextByPathList<XmlNode>(thisTblStyle, [
      "a:wholeTbl",
      "a:tcStyle",
      "a:fill",
      "a:solidFill",
    ]);
    tbl_bgcolor = getSolidFill(tbl_bgFillschemeClr, undefined, undefined, warpContext);
  }
  if (tbl_bgcolor !== "") {
    tbl_bgcolor = "background-color: #" + tbl_bgcolor + ";";
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  let tableHtml =
    "<table " +
    tblDir +
    " style='border-collapse: collapse;" +
    getPosition(xfrmNode, node, undefined, undefined, undefined, emuToPx) +
    getSize(xfrmNode, undefined, undefined, emuToPx) +
    " z-index: " +
    order +
    ";" +
    tbl_borders +
    ";" +
    tbl_bgcolor +
    "'>";

  const trNodesValue = tableNode ? tableNode["a:tr"] : undefined;
  const trNodes = Array.isArray(trNodesValue) ? trNodesValue : trNodesValue ? [trNodesValue] : [];
  //multi rows
  let rowSpanAry: number[] = [];
  for (let i = 0; i < trNodes.length; i++) {
    //////////////rows Style ////////////Amir
    const rowHeightParam = trNodes[i]["attrs"]["h"];
    let rowHeight = 0;
    let rowsStyl = "";
    if (rowHeightParam !== undefined) {
      rowHeight = parseInt(rowHeightParam) * emuToPx;
      rowsStyl += "height:" + rowHeight + "px;";
    }
    // Get row styling based on position and table style attributes
    const rowStyle = getTableRowStyle(i, trNodes.length, tblStylAttrObj, thisTblStyle, warpContext);
    const fillColor = rowStyle.fillColor;
    const row_borders = rowStyle.row_borders;
    const fontClrPr = rowStyle.fontClrPr;
    const fontWeight = rowStyle.fontWeight;
    rowsStyl += row_borders !== undefined ? row_borders : "";
    rowsStyl += fontClrPr !== undefined ? " color: #" + fontClrPr + ";" : "";
    rowsStyl += fontWeight !== "" ? " font-weight:" + fontWeight + ";" : "";
    if (fillColor !== undefined && fillColor !== "") {
      //rowsStyl += "background-color: rgba(" + hexToRgbNew(fillColor) + "," + colorOpacity + ");";
      rowsStyl += "background-color: #" + fillColor + ";";
    }
    tableHtml += "<tr style='" + rowsStyl + "'>";
    ////////////////////////////////////////////////

    const tcNodesValue = trNodes[i]["a:tc"];
    const tcNodes = Array.isArray(tcNodesValue) ? tcNodesValue : tcNodesValue ? [tcNodesValue] : [];
    if (tcNodes.length > 0) {
      if (tcNodes.length > 1) {
        //multi columns
        let j = 0;
        if (rowSpanAry.length === 0) {
          rowSpanAry = Array.apply(null, Array(tcNodes.length)).map(function () {
            return 0;
          });
        }
        let totalColSpan = 0;
        while (j < tcNodes.length) {
          if (rowSpanAry[j] === 0 && totalColSpan === 0) {
            let a_sorce;
            //j=0 : first col
            if (j === 0 && tblStylAttrObj["isFrstColAttr"] === 1) {
              a_sorce = "a:firstCol";
              if (
                tblStylAttrObj["isLstRowAttr"] === 1 &&
                i === trNodes.length - 1 &&
                getTextByPathList(thisTblStyle, ["a:seCell"]) !== undefined
              ) {
                a_sorce = "a:seCell";
              } else if (
                tblStylAttrObj["isFrstRowAttr"] === 1 &&
                i === 0 &&
                getTextByPathList(thisTblStyle, ["a:neCell"]) !== undefined
              ) {
                a_sorce = "a:neCell";
              }
            } else if (
              j > 0 &&
              tblStylAttrObj["isBandColAttr"] === 1 &&
              !(tblStylAttrObj["isFrstColAttr"] === 1 && i === 0) &&
              !(tblStylAttrObj["isLstRowAttr"] === 1 && i === trNodes.length - 1) &&
              j !== tcNodes.length - 1
            ) {
              if (j % 2 !== 0) {
                let aBandNode = getTextByPathList(thisTblStyle, ["a:band2V"]);
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

            if (j === tcNodes.length - 1 && tblStylAttrObj["isLstColAttr"] === 1) {
              a_sorce = "a:lastCol";
              if (
                tblStylAttrObj["isLstRowAttr"] === 1 &&
                i === trNodes.length - 1 &&
                getTextByPathList(thisTblStyle, ["a:swCell"]) !== undefined
              ) {
                a_sorce = "a:swCell";
              } else if (
                tblStylAttrObj["isFrstRowAttr"] === 1 &&
                i === 0 &&
                getTextByPathList(thisTblStyle, ["a:nwCell"]) !== undefined
              ) {
                a_sorce = "a:nwCell";
              }
            }

            const cellParmAry = await getTableCellParams(
              tcNodes[j] as XmlNode,
              getColsGrid,
              i,
              j,
              thisTblStyle,
              a_sorce,
              warpContext,
              firstLineBreak,
              styleTable,
              rtlLanguages,
              emuToPx,
              fontSizeScale
            );
            const text = cellParmAry[0];
            const colStyl = cellParmAry[1];
            const cssName = cellParmAry[2];
            const rowSpan = cellParmAry[3];
            const colSpan = cellParmAry[4];

            if (rowSpan !== undefined) {
              rowSpanAry[j] = parseInt(rowSpan) - 1;
              tableHtml +=
                "<td class='" +
                cssName +
                "' data-row='" +
                i +
                "," +
                j +
                "' rowspan ='" +
                parseInt(rowSpan) +
                "' style='" +
                colStyl +
                "'>" +
                text +
                "</td>";
            } else if (colSpan !== undefined) {
              tableHtml +=
                "<td class='" +
                cssName +
                "' data-row='" +
                i +
                "," +
                j +
                "' colspan = '" +
                parseInt(colSpan) +
                "' style='" +
                colStyl +
                "'>" +
                text +
                "</td>";
              totalColSpan = parseInt(colSpan) - 1;
            } else {
              tableHtml +=
                "<td class='" +
                cssName +
                "' data-row='" +
                i +
                "," +
                j +
                "' style = '" +
                colStyl +
                "'>" +
                text +
                "</td>";
            }
          } else {
            if (rowSpanAry[j] !== 0) {
              rowSpanAry[j] -= 1;
            }
            if (totalColSpan !== 0) {
              totalColSpan--;
            }
          }
          j++;
        }
      } else {
        //single column

        let a_sorce;
        if (tblStylAttrObj["isFrstColAttr"] === 1 && !(tblStylAttrObj["isLstRowAttr"] === 1)) {
          a_sorce = "a:firstCol";
        } else if (
          tblStylAttrObj["isBandColAttr"] === 1 &&
          !(tblStylAttrObj["isLstRowAttr"] === 1)
        ) {
          let aBandNode = getTextByPathList(thisTblStyle, ["a:band2V"]);
          if (aBandNode === undefined) {
            aBandNode = getTextByPathList(thisTblStyle, ["a:band1V"]);
            if (aBandNode !== undefined) {
              a_sorce = "a:band2V";
            }
          } else {
            a_sorce = "a:band2V";
          }
        }

        if (tblStylAttrObj["isLstColAttr"] === 1 && !(tblStylAttrObj["isLstRowAttr"] === 1)) {
          a_sorce = "a:lastCol";
        }

        const cellParmAry = await getTableCellParams(
          tcNodes[0] as XmlNode,
          getColsGrid,
          i,
          undefined,
          thisTblStyle,
          a_sorce,
          warpContext,
          firstLineBreak,
          styleTable,
          rtlLanguages,
          emuToPx,
          fontSizeScale
        );
        const text = cellParmAry[0];
        const colStyl = cellParmAry[1];
        const cssName = cellParmAry[2];
        const rowSpan = cellParmAry[3];

        if (rowSpan !== undefined) {
          tableHtml +=
            "<td  class='" +
            cssName +
            "' rowspan='" +
            parseInt(rowSpan) +
            "' style = '" +
            colStyl +
            "'>" +
            text +
            "</td>";
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
