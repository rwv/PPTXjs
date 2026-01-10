import { getTextByPathList } from "../object";

/**
 * Build ID, index, and type lookup tables for slide nodes
 *
 * @param content - Slide XML content object
 * @returns Object with idTable, idxTable, and typeTable lookup maps
 */
type XmlNode = Record<string, unknown>;

export function indexNodes(content: Record<string, XmlNode>): {
  idTable: Record<string, unknown>;
  idxTable: Record<string, unknown>;
  typeTable: Record<string, unknown>;
} {
  const keys = Object.keys(content);
  const spTreeNode = (content[keys[0]]["p:cSld"] as XmlNode)["p:spTree"] as Record<
    string,
    XmlNode | XmlNode[]
  >;

  const idTable: Record<string, unknown> = {};
  const idxTable: Record<string, unknown> = {};
  const typeTable: Record<string, unknown> = {};

  for (const key in spTreeNode) {
    if (key === "p:nvGrpSpPr" || key === "p:grpSpPr") {
      continue;
    }

    const targetNode = spTreeNode[key];

    if (Array.isArray(targetNode)) {
      for (let i = 0; i < targetNode.length; i++) {
        const nvSpPrNode = (targetNode[i] as XmlNode)["p:nvSpPr"] as XmlNode;
        const id = getTextByPathList<string>(nvSpPrNode, ["p:cNvPr", "attrs", "id"]);
        const idx = getTextByPathList<string>(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "idx"]);
        const type = getTextByPathList<string>(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "type"]);

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
      const nvSpPrNode = (targetNode as XmlNode)["p:nvSpPr"] as XmlNode;
      const id = getTextByPathList<string>(nvSpPrNode, ["p:cNvPr", "attrs", "id"]);
      const idx = getTextByPathList<string>(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "idx"]);
      const type = getTextByPathList<string>(nvSpPrNode, ["p:nvPr", "p:ph", "attrs", "type"]);

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
