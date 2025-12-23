import type { PptxNode, PathList } from "../../types";

/**
 * Get value from nested object by path array
 *
 * @param node - The object to traverse (typically a PPTX XML node)
 * @param path - Array of keys representing the path to the value
 * @returns The value at the path, or undefined if not found
 * @throws Error if path is not an array
 *
 * @example
 * const obj = { a: { b: { c: 'value' } } };
 * getTextByPathList(obj, ['a', 'b', 'c']); // 'value'
 * getTextByPathList(obj, ['a', 'x', 'y']); // undefined
 *
 * @note Return type is `any` because XML structure is highly dynamic.
 * Returned values can be string, number, object, array, or undefined.
 */
export function getTextByPathList(node: PptxNode, path: PathList): any {
  if (path.constructor !== Array) {
    throw Error("Error of path type! path is not array.");
  }

  if (node === undefined) {
    return undefined;
  }

  const length: number = path.length;
  for (let i = 0; i < length; i++) {
    node = node[path[i]];
    if (node === undefined) {
      return undefined;
    }
  }

  return node;
}
