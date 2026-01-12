/**
 * Find table style definition by style ID
 *
 * Searches through the table styles list to find the matching style definition
 * and attaches style attribute flags to the result.
 *
 * @param styleId - Table style ID to look up
 * @param tableStyles - Table styles from presentation (a:tblStyleLst)
 * @param tblStylAttrObj - Table style attribute flags (firstRow, lastRow, etc.)
 * @returns Table style definition with attached attribute flags, or undefined
 */

import type { XmlAttrs, XmlNode } from "../../../types/pptx-xml";

type TableStyleAttrs = XmlAttrs & {
  styleId?: string;
};

type TableStyleNode = XmlNode & {
  attrs?: TableStyleAttrs;
};

type GetTableStyleByIdOptions = {
  styleId: string | undefined;
  tableStyles: Record<string, unknown> | undefined;
};

export function getTableStyleById({
  styleId,
  tableStyles,
}: GetTableStyleByIdOptions): TableStyleNode | undefined {
  if (styleId === undefined) {
    return undefined;
  }

  const tableStyleList = tableStyles?.["a:tblStyleLst"]?.["a:tblStyle"] as
    | TableStyleNode
    | Array<TableStyleNode>
    | undefined;
  if (tableStyleList === undefined) {
    return undefined;
  }

  let foundStyle: TableStyleNode | undefined = undefined;

  // Handle array of styles
  if (Array.isArray(tableStyleList)) {
    for (let index = 0; index < tableStyleList.length; index++) {
      if (tableStyleList[index].attrs?.styleId === styleId) {
        foundStyle = tableStyleList[index];
        break;
      }
    }
  }
  // Handle single style
  else {
    if (tableStyleList.attrs?.styleId === styleId) {
      foundStyle = tableStyleList;
    }
  }

  return foundStyle;
}
