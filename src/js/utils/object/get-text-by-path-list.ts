import type { XmlNode, XmlValue } from "../../types/pptx-xml";

type GetTextByPathListOptions = {
  node: XmlNode | undefined;
  path: readonly (string | number)[];
};

/**
 * Get value from nested object by path array
 *
 * @param node - The object to traverse
 * @param path - Array of keys representing the path to the value
 * @returns The value at the path, or undefined if not found
 * @throws Error if path is not an array
 *
 * @example
 * const obj = { a: { b: { c: 'value' } } };
 * getTextByPathList({ node: obj, path: ['a', 'b', 'c'] }); // 'value'
 * getTextByPathList({ node: obj, path: ['a', 'x', 'y'] }); // undefined
 */
export function getTextByPathList<T extends XmlValue>({
  node,
  path,
}: GetTextByPathListOptions): T | undefined {
  if (!Array.isArray(path)) {
    throw Error("Error of path type! path is not array.");
  }

  if (node === undefined) {
    return undefined;
  }

  let current: XmlValue = node;
  const length = path.length;
  for (let i = 0; i < length; i++) {
    if (current === undefined || current === null) {
      return undefined;
    }
    if (typeof current !== "object") {
      return undefined;
    }

    const key = path[i];
    if (Array.isArray(current)) {
      const index = typeof key === "number" ? key : Number(key);
      if (!Number.isInteger(index)) {
        return undefined;
      }
      current = current[index];
      continue;
    }

    const record = current as XmlNode;
    current = record[key as keyof XmlNode];
  }

  return current as T | undefined;
}
