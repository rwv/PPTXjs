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
import type { RenderSettings } from "../../types/pptx-settings";
import type { StyleTable } from "../../types/style";
import { base64ArrayBuffer } from "../media";
import { getContentTypes, getSlideSizeAndSetDefaultTextStyle, readXmlFile } from "../xml";
import { processSingleSlide } from "../slide";
import { genGlobalCSS } from "../css";

type ProcessPptxOptions = {
  archive: PptxArchive;
  emuToPx: number;
  settings: RenderSettings;
  styleTable: StyleTable;
  rtlLanguages: string[];
  fontSizeScale: number;
  chartIdCounter: { value: number };
  messageQueue: Array<{ data: unknown; type?: string }>;
  firstLineBreak: { value: boolean };
};

type SlideSizeResult = Awaited<ReturnType<typeof getSlideSizeAndSetDefaultTextStyle>>;

type PptxResultItem =
  | { type: "pptx-thumb"; data: string; slide_num: number }
  | { type: "slideSize"; data: SlideSizeResult; slide_num: number }
  | { type: "slide"; data: string; slide_num: number; file_name: string }
  | { type: "progress-update"; data: number; slide_num: number }
  | { type: "globalCSS"; data: string }
  | { type: "ExecutionTime"; data: number };

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
}: ProcessPptxOptions): Promise<PptxResultItem[]> {
  const resultItems: PptxResultItem[] = [];
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
  const slidePaths = Array.isArray(contentTypes.slides) ? contentTypes.slides : [];
  const slideSize = await getSlideSizeAndSetDefaultTextStyle({
    archive,
    slideFactor: emuToPx,
    settings,
  });
  const defaultTextStyle = slideSize.defaultTextStyle;
  const slideWidth = slideSize.width;
  const tableStylesContent = await readXmlFile({ archive, filename: "ppt/tableStyles.xml" });
  const tableStyles =
    tableStylesContent && typeof tableStylesContent === "object"
      ? (tableStylesContent as Record<string, unknown>)
      : null;
  //console.log("slideSize: ", slideSize)
  resultItems.push({
    type: "slideSize",
    data: slideSize,
    slide_num: 0,
  });

  const slideCount = slidePaths.length;
  for (let slideIndex = 0; slideIndex < slideCount; slideIndex += 1) {
    const slidePath = slidePaths[slideIndex];
    const slideFilename = slidePath.split("/").pop() ?? slidePath;
    const slideBasename = slideFilename.replace(/\.[^.]+$/, "");
    // PPTX slide names are typically slide1.xml; fall back to the index if parsing fails.
    const slideMatch = /slide(\d+)/i.exec(slideBasename);
    const parsedSlideNumber =
      slideMatch && slideMatch[1] ? Number.parseInt(slideMatch[1], 10) : Number.NaN;
    const slideNumber = Number.isFinite(parsedSlideNumber) ? parsedSlideNumber : slideIndex + 1;
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

  const getSlideNum = (item: PptxResultItem): number => ("slide_num" in item ? item.slide_num : 0);
  resultItems.sort((a, b) => getSlideNum(a) - getSlideNum(b));

  resultItems.push({
    type: "globalCSS",
    data: genGlobalCSS({ styleTable, settings, slideWidth }),
  });

  const endTime = new Date();
  resultItems.push({
    type: "ExecutionTime",
    data: endTime.getTime() - startTime.getTime(),
  });
  return resultItems;
}
