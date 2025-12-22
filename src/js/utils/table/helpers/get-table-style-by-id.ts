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

export function getTableStyleById(
  styleId: string | undefined,
  tableStyles: any,
  tblStylAttrObj: any
): any {
  if (styleId === undefined) {
    return undefined;
  }

  const tbleStylList = tableStyles?.["a:tblStyleLst"]?.["a:tblStyle"];
  if (tbleStylList === undefined) {
    return undefined;
  }

  let foundStyle: any = undefined;

  // Handle array of styles
  if (Array.isArray(tbleStylList)) {
    for (let k = 0; k < tbleStylList.length; k++) {
      if (tbleStylList[k]["attrs"]?.["styleId"] === styleId) {
        foundStyle = tbleStylList[k];
        break;
      }
    }
  }
  // Handle single style
  else {
    if (tbleStylList["attrs"]?.["styleId"] === styleId) {
      foundStyle = tbleStylList;
    }
  }

  // Attach style attributes to the found style
  if (foundStyle !== undefined) {
    foundStyle["tblStylAttrObj"] = tblStylAttrObj;
  }

  return foundStyle;
}
