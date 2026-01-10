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

type TableStyleAttrs = {
  styleId?: string;
  [key: string]: unknown;
};

type TableStyleNode = {
  attrs?: TableStyleAttrs;
  [key: string]: unknown;
};

export function getTableStyleById(
  styleId: string | undefined,
  tableStyles: Record<string, unknown> | undefined,
  tblStylAttrObj: Record<string, unknown>
): TableStyleNode | undefined {
  if (styleId === undefined) {
    return undefined;
  }

  const tbleStylList = tableStyles?.["a:tblStyleLst"]?.["a:tblStyle"] as
    | TableStyleNode
    | Array<TableStyleNode>
    | undefined;
  if (tbleStylList === undefined) {
    return undefined;
  }

  let foundStyle: TableStyleNode | undefined = undefined;

  // Handle array of styles
  if (Array.isArray(tbleStylList)) {
    for (let k = 0; k < tbleStylList.length; k++) {
      if (tbleStylList[k].attrs?.styleId === styleId) {
        foundStyle = tbleStylList[k];
        break;
      }
    }
  }
  // Handle single style
  else {
    if (tbleStylList.attrs?.styleId === styleId) {
      foundStyle = tbleStylList;
    }
  }

  // Attach style attributes to the found style
  if (foundStyle !== undefined) {
    foundStyle["tblStylAttrObj"] = tblStylAttrObj;
  }

  return foundStyle;
}
