import tinycolor from "tinycolor2";
import { getTextByPathList } from "../object/get-text-by-path-list";
import { toHex } from "./to-hex";
import { hslToRgb } from "./hsl-to-rgb";
import { getColorName2Hex } from "./get-color-name-2-hex";
import { applyHueMod } from "./apply-hue-mod";
import { applyLumMod } from "./apply-lum-mod";
import { applyLumOff } from "./apply-lum-off";
import { applySatMod } from "./apply-sat-mod";
import { applyShade } from "./apply-shade";
import { applyTint } from "./apply-tint";
import { getSchemeColorFromTheme } from "./get-scheme-color-from-theme";
import type { WarpContext, XmlAttrs, XmlNode } from "../../types/pptx-xml";

/**
 * Color node with attributes from PPTX XML
 */
interface ColorNode extends XmlNode {
  attrs?: XmlAttrs & {
    val?: string;
    r?: string;
    g?: string;
    b?: string;
    hue?: string;
    sat?: string;
    lum?: string;
    lastClr?: string;
  };
  "a:alpha"?: XmlNode;
  "a:hueMod"?: XmlNode;
  "a:lumMod"?: XmlNode;
  "a:lumOff"?: XmlNode;
  "a:satMod"?: XmlNode;
  "a:shade"?: XmlNode;
  "a:tint"?: XmlNode;
}

/**
 * PPTX fill node containing color information
 */
interface FillNode extends XmlNode {
  "a:srgbClr"?: ColorNode;
  "a:schemeClr"?: ColorNode;
  "a:scrgbClr"?: ColorNode;
  "a:prstClr"?: ColorNode;
  "a:hslClr"?: ColorNode;
  "a:sysClr"?: ColorNode;
}

/**
 * Color mapping attributes from theme (e.g., tx1="dk1", bg2="lt2")
 */
interface ColorMap {
  tx1?: string;
  tx2?: string;
  bg1?: string;
  bg2?: string;
  [key: string]: string | undefined;
}

type GetSolidFillOptions = {
  fillNode: FillNode | undefined;
  colorMap: ColorMap | undefined;
  placeholderColor: string | undefined;
  warpContext: WarpContext;
};

/**
 * Warp object containing PPTX presentation content for lookups
 */
/**
 * Extracts and processes solid fill color from PPTX node
 *
 * Supports multiple color formats:
 * - srgbClr: RGB color with hex value
 * - schemeClr: Theme-based color scheme
 * - scrgbClr: RGB color with percentage values
 * - prstClr: Preset color names
 * - hslClr: HSL color model
 * - sysClr: System colors
 *
 * @param fillNode - The color node from PPTX XML
 * @param colorMap - Color mapping object from theme
 * @param placeholderColor - Placeholder color
 * @param warpContext - Warp object containing slide content for theme lookups
 * @returns Hex color string (with or without alpha), or undefined if node is undefined
 */
export function getSolidFill({
  fillNode,
  colorMap,
  placeholderColor,
  warpContext,
}: GetSolidFillOptions): string | undefined {
  if (fillNode === undefined) {
    return undefined;
  }

  //console.log("getSolidFill node: ", fillNode)
  let hexColor = "";
  let colorNode: ColorNode | undefined;

  if (fillNode["a:srgbClr"] !== undefined) {
    colorNode = fillNode["a:srgbClr"];
    hexColor = String(getTextByPathList({ node: colorNode, path: ["attrs", "val"] }) ?? ""); //#...
  } else if (fillNode["a:schemeClr"] !== undefined) {
    //a:schemeClr
    colorNode = fillNode["a:schemeClr"];
    const schemeColorKey = getTextByPathList({ node: colorNode, path: ["attrs", "val"] });
    hexColor = getSchemeColorFromTheme({
      schemeColorKey: "a:" + String(schemeColorKey ?? ""),
      clrMap: colorMap,
      phClr: placeholderColor,
      warpContext,
    });
    //console.log("schemeClr: ", schemeColorKey, "color: ", hexColor)
  } else if (fillNode["a:scrgbClr"] !== undefined) {
    colorNode = fillNode["a:scrgbClr"];
    //<a:scrgbClr r="50%" g="50%" b="50%"/>  //Need to test/////////////////////////////////////////////
    const colorAttrs = colorNode["attrs"];
    const red =
      colorAttrs["r"].indexOf("%") !== -1 ? colorAttrs["r"].split("%").shift() : colorAttrs["r"];
    const green =
      colorAttrs["g"].indexOf("%") !== -1 ? colorAttrs["g"].split("%").shift() : colorAttrs["g"];
    const blue =
      colorAttrs["b"].indexOf("%") !== -1 ? colorAttrs["b"].split("%").shift() : colorAttrs["b"];
    //var scrgbClr = red + "," + green + "," + blue;
    hexColor =
      toHex({ value: 255 * (Number(red) / 100) }) +
      toHex({ value: 255 * (Number(green) / 100) }) +
      toHex({ value: 255 * (Number(blue) / 100) });
    //console.log("scrgbClr: " + scrgbClr);
  } else if (fillNode["a:prstClr"] !== undefined) {
    colorNode = fillNode["a:prstClr"];
    //<a:prstClr val="black"/>  //Need to test/////////////////////////////////////////////
    const presetColor = getTextByPathList({ node: colorNode, path: ["attrs", "val"] }); //fillNode["a:prstClr"]["attrs"]["val"];
    // BUG FIX: Handle undefined prstClr value
    if (presetColor !== undefined) {
      hexColor = getColorName2Hex({ name: String(presetColor) }) || "";
    }
    //console.log("blip prstClr: ", presetColor, " => hexClr: ", hexColor);
  } else if (fillNode["a:hslClr"] !== undefined) {
    colorNode = fillNode["a:hslClr"];
    //<a:hslClr hue="14400000" sat="100%" lum="50%"/>  //Need to test/////////////////////////////////////////////
    const colorAttrs = colorNode["attrs"];
    const hue = Number(colorAttrs["hue"]) / 100000;
    const sat =
      Number(
        colorAttrs["sat"].indexOf("%") !== -1
          ? colorAttrs["sat"].split("%").shift()
          : colorAttrs["sat"]
      ) / 100;
    const lum =
      Number(
        colorAttrs["lum"].indexOf("%") !== -1
          ? colorAttrs["lum"].split("%").shift()
          : colorAttrs["lum"]
      ) / 100;
    //var hslClr = defBultColorVals["hue"] + "," + defBultColorVals["sat"] + "," + defBultColorVals["lum"];
    const hslRgb = hslToRgb({ hue, saturation: sat, lightness: lum });
    hexColor = toHex({ value: hslRgb.r }) + toHex({ value: hslRgb.g }) + toHex({ value: hslRgb.b });
    //defBultColor = cnvrtHslColor2Hex(hslClr); //TODO
    // console.log("hslClr: " + hslClr);
  } else if (fillNode["a:sysClr"] !== undefined) {
    colorNode = fillNode["a:sysClr"];
    //<a:sysClr val="windowText" lastClr="000000"/>  //Need to test/////////////////////////////////////////////
    const systemColor = getTextByPathList({ node: colorNode, path: ["attrs", "lastClr"] });
    if (systemColor !== undefined) {
      hexColor = String(systemColor);
    }
  }
  //console.log("color: [%cstart]", "color: #" + hexColor, tinycolor(hexColor).toHslString(), hexColor)

  //fix color -------------------------------------------------------- TODO
  //
  //1. "alpha":
  //Specifies the opacity as expressed by a percentage value.
  // [Example: The following represents a green solid fill which is 50 % opaque
  // < a: solidFill >
  //     <a:srgbClr val="00FF00">
  //         <a:alpha val="50%" />
  //     </a:srgbClr>
  // </a: solidFill >
  let hasAlpha = false;
  const alphaValue =
    parseInt(
      String(getTextByPathList({ node: colorNode, path: ["a:alpha", "attrs", "val"] }) ?? ""),
      10
    ) / 100000;
  //console.log("alpha: ", alphaValue)
  if (!isNaN(alphaValue)) {
    // const alphaColor = new colz.Color(hexColor);
    // alphaColor.setAlpha(alphaValue);
    // const updatedColor = alphaColor.rgba.toString();
    // hexColor = rgba2hex(updatedColor)
    const alphaColor = tinycolor(hexColor);
    alphaColor.setAlpha(alphaValue);
    hexColor = alphaColor.toHex8();
    hasAlpha = true;
    //console.log("alphaColor: ", alphaColor, ", color: ", hexColor)
  }
  //2. "alphaMod":
  // Specifies the opacity as expressed by a percentage relative to the input color.
  //     [Example: The following represents a green solid fill which is 50 % opaque
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:alphaMod val="50%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  //3. "alphaOff":
  // Specifies the opacity as expressed by a percentage offset increase or decrease to the
  // input color.Increases never increase the opacity beyond 100 %, decreases never decrease
  // the opacity below 0 %.
  // [Example: The following represents a green solid fill which is 90 % opaque
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:alphaOff val="-10%" />
  //         </a:srgbClr>
  //     </a: solidFill >

  //4. "blue":
  //Specifies the value of the blue component.The assigned value is specified as a
  //percentage with 0 % indicating minimal blue and 100 % indicating maximum blue.
  //  [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //      to value RRGGBB = (00, FF, FF)
  //          <a: solidFill >
  //              <a:srgbClr val="00FF00">
  //                  <a:blue val="100%" />
  //              </a:srgbClr>
  //          </a: solidFill >
  //5. "blueMod"
  // Specifies the blue component as expressed by a percentage relative to the input color
  // component.Increases never increase the blue component beyond 100 %, decreases
  // never decrease the blue component below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, 00, FF)
  //     to value RRGGBB = (00, 00, 80)
  //     < a: solidFill >
  //         <a:srgbClr val="0000FF">
  //             <a:blueMod val="50%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  //6. "blueOff"
  // Specifies the blue component as expressed by a percentage offset increase or decrease
  // to the input color component.Increases never increase the blue component
  // beyond 100 %, decreases never decrease the blue component below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, 00, FF)
  // to value RRGGBB = (00, 00, CC)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:blueOff val="-20%" />
  //         </a:srgbClr>
  //     </a: solidFill >

  //7. "comp" - This element specifies that the color rendered should be the complement of its input color with the complement
  // being defined as such.Two colors are called complementary if, when mixed they produce a shade of grey.For
  // instance, the complement of red which is RGB(255, 0, 0) is cyan.(<a:comp/>)

  //8. "gamma" - This element specifies that the output color rendered by the generating application should be the sRGB gamma
  //              shift of the input color.

  //9. "gray" - This element specifies a grayscale of its input color, taking into relative intensities of the red, green, and blue
  //              primaries.

  //10. "green":
  // Specifies the value of the green component. The assigned value is specified as a
  // percentage with 0 % indicating minimal green and 100 % indicating maximum green.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, 00, FF)
  // to value RRGGBB = (00, FF, FF)
  //     < a: solidFill >
  //         <a:srgbClr val="0000FF">
  //             <a:green val="100%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  //11. "greenMod":
  // Specifies the green component as expressed by a percentage relative to the input color
  // component.Increases never increase the green component beyond 100 %, decreases
  // never decrease the green component below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  // to value RRGGBB = (00, 80, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:greenMod val="50%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  //12. "greenOff":
  // Specifies the green component as expressed by a percentage offset increase or decrease
  // to the input color component.Increases never increase the green component
  // beyond 100 %, decreases never decrease the green component below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  // to value RRGGBB = (00, CC, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:greenOff val="-20%" />
  //         </a:srgbClr>
  //     </a: solidFill >

  //13. "hue" (This element specifies a color using the HSL color model):
  // This element specifies the input color with the specified hue, but with its saturation and luminance unchanged.
  // < a: solidFill >
  //     <a:hslClr hue="14400000" sat="100%" lum="50%">
  // </a:solidFill>
  // <a:solidFill>
  //     <a:hslClr hue="0" sat="100%" lum="50%">
  //         <a:hue val="14400000"/>
  //     <a:hslClr/>
  // </a:solidFill>

  //14. "hueMod" (This element specifies a color using the HSL color model):
  // Specifies the hue as expressed by a percentage relative to the input color.
  // [Example: The following manipulates the fill color from having RGB value RRGGBB = (00, FF, 00) to value RRGGBB = (FF, FF, 00)
  //         < a: solidFill >
  //             <a:srgbClr val="00FF00">
  //                 <a:hueMod val="50%" />
  //             </a:srgbClr>
  //         </a: solidFill >

  const hueMod =
    parseInt(
      String(getTextByPathList({ node: colorNode, path: ["a:hueMod", "attrs", "val"] }) ?? ""),
      10
    ) / 100000;
  //console.log("hueMod: ", hueMod)
  if (!isNaN(hueMod)) {
    hexColor = applyHueMod({ colorValue: hexColor, multiplier: hueMod, isAlpha: hasAlpha });
  }
  //15. "hueOff"(This element specifies a color using the HSL color model):
  // Specifies the actual angular value of the shift.The result of the shift shall be between 0
  // and 360 degrees.Shifts resulting in angular values less than 0 are treated as 0. Shifts
  // resulting in angular values greater than 360 are treated as 360.
  // [Example:
  //     The following increases the hue angular value by 10 degrees.
  //     < a: solidFill >
  //         <a:hslClr hue="0" sat="100%" lum="50%"/>
  //             <a:hueOff val="600000"/>
  //     </a: solidFill >
  //var hueOff = parseInt(getTextByPathList({ node: colorNode, path: ["a:hueOff", "attrs", "val"] })) / 100000;
  // if (!isNaN(hueOff)) {
  //     //console.log("hueOff: ", hueOff, " (TODO)")
  //     //hexColor = applyHueOff(hexColor, hueOff, hasAlpha);
  // }

  //16. "inv" (inverse)
  //This element specifies the inverse of its input color.
  //The inverse of red (1, 0, 0) is cyan (0, 1, 1 ).
  // The following represents cyan, the inverse of red:
  // <a:solidFill>
  //     <a:srgbClr val="FF0000">
  //         <a:inv />
  //     </a:srgbClr>
  // </a:solidFill>

  //17. "invGamma" - This element specifies that the output color rendered by the generating application should be the inverse sRGB
  //                  gamma shift of the input color.

  //18. "lum":
  // This element specifies the input color with the specified luminance, but with its hue and saturation unchanged.
  // Typically luminance values fall in the range[0 %, 100 %].
  // The following two solid fills are equivalent:
  // <a:solidFill>
  //     <a:hslClr hue="14400000" sat="100%" lum="50%">
  // </a:solidFill>
  // <a:solidFill>
  //     <a:hslClr hue="14400000" sat="100%" lum="0%">
  //         <a:lum val="50%" />
  //     <a:hslClr />
  // </a:solidFill>
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  // to value RRGGBB = (00, 66, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:lum val="20%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  // end example]
  //19. "lumMod":
  // Specifies the luminance as expressed by a percentage relative to the input color.
  // Increases never increase the luminance beyond 100 %, decreases never decrease the
  // luminance below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //     to value RRGGBB = (00, 75, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:lumMod val="50%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  // end example]
  const lumMod =
    parseInt(
      String(getTextByPathList({ node: colorNode, path: ["a:lumMod", "attrs", "val"] }) ?? ""),
      10
    ) / 100000;
  //console.log("lumMod: ", lumMod)
  if (!isNaN(lumMod)) {
    hexColor = applyLumMod({ colorValue: hexColor, multiplier: lumMod, isAlpha: hasAlpha });
  }
  //const lumModColor = applyLumMod(hexColor, 0.5);
  //console.log("lumModColor: ", lumModColor)
  //20. "lumOff"
  // Specifies the luminance as expressed by a percentage offset increase or decrease to the
  // input color.Increases never increase the luminance beyond 100 %, decreases never
  // decrease the luminance below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //     to value RRGGBB = (00, 99, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:lumOff val="-20%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  const lumOff =
    parseInt(
      String(getTextByPathList({ node: colorNode, path: ["a:lumOff", "attrs", "val"] }) ?? ""),
      10
    ) / 100000;
  //console.log("lumOff: ", lumOff)
  if (!isNaN(lumOff)) {
    hexColor = applyLumOff({ colorValue: hexColor, offset: lumOff, isAlpha: hasAlpha });
  }

  //21. "red":
  // Specifies the value of the red component.The assigned value is specified as a percentage
  // with 0 % indicating minimal red and 100 % indicating maximum red.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //     to value RRGGBB = (FF, FF, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:red val="100%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  //22. "redMod":
  // Specifies the red component as expressed by a percentage relative to the input color
  // component.Increases never increase the red component beyond 100 %, decreases never
  // decrease the red component below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (FF, 00, 00)
  //     to value RRGGBB = (80, 00, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="FF0000">
  //             <a:redMod val="50%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  //23. "redOff":
  // Specifies the red component as expressed by a percentage offset increase or decrease to
  // the input color component.Increases never increase the red component beyond 100 %,
  //     decreases never decrease the red component below 0 %.
  //     [Example: The following manipulates the fill from having RGB value RRGGBB = (FF, 00, 00)
  //     to value RRGGBB = (CC, 00, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="FF0000">
  //             <a:redOff val="-20%" />
  //         </a:srgbClr>
  //     </a: solidFill >

  //23. "sat":
  // This element specifies the input color with the specified saturation, but with its hue and luminance unchanged.
  // Typically saturation values fall in the range[0 %, 100 %].
  // [Example:
  //     The following two solid fills are equivalent:
  //     <a:solidFill>
  //         <a:hslClr hue="14400000" sat="100%" lum="50%">
  //     </a:solidFill>
  //     <a:solidFill>
  //         <a:hslClr hue="14400000" sat="0%" lum="50%">
  //             <a:sat val="100000" />
  //         <a:hslClr />
  //     </a:solidFill>
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //     to value RRGGBB = (40, C0, 40)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:sat val="50%" />
  //         </a:srgbClr>
  //     <a: solidFill >
  // end example]

  //24. "satMod":
  // Specifies the saturation as expressed by a percentage relative to the input color.
  // Increases never increase the saturation beyond 100 %, decreases never decrease the
  // saturation below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //     to value RRGGBB = (66, 99, 66)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:satMod val="20%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  const satMod =
    parseInt(
      String(getTextByPathList({ node: colorNode, path: ["a:satMod", "attrs", "val"] }) ?? ""),
      10
    ) / 100000;
  if (!isNaN(satMod)) {
    hexColor = applySatMod({ colorValue: hexColor, multiplier: satMod, isAlpha: hasAlpha });
  }
  //25. "satOff":
  // Specifies the saturation as expressed by a percentage offset increase or decrease to the
  // input color.Increases never increase the saturation beyond 100 %, decreases never
  // decrease the saturation below 0 %.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //     to value RRGGBB = (19, E5, 19)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:satOff val="-20%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  // var satOff = parseInt(getTextByPathList({ node: colorNode, path: ["a:satOff", "attrs", "val"] })) / 100000;
  // if (!isNaN(satOff)) {
  //     console.log("satOff: ", satOff, " (TODO)")
  // }

  //26. "shade":
  // This element specifies a darker version of its input color.A 10 % shade is 10 % of the input color combined with 90 % black.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //     to value RRGGBB = (00, BC, 00)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:shade val="50%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  // end example]
  const shade =
    parseInt(
      String(getTextByPathList({ node: colorNode, path: ["a:shade", "attrs", "val"] }) ?? ""),
      10
    ) / 100000;
  if (!isNaN(shade)) {
    hexColor = applyShade({ colorValue: hexColor, shadeValue: shade, isAlpha: hasAlpha });
  }
  //27.  "tint":
  // This element specifies a lighter version of its input color.A 10 % tint is 10 % of the input color combined with
  // 90 % white.
  // [Example: The following manipulates the fill from having RGB value RRGGBB = (00, FF, 00)
  //     to value RRGGBB = (BC, FF, BC)
  //     < a: solidFill >
  //         <a:srgbClr val="00FF00">
  //             <a:tint val="50%" />
  //         </a:srgbClr>
  //     </a: solidFill >
  const tint =
    parseInt(
      String(getTextByPathList({ node: colorNode, path: ["a:tint", "attrs", "val"] }) ?? ""),
      10
    ) / 100000;
  if (!isNaN(tint)) {
    hexColor = applyTint({ colorValue: hexColor, tintValue: tint, isAlpha: hasAlpha });
  }
  //console.log("color [%cfinal]: ", "color: #" + hexColor, tinycolor(hexColor).toHslString(), hexColor)

  return hexColor;
}
