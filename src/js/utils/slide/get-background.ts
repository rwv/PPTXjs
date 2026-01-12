import { getTextByPathList } from "../object";
import { getSlideBackgroundFill } from "../fill";
import { processNodesInSlide } from "../node";
import type { WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

function asXmlNodeArray(value: XmlValue | undefined): XmlNode[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(isXmlNode);
  }
  return isXmlNode(value) ? [value] : [];
}

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
 * @param firstLineBreak - Object {value: boolean} for line break state
 * @param styleTable - CSS style table
 * @param rtlLanguages - RTL language codes
 * @param emuToPx - EMU to pixel conversion factor
 * @param fontSizeScale - Font size scaling factor
 * @param chartIdCounter - Chart ID counter
 * @param messageQueue - Message queue for chart processing
 * @param renderSettings - Plugin settings
 * @returns HTML string for slide background
 */
type GetBackgroundOptions = {
  warpContext: WarpContext;
  slideDimensions: { width: number; height: number };
  slideIndex: number;
  tableStyles: unknown;
  firstLineBreak: { value: boolean };
  styleTable: unknown;
  rtlLanguages: string[];
  emuToPx: number;
  fontSizeScale: number;
  chartIdCounter: { value: number };
  messageQueue: unknown;
  renderSettings: { mediaProcess: boolean } & Record<string, unknown>;
};

export async function getBackground({
  warpContext,
  slideDimensions,
  slideIndex,
  tableStyles,
  firstLineBreak,
  styleTable,
  rtlLanguages,
  emuToPx,
  fontSizeScale,
  chartIdCounter,
  messageQueue,
  renderSettings,
}: GetBackgroundOptions): Promise<string> {
  //var rslt = "";
  const slideLayoutContent = warpContext.slideLayoutContent;
  const slideMasterContent = warpContext.slideMasterContent;

  const layoutShapeTree = slideLayoutContent
    ? asXmlNode(
        getTextByPathList({
          node: slideLayoutContent,
          path: ["p:sldLayout", "p:cSld", "p:spTree"],
        })
      )
    : undefined;
  const masterShapeTree = slideMasterContent
    ? asXmlNode(
        getTextByPathList({
          node: slideMasterContent,
          path: ["p:sldMaster", "p:cSld", "p:spTree"],
        })
      )
    : undefined;
  // console.log("slideContent : ", slideContent)
  // console.log("slideLayoutContent : ", slideLayoutContent)
  // console.log("slideMasterContent : ", slideMasterContent)
  //console.log("warpContext : ", warpContext)
  const showMasterShapes = slideLayoutContent
    ? getTextByPathList<string | number>({
        node: slideLayoutContent,
        path: ["p:sldLayout", "attrs", "showMasterSp"],
      })
    : undefined;
  //console.log("slideLayoutContent : ", slideLayoutContent, ", showMasterSp: ", showMasterShapes)
  const backgroundCss = await getSlideBackgroundFill({ warpContext });
  let backgroundHtml =
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
    for (const shapeNodeKey in layoutShapeTree) {
      const shapeNodes = asXmlNodeArray(layoutShapeTree[shapeNodeKey]);
      for (const shapeNode of shapeNodes) {
        const placeholderType = getTextByPathList<string>({
          node: shapeNode,
          path: ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"],
        });
        // if (phType !== undefined && phType !== "pic") {
        //     _nodePhTypeAry.push(phType);
        // }
        if (placeholderType !== "pic") {
          backgroundHtml += await processNodesInSlide({
            nodeType: shapeNodeKey,
            nodeData: shapeNode,
            parentNodes: layoutShapeTree,
            warpContext,
            sourceType: "slideLayoutBg",
            shapeType: undefined,
            tableStyles,
            firstLineBreak,
            styleTable,
            rtlLanguages,
            emuToPx,
            fontSizeScale,
            chartIdCounter,
            messageQueue,
            renderSettings,
          }); //slideLayoutBg , slideMasterBg
        }
      }
    }
  }
  if (
    masterShapeTree !== undefined &&
    (showMasterShapes === "1" || showMasterShapes === undefined)
  ) {
    for (const shapeNodeKey in masterShapeTree) {
      const shapeNodes = asXmlNodeArray(masterShapeTree[shapeNodeKey]);
      for (const shapeNode of shapeNodes) {
        void getTextByPathList({
          node: shapeNode,
          path: ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"],
        });
        //if (_nodePhTypeAry.indexOf(_phType) > -1) {
        backgroundHtml += await processNodesInSlide({
          nodeType: shapeNodeKey,
          nodeData: shapeNode,
          parentNodes: masterShapeTree,
          warpContext,
          sourceType: "slideMasterBg",
          shapeType: undefined,
          tableStyles,
          firstLineBreak,
          styleTable,
          rtlLanguages,
          emuToPx,
          fontSizeScale,
          chartIdCounter,
          messageQueue,
          renderSettings,
        }); //slideLayoutBg , slideMasterBg
        //}
      }
    }
  }
  return backgroundHtml;
}
