import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Determines content text direction (RTL/LTR) for a PPTX node
 *
 * Note: Currently returns "content" immediately (RTL logic is disabled)
 *
 * The function has fallback logic (currently commented out) that checks:
 * 1. Default paragraph RTL attribute (p:txBody -> a:lstStyle -> a:defPPr)
 * 2. Body properties rtlCol attribute (p:txBody -> a:bodyPr)
 * 3. Master slide text styles based on shape type
 *
 * Returns "content" for LTR or "content-rtl" for RTL text direction
 *
 * @param node - Node containing text body from PPTX
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param warpObj - Container object with master slide text styles
 * @returns CSS class name for content direction (currently always "content")
 */
export function getContentDir(
  node: any,
  type: any,
  warpObj: any
): string {
  return "content";
  var defRtl = getTextByPathList(node, ["p:txBody", "a:lstStyle", "a:defPPr", "attrs", "rtl"]);
  if (defRtl !== undefined) {
    if (defRtl == "1") {
      return "content-rtl";
    } else if (defRtl == "0") {
      return "content";
    }
  }
  //var lvl1Rtl = getTextByPathList(node, ["p:txBody", "a:lstStyle", "lvl1pPr", "attrs", "rtl"]);
  // if (lvl1Rtl !== undefined) {
  //     if (lvl1Rtl == "1") {
  //         return "content-rtl";
  //     } else if (lvl1Rtl == "0") {
  //         return "content";
  //     }
  // }
  var rtlCol = getTextByPathList(node, ["p:txBody", "a:bodyPr", "attrs", "rtlCol"]);
  if (rtlCol !== undefined) {
    if (rtlCol == "1") {
      return "content-rtl";
    } else if (rtlCol == "0") {
      return "content";
    }
  }
  //console.log("getContentDir node:", node, "rtlCol:", rtlCol)

  if (type === undefined) {
    return "content";
  }
  var slideMasterTextStyles = warpObj["slideMasterTextStyles"];
  var dirLoc = "";

  switch (type) {
    case "title":
    case "ctrTitle":
      dirLoc = "p:titleStyle";
      break;
    case "body":
    case "dt":
    case "ftr":
    case "sldNum":
    case "textBox":
      dirLoc = "p:bodyStyle";
      break;
    case "shape":
      dirLoc = "p:otherStyle";
  }
  if (slideMasterTextStyles !== undefined && dirLoc !== "") {
    var dirVal = getTextByPathList(slideMasterTextStyles[dirLoc], ["a:lvl1pPr", "attrs", "rtl"]);
    if (dirVal == "1") {
      return "content-rtl";
    }
  }
  // else {
  //     if (type == "textBox") {
  //         var dirVal = getTextByPathList(warpObj, ["defaultTextStyle", "a:lvl1pPr", "attrs", "rtl"]);
  //         if (dirVal == "1") {
  //             return "content-rtl";
  //         }
  //     }
  // }
  return "content";
  //console.log("getContentDir() type:", type, "slideMasterTextStyles:", slideMasterTextStyles,"dirNode:",dirVal)
}
