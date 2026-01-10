/**
 * Initialize slide presentation mode (divs2slides or Reveal.js)
 *
 * @param divId - Container div ID
 * @param settings - Settings object containing slideType and configuration
 */
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
  background: boolean | string;
  transition: "default" | "slid" | "fade" | "random";
  transitionTime: number;
};

type SlideModeSettings = {
  slideType: string;
  slideModeConfig: SlideModeConfig;
  showPlayPauseBtn?: boolean;
  showFullscreenBtn?: boolean;
  slidesScale: string;
  revealjsPath: string;
  revealjsConfig: Record<string, unknown>;
};

import { initDivs2Slides } from "../../divs2slides";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error(`Failed to load script: ${src}`)));
    document.body.appendChild(script);
  });
}

function removeLoadingMessage(): void {
  document.querySelectorAll(".slides-loadnig-msg").forEach((element) => element.remove());
}

export function initSlideMode(divId: string, settings: SlideModeSettings): void {
  //console.log(settings.slideType)
  if (settings.slideType === "" || settings.slideType === "divs2slidesjs") {
    const container = document.getElementById(divId);
    if (!container) {
      return;
    }
    const slides = Array.from(container.querySelectorAll<HTMLElement>(".slide"));
    const slidesHeight = slides[0]?.getBoundingClientRect().height ?? 0;
    slides.forEach((slide) => {
      slide.style.display = "none";
    });
    setTimeout(function () {
      const slideConf = settings.slideModeConfig;
      const showPlayPauseBtn = settings.showPlayPauseBtn ?? slideConf.showPlayPauseBtn ?? true;
      const showFullscreenBtn = settings.showFullscreenBtn ?? slideConf.showFullscreenBtn ?? true;
      removeLoadingMessage();
      initDivs2Slides(container, {
        first: slideConf.first,
        nav: slideConf.nav,
        showPlayPauseBtn: showPlayPauseBtn,
        showFullscreenBtn: showFullscreenBtn,
        navTxtColor: slideConf.navTxtColor,
        keyBoardShortCut: slideConf.keyBoardShortCut,
        showSlideNum: slideConf.showSlideNum,
        showTotalSlideNum: slideConf.showTotalSlideNum,
        autoSlide: slideConf.autoSlide,
        randomAutoSlide: slideConf.randomAutoSlide,
        loop: slideConf.loop,
        background: slideConf.background,
        transition: slideConf.transition,
        transitionTime: slideConf.transitionTime,
      });

      const sScale = settings.slidesScale;
      let trnsfrmScl = "";
      let scaleVal = 1;
      if (sScale !== "") {
        const numsScale = parseInt(sScale);
        scaleVal = numsScale / 100;
        trnsfrmScl = "transform:scale(" + scaleVal + "); transform-origin:top";
      }

      const numOfSlides = 1;
      const sScaleVal = scaleVal;
      //console.log(slidesHeight);
      const wrapper = document.getElementById("all_slides_warpper");
      if (wrapper) {
        wrapper.setAttribute(
          "style",
          trnsfrmScl + ";height: " + numOfSlides * slidesHeight * sScaleVal + "px"
        );
      }
    }, 1500);
  } else if (settings.slideType === "revealjs") {
    removeLoadingMessage();
    let revealjsPath = "";
    if (settings.revealjsPath !== "") {
      revealjsPath = settings.revealjsPath;
    } else {
      revealjsPath = "./revealjs/reveal.js";
    }
    loadScript(revealjsPath)
      .then(() => {
        // $("section").removeClass("slide");
        // @ts-expect-error TS(2304): Cannot find name 'Reveal'.
        Reveal.initialize(settings.revealjsConfig); //revealjsConfig - TODO
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
