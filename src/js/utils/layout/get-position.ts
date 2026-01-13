import { getTextByPathList } from "../object/get-text-by-path-list";
import type { XmlNode } from "../../types/pptx-xml";

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
  [key: string]: unknown;
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
  [key: string]: unknown;
}

type GetPositionOptions = {
  slideSpNode: TransformNode | undefined;
  parentNode: ParentNode | undefined;
  slideLayoutSpNode: TransformNode | undefined;
  slideMasterSpNode: TransformNode | undefined;
  shapeType: string | undefined;
  emuToPx: number;
};

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
 * @param parentNode - Parent node (may contain group properties)
 * @param slideLayoutSpNode - Transform node from layout
 * @param slideMasterSpNode - Transform node from master slide
 * @param shapeType - Shape type ("group", "group-rotate", or other)
 * @param emuToPx - Conversion factor from PPTX units to pixels (default: 96/914400)
 * @returns CSS position string (e.g., "top: 100px; left: 50px;") or empty string if no position found
 */
export function getPosition({
  slideSpNode,
  parentNode,
  slideLayoutSpNode,
  slideMasterSpNode,
  shapeType,
  emuToPx,
}: GetPositionOptions): string {
  const parseEmuValue = (value: string | number | undefined): number | undefined => {
    if (value === undefined || value === null) {
      return undefined;
    }
    const parsed = Number.parseInt(String(value), 10);
    return Number.isFinite(parsed) ? parsed * emuToPx : undefined;
  };

  let offsetAttributes: { x?: string; y?: string } | undefined;
  let xPosition = -1,
    yPosition = -1;

  // Find offset with fallback hierarchy: slide -> layout -> master
  if (slideSpNode !== undefined) {
    offsetAttributes = slideSpNode["a:off"]?.attrs;
  }

  if (offsetAttributes === undefined && slideLayoutSpNode !== undefined) {
    offsetAttributes = slideLayoutSpNode["a:off"]?.attrs;
  } else if (offsetAttributes === undefined && slideMasterSpNode !== undefined) {
    offsetAttributes = slideMasterSpNode["a:off"]?.attrs;
  }

  let childOffsetX = 0,
    childOffsetY = 0;
  let groupOffsetX = 0,
    groupOffsetY = 0;

  // Handle group positioning
  if (shapeType === "group" && parentNode !== undefined) {
    const groupTransformNode = getTextByPathList({
      node: parentNode as XmlNode,
      path: ["p:grpSpPr", "a:xfrm"],
    });
    // BUG FIX: Use the group transform node when computing offsets.
    if (groupTransformNode && typeof groupTransformNode === "object") {
      const groupOffsetXValue = parseEmuValue(
        getTextByPathList({
          node: groupTransformNode as XmlNode,
          path: ["a:off", "attrs", "x"],
        })
      );
      const groupOffsetYValue = parseEmuValue(
        getTextByPathList({
          node: groupTransformNode as XmlNode,
          path: ["a:off", "attrs", "y"],
        })
      );
      if (groupOffsetXValue !== undefined) {
        groupOffsetX = groupOffsetXValue;
      }
      if (groupOffsetYValue !== undefined) {
        groupOffsetY = groupOffsetYValue;
      }
      // var chx = parseInt(grpXfrmNode["a:chOff"]["attrs"]["x"]) * emuToPx;
      // var chy = parseInt(grpXfrmNode["a:chOff"]["attrs"]["y"]) * emuToPx;
      // var cx = parseInt(grpXfrmNode["a:ext"]["attrs"]["cx"]) * emuToPx;
      // var cy = parseInt(grpXfrmNode["a:ext"]["attrs"]["cy"]) * emuToPx;
      // var chcx = parseInt(grpXfrmNode["a:chExt"]["attrs"]["cx"]) * emuToPx;
      // var chcy = parseInt(grpXfrmNode["a:chExt"]["attrs"]["cy"]) * emuToPx;
      // var rotate = parseInt(grpXfrmNode["attrs"]["rot"])
    }
  }

  // Handle rotated group positioning
  if (
    shapeType === "group-rotate" &&
    parentNode !== undefined &&
    parentNode["p:grpSpPr"] !== undefined
  ) {
    const groupTransformNode = parentNode["p:grpSpPr"]?.["a:xfrm"];
    if (groupTransformNode && typeof groupTransformNode === "object") {
      // var ox = parseInt(xfrmNode["a:off"]["attrs"]["x"]) * emuToPx;
      // var oy = parseInt(xfrmNode["a:off"]["attrs"]["y"]) * emuToPx;
      const childOffsetXValue = parseEmuValue(
        getTextByPathList({
          node: groupTransformNode as XmlNode,
          path: ["a:chOff", "attrs", "x"],
        })
      );
      const childOffsetYValue = parseEmuValue(
        getTextByPathList({
          node: groupTransformNode as XmlNode,
          path: ["a:chOff", "attrs", "y"],
        })
      );

      if (childOffsetXValue !== undefined) {
        childOffsetX = childOffsetXValue;
      }
      if (childOffsetYValue !== undefined) {
        childOffsetY = childOffsetYValue;
      }
    }
  }

  // Return empty string if no offset found
  if (offsetAttributes === undefined) {
    return "";
  } else {
    xPosition = parseInt(offsetAttributes["x"] || "0") * emuToPx;
    yPosition = parseInt(offsetAttributes["y"] || "0") * emuToPx;
    // if (type == "body")  // Note: This was commented out with a bug (= instead of ==)
    //     console.log("getPosition: slideSpNode: ", slideSpNode, ", type: ", type, "x: ", x, "offX:", offX, "y:", y, "offY:", offY)
    return isNaN(xPosition) || isNaN(yPosition)
      ? ""
      : "top:" +
          (yPosition - childOffsetY + groupOffsetY) +
          "px; left:" +
          (xPosition - childOffsetX + groupOffsetX) +
          "px;";
  }
}
