/**
 * Get table border styles for all sides
 *
 * @param node - The XML node containing border properties
 * @param warpObj - The warp object containing theme and other resources
 * @returns CSS border style string
 */
import type { PptxNode, WarpObject } from "../../types";
import { getBorder } from "./get-border";

export function getTableBorders(node: PptxNode, warpObj: WarpObject): string {
  let borderStyle = "";

  if (node["a:bottom"] !== undefined) {
    const obj = {
      "p:spPr": {
        "a:ln": node["a:bottom"]["a:ln"],
      },
    };
    const borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-bottom");
    }
  }

  if (node["a:top"] !== undefined) {
    const obj = {
      "p:spPr": {
        "a:ln": node["a:top"]["a:ln"],
      },
    };
    const borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-top");
    }
  }

  if (node["a:right"] !== undefined) {
    const obj = {
      "p:spPr": {
        "a:ln": node["a:right"]["a:ln"],
      },
    };
    const borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-right");
    }
  }

  if (node["a:left"] !== undefined) {
    const obj = {
      "p:spPr": {
        "a:ln": node["a:left"]["a:ln"],
      },
    };
    const borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-left");
    }
  }

  return borderStyle;
}
