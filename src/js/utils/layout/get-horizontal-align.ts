import { getTextByPathList } from "../object/get-text-by-path-list";

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
  paragraphNode: Record<string, unknown>,
  textBodyNode: Record<string, unknown>,
  layoutIndex: number | string | undefined,
  shapeType: string | undefined,
  paragraphDirection: string | undefined,
  warpContext: Record<string, unknown>
): string {
  let alignment = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "algn"]);
  if (alignment === undefined) {
    //var layoutMasterNode = getLayoutAndMasterNode(node, layoutIndex, shapeType, warpContext);
    // var paragraphPropsNodeLayout = layoutMasterNode.nodeLayout;
    // var pPrNodeMaster = layoutMasterNode.nodeMaster;
    let listLevel = 1;
    const levelAttr = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "lvl"]);
    if (levelAttr !== undefined) {
      listLevel = parseInt(levelAttr) + 1;
    }
    const levelKey = "a:lvl" + listLevel + "pPr";

    const listStyle = textBodyNode["a:lstStyle"];
    alignment = getTextByPathList(listStyle, [levelKey, "attrs", "algn"]);

    if (alignment === undefined && layoutIndex !== undefined) {
      //slidelayout
      alignment = getTextByPathList(warpContext["slideLayoutTables"]["idxTable"][layoutIndex], [
        "p:txBody",
        "a:lstStyle",
        levelKey,
        "attrs",
        "algn",
      ]);
      if (alignment === undefined) {
        alignment = getTextByPathList(warpContext["slideLayoutTables"]["idxTable"][layoutIndex], [
          "p:txBody",
          "a:p",
          "a:pPr",
          "attrs",
          "algn",
        ]);
        if (alignment === undefined) {
          alignment = getTextByPathList(warpContext["slideLayoutTables"]["idxTable"][layoutIndex], [
            "p:txBody",
            "a:p",
            listLevel - 1,
            "a:pPr",
            "attrs",
            "algn",
          ]);
        }
      }
    }
    if (alignment === undefined) {
      if (shapeType !== undefined) {
        //slidelayout
        alignment = getTextByPathList(warpContext, [
          "slideLayoutTables",
          "typeTable",
          shapeType,
          "p:txBody",
          "a:lstStyle",
          levelKey,
          "attrs",
          "algn",
        ]);

        if (alignment === undefined) {
          //masterlayout
          if (shapeType === "title" || shapeType === "ctrTitle") {
            alignment = getTextByPathList(warpContext, [
              "slideMasterTextStyles",
              "p:titleStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          } else if (shapeType === "body" || shapeType === "obj" || shapeType === "subTitle") {
            alignment = getTextByPathList(warpContext, [
              "slideMasterTextStyles",
              "p:bodyStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          } else if (shapeType === "shape" || shapeType === "diagram") {
            alignment = getTextByPathList(warpContext, [
              "slideMasterTextStyles",
              "p:otherStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          } else if (shapeType === "textBox") {
            alignment = getTextByPathList(warpContext, [
              "defaultTextStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          } else {
            alignment = getTextByPathList(warpContext, [
              "slideMasterTables",
              "typeTable",
              shapeType,
              "p:txBody",
              "a:lstStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          }
        }
      } else {
        alignment = getTextByPathList(warpContext, [
          "slideMasterTextStyles",
          "p:bodyStyle",
          levelKey,
          "attrs",
          "algn",
        ]);
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
