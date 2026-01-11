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
  const contentKeys = Object.keys(content);
  const shapeTreeNode = (content[contentKeys[0]]["p:cSld"] as XmlNode)["p:spTree"] as Record<
    string,
    XmlNode | XmlNode[]
  >;

  const idTable: Record<string, unknown> = {};
  const idxTable: Record<string, unknown> = {};
  const typeTable: Record<string, unknown> = {};

  for (const nodeKey in shapeTreeNode) {
    if (nodeKey === "p:nvGrpSpPr" || nodeKey === "p:grpSpPr") {
      continue;
    }

    const shapeNode = shapeTreeNode[nodeKey];

    if (Array.isArray(shapeNode)) {
      for (let nodeIndex = 0; nodeIndex < shapeNode.length; nodeIndex += 1) {
        const nonVisualPropertiesNode = (shapeNode[nodeIndex] as XmlNode)["p:nvSpPr"] as XmlNode;
        const shapeId = getTextByPathList<string>(nonVisualPropertiesNode, [
          "p:cNvPr",
          "attrs",
          "id",
        ]);
        const placeholderIndex = getTextByPathList<string>(nonVisualPropertiesNode, [
          "p:nvPr",
          "p:ph",
          "attrs",
          "idx",
        ]);
        const placeholderType = getTextByPathList<string>(nonVisualPropertiesNode, [
          "p:nvPr",
          "p:ph",
          "attrs",
          "type",
        ]);

        if (shapeId !== undefined) {
          idTable[shapeId] = shapeNode[nodeIndex];
        }
        if (placeholderIndex !== undefined) {
          idxTable[placeholderIndex] = shapeNode[nodeIndex];
        }
        if (placeholderType !== undefined) {
          typeTable[placeholderType] = shapeNode[nodeIndex];
        }
      }
    } else {
      const nonVisualPropertiesNode = (shapeNode as XmlNode)["p:nvSpPr"] as XmlNode;
      const shapeId = getTextByPathList<string>(nonVisualPropertiesNode, [
        "p:cNvPr",
        "attrs",
        "id",
      ]);
      const placeholderIndex = getTextByPathList<string>(nonVisualPropertiesNode, [
        "p:nvPr",
        "p:ph",
        "attrs",
        "idx",
      ]);
      const placeholderType = getTextByPathList<string>(nonVisualPropertiesNode, [
        "p:nvPr",
        "p:ph",
        "attrs",
        "type",
      ]);

      if (shapeId !== undefined) {
        idTable[shapeId] = shapeNode;
      }
      if (placeholderIndex !== undefined) {
        idxTable[placeholderIndex] = shapeNode;
      }
      if (placeholderType !== undefined) {
        typeTable[placeholderType] = shapeNode;
      }
    }
  }

  return { idTable, idxTable, typeTable };
}
