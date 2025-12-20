/**
 * Initialize slide presentation mode (divs2slides or Reveal.js)
 *
 * @param divId - Container div ID
 * @param settings - Settings object containing slideType and configuration
 */
export function initSlideMode(divId: any, settings: any): void {
    //console.log(settings.slideType)
    if (settings.slideType == "" || settings.slideType == "divs2slidesjs") {
        var slidesHeight = $("#" + divId + " .slide").height();
        $("#" + divId + " .slide").hide();
        setTimeout(function () {
            var slideConf = settings.slideModeConfig;
            $(".slides-loadnig-msg").remove();
            $("#" + divId).divs2slides({
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
                transitionTime: slideConf.transitionTime
            });

            var sScale = settings.slidesScale;
            var trnsfrmScl = "";
            if (sScale != "") {
                var numsScale = parseInt(sScale);
                var scaleVal = numsScale / 100;
                trnsfrmScl = 'transform:scale(' + scaleVal + '); transform-origin:top';
            }

            var numOfSlides = 1;
            // @ts-expect-error TS(2454): Variable 'scaleVal' is used before being assigned.
            var sScaleVal = (sScale != "") ? scaleVal : 1;
            //console.log(slidesHeight);
            $("#all_slides_warpper").attr({
                style: trnsfrmScl + ";height: " + (numOfSlides * slidesHeight * sScaleVal) + "px"
            })

        }, 1500);
    } else if (settings.slideType == "revealjs") {
        $(".slides-loadnig-msg").remove();
        var revealjsPath = "";
        if (settings.revealjsPath != "") {
            revealjsPath = settings.revealjsPath;
        } else {
            revealjsPath = "./revealjs/reveal.js";
        }
        $.getScript(revealjsPath, function (response: any, status: any) {
            if (status == "success") {
                // $("section").removeClass("slide");
                // @ts-expect-error TS(2304): Cannot find name 'Reveal'.
                Reveal.initialize(settings.revealjsConfig); //revealjsConfig - TODO
            }
        });
    }
}
