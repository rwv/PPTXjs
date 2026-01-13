/**
 * Renders custom geometry shapes (custGeom) from PPTX
 *
 * Handles custom paths with:
 * - a:moveTo - Move to point
 * - a:lnTo - Line to point
 * - a:cubicBezTo - Cubic Bezier curve
 * - a:arcTo - Arc to point
 * - a:close - Close path
 *
 * Reference: http://officeopenxml.com/drwSp-custGeom.php
 */

import { getTextByPathList } from "../../object";
import { getVerticalAlign, getPosition, getSize, getContentDir } from "../../layout";
import { shapeArc } from "./helpers/arc";
import { genTextBody } from "../../text";
import type { StyleTable } from "../../../types/style";
import type { WarpContext, XmlNode, XmlValue } from "../../../types/pptx-xml";

const isXmlNode = (value: XmlValue): value is XmlNode =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNodeRecord = (value: Record<string, unknown>): value is Record<string, XmlNode> =>
  Object.keys(value).length > 0 && Object.keys(value).every((key) => !Number.isNaN(Number(key)));

const toXmlNodeArray = (value: XmlValue | undefined): XmlNode[] => {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(isXmlNode);
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (isNodeRecord(record)) {
      return Object.values(record).filter(isXmlNode);
    }
    return [record as XmlNode];
  }
  return [];
};

const getNodeAttrValue = (node: XmlNode, attr: string): string => {
  const attrValue = getTextByPathList<string | number>({ node, path: ["attrs", attr] });
  if (attrValue !== undefined) {
    return String(attrValue);
  }
  const directValue = node[attr];
  return typeof directValue === "string" || typeof directValue === "number"
    ? String(directValue)
    : "";
};

const getNodeOrder = (node: XmlNode): number => {
  const attrValue = getTextByPathList<string | number>({ node, path: ["attrs", "order"] });
  if (attrValue !== undefined) {
    const orderNumber = Number(attrValue);
    return Number.isNaN(orderNumber) ? 0 : orderNumber;
  }
  const directValue = node["order"];
  const orderNumber =
    typeof directValue === "string" || typeof directValue === "number" ? Number(directValue) : NaN;
  return Number.isNaN(orderNumber) ? 0 : orderNumber;
};

type ShapeBorder = {
  color: string;
  width: string;
  strokeDasharray: string;
};

type PathPoint = {
  type: "movto" | "lnto";
  order: number;
  x: string;
  y: string;
};

type CubicBezierPoint = {
  x: string;
  y: string;
};

type CubicBezierSegment = {
  type: "cubicBezTo";
  order: number;
  cubBzPt: CubicBezierPoint[];
};

type ArcSegment = {
  type: "arcTo";
  order: number;
  hR: string;
  wR: string;
  stAng: string;
  swAng: string;
  shftX: number;
  shftY: number;
};

type CloseSegment = {
  type: "close";
  order: number;
};

type QuadBezierSegment = {
  type: "quadBezTo";
  order: number;
};

type ShapeSegment = PathPoint | CubicBezierSegment | ArcSegment | CloseSegment | QuadBezierSegment;

type RenderCustomGeometryOptions = {
  custShapType: XmlNode;
  shapeNode: XmlNode;
  layoutShapeNode: XmlNode | undefined;
  masterShapeNode: XmlNode | undefined;
  slideXfrmNode: XmlNode | undefined;
  slideLayoutXfrmNode: XmlNode | undefined;
  parentNode: XmlNode | undefined;
  slideMasterXfrmNode: XmlNode | undefined;
  width: number;
  height: number;
  shapeId: string;
  imgFillFlg: boolean;
  grndFillFlg: boolean;
  fillColor: string;
  border: ShapeBorder | undefined;
  id: number | string | undefined;
  idx: number | string | undefined;
  placeholderType: string | undefined;
  shapeName: string | undefined;
  order: number | string | undefined;
  shapeType: string | undefined;
  txtRotate: number | undefined;
  warpContext: WarpContext;
  isUserDrawnBg: boolean | undefined;
  firstLineBreak: { value: boolean };
  styleTable: StyleTable;
  rtlLanguages: string[];
  emuToPx: number;
  fontSizeScale: number;
};

export async function renderCustomGeometry({
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
  shapeId: shpId,
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
}: RenderCustomGeometryOptions): Promise<string> {
  let result = "";

  //custGeom here - Amir ///////////////////////////////////////////////////////
  //http://officeopenxml.com/drwSp-custGeom.php
  const pathLstNode = getTextByPathList<XmlNode>({ node: custShapType, path: ["a:pathLst"] });
  const pathNodesValue =
    pathLstNode !== undefined
      ? getTextByPathList<XmlNode | XmlNode[]>({ node: pathLstNode, path: ["a:path"] })
      : undefined;
  const pathNodes = Array.isArray(pathNodesValue) ? pathNodesValue[0] : pathNodesValue;
  if (!pathNodes || !isXmlNode(pathNodes)) {
    return result;
  }
  //var pathNode = getTextByPathList({ node: pathLstNode, path: ["a:path", "attrs"] });
  const maxX = parseInt(String(pathNodes.attrs?.w ?? "0"), 10); // * emuToPx;
  const maxY = parseInt(String(pathNodes.attrs?.h ?? "0"), 10); // * emuToPx;
  const cX = (1 / maxX) * w;
  const cY = (1 / maxY) * h;
  //console.log("w = "+w+"\nh = "+h+"\nmaxX = "+maxX +"\nmaxY = " + maxY);
  //cheke if it is close shape

  //console.log("custShapType : ", custShapType, ", pathLstNode: ", pathLstNode, ", node: ", node);//, ", y:", y, ", w:", w, ", h:", h);

  const moveToNodes = toXmlNodeArray(
    getTextByPathList<XmlNode | XmlNode[]>({ node: pathNodes, path: ["a:moveTo"] })
  );
  const lnToNodes = toXmlNodeArray(pathNodes["a:lnTo"]);
  const cubicBezToNodes = toXmlNodeArray(pathNodes["a:cubicBezTo"]);
  const arcToValue = pathNodes["a:arcTo"];
  const arcToNode = arcToValue !== undefined && isXmlNode(arcToValue) ? arcToValue : undefined;
  const closeNodes = toXmlNodeArray(
    getTextByPathList<XmlNode | XmlNode[]>({ node: pathNodes, path: ["a:close"] })
  );
  //quadBezTo //total a:pt : 2 - TODO

  const multiSapeAry: ShapeSegment[] = [];
  if (moveToNodes.length > 0) {
    //a:moveTo
    for (const moveToNode of moveToNodes) {
      const moveToPtNodes = toXmlNodeArray(moveToNode["a:pt"]);
      for (const pointNode of moveToPtNodes) {
        const ptObj: PathPoint = {
          type: "movto",
          order: getNodeOrder(pointNode),
          x: getNodeAttrValue(pointNode, "x"),
          y: getNodeAttrValue(pointNode, "y"),
        };
        multiSapeAry.push(ptObj);
      }
    }
    //a:lnTo
    for (const lnToNode of lnToNodes) {
      const lnToPtNodes = toXmlNodeArray(lnToNode["a:pt"]);
      for (const pointNode of lnToPtNodes) {
        const ptObj: PathPoint = {
          type: "lnto",
          order: getNodeOrder(pointNode),
          x: getNodeAttrValue(pointNode, "x"),
          y: getNodeAttrValue(pointNode, "y"),
        };
        multiSapeAry.push(ptObj);
      }
    }
    //a:cubicBezTo
    for (const cubicNode of cubicBezToNodes) {
      const pointNodes = toXmlNodeArray(cubicNode["a:pt"]);
      if (pointNodes.length === 0) {
        continue;
      }
      const nodeObj: CubicBezierSegment = {
        type: "cubicBezTo",
        order: getNodeOrder(pointNodes[0]),
        cubBzPt: pointNodes.map((point) => ({
          x: getNodeAttrValue(point, "x"),
          y: getNodeAttrValue(point, "y"),
        })),
      };
      multiSapeAry.push(nodeObj);
    }
    //a:arcTo
    if (arcToNode !== undefined) {
      const arcPointAttrs = getTextByPathList<Record<string, string | number>>({
        node: arcToNode,
        path: ["a:pt", "attrs"],
      });
      const ptObj: ArcSegment = {
        type: "arcTo",
        order: getNodeOrder(arcToNode),
        hR: getNodeAttrValue(arcToNode, "hR"),
        wR: getNodeAttrValue(arcToNode, "wR"),
        stAng: getNodeAttrValue(arcToNode, "stAng"),
        swAng: getNodeAttrValue(arcToNode, "swAng"),
        shftX: arcPointAttrs?.x !== undefined ? Number(arcPointAttrs.x) : 0,
        shftY: arcPointAttrs?.y !== undefined ? Number(arcPointAttrs.y) : 0,
      };
      multiSapeAry.push(ptObj);
    }
    //a:quadBezTo - TODO

    //a:close
    for (const closeNode of closeNodes) {
      const ptObj: CloseSegment = {
        type: "close",
        order: getNodeOrder(closeNode),
      };
      multiSapeAry.push(ptObj);
    }

    // console.log("custShapType >> multiSapeAry: ", multiSapeAry);

    multiSapeAry.sort(function (a, b) {
      return a.order - b.order;
    });

    //console.log("custShapType >>sorted  multiSapeAry: ");
    //console.log(multiSapeAry);
    let k = 0;
    let d = "";
    while (k < multiSapeAry.length) {
      const segment = multiSapeAry[k];
      switch (segment.type) {
        case "movto": {
          //start point
          const spX = parseInt(segment.x, 10) * cX; //emuToPx;
          const spY = parseInt(segment.y, 10) * cY; //emuToPx;
          // if (d == "") {
          //     d = "M" + spX + "," + spY;
          // } else {
          //     //shape without close : then close the shape and start new path
          //     result += "<path d='" + d + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
          //         "' stroke='" + ((border === undefined) ? "" : border.color) + "' stroke-width='" + ((border === undefined) ? "" : border.width) + "' stroke-dasharray='" + ((border === undefined) ? "" : border.strokeDasharray) + "' ";
          //     result += "/>";

          //     if (headEndNodeAttrs !== undefined && (headEndNodeAttrs["type"] === "triangle" || headEndNodeAttrs["type"] === "arrow")) {
          //         result += "marker-start='url(#markerTriangle_" + shpId + ")' ";
          //     }
          //     if (tailEndNodeAttrs !== undefined && (tailEndNodeAttrs["type"] === "triangle" || tailEndNodeAttrs["type"] === "arrow")) {
          //         result += "marker-end='url(#markerTriangle_" + shpId + ")' ";
          //     }
          //     result += "/>";

          //     d = "M" + spX + "," + spY;
          //     isClose = true;
          // }

          d += " M" + spX + "," + spY;
          break;
        }
        case "lnto": {
          const Lx = parseInt(segment.x, 10) * cX; //emuToPx;
          const Ly = parseInt(segment.y, 10) * cY; //emuToPx;
          d += " L" + Lx + "," + Ly;
          break;
        }
        case "cubicBezTo": {
          const Cx1 = parseInt(segment.cubBzPt[0].x, 10) * cX; //emuToPx;
          const Cy1 = parseInt(segment.cubBzPt[0].y, 10) * cY; //emuToPx;
          const Cx2 = parseInt(segment.cubBzPt[1].x, 10) * cX; //emuToPx;
          const Cy2 = parseInt(segment.cubBzPt[1].y, 10) * cY; //emuToPx;
          const Cx3 = parseInt(segment.cubBzPt[2].x, 10) * cX; //emuToPx;
          const Cy3 = parseInt(segment.cubBzPt[2].y, 10) * cY; //emuToPx;
          d += " C" + Cx1 + "," + Cy1 + " " + Cx2 + "," + Cy2 + " " + Cx3 + "," + Cy3;
          break;
        }
        case "arcTo": {
          const hR = parseInt(segment.hR, 10) * cX; //emuToPx;
          const wR = parseInt(segment.wR, 10) * cY; //emuToPx;
          const stAng = parseInt(segment.stAng, 10) / 60000;
          const swAng = parseInt(segment.swAng, 10) / 60000;
          //var shftX = parseInt(multiSapeAry[k].shftX) * emuToPx;
          //var shftY = parseInt(multiSapeAry[k].shftY) * emuToPx;
          const endAng = stAng + swAng;

          d += shapeArc({
            cX: wR,
            cY: hR,
            rX: wR,
            rY: hR,
            stAng: stAng,
            endAng: endAng,
            isClose: false,
          });
          break;
        }
        case "quadBezTo":
          console.log("custShapType: quadBezTo - TODO");
          break;
        case "close":
          // result += "<path d='" + d + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
          //     "' stroke='" + ((border === undefined) ? "" : border.color) + "' stroke-width='" + ((border === undefined) ? "" : border.width) + "' stroke-dasharray='" + ((border === undefined) ? "" : border.strokeDasharray) + "' ";
          // result += "/>";
          // d = "";
          // isClose = true;

          d += "z";
          break;
      }
      k++;
    }
    //if (!isClose) {
    //only one "moveTo" and no "close"
    result +=
      "<path d='" +
      d +
      "' fill='" +
      (!imgFillFlg
        ? grndFillFlg
          ? "url(#linGrd_" + shpId + ")"
          : fillColor
        : "url(#imgPtrn_" + shpId + ")") +
      "' stroke='" +
      (border === undefined ? "" : border.color) +
      "' stroke-width='" +
      (border === undefined ? "" : border.width) +
      "' stroke-dasharray='" +
      (border === undefined ? "" : border.strokeDasharray) +
      "' ";
    result += "/>";
    //console.log(result);
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
      textBodyNode: node["p:txBody"] as XmlNode | undefined,
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
    }); //type=shape
  }
  result += "</div>";

  return result;
}
