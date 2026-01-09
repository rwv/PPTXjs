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
  keyBoardShortCut: boolean;
  showSlideNum: boolean;
  showTotalSlideNum: boolean;
  autoSlide: boolean | number;
  randomAutoSlide: boolean;
  loop: boolean;
  background: boolean | string;
  transition: string;
  transitionTime: number;
};

type SlideModeSettings = {
  slideType: string;
  slideModeConfig: SlideModeConfig;
  showPlayPauseBtn?: boolean;
  slidesScale: string;
  revealjsPath: string;
  revealjsConfig: Record<string, unknown>;
};

export function initSlideMode(divId: string, settings: SlideModeSettings): void {
  //console.log(settings.slideType)
  if (settings.slideType === "" || settings.slideType === "divs2slidesjs") {
    const slidesHeight = $("#" + divId + " .slide").height();
    $("#" + divId + " .slide").hide();
    setTimeout(function () {
      const slideConf = settings.slideModeConfig;
      $(".slides-loadnig-msg").remove();
      const $container = $("#" + divId) as JQuery & {
        divs2slides: (config: SlideModeConfig & { showPlayPauseBtn?: boolean }) => void;
      };
      $container.divs2slides({
        first: slideConf.first,
        nav: slideConf.nav,
        showPlayPauseBtn: settings.showPlayPauseBtn,
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
      $("#all_slides_warpper").attr({
        style: trnsfrmScl + ";height: " + numOfSlides * slidesHeight * sScaleVal + "px",
      });
    }, 1500);
  } else if (settings.slideType === "revealjs") {
    $(".slides-loadnig-msg").remove();
    let revealjsPath = "";
    if (settings.revealjsPath !== "") {
      revealjsPath = settings.revealjsPath;
    } else {
      revealjsPath = "./revealjs/reveal.js";
    }
    $.getScript(revealjsPath, function (_response: unknown, status: string) {
      if (status === "success") {
        // $("section").removeClass("slide");
        // @ts-expect-error TS(2304): Cannot find name 'Reveal'.
        Reveal.initialize(settings.revealjsConfig); //revealjsConfig - TODO
      }
    });
  }
}
