import { getTextByPathList } from "../object/get-text-by-path-list";

/**
 * Determines font size for a PPTX node with complex fallback hierarchy
 *
 * Handles font size with fallback hierarchy:
 * 1. Node-level size (a:rPr attrs sz)
 * 2. Field-level size (a:fld -> a:rPr)
 * 3. End paragraph size (a:endParaRPr)
 * 4. List style size
 * 5. Layout table size
 * 6. Master table size
 * 7. Master text styles (title/body/other)
 * 8. Default text style
 *
 * Also handles:
 * - Auto-fit adjustments with kerning
 * - Baseline adjustments for superscript/subscript
 * - Normal auto-fit font scaling
 *
 * @param node - Text run node from PPTX
 * @param textBodyNode - Text body node containing list styles
 * @param pFontStyle - Paragraph font style (unused but kept for consistency)
 * @param lvl - List level (1-based)
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param warpObj - Container object with layout tables and master styles
 * @returns Font size as CSS string (e.g., "12px") or "inherit"/"initial"
 */
export function getFontSize(
  node: any,
  textBodyNode: any,
  pFontStyle: any,
  lvl: any,
  type: any,
  warpObj: any,
  fontSizeFactor: any
): string {
  // if(type == "sldNum")
  //console.log("getFontSize node:", node, "lstStyle", lstStyle, "lvl:", lvl, 'type:', type, "warpObj:", warpObj)
  const lstStyle = textBodyNode !== undefined ? textBodyNode["a:lstStyle"] : undefined;
  const lvlpPr = "a:lvl" + lvl + "pPr";
  let fontSize: number | undefined = undefined;
  let sz, kern;
  if (node["a:rPr"] !== undefined) {
    fontSize = parseInt(node["a:rPr"]["attrs"]["sz"]) / 100;
  }
  if (isNaN(fontSize) || (fontSize === undefined && node["a:fld"] !== undefined)) {
    sz = getTextByPathList(node["a:fld"], ["a:rPr", "attrs", "sz"]);
    fontSize = parseInt(sz) / 100;
  }
  if ((isNaN(fontSize) || fontSize === undefined) && node["a:t"] === undefined) {
    sz = getTextByPathList(node["a:endParaRPr"], ["attrs", "sz"]);
    fontSize = parseInt(sz) / 100;
  }
  if ((isNaN(fontSize) || fontSize === undefined) && lstStyle !== undefined) {
    sz = getTextByPathList(lstStyle, [lvlpPr, "a:defRPr", "attrs", "sz"]);
    fontSize = parseInt(sz) / 100;
  }
  //a:spAutoFit
  let _isAutoFit = false;
  let isKerning = false;
  if (textBodyNode !== undefined) {
    const spAutoFitNode = getTextByPathList(textBodyNode, ["a:bodyPr", "a:spAutoFit"]);
    // if (spAutoFitNode === undefined) {
    //     spAutoFitNode = getTextByPathList(textBodyNode, ["a:bodyPr", "a:normAutofit"]);
    // }
    if (spAutoFitNode !== undefined) {
      _isAutoFit = true;
      isKerning = true;
    }
  }
  if (isNaN(fontSize) || fontSize === undefined) {
    // if (type == "shape" || type == "textBox") {
    //     type = "body";
    //     lvlpPr = "a:lvl1pPr";
    // }
    sz = getTextByPathList(warpObj["slideLayoutTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      lvlpPr,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    fontSize = parseInt(sz) / 100;
    kern = getTextByPathList(warpObj["slideLayoutTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      lvlpPr,
      "a:defRPr",
      "attrs",
      "kern",
    ]);
    if (
      isKerning &&
      kern !== undefined &&
      !isNaN(fontSize) &&
      fontSize - parseInt(kern) / 100 > 0
    ) {
      fontSize = fontSize - parseInt(kern) / 100;
    }
  }

  if (isNaN(fontSize) || fontSize === undefined) {
    // if (type == "shape" || type == "textBox") {
    //     type = "body";
    //     lvlpPr = "a:lvl1pPr";
    // }
    sz = getTextByPathList(warpObj["slideMasterTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      lvlpPr,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    kern = getTextByPathList(warpObj["slideMasterTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      lvlpPr,
      "a:defRPr",
      "attrs",
      "kern",
    ]);
    if (sz === undefined) {
      if (type === "title" || type === "subTitle" || type === "ctrTitle") {
        sz = getTextByPathList(warpObj["slideMasterTextStyles"], [
          "p:titleStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kern = getTextByPathList(warpObj["slideMasterTextStyles"], [
          "p:titleStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
      } else if (
        type === "body" ||
        type === "obj" ||
        type === "dt" ||
        type === "sldNum" ||
        type === "textBox"
      ) {
        sz = getTextByPathList(warpObj["slideMasterTextStyles"], [
          "p:bodyStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kern = getTextByPathList(warpObj["slideMasterTextStyles"], [
          "p:bodyStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
      } else if (type === "shape") {
        //textBox and shape text does not indent
        sz = getTextByPathList(warpObj["slideMasterTextStyles"], [
          "p:otherStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kern = getTextByPathList(warpObj["slideMasterTextStyles"], [
          "p:otherStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
        isKerning = false;
      }

      if (sz === undefined) {
        sz = getTextByPathList(warpObj["defaultTextStyle"], [lvlpPr, "a:defRPr", "attrs", "sz"]);
        kern =
          kern === undefined
            ? getTextByPathList(warpObj["defaultTextStyle"], [lvlpPr, "a:defRPr", "attrs", "kern"])
            : undefined;
        isKerning = false;
      }
      //  else if (type === undefined || type == "shape") {
      //     sz = getTextByPathList(warpObj["slideMasterTextStyles"], ["p:otherStyle", lvlpPr, "a:defRPr", "attrs", "sz"]);
      //     kern = getTextByPathList(warpObj["slideMasterTextStyles"], ["p:otherStyle", lvlpPr, "a:defRPr", "attrs", "kern"]);
      // }
      // else if (type == "textBox") {
      //     sz = getTextByPathList(warpObj["slideMasterTextStyles"], ["p:otherStyle", lvlpPr, "a:defRPr", "attrs", "sz"]);
      //     kern = getTextByPathList(warpObj["slideMasterTextStyles"], ["p:otherStyle", lvlpPr, "a:defRPr", "attrs", "kern"]);
      // }
    }
    fontSize = parseInt(sz) / 100;
    if (
      isKerning &&
      kern !== undefined &&
      !isNaN(fontSize) &&
      fontSize - parseInt(kern) / 100 > parseInt(kern) / 100
    ) {
      fontSize = fontSize - parseInt(kern) / 100;
      //fontSize =  parseInt(kern) / 100;
    }
  }

  const baseline = getTextByPathList(node, ["a:rPr", "attrs", "baseline"]);
  if (baseline !== undefined && !isNaN(fontSize)) {
    const baselineVl = parseInt(baseline) / 100000;
    //fontSize -= 10;
    // fontSize = fontSize * baselineVl;
    fontSize -= baselineVl;
  }

  if (!isNaN(fontSize)) {
    const normAutofit = getTextByPathList(textBodyNode, [
      "a:bodyPr",
      "a:normAutofit",
      "attrs",
      "fontScale",
    ]);
    if (normAutofit !== undefined && Number(normAutofit) !== 0) {
      //console.log("fontSize", fontSize, "normAutofit: ", normAutofit, normAutofit/100000)
      fontSize = Math.round(fontSize * (normAutofit / 100000));
    }
  }

  return isNaN(fontSize)
    ? type === "br"
      ? "initial"
      : "inherit"
    : fontSize * fontSizeFactor + "px"; // + "pt");
}
