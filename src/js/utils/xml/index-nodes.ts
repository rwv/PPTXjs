import { getTextByPathList } from "../object";

/**
 * Build ID, index, and type lookup tables for slide nodes
 *
 * @param content - Slide XML content object
 * @returns Object with idTable, idxTable, and typeTable lookup maps
 */
export function indexNodes(content: any): {
  idTable: Record<string, unknown>;
  idxTable: Record<string, unknown>;
  typeTable: Record<string, unknown>;
} {
  const keys = Object.keys(content);
  const spTreeNode = content[keys[0]]["p:cSld"]["p:spTree"];

  const idTable: Record<string, unknown> = {};
  const idxTable: Record<string, unknown> = {};
  const typeTable: Record<string, unknown> = {};

  for (const key in spTreeNode) {
    if (key === "p:nvGrpSpPr" || key === "p:grpSpPr") {
      continue;
    }

    const targetNode = spTreeNode[key];

    if (targetNode.constructor === Array) {
      for (let i = 0; i < targetNode.length; i++) {
        const nvSpPrNode = targetNode[i]["p:nvSpPr"];
        const id = getTextByPathList(nvSpPrNode, ["p:cNvPr", "attrs", "id"]);
        const idx = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "idx"]);
        const type = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "type"]);

        if (id !== undefined) {
          idTable[id] = targetNode[i];
        }
        if (idx !== undefined) {
          idxTable[idx] = targetNode[i];
        }
        if (type !== undefined) {
          typeTable[type] = targetNode[i];
        }
      }
    } else {
      const nvSpPrNode = targetNode["p:nvSpPr"];
      const id = getTextByPathList(nvSpPrNode, ["p:cNvPr", "attrs", "id"]);
      const idx = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "idx"]);
      const type = getTextByPathList(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "type"]);

      if (id !== undefined) {
        idTable[id] = targetNode;
      }
      if (idx !== undefined) {
        idxTable[idx] = targetNode;
      }
      if (type !== undefined) {
        typeTable[type] = targetNode;
      }
    }
  }

  return { idTable: idTable, idxTable: idxTable, typeTable: typeTable };
}
