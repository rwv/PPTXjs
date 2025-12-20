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

export function getSlideBackgroundFill(warpObj: any, index: any): string | undefined {
  var slideContent = warpObj["slideContent"];
  var slideLayoutContent = warpObj["slideLayoutContent"];
  var slideMasterContent = warpObj["slideMasterContent"];

  var bgPr = getTextByPathList(slideContent, ["p:sld", "p:cSld", "p:bg", "p:bgPr"]);
  var bgRef = getTextByPathList(slideContent, ["p:sld", "p:cSld", "p:bg", "p:bgRef"]);
  var bgcolor: string | undefined;

  if (bgPr !== undefined) {
    var bgFillTyp = getFillType(bgPr);

    if (bgFillTyp == "SOLID_FILL") {
      var sldFill = bgPr["a:solidFill"];
      var clrMapOvr;
      var sldClrMapOvr = getTextByPathList(slideContent, ["p:sld", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
      if (sldClrMapOvr !== undefined) {
        clrMapOvr = sldClrMapOvr;
      } else {
        sldClrMapOvr = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
        if (sldClrMapOvr !== undefined) {
          clrMapOvr = sldClrMapOvr;
        } else {
          clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
        }
      }
      var sldBgClr = getSolidFill(sldFill, clrMapOvr, undefined, warpObj);
      bgcolor = "background: #" + sldBgClr + ";";
    } else if (bgFillTyp == "GRADIENT_FILL") {
      bgcolor = getBgGradientFill(bgPr, undefined, slideMasterContent, warpObj);
    } else if (bgFillTyp == "PIC_FILL") {
      bgcolor = getBgPicFill(bgPr, "slideBg", warpObj, undefined, index);
    }
  } else if (bgRef !== undefined) {
    var clrMapOvr;
    var sldClrMapOvr = getTextByPathList(slideContent, ["p:sld", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
    if (sldClrMapOvr !== undefined) {
      clrMapOvr = sldClrMapOvr;
    } else {
      sldClrMapOvr = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
      if (sldClrMapOvr !== undefined) {
        clrMapOvr = sldClrMapOvr;
      } else {
        clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
      }
    }
    var phClr = getSolidFill(bgRef, clrMapOvr, undefined, warpObj);
    var idx = Number(bgRef["attrs"]["idx"]);

    if (idx == 0 || idx == 1000) {
      // no background
    } else if (idx > 0 && idx < 1000) {
      // fillStyleLst in themeContent
    } else if (idx > 1000) {
      // bgFillStyleLst in themeContent
      var trueIdx = idx - 1000;
      var bgFillLst = warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:bgFillStyleLst"];
      var sortblAry: any[] = [];

      Object.keys(bgFillLst).forEach(function (key) {
        var bgFillLstTyp = bgFillLst[key];
        if (key != "attrs") {
          if (bgFillLstTyp.constructor === Array) {
            for (var i = 0; i < bgFillLstTyp.length; i++) {
              var obj: any = {};
              obj[key] = bgFillLstTyp[i];
              obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
              obj["attrs"] = { "order": bgFillLstTyp[i]["attrs"]["order"] };
              sortblAry.push(obj);
            }
          } else {
            var obj: any = {};
            obj[key] = bgFillLstTyp;
            obj["idex"] = bgFillLstTyp["attrs"]["order"];
            obj["attrs"] = { "order": bgFillLstTyp["attrs"]["order"] };
            sortblAry.push(obj);
          }
        }
      });

      var sortByOrder = sortblAry.slice(0);
      sortByOrder.sort(function (a: any, b: any) {
        return a.idex - b.idex;
      });

      var bgFillLstIdx = sortByOrder[trueIdx - 1];
      var bgFillTyp = getFillType(bgFillLstIdx);

      if (bgFillTyp == "SOLID_FILL") {
        var sldFill = bgFillLstIdx["a:solidFill"];
        var sldBgClr = getSolidFill(sldFill, clrMapOvr, undefined, warpObj);
        bgcolor = "background: #" + sldBgClr + ";";
      } else if (bgFillTyp == "GRADIENT_FILL") {
        bgcolor = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
      } else {
        console.log(bgFillTyp);
      }
    }
  } else {
    // Check slideLayout
    bgPr = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:cSld", "p:bg", "p:bgPr"]);
    bgRef = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:cSld", "p:bg", "p:bgRef"]);

    var clrMapOvr;
    var sldClrMapOvr = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping", "attrs"]);
    if (sldClrMapOvr !== undefined) {
      clrMapOvr = sldClrMapOvr;
    } else {
      clrMapOvr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);
    }

    if (bgPr !== undefined) {
      var bgFillTyp = getFillType(bgPr);
      if (bgFillTyp == "SOLID_FILL") {
        var sldFill = bgPr["a:solidFill"];
        var sldBgClr = getSolidFill(sldFill, clrMapOvr, undefined, warpObj);
        bgcolor = "background: #" + sldBgClr + ";";
      } else if (bgFillTyp == "GRADIENT_FILL") {
        bgcolor = getBgGradientFill(bgPr, undefined, slideMasterContent, warpObj);
      } else if (bgFillTyp == "PIC_FILL") {
        bgcolor = getBgPicFill(bgPr, "slideLayoutBg", warpObj, undefined, index);
      }
    } else if (bgRef !== undefined) {
      console.log("slideLayoutContent: bgRef", bgRef);
      var phClr = getSolidFill(bgRef, clrMapOvr, undefined, warpObj);
      var idx = Number(bgRef["attrs"]["idx"]);

      if (idx == 0 || idx == 1000) {
        // no background
      } else if (idx > 0 && idx < 1000) {
        // fillStyleLst in themeContent
      } else if (idx > 1000) {
        // bgFillStyleLst in themeContent
        var trueIdx = idx - 1000;
        var bgFillLst = warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:bgFillStyleLst"];
        var sortblAry: any[] = [];

        Object.keys(bgFillLst).forEach(function (key) {
          var bgFillLstTyp = bgFillLst[key];
          if (key != "attrs") {
            if (bgFillLstTyp.constructor === Array) {
              for (var i = 0; i < bgFillLstTyp.length; i++) {
                var obj: any = {};
                obj[key] = bgFillLstTyp[i];
                obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
                obj["attrs"] = { "order": bgFillLstTyp[i]["attrs"]["order"] };
                sortblAry.push(obj);
              }
            } else {
              var obj: any = {};
              obj[key] = bgFillLstTyp;
              obj["idex"] = bgFillLstTyp["attrs"]["order"];
              obj["attrs"] = { "order": bgFillLstTyp["attrs"]["order"] };
              sortblAry.push(obj);
            }
          }
        });

        var sortByOrder = sortblAry.slice(0);
        sortByOrder.sort(function (a: any, b: any) {
          return a.idex - b.idex;
        });

        var bgFillLstIdx = sortByOrder[trueIdx - 1];
        var bgFillTyp = getFillType(bgFillLstIdx);

        if (bgFillTyp == "SOLID_FILL") {
          var sldFill = bgFillLstIdx["a:solidFill"];
          var sldBgClr = getSolidFill(sldFill, clrMapOvr, phClr, warpObj);
          bgcolor = "background: #" + sldBgClr + ";";
        } else if (bgFillTyp == "GRADIENT_FILL") {
          bgcolor = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
        } else if (bgFillTyp == "PIC_FILL") {
          bgcolor = getBgPicFill(bgFillLstIdx, "themeBg", warpObj, phClr, index);
        } else {
          console.log(bgFillTyp);
        }
      }
    } else {
      // Check slideMaster
      bgPr = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:cSld", "p:bg", "p:bgPr"]);
      bgRef = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:cSld", "p:bg", "p:bgRef"]);

      var clrMap = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:clrMap", "attrs"]);

      if (bgPr !== undefined) {
        var bgFillTyp = getFillType(bgPr);
        if (bgFillTyp == "SOLID_FILL") {
          var sldFill = bgPr["a:solidFill"];
          var sldBgClr = getSolidFill(sldFill, clrMap, undefined, warpObj);
          bgcolor = "background: #" + sldBgClr + ";";
        } else if (bgFillTyp == "GRADIENT_FILL") {
          bgcolor = getBgGradientFill(bgPr, undefined, slideMasterContent, warpObj);
        } else if (bgFillTyp == "PIC_FILL") {
          bgcolor = getBgPicFill(bgPr, "slideMasterBg", warpObj, undefined, index);
        }
      } else if (bgRef !== undefined) {
        var phClr = getSolidFill(bgRef, clrMap, undefined, warpObj);
        var idx = Number(bgRef["attrs"]["idx"]);

        if (idx == 0 || idx == 1000) {
          // no background
        } else if (idx > 0 && idx < 1000) {
          // fillStyleLst in themeContent
        } else if (idx > 1000) {
          // bgFillStyleLst in themeContent
          var trueIdx = idx - 1000;
          var bgFillLst = warpObj["themeContent"]["a:theme"]["a:themeElements"]["a:fmtScheme"]["a:bgFillStyleLst"];
          var sortblAry: any[] = [];

          Object.keys(bgFillLst).forEach(function (key) {
            var bgFillLstTyp = bgFillLst[key];
            if (key != "attrs") {
              if (bgFillLstTyp.constructor === Array) {
                for (var i = 0; i < bgFillLstTyp.length; i++) {
                  var obj: any = {};
                  obj[key] = bgFillLstTyp[i];
                  obj["idex"] = bgFillLstTyp[i]["attrs"]["order"];
                  obj["attrs"] = { "order": bgFillLstTyp[i]["attrs"]["order"] };
                  sortblAry.push(obj);
                }
              } else {
                var obj: any = {};
                obj[key] = bgFillLstTyp;
                obj["idex"] = bgFillLstTyp["attrs"]["order"];
                obj["attrs"] = { "order": bgFillLstTyp["attrs"]["order"] };
                sortblAry.push(obj);
              }
            }
          });

          var sortByOrder = sortblAry.slice(0);
          sortByOrder.sort(function (a: any, b: any) {
            return a.idex - b.idex;
          });

          var bgFillLstIdx = sortByOrder[trueIdx - 1];
          var bgFillTyp = getFillType(bgFillLstIdx);

          if (bgFillTyp == "SOLID_FILL") {
            var sldFill = bgFillLstIdx["a:solidFill"];
            var sldBgClr = getSolidFill(sldFill, clrMap, phClr, warpObj);
            bgcolor = "background: #" + sldBgClr + ";";
          } else if (bgFillTyp == "GRADIENT_FILL") {
            bgcolor = getBgGradientFill(bgFillLstIdx, phClr, slideMasterContent, warpObj);
          } else if (bgFillTyp == "PIC_FILL") {
            bgcolor = getBgPicFill(bgFillLstIdx, "themeBg", warpObj, phClr, index);
          } else {
            console.log(bgFillTyp);
          }
        }
      }
    }
  }

  return bgcolor;
}
