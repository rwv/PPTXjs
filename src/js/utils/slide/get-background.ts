import type { WarpObject, SlideFactor, FontSizeFactor } from "../../types";
import { getTextByPathList } from "../object";
import { getSlideBackgroundFill } from "../fill";
import { processNodesInSlide } from "../node";

/**
 * Generate slide background HTML from layout and master
 *
 * Processes background elements from slide layout and slide master,
 * creating HTML for shapes that should appear behind slide content.
 * Respects the showMasterSp attribute to control master visibility.
 *
 * This function:
 * - Extracts shape trees from slide layout and slide master
 * - Gets background fill color
 * - Processes layout background nodes (excluding pictures)
 * - Processes master background nodes if showMasterSp permits
 * - Returns wrapped HTML with background styling
 *
 * @param warpObj - Warp object containing slideContent, slideLayoutContent, slideMasterContent
 * @param slideSize - Slide dimensions {width, height}
 * @param index - Slide index for CSS class naming
 * @param tableStyles - Table styles from presentation
 * @param isFirstBr - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLangsArray - RTL language codes
 * @param slideFactor - EMU to pixel conversion factor
 * @param fontSizeFactor - Font size scaling factor
 * @param chartID - Chart ID counter
 * @param MsgQueue - Message queue for chart processing
 * @param settings - Plugin settings
 * @returns HTML string for slide background
 */
export function getBackground(
  warpObj: WarpObject,
  slideSize: { width: number; height: number },
  index: number,
  tableStyles: any,
  isFirstBr: { value: boolean },
  styleTable: any,
  rtlLangsArray: string[],
  slideFactor: SlideFactor,
  fontSizeFactor: FontSizeFactor,
  chartID: any,
  MsgQueue: any,
  settings: any
): string {
  //var rslt = "";
  const _slideContent = warpObj["slideContent"];
  const slideLayoutContent = warpObj["slideLayoutContent"];
  const slideMasterContent = warpObj["slideMasterContent"];

  const nodesSldLayout = getTextByPathList(slideLayoutContent, [
    "p:sldLayout",
    "p:cSld",
    "p:spTree",
  ]);
  const nodesSldMaster = getTextByPathList(slideMasterContent, [
    "p:sldMaster",
    "p:cSld",
    "p:spTree",
  ]);
  // console.log("slideContent : ", slideContent)
  // console.log("slideLayoutContent : ", slideLayoutContent)
  // console.log("slideMasterContent : ", slideMasterContent)
  //console.log("warpObj : ", warpObj)
  const showMasterSp = getTextByPathList(slideLayoutContent, [
    "p:sldLayout",
    "attrs",
    "showMasterSp",
  ]);
  //console.log("slideLayoutContent : ", slideLayoutContent, ", showMasterSp: ", showMasterSp)
  const bgColor = getSlideBackgroundFill(warpObj, index);
  let result =
    "<div class='slide-background-" +
    index +
    "' style='width:" +
    slideSize.width +
    "px; height:" +
    slideSize.height +
    "px;" +
    bgColor +
    "'>";
  const _node_ph_type_ary = [];
  if (nodesSldLayout !== undefined) {
    for (const nodeKey in nodesSldLayout) {
      if (nodesSldLayout[nodeKey].constructor === Array) {
        for (let i = 0; i < nodesSldLayout[nodeKey].length; i++) {
          const ph_type = getTextByPathList(nodesSldLayout[nodeKey][i], [
            "p:nvSpPr",
            "p:nvPr",
            "p:ph",
            "attrs",
            "type",
          ]);
          // if (ph_type !== undefined && ph_type !== "pic") {
          //     node_ph_type_ary.push(ph_type);
          // }
          if (ph_type !== "pic") {
            result += processNodesInSlide(
              nodeKey,
              nodesSldLayout[nodeKey][i],
              nodesSldLayout,
              warpObj,
              "slideLayoutBg",
              undefined,
              tableStyles,
              isFirstBr,
              styleTable,
              rtlLangsArray,
              slideFactor,
              fontSizeFactor,
              chartID,
              MsgQueue,
              settings
            ); //slideLayoutBg , slideMasterBg
          }
        }
      } else {
        const ph_type = getTextByPathList(nodesSldLayout[nodeKey], [
          "p:nvSpPr",
          "p:nvPr",
          "p:ph",
          "attrs",
          "type",
        ]);
        // if (ph_type !== undefined && ph_type !== "pic") {
        //     node_ph_type_ary.push(ph_type);
        // }
        if (ph_type !== "pic") {
          result += processNodesInSlide(
            nodeKey,
            nodesSldLayout[nodeKey],
            nodesSldLayout,
            warpObj,
            "slideLayoutBg",
            undefined,
            tableStyles,
            isFirstBr,
            styleTable,
            rtlLangsArray,
            slideFactor,
            fontSizeFactor,
            chartID,
            MsgQueue,
            settings
          ); //slideLayoutBg, slideMasterBg
        }
      }
    }
  }
  if (nodesSldMaster !== undefined && (showMasterSp === "1" || showMasterSp === undefined)) {
    for (const nodeKey in nodesSldMaster) {
      if (nodesSldMaster[nodeKey].constructor === Array) {
        for (let i = 0; i < nodesSldMaster[nodeKey].length; i++) {
          const _ph_type = getTextByPathList(nodesSldMaster[nodeKey][i], [
            "p:nvSpPr",
            "p:nvPr",
            "p:ph",
            "attrs",
            "type",
          ]);
          //if (node_ph_type_ary.indexOf(ph_type) > -1) {
          result += processNodesInSlide(
            nodeKey,
            nodesSldMaster[nodeKey][i],
            nodesSldMaster,
            warpObj,
            "slideMasterBg",
            undefined,
            tableStyles,
            isFirstBr,
            styleTable,
            rtlLangsArray,
            slideFactor,
            fontSizeFactor,
            chartID,
            MsgQueue,
            settings
          ); //slideLayoutBg , slideMasterBg
          //}
        }
      } else {
        const _ph_type = getTextByPathList(nodesSldMaster[nodeKey], [
          "p:nvSpPr",
          "p:nvPr",
          "p:ph",
          "attrs",
          "type",
        ]);
        //if (node_ph_type_ary.indexOf(ph_type) > -1) {
        result += processNodesInSlide(
          nodeKey,
          nodesSldMaster[nodeKey],
          nodesSldMaster,
          warpObj,
          "slideMasterBg",
          undefined,
          tableStyles,
          isFirstBr,
          styleTable,
          rtlLangsArray,
          slideFactor,
          fontSizeFactor,
          chartID,
          MsgQueue,
          settings
        ); //slideLayoutBg, slideMasterBg
        //}
      }
    }
  }
  return result;
}
