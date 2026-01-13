import { filter } from "./filter";
import { simplify } from "./simplify";
import type { TXmlInput, TXmlNode, TXmlResult } from "./types";

const VOID_TAGS = new Set(["img", "br", "input", "meta", "link"]);
const NAME_END_CHARS = "\n\t>/= ";

const LT_CHAR = "<".charCodeAt(0);
const GT_CHAR = ">".charCodeAt(0);
const DASH_CHAR = "-".charCodeAt(0);
const SLASH_CHAR = "/".charCodeAt(0);
const EXCLAMATION_CHAR = "!".charCodeAt(0);
const SINGLE_QUOTE = "'".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);

const isAlpha = (code: number): boolean =>
  (code >= 65 && code <= 90) || (code >= 97 && code <= 122);

const isTXmlNode = (value: unknown): value is TXmlNode =>
  !!value && typeof value === "object" && "tagName" in (value as TXmlNode);

export const tXml = ({ xml, options = {} }: TXmlInput): TXmlResult => {
  let xmlText = xml;
  let cursor = options.pos ?? 0;

  const parseNodes = (): Array<TXmlNode | string> => {
    const nodes: Array<TXmlNode | string> = [];
    while (xmlText[cursor]) {
      if (xmlText.charCodeAt(cursor) === LT_CHAR) {
        const nextCode = xmlText.charCodeAt(cursor + 1);
        if (nextCode === SLASH_CHAR) {
          cursor = xmlText.indexOf(">", cursor);
          if (cursor + 1) {
            cursor += 1;
          }
          return nodes;
        }
        if (nextCode === EXCLAMATION_CHAR) {
          skipDeclaration();
          continue;
        }
        nodes.push(parseNode());
      } else {
        const text = parseText();
        if (text.trim().length > 0) {
          nodes.push(text);
        }
        cursor += 1;
      }
    }
    return nodes;
  };

  const parseText = (): string => {
    const start = cursor;
    let end = xmlText.indexOf("<", cursor);
    if (end === -1) {
      end = xmlText.length;
    }
    cursor = end - 1;
    return xmlText.slice(start, end);
  };

  const parseName = (): string => {
    const start = cursor;
    while (xmlText[cursor] && NAME_END_CHARS.indexOf(xmlText[cursor]) === -1) {
      cursor += 1;
    }
    return xmlText.slice(start, cursor);
  };

  const readAttributeValue = (): string => {
    const quote = xmlText[cursor];
    const start = (cursor += 1);
    const end = xmlText.indexOf(quote, start);
    if (end === -1) {
      cursor = -1;
      return "";
    }
    cursor = end;
    return xmlText.slice(start, end);
  };

  const skipDeclaration = (): void => {
    if (xmlText.charCodeAt(cursor + 2) === DASH_CHAR) {
      const end = xmlText.indexOf("-->", cursor + 4);
      cursor = end === -1 ? xmlText.length : end + 3;
      return;
    }
    const end = xmlText.indexOf(">", cursor + 2);
    cursor = end === -1 ? xmlText.length : end + 1;
  };

  const parseNode = (): TXmlNode => {
    const node: TXmlNode = { tagName: "" };
    cursor += 1;
    node.tagName = parseName();

    let hasAttributes = false;
    while (xmlText[cursor] && xmlText.charCodeAt(cursor) !== GT_CHAR) {
      const code = xmlText.charCodeAt(cursor);
      if (isAlpha(code)) {
        const attrName = parseName();
        let nextCode = xmlText.charCodeAt(cursor);
        while (
          nextCode &&
          nextCode !== SINGLE_QUOTE &&
          nextCode !== DOUBLE_QUOTE &&
          !isAlpha(nextCode) &&
          nextCode !== GT_CHAR
        ) {
          cursor += 1;
          nextCode = xmlText.charCodeAt(cursor);
        }

        if (!hasAttributes) {
          node.attributes = {};
          hasAttributes = true;
        }

        if (nextCode === SINGLE_QUOTE || nextCode === DOUBLE_QUOTE) {
          const value = readAttributeValue();
          if (cursor === -1) {
            return node;
          }
          node.attributes[attrName] = value;
        } else {
          node.attributes[attrName] = null;
          cursor -= 1;
        }
      }
      cursor += 1;
    }

    if (xmlText.charCodeAt(cursor - 1) !== SLASH_CHAR) {
      if (node.tagName === "script" || node.tagName === "style") {
        const closingTag = `</${node.tagName}>`;
        const contentStart = cursor + 1;
        const closeIndex = xmlText.indexOf(closingTag, cursor);
        if (closeIndex === -1) {
          node.children = [xmlText.slice(contentStart)];
          cursor = xmlText.length;
          return node;
        }
        node.children = [xmlText.slice(contentStart, closeIndex)];
        cursor = closeIndex + closingTag.length;
        return node;
      }

      if (!VOID_TAGS.has(node.tagName)) {
        cursor += 1;
        node.children = parseNodes();
      } else {
        cursor += 1;
      }
    } else {
      cursor += 1;
    }

    return node;
  };

  const findAttributeMatch = (): number => {
    const attrName = options.attrName ?? "id";
    const attrValue = options.attrValue ?? "";
    const pattern = new RegExp(`\\s${attrName}\\s*=['\"]${attrValue}['\"]`);
    const match = pattern.exec(xmlText);
    return match ? match.index : -1;
  };

  let result: TXmlResult;
  if (options.attrValue !== undefined) {
    const matches: TXmlNode[] = [];
    let matchIndex = findAttributeMatch();
    while (matchIndex !== -1) {
      cursor = xmlText.lastIndexOf("<", matchIndex);
      if (cursor !== -1) {
        matches.push(parseNode());
        xmlText = xmlText.slice(cursor);
        cursor = 0;
      }
      matchIndex = findAttributeMatch();
    }
    result = matches;
  } else {
    result = options.parseNode ? parseNode() : parseNodes();
  }

  if (options.filter) {
    const nodes = Array.isArray(result) ? result : result ? [result] : [];
    const filteredNodes = nodes.filter(
      (node): node is TXmlNode | string => typeof node === "string" || isTXmlNode(node)
    );
    result = filter(filteredNodes, options.filter);
  }

  if (options.simplify) {
    const nodes = Array.isArray(result) ? result : result ? [result] : [];
    const simplifiableNodes = nodes.filter(
      (node): node is TXmlNode | string => typeof node === "string" || isTXmlNode(node)
    );
    result = simplify(simplifiableNodes);
  }

  if (result && typeof result === "object") {
    (result as { pos?: number }).pos = cursor;
  }

  return result;
};
