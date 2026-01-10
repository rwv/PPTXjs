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
  node: unknown,
  textBodyNode: Record<string, unknown> | undefined,
  pFontStyle: unknown,
  lvl: number | string,
  type: string | undefined,
  warpObj: {
    slideLayoutTables?: Record<string, unknown>;
    slideMasterTables?: Record<string, unknown>;
    slideMasterTextStyles?: Record<string, unknown>;
    defaultTextStyle?: Record<string, unknown>;
    [key: string]: unknown;
  },
  fontSizeFactor: number
): string {
  // if(type == "sldNum")
  //console.log("getFontSize node:", node, "lstStyle", lstStyle, "lvl:", lvl, 'type:', type, "warpObj:", warpObj)
  const lstStyle = textBodyNode !== undefined ? textBodyNode["a:lstStyle"] : undefined;
  const lvlpPr = "a:lvl" + lvl + "pPr";
  let fontSize: number | undefined = undefined;
  let sz: string | number | undefined;
  let kern: string | number | undefined;
  const runSize = getTextByPathList<string>(node, ["a:rPr", "attrs", "sz"]);
  if (runSize !== undefined) {
    fontSize = parseInt(runSize) / 100;
  }
  const fldNode = getTextByPathList<Record<string, unknown>>(node, ["a:fld"]);
  if (isNaN(fontSize) || (fontSize === undefined && fldNode !== undefined)) {
    sz = getTextByPathList<string>(fldNode, ["a:rPr", "attrs", "sz"]);
    fontSize = parseInt(String(sz)) / 100;
  }
  const nodeText = getTextByPathList<string>(node, ["a:t"]);
  if ((isNaN(fontSize) || fontSize === undefined) && nodeText === undefined) {
    sz = getTextByPathList<string>(node, ["a:endParaRPr", "attrs", "sz"]);
    fontSize = parseInt(String(sz)) / 100;
  }
  if ((isNaN(fontSize) || fontSize === undefined) && lstStyle !== undefined) {
    sz = getTextByPathList<string>(lstStyle, [lvlpPr, "a:defRPr", "attrs", "sz"]);
    fontSize = parseInt(String(sz)) / 100;
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
    sz = getTextByPathList<string>(warpObj["slideLayoutTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      lvlpPr,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    fontSize = parseInt(String(sz)) / 100;
    kern = getTextByPathList<string>(warpObj["slideLayoutTables"], [
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
      fontSize - parseInt(String(kern)) / 100 > 0
    ) {
      fontSize = fontSize - parseInt(String(kern)) / 100;
    }
  }

  if (isNaN(fontSize) || fontSize === undefined) {
    // if (type == "shape" || type == "textBox") {
    //     type = "body";
    //     lvlpPr = "a:lvl1pPr";
    // }
    sz = getTextByPathList<string>(warpObj["slideMasterTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      lvlpPr,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    kern = getTextByPathList<string>(warpObj["slideMasterTables"], [
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
        sz = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:titleStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kern = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
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
        sz = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:bodyStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kern = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:bodyStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
      } else if (type === "shape") {
        //textBox and shape text does not indent
        sz = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:otherStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kern = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:otherStyle",
          lvlpPr,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
        isKerning = false;
      }

      if (sz === undefined) {
        sz = getTextByPathList<string>(warpObj["defaultTextStyle"], [
          lvlpPr,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kern =
          kern === undefined
            ? getTextByPathList<string>(warpObj["defaultTextStyle"], [
                lvlpPr,
                "a:defRPr",
                "attrs",
                "kern",
              ])
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
    fontSize = parseInt(String(sz)) / 100;
    if (
      isKerning &&
      kern !== undefined &&
      !isNaN(fontSize) &&
      fontSize - parseInt(String(kern)) / 100 > parseInt(String(kern)) / 100
    ) {
      fontSize = fontSize - parseInt(String(kern)) / 100;
      //fontSize =  parseInt(kern) / 100;
    }
  }

  const baseline = getTextByPathList<string>(node, ["a:rPr", "attrs", "baseline"]);
  if (baseline !== undefined && !isNaN(fontSize)) {
    const baselineVl = parseInt(String(baseline)) / 100000;
    //fontSize -= 10;
    // fontSize = fontSize * baselineVl;
    fontSize -= baselineVl;
  }

  if (!isNaN(fontSize)) {
    const normAutofit = getTextByPathList<string | number>(textBodyNode, [
      "a:bodyPr",
      "a:normAutofit",
      "attrs",
      "fontScale",
    ]);
    const normAutofitValue = normAutofit !== undefined ? Number(normAutofit) : 0;
    if (normAutofitValue !== 0) {
      //console.log("fontSize", fontSize, "normAutofit: ", normAutofit, normAutofit/100000)
      fontSize = Math.round(fontSize * (normAutofitValue / 100000));
    }
  }

  return isNaN(fontSize)
    ? type === "br"
      ? "initial"
      : "inherit"
    : fontSize * fontSizeFactor + "px"; // + "pt");
}
