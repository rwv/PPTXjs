import type { TXmlNode } from "./types";

export const filter = (
  nodes: Array<TXmlNode | string>,
  predicate: (node: TXmlNode) => boolean
): TXmlNode[] => {
  let matches: TXmlNode[] = [];
  nodes.forEach((node) => {
    if (node && typeof node === "object") {
      const xmlNode = node as TXmlNode;
      if (predicate(xmlNode)) {
        matches.push(xmlNode);
      }
      if (xmlNode.children) {
        matches = matches.concat(filter(xmlNode.children, predicate));
      }
    }
  });
  return matches;
};
