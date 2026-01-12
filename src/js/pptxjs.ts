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
import "../../css/pptxjs.css";

import { setNumericBullets } from "./utils/text";
import { processMsgQueue } from "./utils/chart";
import { updateProgressBar } from "./utils/ui";
import { initSlideMode } from "./utils/presentation";
import { processPPTX } from "./utils/pptx";
import { createPptxArchive } from "./archive";

type SlideModeConfig = {
  first: number;
  nav: boolean;
  navTxtColor: string;
  showPlayPauseBtn?: boolean;
  showFullscreenBtn?: boolean;
  keyBoardShortCut: boolean;
  showSlideNum: boolean;
  showTotalSlideNum: boolean;
  autoSlide: boolean | number;
  randomAutoSlide: boolean;
  loop: boolean;
  background: false | string;
  transition: "slid" | "fade" | "default" | "random";
  transitionTime: number;
};

type PptxToHtmlOptions = {
  pptxFileUrl?: string;
  fileInputId?: string;
  slidesScale?: string;
  slideMode?: boolean;
  slideType?: "divs2slidesjs" | "revealjs";
  revealjsPath?: string;
  keyBoardShortCut?: boolean;
  showPlayPauseBtn?: boolean;
  showFullscreenBtn?: boolean;
  mediaProcess?: boolean;
  themeProcess?: boolean | "colorsAndImageOnly";
  incSlide?: { width: number; height: number };
  slideModeConfig?: SlideModeConfig;
  revealjsConfig?: Record<string, unknown>;
};

type PptxToHtmlSettings = {
  pptxFileUrl: string;
  fileInputId: string;
  slidesScale: string;
  slideMode: boolean;
  slideType: "divs2slidesjs" | "revealjs";
  revealjsPath: string;
  keyBoardShortCut: boolean;
  showPlayPauseBtn?: boolean;
  showFullscreenBtn?: boolean;
  mediaProcess: boolean;
  themeProcess: boolean | "colorsAndImageOnly";
  incSlide: { width: number; height: number };
  slideModeConfig: SlideModeConfig;
  revealjsConfig: Record<string, unknown>;
};

function resolveContainer(target: HTMLElement | string): HTMLElement {
  if (typeof target === "string") {
    const element = document.querySelector<HTMLElement>(target);
    if (!element) {
      throw new Error(`Container not found for selector: ${target}`);
    }
    return element;
  }
  return target;
}

function ensureElementId(element: HTMLElement): string {
  if (!element.id) {
    const uniqueId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    element.id = `pptxjs-${uniqueId}`;
  }
  return element.id;
}

function removeLoadingMessage(): void {
  document.querySelectorAll(".slides-loadnig-msg").forEach((element) => element.remove());
}

type WrapAllOptions = {
  elements: Element[];
  wrapper: HTMLElement;
};

function wrapAll({ elements, wrapper }: WrapAllOptions): void {
  if (elements.length === 0) {
    return;
  }
  const first = elements[0];
  const parent = first.parentNode;
  if (!parent) {
    return;
  }
  parent.insertBefore(wrapper, first);
  elements.forEach((element) => wrapper.appendChild(element));
}

type AppendResultOptions = {
  target: HTMLElement;
  data: unknown;
};

function appendResult({ target, data }: AppendResultOptions): void {
  if (typeof data === "string") {
    target.insertAdjacentHTML("beforeend", data);
    return;
  }
  if (data instanceof Node) {
    target.appendChild(data);
  }
}

function createLoadingMessage(): HTMLElement {
  const loading = document.createElement("div");
  loading.className = "slides-loadnig-msg";
  loading.style.cssText = "display:block; width:100%; color:white; background-color: #ddd;";

  const progress = document.createElement("div");
  progress.className = "slides-loading-progress-bar";
  progress.style.cssText = "width: 1%; background-color: #4775d1;";
  progress.innerHTML = "<span style='text-align: center;'>Loading... (1%)</span>";

  loading.appendChild(progress);
  return loading;
}

type PptxToHtmlArgs = {
  container: HTMLElement | string;
  options?: PptxToHtmlOptions;
};

export async function pptxToHtml({ container, options }: PptxToHtmlArgs): Promise<void> {
  //var worker;
  const result = resolveContainer(container);
  const divId = ensureElementId(result);

  let isDone = false;
  const is_first_br = false;

  const MsgQueue: Array<{ data: unknown }> = [];

  const chartID = { value: 0 };

  const rtl_langs_array = ["he-IL", "ar-AE", "ar-SA", "dv-MV", "fa-IR", "ur-PK"];

  const slideFactor = 96 / 914400;
  const fontSizeFactor = 4 / 3.2;
  let isSlideMode = false;
  const styleTable: Record<string, unknown> = {};
  const defaultSettings: PptxToHtmlSettings = {
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
  };

  const settings: PptxToHtmlSettings = {
    ...defaultSettings,
    ...options,
    incSlide: {
      ...defaultSettings.incSlide,
      ...(options?.incSlide ?? {}),
    },
    slideModeConfig: {
      ...defaultSettings.slideModeConfig,
      ...(options?.slideModeConfig ?? {}),
    },
    revealjsConfig: {
      ...defaultSettings.revealjsConfig,
      ...(options?.revealjsConfig ?? {}),
    },
  };

  result.prepend(createLoadingMessage());
  if (settings.keyBoardShortCut) {
    document.addEventListener("keydown", async function (event: KeyboardEvent) {
      event.preventDefault();
      const key = event.keyCode;
      console.log(key, isDone);
      if (key === 116 && !isSlideMode) {
        //F5
        isSlideMode = true;
        await initSlideMode({ divId, settings });
      } else if (key === 116 && isSlideMode) {
        //exit slide mode - TODO
      }
    });
  }
  if (settings.pptxFileUrl !== "") {
    // Use native fetch API to load PPTX file
    try {
      const response = await fetch(settings.pptxFileUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      await convertToHtml(arrayBuffer);
    } catch (err) {
      console.error("Failed to fetch PPTX file:", err);
      removeLoadingMessage();
    }
  } else {
    removeLoadingMessage();
  }
  if (settings.fileInputId !== "") {
    const input = document.getElementById(settings.fileInputId) as HTMLInputElement | null;
    if (input) {
      input.addEventListener("change", async function (evt) {
        result.innerHTML = "";
        const target = evt.target as {
          files?: { [index: number]: Blob | undefined } | null;
        } | null;
        const file = target?.files?.[0];
        if (!file) {
          return;
        }
        // var fileName = file[0].name;
        //var fileSize = file[0].size;
        const fileType = file.type;
        if (
          fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) {
          try {
            const arrayBuffer = await file.arrayBuffer();
            await convertToHtml(arrayBuffer);
          } catch (error) {
            console.error("Failed to read PPTX file:", error);
            removeLoadingMessage();
          }
        } else {
          alert("This is not pptx file");
        }
      });
    }
  }

  async function convertToHtml(file: ArrayBuffer): Promise<void> {
    //'use strict';
    //console.log("file", file, "size:", file.byteLength);
    if (file.byteLength < 10) {
      console.error("file url error (" + settings.pptxFileUrl + "0)");
      removeLoadingMessage();
      return;
    }
    // Create archive instance using new interface
    const archive = await createPptxArchive(file);
    const rslt_ary = await processPPTX({
      archive,
      emuToPx: slideFactor,
      settings,
      styleTable,
      rtlLanguages: rtl_langs_array,
      fontSizeScale: fontSizeFactor,
      chartIdCounter: chartID,
      messageQueue: MsgQueue,
      firstLineBreak: { value: is_first_br },
    });
    //s = readXmlFile(zip, 'ppt/tableStyles.xml');
    //var slidesHeight = $("#" + divId + " .slide").height();
    for (let i = 0; i < rslt_ary.length; i++) {
      switch (rslt_ary[i]["type"]) {
        case "slide":
          appendResult({ target: result, data: rslt_ary[i]["data"] });
          break;
        case "pptx-thumb":
          //$("#pptx-thumb").attr("src", "data:image/jpeg;base64," +rslt_ary[i]["data"]);
          break;
        case "slideSize":
          // Slide size is calculated but not currently used
          break;
        case "globalCSS":
          //console.log(rslt_ary[i]["data"])
          appendResult({ target: result, data: "<style>" + rslt_ary[i]["data"] + "</style>" });
          break;
        case "ExecutionTime":
          processMsgQueue(MsgQueue);
          setNumericBullets(document.querySelectorAll(".block"));
          setNumericBullets(document.querySelectorAll("table td"));

          isDone = true;

          if (settings.slideMode && !isSlideMode) {
            isSlideMode = true;
            await initSlideMode({ divId, settings });
          } else if (!settings.slideMode) {
            removeLoadingMessage();
          }
          break;
        case "progress-update":
          //console.log(rslt_ary[i]["data"]); //update progress bar - TODO
          updateProgressBar(rslt_ary[i]["data"]);
          break;
        default:
      }
    }
    if (!settings.slideMode || (settings.slideMode && settings.slideType === "revealjs")) {
      if (document.getElementById("all_slides_warpper") === null) {
        const slides = Array.from(result.querySelectorAll(".slide"));
        const wrapper = document.createElement("div");
        wrapper.id = "all_slides_warpper";
        wrapper.className = "slides";
        wrapAll({ elements: slides, wrapper });
        //$("#" + divId + " .slides").wrap("<div class='reveal'></div>");
      }

      if (settings.slideMode && settings.slideType === "revealjs") {
        result.classList.add("reveal");
      }
    }

    const sScale = settings.slidesScale;
    let trnsfrmScl = "";
    let scaleVal = 1;
    if (sScale !== "") {
      const numsScale = parseInt(sScale);
      scaleVal = numsScale / 100;
      if (settings.slideMode && settings.slideType !== "revealjs") {
        trnsfrmScl = "transform:scale(" + scaleVal + "); transform-origin:top";
      }
    }

    const firstSlide = result.querySelector<HTMLElement>(".slide");
    const slidesHeight = firstSlide ? firstSlide.getBoundingClientRect().height : 0;
    const numOfSlides = result.querySelectorAll(".slide").length;
    const sScaleVal = sScale !== "" ? scaleVal : 1;
    //console.log("slidesHeight: " + slidesHeight + "\nnumOfSlides: " + numOfSlides + "\nScale: " + sScaleVal)

    const wrapper = document.getElementById("all_slides_warpper");
    if (wrapper) {
      wrapper.setAttribute(
        "style",
        trnsfrmScl + ";height: " + numOfSlides * slidesHeight * sScaleVal + "px"
      );
    }

    //}
  }
}

if (typeof window !== "undefined") {
  (window as unknown as { pptxToHtml?: typeof pptxToHtml }).pptxToHtml = pptxToHtml;
}
