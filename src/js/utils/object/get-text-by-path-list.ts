import { XmlNode } from "../../types/pptx-xml";
import { XmlValue } from "../../types/pptx-xml";

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
 * getTextByPathList(obj, ['a', 'b', 'c']); // 'value'
 * getTextByPathList(obj, ['a', 'x', 'y']); // undefined
 */
export function getTextByPathList<T extends XmlValue>(
  node: XmlNode,
  path: (keyof XmlNode)[]
): T | undefined {
  if (!Array.isArray(path)) {
    throw Error("Error of path type! path is not array.");
  }

  if (node === undefined) {
    return undefined;
  }

  let current: XmlValue = node;
  const length = path.length;
  for (let i = 0; i < length; i++) {
    const record = current;
    current = record[path[i]];
    if (current === undefined) {
      return undefined;
    }
  }

  return current as T | undefined;
}
