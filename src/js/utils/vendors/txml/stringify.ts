import type { TXmlNode } from "./types";

export const stringify = (nodes: TXmlNode | Array<TXmlNode | string>): string => {
  let output = "";

  const writeChildren = (childNodes?: Array<TXmlNode | string>) => {
    if (!childNodes) {
      return;
    }
    for (const child of childNodes) {
      if (typeof child === "string") {
        output += child.trim();
      } else {
        writeNode(child);
      }
    }
  };

  const writeNode = (node: TXmlNode) => {
    output += `<${node.tagName}`;
    if (node.attributes) {
      for (const key in node.attributes) {
        const value = node.attributes[key];
        if (value === null) {
          output += ` ${key}`;
        } else if (value.indexOf('"') === -1) {
          output += ` ${key}="${value.trim()}"`;
        } else {
          output += ` ${key}='${value.trim()}'`;
        }
      }
    }
    output += ">";
    writeChildren(node.children);
    output += `</${node.tagName}>`;
  };

  if (Array.isArray(nodes)) {
    writeChildren(nodes);
  } else {
    writeNode(nodes);
  }

  return output;
};
