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
import { base64ArrayBuffer, processPicNode } from "./utils/media";
import { setNumericBullets } from "./utils/text";
import { getSvgGradient, getSvgImagePattern } from "./utils/svg";
import { getPosition, getSize, getVerticalAlign, getHorizontalAlign } from "./utils/layout";
import { getShapeFill } from "./utils/fill";
import { getBorder } from "./utils/border";
import { getTextByPathList } from "./utils/object";
import { genChart, processMsgQueue } from "./utils/chart";
import { genGlobalCSS } from "./utils/css";
import { updateProgressBar } from "./utils/ui";
import { initSlideMode } from "./utils/presentation";
import { processCxnSpNode, genShape } from "./utils/shape";
import { genTable } from "./utils/table";
import {
  processSpNode,
  processGroupSpNode,
  processGraphicFrameNode,
  processNodesInSlide,
} from "./utils/node";
import { genDiagram } from "./utils/diagram";
import { getBackground, processSingleSlide } from "./utils/slide";
import { processPPTX } from "./utils/pptx";
import { readXmlFile, getContentTypes, getSlideSizeAndSetDefaultTextStyle } from "./utils/xml";
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

    var chartID = { value: 0 };

    var _order = 1;

    var app_verssion: any;

    var tableStyles: any;

    var rtl_langs_array = ["he-IL", "ar-AE", "ar-SA", "dv-MV", "fa-IR", "ur-PK"];

    var slideFactor = 96 / 914400;
    var fontSizeFactor = 4 / 3.2;
    //////////////////////
    var slideWidth = 0;
    var slideHeight = 0;
    var isSlideMode = false;
    var processFullTheme = true;
    var styleTable = {};
    var settings = $.extend(
      true,
      {
        // These are the defaults.
        pptxFileUrl: "",
        fileInputId: "",
        slidesScale: "", //Change Slides scale by percent
        slideMode: false /** true,false*/,
        slideType:
          "divs2slidesjs" /*'divs2slidesjs' (default) , 'revealjs'(https://revealjs.com)  -TODO*/,
        revealjsPath: "" /*path to js file of revealjs - TODO*/,
        keyBoardShortCut: false /** true,false ,condition: slideMode: true XXXXX - need to remove - this is doublcated*/,
        mediaProcess: true /** true,false: if true then process video and audio files */,
        jsZipV2: false,
        themeProcess: true /*true (default) , false, "colorsAndImageOnly"*/,
        incSlide: {
          width: 0,
          height: 0,
        },
        slideModeConfig: {
          first: 1,
          nav: true /** true,false : show or not nav buttons*/,
          navTxtColor: "black" /** color */,
          keyBoardShortCut: true /** true,false ,condition: */,
          showSlideNum: true /** true,false */,
          showTotalSlideNum: true /** true,false */,
          autoSlide: true /** false or seconds , F8 to active ,keyBoardShortCut: true */,
          randomAutoSlide: false /** true,false ,autoSlide:true */,
          loop: false /** true,false */,
          background: false /** false or color*/,
          transition:
            "default" /** transition type: "slid","fade","default","random" , to show transition efects :transitionTime > 0.5 */,
          transitionTime: 1 /** transition time between slides in seconds */,
        },
        revealjsConfig: {},
      },
      options
    );

    processFullTheme = settings.themeProcess;

    $("#" + divId).prepend(
      $("<div></div>")
        .attr({
          class: "slides-loadnig-msg",
          style: "display:block; width:100%; color:white; background-color: #ddd;",
        }) /*.html("Loading...")*/
        .html(
          $("<div></div>")
            .attr({
              class: "slides-loading-progress-bar",
              style: "width: 1%; background-color: #4775d1;",
            })
            .html("<span style='text-align: center;'>Loading... (1%)</span>")
        )
    );
    if (settings.slideMode) {
      if (!jQuery().divs2slides) {
        jQuery.getScript("./js/divs2slides.js");
      }
    }
    if (settings.jsZipV2 !== false) {
      jQuery.getScript(settings.jsZipV2);
      if (localStorage.getItem("isPPTXjsReLoaded") !== "yes") {
        localStorage.setItem("isPPTXjsReLoaded", "yes");
        location.reload();
      }
    }

    if (settings.keyBoardShortCut) {
      $(document).bind("keydown", function (event: any) {
        event.preventDefault();
        var key = event.keyCode;
        console.log(key, isDone);
        if (key == 116 && !isSlideMode) {
          //F5
          isSlideMode = true;
          initSlideMode(divId, settings);
        } else if (key == 116 && isSlideMode) {
          //exit slide mode - TODO
        }
      });
    }
    if (settings.pptxFileUrl != "") {
      try {
        // @ts-expect-error TS(2304): Cannot find name 'JSZipUtils'.
        JSZipUtils.getBinaryContent(settings.pptxFileUrl, function (err: any, content: any) {
          var blob = new Blob([content]);
          blob.arrayBuffer().then(function (arrayBuffer) {
            convertToHtml(arrayBuffer);
          });
        });
      } catch (e) {
        console.error("file url error (" + settings.pptxFileUrl + "0)");
        $(".slides-loadnig-msg").remove();
      }
    } else {
      $(".slides-loadnig-msg").remove();
    }
    if (settings.fileInputId != "") {
      $("#" + settings.fileInputId).on("change", function (evt: any) {
        $result.html("");
        var file = evt.target.files[0];
        // var fileName = file[0].name;
        //var fileSize = file[0].size;
        var fileType = file.type;
        if (
          fileType == "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) {
          file.arrayBuffer().then(function (arrayBuffer: any) {
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
      if (file.byteLength < 10) {
        console.error("file url error (" + settings.pptxFileUrl + "0)");
        $(".slides-loadnig-msg").remove();
        return;
      }
      // @ts-expect-error TS(2304): Cannot find name 'JSZip'.
      var zip: JsZip = new JSZip(),
        s;
      //if (typeof file === 'string') { // Load
      zip = zip.load(file); //zip.load(file, { base64: true });
      var rslt_ary = processPPTX(
        zip,
        slideFactor,
        settings,
        styleTable,
        rtl_langs_array,
        fontSizeFactor,
        chartID,
        MsgQueue,
        { value: is_first_br },
        processNodesInSlide,
        processSpNode,
        processCxnSpNode,
        processPicNode,
        processGraphicFrameNode,
        processGroupSpNode,
        genShape,
        genTable,
        genChart,
        genDiagram,
        getBackground,
        processSingleSlide,
        base64ArrayBuffer,
        getContentTypes,
        getSlideSizeAndSetDefaultTextStyle,
        readXmlFile,
        genGlobalCSS
      );
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
            updateProgressBar(rslt_ary[i]["data"]);
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
          $("#" + divId).addClass("reveal");
        }
      }

      var sScale = settings.slidesScale;
      var trnsfrmScl = "";
      if (sScale != "") {
        var numsScale = parseInt(sScale);
        var scaleVal = numsScale / 100;
        if (settings.slideMode && settings.slideType != "revealjs") {
          trnsfrmScl = "transform:scale(" + scaleVal + "); transform-origin:top";
        }
      }

      var slidesHeight = $("#" + divId + " .slide").height();
      var numOfSlides = $("#" + divId + " .slide").length;
      // @ts-expect-error TS(2454): Variable 'scaleVal' is used before being assigned.
      var sScaleVal = sScale != "" ? scaleVal : 1;
      //console.log("slidesHeight: " + slidesHeight + "\nnumOfSlides: " + numOfSlides + "\nScale: " + sScaleVal)

      $("#all_slides_warpper").attr({
        style: trnsfrmScl + ";height: " + numOfSlides * slidesHeight * sScaleVal + "px",
      });

      //}
    }

    var is_first_br = false;
  };
})(jQuery);
