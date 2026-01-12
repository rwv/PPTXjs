import { getTextByPathList } from "../object";
import { getFontColorPr, getFontSize } from "../font";
import { getLayoutAndMasterNode } from "../layout";
import { getSolidFill } from "../color";
import { renderBulletChar, renderBulletNumeric, renderBulletPic } from "./handlers";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

type BulletColor = unknown[];

const parsePxValue = (value: string | number | undefined): number => {
  if (value === undefined) {
    return NaN;
  }
  return Number.parseFloat(String(value));
};

const parseIntValue = (value: string | number | undefined): number => {
  if (value === undefined) {
    return NaN;
  }
  return Number.parseInt(String(value), 10);
};

const getValue = <T extends XmlValue>(
  node: XmlNode | undefined,
  path: Array<keyof XmlNode>
): T | undefined => {
  if (!node) {
    return undefined;
  }
  return getTextByPathList<T>(node, path);
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
  paragraphNode: XmlNode,
  paragraphIndex: number,
  shapeNode: XmlNode,
  textBody: XmlNode,
  parentFontStyle: XmlNode | undefined,
  placeholderIndex: number | string | undefined,
  shapeType: string | undefined,
  warpContext: WarpContext,
  emuToPx: number,
  fontSizeScale: number
): Promise<string | [string, number, number]> {
  void paragraphIndex;
  //console.log("genBuChar node: ", node, ", spNode: ", spNode, ", pFontStyle: ", pFontStyle, "type", type)
  ///////////////////////////////////////Amir///////////////////////////////
  const listStyle = getValue<XmlNode>(textBody, ["a:lstStyle"]);

  let runNode = getValue<XmlNode | XmlNode[]>(paragraphNode, ["a:r"]);
  if (Array.isArray(runNode)) {
    runNode = runNode[0]; //bullet only to first "a:r"
  }
  const paragraphPropsNodeInitial = getValue<XmlNode>(paragraphNode, ["a:pPr"]);
  const levelValue = getValue<string | number>(paragraphPropsNodeInitial, ["attrs", "lvl"]);
  let level = levelValue !== undefined ? Number(levelValue) + 1 : 1;
  if (Number.isNaN(level)) {
    level = 1;
  }
  const levelStyleKey = "a:lvl" + level + "pPr";
  let defaultBulletColor: BulletColor;
  let defaultBulletSize: string | undefined;
  let bulletColor: BulletColor;
  let bulletSize: string | undefined;
  let colorType: string | undefined;

  if (runNode !== undefined) {
    const defaultBulletColorRaw = getFontColorPr(
      runNode,
      shapeNode,
      listStyle,
      parentFontStyle,
      level,
      placeholderIndex,
      shapeType,
      warpContext,
      emuToPx
    );
    defaultBulletColor = defaultBulletColorRaw as BulletColor;
    colorType = defaultBulletColorRaw[2];
    defaultBulletSize = getFontSize(
      runNode,
      textBody,
      parentFontStyle,
      level,
      shapeType,
      warpContext as unknown as Parameters<typeof getFontSize>[5],
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

  let paragraphPropsNode = paragraphPropsNodeInitial;
  let bulletNoneNode = getValue<XmlNode>(paragraphPropsNode, ["a:buNone"]);
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

  let bulletChar = getValue<string>(paragraphPropsNode, ["a:buChar", "attrs", "char"]);
  let bulletNumberType = getValue<string>(paragraphPropsNode, ["a:buAutoNum", "attrs", "type"]);
  let bulletPicNode = getValue<XmlNode>(paragraphPropsNode, ["a:buBlip"]);
  if (bulletChar !== undefined) {
    bulletType = "TYPE_BULLET";
  }
  if (bulletNumberType !== undefined) {
    bulletType = "TYPE_NUMERIC";
  }
  if (bulletPicNode !== undefined) {
    bulletType = "TYPE_BULPIC";
  }

  let bulletFontSize = getValue<string | number>(paragraphPropsNode, ["a:buSzPts", "attrs", "val"]);
  if (bulletFontSize === undefined) {
    bulletFontSize = getValue<string | number>(paragraphPropsNode, ["a:buSzPct", "attrs", "val"]);
    if (bulletFontSize !== undefined) {
      const scaleFraction = parseIntValue(bulletFontSize) / 100000;
      //dfltBultSize = XXpt
      //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
      const defaultBulletSizeValue = parsePxValue(defaultBulletSize);
      bulletSize = scaleFraction * defaultBulletSizeValue + "px"; // + "pt";
    }
  } else {
    bulletSize = (parseIntValue(bulletFontSize) / 100) * fontSizeScale + "px";
  }

  //get definde bullet COLOR
  let bulletColorNode = getValue<XmlNode>(paragraphPropsNode, ["a:buClr"]);

  if (bulletChar === undefined && bulletNumberType === undefined && bulletPicNode === undefined) {
    if (listStyle !== undefined) {
      bulletNoneNode = getValue<XmlNode>(listStyle, [levelStyleKey, "a:buNone"]);
      if (bulletNoneNode !== undefined) {
        return "";
      }
      bulletType = "TYPE_NONE";
      bulletChar = getValue<string>(listStyle, [levelStyleKey, "a:buChar", "attrs", "char"]);
      bulletNumberType = getValue<string>(listStyle, [
        levelStyleKey,
        "a:buAutoNum",
        "attrs",
        "type",
      ]);
      bulletPicNode = getValue<XmlNode>(listStyle, [levelStyleKey, "a:buBlip"]);
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
        paragraphPropsNode = getValue<XmlNode>(listStyle, [levelStyleKey]);
      }
    }
  }
  if (bulletChar === undefined && bulletNumberType === undefined && bulletPicNode === undefined) {
    //check in slidelayout and masterlayout - TODO
    if (layoutParagraphPropsNode !== undefined) {
      bulletNoneNode = getValue<XmlNode>(layoutParagraphPropsNode, ["a:buNone"]);
      if (bulletNoneNode !== undefined) {
        return "";
      }
      bulletType = "TYPE_NONE";
      bulletChar = getValue<string>(layoutParagraphPropsNode, ["a:buChar", "attrs", "char"]);
      bulletNumberType = getValue<string>(layoutParagraphPropsNode, [
        "a:buAutoNum",
        "attrs",
        "type",
      ]);
      bulletPicNode = getValue<XmlNode>(layoutParagraphPropsNode, ["a:buBlip"]);
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
        bulletNoneNode = getValue<XmlNode>(masterParagraphPropsNode, ["a:buNone"]);
        if (bulletNoneNode !== undefined) {
          return "";
        }
        bulletType = "TYPE_NONE";
        bulletChar = getValue<string>(masterParagraphPropsNode, ["a:buChar", "attrs", "char"]);
        bulletNumberType = getValue<string>(masterParagraphPropsNode, [
          "a:buAutoNum",
          "attrs",
          "type",
        ]);
        bulletPicNode = getValue<XmlNode>(masterParagraphPropsNode, ["a:buBlip"]);
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
  let rtlValue = getValue<string | number>(paragraphPropsNode, ["attrs", "rtl"]);
  if (rtlValue === undefined) {
    rtlValue = getValue<string | number>(layoutParagraphPropsNode, ["attrs", "rtl"]);
    if (rtlValue === undefined && shapeType !== "shape") {
      rtlValue = getValue<string | number>(masterParagraphPropsNode, ["attrs", "rtl"]);
    }
  }
  let isRtl = false;
  if (rtlValue !== undefined && String(rtlValue) === "1") {
    isRtl = true;
  }
  //align
  let alignNode = getValue<string | number>(paragraphPropsNode, ["attrs", "algn"]); //"l" | "ctr" | "r" | "just" | "justLow" | "dist" | "thaiDist
  if (alignNode === undefined) {
    alignNode = getValue<string | number>(layoutParagraphPropsNode, ["attrs", "algn"]);
    if (alignNode === undefined) {
      alignNode = getValue<string | number>(masterParagraphPropsNode, ["attrs", "algn"]);
    }
  }
  //indent?
  let indentNode = getValue<string | number>(paragraphPropsNode, ["attrs", "indent"]);
  if (indentNode === undefined) {
    indentNode = getValue<string | number>(layoutParagraphPropsNode, ["attrs", "indent"]);
    if (indentNode === undefined) {
      indentNode = getValue<string | number>(masterParagraphPropsNode, ["attrs", "indent"]);
    }
  }
  let indentValue = 0;
  if (indentNode !== undefined) {
    indentValue = parseIntValue(indentNode) * emuToPx;
  }
  //marL
  let marLNode = getValue<string | number>(paragraphPropsNode, ["attrs", "marL"]);
  if (marLNode === undefined) {
    marLNode = getValue<string | number>(layoutParagraphPropsNode, ["attrs", "marL"]);
    if (marLNode === undefined) {
      marLNode = getValue<string | number>(masterParagraphPropsNode, ["attrs", "marL"]);
    }
  }
  //console.log("genBuChar() isRTL", isRTL, "alignNode:", alignNode)
  if (marLNode !== undefined) {
    const marginLeft = parseIntValue(marLNode) * emuToPx;
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
  let marRNode = getValue<string | number>(paragraphPropsNode, ["attrs", "marR"]);
  if (marRNode === undefined && marLNode === undefined) {
    //need to check if this posble - TODO
    marRNode = getValue<string | number>(layoutParagraphPropsNode, ["attrs", "marR"]);
    if (marRNode === undefined) {
      marRNode = getValue<string | number>(masterParagraphPropsNode, ["attrs", "marR"]);
    }
  }
  if (marRNode !== undefined) {
    const marginRight = parseIntValue(marRNode) * emuToPx;
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
    bulletColorNode = getValue<XmlNode>(listStyle, [levelStyleKey, "a:buClr"]);
  }
  if (bulletColorNode === undefined) {
    bulletColorNode = getValue<XmlNode>(layoutParagraphPropsNode, ["a:buClr"]);
    if (bulletColorNode === undefined) {
      bulletColorNode = getValue<XmlNode>(masterParagraphPropsNode, ["a:buClr"]);
    }
  }
  let resolvedBulletColor;
  if (bulletColorNode !== undefined) {
    resolvedBulletColor = getSolidFill(
      bulletColorNode as Parameters<typeof getSolidFill>[0],
      undefined,
      undefined,
      warpContext
    );
  } else {
    if (parentFontStyle !== undefined) {
      //console.log("genBuChar pFontStyle: ", pFontStyle)
      resolvedBulletColor = getSolidFill(
        parentFontStyle as Parameters<typeof getSolidFill>[0],
        undefined,
        undefined,
        warpContext
      );
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
    bulletFontSize = getValue<string | number>(layoutParagraphPropsNode, [
      "a:buSzPts",
      "attrs",
      "val",
    ]);
    if (bulletFontSize === undefined) {
      bulletFontSize = getValue<string | number>(layoutParagraphPropsNode, [
        "a:buSzPct",
        "attrs",
        "val",
      ]);
      if (bulletFontSize !== undefined) {
        const scaleFraction = parseIntValue(bulletFontSize) / 100000;
        //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
        const defaultBulletSizeValue = parsePxValue(defaultBulletSize);
        bulletSize = scaleFraction * defaultBulletSizeValue + "px"; // + "pt";
      }
    } else {
      bulletSize = (parseIntValue(bulletFontSize) / 100) * fontSizeScale + "px";
    }
  }
  if (bulletFontSize === undefined) {
    bulletFontSize = getValue<string | number>(masterParagraphPropsNode, [
      "a:buSzPts",
      "attrs",
      "val",
    ]);
    if (bulletFontSize === undefined) {
      bulletFontSize = getValue<string | number>(masterParagraphPropsNode, [
        "a:buSzPct",
        "attrs",
        "val",
      ]);
      if (bulletFontSize !== undefined) {
        const scaleFraction = parseIntValue(bulletFontSize) / 100000;
        //dfltBultSize = XXpt
        //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
        const defaultBulletSizeValue = parsePxValue(defaultBulletSize);
        bulletSize = scaleFraction * defaultBulletSizeValue + "px"; // + "pt";
      }
    } else {
      bulletSize = (parseIntValue(bulletFontSize) / 100) * fontSizeScale + "px";
    }
  }
  if (bulletFontSize === undefined) {
    bulletSize = defaultBulletSize;
  }
  fontValue = parsePxValue(bulletSize);
  const resolvedBulletSize = bulletSize ?? defaultBulletSize ?? "0px";
  const resolvedColorType = colorType ?? "solid";
  ////////////////////////////////////////////////////////////////////////
  if (bulletType === "TYPE_BULLET") {
    bulletHtml = renderBulletChar(
      paragraphPropsNode,
      bulletChar ?? "",
      bulletColor as Parameters<typeof renderBulletChar>[2],
      resolvedColorType,
      resolvedBulletSize,
      marginLeftStyle,
      marginRightStyle,
      isRtl,
      fontValue
    );
  } else if (bulletType === "TYPE_NUMERIC") {
    bulletHtml = renderBulletNumeric(
      bulletColor as unknown as string[],
      resolvedBulletSize,
      marginLeftStyle,
      marginRightStyle,
      isRtl,
      bulletNumberType ?? "",
      level
    );
  } else if (bulletType === "TYPE_BULPIC") {
    bulletHtml = await renderBulletPic(
      bulletPicNode as XmlNode,
      warpContext,
      marginLeftStyle,
      marginRightStyle,
      resolvedBulletSize,
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
