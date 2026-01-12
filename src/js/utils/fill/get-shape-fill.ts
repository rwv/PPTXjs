/**
 * Get shape fill style
 *
 * @param shapeNode - The XML node containing shape properties
 * @param parentNode - Parent node (for group fills)
 * @param isSvgMode - Whether to return SVG format or CSS format
 * @param warpContext - The warp object containing theme and other resources
 * @param sourceType - Source type for image lookup
 * @returns Fill color/style as CSS string or SVG-compatible format
 */
import { getTextByPathList } from "../object";
import { getFillType } from "./get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getGradientFill } from "./get-gradient-fill";
import { getPatternFill } from "./get-pattern-fill";
import { getPicFill } from "./get-pic-fill";
import tinycolor from "tinycolor2";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type GetShapeFillOptions = {
  shapeNode: XmlNode;
  parentNode: XmlNode | undefined;
  isSvgMode: boolean;
  warpContext: WarpContext;
  sourceType: string;
};

export async function getShapeFill({
  shapeNode,
  parentNode,
  isSvgMode,
  warpContext,
  sourceType,
}: GetShapeFillOptions): Promise<unknown> {
  // 1. presentationML
  // p:spPr/ [a:noFill, solidFill, gradFill, blipFill, pattFill, grpFill]
  // From slide
  // Fill Type:
  const shapePropsValue = getTextByPathList({ node: shapeNode, path: ["p:spPr"] });
  const shapePropsNode =
    shapePropsValue && isXmlNode(shapePropsValue) ? shapePropsValue : undefined;
  const fillType = shapePropsNode
    ? getFillType({ shapePropsNode: shapePropsNode as Record<string, unknown> })
    : "";
  let fillValue: unknown;

  if (fillType === "NO_FILL") {
    return isSvgMode ? "none" : "";
  } else if (fillType === "SOLID_FILL") {
    const shapeFillNode = shapePropsNode?.["a:solidFill"];
    if (shapeFillNode && isXmlNode(shapeFillNode)) {
      fillValue = getSolidFill({
        fillNode: shapeFillNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      });
    }
  } else if (fillType === "GRADIENT_FILL") {
    const shapeFillNode = shapePropsNode?.["a:gradFill"];
    if (shapeFillNode && isXmlNode(shapeFillNode)) {
      fillValue = getGradientFill({ gradientFillNode: shapeFillNode, warpContext });
    }
  } else if (fillType === "PATTERN_FILL") {
    const shapeFillNode = shapePropsNode?.["a:pattFill"];
    if (shapeFillNode && isXmlNode(shapeFillNode)) {
      fillValue = getPatternFill({
        patternFillNode: shapeFillNode as Record<string, unknown>,
        warpContext,
      });
    }
  } else if (fillType === "PIC_FILL") {
    const shapeFillNode = shapePropsNode?.["a:blipFill"];
    if (shapeFillNode && isXmlNode(shapeFillNode)) {
      type PicFillOptions = Parameters<typeof getPicFill>[0];
      fillValue = await getPicFill({
        sourceType,
        blipFillNode: shapeFillNode,
        warpContext: warpContext as PicFillOptions["warpContext"],
      });
    }
  }

  // 2. drawingML namespace
  if (fillValue === undefined) {
    const fillRefNodeValue = getTextByPathList({
      node: shapeNode,
      path: ["p:style", "a:fillRef"],
    });
    const fillRefNode =
      fillRefNodeValue && isXmlNode(fillRefNodeValue) ? fillRefNodeValue : undefined;
    const fillRefIndex = parseInt(
      String(
        getTextByPathList({
          node: shapeNode,
          path: ["p:style", "a:fillRef", "attrs", "idx"],
        }) ?? ""
      ),
      10
    );
    if (fillRefIndex === 0 || fillRefIndex === 1000) {
      // no fill
      return isSvgMode ? "none" : "";
    } else if (fillRefIndex > 0 && fillRefIndex < 1000) {
      // <a:fillStyleLst> fill
    } else if (fillRefIndex > 1000) {
      // <a:bgFillStyleLst>
    }
    if (fillRefNode !== undefined) {
      fillValue = getSolidFill({
        fillNode: fillRefNode,
        colorMap: undefined,
        placeholderColor: undefined,
        warpContext,
      });
    }
  }

  // 3. is group fill
  if (fillValue === undefined) {
    const groupFillValue = getTextByPathList({ node: shapeNode, path: ["p:spPr", "a:grpFill"] });
    const groupFillNode = groupFillValue && isXmlNode(groupFillValue) ? groupFillValue : undefined;
    if (groupFillNode !== undefined && parentNode) {
      // get parent fill style
      const groupShapePropsNodeValue = parentNode["p:grpSpPr"];
      const groupShapePropsNode =
        groupShapePropsNodeValue && isXmlNode(groupShapePropsNodeValue)
          ? groupShapePropsNodeValue
          : undefined;
      if (groupShapePropsNode) {
        const groupShapeNode: XmlNode = { "p:spPr": groupShapePropsNode };
        return await getShapeFill({
          shapeNode: groupShapeNode,
          parentNode: shapeNode,
          isSvgMode,
          warpContext,
          sourceType,
        });
      }
    } else if (fillType === "NO_FILL") {
      return isSvgMode ? "none" : "";
    }
  }

  if (fillValue !== undefined) {
    if (fillType === "GRADIENT_FILL") {
      if (isSvgMode) {
        return fillValue;
      } else {
        const gradientValue = fillValue as { color: string[]; rot: number };
        const gradientColors = gradientValue.color;
        const gradientRotation = gradientValue.rot;

        let gradientStyle = "background: linear-gradient(" + gradientRotation + "deg,";
        for (let i = 0; i < gradientColors.length; i++) {
          if (i === gradientColors.length - 1) {
            gradientStyle += "#" + gradientColors[i] + ");";
          } else {
            gradientStyle += "#" + gradientColors[i] + ", ";
          }
        }
        return gradientStyle;
      }
    } else if (fillType === "PIC_FILL") {
      if (isSvgMode) {
        return fillValue;
      } else {
        return "background-image:url(" + fillValue + ");";
      }
    } else if (fillType === "PATTERN_FILL") {
      if (Array.isArray(fillValue)) {
        let backgroundPattern = "",
          backgroundSizeStyle = "",
          backgroundPositionStyle = "";
        backgroundPattern = fillValue[0];
        if (fillValue[1] !== null && fillValue[1] !== undefined && fillValue[1] !== "") {
          backgroundSizeStyle = " background-size:" + fillValue[1] + ";";
        }
        if (fillValue[2] !== null && fillValue[2] !== undefined && fillValue[2] !== "") {
          backgroundPositionStyle = " background-position:" + fillValue[2] + ";";
        }
        return (
          "background: " + backgroundPattern + ";" + backgroundSizeStyle + backgroundPositionStyle
        );
      }
      return isSvgMode ? "none" : "";
    } else {
      if (isSvgMode) {
        const color = tinycolor(String(fillValue));
        fillValue = color.toRgbString();
        return fillValue;
      } else {
        return "background-color: #" + fillValue + ";";
      }
    }
  } else {
    if (isSvgMode) {
      return "none";
    } else {
      return "background-color: inherit;";
    }
  }
}
