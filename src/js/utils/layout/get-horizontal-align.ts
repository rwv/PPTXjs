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
 * @param node - Paragraph node from PPTX
 * @param textBodyNode - Text body node containing list styles
 * @param idx - Layout index for fallback lookup
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param prg_dir - Paragraph direction (pregraph-rtl or pregraph-ltr)
 * @param warpObj - Container object with layout tables and master styles
 * @returns CSS class name for horizontal alignment (h-left, h-right, h-mid, etc.)
 */
export function getHorizontalAlign(
  node: any,
  textBodyNode: any,
  idx: any,
  type: any,
  prg_dir: any,
  warpObj: any
): string {
  let algn = getTextByPathList(node, ["a:pPr", "attrs", "algn"]);
  if (algn === undefined) {
    //var layoutMasterNode = getLayoutAndMasterNode(node, idx, type, warpObj);
    // var pPrNodeLaout = layoutMasterNode.nodeLaout;
    // var pPrNodeMaster = layoutMasterNode.nodeMaster;
    let lvlIdx = 1;
    const lvlNode = getTextByPathList(node, ["a:pPr", "attrs", "lvl"]);
    if (lvlNode !== undefined) {
      lvlIdx = parseInt(lvlNode) + 1;
    }
    const lvlStr = "a:lvl" + lvlIdx + "pPr";

    const lstStyle = textBodyNode["a:lstStyle"];
    algn = getTextByPathList(lstStyle, [lvlStr, "attrs", "algn"]);

    if (algn === undefined && idx !== undefined) {
      //slidelayout
      algn = getTextByPathList(warpObj["slideLayoutTables"]["idxTable"][idx], [
        "p:txBody",
        "a:lstStyle",
        lvlStr,
        "attrs",
        "algn",
      ]);
      if (algn === undefined) {
        algn = getTextByPathList(warpObj["slideLayoutTables"]["idxTable"][idx], [
          "p:txBody",
          "a:p",
          "a:pPr",
          "attrs",
          "algn",
        ]);
        if (algn === undefined) {
          algn = getTextByPathList(warpObj["slideLayoutTables"]["idxTable"][idx], [
            "p:txBody",
            "a:p",
            lvlIdx - 1,
            "a:pPr",
            "attrs",
            "algn",
          ]);
        }
      }
    }
    if (algn === undefined) {
      if (type !== undefined) {
        //slidelayout
        algn = getTextByPathList(warpObj, [
          "slideLayoutTables",
          "typeTable",
          type,
          "p:txBody",
          "a:lstStyle",
          lvlStr,
          "attrs",
          "algn",
        ]);

        if (algn === undefined) {
          //masterlayout
          if (type == "title" || type == "ctrTitle") {
            algn = getTextByPathList(warpObj, [
              "slideMasterTextStyles",
              "p:titleStyle",
              lvlStr,
              "attrs",
              "algn",
            ]);
          } else if (type == "body" || type == "obj" || type == "subTitle") {
            algn = getTextByPathList(warpObj, [
              "slideMasterTextStyles",
              "p:bodyStyle",
              lvlStr,
              "attrs",
              "algn",
            ]);
          } else if (type == "shape" || type == "diagram") {
            algn = getTextByPathList(warpObj, [
              "slideMasterTextStyles",
              "p:otherStyle",
              lvlStr,
              "attrs",
              "algn",
            ]);
          } else if (type == "textBox") {
            algn = getTextByPathList(warpObj, ["defaultTextStyle", lvlStr, "attrs", "algn"]);
          } else {
            algn = getTextByPathList(warpObj, [
              "slideMasterTables",
              "typeTable",
              type,
              "p:txBody",
              "a:lstStyle",
              lvlStr,
              "attrs",
              "algn",
            ]);
          }
        }
      } else {
        algn = getTextByPathList(warpObj, [
          "slideMasterTextStyles",
          "p:bodyStyle",
          lvlStr,
          "attrs",
          "algn",
        ]);
      }
    }
  }

  if (algn === undefined) {
    if (type == "title" || type == "subTitle" || type == "ctrTitle") {
      return "h-mid";
    } else if (type == "sldNum") {
      return "h-right";
    }
  }
  if (algn !== undefined) {
    switch (algn) {
      case "l":
        if (prg_dir == "pregraph-rtl") {
          //return "h-right";
          return "h-left-rtl";
        } else {
          return "h-left";
        }
      case "r":
        if (prg_dir == "pregraph-rtl") {
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
        return "h-" + algn;
    }
  }
  //return algn === "ctr" ? "h-mid" : algn === "r" ? "h-right" : "h-left";
}
