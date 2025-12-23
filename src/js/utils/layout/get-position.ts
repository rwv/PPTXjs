import type { PptxNode, SlideFactor } from "../../types";
import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * PPTX transform node containing offset attributes
 */
interface TransformNode {
  "a:off"?: {
    attrs?: {
      x?: string;
      y?: string;
    };
  };
  "a:ext"?: {
    attrs?: {
      cx?: string;
      cy?: string;
    };
  };
  [key: string]: any;
}

/**
 * PPTX group transform node with additional child offset/extent
 */
interface GroupTransformNode extends TransformNode {
  "a:chOff"?: {
    attrs?: {
      x?: string;
      y?: string;
    };
  };
  "a:chExt"?: {
    attrs?: {
      cx?: string;
      cy?: string;
    };
  };
}

/**
 * Parent node that may contain group properties
 */
interface ParentNode {
  "p:grpSpPr"?: {
    "a:xfrm"?: GroupTransformNode;
  };
  [key: string]: any;
}

/**
 * Calculates the CSS position styling for a PPTX shape element
 *
 * Handles positioning with fallback hierarchy:
 * 1. Slide-level positioning (highest priority)
 * 2. Layout-level positioning
 * 3. Master slide positioning (lowest priority)
 *
 * Also handles special cases:
 * - Group positioning with offset inheritance
 * - Rotated groups with child offsets
 *
 * @param slideSpNode - Transform node from slide content
 * @param pNode - Parent node (may contain group properties)
 * @param slideLayoutSpNode - Transform node from layout
 * @param slideMasterSpNode - Transform node from master slide
 * @param sType - Shape type ("group", "group-rotate", or other)
 * @param slideFactor - Conversion factor from PPTX units to pixels (default: 96/914400)
 * @returns CSS position string (e.g., "top: 100px; left: 50px;") or empty string if no position found
 */
export function getPosition(
  slideSpNode: TransformNode | undefined,
  pNode: ParentNode | undefined,
  slideLayoutSpNode: TransformNode | undefined,
  slideMasterSpNode: TransformNode | undefined,
  sType: string | undefined,
  slideFactor: SlideFactor
): string {
  let off: { x?: string; y?: string } | undefined;
  let x = -1,
    y = -1;

  // Find offset with fallback hierarchy: slide -> layout -> master
  if (slideSpNode !== undefined) {
    off = slideSpNode["a:off"]?.attrs;
  }

  if (off === undefined && slideLayoutSpNode !== undefined) {
    off = slideLayoutSpNode["a:off"]?.attrs;
  } else if (off === undefined && slideMasterSpNode !== undefined) {
    off = slideMasterSpNode["a:off"]?.attrs;
  }

  let offX = 0,
    offY = 0;
  let grpX = 0,
    grpY = 0;

  // Handle group positioning
  if (sType === "group" && pNode !== undefined) {
    const grpXfrmNode = getTextByPathList(pNode, ["p:grpSpPr", "a:xfrm"]);
    // BUG FIX: Changed xfrmNode to grpXfrmNode
    if (grpXfrmNode !== undefined) {
      grpX = parseInt(grpXfrmNode["a:off"]["attrs"]["x"]) * slideFactor;
      grpY = parseInt(grpXfrmNode["a:off"]["attrs"]["y"]) * slideFactor;
      // var chx = parseInt(grpXfrmNode["a:chOff"]["attrs"]["x"]) * slideFactor;
      // var chy = parseInt(grpXfrmNode["a:chOff"]["attrs"]["y"]) * slideFactor;
      // var cx = parseInt(grpXfrmNode["a:ext"]["attrs"]["cx"]) * slideFactor;
      // var cy = parseInt(grpXfrmNode["a:ext"]["attrs"]["cy"]) * slideFactor;
      // var chcx = parseInt(grpXfrmNode["a:chExt"]["attrs"]["cx"]) * slideFactor;
      // var chcy = parseInt(grpXfrmNode["a:chExt"]["attrs"]["cy"]) * slideFactor;
      // var rotate = parseInt(grpXfrmNode["attrs"]["rot"])
    }
  }

  // Handle rotated group positioning
  if (sType === "group-rotate" && pNode !== undefined && pNode["p:grpSpPr"] !== undefined) {
    const xfrmNode = pNode["p:grpSpPr"]["a:xfrm"];
    if (xfrmNode !== undefined && xfrmNode["a:chOff"] !== undefined) {
      // var ox = parseInt(xfrmNode["a:off"]["attrs"]["x"]) * slideFactor;
      // var oy = parseInt(xfrmNode["a:off"]["attrs"]["y"]) * slideFactor;
      const chx = parseInt(xfrmNode["a:chOff"]["attrs"]["x"]) * slideFactor;
      const chy = parseInt(xfrmNode["a:chOff"]["attrs"]["y"]) * slideFactor;

      offX = chx;
      offY = chy;
    }
  }

  // Return empty string if no offset found
  if (off === undefined) {
    return "";
  } else {
    x = parseInt(off["x"] || "0") * slideFactor;
    y = parseInt(off["y"] || "0") * slideFactor;
    // if (type === "body")  // Note: This was commented out with a bug (= instead of === )
    //     console.log("getPosition: slideSpNode: ", slideSpNode, ", type: ", type, "x: ", x, "offX:", offX, "y:", y, "offY:", offY)
    return isNaN(x) || isNaN(y)
      ? ""
      : "top:" + (y - offY + grpY) + "px; left:" + (x - offX + grpX) + "px;";
  }
}
