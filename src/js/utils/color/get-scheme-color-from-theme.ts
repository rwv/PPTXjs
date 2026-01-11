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
interface WarpContext {
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
 * @param schemeColorKey - Scheme color reference (e.g., "a:tx1", "a:bg2", "a:accent1")
 * @param clrMap - Color mapping object from theme
 * @param phClr - Placeholder color to use for "phClr" references
 * @param warpContext - Warp object containing slide, layout, master, and theme content
 * @returns Hex color string
 */
export function getSchemeColorFromTheme(
  schemeColorKey: string,
  clrMap: ColorMap | undefined,
  phClr: string | undefined,
  warpContext: WarpContext
): string {
  //<p:clrMap ...> in slide master
  // e.g. tx2="dk2" bg2="lt2" tx1="dk1" bg1="lt1" slideLayoutColorOverride
  //console.log("getSchemeColorFromTheme: schemeColorKey: ", schemeColorKey, ",clrMap: ", clrMap)
  let slideLayoutColorOverride: ColorMap | undefined;
  if (clrMap !== undefined) {
    slideLayoutColorOverride = clrMap; //getTextByPathList(clrMap, ["p:sldMaster", "p:clrMap", "attrs"])
  } else {
    let slideColorMapOverride = getTextByPathList(warpContext["slideContent"], [
      "p:sld",
      "p:clrMapOvr",
      "a:overrideClrMapping",
      "attrs",
    ]);
    if (slideColorMapOverride !== undefined) {
      slideLayoutColorOverride = slideColorMapOverride;
    } else {
      slideColorMapOverride = getTextByPathList(warpContext["slideLayoutContent"], [
        "p:sldLayout",
        "p:clrMapOvr",
        "a:overrideClrMapping",
        "attrs",
      ]);
      if (slideColorMapOverride !== undefined) {
        slideLayoutColorOverride = slideColorMapOverride;
      } else {
        slideLayoutColorOverride = getTextByPathList(warpContext["slideMasterContent"], [
          "p:sldMaster",
          "p:clrMap",
          "attrs",
        ]);
      }
    }
  }
  //console.log("getSchemeColorFromTheme slideLayoutColorOverride: ", slideLayoutColorOverride);
  const schemeColorName = schemeColorKey.substring(2);
  let color: string | undefined;
  if (schemeColorName === "phClr" && phClr !== undefined) {
    color = phClr;
  } else {
    if (slideLayoutColorOverride !== undefined) {
      switch (schemeColorName) {
        case "tx1":
        case "tx2":
        case "bg1":
        case "bg2":
          schemeColorKey = "a:" + slideLayoutColorOverride[schemeColorName];
          break;
      }
    } else {
      switch (schemeColorName) {
        case "tx1":
          schemeColorKey = "a:dk1";
          break;
        case "tx2":
          schemeColorKey = "a:dk2";
          break;
        case "bg1":
          schemeColorKey = "a:lt1";
          break;
        case "bg2":
          schemeColorKey = "a:lt2";
          break;
      }
    }
    //console.log("getSchemeColorFromTheme:  schemeColorKey: ", schemeColorKey);
    const refNode = getTextByPathList(warpContext["themeContent"], [
      "a:theme",
      "a:themeElements",
      "a:clrScheme",
      schemeColorKey,
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
