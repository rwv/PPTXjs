import { getTextByPathList } from "./get-text-by-path-list";

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
export function getTextByPathStr(node: any, pathStr: any): any {
  return getTextByPathList(node, pathStr.trim().split(/\s+/));
}
