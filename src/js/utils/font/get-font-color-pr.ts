/**
 * Get font color and text effects properties
 *
 * @param node - The text run node
 * @param pNode - Parent paragraph node
 * @param lstStyle - List style node
 * @param pFontStyle - Paragraph font style
 * @param lvl - List level
 * @param idx - Index
 * @param type - Element type
 * @param warpObj - The warp object containing theme and other resources
 * @param slideFactor - Conversion factor from EMU to pixels
 * @returns Array [color, text effects, color type, highlight color]
 */
import type { PptxNode, WarpObject, SlideFactor } from "../../types";
import { getTextByPathList } from "../object";
import { getFillType } from "../fill/get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getPatternFill } from "../fill/get-pattern-fill";
import { getBgPicFill } from "../fill/get-bg-pic-fill";
import { getGradientFill } from "../fill/get-gradient-fill";
import { getLayoutAndMasterNode } from "../layout/get-layout-and-master-node";
import { getBorder } from "../border/get-border";

export function getFontColorPr(
  node: PptxNode,
  pNode: PptxNode,
  lstStyle: any,
  pFontStyle: any,
  lvl: any,
  idx: any,
  type: any,
  warpObj: WarpObject,
  slideFactor: SlideFactor
): [any, any, string, string] {
  const rPrNode = getTextByPathList(node, ["a:rPr"]);
  let filTyp,
    color,
    textBordr,
    colorType = "",
    highlightColor = "";

  if (rPrNode !== undefined) {
    filTyp = getFillType(rPrNode);
    if (filTyp === "SOLID_FILL") {
      const solidFillNode = rPrNode["a:solidFill"];
      color = getSolidFill(solidFillNode, undefined, undefined, warpObj);
      const highlightNode = rPrNode["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
      }
      colorType = "solid";
    } else if (filTyp === "PATTERN_FILL") {
      const pattFill = rPrNode["a:pattFill"];
      color = getPatternFill(pattFill, warpObj);
      colorType = "pattern";
    } else if (filTyp === "PIC_FILL") {
      color = getBgPicFill(rPrNode, "slideBg", warpObj, undefined, undefined);
      colorType = "pic";
    } else if (filTyp === "GRADIENT_FILL") {
      const shpFill = rPrNode["a:gradFill"];
      color = getGradientFill(shpFill, warpObj);
      colorType = "gradient";
    }
  }

  if (
    color === undefined &&
    getTextByPathList(lstStyle, ["a:lvl" + lvl + "pPr", "a:defRPr"]) !== undefined
  ) {
    // lstStyle
    const lstStyledefRPr = getTextByPathList(lstStyle, ["a:lvl" + lvl + "pPr", "a:defRPr"]);
    filTyp = getFillType(lstStyledefRPr);
    if (filTyp === "SOLID_FILL") {
      const solidFillNode = lstStyledefRPr["a:solidFill"];
      color = getSolidFill(solidFillNode, undefined, undefined, warpObj);
      const highlightNode = lstStyledefRPr["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
      }
      colorType = "solid";
    } else if (filTyp === "PATTERN_FILL") {
      const pattFill = lstStyledefRPr["a:pattFill"];
      color = getPatternFill(pattFill, warpObj);
      colorType = "pattern";
    } else if (filTyp === "PIC_FILL") {
      color = getBgPicFill(lstStyledefRPr, "slideBg", warpObj, undefined, undefined);
      colorType = "pic";
    } else if (filTyp === "GRADIENT_FILL") {
      const shpFill = lstStyledefRPr["a:gradFill"];
      color = getGradientFill(shpFill, warpObj);
      colorType = "gradient";
    }
  }

  if (color === undefined) {
    const sPstyle = getTextByPathList(pNode, ["p:style", "a:fontRef"]);
    if (sPstyle !== undefined) {
      color = getSolidFill(sPstyle, undefined, undefined, warpObj);
      if (color !== undefined) {
        colorType = "solid";
      }
      const highlightNode = sPstyle["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
      }
    }
    if (color === undefined) {
      if (pFontStyle !== undefined) {
        color = getSolidFill(pFontStyle, undefined, undefined, warpObj);
        if (color !== undefined) {
          colorType = "solid";
        }
      }
    }
  }

  if (color === undefined) {
    const layoutMasterNode = getLayoutAndMasterNode(pNode, idx, type, warpObj);
    const pPrNodeLaout = layoutMasterNode.nodeLaout;
    const pPrNodeMaster = layoutMasterNode.nodeMaster;

    if (pPrNodeLaout !== undefined) {
      const defRpRLaout = getTextByPathList(pPrNodeLaout, ["a:defRPr", "a:solidFill"]);
      if (defRpRLaout !== undefined) {
        color = getSolidFill(defRpRLaout, undefined, undefined, warpObj);
        const highlightNode = getTextByPathList(pPrNodeLaout, ["a:defRPr", "a:highlight"]);
        if (highlightNode !== undefined) {
          highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
        }
        colorType = "solid";
      }
    }
    if (color === undefined) {
      if (pPrNodeMaster !== undefined) {
        const defRprMaster = getTextByPathList(pPrNodeMaster, ["a:defRPr", "a:solidFill"]);
        if (defRprMaster !== undefined) {
          color = getSolidFill(defRprMaster, undefined, undefined, warpObj);
          const highlightNode = getTextByPathList(pPrNodeMaster, ["a:defRPr", "a:highlight"]);
          if (highlightNode !== undefined) {
            highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
          }
          colorType = "solid";
        }
      }
    }
  }

  const txtEffects: string[] = [];
  const txtEffObj: any = {};

  // textBordr
  const txtBrdrNode = getTextByPathList(node, ["a:rPr", "a:ln"]);
  textBordr = "";
  if (txtBrdrNode !== undefined && txtBrdrNode["a:noFill"] === undefined) {
    const txBrd = getBorder(node, pNode, false, "text", warpObj);
    if (typeof txBrd === "string") {
      const txBrdAry = txBrd.split(" ");
      const brdSize = parseInt(txBrdAry[0].substring(0, txBrdAry[0].indexOf("px"))) + "px";
      const brdClr = txBrdAry[2];
      if (colorType === "solid") {
        textBordr =
          "-" +
          brdSize +
          " 0 " +
          brdClr +
          ", 0 " +
          brdSize +
          " " +
          brdClr +
          ", " +
          brdSize +
          " 0 " +
          brdClr +
          ", 0 -" +
          brdSize +
          " " +
          brdClr;
        txtEffects.push(textBordr);
      } else {
        txtEffObj.border = brdSize + " " + brdClr;
      }
    }
  }

  // glow
  const txtGlowNode = getTextByPathList(node, ["a:rPr", "a:effectLst", "a:glow"]);
  let oGlowStr = "";
  if (txtGlowNode !== undefined) {
    const glowClr = getSolidFill(txtGlowNode, undefined, undefined, warpObj);
    const rad = txtGlowNode["attrs"]["rad"] ? txtGlowNode["attrs"]["rad"] * slideFactor : 0;
    oGlowStr =
      "0 0 " +
      rad +
      "px #" +
      glowClr +
      ", 0 0 " +
      rad +
      "px #" +
      glowClr +
      ", 0 0 " +
      rad +
      "px #" +
      glowClr +
      ", 0 0 " +
      rad +
      "px #" +
      glowClr +
      ", 0 0 " +
      rad +
      "px #" +
      glowClr +
      ", 0 0 " +
      rad +
      "px #" +
      glowClr +
      ", 0 0 " +
      rad +
      "px #" +
      glowClr;
    if (colorType === "solid") {
      txtEffects.push(oGlowStr);
    } else {
      txtEffects.push(
        "drop-shadow(0 0 " +
          rad / 3 +
          "px #" +
          glowClr +
          ") " +
          "drop-shadow(0 0 " +
          (rad * 2) / 3 +
          "px #" +
          glowClr +
          ") " +
          "drop-shadow(0 0 " +
          rad +
          "px #" +
          glowClr +
          ")"
      );
    }
  }

  // shadow
  const txtShadow = getTextByPathList(node, ["a:rPr", "a:effectLst", "a:outerShdw"]);
  let oShadowStr = "";
  if (txtShadow !== undefined) {
    const shadowClr = getSolidFill(txtShadow, undefined, undefined, warpObj);
    const outerShdwAttrs = txtShadow["attrs"];
    const _algn = outerShdwAttrs["algn"];
    const dir = outerShdwAttrs["dir"] ? parseInt(outerShdwAttrs["dir"]) / 60000 : 0;
    const dist = parseInt(outerShdwAttrs["dist"]) * slideFactor;
    const _rotWithShape = outerShdwAttrs["rotWithShape"];
    const blurRad = outerShdwAttrs["blurRad"]
      ? parseInt(outerShdwAttrs["blurRad"]) * slideFactor + "px"
      : "";
    const _sx = outerShdwAttrs["sx"] ? parseInt(outerShdwAttrs["sx"]) / 100000 : 1;
    const _sy = outerShdwAttrs["sy"] ? parseInt(outerShdwAttrs["sy"]) / 100000 : 1;
    const vx = dist * Math.sin((dir * Math.PI) / 180);
    const hx = dist * Math.cos((dir * Math.PI) / 180);

    if (!isNaN(vx) && !isNaN(hx)) {
      oShadowStr = hx + "px " + vx + "px " + blurRad + " #" + shadowClr;
      if (colorType === "solid") {
        txtEffects.push(oShadowStr);
      } else {
        txtEffects.push(
          "drop-shadow(" + hx + "px " + vx + "px " + blurRad + " #" + shadowClr + ")"
        );
      }
    }
  }

  let text_effcts = "",
    txt_effects: any;
  if (colorType === "solid") {
    if (txtEffects.length > 0) {
      text_effcts = txtEffects.join(",");
    }
    txt_effects = text_effcts + ";";
  } else {
    if (txtEffects.length > 0) {
      text_effcts = txtEffects.join(" ");
    }
    txtEffObj.effcts = text_effcts;
    txt_effects = txtEffObj;
  }

  return [color, txt_effects, colorType, highlightColor];
}
