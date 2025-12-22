/**
 * Get table border styles for all sides
 *
 * @param node - The XML node containing border properties
 * @param warpObj - The warp object containing theme and other resources
 * @returns CSS border style string
 */
import { getBorder } from "./get-border";

export function getTableBorders(node: any, warpObj: any): string {
  var borderStyle = "";

  if (node["a:bottom"] !== undefined) {
    var obj = {
      "p:spPr": {
        "a:ln": node["a:bottom"]["a:ln"],
      },
    };
    var borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-bottom");
    }
  }

  if (node["a:top"] !== undefined) {
    var obj = {
      "p:spPr": {
        "a:ln": node["a:top"]["a:ln"],
      },
    };
    var borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-top");
    }
  }

  if (node["a:right"] !== undefined) {
    var obj = {
      "p:spPr": {
        "a:ln": node["a:right"]["a:ln"],
      },
    };
    var borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-right");
    }
  }

  if (node["a:left"] !== undefined) {
    var obj = {
      "p:spPr": {
        "a:ln": node["a:left"]["a:ln"],
      },
    };
    var borders = getBorder(obj, undefined, false, "shape", warpObj);
    if (typeof borders === "string") {
      borderStyle += borders.replace("border", "border-left");
    }
  }

  return borderStyle;
}
