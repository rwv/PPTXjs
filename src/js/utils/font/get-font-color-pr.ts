/**
 * Get font color and text effects properties
 *
 * @param textRunNode - The text run node
 * @param paragraphNode - Parent paragraph node
 * @param listStyleNode - List style node
 * @param paragraphFontStyle - Paragraph font style
 * @param level - List level
 * @param layoutIndex - Index
 * @param shapeType - Element type
 * @param warpObj - The warp object containing theme and other resources
 * @param slideFactor - Conversion factor from EMU to pixels
 * @returns Array [color, text effects, color type, highlight color]
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
  level: number | string,
  layoutIndex: number | string | undefined,
  shapeType: string | undefined,
  warpObj: Record<string, unknown>,
  slideFactor: number
): [any, any, string, string] {
  const runPropsNode = getTextByPathList(textRunNode, ["a:rPr"]);
  let fillType,
    color,
    textBorder,
    colorType = "",
    highlightColor = "";

  if (runPropsNode !== undefined) {
    fillType = getFillType(runPropsNode);
    if (fillType === "SOLID_FILL") {
      const solidFillNode = runPropsNode["a:solidFill"];
      color = getSolidFill(solidFillNode, undefined, undefined, warpObj);
      const highlightNode = runPropsNode["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
      }
      colorType = "solid";
    } else if (fillType === "PATTERN_FILL") {
      const patternFillNode = runPropsNode["a:pattFill"];
      color = getPatternFill(patternFillNode, warpObj);
      colorType = "pattern";
    } else if (fillType === "PIC_FILL") {
      color = getBgPicFill(runPropsNode, "slideBg", warpObj, undefined);
      colorType = "pic";
    } else if (fillType === "GRADIENT_FILL") {
      const gradientFillNode = runPropsNode["a:gradFill"];
      color = getGradientFill(gradientFillNode, warpObj);
      colorType = "gradient";
    }
  }

  if (
    color === undefined &&
    getTextByPathList(listStyleNode, ["a:lvl" + level + "pPr", "a:defRPr"]) !== undefined
  ) {
    // listStyleNode
    const listStyleDefaultRunProps = getTextByPathList(listStyleNode, [
      "a:lvl" + level + "pPr",
      "a:defRPr",
    ]);
    fillType = getFillType(listStyleDefaultRunProps);
    if (fillType === "SOLID_FILL") {
      const solidFillNode = listStyleDefaultRunProps["a:solidFill"];
      color = getSolidFill(solidFillNode, undefined, undefined, warpObj);
      const highlightNode = listStyleDefaultRunProps["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
      }
      colorType = "solid";
    } else if (fillType === "PATTERN_FILL") {
      const patternFillNode = listStyleDefaultRunProps["a:pattFill"];
      color = getPatternFill(patternFillNode, warpObj);
      colorType = "pattern";
    } else if (fillType === "PIC_FILL") {
      color = getBgPicFill(listStyleDefaultRunProps, "slideBg", warpObj, undefined);
      colorType = "pic";
    } else if (fillType === "GRADIENT_FILL") {
      const gradientFillNode = listStyleDefaultRunProps["a:gradFill"];
      color = getGradientFill(gradientFillNode, warpObj);
      colorType = "gradient";
    }
  }

  if (color === undefined) {
    const shapeStyleNode = getTextByPathList(paragraphNode, ["p:style", "a:fontRef"]);
    if (shapeStyleNode !== undefined) {
      color = getSolidFill(shapeStyleNode, undefined, undefined, warpObj);
      if (color !== undefined) {
        colorType = "solid";
      }
      const highlightNode = shapeStyleNode["a:highlight"];
      if (highlightNode !== undefined) {
        highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
      }
    }
    if (color === undefined) {
      if (paragraphFontStyle !== undefined) {
        color = getSolidFill(paragraphFontStyle, undefined, undefined, warpObj);
        if (color !== undefined) {
          colorType = "solid";
        }
      }
    }
  }

  if (color === undefined) {
    const layoutMasterNodes = getLayoutAndMasterNode(
      paragraphNode,
      layoutIndex,
      shapeType,
      warpObj
    );
    const layoutParagraphPropsNode = layoutMasterNodes.nodeLaout;
    const masterParagraphPropsNode = layoutMasterNodes.nodeMaster;

    if (layoutParagraphPropsNode !== undefined) {
      const layoutDefaultRunProps = getTextByPathList(layoutParagraphPropsNode, [
        "a:defRPr",
        "a:solidFill",
      ]);
      if (layoutDefaultRunProps !== undefined) {
        color = getSolidFill(layoutDefaultRunProps, undefined, undefined, warpObj);
        const highlightNode = getTextByPathList(layoutParagraphPropsNode, [
          "a:defRPr",
          "a:highlight",
        ]);
        if (highlightNode !== undefined) {
          highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
        }
        colorType = "solid";
      }
    }
    if (color === undefined) {
      if (masterParagraphPropsNode !== undefined) {
        const masterDefaultRunProps = getTextByPathList(masterParagraphPropsNode, [
          "a:defRPr",
          "a:solidFill",
        ]);
        if (masterDefaultRunProps !== undefined) {
          color = getSolidFill(masterDefaultRunProps, undefined, undefined, warpObj);
          const highlightNode = getTextByPathList(masterParagraphPropsNode, [
            "a:defRPr",
            "a:highlight",
          ]);
          if (highlightNode !== undefined) {
            highlightColor = getSolidFill(highlightNode, undefined, undefined, warpObj) || "";
          }
          colorType = "solid";
        }
      }
    }
  }

  const textEffects: string[] = [];
  const textEffectsConfig: Record<string, string> = {};

  // textBorder
  const textBorderNode = getTextByPathList(textRunNode, ["a:rPr", "a:ln"]);
  textBorder = "";
  if (textBorderNode !== undefined && textBorderNode["a:noFill"] === undefined) {
    const textBorderStyle = getBorder(textRunNode, paragraphNode, false, "text", warpObj);
    if (typeof textBorderStyle === "string") {
      const textBorderParts = textBorderStyle.split(" ");
      const borderSize =
        parseInt(textBorderParts[0].substring(0, textBorderParts[0].indexOf("px"))) + "px";
      const borderColor = textBorderParts[2];
      if (colorType === "solid") {
        textBorder =
          "-" +
          borderSize +
          " 0 " +
          borderColor +
          ", 0 " +
          borderSize +
          " " +
          borderColor +
          ", " +
          borderSize +
          " 0 " +
          borderColor +
          ", 0 -" +
          borderSize +
          " " +
          borderColor;
        textEffects.push(textBorder);
      } else {
        textEffectsConfig.border = borderSize + " " + borderColor;
      }
    }
  }

  // glow
  const textGlowNode = getTextByPathList(textRunNode, ["a:rPr", "a:effectLst", "a:glow"]);
  let glowShadow = "";
  if (textGlowNode !== undefined) {
    const glowColor = getSolidFill(textGlowNode, undefined, undefined, warpObj);
    const glowRadius = textGlowNode["attrs"]["rad"]
      ? textGlowNode["attrs"]["rad"] * slideFactor
      : 0;
    glowShadow =
      "0 0 " +
      glowRadius +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadius +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadius +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadius +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadius +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadius +
      "px #" +
      glowColor +
      ", 0 0 " +
      glowRadius +
      "px #" +
      glowColor;
    if (colorType === "solid") {
      textEffects.push(glowShadow);
    } else {
      textEffects.push(
        "drop-shadow(0 0 " +
          glowRadius / 3 +
          "px #" +
          glowColor +
          ") " +
          "drop-shadow(0 0 " +
          (glowRadius * 2) / 3 +
          "px #" +
          glowColor +
          ") " +
          "drop-shadow(0 0 " +
          glowRadius +
          "px #" +
          glowColor +
          ")"
      );
    }
  }

  // shadow
  const textShadowNode = getTextByPathList(textRunNode, ["a:rPr", "a:effectLst", "a:outerShdw"]);
  let shadowStyle = "";
  if (textShadowNode !== undefined) {
    const shadowColor = getSolidFill(textShadowNode, undefined, undefined, warpObj);
    const outerShadowAttrs = textShadowNode["attrs"];
    const direction = outerShadowAttrs["dir"] ? parseInt(outerShadowAttrs["dir"]) / 60000 : 0;
    const distance = parseInt(outerShadowAttrs["dist"]) * slideFactor;
    const blurRadius = outerShadowAttrs["blurRad"]
      ? parseInt(outerShadowAttrs["blurRad"]) * slideFactor + "px"
      : "";
    const offsetY = distance * Math.sin((direction * Math.PI) / 180);
    const offsetX = distance * Math.cos((direction * Math.PI) / 180);

    if (!isNaN(offsetY) && !isNaN(offsetX)) {
      shadowStyle = offsetX + "px " + offsetY + "px " + blurRadius + " #" + shadowColor;
      if (colorType === "solid") {
        textEffects.push(shadowStyle);
      } else {
        textEffects.push(
          "drop-shadow(" + offsetX + "px " + offsetY + "px " + blurRadius + " #" + shadowColor + ")"
        );
      }
    }
  }

  let effectsValue = "";
  let effectsOutput: string | Record<string, string>;
  if (colorType === "solid") {
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

  return [color, effectsOutput, colorType, highlightColor];
}
