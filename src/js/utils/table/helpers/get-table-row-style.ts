/**
 * Get table row styling based on position and table style attributes
 *
 * Handles row-level styling for:
 * - wholeTbl: Default styling for all cells
 * - firstRow: First row styling
 * - lastRow: Last row styling
 * - band1H/band2H: Alternating row bands (odd/even)
 *
 * @param rowIndex - Current row index (0-based)
 * @param totalRows - Total number of rows
 * @param tblStylAttrObj - Table style attribute flags
 * @param thisTblStyle - Table style definition
 * @param warpObj - Warp object containing slide resources
 * @returns Row style properties (fillColor, borders, fontColor, fontWeight)
 */

import type { PptxNode, WarpObject } from "../../../types";
import { getTextByPathList } from "../../object";
import { getSolidFill } from "../../color";
import { getTableBorders } from "../../border";

export interface TableRowStyle {
  fillColor: string;
  row_borders: string | undefined;
  fontClrPr: string;
  fontWeight: string;
  band_1H_fillColor?: string;
  band_2H_fillColor?: string;
}

export function getTableRowStyle(
  rowIndex: number,
  totalRows: number,
  tblStylAttrObj: Record<string, number>,
  thisTblStyle: PptxNode,
  warpObj: WarpObject
): TableRowStyle {
  let fillColor = "";
  let row_borders: string | undefined = "";
  let fontClrPr = "";
  let fontWeight = "";
  let band_1H_fillColor: string | undefined;
  let band_2H_fillColor: string | undefined;

  // Helper function to apply style from a path
  const applyStyleFromPath = (basePath: string[]) => {
    // Get background fill color
    const bgFillschemeClr = getTextByPathList(thisTblStyle, [
      ...basePath,
      "a:tcStyle",
      "a:fill",
      "a:solidFill",
    ]);
    if (bgFillschemeClr !== undefined) {
      const local_fillColor = getSolidFill(bgFillschemeClr, undefined, undefined, warpObj);
      if (local_fillColor !== undefined) {
        fillColor = local_fillColor;
      }
    }

    // Get border styling
    const borderStyl = getTextByPathList(thisTblStyle, [...basePath, "a:tcStyle", "a:tcBdr"]);
    if (borderStyl !== undefined) {
      const local_row_borders = getTableBorders(borderStyl, warpObj);
      if (local_row_borders !== "") {
        row_borders = local_row_borders;
      }
    }

    // Get font color
    const rowTxtStyl = getTextByPathList(thisTblStyle, [...basePath, "a:tcTxStyle"]);
    if (rowTxtStyl !== undefined) {
      const local_fontClrPr = getSolidFill(rowTxtStyl, undefined, undefined, warpObj);
      if (local_fontClrPr !== undefined) {
        fontClrPr = local_fontClrPr;
      }

      // Get font weight
      const local_fontWeight = getTextByPathList(rowTxtStyl, ["attrs", "b"]) === "on" ? "bold" : "";
      if (local_fontWeight !== "") {
        fontWeight = local_fontWeight;
      }
    }
  };

  // Apply wholeTbl default styling
  if (thisTblStyle !== undefined && thisTblStyle["a:wholeTbl"] !== undefined) {
    applyStyleFromPath(["a:wholeTbl"]);
  }

  // Apply firstRow styling
  if (rowIndex === 0 && tblStylAttrObj["isFrstRowAttr"] === 1 && thisTblStyle !== undefined) {
    applyStyleFromPath(["a:firstRow"]);
  }
  // Apply banded row styling (skip first row if firstRow styling is applied)
  else if (rowIndex > 0 && tblStylAttrObj["isBandRowAttr"] === 1 && thisTblStyle !== undefined) {
    fillColor = "";
    row_borders = undefined;

    // Even rows - band2H
    if (rowIndex % 2 === 0 && thisTblStyle["a:band2H"] !== undefined) {
      applyStyleFromPath(["a:band2H"]);
      band_2H_fillColor = fillColor;
    }
    // Odd rows - band1H
    else if (rowIndex % 2 !== 0 && thisTblStyle["a:band1H"] !== undefined) {
      applyStyleFromPath(["a:band1H"]);
      band_1H_fillColor = fillColor;
    }
  }

  // Apply lastRow styling (overrides previous styling)
  if (
    rowIndex === totalRows - 1 &&
    tblStylAttrObj["isLstRowAttr"] === 1 &&
    thisTblStyle !== undefined
  ) {
    applyStyleFromPath(["a:lastRow"]);
  }

  return {
    fillColor,
    row_borders,
    fontClrPr,
    fontWeight,
    band_1H_fillColor,
    band_2H_fillColor,
  };
}
