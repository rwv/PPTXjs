/**
 * Get background gradient fill style
 *
 * @param backgroundProps - Background properties node
 * @param placeholderColor - Placeholder color
 * @param slideMasterContent - Slide master content
 * @param warpContext - The warp object containing theme and other resources
 * @returns CSS background gradient string
 */
import { getTextByPathList } from "../object";
import { getSolidFill } from "../color/get-solid-fill";
import { angleToDegrees } from "../layout/angle-to-degrees";
import type { XmlNode, XmlValue } from "../../types/pptx-xml";

type SolidFillOptions = Parameters<typeof getSolidFill>[0];
type SolidFillNode = SolidFillOptions["fillNode"];
type SolidFillWarpObj = SolidFillOptions["warpContext"];
type ColorMap = SolidFillOptions["colorMap"];

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isXmlNodeArray(value: XmlValue): value is XmlNode[] {
  return Array.isArray(value);
}

type GetBgGradientFillOptions = {
  backgroundProps: XmlNode | undefined;
  placeholderColor: string | undefined;
  slideMasterContent: XmlNode;
  warpContext: SolidFillWarpObj;
};

export function getBgGradientFill({
  backgroundProps,
  placeholderColor,
  slideMasterContent,
  warpContext,
}: GetBgGradientFillOptions): string {
  let backgroundCss = "";
  if (backgroundProps !== undefined) {
    const gradientFillNodeValue = getTextByPathList({
      node: backgroundProps,
      path: ["a:gradFill"],
    });
    const gradientFillNode = isXmlNode(gradientFillNodeValue) ? gradientFillNodeValue : undefined;
    const gradientStopsValue =
      gradientFillNode !== undefined
        ? getTextByPathList({ node: gradientFillNode, path: ["a:gsLst", "a:gs"] })
        : undefined;
    const gradientStops = gradientStopsValue
      ? isXmlNodeArray(gradientStopsValue)
        ? gradientStopsValue
        : isXmlNode(gradientStopsValue)
          ? [gradientStopsValue]
          : []
      : [];
    const colorStops: string[] = [];
    const positionStops: string[] = [];
    const colorMapValue = getTextByPathList({
      node: slideMasterContent,
      path: ["p:sldMaster", "p:clrMap", "attrs"],
    });
    const colorMap =
      colorMapValue && isXmlNode(colorMapValue) ? (colorMapValue as ColorMap) : undefined;

    for (let i = 0; i < gradientStops.length; i++) {
      const solidFillColor = getSolidFill({
        fillNode: gradientStops[i] as SolidFillNode,
        colorMap,
        placeholderColor,
        warpContext,
      });
      const pos = getTextByPathList<string | number>({
        node: gradientStops[i],
        path: ["attrs", "pos"],
      });
      const posValue = pos !== undefined ? Number(pos) : Number.NaN;
      if (Number.isFinite(posValue)) {
        positionStops[i] = posValue / 1000 + "%";
      } else {
        positionStops[i] = "";
      }
      colorStops[i] = "#" + solidFillColor;
    }

    // get rotation
    const linearGradientNodeValue =
      gradientFillNode !== undefined
        ? getTextByPathList({ node: gradientFillNode, path: ["a:lin"] })
        : undefined;
    const linearGradientNode =
      linearGradientNodeValue && isXmlNode(linearGradientNodeValue)
        ? linearGradientNodeValue
        : undefined;
    let rotationDegrees = 90;
    if (linearGradientNode !== undefined) {
      const angle = getTextByPathList<string | number>({
        node: linearGradientNode,
        path: ["attrs", "ang"],
      });
      if (angle !== undefined) {
        rotationDegrees = angleToDegrees({ angle }) + 90;
      }
    }

    backgroundCss = "background: linear-gradient(" + rotationDegrees + "deg,";
    for (let i = 0; i < gradientStops.length; i++) {
      if (i === gradientStops.length - 1) {
        backgroundCss += colorStops[i] + " " + positionStops[i] + ");";
      } else {
        backgroundCss += colorStops[i] + " " + positionStops[i] + ", ";
      }
    }
  } else {
    if (placeholderColor !== undefined) {
      backgroundCss = "background: #" + placeholderColor + ";";
    }
  }
  return backgroundCss;
}
