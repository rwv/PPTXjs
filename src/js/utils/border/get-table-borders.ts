/**
 * Get table border styles for all sides
 *
 * @param tableBorderNode - The XML node containing border properties
 * @param warpContext - The warp object containing theme and other resources
 * @returns CSS border style string
 */
import { getBorder } from "./get-border";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

interface BorderSideNode extends XmlNode {
  "a:ln"?: XmlNode;
}

interface BorderTableNode extends XmlNode {
  "a:bottom"?: BorderSideNode;
  "a:top"?: BorderSideNode;
  "a:right"?: BorderSideNode;
  "a:left"?: BorderSideNode;
}

export function getTableBorders(
  tableBorderNode: BorderTableNode,
  warpContext: WarpContext
): string {
  let borderStyle = "";

  const bottom = tableBorderNode["a:bottom"];
  if (bottom?.["a:ln"] !== undefined) {
    const borderNode: XmlNode = {
      "p:spPr": {
        "a:ln": bottom["a:ln"],
      },
    };
    const borderCss = getBorder(borderNode, undefined, false, "shape", warpContext);
    if (typeof borderCss === "string") {
      borderStyle += borderCss.replace("border", "border-bottom");
    }
  }

  const top = tableBorderNode["a:top"];
  if (top?.["a:ln"] !== undefined) {
    const borderNode: XmlNode = {
      "p:spPr": {
        "a:ln": top["a:ln"],
      },
    };
    const borderCss = getBorder(borderNode, undefined, false, "shape", warpContext);
    if (typeof borderCss === "string") {
      borderStyle += borderCss.replace("border", "border-top");
    }
  }

  const right = tableBorderNode["a:right"];
  if (right?.["a:ln"] !== undefined) {
    const borderNode: XmlNode = {
      "p:spPr": {
        "a:ln": right["a:ln"],
      },
    };
    const borderCss = getBorder(borderNode, undefined, false, "shape", warpContext);
    if (typeof borderCss === "string") {
      borderStyle += borderCss.replace("border", "border-right");
    }
  }

  const left = tableBorderNode["a:left"];
  if (left?.["a:ln"] !== undefined) {
    const borderNode: XmlNode = {
      "p:spPr": {
        "a:ln": left["a:ln"],
      },
    };
    const borderCss = getBorder(borderNode, undefined, false, "shape", warpContext);
    if (typeof borderCss === "string") {
      borderStyle += borderCss.replace("border", "border-left");
    }
  }

  return borderStyle;
}
