import { getTextByPathList } from "../object";
import { getLayoutAndMasterNode } from "../layout";
import { getSchemeColorFromTheme, getSolidFill } from "../color";
import {
  getFontColorPr,
  getFontSize,
  getFontType,
  getFontBold,
  getFontItalic,
  getFontDecoration,
} from "../font";
import { getTextHorizontalAlign, getTextVerticalAlign } from "../layout";
import { escapeHtml } from "../string";
import type { XmlNode } from "../../types/pptx-xml";

/**
 * Generate HTML span element for a text run with styling
 *
 * Handles text formatting including:
 * - Font properties (size, family, weight, style, decoration)
 * - Colors (solid, pattern, pic, gradient) with text-shadow and highlights
 * - Links (hyperlinks with tooltips)
 * - RTL/LTR text direction based on language and paragraph settings
 * - Letter spacing, text capitalization
 * - CSS class generation for style reuse
 *
 * @param runNode - Text run node (a:r) or paragraph node containing text
 * @param runIndex - Index of text run in paragraph (for direction logic)
 * @param paragraphNode - Parent paragraph node for property inheritance
 * @param textBodyNode - Text body node containing list styles
 * @param parentFontStyle - Parent font style for color/font inheritance
 * @param layoutShapeNode - Shape node from slide layout for fallback
 * @param placeholderIndex - Placeholder index for layout lookup
 * @param shapeType - Shape type for layout resolution
 * @param runNodeCount - Total number of runs in paragraph
 * @param warpContext - Warp object containing slide resources and styles
 * @param isBullet - Whether this text is part of a bulleted paragraph
 * @param styleTable - CSS style table for class generation (modified in place)
 * @param firstLineBreak - Object {value: boolean} tracking if this is first line break (modified in place)
 * @param rtlLanguages - Array of RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @returns HTML string for the span element with styling
 */
export function genSpanElement(
  runNode: any,
  runIndex: number | undefined,
  paragraphNode: any,
  textBodyNode: any,
  parentFontStyle: any,
  layoutShapeNode: any,
  placeholderIndex: number | string | undefined,
  shapeType: string | undefined,
  runNodeCount: number,
  warpContext: any,
  isBullet: boolean,
  styleTable: any,
  firstLineBreak: { value: boolean },
  rtlLanguages: string[],
  emuToPx: number,
  fontSizeScale: number
): string {
  type FontEffectsConfig = { border?: string; effcts?: string };
  type GradientFill = { color: Array<string | undefined>; rot: number };
  type PatternFill = Array<string | number>;

  //https://codepen.io/imdunn/pen/GRgwaye ?
  let textStyle = "";
  const listStyleNode = textBodyNode["a:lstStyle"];
  const slideMasterTextStyles = warpContext["slideMasterTextStyles"];

  let textValue = runNode["a:t"];
  //var text_count = textValue.length;

  const openElement = "<span"; //"<bdi";
  const closeElement = "</span>"; // "</bdi>";
  let classStyleText = "";
  if (textValue === undefined && runNode["type"] !== undefined) {
    if (firstLineBreak.value) {
      //openElemnt = "<br";
      //closeElemnt = "";
      //return "<br style='font-size: initial'>"
      firstLineBreak.value = false;
      return "<span class='line-break-br' ></span>";
    } else {
      // styleText += "display: block;";
      // openElemnt = "<span";
      // closeElemnt = "</span>";
    }

    classStyleText += "display: block;";
    //openElemnt = "<span";
    //closeElemnt = "</span>";
  } else {
    firstLineBreak.value = true;
  }
  if (typeof textValue !== "string") {
    textValue = getTextByPathList(runNode, ["a:fld", "a:t"]);
    if (typeof textValue !== "string") {
      textValue = "&nbsp;";
      //return "<span class='text-block '>&nbsp;</span>";
    }
    // if (text === undefined) {
    //     return "";
    // }
  }

  const paragraphPropsNode = paragraphNode["a:pPr"];
  //lvl
  let listLevel = 1;
  const listLevelNode = getTextByPathList<string | number>(paragraphPropsNode, ["attrs", "lvl"]);
  if (listLevelNode !== undefined) {
    listLevel = parseInt(String(listLevelNode), 10) + 1;
  }
  //console.log("genSpanElement node: ", runNode, "runIndex: ", runIndex, ", paragraphNode: ", paragraphNode, ",paragraphPropsNode: ", paragraphPropsNode, "parentFontStyle:", parentFontStyle, ", placeholderIndex: ", placeholderIndex, "shapeType:", shapeType, warpContext);
  const layoutMasterNode = getLayoutAndMasterNode(
    paragraphNode,
    placeholderIndex,
    shapeType,
    warpContext
  );
  const paragraphPropsLayoutNode = layoutMasterNode.nodeLayout;
  const paragraphPropsMasterNode = layoutMasterNode.nodeMaster;

  //Language
  const language = getTextByPathList<string>(runNode, ["a:rPr", "attrs", "lang"]);
  const isRtlLanguage =
    language !== undefined && rtlLanguages.indexOf(language) !== -1 ? true : false;
  //rtl
  let rtlValue = getTextByPathList<string>(paragraphPropsNode, ["attrs", "rtl"]);
  if (rtlValue === undefined) {
    rtlValue = getTextByPathList<string>(paragraphPropsLayoutNode, ["attrs", "rtl"]);
    if (rtlValue === undefined && shapeType !== "shape") {
      rtlValue = getTextByPathList<string>(paragraphPropsMasterNode, ["attrs", "rtl"]);
    }
  }

  const linkId = getTextByPathList<string>(runNode, ["a:rPr", "a:hlinkClick", "attrs", "r:id"]);
  let linkTooltipAttr = "";
  let defaultLinkColor;
  if (linkId !== undefined) {
    linkTooltipAttr = getTextByPathList<string>(runNode, [
      "a:rPr",
      "a:hlinkClick",
      "attrs",
      "tooltip",
    ]);
    if (linkTooltipAttr !== undefined) {
      linkTooltipAttr = "title='" + linkTooltipAttr + "'";
    }
    defaultLinkColor = getSchemeColorFromTheme("a:hlink", undefined, undefined, warpContext);

    const linkColorNode = getTextByPathList<XmlNode>(runNode, ["a:rPr", "a:solidFill"]);
    const linkColorOverride = getSolidFill(linkColorNode, undefined, undefined, warpContext);

    //console.log("genSpanElement defLinkClr: ", defLinkClr, "rPrlinkClr:", rPrlinkClr)
    if (linkColorOverride !== undefined && linkColorOverride !== "") {
      defaultLinkColor = linkColorOverride;
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////
  //getFontColor
  const fontColorResult = getFontColorPr(
    runNode,
    paragraphNode,
    listStyleNode,
    parentFontStyle,
    listLevel,
    placeholderIndex,
    shapeType,
    warpContext,
    emuToPx
  ) as [
    string | PatternFill | GradientFill,
    string | FontEffectsConfig,
    "solid" | "pattern" | "pic" | "gradient",
    string,
  ];
  const fontColorType = fontColorResult[2];
  //console.log("genSpanElement fontClrPr: ", fontColorResult, "linkID", linkId);
  if (fontColorType === "solid") {
    if (linkId === undefined && fontColorResult[0] !== undefined && fontColorResult[0] !== "") {
      classStyleText += "color: #" + fontColorResult[0] + ";";
    } else if (linkId !== undefined && defaultLinkColor !== undefined) {
      classStyleText += "color: #" + defaultLinkColor + ";";
    }

    if (
      fontColorResult[1] !== undefined &&
      fontColorResult[1] !== "" &&
      fontColorResult[1] !== ";"
    ) {
      classStyleText += "text-shadow:" + fontColorResult[1] + ";";
    }
    if (fontColorResult[3] !== undefined && fontColorResult[3] !== "") {
      classStyleText += "background-color: #" + fontColorResult[3] + ";";
    }
  } else if (
    fontColorType === "pattern" ||
    fontColorType === "pic" ||
    fontColorType === "gradient"
  ) {
    if (fontColorType === "pattern") {
      classStyleText += "background:" + fontColorResult[0][0] + ";";
      if (
        fontColorResult[0][1] !== null &&
        fontColorResult[0][1] !== undefined &&
        fontColorResult[0][1] !== ""
      ) {
        classStyleText += "background-size:" + fontColorResult[0][1] + ";"; //" 2px 2px;" +
      }
      if (
        fontColorResult[0][2] !== null &&
        fontColorResult[0][2] !== undefined &&
        fontColorResult[0][2] !== ""
      ) {
        classStyleText += "background-position:" + fontColorResult[0][2] + ";"; //" 2px 2px;" +
      }
      // styleText += "-webkit-background-clip: text;" +
      //     "background-clip: text;" +
      //     "color: transparent;" +
      //     "-webkit-text-stroke: " + fontClrPr[1].border + ";" +
      //     "filter: " + fontClrPr[1].effcts + ";";
    } else if (fontColorType === "pic") {
      classStyleText += fontColorResult[0] + ";";
      // styleText += "-webkit-background-clip: text;" +
      //     "background-clip: text;" +
      //     "color: transparent;" +
      //     "-webkit-text-stroke: " + fontClrPr[1].border + ";";
    } else if (fontColorType === "gradient") {
      const gradientFill = fontColorResult[0] as GradientFill;
      const colorStops = gradientFill.color;
      const rotationDegrees = gradientFill.rot;

      classStyleText += "background: linear-gradient(" + rotationDegrees + "deg,";
      for (let i = 0; i < colorStops.length; i++) {
        if (i === colorStops.length - 1) {
          classStyleText += "#" + colorStops[i] + ");";
        } else {
          classStyleText += "#" + colorStops[i] + ", ";
        }
      }
      // styleText += "-webkit-background-clip: text;" +
      //     "background-clip: text;" +
      //     "color: transparent;" +
      //     "-webkit-text-stroke: " + fontClrPr[1].border + ";";
    }
    classStyleText +=
      "-webkit-background-clip: text;" + "background-clip: text;" + "color: transparent;";
    const effectsConfig = fontColorResult[1] as FontEffectsConfig;
    if (effectsConfig.border !== undefined && effectsConfig.border !== "") {
      classStyleText += "-webkit-text-stroke: " + effectsConfig.border + ";";
    }
    if (effectsConfig.effcts !== undefined && effectsConfig.effcts !== "") {
      classStyleText += "filter: " + effectsConfig.effcts + ";";
    }
  }
  const fontSize = getFontSize(
    runNode,
    textBodyNode,
    parentFontStyle,
    listLevel,
    shapeType,
    warpContext,
    fontSizeScale
  );
  //text_style += "font-size:" + fontSize + ";"

  textStyle +=
    "font-size:" +
    fontSize +
    ";" +
    // marLStr +
    "font-family:" +
    getFontType(runNode, shapeType, warpContext, parentFontStyle) +
    ";" +
    "font-weight:" +
    getFontBold(runNode, shapeType, slideMasterTextStyles) +
    ";" +
    "font-style:" +
    getFontItalic(runNode, shapeType, slideMasterTextStyles) +
    ";" +
    "text-decoration:" +
    getFontDecoration(runNode, shapeType, slideMasterTextStyles) +
    ";" +
    "text-align:" +
    getTextHorizontalAlign(runNode, paragraphNode, shapeType, warpContext) +
    ";" +
    "vertical-align:" +
    getTextVerticalAlign(runNode, shapeType, slideMasterTextStyles) +
    ";";
  //rNodeLength
  //console.log("genSpanElement node:", runNode, "lang:", language, "isRtlLan:", isRtlLanguage, "span parent dir:", dirStr)
  if (isRtlLanguage) {
    //|| rIndex === undefined
    classStyleText += "direction:rtl;";
  } else {
    //|| rIndex === undefined
    classStyleText += "direction:ltr;";
  }
  // } else if (dirStr == "rtl" && isRtlLan ) {
  //     styleText += "direction:rtl;";

  // } else if (dirStr == "ltr" && !isRtlLan ) {
  //     styleText += "direction:ltr;";
  // } else if (dirStr == "ltr" && isRtlLan){
  //     styleText += "direction:ltr;";
  // }else{
  //     styleText += "direction:inherit;";
  // }

  // if (dirStr == "rtl" && !isRtlLan) { //|| rIndex === undefined
  //     styleText += "direction:ltr;";
  // } else if (dirStr == "rtl" && isRtlLan) {
  //     styleText += "direction:rtl;";
  // } else if (dirStr == "ltr" && !isRtlLan) {
  //     styleText += "direction:ltr;";
  // } else if (dirStr == "ltr" && isRtlLan) {
  //     styleText += "direction:rtl;";
  // } else {
  //     styleText += "direction:inherit;";
  // }

  //     //"direction:" + dirStr + ";";
  //if (rNodeLength == 1 || rIndex == 0 ){
  //styleText += "display: table-cell;white-space: nowrap;";
  //}
  const highlightNode = getTextByPathList<XmlNode>(runNode, ["a:rPr", "a:highlight"]);
  if (highlightNode !== undefined) {
    classStyleText +=
      "background-color:#" + getSolidFill(highlightNode, undefined, undefined, warpContext) + ";";
    //styleText += "Opacity:" + getColorOpacity(highlight) + ";";
  }

  //letter-spacing:
  let spacingNode = getTextByPathList<string | number>(runNode, ["a:rPr", "attrs", "spc"]);
  if (spacingNode === undefined) {
    spacingNode = getTextByPathList<string | number>(paragraphPropsLayoutNode, [
      "a:defRPr",
      "attrs",
      "spc",
    ]);
    if (spacingNode === undefined) {
      spacingNode = getTextByPathList<string | number>(paragraphPropsMasterNode, [
        "a:defRPr",
        "attrs",
        "spc",
      ]);
    }
  }
  if (spacingNode !== undefined) {
    const letterSpacingPx = parseInt(String(spacingNode), 10) / 100; //pt
    classStyleText += "letter-spacing: " + letterSpacingPx + "px;"; // + "pt;";
  }

  //Text Cap Types
  let capitalizationNode = getTextByPathList<string>(runNode, ["a:rPr", "attrs", "cap"]);
  if (capitalizationNode === undefined) {
    capitalizationNode = getTextByPathList<string>(paragraphPropsLayoutNode, [
      "a:defRPr",
      "attrs",
      "cap",
    ]);
    if (capitalizationNode === undefined) {
      capitalizationNode = getTextByPathList<string>(paragraphPropsMasterNode, [
        "a:defRPr",
        "attrs",
        "cap",
      ]);
    }
  }
  if (capitalizationNode === "small" || capitalizationNode === "all") {
    classStyleText += "text-transform: uppercase";
  }
  //styleText += "word-break: break-word;";
  //console.log("genSpanElement node: ", runNode, ", capNode: ", capitalizationNode, ",paragraphPropsLayoutNode: ", paragraphPropsLayoutNode, ", paragraphPropsMasterNode: ", paragraphPropsMasterNode, "warpContext:", warpContext);

  let cssClassName = "";

  if (classStyleText in styleTable) {
    cssClassName = styleTable[classStyleText]["name"];
  } else {
    cssClassName = "_css_" + (Object.keys(styleTable).length + 1);
    styleTable[classStyleText] = {
      name: cssClassName,
      text: classStyleText,
    };
  }
  let linkColorStyle = "";
  if (fontColorType === "solid" && linkId !== undefined) {
    linkColorStyle = "style='color: inherit;'";
  }

  if (linkId !== undefined && linkId !== "") {
    let linkUrl = warpContext["slideResObj"][linkId]["target"];
    linkUrl = escapeHtml(linkUrl);
    return (
      openElement +
      " class='text-block " +
      cssClassName +
      "' style='" +
      textStyle +
      "'><a href='" +
      linkUrl +
      "' " +
      linkColorStyle +
      "  " +
      linkTooltipAttr +
      " target='_blank'>" +
      textValue.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, "&nbsp;") +
      "</a>" +
      closeElement
    );
  } else {
    return (
      openElement +
      " class='text-block " +
      cssClassName +
      "' style='" +
      textStyle +
      "'>" +
      textValue.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\s/g, "&nbsp;") +
      closeElement
    ); //"</bdi>";
  }
}
