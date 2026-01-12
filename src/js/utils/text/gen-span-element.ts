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
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

const asXmlNode = (value: unknown): XmlNode | undefined => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as XmlNode)
    : undefined;
};

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
 * @param paragraphNode - Parent paragraph node for property inheritance
 * @param textBodyNode - Text body node containing list styles
 * @param parentFontStyle - Parent font style for color/font inheritance
 * @param placeholderIndex - Placeholder index for layout lookup
 * @param shapeType - Shape type for layout resolution
 * @param warpContext - Warp object containing slide resources and styles
 * @param styleTable - CSS style table for class generation (modified in place)
 * @param firstLineBreak - Object {value: boolean} tracking if this is first line break (modified in place)
 * @param rtlLanguages - Array of RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @returns HTML string for the span element with styling
 */
type GenSpanElementOptions = {
  runNode: XmlNode;
  paragraphNode: XmlNode;
  textBodyNode: XmlNode;
  parentFontStyle: XmlNode | undefined;
  placeholderIndex: number | string | undefined;
  shapeType: string | undefined;
  warpContext: WarpContext;
  styleTable: Record<string, { name: string; text: string }>;
  firstLineBreak: { value: boolean };
  rtlLanguages: string[];
  emuToPx: number;
  fontSizeScale: number;
};

export function genSpanElement({
  runNode,
  paragraphNode,
  textBodyNode,
  parentFontStyle,
  placeholderIndex,
  shapeType,
  warpContext,
  styleTable,
  firstLineBreak,
  rtlLanguages,
  emuToPx,
  fontSizeScale,
}: GenSpanElementOptions): string {
  type FontEffectsConfig = { border?: string; effcts?: string };
  type GradientFill = { color: Array<string | undefined>; rot: number };
  type PatternFill = Array<string | number>;

  //https://codepen.io/imdunn/pen/GRgwaye ?
  let textStyle = "";
  const listStyleNode = asXmlNode(textBodyNode["a:lstStyle"]);
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
    textValue = getTextByPathList({ node: runNode, path: ["a:fld", "a:t"] });
    if (typeof textValue !== "string") {
      textValue = "&nbsp;";
      //return "<span class='text-block '>&nbsp;</span>";
    }
    // if (text === undefined) {
    //     return "";
    // }
  }

  const paragraphPropsNode = asXmlNode(paragraphNode["a:pPr"]);
  //lvl
  let listLevel = 1;
  const listLevelNode = paragraphPropsNode
    ? getTextByPathList<string | number>({ node: paragraphPropsNode, path: ["attrs", "lvl"] })
    : undefined;
  if (listLevelNode !== undefined) {
    listLevel = parseInt(String(listLevelNode), 10) + 1;
  }
  //console.log("genSpanElement node: ", runNode, "runIndex: ", runIndex, ", paragraphNode: ", paragraphNode, ",paragraphPropsNode: ", paragraphPropsNode, "parentFontStyle:", parentFontStyle, ", placeholderIndex: ", placeholderIndex, "shapeType:", shapeType, warpContext);
  const layoutMasterNode = getLayoutAndMasterNode({
    paragraphNode,
    layoutIndex: placeholderIndex,
    shapeType,
    warpContext,
  });
  const paragraphPropsLayoutNode = layoutMasterNode.nodeLayout;
  const paragraphPropsMasterNode = layoutMasterNode.nodeMaster;

  //Language
  const language = getTextByPathList<string>({ node: runNode, path: ["a:rPr", "attrs", "lang"] });
  const isRtlLanguage =
    language !== undefined && rtlLanguages.indexOf(language) !== -1 ? true : false;
  //rtl
  let rtlValue = paragraphPropsNode
    ? getTextByPathList<string>({ node: paragraphPropsNode, path: ["attrs", "rtl"] })
    : undefined;
  if (rtlValue === undefined) {
    rtlValue = paragraphPropsLayoutNode
      ? getTextByPathList<string>({ node: paragraphPropsLayoutNode, path: ["attrs", "rtl"] })
      : undefined;
    if (rtlValue === undefined && shapeType !== "shape") {
      rtlValue = paragraphPropsMasterNode
        ? getTextByPathList<string>({ node: paragraphPropsMasterNode, path: ["attrs", "rtl"] })
        : undefined;
    }
  }

  const linkId = getTextByPathList<string>({
    node: runNode,
    path: ["a:rPr", "a:hlinkClick", "attrs", "r:id"],
  });
  let linkTooltipAttr = "";
  let defaultLinkColor;
  if (linkId !== undefined) {
    linkTooltipAttr = getTextByPathList<string>({
      node: runNode,
      path: ["a:rPr", "a:hlinkClick", "attrs", "tooltip"],
    });
    if (linkTooltipAttr !== undefined) {
      linkTooltipAttr = "title='" + linkTooltipAttr + "'";
    }
    defaultLinkColor = getSchemeColorFromTheme({
      schemeColorKey: "a:hlink",
      clrMap: undefined,
      phClr: undefined,
      warpContext,
    });

    const linkColorNode = getTextByPathList<XmlNode>({
      node: runNode,
      path: ["a:rPr", "a:solidFill"],
    });
    const linkColorOverride = linkColorNode
      ? getSolidFill({
          fillNode: linkColorNode,
          colorMap: undefined,
          placeholderColor: undefined,
          warpContext,
        })
      : undefined;

    //console.log("genSpanElement defLinkClr: ", defLinkClr, "rPrlinkClr:", rPrlinkClr)
    if (linkColorOverride !== undefined && linkColorOverride !== "") {
      defaultLinkColor = linkColorOverride;
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////
  //getFontColor
  const fontColorResult = getFontColorPr({
    textRunNode: runNode,
    paragraphNode,
    listStyleNode,
    paragraphFontStyle: parentFontStyle,
    listLevel,
    placeholderIndex,
    shapeType,
    warpContext,
    emuToPx,
  }) as [
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
  const fontSize = getFontSize({
    textRunNode: runNode,
    textBodyNode,
    listLevel,
    shapeType,
    warpContext,
    fontSizeScale,
  });
  //text_style += "font-size:" + fontSize + ";"

  textStyle +=
    "font-size:" +
    fontSize +
    ";" +
    // marLStr +
    "font-family:" +
    getFontType({
      textRunNode: runNode,
      shapeType,
      warpContext,
      paragraphFontStyle: parentFontStyle,
    }) +
    ";" +
    "font-weight:" +
    getFontBold({ textRunNode: runNode }) +
    ";" +
    "font-style:" +
    getFontItalic({ textRunNode: runNode }) +
    ";" +
    "text-decoration:" +
    getFontDecoration({ textRunNode: runNode }) +
    ";" +
    "text-align:" +
    getTextHorizontalAlign({ textNode: runNode, paragraphNode, shapeType, warpContext }) +
    ";" +
    "vertical-align:" +
    getTextVerticalAlign({ textRunNode: runNode }) +
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
  const highlightNode = getTextByPathList<XmlNode>({
    node: runNode,
    path: ["a:rPr", "a:highlight"],
  });
  if (highlightNode !== undefined) {
    classStyleText +=
      "background-color:#" +
      getSolidFill({
        fillNode: highlightNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      }) +
      ";";
    //styleText += "Opacity:" + getColorOpacity(highlight) + ";";
  }

  //letter-spacing:
  let spacingNode = getTextByPathList<string | number>({
    node: runNode,
    path: ["a:rPr", "attrs", "spc"],
  });
  if (spacingNode === undefined) {
    spacingNode = getTextByPathList<string | number>({
      node: paragraphPropsLayoutNode,
      path: ["a:defRPr", "attrs", "spc"],
    });
    if (spacingNode === undefined) {
      spacingNode = getTextByPathList<string | number>({
        node: paragraphPropsMasterNode,
        path: ["a:defRPr", "attrs", "spc"],
      });
    }
  }
  if (spacingNode !== undefined) {
    const letterSpacingPx = parseInt(String(spacingNode), 10) / 100; //pt
    classStyleText += "letter-spacing: " + letterSpacingPx + "px;"; // + "pt;";
  }

  //Text Cap Types
  let capitalizationNode = getTextByPathList<string>({
    node: runNode,
    path: ["a:rPr", "attrs", "cap"],
  });
  if (capitalizationNode === undefined) {
    capitalizationNode = getTextByPathList<string>({
      node: paragraphPropsLayoutNode,
      path: ["a:defRPr", "attrs", "cap"],
    });
    if (capitalizationNode === undefined) {
      capitalizationNode = getTextByPathList<string>({
        node: paragraphPropsMasterNode,
        path: ["a:defRPr", "attrs", "cap"],
      });
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
    linkUrl = escapeHtml({ text: linkUrl });
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
