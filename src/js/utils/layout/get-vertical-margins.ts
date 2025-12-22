import { getTextByPathList } from "../object/get-text-by-path-list";
import { getFontSize } from "../font/get-font-size";

/**
 * Calculates vertical margin/padding CSS styling for a PPTX paragraph node
 *
 * Handles spacing with fallback hierarchy:
 * 1. Paragraph-level spacing (highest priority)
 * 2. Layout-level spacing
 * 3. Master slide text styles (lowest priority)
 *
 * Computes three types of spacing:
 * - spacing before paragraph (margin-top)
 * - spacing after paragraph (margin-bottom)
 * - line spacing (padding-top/padding-bottom)
 *
 * Line spacing can be:
 * - Percentage based (a:spcPct) - calculated relative to font size
 * - Points based (a:spcPts) - absolute value
 *
 * @param pNode - Paragraph node from PPTX
 * @param textBodyNode - Text body node containing list styles
 * @param type - Shape type (title, body, textBox, shape, etc.)
 * @param idx - Layout index for fallback lookup
 * @param warpObj - Container object with layout tables and master styles
 * @param fontSizeFactor - Font size multiplier factor (usually 4/3.2)
 * @returns CSS string with margin and padding styles
 */
export function getVerticalMargins(
  pNode: any,
  textBodyNode: any,
  type: any,
  idx: any,
  warpObj: any,
  fontSizeFactor: any
): string {
  //margin-top ;
  //a:pPr => a:spcBef => a:spcPts (/100) | a:spcPct (/?)
  //margin-bottom
  //a:pPr => a:spcAft => a:spcPts (/100) | a:spcPct (/?)
  //+
  //a:pPr =>a:lnSpc => a:spcPts (/?) | a:spcPct (/?)
  //console.log("getVerticalMargins ", pNode, type,idx, warpObj)
  //var lstStyle = textBodyNode["a:lstStyle"];
  var lvl = 1;
  var spcBefNode = getTextByPathList(pNode, ["a:pPr", "a:spcBef", "a:spcPts", "attrs", "val"]);
  var spcAftNode = getTextByPathList(pNode, ["a:pPr", "a:spcAft", "a:spcPts", "attrs", "val"]);
  var lnSpcNode = getTextByPathList(pNode, ["a:pPr", "a:lnSpc", "a:spcPct", "attrs", "val"]);
  var lnSpcNodeType = "Pct";
  if (lnSpcNode === undefined) {
    lnSpcNode = getTextByPathList(pNode, ["a:pPr", "a:lnSpc", "a:spcPts", "attrs", "val"]);
    if (lnSpcNode !== undefined) {
      lnSpcNodeType = "Pts";
    }
  }
  var lvlNode = getTextByPathList(pNode, ["a:pPr", "attrs", "lvl"]);
  if (lvlNode !== undefined) {
    lvl = parseInt(lvlNode) + 1;
  }
  var fontSize;
  if (getTextByPathList(pNode, ["a:r"]) !== undefined) {
    var fontSizeStr = getFontSize(
      pNode["a:r"],
      textBodyNode,
      undefined,
      lvl,
      type,
      warpObj,
      fontSizeFactor
    );
    if (fontSizeStr != "inherit") {
      // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      fontSize = parseInt(fontSizeStr, "px"); //pt
    }
  }
  //var spcBef = "";
  //console.log("getVerticalMargins 1", fontSizeStr, fontSize, lnSpcNode, parseInt(lnSpcNode) / 100000, spcBefNode, spcAftNode)
  // if(spcBefNode !== undefined){
  //     spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "pt;"
  // }
  // else{
  //    //i did not found case with percentage
  //     spcBefNode = getTextByPathList(pNode, ["a:pPr", "a:spcBef", "a:spcPct","attrs","val"]);
  //     if(spcBefNode !== undefined){
  //         spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "%;"
  //     }
  // }
  //var spcAft = "";
  // if(spcAftNode !== undefined){
  //     spcAft = "margin-bottom:" + parseInt(spcAftNode)/100 + "pt;"
  // }
  // else{
  //    //i did not found case with percentage
  //     spcAftNode = getTextByPathList(pNode, ["a:pPr", "a:spcAft", "a:spcPct","attrs","val"]);
  //     if(spcAftNode !== undefined){
  //         spcBef = "margin-bottom:" + parseInt(spcAftNode)/100 + "%;"
  //     }
  // }
  // if(spcAftNode !== undefined){
  //     //check in layout and then in master
  // }
  var isInLayoutOrMaster = true;
  if (type == "shape" || type == "textBox") {
    isInLayoutOrMaster = false;
  }
  if (
    isInLayoutOrMaster &&
    (spcBefNode === undefined || spcAftNode === undefined || lnSpcNode === undefined)
  ) {
    //check in layout
    if (idx !== undefined) {
      var laypPrNode = getTextByPathList(warpObj, [
        "slideLayoutTables",
        "idxTable",
        idx,
        "p:txBody",
        "a:p",
        lvl - 1,
        "a:pPr",
      ]);

      if (spcBefNode === undefined) {
        spcBefNode = getTextByPathList(laypPrNode, ["a:spcBef", "a:spcPts", "attrs", "val"]);
        // if(spcBefNode !== undefined){
        //     spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "pt;"
        // }
        // else{
        //    //i did not found case with percentage
        //     spcBefNode = getTextByPathList(laypPrNode, ["a:spcBef", "a:spcPct","attrs","val"]);
        //     if(spcBefNode !== undefined){
        //         spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "%;"
        //     }
        // }
      }

      if (spcAftNode === undefined) {
        spcAftNode = getTextByPathList(laypPrNode, ["a:spcAft", "a:spcPts", "attrs", "val"]);
        // if(spcAftNode !== undefined){
        //     spcAft = "margin-bottom:" + parseInt(spcAftNode)/100 + "pt;"
        // }
        // else{
        //    //i did not found case with percentage
        //     spcAftNode = getTextByPathList(laypPrNode, ["a:spcAft", "a:spcPct","attrs","val"]);
        //     if(spcAftNode !== undefined){
        //         spcBef = "margin-bottom:" + parseInt(spcAftNode)/100 + "%;"
        //     }
        // }
      }

      if (lnSpcNode === undefined) {
        lnSpcNode = getTextByPathList(laypPrNode, ["a:lnSpc", "a:spcPct", "attrs", "val"]);
        if (lnSpcNode === undefined) {
          lnSpcNode = getTextByPathList(laypPrNode, [
            "a:pPr",
            "a:lnSpc",
            "a:spcPts",
            "attrs",
            "val",
          ]);
          if (lnSpcNode !== undefined) {
            lnSpcNodeType = "Pts";
          }
        }
      }
    }
  }
  if (
    isInLayoutOrMaster &&
    (spcBefNode === undefined || spcAftNode === undefined || lnSpcNode === undefined)
  ) {
    //check in master
    //slideMasterTextStyles
    var slideMasterTextStyles = warpObj["slideMasterTextStyles"];
    var dirLoc = "";
    // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
    var lvl = "a:lvl" + lvl + "pPr";
    switch (type) {
      case "title":
      case "ctrTitle":
        dirLoc = "p:titleStyle";
        break;
      case "body":
      case "obj":
      case "dt":
      case "ftr":
      case "sldNum":
      case "textBox":
        // case "shape":
        dirLoc = "p:bodyStyle";
        break;
      case "shape":
      //case "textBox":
      default:
        dirLoc = "p:otherStyle";
    }
    // if (type == "shape" || type == "textBox") {
    //     lvl = "a:lvl1pPr";
    // }
    var inLvlNode = getTextByPathList(slideMasterTextStyles, [dirLoc, lvl]);
    if (inLvlNode !== undefined) {
      if (spcBefNode === undefined) {
        spcBefNode = getTextByPathList(inLvlNode, ["a:spcBef", "a:spcPts", "attrs", "val"]);
        // if(spcBefNode !== undefined){
        //     spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "pt;"
        // }
        // else{
        //    //i did not found case with percentage
        //     spcBefNode = getTextByPathList(inLvlNode, ["a:spcBef", "a:spcPct","attrs","val"]);
        //     if(spcBefNode !== undefined){
        //         spcBef = "margin-top:" + parseInt(spcBefNode)/100 + "%;"
        //     }
        // }
      }

      if (spcAftNode === undefined) {
        spcAftNode = getTextByPathList(inLvlNode, ["a:spcAft", "a:spcPts", "attrs", "val"]);
        // if(spcAftNode !== undefined){
        //     spcAft = "margin-bottom:" + parseInt(spcAftNode)/100 + "pt;"
        // }
        // else{
        //    //i did not found case with percentage
        //     spcAftNode = getTextByPathList(inLvlNode, ["a:spcAft", "a:spcPct","attrs","val"]);
        //     if(spcAftNode !== undefined){
        //         spcBef = "margin-bottom:" + parseInt(spcAftNode)/100 + "%;"
        //     }
        // }
      }

      if (lnSpcNode === undefined) {
        lnSpcNode = getTextByPathList(inLvlNode, ["a:lnSpc", "a:spcPct", "attrs", "val"]);
        if (lnSpcNode === undefined) {
          lnSpcNode = getTextByPathList(inLvlNode, [
            "a:pPr",
            "a:lnSpc",
            "a:spcPts",
            "attrs",
            "val",
          ]);
          if (lnSpcNode !== undefined) {
            lnSpcNodeType = "Pts";
          }
        }
      }
    }
  }
  var spcBefor = 0,
    spcAfter = 0,
    spcLines = 0;
  var marginTopBottomStr = "";
  if (spcBefNode !== undefined) {
    spcBefor = parseInt(spcBefNode) / 100;
  }
  if (spcAftNode !== undefined) {
    spcAfter = parseInt(spcAftNode) / 100;
  }

  if (lnSpcNode !== undefined && fontSize !== undefined) {
    if (lnSpcNodeType == "Pts") {
      marginTopBottomStr += "padding-top: " + (parseInt(lnSpcNode) / 100 - fontSize) + "px;"; //+ "pt;";
    } else {
      var fct = parseInt(lnSpcNode) / 100000;
      spcLines = fontSize * (fct - 1) - fontSize; // fontSize *
      var pTop = fct > 1 ? spcLines : 0;
      var pBottom = fct > 1 ? fontSize : 0;
      // marginTopBottomStr += "padding-top: " + spcLines + "pt;";
      // marginTopBottomStr += "padding-bottom: " + pBottom + "pt;";
      marginTopBottomStr += "padding-top: " + pBottom + "px;"; // + "pt;";
      marginTopBottomStr += "padding-bottom: " + spcLines + "px;"; // + "pt;";
    }
  }

  //if (spcBefNode !== undefined || lnSpcNode !== undefined) {
  marginTopBottomStr += "margin-top: " + (spcBefor - 1) + "px;"; // + "pt;"; //margin-top: + spcLines // minus 1 - to fix space
  //}
  if (spcAftNode !== undefined || lnSpcNode !== undefined) {
    //marginTopBottomStr += "margin-bottom: " + ((spcAfter - fontSize < 0) ? 0 : (spcAfter - fontSize)) + "pt;"; //margin-bottom: + spcLines
    //marginTopBottomStr += "margin-bottom: " + spcAfter * (1 / 4) + "px;";// + "pt;";
    marginTopBottomStr += "margin-bottom: " + spcAfter + "px;"; // + "pt;";
  }

  //console.log("getVerticalMargins 2 fontSize:", fontSize, "lnSpcNode:", lnSpcNode, "spcLines:", spcLines, "spcBefor:", spcBefor, "spcAfter:", spcAfter)
  //console.log("getVerticalMargins 3 ", marginTopBottomStr, pNode, warpObj)

  //return spcAft + spcBef;
  return marginTopBottomStr;
}
