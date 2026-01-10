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

export async function getShapeFill(
  shapeNode: any,
  parentNode: any,
  isSvgMode: boolean,
  warpContext: any,
  sourceType: string
): Promise<any> {
  // 1. presentationML
  // p:spPr/ [a:noFill, solidFill, gradFill, blipFill, pattFill, grpFill]
  // From slide
  // Fill Type:
  const fillType = getFillType(getTextByPathList(shapeNode, ["p:spPr"]));
  let fillValue;

  if (fillType === "NO_FILL") {
    return isSvgMode ? "none" : "";
  } else if (fillType === "SOLID_FILL") {
    const shapeFillNode = shapeNode["p:spPr"]["a:solidFill"];
    fillValue = getSolidFill(shapeFillNode, undefined, undefined, warpContext);
  } else if (fillType === "GRADIENT_FILL") {
    const shapeFillNode = shapeNode["p:spPr"]["a:gradFill"];
    fillValue = getGradientFill(shapeFillNode, warpContext);
  } else if (fillType === "PATTERN_FILL") {
    const shapeFillNode = shapeNode["p:spPr"]["a:pattFill"];
    fillValue = getPatternFill(shapeFillNode, warpContext);
  } else if (fillType === "PIC_FILL") {
    const shapeFillNode = shapeNode["p:spPr"]["a:blipFill"];
    fillValue = await getPicFill(sourceType, shapeFillNode, warpContext);
  }

  // 2. drawingML namespace
  if (fillValue === undefined) {
    const fillRefNode = getTextByPathList(shapeNode, ["p:style", "a:fillRef"]);
    const fillRefIndex = parseInt(
      getTextByPathList(shapeNode, ["p:style", "a:fillRef", "attrs", "idx"])
    );
    if (fillRefIndex === 0 || fillRefIndex === 1000) {
      // no fill
      return isSvgMode ? "none" : "";
    } else if (fillRefIndex > 0 && fillRefIndex < 1000) {
      // <a:fillStyleLst> fill
    } else if (fillRefIndex > 1000) {
      // <a:bgFillStyleLst>
    }
    fillValue = getSolidFill(fillRefNode, undefined, undefined, warpContext);
  }

  // 3. is group fill
  if (fillValue === undefined) {
    const groupFillNode = getTextByPathList(shapeNode, ["p:spPr", "a:grpFill"]);
    if (groupFillNode !== undefined) {
      // get parent fill style
      const groupShapePropsNode = parentNode["p:grpSpPr"];
      const groupShapeNode = { "p:spPr": groupShapePropsNode };
      return await getShapeFill(groupShapeNode, shapeNode, isSvgMode, warpContext, sourceType);
    } else if (fillType === "NO_FILL") {
      return isSvgMode ? "none" : "";
    }
  }

  if (fillValue !== undefined) {
    if (fillType === "GRADIENT_FILL") {
      if (isSvgMode) {
        return fillValue;
      } else {
        const gradientColors = fillValue.color;
        const gradientRotation = fillValue.rot;

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
    } else {
      if (isSvgMode) {
        const color = tinycolor(fillValue);
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
