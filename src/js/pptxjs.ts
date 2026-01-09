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
import { setNumericBullets } from "./utils/text";
import { processMsgQueue } from "./utils/chart";
import { updateProgressBar } from "./utils/ui";
import { initSlideMode } from "./utils/presentation";
import { processPPTX } from "./utils/pptx";
import { registerDivs2Slides } from "./divs2slides";
import { createPptxArchive } from "./archive";

// Register divs2slides jQuery plugin
registerDivs2Slides();

(function ($) {
  ($.fn as any).pptxToHtml = function (options: any) {
    //var worker;
    const $result = $(this);
    const divId = $result.attr("id");

    let isDone = false;

    const MsgQueue = new Array();

    const chartID = { value: 0 };

    const rtl_langs_array = ["he-IL", "ar-AE", "ar-SA", "dv-MV", "fa-IR", "ur-PK"];

    const slideFactor = 96 / 914400;
    const fontSizeFactor = 4 / 3.2;
    let isSlideMode = false;
    const styleTable = {};
    const settings = $.extend(
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

    $("#" + divId).prepend(
      $("<div></div>")
        .attr({
          class: "slides-loadnig-msg",
          style: "display:block; width:100%; color:white; background-color: #ddd;",
        }) /*.html("Loading...")*/
        .append(
          $("<div></div>")
            .attr({
              class: "slides-loading-progress-bar",
              style: "width: 1%; background-color: #4775d1;",
            })
            .html("<span style='text-align: center;'>Loading... (1%)</span>")
        )
    );
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
        const key = event.keyCode;
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
      // Use native fetch API to load PPTX file
      fetch(settings.pptxFileUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
          convertToHtml(arrayBuffer);
        })
        .catch((err) => {
          console.error("Failed to fetch PPTX file:", err);
          $(".slides-loadnig-msg").remove();
        });
    } else {
      $(".slides-loadnig-msg").remove();
    }
    if (settings.fileInputId != "") {
      $("#" + settings.fileInputId).on("change", function (evt: any) {
        $result.html("");
        const file = evt.target.files[0];
        // var fileName = file[0].name;
        //var fileSize = file[0].size;
        const fileType = file.type;
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
      // Create archive instance using new interface
      const archive = createPptxArchive(file);
      const rslt_ary = processPPTX(
        archive,
        slideFactor,
        settings,
        styleTable,
        rtl_langs_array,
        fontSizeFactor,
        chartID,
        MsgQueue,
        { value: is_first_br }
      );
      //s = readXmlFile(zip, 'ppt/tableStyles.xml');
      //var slidesHeight = $("#" + divId + " .slide").height();
      for (let i = 0; i < rslt_ary.length; i++) {
        switch (rslt_ary[i]["type"]) {
          case "slide":
            $result.append(rslt_ary[i]["data"]);
            break;
          case "pptx-thumb":
            //$("#pptx-thumb").attr("src", "data:image/jpeg;base64," +rslt_ary[i]["data"]);
            break;
          case "slideSize":
            // Slide size is calculated but not currently used
            break;
          case "globalCSS":
            //console.log(rslt_ary[i]["data"])
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

      const sScale = settings.slidesScale;
      let trnsfrmScl = "";
      if (sScale != "") {
        const numsScale = parseInt(sScale);
        var scaleVal = numsScale / 100;
        if (settings.slideMode && settings.slideType != "revealjs") {
          trnsfrmScl = "transform:scale(" + scaleVal + "); transform-origin:top";
        }
      }

      const slidesHeight = $("#" + divId + " .slide").height();
      const numOfSlides = $("#" + divId + " .slide").length;
      const sScaleVal = sScale != "" ? scaleVal : 1;
      //console.log("slidesHeight: " + slidesHeight + "\nnumOfSlides: " + numOfSlides + "\nScale: " + sScaleVal)

      $("#all_slides_warpper").attr({
        style: trnsfrmScl + ";height: " + numOfSlides * slidesHeight * sScaleVal + "px",
      });

      //}
    }

    var is_first_br = false;
  };
})(jQuery);
