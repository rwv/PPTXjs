/**
 * Initializes shape rendering context
 *
 * This module handles:
 * - Transform calculations (position, size, rotation, flip)
 * - SVG container setup
 * - Fill processing (solid, gradient, pattern, picture)
 * - Border/stroke processing
 */

import { getTextByPathList } from "../object";
import { angleToDegrees, getPosition, getSize } from "../layout";
import { getShapeFill, getFillType } from "../fill";
import { getBorder } from "../border";
import { getSvgGradient, getSvgImagePattern } from "../svg";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

export interface ShapeContext {
  /** Shape transform nodes */
  slideXfrmNode: XmlNode | undefined;
  slideLayoutXfrmNode: XmlNode | undefined;
  slideMasterXfrmNode: XmlNode | undefined;

  /** Shape IDs and types */
  shpId: number | string;
  shapType: string | undefined;
  custShapType: XmlNode | undefined;

  /** Transform properties */
  rotate: number | undefined;
  txtRotate: number | undefined;
  flip: string;

  /** Shape dimensions (in pixels) */
  x: number;
  y: number;
  w: number;
  h: number;

  /** SVG and CSS naming */
  svgCssName: string;
  effectsClassName: string;

  /** Fill properties */
  fillColor: string;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  clrFillType: string;

  /** Border properties */
  border: {
    color: string;
    width: string;
    strokeDasharray: string;
  };

  /** Initial SVG markup with defs */
  svgHeader: string;
  defsContent: string;
}

/**
 * Initialize shape rendering context
 */
export async function initShapeContext(
  node: XmlNode,
  pNode: XmlNode | undefined,
  slideLayoutSpNode: XmlNode | undefined,
  slideMasterSpNode: XmlNode | undefined,
  id: number | string | undefined,
  idx: number | string | undefined,
  type: string | undefined,
  name: string | undefined,
  order: number | string | undefined,
  sType: string | undefined,
  source: string,
  warpContext: WarpContext,
  emuToPx: number,
  styleTable: Record<string, { name: string; text: string }>
): Promise<ShapeContext | null> {
  //var dltX = 0;
  //var dltY = 0;
  const xfrmList = ["p:spPr", "a:xfrm"];
  const slideXfrmNode = asXmlNode(getTextByPathList(node, xfrmList));
  const slideLayoutXfrmNode = slideLayoutSpNode
    ? asXmlNode(getTextByPathList(slideLayoutSpNode, xfrmList))
    : undefined;
  const slideMasterXfrmNode = slideMasterSpNode
    ? asXmlNode(getTextByPathList(slideMasterSpNode, xfrmList))
    : undefined;

  const shpId = getTextByPathList<string | number>(node, ["attrs", "order"]) ?? "";
  //console.log("shpId: ",shpId)
  const shapType = getTextByPathList<string>(node, ["p:spPr", "a:prstGeom", "attrs", "prst"]);

  //custGeom - Amir
  const custShapType = asXmlNode(getTextByPathList(node, ["p:spPr", "a:custGeom"]));

  let isFlipV = false;
  let isFlipH = false;
  let flip = "";
  const flipVValue = slideXfrmNode
    ? getTextByPathList<string | number>(slideXfrmNode, ["attrs", "flipV"])
    : undefined;
  if (String(flipVValue) === "1") {
    isFlipV = true;
  }
  const flipHValue = slideXfrmNode
    ? getTextByPathList<string | number>(slideXfrmNode, ["attrs", "flipH"])
    : undefined;
  if (String(flipHValue) === "1") {
    isFlipH = true;
  }
  if (isFlipH && !isFlipV) {
    flip = " scale(-1,1)";
  } else if (!isFlipH && isFlipV) {
    flip = " scale(1,-1)";
  } else if (isFlipH && isFlipV) {
    flip = " scale(-1,-1)";
  }
  /////////////////////////Amir////////////////////////
  //rotate
  const rotateValue = slideXfrmNode
    ? getTextByPathList<string | number>(slideXfrmNode, ["attrs", "rot"])
    : undefined;
  const rotate = angleToDegrees(rotateValue ?? null);

  //console.log("genShape rotate: " + rotate);
  let txtRotate;
  const txtXframeNode = asXmlNode(getTextByPathList(node, ["p:txXfrm"]));
  if (txtXframeNode !== undefined) {
    const txtXframeRot = getTextByPathList<string | number>(txtXframeNode, ["attrs", "rot"]);
    if (txtXframeRot !== undefined) {
      txtRotate = angleToDegrees(txtXframeRot) + 90;
    }
  } else {
    txtRotate = rotate;
  }
  //////////////////////////////////////////////////
  if (shapType !== undefined || custShapType !== undefined /*&& slideXfrmNode !== undefined*/) {
    if (!slideXfrmNode) {
      return null;
    }
    const offAttrs = getTextByPathList<Record<string, string | number>>(slideXfrmNode, [
      "a:off",
      "attrs",
    ]);
    const extAttrs = getTextByPathList<Record<string, string | number>>(slideXfrmNode, [
      "a:ext",
      "attrs",
    ]);
    if (!offAttrs || !extAttrs) {
      return null;
    }
    const x = parseInt(String(offAttrs["x"] ?? "0"), 10) * emuToPx;
    const y = parseInt(String(offAttrs["y"] ?? "0"), 10) * emuToPx;

    const w = parseInt(String(extAttrs["cx"] ?? "0"), 10) * emuToPx;
    const h = parseInt(String(extAttrs["cy"] ?? "0"), 10) * emuToPx;

    const svgCssName =
      "_svg_css_" + (Object.keys(styleTable).length + 1) + "_" + Math.floor(Math.random() * 1001);
    //console.log("name:", name, "svgCssName: ", svgCssName)
    const effectsClassName = svgCssName + "_effects";

    const svgHeader =
      "<svg class='drawing " +
      svgCssName +
      " " +
      effectsClassName +
      " ' _id='" +
      id +
      "' _idx='" +
      idx +
      "' _type='" +
      type +
      "' _name='" +
      name +
      "'" +
      "' style='" +
      getPosition(slideXfrmNode, pNode, undefined, undefined, sType, emuToPx) +
      getSize(slideXfrmNode, undefined, undefined, emuToPx) +
      " z-index: " +
      order +
      ";" +
      "transform: rotate(" +
      (rotate !== undefined ? rotate : 0) +
      "deg)" +
      flip +
      ";" +
      "'>";

    let defsContent = "";

    // Fill Color
    let fillColor = await getShapeFill(node, pNode, true, warpContext, source);
    //console.log("genShape: fillColor: ", fillColor)
    let grndFillFlg = false;
    let imgFillFlg = false;
    const shapePropsNode = asXmlNode(getTextByPathList(node, ["p:spPr"]));
    let clrFillType = shapePropsNode ? getFillType(shapePropsNode as Record<string, unknown>) : "";
    if (clrFillType === "GROUP_FILL") {
      const groupShapeProps = pNode
        ? asXmlNode(getTextByPathList(pNode, ["p:grpSpPr"]))
        : undefined;
      clrFillType = groupShapeProps ? getFillType(groupShapeProps as Record<string, unknown>) : "";
    }
    // if (clrFillType == "") {
    //     var clrFillType = getFillType(getTextByPathList(node, ["p:style","a:fillRef"]));
    // }
    //console.log("genShape: fillColor: ", fillColor, ", clrFillType: ", clrFillType, ", node: ", node)
    /////////////////////////////////////////
    if (clrFillType === "GRADIENT_FILL") {
      grndFillFlg = true;
      if (fillColor && typeof fillColor === "object") {
        const gradientFill = fillColor as { color: string[]; rot: number };
        const colorArray = gradientFill.color;
        const angle = gradientFill.rot + 90;
        const svgGrdnt = getSvgGradient(w, h, angle, colorArray, String(shpId));
        //fill="url(#linGrd)"
        //console.log("genShape: svgGrdnt: ", svgGrdnt)
        defsContent += svgGrdnt;
      }
    } else if (clrFillType === "PIC_FILL") {
      imgFillFlg = true;
      if (typeof fillColor === "string") {
        const svgBgImg = getSvgImagePattern(node, fillColor, String(shpId), warpContext);
        //fill="url(#imgPtrn)"
        //console.log(svgBgImg)
        defsContent += svgBgImg;
      }
    } else if (clrFillType === "PATTERN_FILL") {
      let styleText = typeof fillColor === "string" ? fillColor : String(fillColor ?? "");
      if (styleText in styleTable) {
        styleText += "do-nothing: " + svgCssName + ";";
      }
      styleTable[styleText] = {
        name: svgCssName,
        text: styleText,
      };
      //}
      fillColor = "none";
    } else {
      if (
        clrFillType !== "SOLID_FILL" &&
        clrFillType !== "PATTERN_FILL" &&
        (shapType === "arc" ||
          shapType === "bracketPair" ||
          shapType === "bracePair" ||
          shapType === "leftBracket" ||
          shapType === "leftBrace" ||
          shapType === "rightBrace" ||
          shapType === "rightBracket")
      ) {
        //Temp. solution  - TODO
        fillColor = "none";
      }
    }
    // Border Color
    const borderValue = getBorder(node, pNode, true, "shape", warpContext);
    const border =
      typeof borderValue === "string"
        ? { color: "none", width: "0", strokeDasharray: "0" }
        : {
            color: borderValue.color,
            width: String(borderValue.width ?? "0"),
            strokeDasharray: borderValue.strokeDasharray ?? "0",
          };

    const normalizedFillColor = typeof fillColor === "string" ? fillColor : "none";

    return {
      slideXfrmNode,
      slideLayoutXfrmNode,
      slideMasterXfrmNode,
      shpId,
      shapType,
      custShapType,
      rotate,
      txtRotate,
      flip,
      x,
      y,
      w,
      h,
      svgCssName,
      effectsClassName,
      fillColor: normalizedFillColor,
      grndFillFlg,
      imgFillFlg,
      clrFillType,
      border,
      svgHeader,
      defsContent,
    };
  }

  return null;
}
