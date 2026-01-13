import type { TXmlNode, TXmlSimplified, TXmlSimplifiedNode } from "./types";

let orderCounter = 1;

export const simplify = (nodes?: Array<TXmlNode | string>): TXmlSimplified => {
  const result: TXmlSimplifiedNode = {};
  if (nodes === undefined) {
    return {};
  }
  if (nodes.length === 1 && typeof nodes[0] === "string") {
    return nodes[0];
  }

  nodes.forEach((node) => {
    if (node && typeof node === "object") {
      const xmlNode = node as TXmlNode;
      if (!result[xmlNode.tagName]) {
        result[xmlNode.tagName] = [];
      }
      const simplified = simplify(xmlNode.children || []);
      (result[xmlNode.tagName] as TXmlSimplified[]).push(simplified);

      if (simplified && typeof simplified === "object") {
        const simplifiedNode = simplified as TXmlSimplifiedNode;
        if (xmlNode.attributes) {
          simplifiedNode.attrs = xmlNode.attributes;
        }
        if (simplifiedNode.attrs === undefined) {
          simplifiedNode.attrs = { order: orderCounter };
        } else {
          simplifiedNode.attrs.order = orderCounter;
        }
      }
      orderCounter += 1;
    }
  });

  for (const key in result) {
    const entry = result[key];
    if (Array.isArray(entry) && entry.length === 1) {
      result[key] = entry[0];
    }
  }
  return result;
};
