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
 * @param warpObj - Object containing all slide resources (theme, relationships, etc.)
 * @param isUserDrawnBg - Whether this is a user-drawn background shape
 * @param sType - Shape type context
 * @param source - Source context (slide, layout, master)
 * @param slideFactor - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeFactor - Font size scaling factor
 * @param rtlLangsArray - Array of RTL language codes
 * @param isFirstBr - Mutable object tracking first line break state
 * @returns HTML string with SVG shape
 */

import { getTextByPathList } from "../object";
import { getPosition, getSize, getVerticalAlign, angleToDegrees, getContentDir } from "../layout";
import { getFillType, getShapeFill } from "../fill";
import { getBorder } from "../border";
import { genTextBody } from "../text";
import { getSolidFill } from "../color";
import { getSvgGradient, getSvgImagePattern } from "../svg";
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

export function genShape(
  node: any,
  pNode: any,
  slideLayoutSpNode: any,
  slideMasterSpNode: any,
  id: any,
  name: any,
  idx: any,
  type: any,
  order: any,
  warpObj: any,
  isUserDrawnBg: any,
  sType: any,
  source: any,
  slideFactor: number,
  styleTable: any,
  fontSizeFactor: number,
  rtlLangsArray: string[],
  isFirstBr: { value: boolean }
): string {
  // Initialize shape rendering context
  const context = initShapeContext(
    node,
    pNode,
    slideLayoutSpNode,
    slideMasterSpNode,
    id,
    idx,
    type,
    name,
    order,
    sType,
    source,
    warpObj,
    slideFactor,
    styleTable
  );

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
    rotate,
    flip,
    x,
    y,
    w,
    h,
    svgCssName,
    effectsClassName,
    fillColor,
    grndFillFlg,
    imgFillFlg,
    clrFillType,
    border,
  } = context;

  // Declare txtRotate as mutable variable since it may be modified by shape renderers
  let txtRotate = context.txtRotate;

  let result = context.svgHeader;
  result += "<defs>";
  result += context.defsContent;

  // Process shape effects (shadows, markers)
  const effectsResult = processShapeEffects(
    node,
    shpId,
    svgCssName,
    border,
    warpObj,
    slideFactor,
    styleTable
  );
  result += effectsResult.defsContent;

  result += "</defs>";
  if (shapType !== undefined && custShapType === undefined) {
    //console.log("shapType: ", shapType)

    // Handle star shapes via dedicated module
    if (isStarShape(shapType)) {
      result += renderStarShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isFlowchartShape(shapType)) {
      // Handle independent flowchart shapes via dedicated module
      result += renderFlowchartShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isActionButtonShape(shapType)) {
      // Handle action button shapes via dedicated module
      result += renderActionButtonShape(shapType, {
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
      });
    } else if (isArrowShape(shapType)) {
      // Handle arrow shapes via dedicated module
      result += renderArrowShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isCurvedArrowShape(shapType)) {
      // Handle curved arrow shapes via dedicated module
      result += renderCurvedArrowShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isCalloutShape(shapType)) {
      // Handle callout shapes via dedicated module
      result += renderCalloutShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isRibbonShape(shapType)) {
      // Handle ribbon shapes via dedicated module
      result += renderRibbonShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isMathShape(shapType)) {
      // Handle math shapes via dedicated module
      result += renderMathShapeType(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isBracketShape(shapType)) {
      // Handle bracket shapes via dedicated module
      result += renderBracketShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isArcShape(shapType)) {
      // Handle arc shapes via dedicated module
      result += renderArcShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isPolygonShape(shapType)) {
      // Handle polygon shapes via dedicated module
      result += renderPolygonShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isScrollShape(shapType)) {
      // Handle scroll shapes via dedicated module
      result += renderScrollShapeType(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isMiscSymbolShape(shapType)) {
      // Handle misc symbol shapes via dedicated module
      result += renderMiscSymbolShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
        setTxtRotate: (angle: number) => {
          txtRotate = angle;
        },
      });
    } else if (isPlateCylinderShape(shapType)) {
      // Handle plate and cylinder shapes via dedicated module
      result += renderPlateCylinderShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
        slideFactor,
      });
    } else if (isConnectorShape(shapType)) {
      // Handle connector shapes via dedicated module
      result += renderConnectorShape(shapType, {
        node,
        w,
        h,
        shpId,
        border,
      });
    } else if (isBasicShape(shapType)) {
      // Handle basic shapes via dedicated module
      result += renderBasicShape(shapType, {
        node,
        w,
        h,
        shpId,
        fillColor,
        grndFillFlg,
        imgFillFlg,
        border,
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
      getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode, type) + //block content
      " " +
      getContentDir(node, type, warpObj) +
      "' _id='" +
      id +
      "' _idx='" +
      idx +
      "' _type='" +
      type +
      "' _name='" +
      name +
      "' style='" +
      getPosition(
        slideXfrmNode,
        pNode,
        slideLayoutXfrmNode,
        slideMasterXfrmNode,
        sType,
        slideFactor
      ) +
      getSize(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode, slideFactor) +
      " z-index: " +
      order +
      ";" +
      "transform: rotate(" +
      (txtRotate !== undefined ? txtRotate : 0) +
      "deg);" +
      "'>";

    // TextBody
    if (node["p:txBody"] !== undefined && (isUserDrawnBg === undefined || isUserDrawnBg === true)) {
      if (type != "diagram" && type != "textBox") {
        type = "shape";
      }
      // @ts-expect-error TS(2554): Expected 8 arguments, but got 7.
      result += genTextBody(
        node["p:txBody"],
        node,
        slideLayoutSpNode,
        slideMasterSpNode,
        type,
        idx,
        warpObj,
        undefined,
        isFirstBr,
        styleTable,
        rtlLangsArray,
        slideFactor,
        fontSizeFactor
      ); //type='shape'
    }
    result += "</div>";
  } else if (custShapType !== undefined) {
    result += renderCustomGeometry(
      custShapType,
      node,
      slideLayoutSpNode,
      slideMasterSpNode,
      slideXfrmNode,
      pNode,
      slideMasterXfrmNode,
      w,
      h,
      shpId,
      imgFillFlg,
      grndFillFlg,
      fillColor,
      border,
      id,
      idx,
      type,
      name,
      order,
      sType,
      txtRotate,
      warpObj,
      isUserDrawnBg,
      isFirstBr,
      styleTable,
      rtlLangsArray,
      slideFactor,
      fontSizeFactor
    );
  } else {
    result +=
      "<div class='block " +
      getVerticalAlign(node, slideLayoutSpNode, slideMasterSpNode, type) + //block content
      " " +
      getContentDir(node, type, warpObj) +
      "' _id='" +
      id +
      "' _idx='" +
      idx +
      "' _type='" +
      type +
      "' _name='" +
      name +
      "' style='" +
      getPosition(
        slideXfrmNode,
        pNode,
        slideLayoutXfrmNode,
        slideMasterXfrmNode,
        sType,
        slideFactor
      ) +
      getSize(slideXfrmNode, slideLayoutXfrmNode, slideMasterXfrmNode, slideFactor) +
      getBorder(node, pNode, false, "shape", warpObj) +
      getShapeFill(node, pNode, false, warpObj, source) +
      " z-index: " +
      order +
      ";" +
      "transform: rotate(" +
      (txtRotate !== undefined ? txtRotate : 0) +
      "deg);" +
      "'>";

    // TextBody
    if (node["p:txBody"] !== undefined && (isUserDrawnBg === undefined || isUserDrawnBg === true)) {
      result += genTextBody(
        node["p:txBody"],
        node,
        slideLayoutSpNode,
        slideMasterSpNode,
        type,
        idx,
        warpObj,
        undefined,
        isFirstBr,
        styleTable,
        rtlLangsArray,
        slideFactor,
        fontSizeFactor
      );
    }
    result += "</div>";
  }
  //console.log("div block result:\n", result)
  return result;
}
