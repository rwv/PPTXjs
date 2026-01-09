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
export function getContentDir(_node: any, _type: any, _warpObj: any): string {
  // NOTE: RTL (Right-to-Left) detection logic is currently disabled.
  // The early return below bypasses all RTL checks, always returning "content" (LTR).
  // To enable RTL support, comment out the line below and uncomment the logic beneath it.
  // This will enable detection for RTL languages (Arabic, Hebrew, etc.) from PPTX properties.
  return "content";

  /* RTL Detection Logic - Currently Disabled
  const defRtl = getTextByPathList(node, ["p:txBody", "a:lstStyle", "a:defPPr", "attrs", "rtl"]);
  if (defRtl !== undefined) {
    if (defRtl === "1") {
      return "content-rtl";
    } else if (defRtl === "0") {
      return "content";
    }
  }

  const rtlCol = getTextByPathList(node, ["p:txBody", "a:bodyPr", "attrs", "rtlCol"]);
  if (rtlCol !== undefined) {
    if (rtlCol === "1") {
      return "content-rtl";
    } else if (rtlCol === "0") {
      return "content";
    }
  }

  if (type === undefined) {
    return "content";
  }

  const slideMasterTextStyles = warpObj["slideMasterTextStyles"];
  let dirLoc = "";

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
      break;
  }

  if (slideMasterTextStyles !== undefined && dirLoc !== "") {
    const dirVal = getTextByPathList(slideMasterTextStyles[dirLoc], ["a:lvl1pPr", "attrs", "rtl"]);
    if (dirVal === "1") {
      return "content-rtl";
    }
  }

  return "content";
  */
}
