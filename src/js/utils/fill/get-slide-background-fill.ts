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

type ColorMap = Parameters<typeof getSolidFill>[1];
type PicFillWarpObj = Parameters<typeof getBgPicFill>[2];

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getColorMapOverride(
  slideContent: XmlNode | undefined,
  slideLayoutContent: XmlNode | undefined,
  slideMasterContent: XmlNode | undefined
): ColorMap | undefined {
  const slideColorMapOverride = getTextByPathList(slideContent as XmlNode, [
    "p:sld",
    "p:clrMapOvr",
    "a:overrideClrMapping",
    "attrs",
  ]);
  if (slideColorMapOverride && isXmlNode(slideColorMapOverride)) {
    return slideColorMapOverride as ColorMap;
  }
  const layoutColorMapOverride = getTextByPathList(slideLayoutContent as XmlNode, [
    "p:sldLayout",
    "p:clrMapOvr",
    "a:overrideClrMapping",
    "attrs",
  ]);
  if (layoutColorMapOverride && isXmlNode(layoutColorMapOverride)) {
    return layoutColorMapOverride as ColorMap;
  }
  const masterColorMapOverride = getTextByPathList(slideMasterContent as XmlNode, [
    "p:sldMaster",
    "p:clrMap",
    "attrs",
  ]);
  return masterColorMapOverride && isXmlNode(masterColorMapOverride)
    ? (masterColorMapOverride as ColorMap)
    : undefined;
}

type SortableFillEntry = XmlNode & { idex?: number };

function pushSortableFillEntry(list: SortableFillEntry[], key: string, entry: XmlNode): void {
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
          pushSortableFillEntry(sortableFillList, key, entry);
        }
      }
    } else if (isXmlNode(fillListEntry)) {
      pushSortableFillEntry(sortableFillList, key, fillListEntry);
    }
  });
  return sortableFillList;
}

export async function getSlideBackgroundFill(
  warpContext: WarpContext,
  slideIndex: number | string
): Promise<string | undefined> {
  void slideIndex;
  const slideContent = warpContext.slideContent;
  const slideLayoutContent = warpContext.slideLayoutContent;
  const slideMasterContent = warpContext.slideMasterContent;

  const backgroundPropsValue = getTextByPathList(slideContent as XmlNode, [
    "p:sld",
    "p:cSld",
    "p:bg",
    "p:bgPr",
  ]);
  let backgroundProps =
    backgroundPropsValue && isXmlNode(backgroundPropsValue) ? backgroundPropsValue : undefined;
  const backgroundRefValue = getTextByPathList(slideContent as XmlNode, [
    "p:sld",
    "p:cSld",
    "p:bg",
    "p:bgRef",
  ]);
  let backgroundRef =
    backgroundRefValue && isXmlNode(backgroundRefValue) ? backgroundRefValue : undefined;
  let backgroundCss: string | undefined;

  if (backgroundProps !== undefined) {
    const backgroundFillType = getFillType(backgroundProps as Record<string, unknown>);

    if (backgroundFillType === "SOLID_FILL") {
      const slideFillValue = backgroundProps["a:solidFill"];
      const slideFill = slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
      const colorMapOverride = getColorMapOverride(
        slideContent,
        slideLayoutContent,
        slideMasterContent
      );
      if (slideFill) {
        const slideBackgroundColor = getSolidFill(
          slideFill,
          colorMapOverride,
          undefined,
          warpContext
        );
        backgroundCss = "background: #" + slideBackgroundColor + ";";
      }
    } else if (backgroundFillType === "GRADIENT_FILL") {
      backgroundCss = getBgGradientFill(
        backgroundProps,
        undefined,
        (slideMasterContent ?? {}) as XmlNode,
        warpContext
      );
    } else if (backgroundFillType === "PIC_FILL") {
      backgroundCss = await getBgPicFill(
        backgroundProps,
        "slideBg",
        warpContext as PicFillWarpObj,
        undefined
      );
    }
  } else if (backgroundRef !== undefined) {
    const colorMapOverride = getColorMapOverride(
      slideContent,
      slideLayoutContent,
      slideMasterContent
    );
    const placeholderColor = getSolidFill(backgroundRef, colorMapOverride, undefined, warpContext);
    const themeIndex = Number(backgroundRef.attrs?.idx ?? 0);

    if (themeIndex === 0 || themeIndex === 1000) {
      // no background
    } else if (themeIndex > 0 && themeIndex < 1000) {
      // fillStyleLst in themeContent
    } else if (themeIndex > 1000) {
      // bgFillStyleLst in themeContent
      const themeFillIndex = themeIndex - 1000;
      const backgroundFillListValue = getTextByPathList(warpContext.themeContent as XmlNode, [
        "a:theme",
        "a:themeElements",
        "a:fmtScheme",
        "a:bgFillStyleLst",
      ]);
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
      const backgroundFillEntryType = getFillType(backgroundFillEntry as Record<string, unknown>);

      if (backgroundFillEntryType === "SOLID_FILL") {
        const slideFillValue = backgroundFillEntry["a:solidFill"];
        const slideFill = slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
        if (slideFill) {
          const slideBackgroundColor = getSolidFill(
            slideFill,
            colorMapOverride,
            undefined,
            warpContext
          );
          backgroundCss = "background: #" + slideBackgroundColor + ";";
        }
      } else if (backgroundFillEntryType === "GRADIENT_FILL") {
        backgroundCss = getBgGradientFill(
          backgroundFillEntry,
          placeholderColor,
          (slideMasterContent ?? {}) as XmlNode,
          warpContext
        );
      } else {
        console.log(backgroundFillEntryType);
      }
    }
  } else {
    // Check slideLayout
    const layoutBackgroundPropsValue = getTextByPathList(slideLayoutContent as XmlNode, [
      "p:sldLayout",
      "p:cSld",
      "p:bg",
      "p:bgPr",
    ]);
    backgroundProps =
      layoutBackgroundPropsValue && isXmlNode(layoutBackgroundPropsValue)
        ? layoutBackgroundPropsValue
        : undefined;
    const layoutBackgroundRefValue = getTextByPathList(slideLayoutContent as XmlNode, [
      "p:sldLayout",
      "p:cSld",
      "p:bg",
      "p:bgRef",
    ]);
    backgroundRef =
      layoutBackgroundRefValue && isXmlNode(layoutBackgroundRefValue)
        ? layoutBackgroundRefValue
        : undefined;

    const colorMapOverride = getColorMapOverride(undefined, slideLayoutContent, slideMasterContent);

    if (backgroundProps !== undefined) {
      const backgroundFillType = getFillType(backgroundProps as Record<string, unknown>);
      if (backgroundFillType === "SOLID_FILL") {
        const slideFillValue = backgroundProps["a:solidFill"];
        const slideFill = slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
        if (slideFill) {
          const slideBackgroundColor = getSolidFill(
            slideFill,
            colorMapOverride,
            undefined,
            warpContext
          );
          backgroundCss = "background: #" + slideBackgroundColor + ";";
        }
      } else if (backgroundFillType === "GRADIENT_FILL") {
        backgroundCss = getBgGradientFill(
          backgroundProps,
          undefined,
          (slideMasterContent ?? {}) as XmlNode,
          warpContext
        );
      } else if (backgroundFillType === "PIC_FILL") {
        backgroundCss = await getBgPicFill(
          backgroundProps,
          "slideLayoutBg",
          warpContext as PicFillWarpObj,
          undefined
        );
      }
    } else if (backgroundRef !== undefined) {
      console.log("slideLayoutContent: bgRef", backgroundRef);
      const placeholderColor = getSolidFill(
        backgroundRef,
        colorMapOverride,
        undefined,
        warpContext
      );
      const themeIndex = Number(backgroundRef.attrs?.idx ?? 0);

      if (themeIndex === 0 || themeIndex === 1000) {
        // no background
      } else if (themeIndex > 0 && themeIndex < 1000) {
        // fillStyleLst in themeContent
      } else if (themeIndex > 1000) {
        // bgFillStyleLst in themeContent
        const themeFillIndex = themeIndex - 1000;
        const backgroundFillListValue = getTextByPathList(warpContext.themeContent as XmlNode, [
          "a:theme",
          "a:themeElements",
          "a:fmtScheme",
          "a:bgFillStyleLst",
        ]);
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
        const backgroundFillEntryType = getFillType(backgroundFillEntry as Record<string, unknown>);

        if (backgroundFillEntryType === "SOLID_FILL") {
          const slideFillValue = backgroundFillEntry["a:solidFill"];
          const slideFill =
            slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
          if (slideFill) {
            const slideBackgroundColor = getSolidFill(
              slideFill,
              colorMapOverride,
              placeholderColor,
              warpContext
            );
            backgroundCss = "background: #" + slideBackgroundColor + ";";
          }
        } else if (backgroundFillEntryType === "GRADIENT_FILL") {
          backgroundCss = getBgGradientFill(
            backgroundFillEntry,
            placeholderColor,
            (slideMasterContent ?? {}) as XmlNode,
            warpContext
          );
        } else if (backgroundFillEntryType === "PIC_FILL") {
          backgroundCss = await getBgPicFill(
            backgroundFillEntry,
            "themeBg",
            warpContext as PicFillWarpObj,
            placeholderColor
          );
        } else {
          console.log(backgroundFillEntryType);
        }
      }
    } else {
      // Check slideMaster
      const masterBackgroundPropsValue = getTextByPathList(slideMasterContent as XmlNode, [
        "p:sldMaster",
        "p:cSld",
        "p:bg",
        "p:bgPr",
      ]);
      backgroundProps =
        masterBackgroundPropsValue && isXmlNode(masterBackgroundPropsValue)
          ? masterBackgroundPropsValue
          : undefined;
      const masterBackgroundRefValue = getTextByPathList(slideMasterContent as XmlNode, [
        "p:sldMaster",
        "p:cSld",
        "p:bg",
        "p:bgRef",
      ]);
      backgroundRef =
        masterBackgroundRefValue && isXmlNode(masterBackgroundRefValue)
          ? masterBackgroundRefValue
          : undefined;

      const clrMapValue = getTextByPathList(slideMasterContent as XmlNode, [
        "p:sldMaster",
        "p:clrMap",
        "attrs",
      ]);
      const clrMap = clrMapValue && isXmlNode(clrMapValue) ? (clrMapValue as ColorMap) : undefined;

      if (backgroundProps !== undefined) {
        const backgroundFillType = getFillType(backgroundProps as Record<string, unknown>);
        if (backgroundFillType === "SOLID_FILL") {
          const slideFillValue = backgroundProps["a:solidFill"];
          const slideFill =
            slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
          if (slideFill) {
            const slideBackgroundColor = getSolidFill(slideFill, clrMap, undefined, warpContext);
            backgroundCss = "background: #" + slideBackgroundColor + ";";
          }
        } else if (backgroundFillType === "GRADIENT_FILL") {
          backgroundCss = getBgGradientFill(
            backgroundProps,
            undefined,
            (slideMasterContent ?? {}) as XmlNode,
            warpContext
          );
        } else if (backgroundFillType === "PIC_FILL") {
          backgroundCss = await getBgPicFill(
            backgroundProps,
            "slideMasterBg",
            warpContext as PicFillWarpObj,
            undefined
          );
        }
      } else if (backgroundRef !== undefined) {
        const placeholderColor = getSolidFill(backgroundRef, clrMap, undefined, warpContext);
        const themeIndex = Number(backgroundRef.attrs?.idx ?? 0);

        if (themeIndex === 0 || themeIndex === 1000) {
          // no background
        } else if (themeIndex > 0 && themeIndex < 1000) {
          // fillStyleLst in themeContent
        } else if (themeIndex > 1000) {
          // bgFillStyleLst in themeContent
          const themeFillIndex = themeIndex - 1000;
          const backgroundFillListValue = getTextByPathList(warpContext.themeContent as XmlNode, [
            "a:theme",
            "a:themeElements",
            "a:fmtScheme",
            "a:bgFillStyleLst",
          ]);
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
          const backgroundFillEntryType = getFillType(
            backgroundFillEntry as Record<string, unknown>
          );

          if (backgroundFillEntryType === "SOLID_FILL") {
            const slideFillValue = backgroundFillEntry["a:solidFill"];
            const slideFill =
              slideFillValue && isXmlNode(slideFillValue) ? slideFillValue : undefined;
            if (slideFill) {
              const slideBackgroundColor = getSolidFill(
                slideFill,
                clrMap,
                placeholderColor,
                warpContext
              );
              backgroundCss = "background: #" + slideBackgroundColor + ";";
            }
          } else if (backgroundFillEntryType === "GRADIENT_FILL") {
            backgroundCss = getBgGradientFill(
              backgroundFillEntry,
              placeholderColor,
              (slideMasterContent ?? {}) as XmlNode,
              warpContext
            );
          } else if (backgroundFillEntryType === "PIC_FILL") {
            backgroundCss = await getBgPicFill(
              backgroundFillEntry,
              "themeBg",
              warpContext as PicFillWarpObj,
              placeholderColor
            );
          } else {
            console.log(backgroundFillEntryType);
          }
        }
      }
    }
  }

  return backgroundCss;
}
