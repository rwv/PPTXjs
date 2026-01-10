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
 * @param listLevel - List level (1-based)
 * @param shapeType - Shape type (title, body, textBox, shape, etc.)
 * @param warpContext - Container object with layout tables and master styles
 * @returns Font size as CSS string (e.g., "12px") or "inherit"/"initial"
 */
export function getFontSize(
  textRunNode: unknown,
  textBodyNode: Record<string, unknown> | undefined,
  paragraphFontStyle: unknown,
  listLevel: number | string,
  shapeType: string | undefined,
  warpContext: {
    slideLayoutTables?: Record<string, unknown>;
    slideMasterTables?: Record<string, unknown>;
    slideMasterTextStyles?: Record<string, unknown>;
    defaultTextStyle?: Record<string, unknown>;
    [key: string]: unknown;
  },
  fontSizeScale: number
): string {
  // if (shapeType === "sldNum")
  //console.log("getFontSize node:", textRunNode, "listStyleNode", listStyleNode, "listLevel:", listLevel, 'shapeType:', shapeType, "warpContext:", warpContext)
  void paragraphFontStyle;
  const listStyleNode = textBodyNode !== undefined ? textBodyNode["a:lstStyle"] : undefined;
  const listLevelKey = "a:lvl" + listLevel + "pPr";
  let fontSizePoints: number | undefined = undefined;
  let fontSizeValue: string | number | undefined;
  let kerningValue: string | number | undefined;
  const runSizeValue = getTextByPathList<string>(textRunNode, ["a:rPr", "attrs", "sz"]);
  if (runSizeValue !== undefined) {
    fontSizePoints = parseInt(runSizeValue) / 100;
  }
  const fieldRunNode = getTextByPathList<Record<string, unknown>>(textRunNode, ["a:fld"]);
  if (isNaN(fontSizePoints) || (fontSizePoints === undefined && fieldRunNode !== undefined)) {
    fontSizeValue = getTextByPathList<string>(fieldRunNode, ["a:rPr", "attrs", "sz"]);
    fontSizePoints = parseInt(String(fontSizeValue)) / 100;
  }
  const textContent = getTextByPathList<string>(textRunNode, ["a:t"]);
  if ((isNaN(fontSizePoints) || fontSizePoints === undefined) && textContent === undefined) {
    fontSizeValue = getTextByPathList<string>(textRunNode, ["a:endParaRPr", "attrs", "sz"]);
    fontSizePoints = parseInt(String(fontSizeValue)) / 100;
  }
  if ((isNaN(fontSizePoints) || fontSizePoints === undefined) && listStyleNode !== undefined) {
    fontSizeValue = getTextByPathList<string>(listStyleNode, [
      listLevelKey,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    fontSizePoints = parseInt(String(fontSizeValue)) / 100;
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
  if (isNaN(fontSizePoints) || fontSizePoints === undefined) {
    // if (shapeType === "shape" || shapeType === "textBox") {
    //     shapeType = "body";
    //     lvlpPr = "a:lvl1pPr";
    // }
    fontSizeValue = getTextByPathList<string>(warpContext["slideLayoutTables"], [
      "typeTable",
      shapeType,
      "p:txBody",
      "a:lstStyle",
      listLevelKey,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    fontSizePoints = parseInt(String(fontSizeValue)) / 100;
    kerningValue = getTextByPathList<string>(warpContext["slideLayoutTables"], [
      "typeTable",
      shapeType,
      "p:txBody",
      "a:lstStyle",
      listLevelKey,
      "a:defRPr",
      "attrs",
      "kern",
    ]);
    if (
      shouldApplyKerning &&
      kerningValue !== undefined &&
      !isNaN(fontSizePoints) &&
      fontSizePoints - parseInt(String(kerningValue)) / 100 > 0
    ) {
      fontSizePoints = fontSizePoints - parseInt(String(kerningValue)) / 100;
    }
  }

  if (isNaN(fontSizePoints) || fontSizePoints === undefined) {
    // if (shapeType === "shape" || shapeType === "textBox") {
    //     shapeType = "body";
    //     lvlpPr = "a:lvl1pPr";
    // }
    fontSizeValue = getTextByPathList<string>(warpContext["slideMasterTables"], [
      "typeTable",
      shapeType,
      "p:txBody",
      "a:lstStyle",
      listLevelKey,
      "a:defRPr",
      "attrs",
      "sz",
    ]);
    kerningValue = getTextByPathList<string>(warpContext["slideMasterTables"], [
      "typeTable",
      shapeType,
      "p:txBody",
      "a:lstStyle",
      listLevelKey,
      "a:defRPr",
      "attrs",
      "kern",
    ]);
    if (fontSizeValue === undefined) {
      if (shapeType === "title" || shapeType === "subTitle" || shapeType === "ctrTitle") {
        fontSizeValue = getTextByPathList<string>(warpContext["slideMasterTextStyles"], [
          "p:titleStyle",
          listLevelKey,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kerningValue = getTextByPathList<string>(warpContext["slideMasterTextStyles"], [
          "p:titleStyle",
          listLevelKey,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
      } else if (
        shapeType === "body" ||
        shapeType === "obj" ||
        shapeType === "dt" ||
        shapeType === "sldNum" ||
        shapeType === "textBox"
      ) {
        fontSizeValue = getTextByPathList<string>(warpContext["slideMasterTextStyles"], [
          "p:bodyStyle",
          listLevelKey,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kerningValue = getTextByPathList<string>(warpContext["slideMasterTextStyles"], [
          "p:bodyStyle",
          listLevelKey,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
      } else if (shapeType === "shape") {
        //textBox and shape text does not indent
        fontSizeValue = getTextByPathList<string>(warpContext["slideMasterTextStyles"], [
          "p:otherStyle",
          listLevelKey,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kerningValue = getTextByPathList<string>(warpContext["slideMasterTextStyles"], [
          "p:otherStyle",
          listLevelKey,
          "a:defRPr",
          "attrs",
          "kern",
        ]);
        shouldApplyKerning = false;
      }

      if (fontSizeValue === undefined) {
        fontSizeValue = getTextByPathList<string>(warpContext["defaultTextStyle"], [
          listLevelKey,
          "a:defRPr",
          "attrs",
          "sz",
        ]);
        kerningValue =
          kerningValue === undefined
            ? getTextByPathList<string>(warpContext["defaultTextStyle"], [
                listLevelKey,
                "a:defRPr",
                "attrs",
                "kern",
              ])
            : undefined;
        shouldApplyKerning = false;
      }
      //  else if (shapeType === undefined || shapeType === "shape") {
      //     sz = getTextByPathList(warpContext["slideMasterTextStyles"], ["p:otherStyle", lvlpPr, "a:defRPr", "attrs", "sz"]);
      //     kern = getTextByPathList(warpContext["slideMasterTextStyles"], ["p:otherStyle", lvlpPr, "a:defRPr", "attrs", "kern"]);
      // }
      // else if (shapeType === "textBox") {
      //     sz = getTextByPathList(warpContext["slideMasterTextStyles"], ["p:otherStyle", lvlpPr, "a:defRPr", "attrs", "sz"]);
      //     kern = getTextByPathList(warpContext["slideMasterTextStyles"], ["p:otherStyle", lvlpPr, "a:defRPr", "attrs", "kern"]);
      // }
    }
    fontSizePoints = parseInt(String(fontSizeValue)) / 100;
    if (
      shouldApplyKerning &&
      kerningValue !== undefined &&
      !isNaN(fontSizePoints) &&
      fontSizePoints - parseInt(String(kerningValue)) / 100 > parseInt(String(kerningValue)) / 100
    ) {
      fontSizePoints = fontSizePoints - parseInt(String(kerningValue)) / 100;
      //fontSize =  parseInt(kerningValue) / 100;
    }
  }

  const baselineValue = getTextByPathList<string>(textRunNode, ["a:rPr", "attrs", "baseline"]);
  if (baselineValue !== undefined && !isNaN(fontSizePoints)) {
    const baselineOffset = parseInt(String(baselineValue)) / 100000;
    //fontSize -= 10;
    // fontSize = fontSize * baselineVl;
    fontSizePoints -= baselineOffset;
  }

  if (!isNaN(fontSizePoints)) {
    const normalAutofit = getTextByPathList<string | number>(textBodyNode, [
      "a:bodyPr",
      "a:normAutofit",
      "attrs",
      "fontScale",
    ]);
    const normalAutofitScale = normalAutofit !== undefined ? Number(normalAutofit) : 0;
    if (normalAutofitScale !== 0) {
      //console.log("fontSize", fontSize, "normAutofit: ", normalAutofit, normAutofit/100000)
      fontSizePoints = Math.round(fontSizePoints * (normalAutofitScale / 100000));
    }
  }

  return isNaN(fontSizePoints)
    ? shapeType === "br"
      ? "initial"
      : "inherit"
    : fontSizePoints * fontSizeScale + "px"; // + "pt");
}
