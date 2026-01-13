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
type SetTextByPathListOptions = {
  node: Record<string | number, unknown> | undefined;
  path: readonly (string | number)[];
  value: unknown;
};

export function setTextByPathList({ node, path, value }: SetTextByPathListOptions): void {
  if (!Array.isArray(path)) {
    throw Error("Error of path type! path is not array.");
  }

  if (node === undefined) {
    return;
  }

  type NodeRecord = Record<string | number, unknown>;
  let currentNode = node as NodeRecord;
  const pathLength = path.length;
  for (let index = 0; index < pathLength; index += 1) {
    const pathKey = path[index];
    if (index === pathLength - 1) {
      currentNode[pathKey] = value;
      break;
    }
    const nextNode = currentNode[pathKey];
    if (!nextNode || typeof nextNode !== "object") {
      currentNode[pathKey] = {};
    }
    currentNode = currentNode[pathKey] as NodeRecord;
  }
}
