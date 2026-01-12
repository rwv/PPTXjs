import { getTextByPathList } from "../object/get-text-by-path-list";
import { getFontSize } from "../font/get-font-size";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

function asString(value: XmlValue | undefined): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return undefined;
}

function firstXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : undefined;
  }
  return asXmlNode(value);
}

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
 * @param paragraphNode - Paragraph node from PPTX
 * @param textBodyNode - Text body node containing list styles
 * @param shapeType - Shape type (title, body, textBox, shape, etc.)
 * @param layoutIndex - Layout index for fallback lookup
 * @param warpContext - Container object with layout tables and master styles
 * @param fontSizeScale - Font size multiplier factor (usually 4/3.2)
 * @returns CSS string with margin and padding styles
 */
export function getVerticalMargins(
  paragraphNode: XmlNode,
  textBodyNode: XmlNode | undefined,
  shapeType: string | undefined,
  layoutIndex: number | string | undefined,
  warpContext: WarpContext,
  fontSizeScale: number
): string {
  //margin-top ;
  //a:pPr => a:spcBef => a:spcPts (/100) | a:spcPct (/?)
  //margin-bottom
  //a:pPr => a:spcAft => a:spcPts (/100) | a:spcPct (/?)
  //+
  //a:pPr =>a:lnSpc => a:spcPts (/?) | a:spcPct (/?)
  //console.log("getVerticalMargins ", paragraphNode, shapeType, layoutIndex, warpContext)
  //var lstStyle = textBodyNode["a:lstStyle"];
  let listLevel = 1;
  let spaceBeforeValue = getTextByPathList<string | number>(paragraphNode, [
    "a:pPr",
    "a:spcBef",
    "a:spcPts",
    "attrs",
    "val",
  ]);
  let spaceAfterValue = getTextByPathList<string | number>(paragraphNode, [
    "a:pPr",
    "a:spcAft",
    "a:spcPts",
    "attrs",
    "val",
  ]);
  let lineSpacingValue = getTextByPathList<string | number>(paragraphNode, [
    "a:pPr",
    "a:lnSpc",
    "a:spcPct",
    "attrs",
    "val",
  ]);
  let lineSpacingUnit = "Pct";
  if (lineSpacingValue === undefined) {
    lineSpacingValue = getTextByPathList<string | number>(paragraphNode, [
      "a:pPr",
      "a:lnSpc",
      "a:spcPts",
      "attrs",
      "val",
    ]);
    if (lineSpacingValue !== undefined) {
      lineSpacingUnit = "Pts";
    }
  }
  const levelAttr = getTextByPathList<string | number>(paragraphNode, ["a:pPr", "attrs", "lvl"]);
  if (levelAttr !== undefined) {
    listLevel = parseInt(String(levelAttr), 10) + 1;
  }
  let fontSizePoints: number | undefined;
  const textRunNode = firstXmlNode(getTextByPathList(paragraphNode, ["a:r"]));
  if (textRunNode !== undefined) {
    const fontSizeValue = getFontSize(
      textRunNode,
      textBodyNode,
      undefined,
      listLevel,
      shapeType,
      warpContext,
      fontSizeScale
    );
    if (fontSizeValue !== "inherit") {
      const parsedFontSize = Number.parseFloat(fontSizeValue);
      if (!Number.isNaN(parsedFontSize)) {
        fontSizePoints = parsedFontSize; //pt
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
  let shouldCheckLayoutOrMaster = true;
  if (shapeType === "shape" || shapeType === "textBox") {
    shouldCheckLayoutOrMaster = false;
  }
  if (
    shouldCheckLayoutOrMaster &&
    (spaceBeforeValue === undefined ||
      spaceAfterValue === undefined ||
      lineSpacingValue === undefined)
  ) {
    //check in layout
    if (layoutIndex !== undefined) {
      const layoutParagraphProps = asXmlNode(
        getTextByPathList(warpContext as unknown as XmlNode, [
          "slideLayoutTables",
          "idxTable",
          layoutIndex,
          "p:txBody",
          "a:p",
          listLevel - 1,
          "a:pPr",
        ])
      );

      if (spaceBeforeValue === undefined) {
        spaceBeforeValue = layoutParagraphProps
          ? getTextByPathList<string | number>(layoutParagraphProps, [
              "a:spcBef",
              "a:spcPts",
              "attrs",
              "val",
            ])
          : undefined;
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

      if (spaceAfterValue === undefined) {
        spaceAfterValue = layoutParagraphProps
          ? getTextByPathList<string | number>(layoutParagraphProps, [
              "a:spcAft",
              "a:spcPts",
              "attrs",
              "val",
            ])
          : undefined;
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

      if (lineSpacingValue === undefined) {
        lineSpacingValue = layoutParagraphProps
          ? getTextByPathList<string | number>(layoutParagraphProps, [
              "a:lnSpc",
              "a:spcPct",
              "attrs",
              "val",
            ])
          : undefined;
        if (lineSpacingValue === undefined) {
          lineSpacingValue = layoutParagraphProps
            ? getTextByPathList<string | number>(layoutParagraphProps, [
                "a:pPr",
                "a:lnSpc",
                "a:spcPts",
                "attrs",
                "val",
              ])
            : undefined;
          if (lineSpacingValue !== undefined) {
            lineSpacingUnit = "Pts";
          }
        }
      }
    }
  }
  if (
    shouldCheckLayoutOrMaster &&
    (spaceBeforeValue === undefined ||
      spaceAfterValue === undefined ||
      lineSpacingValue === undefined)
  ) {
    //check in master
    //slideMasterTextStyles
    const masterTextStyles = warpContext.slideMasterTextStyles;
    let styleKey = "";
    const listLevelKey = "a:lvl" + listLevel + "pPr";
    switch (shapeType) {
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
    const listLevelStyle = masterTextStyles
      ? asXmlNode(getTextByPathList(masterTextStyles, [styleKey, listLevelKey]))
      : undefined;
    if (listLevelStyle !== undefined) {
      if (spaceBeforeValue === undefined) {
        spaceBeforeValue = getTextByPathList<string | number>(listLevelStyle, [
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

      if (spaceAfterValue === undefined) {
        spaceAfterValue = getTextByPathList<string | number>(listLevelStyle, [
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

      if (lineSpacingValue === undefined) {
        lineSpacingValue = getTextByPathList<string | number>(listLevelStyle, [
          "a:lnSpc",
          "a:spcPct",
          "attrs",
          "val",
        ]);
        if (lineSpacingValue === undefined) {
          lineSpacingValue = getTextByPathList<string | number>(listLevelStyle, [
            "a:pPr",
            "a:lnSpc",
            "a:spcPts",
            "attrs",
            "val",
          ]);
          if (lineSpacingValue !== undefined) {
            lineSpacingUnit = "Pts";
          }
        }
      }
    }
  }
  let spaceBeforePx = 0,
    spaceAfterPx = 0,
    lineSpacingPaddingPx = 0;
  let marginCss = "";
  if (spaceBeforeValue !== undefined) {
    const spaceBeforeText = asString(spaceBeforeValue);
    if (spaceBeforeText !== undefined) {
      spaceBeforePx = parseInt(spaceBeforeText, 10) / 100;
    }
  }
  if (spaceAfterValue !== undefined) {
    const spaceAfterText = asString(spaceAfterValue);
    if (spaceAfterText !== undefined) {
      spaceAfterPx = parseInt(spaceAfterText, 10) / 100;
    }
  }

  if (lineSpacingValue !== undefined && fontSizePoints !== undefined) {
    const lineSpacingText = asString(lineSpacingValue);
    if (lineSpacingText !== undefined) {
      if (lineSpacingUnit === "Pts") {
        marginCss +=
          "padding-top: " + (parseInt(lineSpacingText, 10) / 100 - fontSizePoints) + "px;"; //+ "pt;";
      } else {
        const lineSpacingFactor = parseInt(lineSpacingText, 10) / 100000;
        lineSpacingPaddingPx = fontSizePoints * (lineSpacingFactor - 1) - fontSizePoints; // fontSize *
        const paddingTopPx = lineSpacingFactor > 1 ? fontSizePoints : 0;
        // marginTopBottomStr += "padding-top: " + spcLines + "pt;";
        // marginTopBottomStr += "padding-bottom: " + pBottom + "pt;";
        marginCss += "padding-top: " + paddingTopPx + "px;"; // + "pt;";
        marginCss += "padding-bottom: " + lineSpacingPaddingPx + "px;"; // + "pt;";
      }
    }
  }

  //if (spcBefNode !== undefined || lnSpcNode !== undefined) {
  marginCss += "margin-top: " + (spaceBeforePx - 1) + "px;"; // + "pt;"; //margin-top: + spcLines // minus 1 - to fix space
  //}
  if (spaceAfterValue !== undefined || lineSpacingValue !== undefined) {
    //marginTopBottomStr += "margin-bottom: " + ((spcAfter - fontSize < 0) ? 0 : (spcAfter - fontSize)) + "pt;"; //margin-bottom: + spcLines
    //marginTopBottomStr += "margin-bottom: " + spcAfter * (1 / 4) + "px;";// + "pt;";
    marginCss += "margin-bottom: " + spaceAfterPx + "px;"; // + "pt;";
  }

  //console.log("getVerticalMargins 2 fontSize:", fontSizePoints, "lnSpcNode:", lineSpacingValue, "spcLines:", lineSpacingPaddingPx, "spcBefor:", spaceBeforePx, "spcAfter:", spaceAfterPx)
  //console.log("getVerticalMargins 3 ", marginCss, paragraphNode, warpContext)

  //return spcAft + spcBef;
  return marginCss;
}
