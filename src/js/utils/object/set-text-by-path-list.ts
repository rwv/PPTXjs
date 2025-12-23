import type { PptxNode, PathList } from "../../types";

/**
 * Set value in nested object by path array, creating intermediate objects as needed
 *
 * @param node - The object to modify (typically a PPTX XML node)
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
export function setTextByPathList(node: PptxNode, path: PathList, value: any): void {
  if (path.constructor !== Array) {
    throw Error("Error of path type! path is not array.");
  }

  if (node === undefined) {
    return undefined;
  }

  Reflect.defineProperty(node, "set", {
    value: function (parts: PathList, value: any) {
      let obj: Record<string | number, any> = this;
      const len: number = parts.length;
      for (let i = 0; i < len; i++) {
        const p: string | number = parts[i];
        if (obj[p] === null) {
          if (i === len - 1) {
            obj[p] = value;
          } else {
            obj[p] = {};
          }
        }
        obj = obj[p];
      }
      return obj;
    },
  });

  node.set(path, value);
}
