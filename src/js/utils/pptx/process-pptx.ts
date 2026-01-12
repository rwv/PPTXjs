/**
 * Process PPTX file and generate array of slide data and metadata
 *
 * This function:
 * 1. Extracts PPTX thumbnail
 * 2. Reads content types and slide size information
 * 3. Processes each slide using processSingleSlide
 * 4. Generates global CSS
 * 5. Returns array containing slides, styles, and metadata
 *
 * The returned array contains objects with types:
 * - "pptx-thumb": Thumbnail image data
 * - "slideSize": Slide dimensions
 * - "slide": HTML for each slide
 * - "globalCSS": Generated CSS styles
 * - "ExecutionTime": Processing duration
 * - "progress-update": Progress percentage
 *
 * @param archive - PPTX archive instance
 * @param emuToPx - EMU to pixel conversion factor
 * @param settings - Plugin settings
 * @param styleTable - Global CSS style table (modified in place)
 * @param rtlLanguages - Array of RTL language codes
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter (modified in place)
 * @param messageQueue - Message queue for chart processing
 * @param firstLineBreak - Mutable object tracking first line break state
 * @returns Array of objects containing slides and metadata
 */

import type { PptxArchive } from "../../archive/pptx-archive";
import { base64ArrayBuffer } from "../media";
import { getContentTypes, getSlideSizeAndSetDefaultTextStyle, readXmlFile } from "../xml";
import { processSingleSlide } from "../slide";
import { genGlobalCSS } from "../css";

type ProcessPptxOptions = {
  archive: PptxArchive;
  emuToPx: number;
  settings: any;
  styleTable: any;
  rtlLanguages: string[];
  fontSizeScale: number;
  chartIdCounter: { value: number };
  messageQueue: any;
  firstLineBreak: { value: boolean };
};

export async function processPPTX({
  archive,
  emuToPx,
  settings,
  styleTable,
  rtlLanguages,
  fontSizeScale,
  chartIdCounter,
  messageQueue,
  firstLineBreak,
}: ProcessPptxOptions): Promise<any[]> {
  const resultItems = [];
  const startTime = new Date();

  const thumbFile = await archive.file("docProps/thumbnail.jpeg");
  if (thumbFile) {
    const pptxThumbImg = base64ArrayBuffer({ arrayBuffer: await thumbFile.arrayBuffer() });
    resultItems.push({
      type: "pptx-thumb",
      data: pptxThumbImg,
      slide_num: -1,
    });
  }

  const contentTypes = await getContentTypes({ archive });
  const slideSize = await getSlideSizeAndSetDefaultTextStyle({
    archive,
    slideFactor: emuToPx,
    settings,
  });
  const defaultTextStyle = slideSize.defaultTextStyle;
  const slideWidth = slideSize.width;
  const tableStyles = await readXmlFile({ archive, filename: "ppt/tableStyles.xml" });
  //console.log("slideSize: ", slideSize)
  resultItems.push({
    type: "slideSize",
    data: slideSize,
    slide_num: 0,
  });

  const slideCount = contentTypes["slides"].length;
  for (let slideIndex = 0; slideIndex < slideCount; slideIndex += 1) {
    const slidePath = contentTypes["slides"][slideIndex];
    let slideFilename = "";
    let slideFilenameParts: string[] = [];
    if (slidePath.indexOf("/") !== -1) {
      slideFilenameParts = slidePath.split("/");
      slideFilename = slideFilenameParts.pop() ?? "";
    } else {
      slideFilename = slidePath;
    }
    let slideBasename = "";
    if (slideFilename.indexOf(".") !== -1) {
      const slideBasenameParts = slideFilename.split(".");
      slideBasenameParts.pop();
      slideBasename = slideBasenameParts.join(".");
    }
    let slideNumber = 1;
    if (slideBasename !== "" && slideFilename.indexOf("slide") !== -1) {
      slideNumber = Number(slideBasename.substr(5));
    }
    const slideHtml = await processSingleSlide({
      archive,
      slideFilePath: slidePath,
      slideIndex,
      slideDimensions: slideSize,
      defaultTextStyle,
      tableStyles,
      firstLineBreak,
      styleTable,
      rtlLanguages,
      emuToPx,
      fontSizeScale,
      chartId: chartIdCounter,
      messageQueue,
      settings,
    });
    resultItems.push({
      type: "slide",
      data: slideHtml,
      slide_num: slideNumber,
      file_name: slideBasename,
    });
    resultItems.push({
      type: "progress-update",
      slide_num: slideCount + slideIndex + 1,
      data: ((slideIndex + 1) * 100) / slideCount,
    });
  }

  resultItems.sort(function (a, b) {
    return a.slide_num - b.slide_num;
  });

  resultItems.push({
    type: "globalCSS",
    data: genGlobalCSS(styleTable, settings, slideWidth),
  });

  const endTime = new Date();
  resultItems.push({
    type: "ExecutionTime",
    data: endTime.getTime() - startTime.getTime(),
  });
  return resultItems;
}
