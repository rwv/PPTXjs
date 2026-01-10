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
 * @param textRunNode - Text run node from PPTX
 * @param textBodyNode - Text body node containing list styles
 * @param paragraphFontStyle - Paragraph font style (unused but kept for consistency)
 * @param level - List level (1-based)
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param warpObj - Container object with layout tables and master styles
 * @returns Font size as CSS string (e.g., "12px") or "inherit"/"initial"
 */
export function getFontSize(
  textRunNode: unknown,
  textBodyNode: Record<string, unknown> | undefined,
  paragraphFontStyle: unknown,
  level: number | string,
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
  //console.log("getFontSize node:", textRunNode, "listStyleNode", listStyleNode, "level:", level, 'type:', type, "warpObj:", warpObj)
  void paragraphFontStyle;
  const listStyleNode = textBodyNode !== undefined ? textBodyNode["a:lstStyle"] : undefined;
  const levelKey = "a:lvl" + level + "pPr";
  let fontSizePt: number | undefined = undefined;
  let sizeValue: string | number | undefined;
  let kerningValue: string | number | undefined;
  const runSizeValue = getTextByPathList<string>(textRunNode, ["a:rPr", "attrs", "sz"]);
  if (runSizeValue !== undefined) {
    fontSizePt = parseInt(runSizeValue) / 100;
  }
  const fieldNode = getTextByPathList<Record<string, unknown>>(textRunNode, ["a:fld"]);
  if (isNaN(fontSizePt) || (fontSizePt === undefined && fieldNode !== undefined)) {
    sizeValue = getTextByPathList<string>(fieldNode, ["a:rPr", "attrs", "sz"]);
    fontSizePt = parseInt(String(sizeValue)) / 100;
  }
  const textContent = getTextByPathList<string>(textRunNode, ["a:t"]);
  if ((isNaN(fontSizePt) || fontSizePt === undefined) && textContent === undefined) {
    sizeValue = getTextByPathList<string>(textRunNode, ["a:endParaRPr", "attrs", "sz"]);
    fontSizePt = parseInt(String(sizeValue)) / 100;
  }
  if ((isNaN(fontSizePt) || fontSizePt === undefined) && listStyleNode !== undefined) {
    sizeValue = getTextByPathList<string>(listStyleNode, [levelKey, "a:defRPr", "attrs", "sz"]);
    fontSizePt = parseInt(String(sizeValue)) / 100;
  }
  let shouldApplyKerning = false;
  if (textBodyNode !== undefined) {
    const shapeAutoFitNode = getTextByPathList(textBodyNode, ["a:bodyPr", "a:spAutoFit"]);
    // if (spAutoFitNode === undefined) {
    //     spAutoFitNode = getTextByPathList(textBodyNode, ["a:bodyPr", "a:normAutofit"]);
    // }
    if (shapeAutoFitNode !== undefined) {
      shouldApplyKerning = true;
    }
  }
  if (isNaN(fontSizePt) || fontSizePt === undefined) {
    // if (type == "shape" || type == "textBox") {
    //     type = "body";
    //     lvlpPr = "a:lvl1pPr";
    // }
    sizeValue = getTextByPathList<string>(warpObj["slideLayoutTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      levelKey,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    fontSizePt = parseInt(String(sizeValue)) / 100;
    kerningValue = getTextByPathList<string>(warpObj["slideLayoutTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      levelKey,
      "a:defRPr",
      "attrs",
      "kern",
    ]);
    if (
      shouldApplyKerning &&
      kerningValue !== undefined &&
      !isNaN(fontSizePt) &&
      fontSizePt - parseInt(String(kerningValue)) / 100 > 0
    ) {
      fontSizePt = fontSizePt - parseInt(String(kerningValue)) / 100;
    }
  }

  if (isNaN(fontSizePt) || fontSizePt === undefined) {
    // if (type == "shape" || type == "textBox") {
    //     type = "body";
    //     lvlpPr = "a:lvl1pPr";
    // }
    sizeValue = getTextByPathList<string>(warpObj["slideMasterTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      levelKey,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    kerningValue = getTextByPathList<string>(warpObj["slideMasterTables"], [
      "typeTable",
      type,
      "p:txBody",
      "a:lstStyle",
      levelKey,
      "a:defRPr",
      "attrs",
      "kern",
    ]);
    if (sizeValue === undefined) {
      if (type === "title" || type === "subTitle" || type === "ctrTitle") {
        sizeValue = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:titleStyle",
          levelKey,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kerningValue = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:titleStyle",
          levelKey,
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
        sizeValue = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:bodyStyle",
          levelKey,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kerningValue = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:bodyStyle",
          levelKey,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
      } else if (type === "shape") {
        //textBox and shape text does not indent
        sizeValue = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:otherStyle",
          levelKey,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kerningValue = getTextByPathList<string>(warpObj["slideMasterTextStyles"], [
          "p:otherStyle",
          levelKey,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
        shouldApplyKerning = false;
      }

      if (sizeValue === undefined) {
        sizeValue = getTextByPathList<string>(warpObj["defaultTextStyle"], [
          levelKey,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kerningValue =
          kerningValue === undefined
            ? getTextByPathList<string>(warpObj["defaultTextStyle"], [
                levelKey,
                "a:defRPr",
                "attrs",
                "kern",
              ])
            : undefined;
        shouldApplyKerning = false;
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
    fontSizePt = parseInt(String(sizeValue)) / 100;
    if (
      shouldApplyKerning &&
      kerningValue !== undefined &&
      !isNaN(fontSizePt) &&
      fontSizePt - parseInt(String(kerningValue)) / 100 > parseInt(String(kerningValue)) / 100
    ) {
      fontSizePt = fontSizePt - parseInt(String(kerningValue)) / 100;
      //fontSize =  parseInt(kerningValue) / 100;
    }
  }

  const baselineValue = getTextByPathList<string>(textRunNode, ["a:rPr", "attrs", "baseline"]);
  if (baselineValue !== undefined && !isNaN(fontSizePt)) {
    const baselineOffset = parseInt(String(baselineValue)) / 100000;
    //fontSize -= 10;
    // fontSize = fontSize * baselineVl;
    fontSizePt -= baselineOffset;
  }

  if (!isNaN(fontSizePt)) {
    const normalAutofit = getTextByPathList<string | number>(textBodyNode, [
      "a:bodyPr",
      "a:normAutofit",
      "attrs",
      "fontScale",
    ]);
    const normalAutofitScale = normalAutofit !== undefined ? Number(normalAutofit) : 0;
    if (normalAutofitScale !== 0) {
      //console.log("fontSize", fontSize, "normAutofit: ", normalAutofit, normAutofit/100000)
      fontSizePt = Math.round(fontSizePt * (normalAutofitScale / 100000));
    }
  }

  return isNaN(fontSizePt)
    ? type === "br"
      ? "initial"
      : "inherit"
    : fontSizePt * fontSizeFactor + "px"; // + "pt");
}
