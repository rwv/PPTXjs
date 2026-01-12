import type { TXmlNode } from "./types";

export const toContentString = (node: TXmlNode | string | Array<TXmlNode | string>): string => {
  if (Array.isArray(node)) {
    let text = "";
    node.forEach((item) => {
      text += ` ${toContentString(item)}`;
      text = text.trim();
    });
    return text;
  }
  if (typeof node === "object") {
    return toContentString(node.children ?? []);
  }
  return ` ${node}`;
};
