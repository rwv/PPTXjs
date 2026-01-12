import { getTextByPathList } from "../object/get-text-by-path-list";
import { getSolidFill } from "../color/get-solid-fill";
import { angleToDegrees } from "../layout/angle-to-degrees";
import type { XmlNode, XmlValue } from "../../types/pptx-xml";

/**
 * Extracts gradient fill information from PPTX node
 *
 * Parses gradient stop colors and rotation angle to create CSS linear gradient.
 * Handles multiple color stops (a:gs) and linear gradient direction (a:lin).
 *
 * @param gradientFillNode - Gradient fill node from PPTX (a:gradFill)
 * @param warpContext - Container object with theme and color information
 * @returns Object with color array and rotation angle for CSS gradient
 */
type SolidFillNode = Parameters<typeof getSolidFill>[0];
type SolidFillWarpObj = Parameters<typeof getSolidFill>[3];
function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isXmlNodeArray(value: XmlValue): value is XmlNode[] {
  return Array.isArray(value);
}

export function getGradientFill(gradientFillNode: XmlNode, warpContext: SolidFillWarpObj) {
  const gradientStopsValue = getTextByPathList(gradientFillNode, ["a:gsLst", "a:gs"]);
  const gradientStops =
    gradientStopsValue && isXmlNodeArray(gradientStopsValue) ? gradientStopsValue : [];
  const colorStops: Array<string | undefined> = [];
  for (let i = 0; i < gradientStops.length; i++) {
    const solidFillColor = getSolidFill(
      gradientStops[i] as SolidFillNode,
      undefined,
      undefined,
      warpContext
    );
    colorStops[i] = solidFillColor;
  }
  const linearGradientNodeValue = getTextByPathList(gradientFillNode, ["a:lin"]);
  const linearGradientNode =
    linearGradientNodeValue && isXmlNode(linearGradientNodeValue)
      ? linearGradientNodeValue
      : undefined;
  let rotationDegrees = 0;
  if (linearGradientNode !== undefined) {
    const angle = getTextByPathList<string | number>(linearGradientNode, ["attrs", "ang"]);
    if (angle !== undefined) {
      rotationDegrees = angleToDegrees(angle) + 90;
    }
  }
  return {
    color: colorStops,
    rot: rotationDegrees,
  };
}
