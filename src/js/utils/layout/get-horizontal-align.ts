import { getTextByPathList } from "../object/get-text-by-path-list";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

/**
 * Calculates horizontal text alignment CSS class for a PPTX paragraph node
 *
 * Handles alignment with fallback hierarchy:
 * 1. Paragraph-level alignment (highest priority)
 * 2. List style alignment
 * 3. Layout-level alignment
 * 4. Master slide text styles (lowest priority)
 * 5. Default alignment based on shape type
 *
 * Supports RTL (right-to-left) text direction:
 * - Left alignment in RTL becomes "h-left-rtl"
 * - Right alignment in RTL becomes "h-right-rtl"
 *
 * @param paragraphNode - Paragraph node from PPTX
 * @param textBodyNode - Text body node containing list styles
 * @param layoutIndex - Layout index for fallback lookup
 * @param shapeType - Shape type (title, body, textBox, shape, etc.)
 * @param paragraphDirection - Paragraph direction (pregraph-rtl or pregraph-ltr)
 * @param warpContext - Container object with layout tables and master styles
 * @returns CSS class name for horizontal alignment (h-left, h-right, h-mid, etc.)
 */
export function getHorizontalAlign(
  paragraphNode: XmlNode,
  textBodyNode: XmlNode,
  layoutIndex: number | string | undefined,
  shapeType: string | undefined,
  paragraphDirection: string | undefined,
  warpContext: WarpContext
): string {
  const asString = (value: string | number | undefined): string | undefined =>
    value !== undefined ? String(value) : undefined;

  let alignment = asString(
    getTextByPathList<string | number>(paragraphNode, ["a:pPr", "attrs", "algn"])
  );
  if (alignment === undefined) {
    //var layoutMasterNode = getLayoutAndMasterNode(node, layoutIndex, shapeType, warpContext);
    // var paragraphPropsNodeLayout = layoutMasterNode.nodeLayout;
    // var pPrNodeMaster = layoutMasterNode.nodeMaster;
    let listLevel = 1;
    const levelAttr = getTextByPathList<string | number>(paragraphNode, ["a:pPr", "attrs", "lvl"]);
    if (levelAttr !== undefined) {
      listLevel = parseInt(String(levelAttr), 10) + 1;
    }
    const levelKey = "a:lvl" + listLevel + "pPr";

    const listStyle = asXmlNode(textBodyNode["a:lstStyle"]);
    alignment = asString(
      listStyle
        ? getTextByPathList<string | number>(listStyle, [levelKey, "attrs", "algn"])
        : undefined
    );

    if (alignment === undefined && layoutIndex !== undefined) {
      //slidelayout
      const layoutTableEntry = warpContext.slideLayoutTables?.idxTable[layoutIndex];
      alignment = asString(
        layoutTableEntry
          ? getTextByPathList<string | number>(layoutTableEntry, [
              "p:txBody",
              "a:lstStyle",
              levelKey,
              "attrs",
              "algn",
            ])
          : undefined
      );
      if (alignment === undefined) {
        alignment = asString(
          layoutTableEntry
            ? getTextByPathList<string | number>(layoutTableEntry, [
                "p:txBody",
                "a:p",
                "a:pPr",
                "attrs",
                "algn",
              ])
            : undefined
        );
        if (alignment === undefined) {
          alignment = asString(
            layoutTableEntry
              ? getTextByPathList<string | number>(layoutTableEntry, [
                  "p:txBody",
                  "a:p",
                  listLevel - 1,
                  "a:pPr",
                  "attrs",
                  "algn",
                ])
              : undefined
          );
        }
      }
    }
    if (alignment === undefined) {
      if (shapeType !== undefined) {
        //slidelayout
        const layoutTypeEntry = warpContext.slideLayoutTables?.typeTable[shapeType];
        alignment = asString(
          layoutTypeEntry
            ? getTextByPathList<string | number>(layoutTypeEntry, [
                "p:txBody",
                "a:lstStyle",
                levelKey,
                "attrs",
                "algn",
              ])
            : undefined
        );

        if (alignment === undefined) {
          const masterTextStyles = warpContext.slideMasterTextStyles;
          //masterlayout
          if (shapeType === "title" || shapeType === "ctrTitle") {
            alignment = asString(
              masterTextStyles
                ? getTextByPathList<string | number>(masterTextStyles, [
                    "p:titleStyle",
                    levelKey,
                    "attrs",
                    "algn",
                  ])
                : undefined
            );
          } else if (shapeType === "body" || shapeType === "obj" || shapeType === "subTitle") {
            alignment = asString(
              masterTextStyles
                ? getTextByPathList<string | number>(masterTextStyles, [
                    "p:bodyStyle",
                    levelKey,
                    "attrs",
                    "algn",
                  ])
                : undefined
            );
          } else if (shapeType === "shape" || shapeType === "diagram") {
            alignment = asString(
              masterTextStyles
                ? getTextByPathList<string | number>(masterTextStyles, [
                    "p:otherStyle",
                    levelKey,
                    "attrs",
                    "algn",
                  ])
                : undefined
            );
          } else if (shapeType === "textBox") {
            alignment = asString(
              warpContext.defaultTextStyle
                ? getTextByPathList<string | number>(warpContext.defaultTextStyle, [
                    levelKey,
                    "attrs",
                    "algn",
                  ])
                : undefined
            );
          } else {
            const masterTypeEntry = warpContext.slideMasterTables?.typeTable[shapeType];
            alignment = asString(
              masterTypeEntry
                ? getTextByPathList<string | number>(masterTypeEntry, [
                    "p:txBody",
                    "a:lstStyle",
                    levelKey,
                    "attrs",
                    "algn",
                  ])
                : undefined
            );
          }
        }
      } else {
        alignment = asString(
          warpContext.slideMasterTextStyles
            ? getTextByPathList<string | number>(warpContext.slideMasterTextStyles, [
                "p:bodyStyle",
                levelKey,
                "attrs",
                "algn",
              ])
            : undefined
        );
      }
    }
  }

  if (alignment === undefined) {
    if (shapeType === "title" || shapeType === "subTitle" || shapeType === "ctrTitle") {
      return "h-mid";
    } else if (shapeType === "sldNum") {
      return "h-right";
    }
  }
  if (alignment !== undefined) {
    switch (alignment) {
      case "l":
        if (paragraphDirection === "pregraph-rtl") {
          //return "h-right";
          return "h-left-rtl";
        } else {
          return "h-left";
        }
      case "r":
        if (paragraphDirection === "pregraph-rtl") {
          //return "h-left";
          return "h-right-rtl";
        } else {
          return "h-right";
        }
      case "ctr":
        return "h-mid";
      case "just":
      case "dist":
      default:
        return "h-" + alignment;
    }
  }
  //return algn === "ctr" ? "h-mid" : algn === "r" ? "h-right" : "h-left";
}
