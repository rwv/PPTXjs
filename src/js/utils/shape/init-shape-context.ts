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

export interface ShapeContext {
  /** Shape transform nodes */
  slideXfrmNode: any;
  slideLayoutXfrmNode: any;
  slideMasterXfrmNode: any;

  /** Shape IDs and types */
  shpId: number | string;
  shapType: any;
  custShapType: any;

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
  fillColor: any;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  clrFillType: string;

  /** Border properties */
  border: any;

  /** Initial SVG markup with defs */
  svgHeader: string;
  defsContent: string;
}

/**
 * Initialize shape rendering context
 */
export function initShapeContext(
  node: any,
  pNode: any,
  slideLayoutSpNode: any,
  slideMasterSpNode: any,
  id: number | string | undefined,
  idx: number | string | undefined,
  type: string | undefined,
  name: string | undefined,
  order: number | string | undefined,
  sType: string | undefined,
  source: string,
  warpObj: any,
  slideFactor: number,
  styleTable: any
): ShapeContext | null {
  //var dltX = 0;
  //var dltY = 0;
  const xfrmList = ["p:spPr", "a:xfrm"];
  const slideXfrmNode = getTextByPathList(node, xfrmList);
  const slideLayoutXfrmNode = getTextByPathList(slideLayoutSpNode, xfrmList);
  const slideMasterXfrmNode = getTextByPathList(slideMasterSpNode, xfrmList);

  const shpId = getTextByPathList(node, ["attrs", "order"]);
  //console.log("shpId: ",shpId)
  const shapType = getTextByPathList(node, ["p:spPr", "a:prstGeom", "attrs", "prst"]);

  //custGeom - Amir
  const custShapType = getTextByPathList(node, ["p:spPr", "a:custGeom"]);

  let isFlipV = false;
  let isFlipH = false;
  let flip = "";
  if (getTextByPathList(slideXfrmNode, ["attrs", "flipV"]) === "1") {
    isFlipV = true;
  }
  if (getTextByPathList(slideXfrmNode, ["attrs", "flipH"]) === "1") {
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
  const rotate = angleToDegrees(getTextByPathList(slideXfrmNode, ["attrs", "rot"]));

  //console.log("genShape rotate: " + rotate);
  let txtRotate;
  const txtXframeNode = getTextByPathList(node, ["p:txXfrm"]);
  if (txtXframeNode !== undefined) {
    const txtXframeRot = getTextByPathList(txtXframeNode, ["attrs", "rot"]);
    if (txtXframeRot !== undefined) {
      txtRotate = angleToDegrees(txtXframeRot) + 90;
    }
  } else {
    txtRotate = rotate;
  }
  //////////////////////////////////////////////////
  if (shapType !== undefined || custShapType !== undefined /*&& slideXfrmNode !== undefined*/) {
    const off = getTextByPathList(slideXfrmNode, ["a:off", "attrs"]);
    const x = parseInt(off["x"]) * slideFactor;
    const y = parseInt(off["y"]) * slideFactor;

    const ext = getTextByPathList(slideXfrmNode, ["a:ext", "attrs"]);
    const w = parseInt(ext["cx"]) * slideFactor;
    const h = parseInt(ext["cy"]) * slideFactor;

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
      getPosition(slideXfrmNode, pNode, undefined, undefined, sType, slideFactor) +
      getSize(slideXfrmNode, undefined, undefined, slideFactor) +
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
    let fillColor = getShapeFill(node, pNode, true, warpObj, source);
    //console.log("genShape: fillColor: ", fillColor)
    let grndFillFlg = false;
    let imgFillFlg = false;
    let clrFillType = getFillType(getTextByPathList(node, ["p:spPr"]));
    if (clrFillType === "GROUP_FILL") {
      clrFillType = getFillType(getTextByPathList(pNode, ["p:grpSpPr"]));
    }
    // if (clrFillType == "") {
    //     var clrFillType = getFillType(getTextByPathList(node, ["p:style","a:fillRef"]));
    // }
    //console.log("genShape: fillColor: ", fillColor, ", clrFillType: ", clrFillType, ", node: ", node)
    /////////////////////////////////////////
    if (clrFillType === "GRADIENT_FILL") {
      grndFillFlg = true;
      const color_arry = fillColor.color;
      const angl = fillColor.rot + 90;
      const svgGrdnt = getSvgGradient(w, h, angl, color_arry, shpId);
      //fill="url(#linGrd)"
      //console.log("genShape: svgGrdnt: ", svgGrdnt)
      defsContent += svgGrdnt;
    } else if (clrFillType === "PIC_FILL") {
      imgFillFlg = true;
      const svgBgImg = getSvgImagePattern(node, fillColor, shpId, warpObj);
      //fill="url(#imgPtrn)"
      //console.log(svgBgImg)
      defsContent += svgBgImg;
    } else if (clrFillType === "PATTERN_FILL") {
      let styleText = fillColor;
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
    const border = getBorder(node, pNode, true, "shape", warpObj);

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
      fillColor,
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
