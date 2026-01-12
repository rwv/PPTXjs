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
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type SolidFillOptions = Parameters<typeof getSolidFill>[0];
type SolidFillNode = SolidFillOptions["fillNode"];
type PatternFillOptions = Parameters<typeof getPatternFill>[0];
type PatternFillNode = PatternFillOptions["patternFillNode"];
type GradientFillOptions = Parameters<typeof getGradientFill>[0];
type GradientFillNode = GradientFillOptions["gradientFillNode"];
type BgPicFillOptions = Parameters<typeof getBgPicFill>[0];
type BgPicWarpObj = BgPicFillOptions["warpContext"];

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

type GetFontColorPrOptions = {
  textRunNode: XmlNode;
  paragraphNode: XmlNode;
  listStyleNode: XmlNode | undefined;
  paragraphFontStyle: XmlNode | undefined;
  listLevel: number | string;
  placeholderIndex: number | string | undefined;
  shapeType: string | undefined;
  warpContext: WarpContext;
  emuToPx: number;
};

export function getFontColorPr({
  textRunNode,
  paragraphNode,
  listStyleNode,
  paragraphFontStyle,
  listLevel,
  placeholderIndex,
  shapeType,
  warpContext,
  emuToPx,
}: GetFontColorPrOptions): [unknown, unknown, string, string] {
  const runPropsValue = getTextByPathList({ node: textRunNode, path: ["a:rPr"] });
  const runPropsNode = asXmlNode(runPropsValue);
  let fillType;
  let fontColor;
  let textBorderShadow;
  let fontColorType = "";
  let highlightColor = "";

  if (runPropsNode !== undefined) {
    fillType = getFillType({ shapePropsNode: runPropsNode });
    if (fillType === "SOLID_FILL") {
      const solidFillNode = asXmlNode(runPropsNode["a:solidFill"]);
      if (solidFillNode !== undefined) {
        fontColor = getSolidFill({
          fillNode: solidFillNode as SolidFillNode,
          colorMap: undefined,
          placeholderColor: undefined,
          warpContext,
        });
      }
      const highlightNode = asXmlNode(runPropsNode["a:highlight"]);
      if (highlightNode !== undefined) {
        highlightColor =
          getSolidFill({
            fillNode: highlightNode as SolidFillNode,
            colorMap: undefined,
            placeholderColor: undefined,
            warpContext,
          }) || "";
      }
      fontColorType = "solid";
    } else if (fillType === "PATTERN_FILL") {
      const patternFillNode = asXmlNode(runPropsNode["a:pattFill"]);
      if (patternFillNode !== undefined) {
        fontColor = getPatternFill({
          patternFillNode: patternFillNode as PatternFillNode,
          warpContext,
        });
      }
      fontColorType = "pattern";
    } else if (fillType === "PIC_FILL") {
      fontColor = getBgPicFill({
        backgroundProps: runPropsNode,
        sourceType: "slideBg",
        warpContext: warpContext as BgPicWarpObj,
        placeholderColor: undefined,
      });
      fontColorType = "pic";
    } else if (fillType === "GRADIENT_FILL") {
      const gradientFillNode = asXmlNode(runPropsNode["a:gradFill"]);
      if (gradientFillNode !== undefined) {
        fontColor = getGradientFill({
          gradientFillNode: gradientFillNode as GradientFillNode,
          warpContext,
        });
      }
      fontColorType = "gradient";
    }
  }

  const listStyleDefaultRunPropsValue = listStyleNode
    ? getTextByPathList({
        node: listStyleNode,
        path: ["a:lvl" + listLevel + "pPr", "a:defRPr"],
      })
    : undefined;
  const listStyleDefaultRunPropsNode = asXmlNode(listStyleDefaultRunPropsValue);
  if (fontColor === undefined && listStyleDefaultRunPropsNode !== undefined) {
    // listStyleNode
    fillType = getFillType({ shapePropsNode: listStyleDefaultRunPropsNode });
    if (fillType === "SOLID_FILL") {
      const solidFillNode = asXmlNode(listStyleDefaultRunPropsNode["a:solidFill"]);
      if (solidFillNode !== undefined) {
        fontColor = getSolidFill({
          fillNode: solidFillNode as SolidFillNode,
          colorMap: undefined,
          placeholderColor: undefined,
          warpContext,
        });
      }
      const highlightNode = asXmlNode(listStyleDefaultRunPropsNode["a:highlight"]);
      if (highlightNode !== undefined) {
        highlightColor =
          getSolidFill({
            fillNode: highlightNode as SolidFillNode,
            colorMap: undefined,
            placeholderColor: undefined,
            warpContext,
          }) || "";
      }
      fontColorType = "solid";
    } else if (fillType === "PATTERN_FILL") {
      const patternFillNode = asXmlNode(listStyleDefaultRunPropsNode["a:pattFill"]);
      if (patternFillNode !== undefined) {
        fontColor = getPatternFill({
          patternFillNode: patternFillNode as PatternFillNode,
          warpContext,
        });
      }
      fontColorType = "pattern";
    } else if (fillType === "PIC_FILL") {
      fontColor = getBgPicFill({
        backgroundProps: listStyleDefaultRunPropsNode,
        sourceType: "slideBg",
        warpContext: warpContext as BgPicWarpObj,
        placeholderColor: undefined,
      });
      fontColorType = "pic";
    } else if (fillType === "GRADIENT_FILL") {
      const gradientFillNode = asXmlNode(listStyleDefaultRunPropsNode["a:gradFill"]);
      if (gradientFillNode !== undefined) {
        fontColor = getGradientFill({
          gradientFillNode: gradientFillNode as GradientFillNode,
          warpContext,
        });
      }
      fontColorType = "gradient";
    }
  }

  if (fontColor === undefined) {
    const shapeStyleNodeValue = getTextByPathList({
      node: paragraphNode,
      path: ["p:style", "a:fontRef"],
    });
    const shapeStyleNode = asXmlNode(shapeStyleNodeValue);
    if (shapeStyleNode !== undefined) {
      fontColor = getSolidFill({
        fillNode: shapeStyleNode as SolidFillNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      });
      if (fontColor !== undefined) {
        fontColorType = "solid";
      }
      const highlightNode = asXmlNode(shapeStyleNode["a:highlight"]);
      if (highlightNode !== undefined) {
        highlightColor =
          getSolidFill({
            fillNode: highlightNode as SolidFillNode,
            colorMap: undefined,
            placeholderColor: undefined,
            warpContext,
          }) || "";
      }
    }
    if (fontColor === undefined) {
      if (paragraphFontStyle !== undefined) {
        fontColor = getSolidFill({
          fillNode: paragraphFontStyle as SolidFillNode,
          colorMap: undefined,
          placeholderColor: undefined,
          warpContext,
        });
        if (fontColor !== undefined) {
          fontColorType = "solid";
        }
      }
    }
  }

  if (fontColor === undefined) {
    const layoutMasterNodes = getLayoutAndMasterNode({
      paragraphNode,
      layoutIndex: placeholderIndex,
      shapeType,
      warpContext,
    });
    const layoutParagraphPropsNode = layoutMasterNodes.nodeLayout;
    const masterParagraphPropsNode = layoutMasterNodes.nodeMaster;

    if (layoutParagraphPropsNode !== undefined) {
      const layoutDefaultRunPropsValue = getTextByPathList({
        node: layoutParagraphPropsNode,
        path: ["a:defRPr", "a:solidFill"],
      });
      const layoutDefaultRunProps = asXmlNode(layoutDefaultRunPropsValue);
      if (layoutDefaultRunProps !== undefined) {
        fontColor = getSolidFill({
          fillNode: layoutDefaultRunProps as SolidFillNode,
          colorMap: undefined,
          placeholderColor: undefined,
          warpContext,
        });
        const highlightNode = getTextByPathList({
          node: layoutParagraphPropsNode,
          path: ["a:defRPr", "a:highlight"],
        });
        const highlightRunProps = asXmlNode(highlightNode);
        if (highlightRunProps !== undefined) {
          highlightColor =
            getSolidFill({
              fillNode: highlightRunProps as SolidFillNode,
              colorMap: undefined,
              placeholderColor: undefined,
              warpContext,
            }) || "";
        }
        fontColorType = "solid";
      }
    }
    if (fontColor === undefined) {
      if (masterParagraphPropsNode !== undefined) {
        const masterDefaultRunPropsValue = getTextByPathList({
          node: masterParagraphPropsNode,
          path: ["a:defRPr", "a:solidFill"],
        });
        const masterDefaultRunProps = asXmlNode(masterDefaultRunPropsValue);
        if (masterDefaultRunProps !== undefined) {
          fontColor = getSolidFill({
            fillNode: masterDefaultRunProps as SolidFillNode,
            colorMap: undefined,
            placeholderColor: undefined,
            warpContext,
          });
          const highlightNode = getTextByPathList({
            node: masterParagraphPropsNode,
            path: ["a:defRPr", "a:highlight"],
          });
          const highlightRunProps = asXmlNode(highlightNode);
          if (highlightRunProps !== undefined) {
            highlightColor =
              getSolidFill({
                fillNode: highlightRunProps as SolidFillNode,
                colorMap: undefined,
                placeholderColor: undefined,
                warpContext,
              }) || "";
          }
          fontColorType = "solid";
        }
      }
    }
  }

  const textEffects: string[] = [];
  const textEffectsConfig: Record<string, string> = {};

  // textBorder
  const textBorderNodeValue = getTextByPathList({ node: textRunNode, path: ["a:rPr", "a:ln"] });
  const textBorderNode = asXmlNode(textBorderNodeValue);
  textBorderShadow = "";
  if (textBorderNode !== undefined && textBorderNode["a:noFill"] === undefined) {
    const textBorderStyle = getBorder({
      shapeNode: textRunNode,
      isSvgMode: false,
      borderType: "text",
      warpContext,
    });
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
  const glowNodeValue = getTextByPathList({
    node: textRunNode,
    path: ["a:rPr", "a:effectLst", "a:glow"],
  });
  const glowNode = asXmlNode(glowNodeValue);
  let glowEffect = "";
  if (glowNode !== undefined) {
    const glowColor = getSolidFill({
      fillNode: glowNode as SolidFillNode,
      colorMap: undefined,
      placeholderColor: undefined,
      warpContext,
    });
    const glowRadiusValue = glowNode.attrs?.rad;
    const glowRadiusPx = glowRadiusValue ? Number(glowRadiusValue) * emuToPx : 0;
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
  const shadowNodeValue = getTextByPathList({
    node: textRunNode,
    path: ["a:rPr", "a:effectLst", "a:outerShdw"],
  });
  const shadowNode = asXmlNode(shadowNodeValue);
  let shadowStyle = "";
  if (shadowNode !== undefined) {
    const shadowColor = getSolidFill({
      fillNode: shadowNode as SolidFillNode,
      colorMap: undefined,
      placeholderColor: undefined,
      warpContext,
    });
    const shadowAttributes = shadowNode.attrs ?? {};
    const directionDegrees = shadowAttributes["dir"]
      ? parseInt(String(shadowAttributes["dir"]), 10) / 60000
      : 0;
    const shadowDistancePx = parseInt(String(shadowAttributes["dist"]), 10) * emuToPx;
    const blurRadiusPx = shadowAttributes["blurRad"]
      ? parseInt(String(shadowAttributes["blurRad"]), 10) * emuToPx + "px"
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
