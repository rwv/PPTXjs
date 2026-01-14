/**
 * Execute a function on each element, handling both single elements and arrays
 *
 * @param node - The element or array of elements to process
 * @param callback - Function to execute on each element, receives (element, index)
 * @returns Concatenated string result from all function executions
 *
 * @example
 * eachElement([1, 2, 3], (item, i) => `${i}:${item} `); // "0:1 1:2 2:3 "
 * eachElement(5, (item) => `value:${item}`); // "value:5"
 */
type EachElementOptions<T> = {
  node: T | T[] | undefined;
  callback: (element: T, index: number) => string;
};

export function eachElement<T>({ node, callback }: EachElementOptions<T>): string {
  if (node === undefined || node === null) {
    return "";
  }

  let result = "";
  if (Array.isArray(node)) {
    const length = node.length;
    for (let i = 0; i < length; i++) {
      result += callback(node[i], i);
    }
  } else {
    result += callback(node, 0);
  }

  return result;
}
