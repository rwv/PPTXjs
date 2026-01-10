import { getTextByPathList } from "../object/get-text-by-path-list";
import { getFontSize } from "../font/get-font-size";

/**
 * Calculates vertical margin/padding CSS styling for a PPTX paragraph node
 *
 * Handles spacing with fallback hierarchy:
 * 1. Paragraph-level spacing (highest priority)
 * 2. Layout-level spacing
 * 3. Master slide text styles (lowest priority)
 *
 * Computes three types of spacing:
 * - spacing before paragraph (margin-top)
 * - spacing after paragraph (margin-bottom)
 * - line spacing (padding-top/padding-bottom)
 *
 * Line spacing can be:
 * - Percentage based (a:spcPct) - calculated relative to font size
 * - Points based (a:spcPts) - absolute value
 *
 * @param pNode - Paragraph node from PPTX
 * @param textBodyNode - Text body node containing list styles
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param idx - Layout index for fallback lookup
 * @param warpObj - Container object with layout tables and master styles
 * @param fontSizeFactor - Font size multiplier factor (usually 4/3.2)
 * @returns CSS string with margin and padding styles
 */
export function getVerticalMargins(
  paragraphNode: Record<string, unknown>,
  textBodyNode: Record<string, unknown> | undefined,
  type: string | undefined,
  idx: number | string | undefined,
  warpObj: Record<string, unknown>,
  fontSizeFactor: number
): string {
  //margin-top ;
  //a:pPr => a:spcBef => a:spcPts (/100) | a:spcPct (/?)
  //margin-bottom
  //a:pPr => a:spcAft => a:spcPts (/100) | a:spcPct (/?)
  //+
  //a:pPr =>a:lnSpc => a:spcPts (/?) | a:spcPct (/?)
  //console.log("getVerticalMargins ", paragraphNode, type,idx, warpObj)
  //var lstStyle = textBodyNode["a:lstStyle"];
  let level = 1;
  let spaceBeforeNode = getTextByPathList(paragraphNode, [
    "a:pPr",
    "a:spcBef",
    "a:spcPts",
    "attrs",
    "val",
  ]);
  let spaceAfterNode = getTextByPathList(paragraphNode, [
    "a:pPr",
    "a:spcAft",
    "a:spcPts",
    "attrs",
    "val",
  ]);
  let lineSpacingNode = getTextByPathList(paragraphNode, [
    "a:pPr",
    "a:lnSpc",
    "a:spcPct",
    "attrs",
    "val",
  ]);
  let lineSpacingNodeType = "Pct";
  if (lineSpacingNode === undefined) {
    lineSpacingNode = getTextByPathList(paragraphNode, [
      "a:pPr",
      "a:lnSpc",
      "a:spcPts",
      "attrs",
      "val",
    ]);
    if (lineSpacingNode !== undefined) {
      lineSpacingNodeType = "Pts";
    }
  }
  const levelNode = getTextByPathList(paragraphNode, ["a:pPr", "attrs", "lvl"]);
  if (levelNode !== undefined) {
    level = parseInt(levelNode) + 1;
  }
  let fontSizePt;
  if (getTextByPathList(paragraphNode, ["a:r"]) !== undefined) {
    const fontSizeStr = getFontSize(
      paragraphNode["a:r"],
      textBodyNode,
      undefined,
      level,
      type,
      warpObj,
      fontSizeFactor
    );
    if (fontSizeStr !== "inherit") {
      const parsedFontSize = Number.parseFloat(fontSizeStr);
      if (!Number.isNaN(parsedFontSize)) {
        fontSizePt = parsedFontSize; //pt
      }
    }
  }
  //var spcBef = "";
  //console.log("getVerticalMargins 1", fontSizeStr, fontSizePt, lineSpacingNode, parseInt(lineSpacingNode) / 100000, spaceBeforeNode, spaceAfterNode)
  // if(spcBefNode !== undefined){
  //     spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "pt;"
  // }
  // else{
  //    //i did not found case with percentage
  //     spcBefNode = getTextByPathList(pNode, ["a:pPr", "a:spcBef", "a:spcPct","attrs","val"]);
  //     if(spcBefNode !== undefined){
  //         spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "%;"
  //     }
  // }
  //var spcAft = "";
  // if(spcAftNode !== undefined){
  //     spcAft = "margin-bottom:" + parseInt(spcAftNode)/100 + "pt;"
  // }
  // else{
  //    //i did not found case with percentage
  //     spcAftNode = getTextByPathList(pNode, ["a:pPr", "a:spcAft", "a:spcPct","attrs","val"]);
  //     if(spcAftNode !== undefined){
  //         spcBef = "margin-bottom:" + parseInt(spcAftNode)/100 + "%;"
  //     }
  // }
  // if(spcAftNode !== undefined){
  //     //check in layout and then in master
  // }
  let isInLayoutOrMaster = true;
  if (type === "shape" || type === "textBox") {
    isInLayoutOrMaster = false;
  }
  if (
    isInLayoutOrMaster &&
    (spaceBeforeNode === undefined || spaceAfterNode === undefined || lineSpacingNode === undefined)
  ) {
    //check in layout
    if (idx !== undefined) {
      const layoutParagraphPropsNode = getTextByPathList(warpObj, [
        "slideLayoutTables",
        "idxTable",
        idx,
        "p:txBody",
        "a:p",
        level - 1,
        "a:pPr",
      ]);

      if (spaceBeforeNode === undefined) {
        spaceBeforeNode = getTextByPathList(layoutParagraphPropsNode, [
          "a:spcBef",
          "a:spcPts",
          "attrs",
          "val",
        ]);
        // if(spcBefNode !== undefined){
        //     spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "pt;"
        // }
        // else{
        //    //i did not found case with percentage
        //     spcBefNode = getTextByPathList(laypPrNode, ["a:spcBef", "a:spcPct","attrs","val"]);
        //     if(spcBefNode !== undefined){
        //         spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "%;"
        //     }
        // }
      }

      if (spaceAfterNode === undefined) {
        spaceAfterNode = getTextByPathList(layoutParagraphPropsNode, [
          "a:spcAft",
          "a:spcPts",
          "attrs",
          "val",
        ]);
        // if(spcAftNode !== undefined){
        //     spcAft = "margin-bottom:" + parseInt(spcAftNode)/100 + "pt;"
        // }
        // else{
        //    //i did not found case with percentage
        //     spcAftNode = getTextByPathList(laypPrNode, ["a:spcAft", "a:spcPct","attrs","val"]);
        //     if(spcAftNode !== undefined){
        //         spcBef = "margin-bottom:" + parseInt(spcAftNode)/100 + "%;"
        //     }
        // }
      }

      if (lineSpacingNode === undefined) {
        lineSpacingNode = getTextByPathList(layoutParagraphPropsNode, [
          "a:lnSpc",
          "a:spcPct",
          "attrs",
          "val",
        ]);
        if (lineSpacingNode === undefined) {
          lineSpacingNode = getTextByPathList(layoutParagraphPropsNode, [
            "a:pPr",
            "a:lnSpc",
            "a:spcPts",
            "attrs",
            "val",
          ]);
          if (lineSpacingNode !== undefined) {
            lineSpacingNodeType = "Pts";
          }
        }
      }
    }
  }
  if (
    isInLayoutOrMaster &&
    (spaceBeforeNode === undefined || spaceAfterNode === undefined || lineSpacingNode === undefined)
  ) {
    //check in master
    //slideMasterTextStyles
    const slideMasterTextStyles = warpObj["slideMasterTextStyles"];
    let styleKey = "";
    const levelKey = "a:lvl" + level + "pPr";
    switch (type) {
      case "title":
      case "ctrTitle":
        styleKey = "p:titleStyle";
        break;
      case "body":
      case "obj":
      case "dt":
      case "ftr":
      case "sldNum":
      case "textBox":
        // case "shape":
        styleKey = "p:bodyStyle";
        break;
      case "shape":
        //case "textBox":
        styleKey = "p:otherStyle";
        break;
      default:
        styleKey = "p:otherStyle";
    }
    // if (type === "shape" || type === "textBox") {
    //     lvlKey = "a:lvl1pPr";
    // }
    const levelStyleNode = getTextByPathList(slideMasterTextStyles, [styleKey, levelKey]);
    if (levelStyleNode !== undefined) {
      if (spaceBeforeNode === undefined) {
        spaceBeforeNode = getTextByPathList(levelStyleNode, [
          "a:spcBef",
          "a:spcPts",
          "attrs",
          "val",
        ]);
        // if(spcBefNode !== undefined){
        //     spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "pt;"
        // }
        // else{
        //    //i did not found case with percentage
        //     spcBefNode = getTextByPathList(inLvlNode, ["a:spcBef", "a:spcPct","attrs","val"]);
        //     if(spcBefNode !== undefined){
        //         spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "%;"
        //     }
        // }
      }

      if (spaceAfterNode === undefined) {
        spaceAfterNode = getTextByPathList(levelStyleNode, [
          "a:spcAft",
          "a:spcPts",
          "attrs",
          "val",
        ]);
        // if(spcAftNode !== undefined){
        //     spcAft = "margin-bottom:" + parseInt(spcAftNode)/100 + "pt;"
        // }
        // else{
        //    //i did not found case with percentage
        //     spcAftNode = getTextByPathList(inLvlNode, ["a:spcAft", "a:spcPct","attrs","val"]);
        //     if(spcAftNode !== undefined){
        //         spcBef = "margin-bottom:" + parseInt(spcAftNode)/100 + "%;"
        //     }
        // }
      }

      if (lineSpacingNode === undefined) {
        lineSpacingNode = getTextByPathList(levelStyleNode, [
          "a:lnSpc",
          "a:spcPct",
          "attrs",
          "val",
        ]);
        if (lineSpacingNode === undefined) {
          lineSpacingNode = getTextByPathList(levelStyleNode, [
            "a:pPr",
            "a:lnSpc",
            "a:spcPts",
            "attrs",
            "val",
          ]);
          if (lineSpacingNode !== undefined) {
            lineSpacingNodeType = "Pts";
          }
        }
      }
    }
  }
  let spaceBefore = 0,
    spaceAfter = 0,
    lineSpacingPadding = 0;
  let marginStyles = "";
  if (spaceBeforeNode !== undefined) {
    spaceBefore = parseInt(spaceBeforeNode) / 100;
  }
  if (spaceAfterNode !== undefined) {
    spaceAfter = parseInt(spaceAfterNode) / 100;
  }

  if (lineSpacingNode !== undefined && fontSizePt !== undefined) {
    if (lineSpacingNodeType === "Pts") {
      marginStyles += "padding-top: " + (parseInt(lineSpacingNode) / 100 - fontSizePt) + "px;"; //+ "pt;";
    } else {
      const spacingFactor = parseInt(lineSpacingNode) / 100000;
      lineSpacingPadding = fontSizePt * (spacingFactor - 1) - fontSizePt; // fontSize *
      const paddingTop = spacingFactor > 1 ? fontSizePt : 0;
      // marginTopBottomStr += "padding-top: " + spcLines + "pt;";
      // marginTopBottomStr += "padding-bottom: " + pBottom + "pt;";
      marginStyles += "padding-top: " + paddingTop + "px;"; // + "pt;";
      marginStyles += "padding-bottom: " + lineSpacingPadding + "px;"; // + "pt;";
    }
  }

  //if (spcBefNode !== undefined || lnSpcNode !== undefined) {
  marginStyles += "margin-top: " + (spaceBefore - 1) + "px;"; // + "pt;"; //margin-top: + spcLines // minus 1 - to fix space
  //}
  if (spaceAfterNode !== undefined || lineSpacingNode !== undefined) {
    //marginTopBottomStr += "margin-bottom: " + ((spcAfter - fontSize < 0) ? 0 : (spcAfter - fontSize)) + "pt;"; //margin-bottom: + spcLines
    //marginTopBottomStr += "margin-bottom: " + spcAfter * (1 / 4) + "px;";// + "pt;";
    marginStyles += "margin-bottom: " + spaceAfter + "px;"; // + "pt;";
  }

  //console.log("getVerticalMargins 2 fontSize:", fontSizePt, "lnSpcNode:", lineSpacingNode, "spcLines:", lineSpacingPadding, "spcBefor:", spaceBefore, "spcAfter:", spaceAfter)
  //console.log("getVerticalMargins 3 ", marginStyles, paragraphNode, warpObj)

  //return spcAft + spcBef;
  return marginStyles;
}
