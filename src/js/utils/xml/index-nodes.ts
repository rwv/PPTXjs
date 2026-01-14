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
  const firstContent = contentKeys.length > 0 ? content[contentKeys[0]] : undefined;
  const shapeTreeNode =
    firstContent && typeof firstContent === "object"
      ? ((firstContent["p:cSld"] as XmlNode | undefined)?.["p:spTree"] as
          | Record<string, XmlNode | XmlNode[]>
          | undefined)
      : undefined;

  const idTable: Record<string, XmlNode> = {};
  const idxTable: Record<string, XmlNode> = {};
  const typeTable: Record<string, XmlNode> = {};

  if (!shapeTreeNode || typeof shapeTreeNode !== "object") {
    return { idTable, idxTable, typeTable };
  }

  const addShapeNode = (node: XmlNode): void => {
    const nonVisualPropertiesNode = node["p:nvSpPr"];
    if (
      !nonVisualPropertiesNode ||
      typeof nonVisualPropertiesNode !== "object" ||
      Array.isArray(nonVisualPropertiesNode)
    ) {
      return;
    }
    const shapeId = getTextByPathList<string>({
      node: nonVisualPropertiesNode as XmlNode,
      path: ["p:cNvPr", "attrs", "id"],
    });
    const placeholderIndex = getTextByPathList<string>({
      node: nonVisualPropertiesNode as XmlNode,
      path: ["p:nvPr", "p:ph", "attrs", "idx"],
    });
    const placeholderType = getTextByPathList<string>({
      node: nonVisualPropertiesNode as XmlNode,
      path: ["p:nvPr", "p:ph", "attrs", "type"],
    });

    if (shapeId !== undefined) {
      idTable[shapeId] = node;
    }
    if (placeholderIndex !== undefined) {
      idxTable[placeholderIndex] = node;
    }
    if (placeholderType !== undefined) {
      typeTable[placeholderType] = node;
    }
  };

  for (const nodeKey of Object.keys(shapeTreeNode)) {
    if (nodeKey === "p:nvGrpSpPr" || nodeKey === "p:grpSpPr") {
      continue;
    }

    const shapeNode = shapeTreeNode[nodeKey];

    if (Array.isArray(shapeNode)) {
      for (const node of shapeNode) {
        if (node && typeof node === "object") {
          addShapeNode(node);
        }
      }
    } else if (shapeNode && typeof shapeNode === "object") {
      addShapeNode(shapeNode);
    }
  }

  return { idTable, idxTable, typeTable };
}
