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
 * @param tableStyleFlags - Table style attribute flags
 * @param tableStyle - Table style definition
 * @param warpContext - Warp object containing slide resources
 * @returns Row style properties (fillColor, borders, fontColor, fontWeight)
 */

import { getTextByPathList } from "../../object";
import { getSolidFill } from "../../color";
import { getTableBorders } from "../../border";
import type { WarpContext, XmlNode } from "../../../types/pptx-xml";

export interface TableRowStyle {
  fillColor: string;
  row_borders: string | undefined;
  fontClrPr: string;
  fontWeight: string;
  band_1H_fillColor?: string;
  band_2H_fillColor?: string;
}

type TableStyleAttrFlags = {
  isFrstRowAttr?: number;
  isBandRowAttr?: number;
  isLstRowAttr?: number;
  [key: string]: unknown;
};

type GetTableRowStyleOptions = {
  rowIndex: number;
  totalRows: number;
  tableStyleFlags: TableStyleAttrFlags;
  tableStyle: XmlNode | undefined;
  warpContext: WarpContext;
};

export function getTableRowStyle({
  rowIndex,
  totalRows,
  tableStyleFlags,
  tableStyle,
  warpContext,
}: GetTableRowStyleOptions): TableRowStyle {
  let fillColor = "";
  let rowBorders: string | undefined = "";
  let fontColor = "";
  let fontWeight = "";
  let band1FillColor: string | undefined;
  let band2FillColor: string | undefined;

  // Helper function to apply style from a path
  const applyStyleFromPath = (basePath: string[]) => {
    // Get background fill color
    const backgroundFillNode = getTextByPathList<XmlNode>({
      node: tableStyle as XmlNode,
      path: [...basePath, "a:tcStyle", "a:fill", "a:solidFill"],
    });
    if (backgroundFillNode !== undefined) {
      const resolvedFillColor = getSolidFill({
        fillNode: backgroundFillNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      });
      if (resolvedFillColor !== undefined) {
        fillColor = resolvedFillColor;
      }
    }

    // Get border styling
    const borderStyleNode = getTextByPathList<XmlNode>({
      node: tableStyle as XmlNode,
      path: [...basePath, "a:tcStyle", "a:tcBdr"],
    });
    if (borderStyleNode !== undefined) {
      const resolvedRowBorders = getTableBorders({ tableBorderNode: borderStyleNode, warpContext });
      if (resolvedRowBorders !== "") {
        rowBorders = resolvedRowBorders;
      }
    }

    // Get font color
    const rowTextStyleNode = getTextByPathList<XmlNode>({
      node: tableStyle as XmlNode,
      path: [...basePath, "a:tcTxStyle"],
    });
    if (rowTextStyleNode !== undefined) {
      const resolvedFontColor = getSolidFill({
        fillNode: rowTextStyleNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      });
      if (resolvedFontColor !== undefined) {
        fontColor = resolvedFontColor;
      }

      // Get font weight
      const resolvedFontWeight =
        getTextByPathList<string>({ node: rowTextStyleNode, path: ["attrs", "b"] }) === "on"
          ? "bold"
          : "";
      if (resolvedFontWeight !== "") {
        fontWeight = resolvedFontWeight;
      }
    }
  };

  // Apply wholeTbl default styling
  if (tableStyle !== undefined && tableStyle["a:wholeTbl"] !== undefined) {
    applyStyleFromPath(["a:wholeTbl"]);
  }

  // Apply firstRow styling
  if (rowIndex === 0 && tableStyleFlags.isFrstRowAttr === 1 && tableStyle !== undefined) {
    applyStyleFromPath(["a:firstRow"]);
  }
  // Apply banded row styling (skip first row if firstRow styling is applied)
  else if (rowIndex > 0 && tableStyleFlags.isBandRowAttr === 1 && tableStyle !== undefined) {
    fillColor = "";
    rowBorders = undefined;

    // Even rows - band2H
    if (rowIndex % 2 === 0 && tableStyle["a:band2H"] !== undefined) {
      applyStyleFromPath(["a:band2H"]);
      band2FillColor = fillColor;
    }
    // Odd rows - band1H
    else if (rowIndex % 2 !== 0 && tableStyle["a:band1H"] !== undefined) {
      applyStyleFromPath(["a:band1H"]);
      band1FillColor = fillColor;
    }
  }

  // Apply lastRow styling (overrides previous styling)
  if (
    rowIndex === totalRows - 1 &&
    tableStyleFlags.isLstRowAttr === 1 &&
    tableStyle !== undefined
  ) {
    applyStyleFromPath(["a:lastRow"]);
  }

  return {
    fillColor,
    row_borders: rowBorders,
    fontClrPr: fontColor,
    fontWeight,
    band_1H_fillColor: band1FillColor,
    band_2H_fillColor: band2FillColor,
  };
}
