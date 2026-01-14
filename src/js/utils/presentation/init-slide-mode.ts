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

type InitSlideModeOptions = {
  divId: string;
  settings: SlideModeSettings;
};

export async function initSlideMode({ divId, settings }: InitSlideModeOptions): Promise<void> {
  //console.log(settings.slideType)
  if (typeof document === "undefined") {
    return;
  }
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
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1500);
    });
    const slideModeConfig = settings.slideModeConfig;
    const showPlayPauseBtn = settings.showPlayPauseBtn ?? slideModeConfig.showPlayPauseBtn ?? true;
    const showFullscreenBtn =
      settings.showFullscreenBtn ?? slideModeConfig.showFullscreenBtn ?? true;
    removeLoadingMessage();
    initDivs2Slides({
      target: container,
      options: {
        first: slideModeConfig.first,
        nav: slideModeConfig.nav,
        showPlayPauseBtn: showPlayPauseBtn,
        showFullscreenBtn: showFullscreenBtn,
        navTxtColor: slideModeConfig.navTxtColor,
        keyBoardShortCut: slideModeConfig.keyBoardShortCut,
        showSlideNum: slideModeConfig.showSlideNum,
        showTotalSlideNum: slideModeConfig.showTotalSlideNum,
        autoSlide: slideModeConfig.autoSlide,
        randomAutoSlide: slideModeConfig.randomAutoSlide,
        loop: slideModeConfig.loop,
        background: slideModeConfig.background,
        transition: slideModeConfig.transition,
        transitionTime: slideModeConfig.transitionTime,
      },
    });

    const slidesScale = settings.slidesScale;
    let transformScaleStyle = "";
    let scaleValue = 1;
    if (slidesScale !== "") {
      const parsedScale = Number.parseInt(slidesScale, 10);
      if (Number.isFinite(parsedScale) && parsedScale > 0) {
        scaleValue = parsedScale / 100;
        transformScaleStyle = "transform:scale(" + scaleValue + "); transform-origin:top";
      }
    }

    const slideCount = slides.length;
    const slideScaleValue = scaleValue;
    //console.log(slidesHeight);
    const wrapper = document.getElementById("all_slides_warpper");
    if (wrapper) {
      wrapper.setAttribute(
        "style",
        transformScaleStyle + ";height: " + slideCount * slidesHeight * slideScaleValue + "px"
      );
    }
  } else if (settings.slideType === "revealjs") {
    removeLoadingMessage();
    let revealJsPath = "";
    if (settings.revealjsPath !== "") {
      revealJsPath = settings.revealjsPath;
    } else {
      revealJsPath = "./revealjs/reveal.js";
    }
    try {
      await loadScript(revealJsPath);
      // $("section").removeClass("slide");
      const reveal = (window as { Reveal?: { initialize: (config?: unknown) => void } }).Reveal;
      if (!reveal) {
        throw new Error("Reveal.js not available after script load.");
      }
      reveal.initialize(settings.revealjsConfig); //revealjsConfig - TODO
    } catch (error) {
      console.error(error);
    }
  }
}
