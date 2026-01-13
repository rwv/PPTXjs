import { getTextByPathList } from "../object/get-text-by-path-list";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

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

type GetSchemeColorFromThemeOptions = {
  schemeColorKey: string;
  clrMap: ColorMap | undefined;
  phClr: string | undefined;
  warpContext: WarpContext;
};

/**
 * Warp object containing PPTX presentation content for lookups
 */
function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
export function getSchemeColorFromTheme({
  schemeColorKey,
  clrMap,
  phClr,
  warpContext,
}: GetSchemeColorFromThemeOptions): string {
  //<p:clrMap ...> in slide master
  // e.g. tx2="dk2" bg2="lt2" tx1="dk1" bg1="lt1" slideLayoutColorOverride
  //console.log("getSchemeColorFromTheme: schemeColorKey: ", schemeColorKey, ",clrMap: ", clrMap)
  let slideLayoutColorOverride: ColorMap | undefined;
  if (clrMap !== undefined) {
    slideLayoutColorOverride = clrMap; //getTextByPathList({ node: clrMap, path: ["p:sldMaster", "p:clrMap", "attrs"] })
  } else {
    const slideColorMapOverride = getTextByPathList({
      node: warpContext["slideContent"] as XmlNode,
      path: ["p:sld", "p:clrMapOvr", "a:overrideClrMapping", "attrs"],
    });
    if (slideColorMapOverride !== undefined && isXmlNode(slideColorMapOverride)) {
      slideLayoutColorOverride = slideColorMapOverride as ColorMap;
    } else {
      const slideLayoutColorOverrideNode = getTextByPathList({
        node: warpContext["slideLayoutContent"] as XmlNode,
        path: ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"],
      });
      if (slideLayoutColorOverrideNode !== undefined && isXmlNode(slideLayoutColorOverrideNode)) {
        slideLayoutColorOverride = slideLayoutColorOverrideNode as ColorMap;
      } else {
        const slideMasterColorOverride = getTextByPathList({
          node: warpContext["slideMasterContent"] as XmlNode,
          path: ["p:sldMaster", "p:clrMap", "attrs"],
        });
        if (slideMasterColorOverride !== undefined && isXmlNode(slideMasterColorOverride)) {
          slideLayoutColorOverride = slideMasterColorOverride as ColorMap;
        }
      }
    }
  }
  //console.log("getSchemeColorFromTheme slideLayoutColorOverride: ", slideLayoutColorOverride);
  const normalizedSchemeKey = schemeColorKey.startsWith("a:")
    ? schemeColorKey
    : `a:${schemeColorKey}`;
  const schemeColorName = normalizedSchemeKey.slice(2);
  let schemeColorRef = normalizedSchemeKey;
  const getDefaultSchemeKey = (name: string): string | undefined => {
    switch (name) {
      case "tx1":
        return "a:dk1";
      case "tx2":
        return "a:dk2";
      case "bg1":
        return "a:lt1";
      case "bg2":
        return "a:lt2";
      default:
        return undefined;
    }
  };
  let color: string | undefined;
  if (schemeColorName === "phClr" && phClr !== undefined) {
    color = phClr;
  } else {
    if (slideLayoutColorOverride !== undefined) {
      const overrideKey = slideLayoutColorOverride[schemeColorName];
      if (overrideKey) {
        schemeColorRef = `a:${overrideKey}`;
      } else {
        const fallbackKey = getDefaultSchemeKey(schemeColorName);
        if (fallbackKey) {
          schemeColorRef = fallbackKey;
        }
      }
    } else {
      const fallbackKey = getDefaultSchemeKey(schemeColorName);
      if (fallbackKey) {
        schemeColorRef = fallbackKey;
      }
    }
    //console.log("getSchemeColorFromTheme:  schemeColorKey: ", schemeColorKey);
    const refNode = getTextByPathList({
      node: warpContext["themeContent"] as XmlNode,
      path: ["a:theme", "a:themeElements", "a:clrScheme", schemeColorRef],
    });
    if (refNode !== undefined && isXmlNode(refNode)) {
      color = getTextByPathList({ node: refNode, path: ["a:srgbClr", "attrs", "val"] });
    }
    //console.log("themeContent: color", color);
    if (color === undefined && refNode !== undefined && isXmlNode(refNode)) {
      color = getTextByPathList({ node: refNode, path: ["a:sysClr", "attrs", "lastClr"] });
    }
  }
  //console.log(color)
  return color || "";
}
