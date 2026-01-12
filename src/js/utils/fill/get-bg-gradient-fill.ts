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

type SolidFillNode = Parameters<typeof getSolidFill>[0];
type SolidFillWarpObj = Parameters<typeof getSolidFill>[3];
type ColorMap = Parameters<typeof getSolidFill>[1];

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isXmlNodeArray(value: XmlValue): value is XmlNode[] {
  return Array.isArray(value);
}

export function getBgGradientFill(
  backgroundProps: XmlNode | undefined,
  placeholderColor: string | undefined,
  slideMasterContent: XmlNode,
  warpContext: SolidFillWarpObj
): string {
  let backgroundCss = "";
  if (backgroundProps !== undefined) {
    const gradientFillNodeValue = getTextByPathList(backgroundProps, ["a:gradFill"]);
    const gradientFillNode = isXmlNode(gradientFillNodeValue) ? gradientFillNodeValue : undefined;
    const gradientStopsValue =
      gradientFillNode !== undefined
        ? getTextByPathList(gradientFillNode, ["a:gsLst", "a:gs"])
        : undefined;
    const gradientStops =
      gradientStopsValue && isXmlNodeArray(gradientStopsValue) ? gradientStopsValue : [];
    const colorStops: string[] = [];
    const positionStops: string[] = [];
    const colorMapValue = getTextByPathList(slideMasterContent, [
      "p:sldMaster",
      "p:clrMap",
      "attrs",
    ]);
    const colorMap =
      colorMapValue && isXmlNode(colorMapValue) ? (colorMapValue as ColorMap) : undefined;

    for (let i = 0; i < gradientStops.length; i++) {
      const solidFillColor = getSolidFill(
        gradientStops[i] as SolidFillNode,
        colorMap,
        placeholderColor,
        warpContext
      );
      const pos = getTextByPathList<string>(gradientStops[i], ["attrs", "pos"]);
      if (pos !== undefined) {
        positionStops[i] = Number(pos) / 1000 + "%";
      } else {
        positionStops[i] = "";
      }
      colorStops[i] = "#" + solidFillColor;
    }

    // get rotation
    const linearGradientNodeValue =
      gradientFillNode !== undefined ? getTextByPathList(gradientFillNode, ["a:lin"]) : undefined;
    const linearGradientNode =
      linearGradientNodeValue && isXmlNode(linearGradientNodeValue)
        ? linearGradientNodeValue
        : undefined;
    let rotationDegrees = 90;
    if (linearGradientNode !== undefined) {
      const angle = getTextByPathList<string | number>(linearGradientNode, ["attrs", "ang"]);
      if (angle !== undefined) {
        rotationDegrees = angleToDegrees(angle) + 90;
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
