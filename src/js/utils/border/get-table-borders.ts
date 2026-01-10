/**
 * Get table border styles for all sides
 *
 * @param node - The XML node containing border properties
 * @param warpObj - The warp object containing theme and other resources
 * @returns CSS border style string
 */
import { getBorder } from "./get-border";

type BorderSideNode = {
  "a:ln"?: unknown;
};

type BorderTableNode = Record<string, BorderSideNode | undefined>;

export function getTableBorders(node: BorderTableNode, warpObj: unknown): string {
  let borderStyle = "";

  const bottom = node["a:bottom"];
  if (bottom?.["a:ln"] !== undefined) {
    const obj = {
      "p:spPr": {
        "a:ln": bottom["a:ln"],
      },
    };
    const borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-bottom");
    }
  }

  const top = node["a:top"];
  if (top?.["a:ln"] !== undefined) {
    const obj = {
      "p:spPr": {
        "a:ln": top["a:ln"],
      },
    };
    const borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-top");
    }
  }

  const right = node["a:right"];
  if (right?.["a:ln"] !== undefined) {
    const obj = {
      "p:spPr": {
        "a:ln": right["a:ln"],
      },
    };
    const borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-right");
    }
  }

  const left = node["a:left"];
  if (left?.["a:ln"] !== undefined) {
    const obj = {
      "p:spPr": {
        "a:ln": left["a:ln"],
      },
    };
    const borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-left");
    }
  }

  return borderStyle;
}
