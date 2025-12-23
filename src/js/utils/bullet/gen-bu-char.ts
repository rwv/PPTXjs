import type { PptxNode, WarpObject, SlideFactor, FontSizeFactor } from "../../types";
import { getTextByPathList } from "../object";
import { getFontColorPr, getFontSize } from "../font";
import { getLayoutAndMasterNode } from "../layout";
import { getSolidFill } from "../color";
import { renderBulletChar, renderBulletNumeric, renderBulletPic } from "./handlers";

/**
 * Generate bullet character HTML for a text paragraph
 *
 * Handles three types of bullets:
 * - TYPE_BULLET: Character bullets (•, ■, etc.) with custom fonts
 * - TYPE_NUMERIC: Numbered bullets (1, 2, 3, a, b, c, i, ii, iii, etc.)
 * - TYPE_BULPIC: Picture bullets (embedded images)
 *
 * Resolves bullet properties through the standard fallback hierarchy:
 * paragraph → lstStyle → slideLayout → slideMaster
 *
 * @param node - Paragraph node containing bullet definition
 * @param i - Paragraph index (used for variable naming, but shadowed in loop)
 * @param spNode - Shape node containing the text
 * @param textBodyNode - Text body node with list styles
 * @param pFontStyle - Parent font style for color inheritance
 * @param idx - Placeholder index for layout lookup
 * @param type - Shape type for layout resolution
 * @param warpObj - Warp object containing slide resources and styles
 * @param slideFactor - EMU to pixel conversion factor
 * @param fontSizeFactor - Font size scaling factor
 * @returns Array [bulletHTML, marginValue, fontValue] or empty string if no bullet
 */
export function genBuChar(
  node: PptxNode,
  i: any,
  spNode: PptxNode,
  textBodyNode: PptxNode,
  pFontStyle: any,
  idx: any,
  type: any,
  warpObj: WarpObject,
  slideFactor: SlideFactor,
  fontSizeFactor: FontSizeFactor
): string | [string, number, number] {
  //console.log("genBuChar node: ", node, ", spNode: ", spNode, ", pFontStyle: ", pFontStyle, "type", type)
  ///////////////////////////////////////Amir///////////////////////////////
  const _sldMstrTxtStyles = warpObj["slideMasterTextStyles"];
  const lstStyle = textBodyNode["a:lstStyle"];

  let rNode = getTextByPathList(node, ["a:r"]);
  if (rNode !== undefined && rNode.constructor === Array) {
    rNode = rNode[0]; //bullet only to first "a:r"
  }
  let lvl = parseInt(getTextByPathList(node["a:pPr"], ["attrs", "lvl"])) + 1;
  if (isNaN(lvl)) {
    lvl = 1;
  }
  const lvlStr = "a:lvl" + lvl + "pPr";
  let dfltBultColor, dfltBultSize, bultColor, bultSize, color_tye;

  if (rNode !== undefined) {
    dfltBultColor = getFontColorPr(
      rNode,
      spNode,
      lstStyle,
      pFontStyle,
      lvl,
      idx,
      type,
      warpObj,
      slideFactor
    );
    color_tye = dfltBultColor[2];
    dfltBultSize = getFontSize(rNode, textBodyNode, pFontStyle, lvl, type, warpObj, fontSizeFactor);
  } else {
    return "";
  }
  //console.log("Bullet Size: " + bultSize);

  let bullet = "",
    marRStr = "",
    marLStr = "",
    margin_val = 0,
    font_val = 0;
  /////////////////////////////////////////////////////////////////

  let pPrNode = node["a:pPr"];
  let BullNONE = getTextByPathList(pPrNode, ["a:buNone"]);
  if (BullNONE !== undefined) {
    return "";
  }

  let buType = "TYPE_NONE";

  const layoutMasterNode = getLayoutAndMasterNode(node, idx, type, warpObj);
  const pPrNodeLaout = layoutMasterNode.nodeLaout;
  const pPrNodeMaster = layoutMasterNode.nodeMaster;

  let buChar = getTextByPathList(pPrNode, ["a:buChar", "attrs", "char"]);
  let buNum = getTextByPathList(pPrNode, ["a:buAutoNum", "attrs", "type"]);
  let buPic = getTextByPathList(pPrNode, ["a:buBlip"]);
  if (buChar !== undefined) {
    buType = "TYPE_BULLET";
  }
  if (buNum !== undefined) {
    buType = "TYPE_NUMERIC";
  }
  if (buPic !== undefined) {
    buType = "TYPE_BULPIC";
  }

  let buFontSize = getTextByPathList(pPrNode, ["a:buSzPts", "attrs", "val"]);
  if (buFontSize === undefined) {
    buFontSize = getTextByPathList(pPrNode, ["a:buSzPct", "attrs", "val"]);
    if (buFontSize !== undefined) {
      const prcnt = parseInt(buFontSize) / 100000;
      //dfltBultSize = XXpt
      //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
      const dfltBultSizeNoPt = parseInt(dfltBultSize);
      bultSize = prcnt * dfltBultSizeNoPt + "px"; // + "pt";
    }
  } else {
    bultSize = (parseInt(buFontSize) / 100) * fontSizeFactor + "px";
  }

  //get definde bullet COLOR
  let buClrNode = getTextByPathList(pPrNode, ["a:buClr"]);

  if (buChar === undefined && buNum === undefined && buPic === undefined) {
    if (lstStyle !== undefined) {
      BullNONE = getTextByPathList(lstStyle, [lvlStr, "a:buNone"]);
      if (BullNONE !== undefined) {
        return "";
      }
      buType = "TYPE_NONE";
      buChar = getTextByPathList(lstStyle, [lvlStr, "a:buChar", "attrs", "char"]);
      buNum = getTextByPathList(lstStyle, [lvlStr, "a:buAutoNum", "attrs", "type"]);
      buPic = getTextByPathList(lstStyle, [lvlStr, "a:buBlip"]);
      if (buChar !== undefined) {
        buType = "TYPE_BULLET";
      }
      if (buNum !== undefined) {
        buType = "TYPE_NUMERIC";
      }
      if (buPic !== undefined) {
        buType = "TYPE_BULPIC";
      }
      if (buChar !== undefined || buNum !== undefined || buPic !== undefined) {
        pPrNode = lstStyle[lvlStr];
      }
    }
  }
  if (buChar === undefined && buNum === undefined && buPic === undefined) {
    //check in slidelayout and masterlayout - TODO
    if (pPrNodeLaout !== undefined) {
      BullNONE = getTextByPathList(pPrNodeLaout, ["a:buNone"]);
      if (BullNONE !== undefined) {
        return "";
      }
      buType = "TYPE_NONE";
      buChar = getTextByPathList(pPrNodeLaout, ["a:buChar", "attrs", "char"]);
      buNum = getTextByPathList(pPrNodeLaout, ["a:buAutoNum", "attrs", "type"]);
      buPic = getTextByPathList(pPrNodeLaout, ["a:buBlip"]);
      if (buChar !== undefined) {
        buType = "TYPE_BULLET";
      }
      if (buNum !== undefined) {
        buType = "TYPE_NUMERIC";
      }
      if (buPic !== undefined) {
        buType = "TYPE_BULPIC";
      }
    }
    if (buChar === undefined && buNum === undefined && buPic === undefined) {
      //masterlayout

      if (pPrNodeMaster !== undefined) {
        BullNONE = getTextByPathList(pPrNodeMaster, ["a:buNone"]);
        if (BullNONE !== undefined) {
          return "";
        }
        buType = "TYPE_NONE";
        buChar = getTextByPathList(pPrNodeMaster, ["a:buChar", "attrs", "char"]);
        buNum = getTextByPathList(pPrNodeMaster, ["a:buAutoNum", "attrs", "type"]);
        buPic = getTextByPathList(pPrNodeMaster, ["a:buBlip"]);
        if (buChar !== undefined) {
          buType = "TYPE_BULLET";
        }
        if (buNum !== undefined) {
          buType = "TYPE_NUMERIC";
        }
        if (buPic !== undefined) {
          buType = "TYPE_BULPIC";
        }
      }
    }
  }
  //rtl
  let getRtlVal = getTextByPathList(pPrNode, ["attrs", "rtl"]);
  if (getRtlVal === undefined) {
    getRtlVal = getTextByPathList(pPrNodeLaout, ["attrs", "rtl"]);
    if (getRtlVal === undefined && type !== "shape") {
      getRtlVal = getTextByPathList(pPrNodeMaster, ["attrs", "rtl"]);
    }
  }
  let isRTL = false;
  if (getRtlVal !== undefined && getRtlVal === "1") {
    isRTL = true;
  }
  //align
  let alignNode = getTextByPathList(pPrNode, ["attrs", "algn"]); //"l" | "ctr" | "r" | "just" | "justLow" | "dist" | "thaiDist
  if (alignNode === undefined) {
    alignNode = getTextByPathList(pPrNodeLaout, ["attrs", "algn"]);
    if (alignNode === undefined) {
      alignNode = getTextByPathList(pPrNodeMaster, ["attrs", "algn"]);
    }
  }
  //indent?
  let indentNode = getTextByPathList(pPrNode, ["attrs", "indent"]);
  if (indentNode === undefined) {
    indentNode = getTextByPathList(pPrNodeLaout, ["attrs", "indent"]);
    if (indentNode === undefined) {
      indentNode = getTextByPathList(pPrNodeMaster, ["attrs", "indent"]);
    }
  }
  let indent = 0;
  if (indentNode !== undefined) {
    indent = parseInt(indentNode) * slideFactor;
  }
  //marL
  let marLNode = getTextByPathList(pPrNode, ["attrs", "marL"]);
  if (marLNode === undefined) {
    marLNode = getTextByPathList(pPrNodeLaout, ["attrs", "marL"]);
    if (marLNode === undefined) {
      marLNode = getTextByPathList(pPrNodeMaster, ["attrs", "marL"]);
    }
  }
  //console.log("genBuChar() isRTL", isRTL, "alignNode:", alignNode)
  if (marLNode !== undefined) {
    const marginLeft = parseInt(marLNode) * slideFactor;
    if (isRTL) {
      // && alignNode === "r") {
      marLStr = "padding-right:"; // "margin-right: ";
    } else {
      marLStr = "padding-left:"; //"margin-left: ";
    }
    margin_val = marginLeft + indent < 0 ? 0 : marginLeft + indent;
    marLStr += margin_val + "px;";
  }

  //marR?
  let marRNode = getTextByPathList(pPrNode, ["attrs", "marR"]);
  if (marRNode === undefined && marLNode === undefined) {
    //need to check if this posble - TODO
    marRNode = getTextByPathList(pPrNodeLaout, ["attrs", "marR"]);
    if (marRNode === undefined) {
      marRNode = getTextByPathList(pPrNodeMaster, ["attrs", "marR"]);
    }
  }
  if (marRNode !== undefined) {
    const marginRight = parseInt(marRNode) * slideFactor;
    if (isRTL) {
      // && alignNode === "r") {
      marLStr = "padding-right:"; // "margin-right: ";
    } else {
      marLStr = "padding-left:"; //"margin-left: ";
    }
    marRStr += (marginRight + indent < 0 ? 0 : marginRight + indent) + "px;";
  }

  if (buType !== "TYPE_NONE") {
    //var buFontAttrs = getTextByPathList(pPrNode, ["a:buFont", "attrs"]);
  }
  //console.log("Bullet Type: " + buType);
  //console.log("NumericTypr: " + buNum);
  //console.log("buChar: " + (buChar === undefined?'':buChar.charCodeAt(0)));
  //get definde bullet COLOR
  if (buClrNode === undefined) {
    //lstStyle
    buClrNode = getTextByPathList(lstStyle, [lvlStr, "a:buClr"]);
  }
  if (buClrNode === undefined) {
    buClrNode = getTextByPathList(pPrNodeLaout, ["a:buClr"]);
    if (buClrNode === undefined) {
      buClrNode = getTextByPathList(pPrNodeMaster, ["a:buClr"]);
    }
  }
  let defBultColor;
  if (buClrNode !== undefined) {
    defBultColor = getSolidFill(buClrNode, undefined, undefined, warpObj);
  } else {
    if (pFontStyle !== undefined) {
      //console.log("genBuChar pFontStyle: ", pFontStyle)
      defBultColor = getSolidFill(pFontStyle, undefined, undefined, warpObj);
    }
  }
  if (defBultColor === undefined || defBultColor === "NONE") {
    bultColor = dfltBultColor;
  } else {
    bultColor = [defBultColor, "", "solid"];
    color_tye = "solid";
  }
  //console.log("genBuChar node:", node, "pPrNode", pPrNode, " buClrNode: ", buClrNode, "defBultColor:", defBultColor,"dfltBultColor:" , dfltBultColor , "bultColor:", bultColor)

  //console.log("genBuChar: buClrNode: ", buClrNode, "bultColor", bultColor)
  //get definde bullet SIZE
  if (buFontSize === undefined) {
    buFontSize = getTextByPathList(pPrNodeLaout, ["a:buSzPts", "attrs", "val"]);
    if (buFontSize === undefined) {
      buFontSize = getTextByPathList(pPrNodeLaout, ["a:buSzPct", "attrs", "val"]);
      if (buFontSize !== undefined) {
        const prcnt = parseInt(buFontSize) / 100000;
        //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
        const dfltBultSizeNoPt = parseInt(dfltBultSize);
        bultSize = prcnt * dfltBultSizeNoPt + "px"; // + "pt";
      }
    } else {
      bultSize = (parseInt(buFontSize) / 100) * fontSizeFactor + "px";
    }
  }
  if (buFontSize === undefined) {
    buFontSize = getTextByPathList(pPrNodeMaster, ["a:buSzPts", "attrs", "val"]);
    if (buFontSize === undefined) {
      buFontSize = getTextByPathList(pPrNodeMaster, ["a:buSzPct", "attrs", "val"]);
      if (buFontSize !== undefined) {
        const prcnt = parseInt(buFontSize) / 100000;
        //dfltBultSize = XXpt
        //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
        const dfltBultSizeNoPt = parseInt(dfltBultSize);
        bultSize = prcnt * dfltBultSizeNoPt + "px"; // + "pt";
      }
    } else {
      bultSize = (parseInt(buFontSize) / 100) * fontSizeFactor + "px";
    }
  }
  if (buFontSize === undefined) {
    bultSize = dfltBultSize;
  }
  font_val = parseInt(bultSize);
  ////////////////////////////////////////////////////////////////////////
  if (buType === "TYPE_BULLET") {
    bullet = renderBulletChar(
      pPrNode,
      buChar,
      bultColor,
      color_tye,
      bultSize,
      marLStr,
      marRStr,
      isRTL,
      font_val
    );
  } else if (buType === "TYPE_NUMERIC") {
    bullet = renderBulletNumeric(bultColor, bultSize, marLStr, marRStr, isRTL, buNum, lvl);
  } else if (buType === "TYPE_BULPIC") {
    bullet = renderBulletPic(buPic, warpObj, marLStr, marRStr, bultSize, isRTL);
  }
  // else {
  //     bullet = "<div style='margin-left: " + 328600 * slideFactor * lvl + "px" +
  //         "; margin-right: " + 0 + "px;'></div>";
  // }
  //console.log("genBuChar: width: ", $(bullet).outerWidth())
  return [bullet, margin_val, font_val]; //$(bullet).outerWidth()];
}
