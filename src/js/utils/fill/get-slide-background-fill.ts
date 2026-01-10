/**
 * Get slide background fill style
 *
 * @param warpObj - The warp object containing slide content and theme
 * @param index - Slide index
 * @returns CSS background style string
 */
import { getTextByPathList } from "../object";
import { getFillType } from "./get-fill-type";
import { getSolidFill } from "../color/get-solid-fill";
import { getBgGradientFill } from "./get-bg-gradient-fill";
import { getBgPicFill } from "./get-bg-pic-fill";

export async function getSlideBackgroundFill(
  warpObj: any,
  index: number | string
): Promise<string | undefined> {
  const slideContent = warpObj["slideContent"];
  const slideLayoutContent = warpObj["slideLayoutContent"];
  const slideMasterContent = warpObj["slideMasterContent"];

  let bgPr = getTextByPathList(slideContent, ["p:sld", "p:cSld", "p:bg", "p:bgPr"]);
  let bgRef = getTextByPathList(slideContent, ["p:sld", "p:cSld", "p:bg", "p:bgRef"]);
  let bgcolor: string | undefined;

  if (bgPr !== undefined) {
    const bgFillTyp = getFillType(bgPr);

    if (bgFillTyp === "SOLID_FILL") {
      const sldFill = bgPr["a:solidFill"];
      let clrMapOvr;
      let sldClrMapOvr = getTextByPathList(slideContent, [
        "p:sld",
        "p:clrMapOvr",
        "a:overrideClrMapping",
        "attrs",
      ]);
      if (sldClrMapOvr !== undefined) {
        clrMapOvr = sldClrMapOvr;
      } else {
        sldClrMapOvr = getTextByPathList(slideLayoutContent, [
          "p:sldLayout",
          "p:clrMapOvr",
          "a:overrideClrMapping",
          "attrs",
        ]);
        if (sldClrMapOvr !== undefined) {
          clrMapOvr = sldClrMapOvr;
        } else {
          clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
        }
      }
      const sldBgClr = getSolidFill(sldFill, clrMapOvr, undefined, warpObj);
      bgcolor = "background: #" + sldBgClr + ";";
    } else if (bgFillTyp === "GRADIENT_FILL") {
      bgcolor = getBgGradientFill(bgPr, undefined, slideMasterContent, warpObj);
    } else if (bgFillTyp === "PIC_FILL") {
      bgcolor = await getBgPicFill(bgPr, "slideBg", warpObj, undefined, index);
    }
  } else if (bgRef !== undefined) {
    let clrMapOvr;
    let sldClrMapOvr = getTextByPathList(slideContent, [
      "p:sld",
      "p:clrMapOvr",
      "a:overrideClrMapping",
      "attrs",
    ]);
    if (sldClrMapOvr !== undefined) {
      clrMapOvr = sldClrMapOvr;
    } else {
      sldClrMapOvr = getTextByPathList(slideLayoutContent, [
        "p:sldLayout",
        "p:clrMapOvr",
        "a:overrideClrMapping",
        "attrs",
      ]);
      if (sldClrMapOvr !== undefined) {
        clrMapOvr = sldClrMapOvr;
      } else {
        clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
      }
    }
    const phClr = getSolidFill(bgRef, clrMapOvr, undefined, warpObj);
    const idx = Number(bgRef["attrs"]["idx"]);

    if (idx === 0 || idx === 1000) {
      // no background
    } else if (idx > 0 && idx < 1000) {
      // fillStyleLst in themeContent
    } else if (idx > 1000) {
      // bgFillStyleLst in themeContent
      const trueIdx = idx - 1000;
      const bgFillLst =
        warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:bgFillStyleLst"];
      const sortblAry: any[] = [];

      Object.keys(bgFillLst).forEach(function (key) {
        const bgFillLstTyp = bgFillLst[key];
        if (key !== "attrs") {
          if (bgFillLstTyp.constructor === Array) {
            for (let i = 0; i < bgFillLstTyp.length; i++) {
              const obj: any = {};
              obj[key] = bgFillLstTyp[i];
              obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
              obj["attrs"] = { order: bgFillLstTyp[i]["attrs"]["order"] };
              sortblAry.push(obj);
            }
          } else {
            const obj: any = {};
            obj[key] = bgFillLstTyp;
            obj["idex"] = bgFillLstTyp["attrs"]["order"];
            obj["attrs"] = { order: bgFillLstTyp["attrs"]["order"] };
            sortblAry.push(obj);
          }
        }
      });

      const sortByOrder = sortblAry.slice(0);
      sortByOrder.sort(function (a: any, b: any) {
        return a.idex - b.idex;
      });

      const bgFillLstIdx = sortByOrder[trueIdx - 1];
      const bgFillTyp = getFillType(bgFillLstIdx);

      if (bgFillTyp === "SOLID_FILL") {
        const sldFill = bgFillLstIdx["a:solidFill"];
        const sldBgClr = getSolidFill(sldFill, clrMapOvr, undefined, warpObj);
        bgcolor = "background: #" + sldBgClr + ";";
      } else if (bgFillTyp === "GRADIENT_FILL") {
        bgcolor = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
      } else {
        console.log(bgFillTyp);
      }
    }
  } else {
    // Check slideLayout
    bgPr = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:cSld", "p:bg", "p:bgPr"]);
    bgRef = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:cSld", "p:bg", "p:bgRef"]);

    let clrMapOvr;
    const sldClrMapOvr = getTextByPathList(slideLayoutContent, [
      "p:sldLayout",
      "p:clrMapOvr",
      "a:overrideClrMapping",
      "attrs",
    ]);
    if (sldClrMapOvr !== undefined) {
      clrMapOvr = sldClrMapOvr;
    } else {
      clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
    }

    if (bgPr !== undefined) {
      const bgFillTyp = getFillType(bgPr);
      if (bgFillTyp === "SOLID_FILL") {
        const sldFill = bgPr["a:solidFill"];
        const sldBgClr = getSolidFill(sldFill, clrMapOvr, undefined, warpObj);
        bgcolor = "background: #" + sldBgClr + ";";
      } else if (bgFillTyp === "GRADIENT_FILL") {
        bgcolor = getBgGradientFill(bgPr, undefined, slideMasterContent, warpObj);
      } else if (bgFillTyp === "PIC_FILL") {
        bgcolor = await getBgPicFill(bgPr, "slideLayoutBg", warpObj, undefined, index);
      }
    } else if (bgRef !== undefined) {
      console.log("slideLayoutContent: bgRef", bgRef);
      const phClr = getSolidFill(bgRef, clrMapOvr, undefined, warpObj);
      const idx = Number(bgRef["attrs"]["idx"]);

      if (idx === 0 || idx === 1000) {
        // no background
      } else if (idx > 0 && idx < 1000) {
        // fillStyleLst in themeContent
      } else if (idx > 1000) {
        // bgFillStyleLst in themeContent
        const trueIdx = idx - 1000;
        const bgFillLst =
          warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:bgFillStyleLst"];
        const sortblAry: any[] = [];

        Object.keys(bgFillLst).forEach(function (key) {
          const bgFillLstTyp = bgFillLst[key];
          if (key !== "attrs") {
            if (bgFillLstTyp.constructor === Array) {
              for (let i = 0; i < bgFillLstTyp.length; i++) {
                const obj: any = {};
                obj[key] = bgFillLstTyp[i];
                obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
                obj["attrs"] = { order: bgFillLstTyp[i]["attrs"]["order"] };
                sortblAry.push(obj);
              }
            } else {
              const obj: any = {};
              obj[key] = bgFillLstTyp;
              obj["idex"] = bgFillLstTyp["attrs"]["order"];
              obj["attrs"] = { order: bgFillLstTyp["attrs"]["order"] };
              sortblAry.push(obj);
            }
          }
        });

        const sortByOrder = sortblAry.slice(0);
        sortByOrder.sort(function (a: any, b: any) {
          return a.idex - b.idex;
        });

        const bgFillLstIdx = sortByOrder[trueIdx - 1];
        const bgFillTyp = getFillType(bgFillLstIdx);

        if (bgFillTyp === "SOLID_FILL") {
          const sldFill = bgFillLstIdx["a:solidFill"];
          const sldBgClr = getSolidFill(sldFill, clrMapOvr, phClr, warpObj);
          bgcolor = "background: #" + sldBgClr + ";";
        } else if (bgFillTyp === "GRADIENT_FILL") {
          bgcolor = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
        } else if (bgFillTyp === "PIC_FILL") {
          bgcolor = await getBgPicFill(bgFillLstIdx, "themeBg", warpObj, phClr, index);
        } else {
          console.log(bgFillTyp);
        }
      }
    } else {
      // Check slideMaster
      bgPr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:cSld", "p:bg", "p:bgPr"]);
      bgRef = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:cSld", "p:bg", "p:bgRef"]);

      const clrMap = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);

      if (bgPr !== undefined) {
        const bgFillTyp = getFillType(bgPr);
        if (bgFillTyp === "SOLID_FILL") {
          const sldFill = bgPr["a:solidFill"];
          const sldBgClr = getSolidFill(sldFill, clrMap, undefined, warpObj);
          bgcolor = "background: #" + sldBgClr + ";";
        } else if (bgFillTyp === "GRADIENT_FILL") {
          bgcolor = getBgGradientFill(bgPr, undefined, slideMasterContent, warpObj);
        } else if (bgFillTyp === "PIC_FILL") {
          bgcolor = await getBgPicFill(bgPr, "slideMasterBg", warpObj, undefined, index);
        }
      } else if (bgRef !== undefined) {
        const phClr = getSolidFill(bgRef, clrMap, undefined, warpObj);
        const idx = Number(bgRef["attrs"]["idx"]);

        if (idx === 0 || idx === 1000) {
          // no background
        } else if (idx > 0 && idx < 1000) {
          // fillStyleLst in themeContent
        } else if (idx > 1000) {
          // bgFillStyleLst in themeContent
          const trueIdx = idx - 1000;
          const bgFillLst =
            warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"][
              "a:bgFillStyleLst"
            ];
          const sortblAry: any[] = [];

          Object.keys(bgFillLst).forEach(function (key) {
            const bgFillLstTyp = bgFillLst[key];
            if (key !== "attrs") {
              if (bgFillLstTyp.constructor === Array) {
                for (let i = 0; i < bgFillLstTyp.length; i++) {
                  const obj: any = {};
                  obj[key] = bgFillLstTyp[i];
                  obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
                  obj["attrs"] = { order: bgFillLstTyp[i]["attrs"]["order"] };
                  sortblAry.push(obj);
                }
              } else {
                const obj: any = {};
                obj[key] = bgFillLstTyp;
                obj["idex"] = bgFillLstTyp["attrs"]["order"];
                obj["attrs"] = { order: bgFillLstTyp["attrs"]["order"] };
                sortblAry.push(obj);
              }
            }
          });

          const sortByOrder = sortblAry.slice(0);
          sortByOrder.sort(function (a: any, b: any) {
            return a.idex - b.idex;
          });

          const bgFillLstIdx = sortByOrder[trueIdx - 1];
          const bgFillTyp = getFillType(bgFillLstIdx);

          if (bgFillTyp === "SOLID_FILL") {
            const sldFill = bgFillLstIdx["a:solidFill"];
            const sldBgClr = getSolidFill(sldFill, clrMap, phClr, warpObj);
            bgcolor = "background: #" + sldBgClr + ";";
          } else if (bgFillTyp === "GRADIENT_FILL") {
            bgcolor = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
          } else if (bgFillTyp === "PIC_FILL") {
            bgcolor = await getBgPicFill(bgFillLstIdx, "themeBg", warpObj, phClr, index);
          } else {
            console.log(bgFillTyp);
          }
        }
      }
    }
  }

  return bgcolor;
}
