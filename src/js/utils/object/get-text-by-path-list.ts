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
export function getTextByPathList<T = any>(
  node: unknown,
  path: Array<string | number>
): T | undefined {
  if (path.constructor !== Array) {
    throw Error("Error of path type! path is not array.");
  }

  if (node === undefined) {
    return undefined;
  }

  let current: unknown = node;
  const length = path.length;
  for (let i = 0; i < length; i++) {
    const record = current as Record<string | number, unknown>;
    current = record[path[i]];
    if (current === undefined) {
      return undefined;
    }
  }

  return current as T | undefined;
}
