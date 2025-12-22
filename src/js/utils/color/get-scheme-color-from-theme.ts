import { getTextByPathList } from "../object/get-text-by-path-list";

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
 * Resolves a scheme color reference to an actual color value from the theme
 *
 * Handles color mappings from different sources:
 * - Slide-level color map overrides (p:clrMapOvr)
 * - Layout-level color map overrides
 * - Master slide color maps
 * - Theme color scheme elements
 *
 * @param schemeClr - Scheme color reference (e.g., "a:tx1", "a:bg2", "a:accent1")
 * @param clrMap - Color mapping object from theme
 * @param phClr - Placeholder color to use for "phClr" references
 * @param warpObj - Warp object containing slide, layout, master, and theme content
 * @returns Hex color string
 */
export function getSchemeColorFromTheme(
  schemeClr: string,
  clrMap: ColorMap | undefined,
  phClr: string | undefined,
  warpObj: WarpObject
): string {
  //<p:clrMap ...> in slide master
  // e.g. tx2="dk2" bg2="lt2" tx1="dk1" bg1="lt1" slideLayoutClrOvride
  //console.log("getSchemeColorFromTheme: schemeClr: ", schemeClr, ",clrMap: ", clrMap)
  let slideLayoutClrOvride: ColorMap | undefined;
  if (clrMap !== undefined) {
    slideLayoutClrOvride = clrMap; //getTextByPathList(clrMap, ["p:sldMaster", "p:clrMap", "attrs"])
  } else {
    let sldClrMapOvr = getTextByPathList(warpObj["slideContent"], [
      "p:sld",
      "p:clrMapOvr",
      "a:overrideClrMapping",
      "attrs",
    ]);
    if (sldClrMapOvr !== undefined) {
      slideLayoutClrOvride = sldClrMapOvr;
    } else {
      sldClrMapOvr = getTextByPathList(warpObj["slideLayoutContent"], [
        "p:sldLayout",
        "p:clrMapOvr",
        "a:overrideClrMapping",
        "attrs",
      ]);
      if (sldClrMapOvr !== undefined) {
        slideLayoutClrOvride = sldClrMapOvr;
      } else {
        slideLayoutClrOvride = getTextByPathList(warpObj["slideMasterContent"], [
          "p:sldMaster",
          "p:clrMap",
          "attrs",
        ]);
      }
    }
  }
  //console.log("getSchemeColorFromTheme slideLayoutClrOvride: ", slideLayoutClrOvride);
  const schmClrName = schemeClr.substring(2);
  let color: string | undefined;
  if (schmClrName == "phClr" && phClr !== undefined) {
    color = phClr;
  } else {
    if (slideLayoutClrOvride !== undefined) {
      switch (schmClrName) {
        case "tx1":
        case "tx2":
        case "bg1":
        case "bg2":
          schemeClr = "a:" + slideLayoutClrOvride[schmClrName];
          break;
      }
    } else {
      switch (schmClrName) {
        case "tx1":
          schemeClr = "a:dk1";
          break;
        case "tx2":
          schemeClr = "a:dk2";
          break;
        case "bg1":
          schemeClr = "a:lt1";
          break;
        case "bg2":
          schemeClr = "a:lt2";
          break;
      }
    }
    //console.log("getSchemeColorFromTheme:  schemeClr: ", schemeClr);
    const refNode = getTextByPathList(warpObj["themeContent"], [
      "a:theme",
      "a:themeElements",
      "a:clrScheme",
      schemeClr,
    ]);
    color = getTextByPathList(refNode, ["a:srgbClr", "attrs", "val"]);
    //console.log("themeContent: color", color);
    if (color === undefined && refNode !== undefined) {
      color = getTextByPathList(refNode, ["a:sysClr", "attrs", "lastClr"]);
    }
  }
  //console.log(color)
  return color || "";
}
