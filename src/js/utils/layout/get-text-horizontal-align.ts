import { getTextByPathList } from "../object/get-text-by-path-list";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

/**
 * Determines horizontal text alignment for a text node
 *
 * Resolves alignment with fallback hierarchy:
 * 1. Node paragraph properties
 * 2. Parent node paragraph properties
 * 3. Layout/master text styles based on type
 *
 * Maps PPTX alignment values to CSS:
 * - "l" → "left"
 * - "r" → "right"
 * - "ctr" → "center"
 * - "just"/"dist" → "justify"
 *
 * @param textNode - Text node from PPTX
 * @param paragraphNode - Parent paragraph node for fallback
 * @param shapeType - Shape type (title, body, etc.)
 * @param warpContext - Container object with layout tables and master styles
 * @returns CSS text-align value ("left", "right", "center", "justify", or "inherit")
 */
export function getTextHorizontalAlign(
  textNode: XmlNode,
  paragraphNode: XmlNode,
  shapeType: string | undefined,
  warpContext: WarpContext
): string {
  //console.log("getTextHorizontalAlign: type: ", shapeType, ", node: ", textNode)
  const asString = (value: string | number | undefined): string | undefined =>
    value !== undefined ? String(value) : undefined;

  let alignmentValue = asString(
    getTextByPathList<string | number>(textNode, ["a:pPr", "attrs", "algn"])
  );
  if (alignmentValue === undefined) {
    alignmentValue = asString(
      getTextByPathList<string | number>(paragraphNode, ["a:pPr", "attrs", "algn"])
    );
  }
  if (alignmentValue === undefined) {
    if (shapeType === "title" || shapeType === "ctrTitle" || shapeType === "subTitle") {
      let listLevel = 1;
      const levelAttr = getTextByPathList<string | number>(paragraphNode, [
        "a:pPr",
        "attrs",
        "lvl",
      ]);
      if (levelAttr !== undefined) {
        listLevel = parseInt(String(levelAttr), 10) + 1;
      }
      const levelKey = "a:lvl" + listLevel + "pPr";
      const layoutTypeEntry = warpContext.slideLayoutTables?.typeTable[shapeType];
      alignmentValue = asString(
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
      if (alignmentValue === undefined) {
        const masterTypeEntry = warpContext.slideMasterTables?.typeTable[shapeType];
        alignmentValue = asString(
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
        if (alignmentValue === undefined) {
          const masterTextStyles = warpContext.slideMasterTextStyles;
          alignmentValue = asString(
            masterTextStyles
              ? getTextByPathList<string | number>(masterTextStyles, [
                  "p:titleStyle",
                  levelKey,
                  "attrs",
                  "algn",
                ])
              : undefined
          );
          if (alignmentValue === undefined && shapeType === "subTitle") {
            alignmentValue = asString(
              masterTextStyles
                ? getTextByPathList<string | number>(masterTextStyles, [
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
    } else if (shapeType === "body") {
      alignmentValue = asString(
        warpContext.slideMasterTextStyles
          ? getTextByPathList<string | number>(warpContext.slideMasterTextStyles, [
              "p:bodyStyle",
              "a:lvl1pPr",
              "attrs",
              "algn",
            ])
          : undefined
      );
    } else {
      const masterTypeEntry = warpContext.slideMasterTables?.typeTable[shapeType ?? ""];
      alignmentValue = asString(
        masterTypeEntry
          ? getTextByPathList<string | number>(masterTypeEntry, [
              "p:txBody",
              "a:lstStyle",
              "a:lvl1pPr",
              "attrs",
              "algn",
            ])
          : undefined
      );
    }
  }

  let textAlign = "inherit";
  if (alignmentValue !== undefined) {
    switch (alignmentValue) {
      case "l":
        textAlign = "left";
        break;
      case "r":
        textAlign = "right";
        break;
      case "ctr":
        textAlign = "center";
        break;
      case "just":
        textAlign = "justify";
        break;
      case "dist":
        textAlign = "justify";
        break;
      default:
        textAlign = "inherit";
    }
  }
  return textAlign;
}
