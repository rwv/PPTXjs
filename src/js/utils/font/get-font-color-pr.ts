/**
 * Get font color and text effects properties
 *
 * @param textRunNode - The text run node
 * @param paragraphNode - Parent paragraph node
 * @param listStyleNode - List style node
 * @param paragraphFontStyle - Paragraph font style
 * @param listLevel - List level
 * @param placeholderIndex - Placeholder index
 * @param shapeType - Element type
 * @param warpContext - The warp object containing theme and other resources
 * @param emuToPx - Conversion factor from EMU to pixels
 * @returns Array [font color, text effects, color type, highlight color]
 */
import { getTextByPathList } from "../object";
import { getFillType } from "../fill/get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getPatternFill } from "../fill/get-pattern-fill";
import { getBgPicFill } from "../fill/get-bg-pic-fill";
import { getGradientFill } from "../fill/get-gradient-fill";
import { getLayoutAndMasterNode } from "../layout/get-layout-and-master-node";
import { getBorder } from "../border/get-border";

export function getFontColorPr(
  textRunNode: Record<string, unknown>,
  paragraphNode: Record<string, unknown>,
  listStyleNode: Record<string, unknown> | undefined,
  paragraphFontStyle: Record<string, unknown> | undefined,
  listLevel: number | string,
  placeholderIndex: number | string | undefined,
  shapeType: string | undefined,
  warpContext: Record<string, unknown>,
  emuToPx: number
): [any, any, string, string] {
  const runPropsNode = getTextByPathList(textRunNode, ["a:rPr"]);
  let fillType;
  let fontColor;
  let textBorderShadow;
  let fontColorType = "";
  let highlightColor = "";

  if (runPropsNode !== undefined) {
    fillType = getFillType(runPropsNode);
    if (fillType === "SOLID_FILL") {
      const solidFillNode = runPropsNode["a:solidFill"];
      fontColor = getSolidFill(solidFillNode, undefined, undefined, warpContext);
      const highlightNode = runPropsNode["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpContext) || "";
      }
      fontColorType = "solid";
    } else if (fillType === "PATTERN_FILL") {
      const patternFillNode = runPropsNode["a:pattFill"];
      fontColor = getPatternFill(patternFillNode, warpContext);
      fontColorType = "pattern";
    } else if (fillType === "PIC_FILL") {
      fontColor = getBgPicFill(runPropsNode, "slideBg", warpContext, undefined);
      fontColorType = "pic";
    } else if (fillType === "GRADIENT_FILL") {
      const gradientFillNode = runPropsNode["a:gradFill"];
      fontColor = getGradientFill(gradientFillNode, warpContext);
      fontColorType = "gradient";
    }
  }

  if (
    fontColor === undefined &&
    getTextByPathList(listStyleNode, ["a:lvl" + listLevel + "pPr", "a:defRPr"]) !== undefined
  ) {
    // listStyleNode
    const listStyleDefaultRunPropsNode = getTextByPathList(listStyleNode, [
      "a:lvl" + listLevel + "pPr",
      "a:defRPr",
    ]);
    fillType = getFillType(listStyleDefaultRunPropsNode);
    if (fillType === "SOLID_FILL") {
      const solidFillNode = listStyleDefaultRunPropsNode["a:solidFill"];
      fontColor = getSolidFill(solidFillNode, undefined, undefined, warpContext);
      const highlightNode = listStyleDefaultRunPropsNode["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpContext) || "";
      }
      fontColorType = "solid";
    } else if (fillType === "PATTERN_FILL") {
      const patternFillNode = listStyleDefaultRunPropsNode["a:pattFill"];
      fontColor = getPatternFill(patternFillNode, warpContext);
      fontColorType = "pattern";
    } else if (fillType === "PIC_FILL") {
      fontColor = getBgPicFill(listStyleDefaultRunPropsNode, "slideBg", warpContext, undefined);
      fontColorType = "pic";
    } else if (fillType === "GRADIENT_FILL") {
      const gradientFillNode = listStyleDefaultRunPropsNode["a:gradFill"];
      fontColor = getGradientFill(gradientFillNode, warpContext);
      fontColorType = "gradient";
    }
  }

  if (fontColor === undefined) {
    const shapeStyleNode = getTextByPathList(paragraphNode, ["p:style", "a:fontRef"]);
    if (shapeStyleNode !== undefined) {
      fontColor = getSolidFill(shapeStyleNode, undefined, undefined, warpContext);
      if (fontColor !== undefined) {
        fontColorType = "solid";
      }
      const highlightNode = shapeStyleNode["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpContext) || "";
      }
    }
    if (fontColor === undefined) {
      if (paragraphFontStyle !== undefined) {
        fontColor = getSolidFill(paragraphFontStyle, undefined, undefined, warpContext);
        if (fontColor !== undefined) {
          fontColorType = "solid";
        }
      }
    }
  }

  if (fontColor === undefined) {
    const layoutMasterNodes = getLayoutAndMasterNode(
      paragraphNode,
      placeholderIndex,
      shapeType,
      warpContext
    );
    const layoutParagraphPropsNode = layoutMasterNodes.nodeLaout;
    const masterParagraphPropsNode = layoutMasterNodes.nodeMaster;

    if (layoutParagraphPropsNode !== undefined) {
      const layoutDefaultRunProps = getTextByPathList(layoutParagraphPropsNode, [
        "a:defRPr",
        "a:solidFill",
      ]);
      if (layoutDefaultRunProps !== undefined) {
        fontColor = getSolidFill(layoutDefaultRunProps, undefined, undefined, warpContext);
        const highlightNode = getTextByPathList(layoutParagraphPropsNode, [
          "a:defRPr",
          "a:highlight",
        ]);
        if (highlightNode !== undefined) {
          highlightColor = getSolidFill(highlightNode, undefined, undefined, warpContext) || "";
        }
        fontColorType = "solid";
      }
    }
    if (fontColor === undefined) {
      if (masterParagraphPropsNode !== undefined) {
        const masterDefaultRunProps = getTextByPathList(masterParagraphPropsNode, [
          "a:defRPr",
          "a:solidFill",
        ]);
        if (masterDefaultRunProps !== undefined) {
          fontColor = getSolidFill(masterDefaultRunProps, undefined, undefined, warpContext);
          const highlightNode = getTextByPathList(masterParagraphPropsNode, [
            "a:defRPr",
            "a:highlight",
          ]);
          if (highlightNode !== undefined) {
            highlightColor = getSolidFill(highlightNode, undefined, undefined, warpContext) || "";
          }
          fontColorType = "solid";
        }
      }
    }
  }

  const textEffects: string[] = [];
  const textEffectsConfig: Record<string, string> = {};

  // textBorder
  const textBorderNode = getTextByPathList(textRunNode, ["a:rPr", "a:ln"]);
  textBorderShadow = "";
  if (textBorderNode !== undefined && textBorderNode["a:noFill"] === undefined) {
    const textBorderStyle = getBorder(textRunNode, paragraphNode, false, "text", warpContext);
    if (typeof textBorderStyle === "string") {
      const textBorderParts = textBorderStyle.split(" ");
      const borderSizePx =
        parseInt(textBorderParts[0].substring(0, textBorderParts[0].indexOf("px"))) + "px";
      const borderColorValue = textBorderParts[2];
      if (fontColorType === "solid") {
        textBorderShadow =
          "-" +
          borderSizePx +
          " 0 " +
          borderColorValue +
          ", 0 " +
          borderSizePx +
          " " +
          borderColorValue +
          ", " +
          borderSizePx +
          " 0 " +
          borderColorValue +
          ", 0 -" +
          borderSizePx +
          " " +
          borderColorValue;
        textEffects.push(textBorderShadow);
      } else {
        textEffectsConfig.border = borderSizePx + " " + borderColorValue;
      }
    }
  }

  // glow
  const glowNode = getTextByPathList(textRunNode, ["a:rPr", "a:effectLst", "a:glow"]);
  let glowEffect = "";
  if (glowNode !== undefined) {
    const glowColor = getSolidFill(glowNode, undefined, undefined, warpContext);
    const glowRadiusPx = glowNode["attrs"]["rad"] ? glowNode["attrs"]["rad"] * emuToPx : 0;
    glowEffect =
      "0 0 " +
      glowRadiusPx +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadiusPx +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadiusPx +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadiusPx +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadiusPx +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadiusPx +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadiusPx +
      "px #" +
      glowColor;
    if (fontColorType === "solid") {
      textEffects.push(glowEffect);
    } else {
      textEffects.push(
        "drop-shadow(0 0 " +
          glowRadiusPx / 3 +
          "px #" +
          glowColor +
          ") " +
          "drop-shadow(0 0 " +
          (glowRadiusPx * 2) / 3 +
          "px #" +
          glowColor +
          ") " +
          "drop-shadow(0 0 " +
          glowRadiusPx +
          "px #" +
          glowColor +
          ")"
      );
    }
  }

  // shadow
  const shadowNode = getTextByPathList(textRunNode, ["a:rPr", "a:effectLst", "a:outerShdw"]);
  let shadowStyle = "";
  if (shadowNode !== undefined) {
    const shadowColor = getSolidFill(shadowNode, undefined, undefined, warpContext);
    const shadowAttributes = shadowNode["attrs"];
    const directionDegrees = shadowAttributes["dir"]
      ? parseInt(shadowAttributes["dir"]) / 60000
      : 0;
    const shadowDistancePx = parseInt(shadowAttributes["dist"]) * emuToPx;
    const blurRadiusPx = shadowAttributes["blurRad"]
      ? parseInt(shadowAttributes["blurRad"]) * emuToPx + "px"
      : "";
    const offsetY = shadowDistancePx * Math.sin((directionDegrees * Math.PI) / 180);
    const offsetX = shadowDistancePx * Math.cos((directionDegrees * Math.PI) / 180);

    if (!isNaN(offsetY) && !isNaN(offsetX)) {
      shadowStyle = offsetX + "px " + offsetY + "px " + blurRadiusPx + " #" + shadowColor;
      if (fontColorType === "solid") {
        textEffects.push(shadowStyle);
      } else {
        textEffects.push(
          "drop-shadow(" +
            offsetX +
            "px " +
            offsetY +
            "px " +
            blurRadiusPx +
            " #" +
            shadowColor +
            ")"
        );
      }
    }
  }

  let effectsValue = "";
  let effectsOutput: string | Record<string, string>;
  if (fontColorType === "solid") {
    if (textEffects.length > 0) {
      effectsValue = textEffects.join(",");
    }
    effectsOutput = effectsValue + ";";
  } else {
    if (textEffects.length > 0) {
      effectsValue = textEffects.join(" ");
    }
    textEffectsConfig.effcts = effectsValue;
    effectsOutput = textEffectsConfig;
  }

  return [fontColor, effectsOutput, fontColorType, highlightColor];
}
