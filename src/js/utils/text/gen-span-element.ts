import { getTextByPathList } from "../object";
import { getLayoutAndMasterNode } from "../layout";
import { getSchemeColorFromTheme, getSolidFill } from "../color";
import { getFontColorPr, getFontSize, getFontType, getFontBold, getFontItalic, getFontDecoration } from "../font";
import { getTextHorizontalAlign, getTextVerticalAlign } from "../layout";
import { escapeHtml } from "../string";

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
 * @param node - Text run node (a:r) or paragraph node containing text
 * @param rIndex - Index of text run in paragraph (for direction logic)
 * @param pNode - Parent paragraph node for property inheritance
 * @param textBodyNode - Text body node containing list styles
 * @param pFontStyle - Parent font style for color/font inheritance
 * @param slideLayoutSpNode - Shape node from slide layout for fallback
 * @param idx - Placeholder index for layout lookup
 * @param type - Shape type for layout resolution
 * @param rNodeLength - Total number of runs in paragraph
 * @param warpObj - Warp object containing slide resources and styles
 * @param isBullate - Whether this text is part of a bulleted paragraph
 * @param styleTable - CSS style table for class generation (modified in place)
 * @param isFirstBr - Object {value: boolean} tracking if this is first line break (modified in place)
 * @param rtlLangsArray - Array of RTL language codes
 * @param slideFactor - EMU to pixel conversion factor
 * @param fontSizeFactor - Font size scaling factor
 * @returns HTML string for the span element with styling
 */
export function genSpanElement(
    node: any,
    rIndex: any,
    pNode: any,
    textBodyNode: any,
    pFontStyle: any,
    slideLayoutSpNode: any,
    idx: any,
    type: any,
    rNodeLength: any,
    warpObj: any,
    isBullate: any,
    styleTable: any,
    isFirstBr: { value: boolean },
    rtlLangsArray: string[],
    slideFactor: number,
    fontSizeFactor: number
): string {
    //https://codepen.io/imdunn/pen/GRgwaye ?
    var text_style = "";
    var lstStyle = textBodyNode["a:lstStyle"];
    var slideMasterTextStyles = warpObj["slideMasterTextStyles"];

    var text = node["a:t"];
    //var text_count = text.length;

    var openElemnt = "<span";//"<bdi";
    var closeElemnt = "</span>";// "</bdi>";
    var styleText = "";
    if (text === undefined && node["type"] !== undefined) {
        if (isFirstBr.value) {
            //openElemnt = "<br";
            //closeElemnt = "";
            //return "<br style='font-size: initial'>"
            isFirstBr.value = false;
            return "<span class='line-break-br' ></span>";
        } else {
            // styleText += "display: block;";
            // openElemnt = "<span";
            // closeElemnt = "</span>";
        }

        styleText += "display: block;";
        //openElemnt = "<span";
        //closeElemnt = "</span>";
    } else {

        isFirstBr.value = true;
    }
    if (typeof text !== 'string') {
        text = getTextByPathList(node, ["a:fld", "a:t"]);
        if (typeof text !== 'string') {
            text = "&nbsp;";
            //return "<span class='text-block '>&nbsp;</span>";
        }
        // if (text === undefined) {
        //     return "";
        // }
    }

    var pPrNode = pNode["a:pPr"];
    //lvl
    var lvl = 1;
    var lvlNode = getTextByPathList(pPrNode, ["attrs", "lvl"]);
    if (lvlNode !== undefined) {
        lvl = parseInt(lvlNode) + 1;
    }
    //console.log("genSpanElement node: ", node, "rIndex: ", rIndex, ", pNode: ", pNode, ",pPrNode: ", pPrNode, "pFontStyle:", pFontStyle, ", idx: ", idx, "type:", type, warpObj);
    var layoutMasterNode = getLayoutAndMasterNode(pNode, idx, type, warpObj);
    var pPrNodeLaout = layoutMasterNode.nodeLaout;
    var pPrNodeMaster = layoutMasterNode.nodeMaster;

    //Language
    var lang = getTextByPathList(node, ["a:rPr", "attrs", "lang"]);
    var isRtlLan = (lang !== undefined && rtlLangsArray.indexOf(lang) !== -1)?true:false;
    //rtl
    var getRtlVal = getTextByPathList(pPrNode, ["attrs", "rtl"]);
    if (getRtlVal === undefined) {
        getRtlVal = getTextByPathList(pPrNodeLaout, ["attrs", "rtl"]);
        if (getRtlVal === undefined && type != "shape") {
            getRtlVal = getTextByPathList(pPrNodeMaster, ["attrs", "rtl"]);
        }
    }
    var isRTL = false;
    var dirStr = "ltr";
    if (getRtlVal !== undefined && getRtlVal == "1") {
        isRTL = true;
        dirStr = "rtl";
    }

    var linkID = getTextByPathList(node, ["a:rPr", "a:hlinkClick", "attrs", "r:id"]);
    var linkTooltip = "";
    var defLinkClr;
    if (linkID !== undefined) {
        linkTooltip = getTextByPathList(node, ["a:rPr", "a:hlinkClick", "attrs", "tooltip"]);
        if (linkTooltip !== undefined) {
            linkTooltip = "title='" + linkTooltip + "'";
        }
        defLinkClr = getSchemeColorFromTheme("a:hlink", undefined, undefined, warpObj);

        var linkClrNode = getTextByPathList(node, ["a:rPr", "a:solidFill"]);// getTextByPathList(node, ["a:rPr", "a:solidFill"]);
        var rPrlinkClr = getSolidFill(linkClrNode, undefined, undefined, warpObj);


        //console.log("genSpanElement defLinkClr: ", defLinkClr, "rPrlinkClr:", rPrlinkClr)
        if (rPrlinkClr !== undefined && rPrlinkClr != "") {
            defLinkClr = rPrlinkClr;
        }

    }
    /////////////////////////////////////////////////////////////////////////////////////
    //getFontColor
    var fontClrPr = getFontColorPr(node, pNode, lstStyle, pFontStyle, lvl, idx, type, warpObj, slideFactor);
    var fontClrType = fontClrPr[2];
    //console.log("genSpanElement fontClrPr: ", fontClrPr, "linkID", linkID);
    if (fontClrType == "solid") {
        if (linkID === undefined && fontClrPr[0] !== undefined && fontClrPr[0] != "") {
            styleText += "color: #" + fontClrPr[0] + ";";
        }
        else if (linkID !== undefined && defLinkClr !== undefined) {
            styleText += "color: #" + defLinkClr + ";";
        }

        if (fontClrPr[1] !== undefined && fontClrPr[1] != "" && fontClrPr[1] != ";") {
            styleText += "text-shadow:" + fontClrPr[1] + ";";
        }
        if (fontClrPr[3] !== undefined && fontClrPr[3] != "") {
            styleText += "background-color: #" + fontClrPr[3] + ";";
        }
    } else if (fontClrType == "pattern" || fontClrType == "pic" || fontClrType == "gradient") {
        if (fontClrType == "pattern") {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            styleText += "background:" + fontClrPr[0][0] + ";";
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (fontClrPr[0][1] !== null && fontClrPr[0][1] !== undefined && fontClrPr[0][1] != "") {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                styleText += "background-size:" + fontClrPr[0][1] + ";";//" 2px 2px;" +
            }
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (fontClrPr[0][2] !== null && fontClrPr[0][2] !== undefined && fontClrPr[0][2] != "") {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                styleText += "background-position:" + fontClrPr[0][2] + ";";//" 2px 2px;" +
            }
            // styleText += "-webkit-background-clip: text;" +
            //     "background-clip: text;" +
            //     "color: transparent;" +
            //     "-webkit-text-stroke: " + fontClrPr[1].border + ";" +
            //     "filter: " + fontClrPr[1].effcts + ";";
        } else if (fontClrType == "pic") {
            styleText += fontClrPr[0] + ";";
            // styleText += "-webkit-background-clip: text;" +
            //     "background-clip: text;" +
            //     "color: transparent;" +
            //     "-webkit-text-stroke: " + fontClrPr[1].border + ";";
        } else if (fontClrType == "gradient") {

            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            var colorAry = fontClrPr[0].color;
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            var rot = fontClrPr[0].rot;

            styleText += "background: linear-gradient(" + rot + "deg,";
            for (var i = 0; i < colorAry.length; i++) {
                if (i == colorAry.length - 1) {
                    styleText += "#" + colorAry[i] + ");";
                } else {
                    styleText += "#" + colorAry[i] + ", ";
                }
            }
            // styleText += "-webkit-background-clip: text;" +
            //     "background-clip: text;" +
            //     "color: transparent;" +
            //     "-webkit-text-stroke: " + fontClrPr[1].border + ";";

        }
        styleText += "-webkit-background-clip: text;" +
            "background-clip: text;" +
            "color: transparent;";
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        if (fontClrPr[1].border !== undefined && fontClrPr[1].border !== "") {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            styleText += "-webkit-text-stroke: " + fontClrPr[1].border + ";";
        }
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        if (fontClrPr[1].effcts !== undefined && fontClrPr[1].effcts !== "") {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            styleText += "filter: " + fontClrPr[1].effcts + ";";
        }
    }
    var font_size = getFontSize(node, textBodyNode, pFontStyle, lvl, type, warpObj, fontSizeFactor);
    //text_style += "font-size:" + font_size + ";"

    text_style += "font-size:" + font_size + ";" +
        // marLStr +
        "font-family:" + getFontType(node, type, warpObj, pFontStyle) + ";" +
        "font-weight:" + getFontBold(node, type, slideMasterTextStyles) + ";" +
        "font-style:" + getFontItalic(node, type, slideMasterTextStyles) + ";" +
        "text-decoration:" + getFontDecoration(node, type, slideMasterTextStyles) + ";" +
        "text-align:" + getTextHorizontalAlign(node, pNode, type, warpObj) + ";" +
        "vertical-align:" + getTextVerticalAlign(node, type, slideMasterTextStyles) + ";";
    //rNodeLength
    //console.log("genSpanElement node:", node, "lang:", lang, "isRtlLan:", isRtlLan, "span parent dir:", dirStr)
    if (isRtlLan) { //|| rIndex === undefined
        styleText += "direction:rtl;";
    }else{ //|| rIndex === undefined
        styleText += "direction:ltr;";
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
    var highlight = getTextByPathList(node, ["a:rPr", "a:highlight"]);
    if (highlight !== undefined) {
        styleText += "background-color:#" + getSolidFill(highlight, undefined, undefined, warpObj) + ";";
        //styleText += "Opacity:" + getColorOpacity(highlight) + ";";
    }

    //letter-spacing:
    var spcNode = getTextByPathList(node, ["a:rPr", "attrs", "spc"]);
    if (spcNode === undefined) {
        spcNode = getTextByPathList(pPrNodeLaout, ["a:defRPr", "attrs", "spc"]);
        if (spcNode === undefined) {
            spcNode = getTextByPathList(pPrNodeMaster, ["a:defRPr", "attrs", "spc"]);
        }
    }
    if (spcNode !== undefined) {
        var ltrSpc = parseInt(spcNode) / 100; //pt
        styleText += "letter-spacing: " + ltrSpc + "px;";// + "pt;";
    }

    //Text Cap Types
    var capNode = getTextByPathList(node, ["a:rPr", "attrs", "cap"]);
    if (capNode === undefined) {
        capNode = getTextByPathList(pPrNodeLaout, ["a:defRPr", "attrs", "cap"]);
        if (capNode === undefined) {
            capNode = getTextByPathList(pPrNodeMaster, ["a:defRPr", "attrs", "cap"]);
        }
    }
    if (capNode == "small" || capNode == "all") {
        styleText += "text-transform: uppercase";
    }
    //styleText += "word-break: break-word;";
    //console.log("genSpanElement node: ", node, ", capNode: ", capNode, ",pPrNodeLaout: ", pPrNodeLaout, ", pPrNodeMaster: ", pPrNodeMaster, "warpObj:", warpObj);

    var cssName = "";

    if (styleText in styleTable) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        cssName = styleTable[styleText]["name"];
    } else {
        cssName = "_css_" + (Object.keys(styleTable).length + 1);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        styleTable[styleText] = {
            "name": cssName,
            "text": styleText
        };
    }
    var linkColorSyle = "";
    if (fontClrType == "solid" && linkID !== undefined) {
        linkColorSyle = "style='color: inherit;'";
    }

    if (linkID !== undefined && linkID != "") {
        var linkURL = warpObj["slideResObj"][linkID]["target"];
        linkURL = escapeHtml(linkURL);
        return openElemnt + " class='text-block " + cssName + "' style='" + text_style + "'><a href='" + linkURL + "' " + linkColorSyle + "  " + linkTooltip + " target='_blank'>" +
                text.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\s/g, "&nbsp;") + "</a>" + closeElemnt;
    } else {
        return openElemnt + " class='text-block " + cssName + "' style='" + text_style + "'>" + text.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\s/g, "&nbsp;") + closeElemnt;//"</bdi>";
    }

}
