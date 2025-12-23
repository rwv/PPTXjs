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

export function renderCustomGeometry(
  custShapType: any,
  node: any,
  slideLayoutSpNode: any,
  slideMasterSpNode: any,
  slideXfrmNode: any,
  pNode: any,
  slideMasterXfrmNode: any,
  w: number,
  h: number,
  shpId: any,
  imgFillFlg: boolean,
  grndFillFlg: boolean,
  fillColor: string,
  border: any,
  id: any,
  idx: any,
  type: any,
  name: any,
  order: any,
  sType: any,
  txtRotate: number | undefined,
  warpObj: any,
  isUserDrawnBg: any,
  isFirstBr: { value: boolean },
  styleTable: any,
  rtlLangsArray: string[],
  slideFactor: number,
  fontSizeFactor: number
): string {
  let result = "";

  // Extract xfrm node from slideLayoutSpNode for position/size calculations
  const slideLayoutXfrmNode = getTextByPathList(slideLayoutSpNode, ["p:spPr", "a:xfrm"]);

  //custGeom here - Amir ///////////////////////////////////////////////////////
  //http://officeopenxml.com/drwSp-custGeom.php
  const pathLstNode = getTextByPathList(custShapType, ["a:pathLst"]);
  const pathNodes = getTextByPathList(pathLstNode, ["a:path"]);
  //var pathNode = getTextByPathList(pathLstNode, ["a:path", "attrs"]);
  const maxX = parseInt(pathNodes["attrs"]["w"]); // * slideFactor;
  const maxY = parseInt(pathNodes["attrs"]["h"]); // * slideFactor;
  const cX = (1 / maxX) * w;
  const cY = (1 / maxY) * h;
  //console.log("w = "+w+"\nh = "+h+"\nmaxX = "+maxX +"\nmaxY = " + maxY);
  //cheke if it is close shape

  //console.log("custShapType : ", custShapType, ", pathLstNode: ", pathLstNode, ", node: ", node);//, ", y:", y, ", w:", w, ", h:", h);

  let moveToNode = getTextByPathList(pathNodes, ["a:moveTo"]);
  const _total_shapes = moveToNode.length;

  const lnToNodes = pathNodes["a:lnTo"]; //total a:pt : 1
  let cubicBezToNodes = pathNodes["a:cubicBezTo"]; //total a:pt : 3
  const arcToNodes = pathNodes["a:arcTo"]; //total a:pt : 0?1? ; attrs: ~4 ()
  let closeNode = getTextByPathList(pathNodes, ["a:close"]); //total a:pt : 0
  //quadBezTo //total a:pt : 2 - TODO
  //console.log("ia moveToNode array: ", Array.isArray(moveToNode))
  if (!Array.isArray(moveToNode)) {
    moveToNode = [moveToNode];
  }
  //console.log("ia moveToNode array: ", Array.isArray(moveToNode))

  const multiSapeAry = [];
  if (moveToNode.length > 0) {
    //a:moveTo
    Object.keys(moveToNode).forEach(function (key) {
      const moveToPtNode = moveToNode[key]["a:pt"];
      if (moveToPtNode !== undefined) {
        Object.keys(moveToPtNode).forEach(function (key2) {
          const ptObj = {};
          const moveToNoPt = moveToPtNode[key2];
          // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
          const spX = moveToNoPt[("attrs", "x")]; //parseInt(moveToNoPt["attrs", "x"]) * slideFactor;
          // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
          const spY = moveToNoPt[("attrs", "y")]; //parseInt(moveToNoPt["attrs", "y"]) * slideFactor;
          // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
          const ptOrdr = moveToNoPt[("attrs", "order")];
          // @ts-expect-error TS(2339): Property 'type' does not exist on type '{}'.
          ptObj.type = "movto";
          // @ts-expect-error TS(2339): Property 'order' does not exist on type '{}'.
          ptObj.order = ptOrdr;
          // @ts-expect-error TS(2339): Property 'x' does not exist on type '{}'.
          ptObj.x = spX;
          // @ts-expect-error TS(2339): Property 'y' does not exist on type '{}'.
          ptObj.y = spY;
          multiSapeAry.push(ptObj);
          //console.log(key2, lnToNoPt);
        });
      }
    });
    //a:lnTo
    if (lnToNodes !== undefined) {
      Object.keys(lnToNodes).forEach(function (key) {
        const lnToPtNode = lnToNodes[key]["a:pt"];
        if (lnToPtNode !== undefined) {
          Object.keys(lnToPtNode).forEach(function (key2) {
            const ptObj = {};
            const lnToNoPt = lnToPtNode[key2];
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const ptX = lnToNoPt[("attrs", "x")];
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const ptY = lnToNoPt[("attrs", "y")];
            // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
            const ptOrdr = lnToNoPt[("attrs", "order")];
            // @ts-expect-error TS(2339): Property 'type' does not exist on type '{}'.
            ptObj.type = "lnto";
            // @ts-expect-error TS(2339): Property 'order' does not exist on type '{}'.
            ptObj.order = ptOrdr;
            // @ts-expect-error TS(2339): Property 'x' does not exist on type '{}'.
            ptObj.x = ptX;
            // @ts-expect-error TS(2339): Property 'y' does not exist on type '{}'.
            ptObj.y = ptY;
            multiSapeAry.push(ptObj);
            //console.log(key2, lnToNoPt);
          });
        }
      });
    }
    //a:cubicBezTo
    if (cubicBezToNodes !== undefined) {
      const cubicBezToPtNodesAry: any = [];
      //console.log("cubicBezToNodes: ", cubicBezToNodes, ", is arry: ", Array.isArray(cubicBezToNodes))
      if (!Array.isArray(cubicBezToNodes)) {
        cubicBezToNodes = [cubicBezToNodes];
      }
      Object.keys(cubicBezToNodes).forEach(function (key) {
        //console.log("cubicBezTo[" + key + "]:");
        cubicBezToPtNodesAry.push(cubicBezToNodes[key]["a:pt"]);
      });

      //console.log("cubicBezToNodes: ", cubicBezToPtNodesAry)
      cubicBezToPtNodesAry.forEach(function (key2) {
        //console.log("cubicBezToPtNodesAry: key2 : ", key2)
        const nodeObj = {};
        // @ts-expect-error TS(2339): Property 'type' does not exist on type '{}'.
        nodeObj.type = "cubicBezTo";
        // @ts-expect-error TS(2339): Property 'order' does not exist on type '{}'.
        nodeObj.order = key2[0]["attrs"]["order"];
        const pts_ary: any = [];
        key2.forEach(function (pt: any) {
          const pt_obj = {
            x: pt["attrs"]["x"],
            y: pt["attrs"]["y"],
          };
          pts_ary.push(pt_obj);
        });
        // @ts-expect-error TS(2339): Property 'cubBzPt' does not exist on type '{}'.
        nodeObj.cubBzPt = pts_ary; //key2;
        multiSapeAry.push(nodeObj);
      });
    }
    //a:arcTo
    if (arcToNodes !== undefined) {
      const arcToNodesAttrs = arcToNodes["attrs"];
      const arcOrder = arcToNodesAttrs["order"];
      const hR = arcToNodesAttrs["hR"];
      const wR = arcToNodesAttrs["wR"];
      const stAng = arcToNodesAttrs["stAng"];
      const swAng = arcToNodesAttrs["swAng"];
      let shftX = 0;
      let shftY = 0;
      const arcToPtNode = getTextByPathList(arcToNodes, ["a:pt", "attrs"]);
      if (arcToPtNode !== undefined) {
        shftX = arcToPtNode["x"];
        shftY = arcToPtNode["y"];
        //console.log("shftX: ",shftX," shftY: ",shftY)
      }
      const ptObj = {};
      // @ts-expect-error TS(2339): Property 'type' does not exist on type '{}'.
      ptObj.type = "arcTo";
      // @ts-expect-error TS(2339): Property 'order' does not exist on type '{}'.
      ptObj.order = arcOrder;
      // @ts-expect-error TS(2339): Property 'hR' does not exist on type '{}'.
      ptObj.hR = hR;
      // @ts-expect-error TS(2339): Property 'wR' does not exist on type '{}'.
      ptObj.wR = wR;
      // @ts-expect-error TS(2339): Property 'stAng' does not exist on type '{}'.
      ptObj.stAng = stAng;
      // @ts-expect-error TS(2339): Property 'swAng' does not exist on type '{}'.
      ptObj.swAng = swAng;
      // @ts-expect-error TS(2339): Property 'shftX' does not exist on type '{}'.
      ptObj.shftX = shftX;
      // @ts-expect-error TS(2339): Property 'shftY' does not exist on type '{}'.
      ptObj.shftY = shftY;
      multiSapeAry.push(ptObj);
    }
    //a:quadBezTo - TODO

    //a:close
    if (closeNode !== undefined) {
      if (!Array.isArray(closeNode)) {
        closeNode = [closeNode];
      }
      // Object.keys(closeNode).forEach(function (key) {
      //     //console.log("cubicBezTo[" + key + "]:");
      //     cubicBezToPtNodesAry.push(closeNode[key]["a:pt"]);
      // });
      Object.keys(closeNode).forEach(function (key) {
        //console.log("custShapType >> closeNode: key: ", key);
        const clsAttrs = closeNode[key]["attrs"];
        //var clsAttrs = closeNode["attrs"];
        const clsOrder = clsAttrs["order"];
        const ptObj = {};
        // @ts-expect-error TS(2339): Property 'type' does not exist on type '{}'.
        ptObj.type = "close";
        // @ts-expect-error TS(2339): Property 'order' does not exist on type '{}'.
        ptObj.order = clsOrder;
        multiSapeAry.push(ptObj);
      });
    }

    // console.log("custShapType >> multiSapeAry: ", multiSapeAry);

    multiSapeAry.sort(function (a, b) {
      return a.order - b.order;
    });

    //console.log("custShapType >>sorted  multiSapeAry: ");
    //console.log(multiSapeAry);
    let k = 0;
    const _isClose = false;
    let d = "";
    while (k < multiSapeAry.length) {
      if (multiSapeAry[k].type === "movto") {
        //start point
        const spX = parseInt(multiSapeAry[k].x) * cX; //slideFactor;
        const spY = parseInt(multiSapeAry[k].y) * cY; //slideFactor;
        // if (d === "") {
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

      } else if (multiSapeAry[k].type === "lnto") {
        const Lx = parseInt(multiSapeAry[k].x) * cX; //slideFactor;
        const Ly = parseInt(multiSapeAry[k].y) * cY; //slideFactor;
        d += " L" + Lx + "," + Ly;

      } else if (multiSapeAry[k].type === "cubicBezTo") {
        const Cx1 = parseInt(multiSapeAry[k].cubBzPt[0].x) * cX; //slideFactor;
        const Cy1 = parseInt(multiSapeAry[k].cubBzPt[0].y) * cY; //slideFactor;
        const Cx2 = parseInt(multiSapeAry[k].cubBzPt[1].x) * cX; //slideFactor;
        const Cy2 = parseInt(multiSapeAry[k].cubBzPt[1].y) * cY; //slideFactor;
        const Cx3 = parseInt(multiSapeAry[k].cubBzPt[2].x) * cX; //slideFactor;
        const Cy3 = parseInt(multiSapeAry[k].cubBzPt[2].y) * cY; //slideFactor;
        d += " C" + Cx1 + "," + Cy1 + " " + Cx2 + "," + Cy2 + " " + Cx3 + "," + Cy3;
      } else if (multiSapeAry[k].type === "arcTo") {
        const hR = parseInt(multiSapeAry[k].hR) * cX; //slideFactor;
        const wR = parseInt(multiSapeAry[k].wR) * cY; //slideFactor;
        const stAng = parseInt(multiSapeAry[k].stAng) / 60000;
        const swAng = parseInt(multiSapeAry[k].swAng) / 60000;
        //var shftX = parseInt(multiSapeAry[k].shftX) * slideFactor;
        //var shftY = parseInt(multiSapeAry[k].shftY) * slideFactor;
        const endAng = stAng + swAng;

        d += shapeArc(wR, hR, wR, hR, stAng, endAng, false);
      } else if (multiSapeAry[k].type === "quadBezTo") {
        console.log("custShapType: quadBezTo - TODO");

      } else if (multiSapeAry[k].type === "close") {
        // result += "<path d='" + d + "' fill='" + (!imgFillFlg ? (grndFillFlg ? "url(#linGrd_" + shpId + ")" : fillColor) : "url(#imgPtrn_" + shpId + ")") +
        //     "' stroke='" + ((border === undefined) ? "" : border.color) + "' stroke-width='" + ((border === undefined) ? "" : border.width) + "' stroke-dasharray='" + ((border === undefined) ? "" : border.strokeDasharray) + "' ";
        // result += "/>";
        // d = "";
        // isClose = true;

        d += "z";
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
    if (type !== "diagram" && type !== "textBox") {
      type = "shape";
    }
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
    ); //type=shape
  }
  result += "</div>";

  return result;
}
