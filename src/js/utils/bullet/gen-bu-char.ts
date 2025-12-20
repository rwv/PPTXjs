import { getTextByPathList } from "../object";
import { getFontColorPr, getFontSize } from "../font";
import { getLayoutAndMasterNode } from "../layout";
import { getSolidFill } from "../color";
import { getHtmlBullet } from "../bullet";
import { getMimeType, base64ArrayBuffer } from "../media";

/**
 * Generate bullet character HTML for a text paragraph
 *
 * Handles three types of bullets:
 * - TYPE_BULLET: Character bullets (•, ■, etc.) with custom fonts
 * - TYPE_NUMERIC: Numbered bullets (1, 2, 3, a, b, c, i, ii, iii, etc.)
 * - TYPE_BULPIC: Picture bullets (embedded images)
 *
 * Resolves bullet properties through the standard fallback hierarchy:
 * paragraph → lstStyle → slideLayout → slideMaster
 *
 * @param node - Paragraph node containing bullet definition
 * @param i - Paragraph index (used for variable naming, but shadowed in loop)
 * @param spNode - Shape node containing the text
 * @param textBodyNode - Text body node with list styles
 * @param pFontStyle - Parent font style for color inheritance
 * @param idx - Placeholder index for layout lookup
 * @param type - Shape type for layout resolution
 * @param warpObj - Warp object containing slide resources and styles
 * @param slideFactor - EMU to pixel conversion factor
 * @param fontSizeFactor - Font size scaling factor
 * @returns Array [bulletHTML, marginValue, fontValue] or empty string if no bullet
 */
export function genBuChar(
    node: any,
    i: any,
    spNode: any,
    textBodyNode: any,
    pFontStyle: any,
    idx: any,
    type: any,
    warpObj: any,
    slideFactor: number,
    fontSizeFactor: number
): string | [string, number, number] {
    //console.log("genBuChar node: ", node, ", spNode: ", spNode, ", pFontStyle: ", pFontStyle, "type", type)
    ///////////////////////////////////////Amir///////////////////////////////
    var sldMstrTxtStyles = warpObj["slideMasterTextStyles"];
    var lstStyle = textBodyNode["a:lstStyle"];

    var rNode = getTextByPathList(node, ["a:r"]);
    if (rNode !== undefined && rNode.constructor === Array) {
        rNode = rNode[0]; //bullet only to first "a:r"
    }
    var lvl = parseInt(getTextByPathList(node["a:pPr"], ["attrs", "lvl"])) + 1;
    if (isNaN(lvl)) {
        lvl = 1;
    }
    var lvlStr = "a:lvl" + lvl + "pPr";
    var dfltBultColor, dfltBultSize, bultColor, bultSize, color_tye;

    if (rNode !== undefined) {
        dfltBultColor = getFontColorPr(rNode, spNode, lstStyle, pFontStyle, lvl, idx, type, warpObj, slideFactor);
        color_tye = dfltBultColor[2];
        dfltBultSize = getFontSize(rNode, textBodyNode, pFontStyle, lvl, type, warpObj, fontSizeFactor);
    } else {
        return "";
    }
    //console.log("Bullet Size: " + bultSize);

    var bullet = "", marRStr = "", marLStr = "", margin_val=0, font_val=0;
    /////////////////////////////////////////////////////////////////


    var pPrNode = node["a:pPr"];
    var BullNONE = getTextByPathList(pPrNode, ["a:buNone"]);
    if (BullNONE !== undefined) {
        return "";
    }

    var buType = "TYPE_NONE";

    var layoutMasterNode = getLayoutAndMasterNode(node, idx, type, warpObj);
    var pPrNodeLaout = layoutMasterNode.nodeLaout;
    var pPrNodeMaster = layoutMasterNode.nodeMaster;

    var buChar = getTextByPathList(pPrNode, ["a:buChar", "attrs", "char"]);
    var buNum = getTextByPathList(pPrNode, ["a:buAutoNum", "attrs", "type"]);
    var buPic = getTextByPathList(pPrNode, ["a:buBlip"]);
    if (buChar !== undefined) {
        buType = "TYPE_BULLET";
    }
    if (buNum !== undefined) {
        buType = "TYPE_NUMERIC";
    }
    if (buPic !== undefined) {
        buType = "TYPE_BULPIC";
    }

    var buFontSize = getTextByPathList(pPrNode, ["a:buSzPts", "attrs", "val"]);
    if (buFontSize === undefined) {
        buFontSize = getTextByPathList(pPrNode, ["a:buSzPct", "attrs", "val"]);
        if (buFontSize !== undefined) {
            var prcnt = parseInt(buFontSize) / 100000;
            //dfltBultSize = XXpt
            //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
            // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
            var dfltBultSizeNoPt = parseInt(dfltBultSize, "px");
            // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
            bultSize = prcnt * (parseInt(dfltBultSizeNoPt)) + "px";// + "pt";
        }
    } else {
        bultSize = (parseInt(buFontSize) / 100) * fontSizeFactor + "px";
    }

    //get definde bullet COLOR
    var buClrNode = getTextByPathList(pPrNode, ["a:buClr"]);


    if (buChar === undefined && buNum === undefined && buPic === undefined) {

        if (lstStyle !== undefined) {
            BullNONE = getTextByPathList(lstStyle, [lvlStr,"a:buNone"]);
            if (BullNONE !== undefined) {
                return "";
            }
            buType = "TYPE_NONE";
            buChar = getTextByPathList(lstStyle, [lvlStr,"a:buChar", "attrs", "char"]);
            buNum = getTextByPathList(lstStyle, [lvlStr,"a:buAutoNum", "attrs", "type"]);
            buPic = getTextByPathList(lstStyle, [lvlStr,"a:buBlip"]);
            if (buChar !== undefined) {
                buType = "TYPE_BULLET";
            }
            if (buNum !== undefined) {
                buType = "TYPE_NUMERIC";
            }
            if (buPic !== undefined) {
                buType = "TYPE_BULPIC";
            }
            if (buChar !== undefined || buNum !== undefined || buPic !== undefined) {
                pPrNode = lstStyle[lvlStr];
            }
        }
    }
    if (buChar === undefined && buNum === undefined && buPic === undefined) {
        //check in slidelayout and masterlayout - TODO
        if (pPrNodeLaout !== undefined) {
            BullNONE = getTextByPathList(pPrNodeLaout, ["a:buNone"]);
            if (BullNONE !== undefined) {
                return "";
            }
            buType = "TYPE_NONE";
            buChar = getTextByPathList(pPrNodeLaout, ["a:buChar", "attrs", "char"]);
            buNum = getTextByPathList(pPrNodeLaout, ["a:buAutoNum", "attrs", "type"]);
            buPic = getTextByPathList(pPrNodeLaout, ["a:buBlip"]);
            if (buChar !== undefined) {
                buType = "TYPE_BULLET";
            }
            if (buNum !== undefined) {
                buType = "TYPE_NUMERIC";
            }
            if (buPic !== undefined) {
                buType = "TYPE_BULPIC";
            }
        }
        if (buChar === undefined && buNum === undefined && buPic === undefined) {
            //masterlayout

            if (pPrNodeMaster !== undefined) {
                BullNONE = getTextByPathList(pPrNodeMaster, ["a:buNone"]);
                if (BullNONE !== undefined) {
                    return "";
                }
                buType = "TYPE_NONE";
                buChar = getTextByPathList(pPrNodeMaster, ["a:buChar", "attrs", "char"]);
                buNum = getTextByPathList(pPrNodeMaster, ["a:buAutoNum", "attrs", "type"]);
                buPic = getTextByPathList(pPrNodeMaster, ["a:buBlip"]);
                if (buChar !== undefined) {
                    buType = "TYPE_BULLET";
                }
                if (buNum !== undefined) {
                    buType = "TYPE_NUMERIC";
                }
                if (buPic !== undefined) {
                    buType = "TYPE_BULPIC";
                }
            }

        }

    }
    //rtl
    var getRtlVal = getTextByPathList(pPrNode, ["attrs", "rtl"]);
    if (getRtlVal === undefined) {
        getRtlVal = getTextByPathList(pPrNodeLaout, ["attrs", "rtl"]);
        if (getRtlVal === undefined && type != "shape") {
            getRtlVal = getTextByPathList(pPrNodeMaster, ["attrs", "rtl"]);
        }
    }
    var isRTL = false;
    if (getRtlVal !== undefined && getRtlVal == "1") {
        isRTL = true;
    }
    //align
    var alignNode = getTextByPathList(pPrNode, ["attrs", "algn"]); //"l" | "ctr" | "r" | "just" | "justLow" | "dist" | "thaiDist
    if (alignNode === undefined) {
        alignNode = getTextByPathList(pPrNodeLaout, ["attrs", "algn"]);
        if (alignNode === undefined) {
            alignNode = getTextByPathList(pPrNodeMaster, ["attrs", "algn"]);
        }
    }
    //indent?
    var indentNode = getTextByPathList(pPrNode, ["attrs", "indent"]);
    if (indentNode === undefined) {
        indentNode = getTextByPathList(pPrNodeLaout, ["attrs", "indent"]);
        if (indentNode === undefined) {
            indentNode = getTextByPathList(pPrNodeMaster, ["attrs", "indent"]);
        }
    }
    var indent = 0;
    if (indentNode !== undefined) {
        indent = parseInt(indentNode) * slideFactor;
    }
    //marL
    var marLNode = getTextByPathList(pPrNode, ["attrs", "marL"]);
    if (marLNode === undefined) {
        marLNode = getTextByPathList(pPrNodeLaout, ["attrs", "marL"]);
        if (marLNode === undefined) {
            marLNode = getTextByPathList(pPrNodeMaster, ["attrs", "marL"]);
        }
    }
    //console.log("genBuChar() isRTL", isRTL, "alignNode:", alignNode)
    if (marLNode !== undefined) {
        var marginLeft = parseInt(marLNode) * slideFactor;
        if (isRTL) {// && alignNode == "r") {
            marLStr = "padding-right:";// "margin-right: ";
        } else {
            marLStr = "padding-left:";//"margin-left: ";
        }
        margin_val = ((marginLeft + indent < 0) ? 0 : (marginLeft + indent));
        marLStr += margin_val + "px;";
    }

    //marR?
    var marRNode = getTextByPathList(pPrNode, ["attrs", "marR"]);
    if (marRNode === undefined && marLNode === undefined) {
        //need to check if this posble - TODO
        marRNode = getTextByPathList(pPrNodeLaout, ["attrs", "marR"]);
        if (marRNode === undefined) {
            marRNode = getTextByPathList(pPrNodeMaster, ["attrs", "marR"]);
        }
    }
    if (marRNode !== undefined) {
        var marginRight = parseInt(marRNode) * slideFactor;
        if (isRTL) {// && alignNode == "r") {
            marLStr = "padding-right:";// "margin-right: ";
        } else {
            marLStr = "padding-left:";//"margin-left: ";
        }
        marRStr += ((marginRight + indent < 0) ? 0 : (marginRight + indent)) + "px;";
    }

    if (buType != "TYPE_NONE") {
        //var buFontAttrs = getTextByPathList(pPrNode, ["a:buFont", "attrs"]);
    }
    //console.log("Bullet Type: " + buType);
    //console.log("NumericTypr: " + buNum);
    //console.log("buChar: " + (buChar === undefined?'':buChar.charCodeAt(0)));
    //get definde bullet COLOR
    if (buClrNode === undefined){
        //lstStyle
        buClrNode = getTextByPathList(lstStyle, [lvlStr, "a:buClr"]);
    }
    if (buClrNode === undefined) {
        buClrNode = getTextByPathList(pPrNodeLaout, ["a:buClr"]);
        if (buClrNode === undefined) {
            buClrNode = getTextByPathList(pPrNodeMaster, ["a:buClr"]);
        }
    }
    var defBultColor;
    if (buClrNode !== undefined) {
        defBultColor = getSolidFill(buClrNode, undefined, undefined, warpObj);
    } else {
        if (pFontStyle !== undefined) {
            //console.log("genBuChar pFontStyle: ", pFontStyle)
            defBultColor = getSolidFill(pFontStyle, undefined, undefined, warpObj);
        }
    }
    if (defBultColor === undefined || defBultColor == "NONE") {
        bultColor = dfltBultColor;
    } else {
        bultColor = [defBultColor, "", "solid"];
        color_tye = "solid";
    }
    //console.log("genBuChar node:", node, "pPrNode", pPrNode, " buClrNode: ", buClrNode, "defBultColor:", defBultColor,"dfltBultColor:" , dfltBultColor , "bultColor:", bultColor)

    //console.log("genBuChar: buClrNode: ", buClrNode, "bultColor", bultColor)
    //get definde bullet SIZE
    if (buFontSize === undefined) {
        buFontSize = getTextByPathList(pPrNodeLaout, ["a:buSzPts", "attrs", "val"]);
        if (buFontSize === undefined) {
            buFontSize = getTextByPathList(pPrNodeLaout, ["a:buSzPct", "attrs", "val"]);
            if (buFontSize !== undefined) {
                var prcnt = parseInt(buFontSize) / 100000;
                //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                var dfltBultSizeNoPt = parseInt(dfltBultSize, "px");
                // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                bultSize = prcnt * (parseInt(dfltBultSizeNoPt)) + "px";// + "pt";
            }
        }else{
            bultSize = (parseInt(buFontSize) / 100) * fontSizeFactor + "px";
        }
    }
    if (buFontSize === undefined) {
        buFontSize = getTextByPathList(pPrNodeMaster, ["a:buSzPts", "attrs", "val"]);
        if (buFontSize === undefined) {
            buFontSize = getTextByPathList(pPrNodeMaster, ["a:buSzPct", "attrs", "val"]);
            if (buFontSize !== undefined) {
                var prcnt = parseInt(buFontSize) / 100000;
                //dfltBultSize = XXpt
                //var dfltBultSizeNoPt = dfltBultSize.substr(0, dfltBultSize.length - 2);
                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                var dfltBultSizeNoPt = parseInt(dfltBultSize, "px");
                // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                bultSize = prcnt * (parseInt(dfltBultSizeNoPt)) + "px";// + "pt";
            }
        } else {
            bultSize = (parseInt(buFontSize) / 100) * fontSizeFactor + "px";
        }
    }
    if (buFontSize === undefined) {
        bultSize = dfltBultSize;
    }
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    font_val = parseInt(bultSize, "px");
    ////////////////////////////////////////////////////////////////////////
    if (buType == "TYPE_BULLET") {
        var typefaceNode = getTextByPathList(pPrNode, ["a:buFont", "attrs", "typeface"]);
        var typeface = "";
        if (typefaceNode !== undefined) {
            typeface = "font-family: " + typefaceNode;
        }
        // var marginLeft = parseInt(getTextByPathList(marLNode)) * slideFactor;
        // var marginRight = parseInt(getTextByPathList(marRNode)) * slideFactor;
        // if (isNaN(marginLeft)) {
        //     marginLeft = 328600 * slideFactor;
        // }
        // if (isNaN(marginRight)) {
        //     marginRight = 0;
        // }

        bullet = "<div style='height: 100%;" + typeface + ";" +
            marLStr + marRStr +
            "font-size:" + bultSize + ";" ;

        //bullet += "display: table-cell;";
        //"line-height: 0px;";
        if (color_tye == "solid") {
            if (bultColor[0] !== undefined && bultColor[0] != "") {
                bullet += "color:#" + bultColor[0] + "; ";
            }
            if (bultColor[1] !== undefined && bultColor[1] != "" && bultColor[1] != ";") {
                bullet += "text-shadow:" + bultColor[1] + ";";
            }
            //no highlight/background-color to bullet
            // if (bultColor[3] !== undefined && bultColor[3] != "") {
            //     styleText += "background-color: #" + bultColor[3] + ";";
            // }
        } else if (color_tye == "pattern" || color_tye == "pic" || color_tye == "gradient") {
            if (color_tye == "pattern") {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                bullet += "background:" + bultColor[0][0] + ";";
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                if (bultColor[0][1] !== null && bultColor[0][1] !== undefined && bultColor[0][1] != "") {
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    bullet += "background-size:" + bultColor[0][1] + ";";//" 2px 2px;" +
                }
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                if (bultColor[0][2] !== null && bultColor[0][2] !== undefined && bultColor[0][2] != "") {
                    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                    bullet += "background-position:" + bultColor[0][2] + ";";//" 2px 2px;" +
                }
                // bullet += "-webkit-background-clip: text;" +
                //     "background-clip: text;" +
                //     "color: transparent;" +
                //     "-webkit-text-stroke: " + bultColor[1].border + ";" +
                //     "filter: " + bultColor[1].effcts + ";";
            } else if (color_tye == "pic") {
                bullet += bultColor[0] + ";";
                // bullet += "-webkit-background-clip: text;" +
                //     "background-clip: text;" +
                //     "color: transparent;" +
                //     "-webkit-text-stroke: " + bultColor[1].border + ";";

            } else if (color_tye == "gradient") {

                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                var colorAry = bultColor[0].color;
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                var rot = bultColor[0].rot;

                bullet += "background: linear-gradient(" + rot + "deg,";
                // @ts-expect-error TS(2403): Subsequent variable declarations must have the sam... Remove this comment to see the full error message
                for (var i = 0; i < colorAry.length; i++) {
                    if (i == colorAry.length - 1) {
                        bullet += "#" + colorAry[i] + ");";
                    } else {
                        bullet += "#" + colorAry[i] + ", ";
                    }
                }
                // bullet += "color: transparent;" +
                //     "-webkit-background-clip: text;" +
                //     "background-clip: text;" +
                //     "-webkit-text-stroke: " + bultColor[1].border + ";";
            }
            bullet += "-webkit-background-clip: text;" +
                "background-clip: text;" +
                "color: transparent;";
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (bultColor[1].border !== undefined && bultColor[1].border !== "") {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                bullet += "-webkit-text-stroke: " + bultColor[1].border + ";";
            }
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (bultColor[1].effcts !== undefined && bultColor[1].effcts !== "") {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                bullet += "filter: " + bultColor[1].effcts + ";";
            }
        }

        if (isRTL) {
            //bullet += "display: inline-block;white-space: nowrap ;direction:rtl"; // float: right;
            bullet += "white-space: nowrap ;direction:rtl"; // display: table-cell;;
        }
        // @ts-expect-error TS(2339): Property 'MSInputMethodContext' does not exist on ... Remove this comment to see the full error message
        var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        var htmlBu = buChar;

        if (!isIE11) {
            //ie11 does not support unicode ?
            htmlBu = getHtmlBullet(typefaceNode, buChar);
        }
        bullet += "'><div style='line-height: " + (font_val/2) + "px;'>" + htmlBu + "</div></div>"; //font_val
        //}
        // else {
        //     marginLeft = 328600 * slideFactor * lvl;

        //     bullet = "<div style='" + marLStr + "'>" + buChar + "</div>";
        // }
    } else if (buType == "TYPE_NUMERIC") { ///////////Amir///////////////////////////////
        //if (buFontAttrs !== undefined) {
        // var marginLeft = parseInt(getTextByPathList(pPrNode, ["attrs", "marL"])) * slideFactor;
        // var marginRight = parseInt(buFontAttrs["pitchFamily"]);

        // if (isNaN(marginLeft)) {
        //     marginLeft = 328600 * slideFactor;
        // }
        // if (isNaN(marginRight)) {
        //     marginRight = 0;
        // }
        //var typeface = buFontAttrs["typeface"];

        bullet = "<div style='height: 100%;" + marLStr + marRStr +
            "color:#" + bultColor[0] + ";" +
            "font-size:" + bultSize + ";";// +
        //"line-height: 0px;";
        if (isRTL) {
            bullet += "display: inline-block;white-space: nowrap ;direction:rtl;"; // float: right;
        } else {
            bullet += "display: inline-block;white-space: nowrap ;direction:ltr;"; //float: left;
        }
        bullet += "' data-bulltname = '" + buNum + "' data-bulltlvl = '" + lvl + "' class='numeric-bullet-style'></div>";
        // } else {
        //     marginLeft = 328600 * slideFactor * lvl;
        //     bullet = "<div style='margin-left: " + marginLeft + "px;";
        //     if (isRTL) {
        //         bullet += " float: right; direction:rtl;";
        //     } else {
        //         bullet += " float: left; direction:ltr;";
        //     }
        //     bullet += "' data-bulltname = '" + buNum + "' data-bulltlvl = '" + lvl + "' class='numeric-bullet-style'></div>";
        // }

    } else if (buType == "TYPE_BULPIC") { //PIC BULLET
        // var marginLeft = parseInt(getTextByPathList(pPrNode, ["attrs", "marL"])) * slideFactor;
        // var marginRight = parseInt(getTextByPathList(pPrNode, ["attrs", "marR"])) * slideFactor;

        // if (isNaN(marginRight)) {
        //     marginRight = 0;
        // }
        // //console.log("marginRight: "+marginRight)
        // //buPic
        // if (isNaN(marginLeft)) {
        //     marginLeft = 328600 * slideFactor;
        // } else {
        //     marginLeft = 0;
        // }
        //var buPicId = getTextByPathList(buPic, ["a:blip","a:extLst","a:ext","asvg:svgBlip" , "attrs", "r:embed"]);
        var buPicId = getTextByPathList(buPic, ["a:blip", "attrs", "r:embed"]);
        var svgPicPath = "";
        var buImg;
        if (buPicId !== undefined) {
            //svgPicPath = warpObj["slideResObj"][buPicId]["target"];
            //buImg = warpObj["zip"].file(svgPicPath).asText();
            //}else{
            //buPicId = getTextByPathList(buPic, ["a:blip", "attrs", "r:embed"]);
            var imgPath = warpObj["slideResObj"][buPicId]["target"];
            //console.log("imgPath: ", imgPath);
            var imgArrayBuffer = warpObj["zip"].file(imgPath).asArrayBuffer();
            var imgExt = imgPath.split(".").pop();
            var imgMimeType = getMimeType(imgExt);
            buImg = "<img src='data:" + imgMimeType + ";base64," + base64ArrayBuffer(imgArrayBuffer) + "' style='width: 100%;'/>"// height: 100%
            //console.log("imgPath: "+imgPath+"\nimgMimeType: "+imgMimeType)
        }
        if (buPicId === undefined) {
            buImg = "&#8227;";
        }
        bullet = "<div style='height: 100%;" + marLStr + marRStr +
            "width:" + bultSize + ";display: inline-block; ";// +
        //"line-height: 0px;";
        if (isRTL) {
            bullet += "display: inline-block;white-space: nowrap ;direction:rtl;"; //direction:rtl; float: right;
        }
        bullet += "'>" + buImg + "  </div>";
        //////////////////////////////////////////////////////////////////////////////////////
    }
    // else {
    //     bullet = "<div style='margin-left: " + 328600 * slideFactor * lvl + "px" +
    //         "; margin-right: " + 0 + "px;'></div>";
    // }
    //console.log("genBuChar: width: ", $(bullet).outerWidth())
    return [bullet, margin_val, font_val];//$(bullet).outerWidth()];
}
