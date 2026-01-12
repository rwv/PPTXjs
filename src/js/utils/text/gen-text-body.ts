import { getTextByPathList } from "../object";
import {
  getVerticalMargins,
  getPregraphDir,
  getHorizontalAlign,
  getPregraphMargn,
} from "../layout";
import { genBuChar } from "../bullet";
import { genSpanElement } from "./gen-span-element";
import type { XmlNode } from "../../types/pptx-xml";

function measureHtmlWidth(html: string): number {
  const temp = document.createElement("div");
  temp.style.position = "absolute";
  temp.style.display = "inline-block";
  temp.style.float = "left";
  temp.style.whiteSpace = "nowrap";
  temp.style.visibility = "hidden";
  temp.innerHTML = html;
  document.body.appendChild(temp);
  const width = temp.getBoundingClientRect().width;
  temp.remove();
  return width;
}

/**
 * Generate HTML for text body containing paragraphs and runs
 *
 * Processes PPTX text body structure (a:txBody) containing paragraphs (a:p) with:
 * - Text runs (a:r) with formatting
 * - Fields (a:fld) for dynamic content
 * - Line breaks (a:br)
 *
 * For each paragraph:
 * 1. Generates bullets (character, numeric, or picture)
 * 2. Calculates margins and width (considering bullet width)
 * 3. Generates styled span elements for each text run
 * 4. Handles RTL/LTR text direction
 * 5. Wraps in div with proper alignment and styling
 *
 * @param textBodyNode - Text body node (p:txBody) containing paragraphs
 * @param spNode - Parent shape node for property lookup
 * @param shapeType - Shape type (body, obj, shape, etc.)
 * @param placeholderIndex - Placeholder index for layout lookup
 * @param warpContext - Warp object containing slide resources and styles
 * @param tableColumnWidth - Table column width (for table cells, undefined otherwise)
 * @param firstLineBreak - Object {value: boolean} for line break state (modified in place)
 * @param styleTable - CSS style table for class generation (modified in place)
 * @param rtlLanguages - Array of RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @returns HTML string for the text body
 */
type GenTextBodyOptions = {
  textBodyNode: any;
  spNode: any;
  shapeType: string | undefined;
  placeholderIndex: number | string | undefined;
  warpContext: any;
  tableColumnWidth: number | string | undefined;
  firstLineBreak: { value: boolean };
  styleTable: any;
  rtlLanguages: string[];
  emuToPx: number;
  fontSizeScale: number;
};

export async function genTextBody({
  textBodyNode,
  spNode,
  shapeType,
  placeholderIndex,
  warpContext,
  tableColumnWidth,
  firstLineBreak,
  styleTable,
  rtlLanguages,
  emuToPx,
  fontSizeScale,
}: GenTextBodyOptions): Promise<string> {
  let text = "";
  if (textBodyNode === undefined) {
    return text;
  }
  //rtl : <p:txBody>
  //          <a:bodyPr wrap="square" rtlCol="1">

  const pFontStyle = getTextByPathList<XmlNode>({ node: spNode, path: ["p:style", "a:fontRef"] });
  //console.log("genTextBody spNode: ", getTextByPathList({ node: spNode, path: ["p:spPr","a:xfrm","a:ext"] }));

  //var lstStyle = textBodyNode["a:lstStyle"];

  let apNode = textBodyNode["a:p"];
  if (apNode.constructor !== Array) {
    apNode = [apNode];
  }

  for (let i = 0; i < apNode.length; i++) {
    const pNode = apNode[i];
    let rNode = pNode["a:r"];
    let fldNode = pNode["a:fld"];
    let brNode = pNode["a:br"];
    if (rNode !== undefined) {
      rNode = rNode.constructor === Array ? rNode : [rNode];
    }
    if (rNode !== undefined && fldNode !== undefined) {
      fldNode = fldNode.constructor === Array ? fldNode : [fldNode];
      rNode = rNode.concat(fldNode);
    }
    if (rNode !== undefined && brNode !== undefined) {
      firstLineBreak.value = true;
      brNode = brNode.constructor === Array ? brNode : [brNode];
      brNode.forEach(function (item: any) {
        item.type = "br";
      });
      if (brNode.length > 1) {
        brNode.shift();
      }
      rNode = rNode.concat(brNode);
      //console.log("single a:p  rNode:", rNode, "brNode:", brNode )
      rNode.sort(function (a: any, b: any) {
        return a.attrs.order - b.attrs.order;
      });
      //console.log("sorted rNode:",rNode)
    }
    //rtlStr = "";//"dir='"+isRTL+"'";
    let styleText = "";
    const marginsVer = getVerticalMargins({
      paragraphNode: pNode,
      textBodyNode,
      shapeType,
      layoutIndex: placeholderIndex,
      warpContext,
      fontSizeScale,
    });
    if (marginsVer !== "") {
      styleText = marginsVer;
    }
    if (shapeType === "body" || shapeType === "obj" || shapeType === "shape") {
      styleText += "font-size: 0px;";
      //styleText += "line-height: 0;";
      styleText += "font-weight: 100;";
      styleText += "font-style: normal;";
    }
    let cssName = "";

    if (styleText in styleTable) {
      cssName = styleTable[styleText]["name"];
    } else {
      cssName = "_css_" + (Object.keys(styleTable).length + 1);
      styleTable[styleText] = {
        name: cssName,
        text: styleText,
      };
    }
    //console.log("textBodyNode: ", textBodyNode["a:lstStyle"])
    let prg_width_node = getTextByPathList<string | number>({
      node: spNode,
      path: ["p:spPr", "a:xfrm", "a:ext", "attrs", "cx"],
    });
    let prg_height_node; // = getTextByPathList({ node: spNode, path: ["p:spPr", "a:xfrm", "a:ext", "attrs", "cy"] });
    const sld_prg_width =
      prg_width_node !== undefined
        ? "width:" + parseInt(String(prg_width_node), 10) * emuToPx + "px;"
        : "width:inherit;";
    const sld_prg_height =
      prg_height_node !== undefined
        ? "height:" + parseInt(String(prg_height_node), 10) * emuToPx + "px;"
        : "";
    const prg_dir = getPregraphDir({
      paragraphNode: pNode,
      paragraphIndex: placeholderIndex,
      elementType: shapeType,
      warpContext,
    });
    text +=
      "<div style='display: flex;" +
      sld_prg_width +
      sld_prg_height +
      "' class='slide-prgrph " +
      getHorizontalAlign({
        paragraphNode: pNode,
        textBodyNode,
        layoutIndex: placeholderIndex,
        shapeType,
        paragraphDirection: prg_dir,
        warpContext,
      }) +
      " " +
      prg_dir +
      " " +
      cssName +
      "' >";
    const buText_ary = await genBuChar({
      paragraphNode: pNode,
      shapeNode: spNode,
      textBody: textBodyNode,
      parentFontStyle: pFontStyle,
      placeholderIndex,
      shapeType,
      warpContext,
      emuToPx,
      fontSizeScale,
    });
    const isBullate =
      buText_ary[0] !== undefined && buText_ary[0] !== null && buText_ary[0] !== "" ? true : false;
    const bu_width =
      buText_ary[1] !== undefined && buText_ary[1] !== null && isBullate
        ? Number(buText_ary[1]) + Number(buText_ary[2] ?? 0)
        : 0;
    text += buText_ary[0] !== undefined ? buText_ary[0] : "";
    //get text margin
    const margin_ary = getPregraphMargn({
      paragraphNode: pNode,
      paragraphIndex: placeholderIndex,
      elementType: shapeType,
      isBulleted: isBullate,
      warpContext,
      emuToPx,
    });
    const margin = margin_ary[0];
    const mrgin_val = margin_ary[1];
    if (prg_width_node === undefined && tableColumnWidth !== undefined && prg_width_node !== 0) {
      //sorce : table text
      prg_width_node = tableColumnWidth;
    }

    let prgrph_text = "";
    //var prgr_txt_art = [];
    let total_text_len = 0;
    if (rNode === undefined && pNode !== undefined) {
      // without r
      const prgr_text = genSpanElement({
        runNode: pNode,
        paragraphNode: spNode,
        textBodyNode,
        parentFontStyle: pFontStyle,
        placeholderIndex,
        shapeType,
        warpContext,
        styleTable,
        firstLineBreak,
        rtlLanguages,
        emuToPx,
        fontSizeScale,
      });
      if (isBullate) {
        total_text_len += measureHtmlWidth(prgr_text);
      }
      prgrph_text += prgr_text;
    } else if (rNode !== undefined) {
      // with multi r
      for (let j = 0; j < rNode.length; j++) {
        const prgr_text = genSpanElement({
          runNode: rNode[j],
          paragraphNode: pNode,
          textBodyNode,
          parentFontStyle: pFontStyle,
          placeholderIndex,
          shapeType,
          warpContext,
          styleTable,
          firstLineBreak,
          rtlLanguages,
          emuToPx,
          fontSizeScale,
        });
        if (isBullate) {
          total_text_len += measureHtmlWidth(prgr_text);
        }
        prgrph_text += prgr_text;
      }
    }

    prg_width_node = parseInt(String(prg_width_node), 10) * emuToPx - bu_width - mrgin_val;
    if (isBullate) {
      //get prg_width_node if there is a bulltes
      //console.log("total_text_len: ", total_text_len, "prg_width_node:", prg_width_node)

      if (total_text_len < prg_width_node) {
        prg_width_node = total_text_len + bu_width;
      }
    }
    const prg_width =
      prg_width_node !== undefined ? "width:" + prg_width_node + "px;" : "width:inherit;";
    text +=
      "<div style='height: 100%;direction: initial;overflow-wrap:break-word;word-wrap: break-word;" +
      prg_width +
      margin +
      "' >";
    text += prgrph_text;
    text += "</div>";
    text += "</div>";
  }

  return text;
}
