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
 * @param idx - Layout index for fallback lookup
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param paragraphDirection - Paragraph direction (pregraph-rtl or pregraph-ltr)
 * @param warpObj - Container object with layout tables and master styles
 * @returns CSS class name for horizontal alignment (h-left, h-right, h-mid, etc.)
 */
export function getHorizontalAlign(
  paragraphNode: Record<string, unknown>,
  textBodyNode: Record<string, unknown>,
  idx: number | string | undefined,
  type: string | undefined,
  paragraphDirection: string | undefined,
  warpObj: Record<string, unknown>
): string {
  let alignment = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "algn"]);
  if (alignment === undefined) {
    //var layoutMasterNode = getLayoutAndMasterNode(node, idx, type, warpObj);
    // var pPrNodeLaout = layoutMasterNode.nodeLaout;
    // var pPrNodeMaster = layoutMasterNode.nodeMaster;
    let levelIndex = 1;
    const levelNode = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "lvl"]);
    if (levelNode !== undefined) {
      levelIndex = parseInt(levelNode) + 1;
    }
    const levelKey = "a:lvl" + levelIndex + "pPr";

    const listStyle = textBodyNode["a:lstStyle"];
    alignment = getTextByPathList(listStyle, [levelKey, "attrs", "algn"]);

    if (alignment === undefined && idx !== undefined) {
      //slidelayout
      alignment = getTextByPathList(warpObj["slideLayoutTables"]["idxTable"][idx], [
        "p:txBody",
        "a:lstStyle",
        levelKey,
        "attrs",
        "algn",
      ]);
      if (alignment === undefined) {
        alignment = getTextByPathList(warpObj["slideLayoutTables"]["idxTable"][idx], [
          "p:txBody",
          "a:p",
          "a:pPr",
          "attrs",
          "algn",
        ]);
        if (alignment === undefined) {
          alignment = getTextByPathList(warpObj["slideLayoutTables"]["idxTable"][idx], [
            "p:txBody",
            "a:p",
            levelIndex - 1,
            "a:pPr",
            "attrs",
            "algn",
          ]);
        }
      }
    }
    if (alignment === undefined) {
      if (type !== undefined) {
        //slidelayout
        alignment = getTextByPathList(warpObj, [
          "slideLayoutTables",
          "typeTable",
          type,
          "p:txBody",
          "a:lstStyle",
          levelKey,
          "attrs",
          "algn",
        ]);

        if (alignment === undefined) {
          //masterlayout
          if (type === "title" || type === "ctrTitle") {
            alignment = getTextByPathList(warpObj, [
              "slideMasterTextStyles",
              "p:titleStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          } else if (type === "body" || type === "obj" || type === "subTitle") {
            alignment = getTextByPathList(warpObj, [
              "slideMasterTextStyles",
              "p:bodyStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          } else if (type === "shape" || type === "diagram") {
            alignment = getTextByPathList(warpObj, [
              "slideMasterTextStyles",
              "p:otherStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          } else if (type === "textBox") {
            alignment = getTextByPathList(warpObj, ["defaultTextStyle", levelKey, "attrs", "algn"]);
          } else {
            alignment = getTextByPathList(warpObj, [
              "slideMasterTables",
              "typeTable",
              type,
              "p:txBody",
              "a:lstStyle",
              levelKey,
              "attrs",
              "algn",
            ]);
          }
        }
      } else {
        alignment = getTextByPathList(warpObj, [
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
    if (type === "title" || type === "subTitle" || type === "ctrTitle") {
      return "h-mid";
    } else if (type === "sldNum") {
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
