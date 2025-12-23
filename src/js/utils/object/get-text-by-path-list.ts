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
export function getTextByPathList(node: any, path: (string | number)[]): any {
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
