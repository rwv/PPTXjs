/**
 * Get slide background fill style
 *
 * @param warpContext - The warp object containing slide content and theme
 * @param slideIndex - Slide index
 * @returns CSS background style string
 */
import { getTextByPathList } from "../object";
import { getFillType } from "./get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getBgGradientFill } from "./get-bg-gradient-fill";
import { getBgPicFill } from "./get-bg-pic-fill";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

type SolidFillOptions = Parameters<typeof getSolidFill>[0];
type ColorMap = SolidFillOptions["colorMap"];
type BgPicFillOptions = Parameters<typeof getBgPicFill>[0];
type PicFillWarpObj = BgPicFillOptions["warpContext"];

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

type GetColorMapOverrideOptions = {
  slideContent: XmlNode | undefined;
  slideLayoutContent: XmlNode | undefined;
  slideMasterContent: XmlNode | undefined;
};

function getColorMapOverride({
  slideContent,
  slideLayoutContent,
  slideMasterContent,
}: GetColorMapOverrideOptions): ColorMap | undefined {
  const slideColorMapOverride = getTextByPathList({
    node: slideContent as XmlNode,
    path: ["p:sld", "p:clrMapOvr", "a:overrideClrMapping", "attrs"],
  });
  if (slideColorMapOverride && isXmlNode(slideColorMapOverride)) {
    return slideColorMapOverride as ColorMap;
  }
  const layoutColorMapOverride = getTextByPathList({
    node: slideLayoutContent as XmlNode,
    path: ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"],
  });
  if (layoutColorMapOverride && isXmlNode(layoutColorMapOverride)) {
    return layoutColorMapOverride as ColorMap;
  }
  const masterColorMapOverride = getTextByPathList({
    node: slideMasterContent as XmlNode,
    path: ["p:sldMaster", "p:clrMap", "attrs"],
  });
  return masterColorMapOverride && isXmlNode(masterColorMapOverride)
    ? (masterColorMapOverride as ColorMap)
    : undefined;
}

type SortableFillEntry = XmlNode & { idex?: number };

type PushSortableFillEntryOptions = {
  list: SortableFillEntry[];
  key: string;
  entry: XmlNode;
};

function pushSortableFillEntry({ list, key, entry }: PushSortableFillEntryOptions): void {
  const order = entry.attrs?.order;
  if (order === undefined) {
    return;
  }
  const idex = Number(order);
  const sortableEntry: SortableFillEntry = { [key]: entry, idex, attrs: { order } };
  list.push(sortableEntry);
}

function buildSortableFillList(backgroundFillList: XmlNode): SortableFillEntry[] {
  const sortableFillList: SortableFillEntry[] = [];
  Object.keys(backgroundFillList).forEach((key) => {
    if (key === "attrs") {
      return;
    }
    const fillListEntry = backgroundFillList[key];
    if (Array.isArray(fillListEntry)) {
      for (const entry of fillListEntry) {
        if (isXmlNode(entry)) {
          pushSortableFillEntry({ list: sortableFillList, key, entry });
        }
      }
    } else if (isXmlNode(fillListEntry)) {
      pushSortableFillEntry({ list: sortableFillList, key, entry: fillListEntry });
    }
  });
  return sortableFillList;
}

type GetSlideBackgroundFillOptions = {
  warpContext: WarpContext;
};

export async function getSlideBackgroundFill({
  warpContext,
}: GetSlideBackgroundFillOptions): Promise<string | undefined> {
  const slideContent = warpContext.slideContent;
  const slideLayoutContent = warpContext.slideLayoutContent;
  const slideMasterContent = warpContext.slideMasterContent;

  const backgroundPropsValue = getTextByPathList({
    node: slideContent as XmlNode,
    path: ["p:sld", "p:cSld", "p:bg", "p:bgPr"],
  });
  let backgroundProps =
    backgroundPropsValue && isXmlNode(backgroundPropsValue) ? backgroundPropsValue : undefined;
  const backgroundRefValue = getTextByPathList({
    node: slideContent as XmlNode,
    path: ["p:sld", "p:cSld", "p:bg", "p:bgRef"],
  });
  let backgroundRef =
    backgroundRefValue && isXmlNode(backgroundRefValue) ? backgroundRefValue : undefined;
  let backgroundCss: string | undefined;

  if (backgroundProps !== undefined) {
    const backgroundFillType = getFillType({
      shapePropsNode: backgroundProps as Record<string, unknown>,
    });

    if (backgroundFillType === "SOLID_FILL") {
      const slideFillValue = backgroundProps["a:solidFill"];
      const slideFill = slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
      const colorMapOverride = getColorMapOverride({
        slideContent,
        slideLayoutContent,
        slideMasterContent,
      });
      if (slideFill) {
        const slideBackgroundColor = getSolidFill({
          fillNode: slideFill,
          colorMap: colorMapOverride,
          placeholderColor: undefined,
          warpContext,
        });
        backgroundCss = "background: #" + slideBackgroundColor + ";";
      }
    } else if (backgroundFillType === "GRADIENT_FILL") {
      backgroundCss = getBgGradientFill({
        backgroundProps,
        placeholderColor: undefined,
        slideMasterContent: (slideMasterContent ?? {}) as XmlNode,
        warpContext,
      });
    } else if (backgroundFillType === "PIC_FILL") {
      backgroundCss = await getBgPicFill({
        backgroundProps,
        sourceType: "slideBg",
        warpContext: warpContext as PicFillWarpObj,
        placeholderColor: undefined,
      });
    }
  } else if (backgroundRef !== undefined) {
    const colorMapOverride = getColorMapOverride({
      slideContent,
      slideLayoutContent,
      slideMasterContent,
    });
    const placeholderColor = getSolidFill({
      fillNode: backgroundRef,
      colorMap: colorMapOverride,
      placeholderColor: undefined,
      warpContext,
    });
    const themeIndex = Number(backgroundRef.attrs?.idx ?? 0);

    if (themeIndex === 0 || themeIndex === 1000) {
      // no background
    } else if (themeIndex > 0 && themeIndex < 1000) {
      // fillStyleLst in themeContent
    } else if (themeIndex > 1000) {
      // bgFillStyleLst in themeContent
      const themeFillIndex = themeIndex - 1000;
      const backgroundFillListValue = getTextByPathList({
        node: warpContext.themeContent as XmlNode,
        path: ["a:theme", "a:themeElements", "a:fmtScheme", "a:bgFillStyleLst"],
      });
      if (!backgroundFillListValue || !isXmlNode(backgroundFillListValue)) {
        return backgroundCss;
      }
      const backgroundFillList = backgroundFillListValue;
      const sortableFillList = buildSortableFillList(backgroundFillList);
      const sortedByOrder = sortableFillList.slice(0).sort((a, b) => (a.idex ?? 0) - (b.idex ?? 0));

      const backgroundFillEntry = sortedByOrder[themeFillIndex - 1];
      if (!backgroundFillEntry) {
        return backgroundCss;
      }
      const backgroundFillEntryType = getFillType({
        shapePropsNode: backgroundFillEntry as Record<string, unknown>,
      });

      if (backgroundFillEntryType === "SOLID_FILL") {
        const slideFillValue = backgroundFillEntry["a:solidFill"];
        const slideFill = slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
        if (slideFill) {
          const slideBackgroundColor = getSolidFill({
            fillNode: slideFill,
            colorMap: colorMapOverride,
            placeholderColor: undefined,
            warpContext,
          });
          backgroundCss = "background: #" + slideBackgroundColor + ";";
        }
      } else if (backgroundFillEntryType === "GRADIENT_FILL") {
        backgroundCss = getBgGradientFill({
          backgroundProps: backgroundFillEntry,
          placeholderColor,
          slideMasterContent: (slideMasterContent ?? {}) as XmlNode,
          warpContext,
        });
      } else {
        console.log(backgroundFillEntryType);
      }
    }
  } else {
    // Check slideLayout
    const layoutBackgroundPropsValue = getTextByPathList({
      node: slideLayoutContent as XmlNode,
      path: ["p:sldLayout", "p:cSld", "p:bg", "p:bgPr"],
    });
    backgroundProps =
      layoutBackgroundPropsValue && isXmlNode(layoutBackgroundPropsValue)
        ? layoutBackgroundPropsValue
        : undefined;
    const layoutBackgroundRefValue = getTextByPathList({
      node: slideLayoutContent as XmlNode,
      path: ["p:sldLayout", "p:cSld", "p:bg", "p:bgRef"],
    });
    backgroundRef =
      layoutBackgroundRefValue && isXmlNode(layoutBackgroundRefValue)
        ? layoutBackgroundRefValue
        : undefined;

    const colorMapOverride = getColorMapOverride({
      slideContent: undefined,
      slideLayoutContent,
      slideMasterContent,
    });

    if (backgroundProps !== undefined) {
      const backgroundFillType = getFillType({
        shapePropsNode: backgroundProps as Record<string, unknown>,
      });
      if (backgroundFillType === "SOLID_FILL") {
        const slideFillValue = backgroundProps["a:solidFill"];
        const slideFill = slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
        if (slideFill) {
          const slideBackgroundColor = getSolidFill({
            fillNode: slideFill,
            colorMap: colorMapOverride,
            placeholderColor: undefined,
            warpContext,
          });
          backgroundCss = "background: #" + slideBackgroundColor + ";";
        }
      } else if (backgroundFillType === "GRADIENT_FILL") {
        backgroundCss = getBgGradientFill({
          backgroundProps,
          placeholderColor: undefined,
          slideMasterContent: (slideMasterContent ?? {}) as XmlNode,
          warpContext,
        });
      } else if (backgroundFillType === "PIC_FILL") {
        backgroundCss = await getBgPicFill({
          backgroundProps,
          sourceType: "slideLayoutBg",
          warpContext: warpContext as PicFillWarpObj,
          placeholderColor: undefined,
        });
      }
    } else if (backgroundRef !== undefined) {
      console.log("slideLayoutContent: bgRef", backgroundRef);
      const placeholderColor = getSolidFill({
        fillNode: backgroundRef,
        colorMap: colorMapOverride,
        placeholderColor: undefined,
        warpContext,
      });
      const themeIndex = Number(backgroundRef.attrs?.idx ?? 0);

      if (themeIndex === 0 || themeIndex === 1000) {
        // no background
      } else if (themeIndex > 0 && themeIndex < 1000) {
        // fillStyleLst in themeContent
      } else if (themeIndex > 1000) {
        // bgFillStyleLst in themeContent
        const themeFillIndex = themeIndex - 1000;
        const backgroundFillListValue = getTextByPathList({
          node: warpContext.themeContent as XmlNode,
          path: ["a:theme", "a:themeElements", "a:fmtScheme", "a:bgFillStyleLst"],
        });
        if (!backgroundFillListValue || !isXmlNode(backgroundFillListValue)) {
          return backgroundCss;
        }
        const backgroundFillList = backgroundFillListValue;
        const sortableFillList = buildSortableFillList(backgroundFillList);
        const sortedByOrder = sortableFillList
          .slice(0)
          .sort((a, b) => (a.idex ?? 0) - (b.idex ?? 0));

        const backgroundFillEntry = sortedByOrder[themeFillIndex - 1];
        if (!backgroundFillEntry) {
          return backgroundCss;
        }
        const backgroundFillEntryType = getFillType({
          shapePropsNode: backgroundFillEntry as Record<string, unknown>,
        });

        if (backgroundFillEntryType === "SOLID_FILL") {
          const slideFillValue = backgroundFillEntry["a:solidFill"];
          const slideFill =
            slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
          if (slideFill) {
            const slideBackgroundColor = getSolidFill({
              fillNode: slideFill,
              colorMap: colorMapOverride,
              placeholderColor,
              warpContext,
            });
            backgroundCss = "background: #" + slideBackgroundColor + ";";
          }
        } else if (backgroundFillEntryType === "GRADIENT_FILL") {
          backgroundCss = getBgGradientFill({
            backgroundProps: backgroundFillEntry,
            placeholderColor,
            slideMasterContent: (slideMasterContent ?? {}) as XmlNode,
            warpContext,
          });
        } else if (backgroundFillEntryType === "PIC_FILL") {
          backgroundCss = await getBgPicFill({
            backgroundProps: backgroundFillEntry,
            sourceType: "themeBg",
            warpContext: warpContext as PicFillWarpObj,
            placeholderColor,
          });
        } else {
          console.log(backgroundFillEntryType);
        }
      }
    } else {
      // Check slideMaster
      const masterBackgroundPropsValue = getTextByPathList({
        node: slideMasterContent as XmlNode,
        path: ["p:sldMaster", "p:cSld", "p:bg", "p:bgPr"],
      });
      backgroundProps =
        masterBackgroundPropsValue && isXmlNode(masterBackgroundPropsValue)
          ? masterBackgroundPropsValue
          : undefined;
      const masterBackgroundRefValue = getTextByPathList({
        node: slideMasterContent as XmlNode,
        path: ["p:sldMaster", "p:cSld", "p:bg", "p:bgRef"],
      });
      backgroundRef =
        masterBackgroundRefValue && isXmlNode(masterBackgroundRefValue)
          ? masterBackgroundRefValue
          : undefined;

      const clrMapValue = getTextByPathList({
        node: slideMasterContent as XmlNode,
        path: ["p:sldMaster", "p:clrMap", "attrs"],
      });
      const clrMap = clrMapValue && isXmlNode(clrMapValue) ? (clrMapValue as ColorMap) : undefined;

      if (backgroundProps !== undefined) {
        const backgroundFillType = getFillType({
          shapePropsNode: backgroundProps as Record<string, unknown>,
        });
        if (backgroundFillType === "SOLID_FILL") {
          const slideFillValue = backgroundProps["a:solidFill"];
          const slideFill =
            slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
          if (slideFill) {
            const slideBackgroundColor = getSolidFill({
              fillNode: slideFill,
              colorMap: clrMap,
              placeholderColor: undefined,
              warpContext,
            });
            backgroundCss = "background: #" + slideBackgroundColor + ";";
          }
        } else if (backgroundFillType === "GRADIENT_FILL") {
          backgroundCss = getBgGradientFill({
            backgroundProps,
            placeholderColor: undefined,
            slideMasterContent: (slideMasterContent ?? {}) as XmlNode,
            warpContext,
          });
        } else if (backgroundFillType === "PIC_FILL") {
          backgroundCss = await getBgPicFill({
            backgroundProps,
            sourceType: "slideMasterBg",
            warpContext: warpContext as PicFillWarpObj,
            placeholderColor: undefined,
          });
        }
      } else if (backgroundRef !== undefined) {
        const placeholderColor = getSolidFill({
          fillNode: backgroundRef,
          colorMap: clrMap,
          placeholderColor: undefined,
          warpContext,
        });
        const themeIndex = Number(backgroundRef.attrs?.idx ?? 0);

        if (themeIndex === 0 || themeIndex === 1000) {
          // no background
        } else if (themeIndex > 0 && themeIndex < 1000) {
          // fillStyleLst in themeContent
        } else if (themeIndex > 1000) {
          // bgFillStyleLst in themeContent
          const themeFillIndex = themeIndex - 1000;
          const backgroundFillListValue = getTextByPathList({
            node: warpContext.themeContent as XmlNode,
            path: ["a:theme", "a:themeElements", "a:fmtScheme", "a:bgFillStyleLst"],
          });
          if (!backgroundFillListValue || !isXmlNode(backgroundFillListValue)) {
            return backgroundCss;
          }
          const backgroundFillList = backgroundFillListValue;
          const sortableFillList = buildSortableFillList(backgroundFillList);
          const sortedByOrder = sortableFillList
            .slice(0)
            .sort((a, b) => (a.idex ?? 0) - (b.idex ?? 0));

          const backgroundFillEntry = sortedByOrder[themeFillIndex - 1];
          if (!backgroundFillEntry) {
            return backgroundCss;
          }
          const backgroundFillEntryType = getFillType({
            shapePropsNode: backgroundFillEntry as Record<string, unknown>,
          });

          if (backgroundFillEntryType === "SOLID_FILL") {
            const slideFillValue = backgroundFillEntry["a:solidFill"];
            const slideFill =
              slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
            if (slideFill) {
              const slideBackgroundColor = getSolidFill({
                fillNode: slideFill,
                colorMap: clrMap,
                placeholderColor,
                warpContext,
              });
              backgroundCss = "background: #" + slideBackgroundColor + ";";
            }
          } else if (backgroundFillEntryType === "GRADIENT_FILL") {
            backgroundCss = getBgGradientFill({
              backgroundProps: backgroundFillEntry,
              placeholderColor,
              slideMasterContent: (slideMasterContent ?? {}) as XmlNode,
              warpContext,
            });
          } else if (backgroundFillEntryType === "PIC_FILL") {
            backgroundCss = await getBgPicFill({
              backgroundProps: backgroundFillEntry,
              sourceType: "themeBg",
              warpContext: warpContext as PicFillWarpObj,
              placeholderColor,
            });
          } else {
            console.log(backgroundFillEntryType);
          }
        }
      }
    }
  }

  return backgroundCss;
}
