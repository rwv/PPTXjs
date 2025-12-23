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

/**
 * Color node with attributes from PPTX XML
 */
interface ColorNode {
  attrs?: {
    val?: string;
    r?: string;
    g?: string;
    b?: string;
    hue?: string;
    sat?: string;
    lum?: string;
    lastClr?: string;
    [key: string]: string | undefined;
  };
  "a:alpha"?: { attrs?: { val?: string } };
  "a:hueMod"?: { attrs?: { val?: string } };
  "a:lumMod"?: { attrs?: { val?: string } };
  "a:lumOff"?: { attrs?: { val?: string } };
  "a:satMod"?: { attrs?: { val?: string } };
  "a:shade"?: { attrs?: { val?: string } };
  "a:tint"?: { attrs?: { val?: string } };
  [key: string]: any;
}

/**
 * PPTX fill node containing color information
 */
interface FillNode {
  "a:srgbClr"?: ColorNode;
  "a:schemeClr"?: ColorNode;
  "a:scrgbClr"?: ColorNode;
  "a:prstClr"?: ColorNode;
  "a:hslClr"?: ColorNode;
  "a:sysClr"?: ColorNode;
  [key: string]: any;
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

/**
 * Warp object containing PPTX presentation content for lookups
 */
interface WarpObject {
  slideContent?: any;
  slideLayoutContent?: any;
  slideMasterContent?: any;
  themeContent?: any;
  [key: string]: any;
}

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
 * @param node - The color node from PPTX XML
 * @param clrMap - Color mapping object from theme
 * @param phClr - Placeholder color
 * @param warpObj - Warp object containing slide content for theme lookups
 * @returns Hex color string (with or without alpha), or undefined if node is undefined
 */
export function getSolidFill(
  node: FillNode | undefined,
  clrMap: ColorMap | undefined,
  phClr: string | undefined,
  warpObj: WarpObject
): string | undefined {
  if (node === undefined) {
    return undefined;
  }

  //console.log("getSolidFill node: ", node)
  let color = "";
  let clrNode: ColorNode | undefined;

  if (node["a:srgbClr"] !== undefined) {
    clrNode = node["a:srgbClr"];
    color = getTextByPathList(clrNode, ["attrs", "val"]) || ""; //#...
  } else if (node["a:schemeClr"] !== undefined) {
    //a:schemeClr
    clrNode = node["a:schemeClr"];
    const schemeClr = getTextByPathList(clrNode, ["attrs", "val"]);
    color = getSchemeColorFromTheme("a:" + schemeClr, clrMap, phClr, warpObj);
    //console.log("schemeClr: ", schemeClr, "color: ", color)
  } else if (node["a:scrgbClr"] !== undefined) {
    clrNode = node["a:scrgbClr"];
    //<a:scrgbClr r="50%" g="50%" b="50%"/>  //Need to test/////////////////////////////////////////////
    const defBultColorVals = clrNode["attrs"];
    const red =
      defBultColorVals["r"].indexOf("%") !== -1
        ? defBultColorVals["r"].split("%").shift()
        : defBultColorVals["r"];
    const green =
      defBultColorVals["g"].indexOf("%") !== -1
        ? defBultColorVals["g"].split("%").shift()
        : defBultColorVals["g"];
    const blue =
      defBultColorVals["b"].indexOf("%") !== -1
        ? defBultColorVals["b"].split("%").shift()
        : defBultColorVals["b"];
    //var scrgbClr = red + "," + green + "," + blue;
    color =
      toHex(255 * (Number(red) / 100)) +
      toHex(255 * (Number(green) / 100)) +
      toHex(255 * (Number(blue) / 100));
    //console.log("scrgbClr: " + scrgbClr);
  } else if (node["a:prstClr"] !== undefined) {
    clrNode = node["a:prstClr"];
    //<a:prstClr val="black"/>  //Need to test/////////////////////////////////////////////
    const prstClr = getTextByPathList(clrNode, ["attrs", "val"]); //node["a:prstClr"]["attrs"]["val"];
    // BUG FIX: Handle undefined prstClr value
    if (prstClr !== undefined) {
      color = getColorName2Hex(prstClr) || "";
    }
    //console.log("blip prstClr: ", prstClr, " => hexClr: ", color);
  } else if (node["a:hslClr"] !== undefined) {
    clrNode = node["a:hslClr"];
    //<a:hslClr hue="14400000" sat="100%" lum="50%"/>  //Need to test/////////////////////////////////////////////
    const defBultColorVals = clrNode["attrs"];
    const hue = Number(defBultColorVals["hue"]) / 100000;
    const sat =
      Number(
        defBultColorVals["sat"].indexOf("%") !== -1
          ? defBultColorVals["sat"].split("%").shift()
          : defBultColorVals["sat"]
      ) / 100;
    const lum =
      Number(
        defBultColorVals["lum"].indexOf("%") !== -1
          ? defBultColorVals["lum"].split("%").shift()
          : defBultColorVals["lum"]
      ) / 100;
    //var hslClr = defBultColorVals["hue"] + "," + defBultColorVals["sat"] + "," + defBultColorVals["lum"];
    const hsl2rgb = hslToRgb(hue, sat, lum);
    color = toHex(hsl2rgb.r) + toHex(hsl2rgb.g) + toHex(hsl2rgb.b);
    //defBultColor = cnvrtHslColor2Hex(hslClr); //TODO
    // console.log("hslClr: " + hslClr);
  } else if (node["a:sysClr"] !== undefined) {
    clrNode = node["a:sysClr"];
    //<a:sysClr val="windowText" lastClr="000000"/>  //Need to test/////////////////////////////////////////////
    const sysClr = getTextByPathList(clrNode, ["attrs", "lastClr"]);
    if (sysClr !== undefined) {
      color = sysClr;
    }
  }
  //console.log("color: [%cstart]", "color: #" + color, tinycolor(color).toHslString(), color)

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
  let isAlpha = false;
  const alpha = parseInt(getTextByPathList(clrNode, ["a:alpha", "attrs", "val"]) || "") / 100000;
  //console.log("alpha: ", alpha)
  if (!isNaN(alpha)) {
    // var al_color = new colz.Color(color);
    // al_color.setAlpha(alpha);
    // var ne_color = al_color.rgba.toString();
    // color = (rgba2hex(ne_color))
    const al_color = tinycolor(color);
    al_color.setAlpha(alpha);
    color = al_color.toHex8();
    isAlpha = true;
    //console.log("al_color: ", al_color, ", color: ", color)
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

  const hueMod = parseInt(getTextByPathList(clrNode, ["a:hueMod", "attrs", "val"]) || "") / 100000;
  //console.log("hueMod: ", hueMod)
  if (!isNaN(hueMod)) {
    color = applyHueMod(color, hueMod, isAlpha);
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
  //var hueOff = parseInt(getTextByPathList(clrNode, ["a:hueOff", "attrs", "val"])) / 100000;
  // if (!isNaN(hueOff)) {
  //     //console.log("hueOff: ", hueOff, " (TODO)")
  //     //color = applyHueOff(color, hueOff, isAlpha);
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
  const lumMod = parseInt(getTextByPathList(clrNode, ["a:lumMod", "attrs", "val"]) || "") / 100000;
  //console.log("lumMod: ", lumMod)
  if (!isNaN(lumMod)) {
    color = applyLumMod(color, lumMod, isAlpha);
  }
  //var lumMod_color = applyLumMod(color, 0.5);
  //console.log("lumMod_color: ", lumMod_color)
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
  const lumOff = parseInt(getTextByPathList(clrNode, ["a:lumOff", "attrs", "val"]) || "") / 100000;
  //console.log("lumOff: ", lumOff)
  if (!isNaN(lumOff)) {
    color = applyLumOff(color, lumOff, isAlpha);
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
  const satMod = parseInt(getTextByPathList(clrNode, ["a:satMod", "attrs", "val"]) || "") / 100000;
  if (!isNaN(satMod)) {
    color = applySatMod(color, satMod, isAlpha);
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
  // var satOff = parseInt(getTextByPathList(clrNode, ["a:satOff", "attrs", "val"])) / 100000;
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
  const shade = parseInt(getTextByPathList(clrNode, ["a:shade", "attrs", "val"]) || "") / 100000;
  if (!isNaN(shade)) {
    color = applyShade(color, shade, isAlpha);
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
  const tint = parseInt(getTextByPathList(clrNode, ["a:tint", "attrs", "val"]) || "") / 100000;
  if (!isNaN(tint)) {
    color = applyTint(color, tint, isAlpha);
  }
  //console.log("color [%cfinal]: ", "color: #" + color, tinycolor(color).toHslString(), color)

  return color;
}
