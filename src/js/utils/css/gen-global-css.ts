interface StyleTableEntry {
  name: string;
  suffix?: string;
  text: string;
}

interface GlobalSettings {
  slideMode?: boolean;
  slideType?: string;
}

/**
 * Generate global CSS text from style table
 *
 * @param styleTable - Style table object containing CSS class definitions
 * @param settings - Settings object containing slideMode and slideType
 * @param slideWidth - Width of slides in pixels
 * @returns CSS text string
 */
export function genGlobalCSS(
  styleTable: Record<string, StyleTableEntry>,
  settings: GlobalSettings,
  slideWidth: number
): string {
  let cssText = "";
  //console.log("styleTable: ", styleTable)
  for (const key in styleTable) {
    const tagname = "";
    // if (settings.slideMode && settings.slideType == "revealjs") {
    //     tagname = "section";
    // } else {
    //     tagname = "div";
    // }
    //ADD suffix
    cssText +=
      tagname +
      " ." +
      styleTable[key]["name"] +
      (styleTable[key]["suffix"] ? styleTable[key]["suffix"] : "") +
      "{" +
      styleTable[key]["text"] +
      "}\n"; //section > div
  }
  //cssText += " .slide{margin-bottom: 5px;}\n"; // TODO

  if (settings.slideMode && settings.slideType === "divs2slidesjs") {
    //divId
    //console.log("slideWidth: ", slideWidth)
    cssText +=
      "#all_slides_warpper{margin-right: auto;margin-left: auto;padding-top:10px;width: " +
      slideWidth +
      "px;}\n"; // TODO
  }
  return cssText;
}
