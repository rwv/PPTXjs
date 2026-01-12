import { getTextByPathList } from "../object";
import type { XmlNode } from "../../types/pptx-xml";

type IndexNodesOptions = {
  content: Record<string, XmlNode>;
};

/**
 * Build ID, index, and type lookup tables for slide nodes
 *
 * @param content - Slide XML content object
 * @returns Object with idTable, idxTable, and typeTable lookup maps
 */
export function indexNodes({ content }: IndexNodesOptions): {
  idTable: Record<string, XmlNode>;
  idxTable: Record<string, XmlNode>;
  typeTable: Record<string, XmlNode>;
} {
  const contentKeys = Object.keys(content);
  const shapeTreeNode = (content[contentKeys[0]]["p:cSld"] as XmlNode)["p:spTree"] as Record<
    string,
    XmlNode | XmlNode[]
  >;

  const idTable: Record<string, XmlNode> = {};
  const idxTable: Record<string, XmlNode> = {};
  const typeTable: Record<string, XmlNode> = {};

  for (const nodeKey in shapeTreeNode) {
    if (nodeKey === "p:nvGrpSpPr" || nodeKey === "p:grpSpPr") {
      continue;
    }

    const shapeNode = shapeTreeNode[nodeKey];

    if (Array.isArray(shapeNode)) {
      for (let nodeIndex = 0; nodeIndex < shapeNode.length; nodeIndex += 1) {
        const nonVisualPropertiesNode = (shapeNode[nodeIndex] as XmlNode)["p:nvSpPr"] as XmlNode;
        const shapeId = getTextByPathList<string>({
          node: nonVisualPropertiesNode,
          path: ["p:cNvPr", "attrs", "id"],
        });
        const placeholderIndex = getTextByPathList<string>({
          node: nonVisualPropertiesNode,
          path: ["p:nvPr", "p:ph", "attrs", "idx"],
        });
        const placeholderType = getTextByPathList<string>({
          node: nonVisualPropertiesNode,
          path: ["p:nvPr", "p:ph", "attrs", "type"],
        });

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
      const shapeId = getTextByPathList<string>({
        node: nonVisualPropertiesNode,
        path: ["p:cNvPr", "attrs", "id"],
      });
      const placeholderIndex = getTextByPathList<string>({
        node: nonVisualPropertiesNode,
        path: ["p:nvPr", "p:ph", "attrs", "idx"],
      });
      const placeholderType = getTextByPathList<string>({
        node: nonVisualPropertiesNode,
        path: ["p:nvPr", "p:ph", "attrs", "type"],
      });

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
