import type { PptxNode } from "../../types";

/**
 * Execute a function on each element, handling both single elements and arrays
 *
 * @param node - The element or array of elements to process
 * @param doFunction - Function to execute on each element, receives (element, index)
 * @returns Concatenated string result from all function executions
 *
 * @example
 * eachElement([1, 2, 3], (item, i) => `${i}:${item} `); // "0:1 1:2 2:3 "
 * eachElement(5, (item) => `value:${item}`); // "value:5"
 */
export function eachElement(
  node: PptxNode | PptxNode[],
  doFunction: (element: PptxNode, index: number) => string
): string {
  if (node === undefined) {
    return "";
  }

  let result = "";
  if (node.constructor === Array) {
    const length = node.length;
    for (let i = 0; i < length; i++) {
      result += doFunction(node[i], i);
    }
  } else {
    result += doFunction(node, 0);
  }

  return result;
}
