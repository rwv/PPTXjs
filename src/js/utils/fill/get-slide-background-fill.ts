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

export async function getSlideBackgroundFill(
  warpContext: any,
  slideIndex: number | string
): Promise<string | undefined> {
  void slideIndex;
  const slideContent = warpContext["slideContent"];
  const slideLayoutContent = warpContext["slideLayoutContent"];
  const slideMasterContent = warpContext["slideMasterContent"];

  let backgroundProps = getTextByPathList(slideContent, ["p:sld", "p:cSld", "p:bg", "p:bgPr"]);
  let backgroundRef = getTextByPathList(slideContent, ["p:sld", "p:cSld", "p:bg", "p:bgRef"]);
  let backgroundCss: string | undefined;

  if (backgroundProps !== undefined) {
    const backgroundFillType = getFillType(backgroundProps);

    if (backgroundFillType === "SOLID_FILL") {
      const slideFill = backgroundProps["a:solidFill"];
      let colorMapOverride;
      let slideColorMapOverride = getTextByPathList(slideContent, [
        "p:sld",
        "p:clrMapOvr",
        "a:overrideClrMapping",
        "attrs",
      ]);
      if (slideColorMapOverride !== undefined) {
        colorMapOverride = slideColorMapOverride;
      } else {
        slideColorMapOverride = getTextByPathList(slideLayoutContent, [
          "p:sldLayout",
          "p:clrMapOvr",
          "a:overrideClrMapping",
          "attrs",
        ]);
        if (slideColorMapOverride !== undefined) {
          colorMapOverride = slideColorMapOverride;
        } else {
          colorMapOverride = getTextByPathList(slideMasterContent, [
            "p:sldMaster",
            "p:clrMap",
            "attrs",
          ]);
        }
      }
      const slideBackgroundColor = getSolidFill(
        slideFill,
        colorMapOverride,
        undefined,
        warpContext
      );
      backgroundCss = "background: #" + slideBackgroundColor + ";";
    } else if (backgroundFillType === "GRADIENT_FILL") {
      backgroundCss = getBgGradientFill(
        backgroundProps,
        undefined,
        slideMasterContent,
        warpContext
      );
    } else if (backgroundFillType === "PIC_FILL") {
      backgroundCss = await getBgPicFill(backgroundProps, "slideBg", warpContext, undefined);
    }
  } else if (backgroundRef !== undefined) {
    let colorMapOverride;
    let slideColorMapOverride = getTextByPathList(slideContent, [
      "p:sld",
      "p:clrMapOvr",
      "a:overrideClrMapping",
      "attrs",
    ]);
    if (slideColorMapOverride !== undefined) {
      colorMapOverride = slideColorMapOverride;
    } else {
      slideColorMapOverride = getTextByPathList(slideLayoutContent, [
        "p:sldLayout",
        "p:clrMapOvr",
        "a:overrideClrMapping",
        "attrs",
      ]);
      if (slideColorMapOverride !== undefined) {
        colorMapOverride = slideColorMapOverride;
      } else {
        colorMapOverride = getTextByPathList(slideMasterContent, [
          "p:sldMaster",
          "p:clrMap",
          "attrs",
        ]);
      }
    }
    const placeholderColor = getSolidFill(backgroundRef, colorMapOverride, undefined, warpContext);
    const themeIndex = Number(backgroundRef["attrs"]["idx"]);

    if (themeIndex === 0 || themeIndex === 1000) {
      // no background
    } else if (themeIndex > 0 && themeIndex < 1000) {
      // fillStyleLst in themeContent
    } else if (themeIndex > 1000) {
      // bgFillStyleLst in themeContent
      const themeFillIndex = themeIndex - 1000;
      const backgroundFillList =
        warpContext["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"][
          "a:bgFillStyleLst"
        ];
      const sortableFillList: any[] = [];

      Object.keys(backgroundFillList).forEach(function (key) {
        const fillListEntry = backgroundFillList[key];
        if (key !== "attrs") {
          if (fillListEntry.constructor === Array) {
            for (let i = 0; i < fillListEntry.length; i++) {
              const obj: any = {};
              obj[key] = fillListEntry[i];
              obj["idex"] = fillListEntry[i]["attrs"]["order"];
              obj["attrs"] = { order: fillListEntry[i]["attrs"]["order"] };
              sortableFillList.push(obj);
            }
          } else {
            const obj: any = {};
            obj[key] = fillListEntry;
            obj["idex"] = fillListEntry["attrs"]["order"];
            obj["attrs"] = { order: fillListEntry["attrs"]["order"] };
            sortableFillList.push(obj);
          }
        }
      });

      const sortedByOrder = sortableFillList.slice(0);
      sortedByOrder.sort(function (a: any, b: any) {
        return a.idex - b.idex;
      });

      const backgroundFillEntry = sortedByOrder[themeFillIndex - 1];
      const backgroundFillEntryType = getFillType(backgroundFillEntry);

      if (backgroundFillEntryType === "SOLID_FILL") {
        const slideFill = backgroundFillEntry["a:solidFill"];
        const slideBackgroundColor = getSolidFill(
          slideFill,
          colorMapOverride,
          undefined,
          warpContext
        );
        backgroundCss = "background: #" + slideBackgroundColor + ";";
      } else if (backgroundFillEntryType === "GRADIENT_FILL") {
        backgroundCss = getBgGradientFill(
          backgroundFillEntry,
          placeholderColor,
          slideMasterContent,
          warpContext
        );
      } else {
        console.log(backgroundFillEntryType);
      }
    }
  } else {
    // Check slideLayout
    backgroundProps = getTextByPathList(slideLayoutContent, [
      "p:sldLayout",
      "p:cSld",
      "p:bg",
      "p:bgPr",
    ]);
    backgroundRef = getTextByPathList(slideLayoutContent, [
      "p:sldLayout",
      "p:cSld",
      "p:bg",
      "p:bgRef",
    ]);

    let colorMapOverride;
    const slideColorMapOverride = getTextByPathList(slideLayoutContent, [
      "p:sldLayout",
      "p:clrMapOvr",
      "a:overrideClrMapping",
      "attrs",
    ]);
    if (slideColorMapOverride !== undefined) {
      colorMapOverride = slideColorMapOverride;
    } else {
      colorMapOverride = getTextByPathList(slideMasterContent, [
        "p:sldMaster",
        "p:clrMap",
        "attrs",
      ]);
    }

    if (backgroundProps !== undefined) {
      const backgroundFillType = getFillType(backgroundProps);
      if (backgroundFillType === "SOLID_FILL") {
        const slideFill = backgroundProps["a:solidFill"];
        const slideBackgroundColor = getSolidFill(
          slideFill,
          colorMapOverride,
          undefined,
          warpContext
        );
        backgroundCss = "background: #" + slideBackgroundColor + ";";
      } else if (backgroundFillType === "GRADIENT_FILL") {
        backgroundCss = getBgGradientFill(
          backgroundProps,
          undefined,
          slideMasterContent,
          warpContext
        );
      } else if (backgroundFillType === "PIC_FILL") {
        backgroundCss = await getBgPicFill(
          backgroundProps,
          "slideLayoutBg",
          warpContext,
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
      const themeIndex = Number(backgroundRef["attrs"]["idx"]);

      if (themeIndex === 0 || themeIndex === 1000) {
        // no background
      } else if (themeIndex > 0 && themeIndex < 1000) {
        // fillStyleLst in themeContent
      } else if (themeIndex > 1000) {
        // bgFillStyleLst in themeContent
        const themeFillIndex = themeIndex - 1000;
        const backgroundFillList =
          warpContext["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"][
            "a:bgFillStyleLst"
          ];
        const sortableFillList: any[] = [];

        Object.keys(backgroundFillList).forEach(function (key) {
          const fillListEntry = backgroundFillList[key];
          if (key !== "attrs") {
            if (fillListEntry.constructor === Array) {
              for (let i = 0; i < fillListEntry.length; i++) {
                const obj: any = {};
                obj[key] = fillListEntry[i];
                obj["idex"] = fillListEntry[i]["attrs"]["order"];
                obj["attrs"] = { order: fillListEntry[i]["attrs"]["order"] };
                sortableFillList.push(obj);
              }
            } else {
              const obj: any = {};
              obj[key] = fillListEntry;
              obj["idex"] = fillListEntry["attrs"]["order"];
              obj["attrs"] = { order: fillListEntry["attrs"]["order"] };
              sortableFillList.push(obj);
            }
          }
        });

        const sortedByOrder = sortableFillList.slice(0);
        sortedByOrder.sort(function (a: any, b: any) {
          return a.idex - b.idex;
        });

        const backgroundFillEntry = sortedByOrder[themeFillIndex - 1];
        const backgroundFillEntryType = getFillType(backgroundFillEntry);

        if (backgroundFillEntryType === "SOLID_FILL") {
          const slideFill = backgroundFillEntry["a:solidFill"];
          const slideBackgroundColor = getSolidFill(
            slideFill,
            colorMapOverride,
            placeholderColor,
            warpContext
          );
          backgroundCss = "background: #" + slideBackgroundColor + ";";
        } else if (backgroundFillEntryType === "GRADIENT_FILL") {
          backgroundCss = getBgGradientFill(
            backgroundFillEntry,
            placeholderColor,
            slideMasterContent,
            warpContext
          );
        } else if (backgroundFillEntryType === "PIC_FILL") {
          backgroundCss = await getBgPicFill(
            backgroundFillEntry,
            "themeBg",
            warpContext,
            placeholderColor
          );
        } else {
          console.log(backgroundFillEntryType);
        }
      }
    } else {
      // Check slideMaster
      backgroundProps = getTextByPathList(slideMasterContent, [
        "p:sldMaster",
        "p:cSld",
        "p:bg",
        "p:bgPr",
      ]);
      backgroundRef = getTextByPathList(slideMasterContent, [
        "p:sldMaster",
        "p:cSld",
        "p:bg",
        "p:bgRef",
      ]);

      const clrMap = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);

      if (backgroundProps !== undefined) {
        const backgroundFillType = getFillType(backgroundProps);
        if (backgroundFillType === "SOLID_FILL") {
          const slideFill = backgroundProps["a:solidFill"];
          const slideBackgroundColor = getSolidFill(slideFill, clrMap, undefined, warpContext);
          backgroundCss = "background: #" + slideBackgroundColor + ";";
        } else if (backgroundFillType === "GRADIENT_FILL") {
          backgroundCss = getBgGradientFill(
            backgroundProps,
            undefined,
            slideMasterContent,
            warpContext
          );
        } else if (backgroundFillType === "PIC_FILL") {
          backgroundCss = await getBgPicFill(
            backgroundProps,
            "slideMasterBg",
            warpContext,
            undefined
          );
        }
      } else if (backgroundRef !== undefined) {
        const placeholderColor = getSolidFill(backgroundRef, clrMap, undefined, warpContext);
        const themeIndex = Number(backgroundRef["attrs"]["idx"]);

        if (themeIndex === 0 || themeIndex === 1000) {
          // no background
        } else if (themeIndex > 0 && themeIndex < 1000) {
          // fillStyleLst in themeContent
        } else if (themeIndex > 1000) {
          // bgFillStyleLst in themeContent
          const themeFillIndex = themeIndex - 1000;
          const backgroundFillList =
            warpContext["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"][
              "a:bgFillStyleLst"
            ];
          const sortableFillList: any[] = [];

          Object.keys(backgroundFillList).forEach(function (key) {
            const fillListEntry = backgroundFillList[key];
            if (key !== "attrs") {
              if (fillListEntry.constructor === Array) {
                for (let i = 0; i < fillListEntry.length; i++) {
                  const obj: any = {};
                  obj[key] = fillListEntry[i];
                  obj["idex"] = fillListEntry[i]["attrs"]["order"];
                  obj["attrs"] = { order: fillListEntry[i]["attrs"]["order"] };
                  sortableFillList.push(obj);
                }
              } else {
                const obj: any = {};
                obj[key] = fillListEntry;
                obj["idex"] = fillListEntry["attrs"]["order"];
                obj["attrs"] = { order: fillListEntry["attrs"]["order"] };
                sortableFillList.push(obj);
              }
            }
          });

          const sortedByOrder = sortableFillList.slice(0);
          sortedByOrder.sort(function (a: any, b: any) {
            return a.idex - b.idex;
          });

          const backgroundFillEntry = sortedByOrder[themeFillIndex - 1];
          const backgroundFillEntryType = getFillType(backgroundFillEntry);

          if (backgroundFillEntryType === "SOLID_FILL") {
            const slideFill = backgroundFillEntry["a:solidFill"];
            const slideBackgroundColor = getSolidFill(
              slideFill,
              clrMap,
              placeholderColor,
              warpContext
            );
            backgroundCss = "background: #" + slideBackgroundColor + ";";
          } else if (backgroundFillEntryType === "GRADIENT_FILL") {
            backgroundCss = getBgGradientFill(
              backgroundFillEntry,
              placeholderColor,
              slideMasterContent,
              warpContext
            );
          } else if (backgroundFillEntryType === "PIC_FILL") {
            backgroundCss = await getBgPicFill(
              backgroundFillEntry,
              "themeBg",
              warpContext,
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
