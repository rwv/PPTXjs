/**
 * Core shape rendering function that generates HTML/SVG for all PowerPoint shape types.
 *
 * Handles 300+ preset shape types including:
 * - Text boxes, titles, body text
 * - Basic shapes (rectangles, ellipses, lines)
 * - Flow chart shapes
 * - Arrows and callouts
 * - Complex custom geometry shapes
 *
 * @param node - Shape node from slide XML
 * @param pNode - Parent node
 * @param slideLayoutSpNode - Layout node for inheritance
 * @param slideMasterSpNode - Master node for inheritance
 * @param id - Shape ID
 * @param name - Shape name
 * @param idx - Shape index
 * @param type - Shape type (textBox, title, body, pic, etc.)
 * @param order - z-index ordering
 * @param warpContext - Object containing all slide resources (theme, relationships, etc.)
 * @param isUserDrawnBg - Whether this is a user-drawn background shape
 * @param sType - Shape type context
 * @param source - Source context (slide, layout, master)
 * @param emuToPx - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeScale - Font size scaling factor
 * @param rtlLanguages - Array of RTL language codes
 * @param firstLineBreak - Mutable object tracking first line break state
 * @returns HTML string with SVG shape
 */

import { getPosition, getSize, getVerticalAlign, getContentDir } from "../layout";
import { getShapeFill } from "../fill";
import { getBorder } from "../border";
import { genTextBody } from "../text";
import { renderCustomGeometry } from "./shapes/custom-geometry";
import { processShapeEffects } from "./process-shape-effects";
import { initShapeContext } from "./init-shape-context";
import {
  isStarShape,
  renderStarShape,
  isFlowchartShape,
  renderFlowchartShape,
  isActionButtonShape,
  renderActionButtonShape,
  isArrowShape,
  renderArrowShape,
  isCurvedArrowShape,
  renderCurvedArrowShape,
  isCalloutShape,
  renderCalloutShape,
  isRibbonShape,
  renderRibbonShape,
  isMathShape,
  renderMathShapeType,
  isBracketShape,
  renderBracketShape,
  isArcShape,
  renderArcShape,
  isPolygonShape,
  renderPolygonShape,
  isScrollShape,
  renderScrollShapeType,
  isMiscSymbolShape,
  renderMiscSymbolShape,
  isPlateCylinderShape,
  renderPlateCylinderShape,
  isConnectorShape,
  renderConnectorShape,
} from "./shapes";
import { isBasicShape, renderBasicShape } from "./shapes/basic-shapes";

type GenShapeOptions = {
  shapeNode: any;
  parentNode: any;
  layoutShapeNode: any;
  masterShapeNode: any;
  shapeId: number | string | undefined;
  shapeName: string | undefined;
  placeholderIndex: number | string | undefined;
  placeholderType: string | undefined;
  zIndexOrder: number | string | undefined;
  warpContext: any;
  isUserDrawnBackground: boolean | undefined;
  shapeType: string | undefined;
  sourceType: string;
  emuToPx: number;
  styleTable: any;
  fontSizeScale: number;
  rtlLanguages: string[];
  firstLineBreak: { value: boolean };
};

export async function genShape({
  shapeNode: node,
  parentNode: pNode,
  layoutShapeNode: slideLayoutSpNode,
  masterShapeNode: slideMasterSpNode,
  shapeId: id,
  shapeName: name,
  placeholderIndex: idx,
  placeholderType: type,
  zIndexOrder: order,
  warpContext,
  isUserDrawnBackground: isUserDrawnBg,
  shapeType: sType,
  sourceType: source,
  emuToPx,
  styleTable,
  fontSizeScale,
  rtlLanguages,
  firstLineBreak,
}: GenShapeOptions): Promise<string> {
  // Initialize shape rendering context
  const context = await initShapeContext({
    node,
    parentNode: pNode,
    slideLayoutSpNode,
    slideMasterSpNode,
    id,
    idx,
    type,
    name,
    order,
    shapeType: sType,
    source,
    warpContext,
    emuToPx,
    styleTable,
  });

  if (!context) {
    // No valid shape type found, return empty result
    return "";
  }

  // Destructure context
  const {
    slideXfrmNode,
    slideLayoutXfrmNode,
    slideMasterXfrmNode,
    shpId,
    shapType,
    custShapType,
    w,
    h,
    svgCssName,
    fillColor,
    grndFillFlg,
    imgFillFlg,
    border,
  } = context;

  // Declare txtRotate as mutable variable since it may be modified by shape renderers
  let txtRotate = context.txtRotate;
  const shpIdStr = String(shpId);

  let result = context.svgHeader;
  result += "<defs>";
  result += context.defsContent;

  // Process shape effects (shadows, markers)
  const effectsResult = processShapeEffects({
    shapeNode: node,
    shapeId: shpId,
    svgClassName: svgCssName,
    border,
    warpContext,
    emuToPx,
    styleTable,
  });
  result += effectsResult.defsContent;

  result += "</defs>";
  if (shapType !== undefined && custShapType === undefined) {
    //console.log("shapType: ", shapType)

    // Handle star shapes via dedicated module
    if (isStarShape({ shapeType: shapType })) {
      result += renderStarShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isFlowchartShape({ shapeType: shapType })) {
      // Handle independent flowchart shapes via dedicated module
      result += renderFlowchartShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isActionButtonShape({ shapeType: shapType })) {
      // Handle action button shapes via dedicated module
      result += renderActionButtonShape({
        shapeType: shapType,
        ctx: {
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
        },
      });
    } else if (isArrowShape({ shapeType: shapType })) {
      // Handle arrow shapes via dedicated module
      result += renderArrowShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isCurvedArrowShape({ shapeType: shapType })) {
      // Handle curved arrow shapes via dedicated module
      result += renderCurvedArrowShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isCalloutShape({ shapeType: shapType })) {
      // Handle callout shapes via dedicated module
      result += renderCalloutShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isRibbonShape({ shapeType: shapType })) {
      // Handle ribbon shapes via dedicated module
      result += renderRibbonShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isMathShape({ shapeType: shapType })) {
      // Handle math shapes via dedicated module
      result += renderMathShapeType({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isBracketShape({ shapeType: shapType })) {
      // Handle bracket shapes via dedicated module
      result += renderBracketShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isArcShape({ shapeType: shapType })) {
      // Handle arc shapes via dedicated module
      result += renderArcShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isPolygonShape({ shapeType: shapType })) {
      // Handle polygon shapes via dedicated module
      result += renderPolygonShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isScrollShape({ shapeType: shapType })) {
      // Handle scroll shapes via dedicated module
      result += renderScrollShapeType({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isMiscSymbolShape({ shapeType: shapType })) {
      // Handle misc symbol shapes via dedicated module
      result += renderMiscSymbolShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
          setTxtRotate: (angle: number) => {
            txtRotate = angle;
          },
        },
      });
    } else if (isPlateCylinderShape({ shapeType: shapType })) {
      // Handle plate and cylinder shapes via dedicated module
      result += renderPlateCylinderShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
          slideFactor: emuToPx,
        },
      });
    } else if (isConnectorShape({ shapeType: shapType })) {
      // Handle connector shapes via dedicated module
      result += renderConnectorShape({
        shapeType: shapType,
        ctx: {
          node,
          w,
          h,
          shpId: shpIdStr,
          border,
        },
      });
    } else if (isBasicShape({ shapeType: shapType })) {
      // Handle basic shapes via dedicated module
      result += renderBasicShape({
        shapeType: shapType,
        params: {
          node,
          w,
          h,
          shpId: shpIdStr,
          fillColor,
          grndFillFlg,
          imgFillFlg,
          border,
        },
      });
    } else {
      // Unsupported or undefined shape type
      if (shapType !== undefined) {
        console.log(shapType, " -unsupported shape type.");
      } else {
        console.warn("Undefine shape type.(" + shapType + ")");
      }
    }

    result += "</svg>";

    result +=
      "<div class='block " +
      getVerticalAlign({
        textBodyContainerNode: node,
        layoutShapeNode: slideLayoutSpNode,
        masterShapeNode: slideMasterSpNode,
      }) + //block content
      " " +
      getContentDir({ textBodyNode: node, shapeType: type, warpContext }) +
      "' _id='" +
      id +
      "' _idx='" +
      idx +
      "' _type='" +
      type +
      "' _name='" +
      name +
      "' style='" +
      getPosition({
        slideSpNode: slideXfrmNode,
        parentNode: pNode,
        slideLayoutSpNode: slideLayoutXfrmNode,
        slideMasterSpNode: slideMasterXfrmNode,
        shapeType: sType,
        emuToPx,
      }) +
      getSize({
        slideSpNode: slideXfrmNode,
        slideLayoutSpNode: slideLayoutXfrmNode,
        slideMasterSpNode: slideMasterXfrmNode,
        emuToPx,
      }) +
      " z-index: " +
      order +
      ";" +
      "transform: rotate(" +
      (txtRotate !== undefined ? txtRotate : 0) +
      "deg);" +
      "'>";

    // TextBody
    if (node["p:txBody"] !== undefined && (isUserDrawnBg === undefined || isUserDrawnBg === true)) {
      if (type !== "diagram" && type !== "textBox") {
        type = "shape";
      }
      result += await genTextBody({
        textBodyNode: node["p:txBody"],
        spNode: node,
        shapeType: type,
        placeholderIndex: idx,
        warpContext,
        tableColumnWidth: undefined,
        firstLineBreak,
        styleTable,
        rtlLanguages,
        emuToPx,
        fontSizeScale,
      }); //type='shape'
    }
    result += "</div>";
  } else if (custShapType !== undefined) {
    result += await renderCustomGeometry({
      custShapType,
      shapeNode: node,
      layoutShapeNode: slideLayoutSpNode,
      masterShapeNode: slideMasterSpNode,
      slideXfrmNode,
      slideLayoutXfrmNode,
      parentNode: pNode,
      slideMasterXfrmNode,
      width: w,
      height: h,
      shapeId: shpIdStr,
      imgFillFlg,
      grndFillFlg,
      fillColor,
      border,
      id,
      idx,
      placeholderType: type,
      shapeName: name,
      order,
      shapeType: sType,
      txtRotate,
      warpContext,
      isUserDrawnBg,
      firstLineBreak,
      styleTable,
      rtlLanguages,
      emuToPx,
      fontSizeScale,
    });
  } else {
    result +=
      "<div class='block " +
      getVerticalAlign({
        textBodyContainerNode: node,
        layoutShapeNode: slideLayoutSpNode,
        masterShapeNode: slideMasterSpNode,
      }) + //block content
      " " +
      getContentDir({ textBodyNode: node, shapeType: type, warpContext }) +
      "' _id='" +
      id +
      "' _idx='" +
      idx +
      "' _type='" +
      type +
      "' _name='" +
      name +
      "' style='" +
      getPosition({
        slideSpNode: slideXfrmNode,
        parentNode: pNode,
        slideLayoutSpNode: slideLayoutXfrmNode,
        slideMasterSpNode: slideMasterXfrmNode,
        shapeType: sType,
        emuToPx,
      }) +
      getSize({
        slideSpNode: slideXfrmNode,
        slideLayoutSpNode: slideLayoutXfrmNode,
        slideMasterSpNode: slideMasterXfrmNode,
        emuToPx,
      }) +
      getBorder({
        shapeNode: node,
        isSvgMode: false,
        borderType: "shape",
        warpContext,
      }) +
      (await getShapeFill({
        shapeNode: node,
        parentNode: pNode,
        isSvgMode: false,
        warpContext,
        sourceType: source,
      })) +
      " z-index: " +
      order +
      ";" +
      "transform: rotate(" +
      (txtRotate !== undefined ? txtRotate : 0) +
      "deg);" +
      "'>";

    // TextBody
    if (node["p:txBody"] !== undefined && (isUserDrawnBg === undefined || isUserDrawnBg === true)) {
      result += await genTextBody({
        textBodyNode: node["p:txBody"],
        spNode: node,
        shapeType: type,
        placeholderIndex: idx,
        warpContext,
        tableColumnWidth: undefined,
        firstLineBreak,
        styleTable,
        rtlLanguages,
        emuToPx,
        fontSizeScale,
      });
    }
    result += "</div>";
  }
  //console.log("div block result:\n", result)
  return result;
}
