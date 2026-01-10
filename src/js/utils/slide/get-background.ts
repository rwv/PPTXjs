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
 * @param warpContext - Warp object containing slideContent, slideLayoutContent, slideMasterContent
 * @param slideDimensions - Slide dimensions {width, height}
 * @param slideIndex - Slide index for CSS class naming
 * @param tableStyles - Table styles from presentation
 * @param isFirstLineBreak - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLanguages - RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter
 * @param messageQueue - Message queue for chart processing
 * @param renderSettings - Plugin settings
 * @returns HTML string for slide background
 */
export async function getBackground(
  warpContext: any,
  slideDimensions: { width: number; height: number },
  slideIndex: number,
  tableStyles: any,
  isFirstLineBreak: { value: boolean },
  styleTable: any,
  rtlLanguages: string[],
  emuToPx: number,
  fontSizeScale: number,
  chartIdCounter: { value: number },
  messageQueue: any,
  renderSettings: any
): Promise<string> {
  //var rslt = "";
  const slideLayoutContent = warpContext["slideLayoutContent"];
  const slideMasterContent = warpContext["slideMasterContent"];

  const layoutShapeTree = getTextByPathList(slideLayoutContent, [
    "p:sldLayout",
    "p:cSld",
    "p:spTree",
  ]);
  const masterShapeTree = getTextByPathList(slideMasterContent, [
    "p:sldMaster",
    "p:cSld",
    "p:spTree",
  ]);
  // console.log("slideContent : ", slideContent)
  // console.log("slideLayoutContent : ", slideLayoutContent)
  // console.log("slideMasterContent : ", slideMasterContent)
  //console.log("warpContext : ", warpContext)
  const showMasterSp = getTextByPathList(slideLayoutContent, [
    "p:sldLayout",
    "attrs",
    "showMasterSp",
  ]);
  //console.log("slideLayoutContent : ", slideLayoutContent, ", showMasterSp: ", showMasterSp)
  const backgroundCss = await getSlideBackgroundFill(warpContext, slideIndex);
  let htmlOutput =
    "<div class='slide-background-" +
    slideIndex +
    "' style='width:" +
    slideDimensions.width +
    "px; height:" +
    slideDimensions.height +
    "px;" +
    backgroundCss +
    "'>";
  if (layoutShapeTree !== undefined) {
    for (const nodeKey in layoutShapeTree) {
      if (layoutShapeTree[nodeKey].constructor === Array) {
        for (let i = 0; i < layoutShapeTree[nodeKey].length; i++) {
          const placeholderType = getTextByPathList(layoutShapeTree[nodeKey][i], [
            "p:nvSpPr",
            "p:nvPr",
            "p:ph",
            "attrs",
            "type",
          ]);
          // if (phType !== undefined && phType !== "pic") {
          //     _nodePhTypeAry.push(phType);
          // }
          if (placeholderType !== "pic") {
            htmlOutput += await processNodesInSlide(
              nodeKey,
              layoutShapeTree[nodeKey][i],
              layoutShapeTree,
              warpContext,
              "slideLayoutBg",
              undefined,
              tableStyles,
              isFirstLineBreak,
              styleTable,
              rtlLanguages,
              emuToPx,
              fontSizeScale,
              chartIdCounter,
              messageQueue,
              renderSettings
            ); //slideLayoutBg , slideMasterBg
          }
        }
      } else {
        const placeholderType = getTextByPathList(layoutShapeTree[nodeKey], [
          "p:nvSpPr",
          "p:nvPr",
          "p:ph",
          "attrs",
          "type",
        ]);
        // if (phType !== undefined && phType !== "pic") {
        //     _nodePhTypeAry.push(phType);
        // }
        if (placeholderType !== "pic") {
          htmlOutput += await processNodesInSlide(
            nodeKey,
            layoutShapeTree[nodeKey],
            layoutShapeTree,
            warpContext,
            "slideLayoutBg",
            undefined,
            tableStyles,
            isFirstLineBreak,
            styleTable,
            rtlLanguages,
            emuToPx,
            fontSizeScale,
            chartIdCounter,
            messageQueue,
            renderSettings
          ); //slideLayoutBg, slideMasterBg
        }
      }
    }
  }
  if (masterShapeTree !== undefined && (showMasterSp === "1" || showMasterSp === undefined)) {
    for (const nodeKey in masterShapeTree) {
      if (masterShapeTree[nodeKey].constructor === Array) {
        for (let i = 0; i < masterShapeTree[nodeKey].length; i++) {
          void getTextByPathList(masterShapeTree[nodeKey][i], [
            "p:nvSpPr",
            "p:nvPr",
            "p:ph",
            "attrs",
            "type",
          ]);
          //if (_nodePhTypeAry.indexOf(_phType) > -1) {
          htmlOutput += await processNodesInSlide(
            nodeKey,
            masterShapeTree[nodeKey][i],
            masterShapeTree,
            warpContext,
            "slideMasterBg",
            undefined,
            tableStyles,
            isFirstLineBreak,
            styleTable,
            rtlLanguages,
            emuToPx,
            fontSizeScale,
            chartIdCounter,
            messageQueue,
            renderSettings
          ); //slideLayoutBg , slideMasterBg
          //}
        }
      } else {
        void getTextByPathList(masterShapeTree[nodeKey], [
          "p:nvSpPr",
          "p:nvPr",
          "p:ph",
          "attrs",
          "type",
        ]);
        //if (_nodePhTypeAry.indexOf(_phType) > -1) {
        htmlOutput += await processNodesInSlide(
          nodeKey,
          masterShapeTree[nodeKey],
          masterShapeTree,
          warpContext,
          "slideMasterBg",
          undefined,
          tableStyles,
          isFirstLineBreak,
          styleTable,
          rtlLanguages,
          emuToPx,
          fontSizeScale,
          chartIdCounter,
          messageQueue,
          renderSettings
        ); //slideLayoutBg, slideMasterBg
        //}
      }
    }
  }
  return htmlOutput;
}
