/**
 * pptxjs.js
 * Ver. : 1.21.1
 * last update: 16/11/2021
 * Author: meshesha , https://github.com/meshesha
 * LICENSE: MIT
 * url:https://pptx.js.org/
 * fix issues:
 * [#16](https://github.com/meshesha/PPTXjs/issues/16)
 */
import { shapePie } from "./utils/shape/shape-pie";
import { shapeArc } from "./utils/shape/shape-arc";
import { shapeSnipRoundRect } from "./utils/shape/shape-snip-round-rect";
import { shapeGear } from "./utils/shape/shape-gear";
import {
  rgba2hex,
  getSchemeColorFromTheme,
  getSolidFill,
} from "./utils/color";
import { getHtmlBullet, genBuChar } from "./utils/bullet";
import {
  getMimeType,
  getBase64ImageDimensions,
  isVideoLink,
  extractFileExtension,
  base64ArrayBuffer,
  processPicNode,
} from "./utils/media";
import {
  romanize,
  alphaNumeric,
  archaicNumbers,
  hebrew2Minus,
  getNumTypeNum,
  setNumericBullets,
  genSpanElement,
  genTextBody,
} from "./utils/text";
import { escapeHtml } from "./utils/string";
import { getSvgGradient, svgAngle, getMiddleStops, getSvgImagePattern } from "./utils/svg";
import {
  getPosition,
  getSize,
  getVerticalAlign,
  getVerticalMargins,
  getHorizontalAlign,
  getPregraphDir,
  getContentDir,
  getLayoutAndMasterNode,
  getTextHorizontalAlign,
  getTextVerticalAlign,
  angleToDegrees,
  getPregraphMargn,
} from "./utils/layout";
import { getFontSize, getFontType, getFontBold, getFontItalic, getFontDecoration, getFontColorPr } from "./utils/font";
import {
  getFillType,
  getGradientFill,
  getPicFill,
  getBgPicFill,
  getPatternFill,
  getLinerGrandient,
  getBgGradientFill,
  getShapeFill,
  getSlideBackgroundFill,
} from "./utils/fill";
import { getBorder, getTableBorders } from "./utils/border";
import {
  getTextByPathList,
  getTextByPathStr,
  setTextByPathList,
  eachElement,
} from "./utils/object";
import { extractChartData, genChart, processSingleMsg, processMsgQueue } from "./utils/chart";
import { genGlobalCSS } from "./utils/css";
import { updateProgressBar } from "./utils/ui";
import { initSlideMode } from "./utils/presentation";
import { processCxnSpNode, genShape } from "./utils/shape";
import { getTableCellParams, genTable } from "./utils/table";
import { processSpNode, processGroupSpNode, processGraphicFrameNode, processNodesInSlide } from "./utils/node";
import { genDiagram } from "./utils/diagram";
import { getBackground } from "./utils/slide";
import tinycolor from "tinycolor2";
import { tXml } from "./utils/vendors/txml";
import { readXmlFile, getContentTypes, getSlideSizeAndSetDefaultTextStyle, indexNodes } from "./utils/xml";
import type { JsZip } from "./types/jszip";

(function ($) {
    $.fn.pptxToHtml = function (options: any) {
        //var worker;
        var $result = $(this);
        var divId = $result.attr("id");

        var isDone = false;

        var MsgQueue = new Array();

        //var slideLayoutClrOvride = "";

        var defaultTextStyle: any = null;

        var chartID = 0;

        var _order = 1;

        var app_verssion: any ;

        var tableStyles: any;

        var rtl_langs_array = ["he-IL", "ar-AE", "ar-SA", "dv-MV", "fa-IR","ur-PK"]

        var slideFactor = 96 / 914400;
        var fontSizeFactor = 4 / 3.2;
        ////////////////////// 
        var slideWidth = 0;
        var slideHeight = 0;
        var isSlideMode = false;
        var processFullTheme = true;
        var styleTable = {};
        var settings = $.extend(true, {
            // These are the defaults.
            pptxFileUrl: "",
            fileInputId: "",
            slidesScale: "", //Change Slides scale by percent
            slideMode: false, /** true,false*/
            slideType: "divs2slidesjs",  /*'divs2slidesjs' (default) , 'revealjs'(https://revealjs.com)  -TODO*/
            revealjsPath: "", /*path to js file of revealjs - TODO*/
            keyBoardShortCut: false,  /** true,false ,condition: slideMode: true XXXXX - need to remove - this is doublcated*/
            mediaProcess: true, /** true,false: if true then process video and audio files */
            jsZipV2: false,
            themeProcess: true, /*true (default) , false, "colorsAndImageOnly"*/
            incSlide:{
                width: 0,
                height: 0
            },
            slideModeConfig: {
                first: 1,
                nav: true, /** true,false : show or not nav buttons*/
                navTxtColor: "black", /** color */
                keyBoardShortCut: true, /** true,false ,condition: */
                showSlideNum: true, /** true,false */
                showTotalSlideNum: true, /** true,false */
                autoSlide: true, /** false or seconds , F8 to active ,keyBoardShortCut: true */
                randomAutoSlide: false, /** true,false ,autoSlide:true */
                loop: false,  /** true,false */
                background: false, /** false or color*/
                transition: "default", /** transition type: "slid","fade","default","random" , to show transition efects :transitionTime > 0.5 */
                transitionTime: 1 /** transition time between slides in seconds */
            },
            revealjsConfig: {}
        }, options);

        processFullTheme = settings.themeProcess;

        $("#" + divId).prepend(
            $("<div></div>").attr({
                "class": "slides-loadnig-msg",
                "style": "display:block; width:100%; color:white; background-color: #ddd;"
            })/*.html("Loading...")*/
                .html($("<div></div>").attr({
                    "class": "slides-loading-progress-bar",
                    "style": "width: 1%; background-color: #4775d1;"
                }).html("<span style='text-align: center;'>Loading... (1%)</span>"))
        );
        if (settings.slideMode) {
            
            if (!jQuery().divs2slides) {
                
                jQuery.getScript('./js/divs2slides.js');
            }
        }
        if (settings.jsZipV2 !== false) {
            
            jQuery.getScript(settings.jsZipV2);
            if (localStorage.getItem('isPPTXjsReLoaded') !== 'yes') {
                localStorage.setItem('isPPTXjsReLoaded', 'yes');
                location.reload();
            }
        }

        if (settings.keyBoardShortCut) {
            $(document).bind("keydown", function (event: any) {
                event.preventDefault();
                var key = event.keyCode;
                console.log(key, isDone)
                if (key == 116 && !isSlideMode) { //F5
                    isSlideMode = true;
                    initSlideMode(divId, settings);
                } else if (key == 116 && isSlideMode) {
                    //exit slide mode - TODO

                }
            });
        }
        if (settings.pptxFileUrl != "") {
            try{
                // @ts-expect-error TS(2304): Cannot find name 'JSZipUtils'.
                JSZipUtils.getBinaryContent(settings.pptxFileUrl, function (err: any, content: any) {
                    var blob = new Blob([content]);
                    blob.arrayBuffer().then(function(arrayBuffer) {
                        convertToHtml(arrayBuffer);
                    });
                });
            }catch(e){
                console.error("file url error (" + settings.pptxFileUrl+ "0)")
                $(".slides-loadnig-msg").remove();
            }
        } else {
            $(".slides-loadnig-msg").remove()
        }
        if (settings.fileInputId != "") {
            $("#" + settings.fileInputId).on("change", function (evt: any) {
                $result.html("");
                var file = evt.target.files[0];
                // var fileName = file[0].name;
                //var fileSize = file[0].size;
                var fileType = file.type;
                if (fileType == "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                    file.arrayBuffer().then(function(arrayBuffer: any) {
                        convertToHtml(arrayBuffer);
                    });
                } else {
                    alert("This is not pptx file");
                }
            });
        }


        function convertToHtml(file: any) {
            //'use strict';
            //console.log("file", file, "size:", file.byteLength);
            if (file.byteLength < 10){
                console.error("file url error (" + settings.pptxFileUrl + "0)")
                $(".slides-loadnig-msg").remove();
                return;
            }
            // @ts-expect-error TS(2304): Cannot find name 'JSZip'.
            var zip: JsZip = new JSZip(), s;
            //if (typeof file === 'string') { // Load
            zip = zip.load(file);  //zip.load(file, { base64: true });
            var rslt_ary = processPPTX(zip);
            //s = readXmlFile(zip, 'ppt/tableStyles.xml');
            //var slidesHeight = $("#" + divId + " .slide").height();
            for (var i = 0; i < rslt_ary.length; i++) {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                switch (rslt_ary[i]["type"]) {
                    case "slide":
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        $result.append(rslt_ary[i]["data"]);
                        break;
                    case "pptx-thumb":
                        //$("#pptx-thumb").attr("src", "data:image/jpeg;base64," +rslt_ary[i]["data"]);
                        break;
                    case "slideSize":
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        slideWidth = rslt_ary[i]["data"].width;
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        slideHeight = rslt_ary[i]["data"].height;
                        /*
                        $("#"+divId).css({
                            'width': slideWidth + 80,
                            'height': slideHeight + 60
                        });
                        */
                        break;
                    case "globalCSS":
                        //console.log(rslt_ary[i]["data"])
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        $result.append("<style>" + rslt_ary[i]["data"] + "</style>");
                        break;
                    case "ExecutionTime":
                        processMsgQueue(MsgQueue);
                        setNumericBullets($(".block"));
                        setNumericBullets($("table td"));

                        isDone = true;

                        if (settings.slideMode && !isSlideMode) {
                            isSlideMode = true;
                            initSlideMode(divId, settings);
                        } else if (!settings.slideMode) {
                            $(".slides-loadnig-msg").remove();
                        }
                        break;
                    case "progress-update":
                        //console.log(rslt_ary[i]["data"]); //update progress bar - TODO
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        updateProgressBar(rslt_ary[i]["data"])
                        break;
                    default:
                }
            }
            if (!settings.slideMode || (settings.slideMode && settings.slideType == "revealjs")) {

                if (document.getElementById("all_slides_warpper") === null) {
                    $("#" + divId + " .slide").wrapAll("<div id='all_slides_warpper' class='slides'></div>");
                    //$("#" + divId + " .slides").wrap("<div class='reveal'></div>");
                }

                if (settings.slideMode && settings.slideType == "revealjs") {
                    $("#" + divId).addClass("reveal")
                }
            }

            var sScale = settings.slidesScale;
            var trnsfrmScl = "";
            if (sScale != "") {
                var numsScale = parseInt(sScale);
                var scaleVal = numsScale / 100;
                if (settings.slideMode && settings.slideType != "revealjs") {
                    trnsfrmScl = 'transform:scale(' + scaleVal + '); transform-origin:top';
                }
            }

            var slidesHeight = $("#" + divId + " .slide").height();
            var numOfSlides = $("#" + divId + " .slide").length;
            // @ts-expect-error TS(2454): Variable 'scaleVal' is used before being assigned.
            var sScaleVal = (sScale != "") ? scaleVal : 1;
            //console.log("slidesHeight: " + slidesHeight + "\nnumOfSlides: " + numOfSlides + "\nScale: " + sScaleVal)

            $("#all_slides_warpper").attr({
                style: trnsfrmScl + ";height: " + (numOfSlides * slidesHeight * sScaleVal) + "px"
            })

            //}
        }


        function processPPTX(zip: JsZip) {
            var post_ary = [];
            var dateBefore = new Date();

            if (zip.file("docProps/thumbnail.jpeg") !== null) {
                var pptxThumbImg = base64ArrayBuffer(zip.file("docProps/thumbnail.jpeg").asArrayBuffer());
                post_ary.push({
                    "type": "pptx-thumb",
                    "data": pptxThumbImg,
                    "slide_num": -1
                });
            }

            var filesInfo = getContentTypes(zip);
            var slideSize = getSlideSizeAndSetDefaultTextStyle(zip, slideFactor, settings);
            app_verssion = slideSize.appVersion;
            defaultTextStyle = slideSize.defaultTextStyle;
            slideWidth = slideSize.width;
            slideHeight = slideSize.height;
            tableStyles = readXmlFile(zip, "ppt/tableStyles.xml");
            //console.log("slideSize: ", slideSize)
            post_ary.push({
                "type": "slideSize",
                "data": slideSize,
                "slide_num": 0
            });

            var numOfSlides = filesInfo["slides"].length;
            for (var i = 0; i < numOfSlides; i++) {
                var filename = filesInfo["slides"][i];
                var filename_no_path = "";
                var filename_no_path_ary = [];
                if (filename.indexOf("/") != -1) {
                    filename_no_path_ary = filename.split("/");
                    filename_no_path = filename_no_path_ary.pop();
                } else {
                    filename_no_path = filename;
                }
                var filename_no_path_no_ext = "";
                if (filename_no_path.indexOf(".") != -1) {
                    var filename_no_path_no_ext_ary = filename_no_path.split(".");
                    var slide_ext = filename_no_path_no_ext_ary.pop();
                    filename_no_path_no_ext = filename_no_path_no_ext_ary.join(".");
                }
                var slide_number = 1;
                if (filename_no_path_no_ext != "" && filename_no_path.indexOf("slide") != -1) {
                    slide_number = Number(filename_no_path_no_ext.substr(5));
                }
                var slideHtml = processSingleSlide(zip, filename, i, slideSize);
                post_ary.push({
                    "type": "slide",
                    "data": slideHtml,
                    "slide_num": slide_number,
                    "file_name": filename_no_path_no_ext
                });
                post_ary.push({
                    "type": "progress-update",
                    "slide_num": (numOfSlides + i + 1),
                    "data": (i + 1) * 100 / numOfSlides
                });
            }

            post_ary.sort(function (a, b) {
                return a.slide_num - b.slide_num;
            });

            post_ary.push({
                "type": "globalCSS",
                "data": genGlobalCSS(styleTable, settings, slideWidth)
            });

            var dateAfter = new Date();
            post_ary.push({
                "type": "ExecutionTime",
                // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                "data": dateAfter - dateBefore
            });
            return post_ary;
        }


        function processSingleSlide(zip: JsZip, sldFileName: any, index: any, slideSize: any) {
            /*
            self.postMessage({
                "type": "INFO",
                "data": "Processing slide" + (index + 1)
            });
            */
            // =====< Step 1 >=====
            // Read relationship filename of the slide (Get slideLayoutXX.xml)
            // @sldFileName: ppt/slides/slide1.xml
            // @resName: ppt/slides/_rels/slide1.xml.rels
            var resName = sldFileName.replace("slides/slide", "slides/_rels/slide") + ".rels";
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            var resContent = readXmlFile(zip, resName);
            var RelationshipArray = resContent["Relationships"]["Relationship"];
            //console.log("RelationshipArray: " , RelationshipArray)
            var layoutFilename = "";
            var diagramFilename = "";
            var slideResObj = {};
            if (RelationshipArray.constructor === Array) {
                for (var i = 0; i < RelationshipArray.length; i++) {
                    switch (RelationshipArray[i]["attrs"]["Type"]) {
                        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout":
                            layoutFilename = RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/");
                            break;
                        case "http://schemas.microsoft.com/office/2007/relationships/diagramDrawing":
                            diagramFilename = RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/");
                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                            slideResObj[RelationshipArray[i]["attrs"]["Id"]] = {
                                "type": RelationshipArray[i]["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
                                "target": RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/")
                            };
                            break;
                        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide":
                        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image":
                        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart":
                        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink":
                        default:
                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                            slideResObj[RelationshipArray[i]["attrs"]["Id"]] = {
                                "type": RelationshipArray[i]["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
                                "target": RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/")
                            };
                    }
                }
            } else {
                layoutFilename = RelationshipArray["attrs"]["Target"].replace("../", "ppt/");
            }
            //console.log(slideResObj);
            // Open slideLayoutXX.xml
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            var slideLayoutContent = readXmlFile(zip, layoutFilename);
            var slideLayoutTables = indexNodes(slideLayoutContent);
            var sldLayoutClrOvr = getTextByPathList(slideLayoutContent, ["p:sldLayout", "p:clrMapOvr", "a:overrideClrMapping"]);

            //console.log(slideLayoutClrOvride);
            if (sldLayoutClrOvr !== undefined) {
                // @ts-expect-error TS(2304): Cannot find name 'slideLayoutClrOvride'.
                slideLayoutClrOvride = sldLayoutClrOvr["attrs"];
            }
            // =====< Step 2 >=====
            // Read slide master filename of the slidelayout (Get slideMasterXX.xml)
            // @resName: ppt/slideLayouts/slideLayout1.xml
            // @masterName: ppt/slideLayouts/_rels/slideLayout1.xml.rels
            var slideLayoutResFilename = layoutFilename.replace("slideLayouts/slideLayout", "slideLayouts/_rels/slideLayout") + ".rels";
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            var slideLayoutResContent = readXmlFile(zip, slideLayoutResFilename);
            RelationshipArray = slideLayoutResContent["Relationships"]["Relationship"];
            var masterFilename = "";
            var layoutResObj = {};
            if (RelationshipArray.constructor === Array) {
                for (var i = 0; i < RelationshipArray.length; i++) {
                    switch (RelationshipArray[i]["attrs"]["Type"]) {
                        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster":
                            masterFilename = RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/");
                            break;
                        default:
                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                            layoutResObj[RelationshipArray[i]["attrs"]["Id"]] = {
                                "type": RelationshipArray[i]["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
                                "target": RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/")
                            };
                    }
                }
            } else {
                masterFilename = RelationshipArray["attrs"]["Target"].replace("../", "ppt/");
            }
            // Open slideMasterXX.xml
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            var slideMasterContent = readXmlFile(zip, masterFilename);
            var slideMasterTextStyles = getTextByPathList(slideMasterContent, ["p:sldMaster", "p:txStyles"]);
            var slideMasterTables = indexNodes(slideMasterContent);

            /////////////////Amir/////////////
            //Open slideMasterXX.xml.rels
            var slideMasterResFilename = masterFilename.replace("slideMasters/slideMaster", "slideMasters/_rels/slideMaster") + ".rels";
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            var slideMasterResContent = readXmlFile(zip, slideMasterResFilename);
            RelationshipArray = slideMasterResContent["Relationships"]["Relationship"];
            var themeFilename = "";
            var masterResObj = {};
            if (RelationshipArray.constructor === Array) {
                for (var i = 0; i < RelationshipArray.length; i++) {
                    switch (RelationshipArray[i]["attrs"]["Type"]) {
                        case "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme":
                            themeFilename = RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/");
                            break;
                        default:
                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                            masterResObj[RelationshipArray[i]["attrs"]["Id"]] = {
                                "type": RelationshipArray[i]["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
                                "target": RelationshipArray[i]["attrs"]["Target"].replace("../", "ppt/")
                            };
                    }
                }
            } else {
                themeFilename = RelationshipArray["attrs"]["Target"].replace("../", "ppt/");
            }
            //console.log(themeFilename)
            //Load Theme file
            var themeResObj = {};
            if (themeFilename !== undefined) {
                var themeName = themeFilename.split("/").pop();
                // @ts-expect-error TS(2769): No overload matches this call.
                var themeResFileName = themeFilename.replace(themeName, "_rels/" + themeName) + ".rels";
                //console.log("themeFilename: ", themeFilename, ", themeName: ", themeName, ", themeResFileName: ", themeResFileName)
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                var themeContent = readXmlFile(zip, themeFilename);
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                var themeResContent = readXmlFile(zip, themeResFileName);
                if (themeResContent !== null) {
                    var relationshipArray = themeResContent["Relationships"]["Relationship"];
                    if (relationshipArray !== undefined){
                        var themeFilename = "";
                        if (relationshipArray.constructor === Array) {
                            for (var i = 0; i < relationshipArray.length; i++) {
                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                themeResObj[relationshipArray[i]["attrs"]["Id"]] = {
                                    "type": relationshipArray[i]["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
                                    "target": relationshipArray[i]["attrs"]["Target"].replace("../", "ppt/")
                                };
                            }
                        } else {
                            //console.log("theme relationshipArray : ", relationshipArray)
                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                            themeResObj[relationshipArray["attrs"]["Id"]] = {
                                "type": relationshipArray["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
                                "target": relationshipArray["attrs"]["Target"].replace("../", "ppt/")
                            };
                        }
                    }
                }
            }
            //Load diagram file
            var diagramResObj = {};
            var digramFileContent = {};
            if (diagramFilename !== undefined) {
                var diagName = diagramFilename.split("/").pop();
                // @ts-expect-error TS(2769): No overload matches this call.
                var diagramResFileName = diagramFilename.replace(diagName, "_rels/" + diagName) + ".rels";
                //console.log("diagramFilename: ", diagramFilename, ", themeName: ", themeName, ", diagramResFileName: ", diagramResFileName)
                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                digramFileContent = readXmlFile(zip, diagramFilename);
                if (digramFileContent !== null && digramFileContent !== undefined && digramFileContent != "") {
                    var digramFileContentObjToStr = JSON.stringify(digramFileContent);
                    digramFileContentObjToStr = digramFileContentObjToStr.replace(/dsp:/g, "p:");
                    digramFileContent = JSON.parse(digramFileContentObjToStr);
                }

                // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                var digramResContent = readXmlFile(zip, diagramResFileName);
                if (digramResContent !== null) {
                    var relationshipArray = digramResContent["Relationships"]["Relationship"];
                    var themeFilename = "";
                    if (relationshipArray.constructor === Array) {
                        for (var i = 0; i < relationshipArray.length; i++) {
                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                            diagramResObj[relationshipArray[i]["attrs"]["Id"]] = {
                                "type": relationshipArray[i]["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
                                "target": relationshipArray[i]["attrs"]["Target"].replace("../", "ppt/")
                            };
                        }
                    } else {
                        //console.log("theme relationshipArray : ", relationshipArray)
                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                        diagramResObj[relationshipArray["attrs"]["Id"]] = {
                            "type": relationshipArray["attrs"]["Type"].replace("http://schemas.openxmlformats.org/officeDocument/2006/relationships/", ""),
                            "target": relationshipArray["attrs"]["Target"].replace("../", "ppt/")
                        };
                    }
                }
            }
            //console.log("diagramResObj: " , diagramResObj)
            // =====< Step 3 >=====
            var slideContent = readXmlFile(zip, sldFileName, true, app_verssion);
            var nodes = slideContent["p:sld"]["p:cSld"]["p:spTree"];
            var warpObj = {
                "zip": zip,
                "slideLayoutContent": slideLayoutContent,
                "slideLayoutTables": slideLayoutTables,
                "slideMasterContent": slideMasterContent,
                "slideMasterTables": slideMasterTables,
                "slideContent": slideContent,
                "slideResObj": slideResObj,
                "slideMasterTextStyles": slideMasterTextStyles,
                "layoutResObj": layoutResObj,
                "masterResObj": masterResObj,
                "themeContent": themeContent,
                "themeResObj": themeResObj,
                "digramFileContent": digramFileContent,
                "diagramResObj": diagramResObj,
                "defaultTextStyle": defaultTextStyle
            };
            var bgResult = "";
            if (processFullTheme === true) {
                bgResult = getBackground(warpObj, slideSize, index, tableStyles, {value: is_first_br}, styleTable, rtl_langs_array, slideFactor, fontSizeFactor, chartID, MsgQueue, settings, processNodesInSlide, processSpNode, processCxnSpNode, processPicNode, processGraphicFrameNode, processGroupSpNode, genShape, genTable, genChart, genDiagram);
            }

            var bgColor = "";
            // @ts-expect-error TS(2367): This condition will always return 'false' since th... Remove this comment to see the full error message
            if (processFullTheme == "colorsAndImageOnly") {
                // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
                bgColor = getSlideBackgroundFill(warpObj, index);
            }

            if (settings.slideMode && settings.slideType == "revealjs") {
                var result = "<section class='slide' style='width:" + slideSize.width + "px; height:" + slideSize.height + "px;" + bgColor + "'>"
            } else {
                var result = "<div class='slide' style='width:" + slideSize.width + "px; height:" + slideSize.height + "px;" + bgColor + "'>"
            }
            result += bgResult;
            for (var nodeKey in nodes) {
                if (nodes[nodeKey].constructor === Array) {
                    for (var i = 0; i < nodes[nodeKey].length; i++) {
                        result += processNodesInSlide(nodeKey, nodes[nodeKey][i], nodes, warpObj, "slide", undefined, tableStyles, {value: is_first_br}, styleTable, rtl_langs_array, slideFactor, fontSizeFactor, chartID, MsgQueue, settings, processSpNode, processCxnSpNode, processPicNode, processGraphicFrameNode, processGroupSpNode, genShape, genTable, genChart, genDiagram);
                    }
                } else {
                    result += processNodesInSlide(nodeKey, nodes[nodeKey], nodes, warpObj, "slide", undefined, tableStyles, {value: is_first_br}, styleTable, rtl_langs_array, slideFactor, fontSizeFactor, chartID, MsgQueue, settings, processSpNode, processCxnSpNode, processPicNode, processGraphicFrameNode, processGroupSpNode, genShape, genTable, genChart, genDiagram);
                }
            }
            if (settings.slideMode && settings.slideType == "revealjs") {
                return result + "</div></section>";
            } else {
                return result + "</div></div>";
            }

        }






        /*
        function shapePolygon(sidesNum) {
            var sides  = sidesNum;
            var radius = 100;
            var angle  = 2 * Math.PI / sides;
            var points = []; 
            
            for (var i = 0; i < sides; i++) {
                points.push(radius + radius * Math.sin(i * angle));
                points.push(radius - radius * Math.cos(i * angle));
            }

            return points;
        }
        */

        var is_first_br = false;





    };

}(jQuery));
