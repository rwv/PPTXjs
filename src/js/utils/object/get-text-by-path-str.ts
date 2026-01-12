import { getTextByPathList } from "./get-text-by-path-list";
import type { XmlNode, XmlValue } from "../../types/pptx-xml";

/**
 * Get value from nested object by path string
 *
 * @param node - The object to traverse
 * @param pathStr - Space-separated string representing the path to the value
 * @returns The value at the path, or undefined if not found
 *
 * @example
 * const obj = { a: { b: { c: 'value' } } };
 * getTextByPathStr(obj, 'a b c'); // 'value'
 * getTextByPathStr(obj, 'a  b  c'); // 'value' (multiple spaces)
 */
export function getTextByPathStr(node: XmlNode | undefined, pathStr: string): XmlValue | undefined {
  if (!node) {
    return undefined;
  }
  return getTextByPathList(node, pathStr.trim().split(/\s+/));
}
