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

export async function renderCustomGeometry(
  custShapType: any,
  node: any,
  slideLayoutSpNode: any,
  slideMasterSpNode: any,
  slideXfrmNode: any,
  slideLayoutXfrmNode: any,
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
): Promise<string> {
  let result = "";

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
  const _totalShapes = moveToNode.length;

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
          const ptObj: any = {};
          const moveToNoPt = moveToPtNode[key2];
          const spX = moveToNoPt["x"]; //parseInt(moveToNoPt["attrs", "x"]) * slideFactor;
          const spY = moveToNoPt["y"]; //parseInt(moveToNoPt["attrs", "y"]) * slideFactor;
          const ptOrdr = moveToNoPt["order"];
          ptObj.type = "movto";
          ptObj.order = ptOrdr;
          ptObj.x = spX;
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
            const ptObj: any = {};
            const lnToNoPt = lnToPtNode[key2];
            const ptX = lnToNoPt["x"];
            const ptY = lnToNoPt["y"];
            const ptOrdr = lnToNoPt["order"];
            ptObj.type = "lnto";
            ptObj.order = ptOrdr;
            ptObj.x = ptX;
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
        const nodeObj: any = {};
        nodeObj.type = "cubicBezTo";
        nodeObj.order = key2[0]["attrs"]["order"];
        const pts_ary: any = [];
        key2.forEach(function (pt: any) {
          const pt_obj = {
            x: pt["attrs"]["x"],
            y: pt["attrs"]["y"],
          };
          pts_ary.push(pt_obj);
        });
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
      const ptObj: any = {};
      ptObj.type = "arcTo";
      ptObj.order = arcOrder;
      ptObj.hR = hR;
      ptObj.wR = wR;
      ptObj.stAng = stAng;
      ptObj.swAng = swAng;
      ptObj.shftX = shftX;
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
        const ptObj: any = {};
        ptObj.type = "close";
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
        const hR: any = parseInt(multiSapeAry[k].hR) * cX; //slideFactor;
        const wR: any = parseInt(multiSapeAry[k].wR) * cY; //slideFactor;
        const stAng: any = parseInt(multiSapeAry[k].stAng) / 60000;
        const swAng: any = parseInt(multiSapeAry[k].swAng) / 60000;
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
    result += await genTextBody(
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
