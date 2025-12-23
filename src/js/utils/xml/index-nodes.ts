import { getTextByPathList } from "../object";

/**
 * Build ID, index, and type lookup tables for slide nodes
 *
 * @param content - Slide XML content object
 * @returns Object with idTable, idxTable, and typeTable lookup maps
 */
export function indexNodes(content: any): { idTable: any; idxTable: any; typeTable: any } {
  const keys = Object.keys(content);
  // @ts-expect-error TS(2538): Type 'undefined' cannot be used as an index type.
  const spTreeNode = content[keys[0]]["p:cSld"]["p:spTree"];

  const idTable = {};
  const idxTable = {};
  const typeTable = {};

  for (const key in spTreeNode) {
    if (key == "p:nvGrpSpPr" || key == "p:grpSpPr") {
      continue;
    }

    const targetNode = spTreeNode[key];

    if (targetNode.constructor === Array) {
      for (let i = 0; i < targetNode.length; i++) {
        var nvSpPrNode = targetNode[i]["p:nvSpPr"];
        var id = getTextByPathList(nvSpPrNode, ["p:cNvPr", "attrs", "id"]);
        var idx = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "idx"]);
        var type = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "type"]);

        if (id !== undefined) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          idTable[id] = targetNode[i];
        }
        if (idx !== undefined) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          idxTable[idx] = targetNode[i];
        }
        if (type !== undefined) {
          // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          typeTable[type] = targetNode[i];
        }
      }
    } else {
      var nvSpPrNode = targetNode["p:nvSpPr"];
      var id = getTextByPathList(nvSpPrNode, ["p:cNvPr", "attrs", "id"]);
      var idx = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "idx"]);
      var type = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "type"]);

      if (id !== undefined) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        idTable[id] = targetNode;
      }
      if (idx !== undefined) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        idxTable[idx] = targetNode;
      }
      if (type !== undefined) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        typeTable[type] = targetNode;
      }
    }
  }

  return { idTable: idTable, idxTable: idxTable, typeTable: typeTable };
}
