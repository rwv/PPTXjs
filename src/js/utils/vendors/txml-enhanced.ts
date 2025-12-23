/**
 * Enhanced tXml wrapper with order tracking
 *
 * Based on official txml v5.x with custom order attribute support.
 * Uses closure to avoid global state pollution - each parse call
 * has its own independent order counter.
 */
// Import directly from txml subpath to avoid transformStream dependency
import {
  parse,
  filter,
  stringify,
  toContentString,
  getElementById,
  getElementsByClassName,
} from "txml/txml";
import type { tNode } from "txml/txml";

/**
 * Parse XML with optional simplify and order tracking.
 * Uses closure to avoid global state pollution.
 *
 * @param content - XML string to parse
 * @param options - Parse options
 * @param options.simplify - If truthy, simplify the output and add order attributes
 * @returns Parsed XML structure
 */
export function tXml(
  content: string,
  options?: { simplify?: number | boolean }
): any {
  const parsed = parse(content);

  if (options?.simplify) {
    // Closure variable - each tXml() call creates independent order context
    let order = 1;

    /**
     * Recursively simplify parsed nodes and add order tracking.
     * All recursive calls share the same order variable via closure.
     */
    function simplifyWithOrder(children: (tNode | string)[]): any {
      const out: Record<string, any> = {};

      // Handle edge cases (same as official txml.simplify)
      if (!children || !children.length) return "";
      if (children.length === 1 && typeof children[0] === "string") {
        return children[0];
      }

      children.forEach((child) => {
        if (typeof child !== "object") return;

        // Initialize tag array if not exists
        if (!out[child.tagName]) {
          out[child.tagName] = [];
        }

        // Recursively simplify children (uses same order closure)
        const kids = simplifyWithOrder(child.children || []);
        out[child.tagName].push(kids);

        // Add order attribute to object-type results
        if (typeof kids === "object" && !Array.isArray(kids)) {
          if (
            child.attributes &&
            Object.keys(child.attributes as object).length > 0
          ) {
            // Merge original attributes with order
            kids.attrs = { ...(child.attributes as object), order: order };
          } else {
            kids.attrs = { order: order };
          }
          order++;
        }
      });

      // Unwrap single-element arrays (same as official txml.simplify)
      for (const key in out) {
        if (out[key].length === 1) {
          out[key] = out[key][0];
        }
      }

      return out;
    }

    return simplifyWithOrder(parsed);
  }

  return parsed;
}

// Attach utilities to tXml for namespace-style access (backward compatibility)
tXml.filter = filter;
tXml.stringify = stringify;
tXml.toContentString = toContentString;
tXml.getElementById = getElementById;
tXml.getElementsByClassName = getElementsByClassName;

// Named exports for modern ES module usage
export {
  parse,
  filter,
  stringify,
  toContentString,
  getElementById,
  getElementsByClassName,
};
