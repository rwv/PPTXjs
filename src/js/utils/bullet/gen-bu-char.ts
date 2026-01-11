import { getTextByPathList } from "../object";
import { getFontColorPr, getFontSize } from "../font";
import { getLayoutAndMasterNode } from "../layout";
import { getSolidFill } from "../color";
import { renderBulletChar, renderBulletNumeric, renderBulletPic } from "./handlers";
import type { PptxArchive } from "../../archive/pptx-archive";

type BulletWarpObj = {
  slideResObj: Record<string, { target: string }>;
  archive: PptxArchive;
  [key: string]: unknown;
};

const parsePxValue = (value: string | number | undefined): number => {
  if (value === undefined) {
    return NaN;
  }
  return Number.parseFloat(String(value));
};

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
 * @param paragraphNode - Paragraph node containing bullet definition
 * @param paragraphIndex - Paragraph index (used for variable naming, but shadowed in loop)
 * @param shapeNode - Shape node containing the text
 * @param textBody - Text body node with list styles
 * @param parentFontStyle - Parent font style for color inheritance
 * @param placeholderIndex - Placeholder index for layout lookup
 * @param shapeType - Shape type for layout resolution
 * @param warpContext - Warp object containing slide resources and styles
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @returns Array [bulletHTML, marginValue, fontValue] or empty string if no bullet
 */
export async function genBuChar(
  paragraphNode: Record<string, unknown>,
  paragraphIndex: number,
  shapeNode: Record<string, unknown>,
  textBody: Record<string, unknown>,
  parentFontStyle: Record<string, unknown> | undefined,
  placeholderIndex: number | string | undefined,
  shapeType: string | undefined,
  warpContext: BulletWarpObj,
  emuToPx: number,
  fontSizeScale: number
): Promise<string | [string, number, number]> {
  void paragraphIndex;
  //console.log("genBuChar node: ", node, ", spNode: ", spNode, ", pFontStyle: ", pFontStyle, "type", type)
  ///////////////////////////////////////Amir///////////////////////////////
  const listStyle = textBody["a:lstStyle"] as Record<string, unknown> | undefined;

  let runNode = getTextByPathList(paragraphNode, ["a:r"]) as
    | Record<string, unknown>
    | Record<string, unknown>[]
    | undefined;
  if (runNode !== undefined && runNode.constructor === Array) {
    runNode = runNode[0]; //bullet only to first "a:r"
  }
  let level = parseInt(getTextByPathList(paragraphNode["a:pPr"], ["attrs", "lvl"])) + 1;
  if (isNaN(level)) {
    level = 1;
  }
  const levelStyleKey = "a:lvl" + level + "pPr";
  let defaultBulletColor, defaultBulletSize, bulletColor, bulletSize, colorType;

  if (runNode !== undefined) {
    const runNodeRecord = runNode as Record<string, unknown>;
    defaultBulletColor = getFontColorPr(
      runNodeRecord,
      shapeNode,
      listStyle,
      parentFontStyle,
      level,
      placeholderIndex,
      shapeType,
      warpContext,
      emuToPx
    );
    colorType = defaultBulletColor[2];
    defaultBulletSize = getFontSize(
      runNodeRecord,
      textBody,
      parentFontStyle,
      level,
      shapeType,
      warpContext,
      fontSizeScale
    );
  } else {
    return "";
  }
  //console.log("Bullet Size: " + bultSize);

  let bulletHtml = "",
    marginRightStyle = "",
    marginLeftStyle = "",
    marginValue = 0,
    fontValue = 0;
  /////////////////////////////////////////////////////////////////

  let paragraphPropsNode = paragraphNode["a:pPr"] as Record<string, unknown> | undefined;
  let bulletNoneNode = getTextByPathList(paragraphPropsNode, ["a:buNone"]);
  if (bulletNoneNode !== undefined) {
    return "";
  }

  let bulletType = "TYPE_NONE";

  const layoutMasterNode = getLayoutAndMasterNode(
    paragraphNode,
    placeholderIndex,
    shapeType,
    warpContext
  );
  const layoutParagraphPropsNode = layoutMasterNode.nodeLayout;
  const masterParagraphPropsNode = layoutMasterNode.nodeMaster;

  let bulletChar = getTextByPathList(paragraphPropsNode, ["a:buChar", "attrs", "char"]);
  let bulletNumberType = getTextByPathList(paragraphPropsNode, ["a:buAutoNum", "attrs", "type"]);
  let bulletPicNode = getTextByPathList(paragraphPropsNode, ["a:buBlip"]) as
    | Record<string, unknown>
    | undefined;
  if (bulletChar !== undefined) {
    bulletType = "TYPE_BULLET";
  }
  if (bulletNumberType !== undefined) {
    bulletType = "TYPE_NUMERIC";
  }
  if (bulletPicNode !== undefined) {
    bulletType = "TYPE_BULPIC";
  }

  let bulletFontSize = getTextByPathList(paragraphPropsNode, ["a:buSzPts", "attrs", "val"]);
  if (bulletFontSize === undefined) {
    bulletFontSize = getTextByPathList(paragraphPropsNode, ["a:buSzPct", "attrs", "val"]);
    if (bulletFontSize !== undefined) {
      const scaleFraction = parseInt(bulletFontSize) / 100000;
      //dfltBultSize = XXpt
      //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
      const defaultBulletSizeValue = parsePxValue(defaultBulletSize);
      bulletSize = scaleFraction * defaultBulletSizeValue + "px"; // + "pt";
    }
  } else {
    bulletSize = (parseInt(bulletFontSize) / 100) * fontSizeScale + "px";
  }

  //get definde bullet COLOR
  let bulletColorNode = getTextByPathList(paragraphPropsNode, ["a:buClr"]);

  if (bulletChar === undefined && bulletNumberType === undefined && bulletPicNode === undefined) {
    if (listStyle !== undefined) {
      bulletNoneNode = getTextByPathList(listStyle, [levelStyleKey, "a:buNone"]);
      if (bulletNoneNode !== undefined) {
        return "";
      }
      bulletType = "TYPE_NONE";
      bulletChar = getTextByPathList(listStyle, [levelStyleKey, "a:buChar", "attrs", "char"]);
      bulletNumberType = getTextByPathList(listStyle, [
        levelStyleKey,
        "a:buAutoNum",
        "attrs",
        "type",
      ]);
      bulletPicNode = getTextByPathList(listStyle, [levelStyleKey, "a:buBlip"]);
      if (bulletChar !== undefined) {
        bulletType = "TYPE_BULLET";
      }
      if (bulletNumberType !== undefined) {
        bulletType = "TYPE_NUMERIC";
      }
      if (bulletPicNode !== undefined) {
        bulletType = "TYPE_BULPIC";
      }
      if (
        bulletChar !== undefined ||
        bulletNumberType !== undefined ||
        bulletPicNode !== undefined
      ) {
        paragraphPropsNode = listStyle[levelStyleKey] as Record<string, unknown> | undefined;
      }
    }
  }
  if (bulletChar === undefined && bulletNumberType === undefined && bulletPicNode === undefined) {
    //check in slidelayout and masterlayout - TODO
    if (layoutParagraphPropsNode !== undefined) {
      bulletNoneNode = getTextByPathList(layoutParagraphPropsNode, ["a:buNone"]);
      if (bulletNoneNode !== undefined) {
        return "";
      }
      bulletType = "TYPE_NONE";
      bulletChar = getTextByPathList(layoutParagraphPropsNode, ["a:buChar", "attrs", "char"]);
      bulletNumberType = getTextByPathList(layoutParagraphPropsNode, [
        "a:buAutoNum",
        "attrs",
        "type",
      ]);
      bulletPicNode = getTextByPathList(layoutParagraphPropsNode, ["a:buBlip"]);
      if (bulletChar !== undefined) {
        bulletType = "TYPE_BULLET";
      }
      if (bulletNumberType !== undefined) {
        bulletType = "TYPE_NUMERIC";
      }
      if (bulletPicNode !== undefined) {
        bulletType = "TYPE_BULPIC";
      }
    }
    if (bulletChar === undefined && bulletNumberType === undefined && bulletPicNode === undefined) {
      //masterlayout

      if (masterParagraphPropsNode !== undefined) {
        bulletNoneNode = getTextByPathList(masterParagraphPropsNode, ["a:buNone"]);
        if (bulletNoneNode !== undefined) {
          return "";
        }
        bulletType = "TYPE_NONE";
        bulletChar = getTextByPathList(masterParagraphPropsNode, ["a:buChar", "attrs", "char"]);
        bulletNumberType = getTextByPathList(masterParagraphPropsNode, [
          "a:buAutoNum",
          "attrs",
          "type",
        ]);
        bulletPicNode = getTextByPathList(masterParagraphPropsNode, ["a:buBlip"]);
        if (bulletChar !== undefined) {
          bulletType = "TYPE_BULLET";
        }
        if (bulletNumberType !== undefined) {
          bulletType = "TYPE_NUMERIC";
        }
        if (bulletPicNode !== undefined) {
          bulletType = "TYPE_BULPIC";
        }
      }
    }
  }
  //rtl
  let rtlValue = getTextByPathList(paragraphPropsNode, ["attrs", "rtl"]);
  if (rtlValue === undefined) {
    rtlValue = getTextByPathList(layoutParagraphPropsNode, ["attrs", "rtl"]);
    if (rtlValue === undefined && shapeType !== "shape") {
      rtlValue = getTextByPathList(masterParagraphPropsNode, ["attrs", "rtl"]);
    }
  }
  let isRtl = false;
  if (rtlValue !== undefined && rtlValue === "1") {
    isRtl = true;
  }
  //align
  let alignNode = getTextByPathList(paragraphPropsNode, ["attrs", "algn"]); //"l" | "ctr" | "r" | "just" | "justLow" | "dist" | "thaiDist
  if (alignNode === undefined) {
    alignNode = getTextByPathList(layoutParagraphPropsNode, ["attrs", "algn"]);
    if (alignNode === undefined) {
      alignNode = getTextByPathList(masterParagraphPropsNode, ["attrs", "algn"]);
    }
  }
  //indent?
  let indentNode = getTextByPathList(paragraphPropsNode, ["attrs", "indent"]);
  if (indentNode === undefined) {
    indentNode = getTextByPathList(layoutParagraphPropsNode, ["attrs", "indent"]);
    if (indentNode === undefined) {
      indentNode = getTextByPathList(masterParagraphPropsNode, ["attrs", "indent"]);
    }
  }
  let indentValue = 0;
  if (indentNode !== undefined) {
    indentValue = parseInt(indentNode) * emuToPx;
  }
  //marL
  let marLNode = getTextByPathList(paragraphPropsNode, ["attrs", "marL"]);
  if (marLNode === undefined) {
    marLNode = getTextByPathList(layoutParagraphPropsNode, ["attrs", "marL"]);
    if (marLNode === undefined) {
      marLNode = getTextByPathList(masterParagraphPropsNode, ["attrs", "marL"]);
    }
  }
  //console.log("genBuChar() isRTL", isRTL, "alignNode:", alignNode)
  if (marLNode !== undefined) {
    const marginLeft = parseInt(marLNode) * emuToPx;
    if (isRtl) {
      // && alignNode == "r") {
      marginLeftStyle = "padding-right:"; // "margin-right: ";
    } else {
      marginLeftStyle = "padding-left:"; //"margin-left: ";
    }
    marginValue = marginLeft + indentValue < 0 ? 0 : marginLeft + indentValue;
    marginLeftStyle += marginValue + "px;";
  }

  //marR?
  let marRNode = getTextByPathList(paragraphPropsNode, ["attrs", "marR"]);
  if (marRNode === undefined && marLNode === undefined) {
    //need to check if this posble - TODO
    marRNode = getTextByPathList(layoutParagraphPropsNode, ["attrs", "marR"]);
    if (marRNode === undefined) {
      marRNode = getTextByPathList(masterParagraphPropsNode, ["attrs", "marR"]);
    }
  }
  if (marRNode !== undefined) {
    const marginRight = parseInt(marRNode) * emuToPx;
    if (isRtl) {
      // && alignNode == "r") {
      marginLeftStyle = "padding-right:"; // "margin-right: ";
    } else {
      marginLeftStyle = "padding-left:"; //"margin-left: ";
    }
    marginRightStyle += (marginRight + indentValue < 0 ? 0 : marginRight + indentValue) + "px;";
  }

  if (bulletType !== "TYPE_NONE") {
    //var buFontAttrs = getTextByPathList(pPrNode, ["a:buFont", "attrs"]);
  }
  //console.log("Bullet Type: " + buType);
  //console.log("NumericTypr: " + buNum);
  //console.log("buChar: " + (buChar === undefined?'':buChar.charCodeAt(0)));
  //get definde bullet COLOR
  if (bulletColorNode === undefined) {
    //lstStyle
    bulletColorNode = getTextByPathList(listStyle, [levelStyleKey, "a:buClr"]);
  }
  if (bulletColorNode === undefined) {
    bulletColorNode = getTextByPathList(layoutParagraphPropsNode, ["a:buClr"]);
    if (bulletColorNode === undefined) {
      bulletColorNode = getTextByPathList(masterParagraphPropsNode, ["a:buClr"]);
    }
  }
  let resolvedBulletColor;
  if (bulletColorNode !== undefined) {
    resolvedBulletColor = getSolidFill(bulletColorNode, undefined, undefined, warpContext);
  } else {
    if (parentFontStyle !== undefined) {
      //console.log("genBuChar pFontStyle: ", pFontStyle)
      resolvedBulletColor = getSolidFill(parentFontStyle, undefined, undefined, warpContext);
    }
  }
  if (resolvedBulletColor === undefined || resolvedBulletColor === "NONE") {
    bulletColor = defaultBulletColor;
  } else {
    bulletColor = [resolvedBulletColor, "", "solid"];
    colorType = "solid";
  }
  //console.log("genBuChar node:", node, "pPrNode", pPrNode, " buClrNode: ", buClrNode, "defBultColor:", defBultColor,"dfltBultColor:" , dfltBultColor , "bultColor:", bultColor)

  //console.log("genBuChar: buClrNode: ", buClrNode, "bultColor", bultColor)
  //get definde bullet SIZE
  if (bulletFontSize === undefined) {
    bulletFontSize = getTextByPathList(layoutParagraphPropsNode, ["a:buSzPts", "attrs", "val"]);
    if (bulletFontSize === undefined) {
      bulletFontSize = getTextByPathList(layoutParagraphPropsNode, ["a:buSzPct", "attrs", "val"]);
      if (bulletFontSize !== undefined) {
        const scaleFraction = parseInt(bulletFontSize) / 100000;
        //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
        const defaultBulletSizeValue = parsePxValue(defaultBulletSize);
        bulletSize = scaleFraction * defaultBulletSizeValue + "px"; // + "pt";
      }
    } else {
      bulletSize = (parseInt(bulletFontSize) / 100) * fontSizeScale + "px";
    }
  }
  if (bulletFontSize === undefined) {
    bulletFontSize = getTextByPathList(masterParagraphPropsNode, ["a:buSzPts", "attrs", "val"]);
    if (bulletFontSize === undefined) {
      bulletFontSize = getTextByPathList(masterParagraphPropsNode, ["a:buSzPct", "attrs", "val"]);
      if (bulletFontSize !== undefined) {
        const scaleFraction = parseInt(bulletFontSize) / 100000;
        //dfltBultSize = XXpt
        //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
        const defaultBulletSizeValue = parsePxValue(defaultBulletSize);
        bulletSize = scaleFraction * defaultBulletSizeValue + "px"; // + "pt";
      }
    } else {
      bulletSize = (parseInt(bulletFontSize) / 100) * fontSizeScale + "px";
    }
  }
  if (bulletFontSize === undefined) {
    bulletSize = defaultBulletSize;
  }
  fontValue = parsePxValue(bulletSize);
  ////////////////////////////////////////////////////////////////////////
  if (bulletType === "TYPE_BULLET") {
    bulletHtml = renderBulletChar(
      paragraphPropsNode,
      bulletChar,
      bulletColor,
      colorType,
      bulletSize,
      marginLeftStyle,
      marginRightStyle,
      isRtl,
      fontValue
    );
  } else if (bulletType === "TYPE_NUMERIC") {
    bulletHtml = renderBulletNumeric(
      bulletColor,
      bulletSize,
      marginLeftStyle,
      marginRightStyle,
      isRtl,
      bulletNumberType,
      level
    );
  } else if (bulletType === "TYPE_BULPIC") {
    bulletHtml = await renderBulletPic(
      bulletPicNode as Record<string, unknown>,
      warpContext,
      marginLeftStyle,
      marginRightStyle,
      bulletSize,
      isRtl
    );
  }
  // else {
  //     bullet = "<div style='margin-left: " + 328600 * slideFactor * lvl + "px" +
  //         "; margin-right: " + 0 + "px;'></div>";
  // }
  //console.log("genBuChar: width: ", $(bullet).outerWidth())
  return [bulletHtml, marginValue, fontValue]; //$(bullet).outerWidth()];
}
