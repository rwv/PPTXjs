/**
 * Set value in nested object by path array, creating intermediate objects as needed
 *
 * @param node - The object to modify
 * @param path - Array of keys representing the path to set the value
 * @param value - The value to set at the path
 * @returns undefined if node is undefined
 * @throws Error if path is not an array
 *
 * @example
 * const obj = {};
 * setTextByPathList(obj, ['a', 'b', 'c'], 'value');
 * // obj is now { a: { b: { c: 'value' } } }
 */
export function setTextByPathList(
  node: Record<string | number, unknown> | undefined,
  path: Array<string | number>,
  value: unknown
): void {
  if (path.constructor !== Array) {
    throw Error("Error of path type! path is not array.");
  }

  if (node === undefined) {
    return;
  }

  type NodeRecord = Record<string | number, unknown>;
  const target = node as NodeRecord & {
    set?: (parts: Array<string | number>, value: unknown) => unknown;
  };

  Reflect.defineProperty(target, "set", {
    value: function (this: NodeRecord, parts: Array<string | number>, value: unknown) {
      let currentNode: NodeRecord = this;
      const pathLength = parts.length;
      for (let index = 0; index < pathLength; index += 1) {
        const pathKey = parts[index];
        if (currentNode[pathKey] == null) {
          if (index === pathLength - 1) {
            currentNode[pathKey] = value;
          } else {
            currentNode[pathKey] = {};
          }
        }
        currentNode = currentNode[pathKey] as NodeRecord;
      }
      return currentNode;
    },
  });

  target.set?.(path, value);
}
