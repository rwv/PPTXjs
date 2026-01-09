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
 * @param slideFactor - EMU to pixel conversion factor
 * @param settings - Plugin settings
 * @param styleTable - Global CSS style table (modified in place)
 * @param rtlLangsArray - Array of RTL language codes
 * @param fontSizeFactor - Font size scaling factor
 * @param chartID - Chart ID counter (modified in place)
 * @param MsgQueue - Message queue for chart processing
 * @param isFirstBr - Mutable object tracking first line break state
 * @returns Array of objects containing slides and metadata
 */

import type { PptxArchive } from "../../archive/pptx-archive";
import { base64ArrayBuffer } from "../media";
import { getContentTypes, getSlideSizeAndSetDefaultTextStyle, readXmlFile } from "../xml";
import { processSingleSlide } from "../slide";
import { genGlobalCSS } from "../css";

export function processPPTX(
  archive: PptxArchive,
  slideFactor: number,
  settings: any,
  styleTable: any,
  rtlLangsArray: string[],
  fontSizeFactor: number,
  chartID: any,
  MsgQueue: any,
  isFirstBr: { value: boolean }
): any[] {
  const post_ary = [];
  const dateBefore = new Date();

  if (archive.hasFile("docProps/thumbnail.jpeg")) {
    const pptxThumbImg = base64ArrayBuffer(archive.readAsArrayBuffer("docProps/thumbnail.jpeg"));
    post_ary.push({
      type: "pptx-thumb",
      data: pptxThumbImg,
      slide_num: -1,
    });
  }

  const filesInfo = getContentTypes(archive);
  const slideSize = getSlideSizeAndSetDefaultTextStyle(archive, slideFactor, settings);
  const app_verssion = slideSize.appVersion;
  const defaultTextStyle = slideSize.defaultTextStyle;
  const slideWidth = slideSize.width;
  const _slideHeight = slideSize.height;
  const processFullTheme = settings.themeProcess;
  const tableStyles = readXmlFile(archive, "ppt/tableStyles.xml");
  //console.log("slideSize: ", slideSize)
  post_ary.push({
    type: "slideSize",
    data: slideSize,
    slide_num: 0,
  });

  const numOfSlides = filesInfo["slides"].length;
  for (let i = 0; i < numOfSlides; i++) {
    const filename = filesInfo["slides"][i];
    let filename_no_path = "";
    let filename_no_path_ary = [];
    if (filename.indexOf("/") !== -1) {
      filename_no_path_ary = filename.split("/");
      filename_no_path = filename_no_path_ary.pop();
    } else {
      filename_no_path = filename;
    }
    let filename_no_path_no_ext = "";
    if (filename_no_path.indexOf(".") !== -1) {
      const filename_no_path_no_ext_ary = filename_no_path.split(".");
      const _slide_ext = filename_no_path_no_ext_ary.pop();
      filename_no_path_no_ext = filename_no_path_no_ext_ary.join(".");
    }
    let slide_number = 1;
    if (filename_no_path_no_ext !== "" && filename_no_path.indexOf("slide") !== -1) {
      slide_number = Number(filename_no_path_no_ext.substr(5));
    }
    const slideHtml = processSingleSlide(
      archive,
      filename,
      i,
      slideSize,
      defaultTextStyle,
      app_verssion,
      processFullTheme,
      tableStyles,
      isFirstBr,
      styleTable,
      rtlLangsArray,
      slideFactor,
      fontSizeFactor,
      chartID,
      MsgQueue,
      settings
    );
    post_ary.push({
      type: "slide",
      data: slideHtml,
      slide_num: slide_number,
      file_name: filename_no_path_no_ext,
    });
    post_ary.push({
      type: "progress-update",
      slide_num: numOfSlides + i + 1,
      data: ((i + 1) * 100) / numOfSlides,
    });
  }

  post_ary.sort(function (a, b) {
    return a.slide_num - b.slide_num;
  });

  post_ary.push({
    type: "globalCSS",
    data: genGlobalCSS(styleTable, settings, slideWidth),
  });

  const dateAfter = new Date();
  post_ary.push({
    type: "ExecutionTime",
    // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
    data: dateAfter - dateBefore,
  });
  return post_ary;
}
