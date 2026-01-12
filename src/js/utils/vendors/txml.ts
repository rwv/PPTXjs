/**
 * Lightweight XML parser adapted from the original tXml implementation.
 *
 * Exposes a single entry function plus helper utilities on the function:
 * - tXml.simplify
 * - tXml.filter
 * - tXml.stringify
 * - tXml.toContentString
 * - tXml.getElementById
 * - tXml.getElementsByClassName
 * - tXml.parseStream
 */

type TXmlAttributeValue = string | null;

type TXmlAttributes = Record<string, TXmlAttributeValue>;

export type TXmlNode = {
  tagName: string;
  attributes?: TXmlAttributes;
  children?: Array<TXmlNode | string>;
};

export type TXmlOptions = {
  pos?: number;
  attrName?: string;
  attrValue?: string;
  simplify?: boolean | number;
  filter?: (node: TXmlNode) => boolean;
  parseNode?: boolean;
};

export type TXmlInput = {
  xml: string;
  options?: TXmlOptions;
};

type TXmlResult = any;

type TXmlFunction = ((input: TXmlInput) => TXmlResult) & {
  simplify: (nodes?: Array<TXmlNode | string>) => any;
  filter: (nodes: Array<TXmlNode | string>, predicate: (node: TXmlNode) => boolean) => TXmlNode[];
  stringify: (nodes: TXmlNode | Array<TXmlNode | string>) => string;
  toContentString: (node: TXmlNode | string | Array<TXmlNode | string>) => string;
  getElementById: (xml: string, id: string, simplify?: boolean | number) => any;
  getElementsByClassName: (xml: string, className: string, simplify?: boolean | number) => any;
  parseStream: (source: unknown, offsetOrCallback?: unknown) => unknown;
};

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

export const tXml: TXmlFunction = (({ xml, options = {} }) => {
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
    result = tXml.filter(nodes, options.filter);
  }

  if (options.simplify) {
    const nodes = Array.isArray(result) ? result : result ? [result] : [];
    result = tXml.simplify(nodes);
  }

  if (result && typeof result === "object") {
    result.pos = cursor;
  }

  return result;
}) as TXmlFunction;

let orderCounter = 1;

tXml.simplify = function simplify(nodes?: Array<TXmlNode | string>): any {
  const result: Record<string, unknown> = {};
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
      const simplified = tXml.simplify(xmlNode.children || []);
      (result[xmlNode.tagName] as unknown[]).push(simplified);

      if (simplified && typeof simplified === "object") {
        const simplifiedNode = simplified as { attrs?: Record<string, unknown> };
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

tXml.filter = function filter(
  nodes: Array<TXmlNode | string>,
  predicate: (node: TXmlNode) => boolean
): TXmlNode[] {
  let matches: TXmlNode[] = [];
  nodes.forEach((node) => {
    if (node && typeof node === "object") {
      const xmlNode = node as TXmlNode;
      if (predicate(xmlNode)) {
        matches.push(xmlNode);
      }
      if (xmlNode.children) {
        matches = matches.concat(tXml.filter(xmlNode.children, predicate));
      }
    }
  });
  return matches;
};

tXml.stringify = function stringify(nodes: TXmlNode | Array<TXmlNode | string>): string {
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

tXml.toContentString = function toContentString(
  node: TXmlNode | string | Array<TXmlNode | string>
): string {
  if (Array.isArray(node)) {
    let text = "";
    node.forEach((item) => {
      text += ` ${tXml.toContentString(item)}`;
      text = text.trim();
    });
    return text;
  }
  if (typeof node === "object") {
    return tXml.toContentString(node.children ?? []);
  }
  return ` ${node}`;
};

tXml.getElementById = function getElementById(
  xml: string,
  id: string,
  simplify?: boolean | number
): any {
  const result = tXml({ xml, options: { attrValue: id, simplify } });
  return simplify ? result : result[0];
};

tXml.getElementsByClassName = function getElementsByClassName(
  xml: string,
  className: string,
  simplify?: boolean | number
): any {
  return tXml({
    xml,
    options: {
      attrName: "class",
      attrValue: `[a-zA-Z0-9-s ]*${className}[a-zA-Z0-9-s ]*`,
      simplify,
    },
  });
};

tXml.parseStream = function parseStream(source: unknown, offsetOrCallback?: unknown): unknown {
  let offset = 0;
  let callback: ((node: TXmlNode) => void) | undefined;

  if (typeof offsetOrCallback === "function") {
    callback = offsetOrCallback as (node: TXmlNode) => void;
  } else if (typeof offsetOrCallback === "string") {
    offset = offsetOrCallback.length + 2;
  } else if (typeof offsetOrCallback === "number") {
    offset = offsetOrCallback;
  }

  let stream: any = source;
  if (typeof source === "string") {
    const requireFn = (globalThis as { require?: (id: string) => any }).require;
    if (!requireFn) {
      throw new Error("parseStream requires Node.js stream support.");
    }
    const fs = requireFn("fs") as {
      createReadStream: (path: string, options: { start: number }) => any;
    };
    stream = fs.createReadStream(source, { start: offset });
    offset = 0;
  }

  let cursor = offset;
  let buffer = "";
  const decoder = typeof TextDecoder !== "undefined" ? new TextDecoder() : null;

  stream.on("data", (chunk: string | Uint8Array) => {
    buffer += typeof chunk === "string" ? chunk : decoder ? decoder.decode(chunk) : String(chunk);

    for (let last = 0; ; ) {
      cursor = buffer.indexOf("<", cursor) + 1;
      const node = tXml({ xml: buffer, options: { pos: cursor, parseNode: true } });
      const nextPos = (node as { pos?: number }).pos ?? cursor;
      cursor = nextPos;

      if (cursor > buffer.length - 1 || last > cursor) {
        if (last) {
          buffer = buffer.slice(last);
          cursor = 0;
          last = 0;
        }
        return;
      }

      stream.emit("xml", node);
      if (callback) {
        callback(node as TXmlNode);
      }
      last = cursor;
    }
  });

  stream.on("end", () => {
    console.log("end");
  });

  return stream;
};
