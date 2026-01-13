/**
 * divs2slides.js
 * Ver : 1.3.2
 * update: 14/05/2018
 * Author: meshesha , https://github.com/meshesha
 * LICENSE: MIT
 * url:https://github.com/meshesha/divs2slides
 *
 * New:
 *  - fixed fullscreen (fullscreen on div only insted all page)
 */

type TransitionType = "default" | "slid" | "fade" | "random";

interface SlideData {
  nav: boolean;
  navTxtColor: string;
  showPlayPauseBtn: boolean;
  showFullscreenBtn: boolean;
  showSlideNum: boolean;
  showTotalSlideNum: boolean;
  target: HTMLElement;
  divId: string;
  slides: HTMLElement[];
  isSlideMode: boolean;
  totalSlides: number;
  slideCount: number;
  prevSlide: number;
  transition: TransitionType;
  transitionTime: number;
  slctdBgClr: string | false;
  prevBgColor?: string;
  timeBetweenSlides: number | false;
  isLoop: boolean;
  isLoopMode: boolean;
  isAutoSlideMode: boolean;
  randomAutoSlide: boolean;
  isEnbleNextBtn: boolean;
  isEnblePrevBtn: boolean;
  isInit: boolean;
  loopIntrval?: ReturnType<typeof setInterval>;
}

interface Divs2SlidesSettings {
  first: number;
  nav: boolean;
  showPlayPauseBtn: boolean;
  showFullscreenBtn: boolean;
  navTxtColor: string /** color */;
  keyBoardShortCut: boolean;
  showSlideNum: boolean;
  showTotalSlideNum: boolean;
  autoSlide:
    | boolean
    | number /** false or seconds (the pause time between slides) , F8 to active(condition: keyBoardShortCut: true) */;
  randomAutoSlide: boolean /** true,false ,(condition: autoSlide:true */;
  loop: boolean /** true,false */;
  background: boolean | string /** false or color*/;
  transition:
    | "default"
    | "slid"
    | "fade"
    | "random" /** transition type: "slid","fade","default","random" , to show transition efects :transitionTime > 0.5 */;
  transitionTime: number /** transition time in seconds */;
}

const NEXT_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADZ0lEQVRIiZ2Va2xTdRjGH5xEg0aXeInRqE00pKwfHAkydYMdlXFpiG5LYFFi0iBZFFeLrm50ZrbrYLeyneEFcHMMhxoksGUSTEw01UQz1ukO29quO11vXNZNwBI1gRDN4wfa0q3n1MKT/D697/s8//OenP8BspD2jSGNtmpISEVjcOZmM6sqjcGZm/f2sC2/+tfQpnYvdxwK0NwXpLkvyB2HAixr83C5eUTSGV2GmzZfVjVc+qxlNFb/dYRHh2Psdl7knpNzbDkxy5YTs9xzco7dzov88pdLtHwV5tM1v4W0VUNCVuZ5plO9r3b62O28wF2DURr7zmRk12CUvT9dYLnDw/99Gp3JJW7bL7Pj2zlW9kS4tTucFZU9EX743RwrOibVQ7RVQ0K5w8uG/hm+8knolmjon+Fa+zh12135aQEFtaMh6/HzLN8bSIMkmwajirWFWI6cpc7kcs5fjdFlWNPoYdneAF/qmE6DJP+++i+bBqOK9VQ2fRSkYBvnvJeeZxoeWNcqc2P7tCKp+t79Jys+Dqr2bmyfZkmzjzqTS0wGLH9vNKZ3+KnGQs1evsbaI+dU+/UOP596Z0RKBqy0nOb6VlkVNX3x8yXVmZWW0wQArDCPCIX14yxp8nFt85QimTQ9e5VvHgzP6y+2e24E5O+UNAV1YyyoG2PhBxMsbvDw+UYv1+yeTJJJf135h63fzLC4wcMi6wSfef+6V0HdGJMrKqyfoBKrrG6usrpVzeXoFRr2+RVnn6sfiyUDiqxuabXNTTWU1Pvj76r9q21uFlknBpIBgt0rvtDopRqpisausbIrqNqbQLB7blwZgm1SU9LsoxoJHXf9wTJRVu1L8OJuX0ywSfP/F+taZHFDm0wlSNI+MKNYU2J985Qt7S4SbFKu3uGXMn2h2aB3+KU084T0bXJ+qRiIlXUGeCu8LAaktNUsVKk4qdmyLyS9diDMm2HL/pCzVMxsvijObQByKj+dqjb2RS6bDp9lJoyfhyPbDvheB5ATn034JJUDYDGAOwHcDSAXwIMAHgWwdHPtZ+btnT/01/SMequ7XHJ118hUzUHJ/Van81iFpfddAE8AeATAAwDuBbAEwB0Abo8HXj9xSshd8ZD7ATwM4HEATwJYBkAXRxs3fgzAQwDuA3BPivniuOei/wDo+pj+wU2R5QAAAABJRU5ErkJggg==";
const PREV_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADXklEQVRIiZ2Ve2hTZxjGH+tE0bEFdGNM1IBj1PYPKzjr1roeN6tdEW0LWpwMgpMytVncGttF6ZKm2lu0qXdtrdV6wY3ZUsXBYCMbOGrTrce2SZqeNrc5m9bLIjpQxPHsD5PYpMkx+sAPDnzv+zwf3+0ACUipsiiSizuFCL7oVCbSK6tUtVW1SNst5tfZuf2Ui9pWN7Wtbm4/5eK6fQ6mlfzhSfmyy6BUWRQvZJxc3Cm8V/qnR3fey3O/32WT5Q73XhljzeVR1lwe5d4rY2yy3OH3XQGWf+fj+7qewILirryEZ11gsrPlt9vc3eGnuvUvWXZ3+Nlkuc1PG5xM0Vxrea55Yf0AD/w0xqJmHzc1eROiqNnH+h/HuPmoxFSN1RzbfKs1baWxjxVtI9xw2PNSVLSNsMDkYHJxpzAxQGO16C7cYMF+13Op6vCTZMwx/cWbTC/r8UzYVMHQx3UH3VxTPyxLVYef/z76jyRjjufvd3FFpZ2paqtq/OzN2dVOrt43HJfCQ27+bLvP8YpXu6pWYoqmqz0csPCrbjHXNMR4lF34m6P3HjNacj2LdvQEwgFLdNeZUyvF5OzVuxOMQ4rXk1MrcYnuOiMCsox2rqweDLPlpJfDo4/impOMqB9PdpWTGeV9XKztfnqa0nf2Mn1nL5fu6mWmvp9ZFXbWXhrhg4dPZANW7BkIs7zSwawKOzO+7WfIL+0bUQkA+KC8N5BR3s9oVEeGKPkfxg1Yprdxmd42oS9EeIky9f3tHxpsjEfLr7diBsj1ZOptYjhAMNpVH1U6KEdRo5v+QORJkqsXjI5nT4ZgEBUf73EGsqudlCPfLPGi9Z9wgFytYBhQRtzmnOpBwyd1EhPB2D5CknHHV9VIsR+8XNOQKHebEyHXNCQKBjH2D0gwiIq1ZpeY3+Diy5BndgVy66S0mOYh5ZlFxcajHstnx7x8ETYe8Yh55qh1j9KkIEkAJm8+5vxcfdrr05y5QTnUrb57RccHSwBMDvaGfMJKAvAKgKkApgN4HcAbAGYDmF+oa/l6W4Plh9KToq2ksXuwpNEqlTb3OLY2/NK2vuyEFsC7AOYAeBOAAsCrAKYBmBIMxaTgx5RxIa8BmAngLQBzAcwHkAwgNcgCAO8AmAfgbQCzguYzosyT/gcSaJj+/BZ/OQAAAABJRU5ErkJggg==";
const FULLSCREEN_ICON =
  "data:image/png;base64,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";
const FULLSCREEN_EXIT_ICON =
  "data:image/png;base64,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";
const PLAY_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAF4UlEQVRIibWW+3NU9RnGz4ZR+5t0qjOVXmZ6M9b+0LEyuFRDjCEElMhEZlCSaWcohWgQoZE9e3Zdwg4Xd1FjJBQxlmgxbcm0NWNMJ6vBJuQCLCYxl92w2Vz3vtmTy2ZzOUnO7vrpDyklMEjbmfb9A97n+7zP+z7PVxBuU2KRqNXr9JIkSTUmo8lrNBgTRoMxYTKavJIk1eh1ekksErW363HL0ul0aZIolVst1pCtzobT4USWZVRVRVVVZFnG6XBiq7NhtVhDkiiV63S6tP+ouSiKheZic5fdbkdRFPrlODW9KmUXVV6pVzlYr/LbFpVah8pQJI6iKNjtdszF5i5RFAtv3/yAaKg6VxWWZZmrYZXfd8R58W8qOZXzPPHOHGknpkkvmSLz9SibS6fY/d40lS3z9IeWWFWdqwqLB0TDV7686lxVOB6PY3MtcvDvCTa8P8/qk7OsKZlm7fEpHnt1kvTD4zx+aIx0k0y6IUKWKYL43hSNXQvE4/ElkJuZ6HS6NHOxuUuWZWyuBXbVqDxyWuGh0lnWHI+hPRYl/fAE6SaZdVKETClClhhigxhiw4EQWS8HyTsSoaFjHlmWMRebu27QRBKlcrvdjiu8iL4+gfb0HNq3ZsksjfLUG2NsPBLhccMomfowG3R+Hi30kb0/yKb9AZ7c52fzvgCbX/JTVDLGgHcRu92OJErlS6MpErVWizWkKAoVbXEyKhRWl87w1IkJukeiBEfH6XGH2fSyi+KKMP3ecQxlg2TsHCB7t5cte3xsKfSSu8fHMy/6qPhwCkVRsFqsIbFI1Ap6nV6y1dkYlFV+8aHK2pMzPGKdYlvpKH6/n0hwhJGhfnJ/8zllf/SiTAcIhzz8pXaA7UX9bCzw8qwuSL4UJE8KssscZsi3iK3Ohl6nlwRJkmqcDifVjgWyziikl8Z49EiUba8F6HZcpdfRxRedX7D1pSsce9uNs6ed5uYmLrWcx1bfxK8PdfKtzX386DkfaXuDPGMM8dGFWZwOJ5Ik1Qgmo8kryzKvN6mkl82w/rUo6w6Nk2/xcdnezuVLTTQ0NvDDtTby97RS/0k11dXV1NZ+TGODjfb2Vk5UdnLflm6E9EHu2uLjl5YJZFnGZDR5BaPBmFBVlb0fLfLEmzGyLRNkFY+zzeyhobGZ5ubzXGhu5Js//Zj8fXau2M/TcvECbR2X6XZ04HJ3I0dcePw+cg66EHI8pBaMo6oqRoMx8S+A5/+8QPYbUZ62jvOTXSFSt/bSctlOX187Pb2drNLWscPUhWekE1e/gyFvH77gMKNyAHV+guhkkK2HLyLkeUkVY9cBro3oVds8OSWTpBaEELRD/GBTD73uPiLyMCPeIe5b9wkFFhexmIfQaICxyQgLC9Mk43NUX3Bx/wufIfzKjUYXI/dt5fqIron818/n+F5hBGH9CMKaAe7f2IPHH2R+YZLImMyq9fXsKR0imYwxvzAHfIk3PMHOt1rR7LAjGKbQHFPRHFawfLp4XeRra9o9PM/K5yJosoYRfubmgaxuxqOzAEzPzPHtJ+vZfzrAUiU495mL7+9tQCjyIpQmEcq+RDiRYOWpBFc8ietruvzQCt6cJCVzCOEhN999rIsrXTLB0Sk6egPcm9PI9pIAVz1jbLc2IexsQzg6i/AOrPgd3HEG7qiAgkZuPLTlVnGpZ4bU/BAr1rhJ+XEP9z7cxHcy6rknuxFNrpu7dvj4+q5OhBeGEY4nEE7DnRVw99kE36hMsroWWgPJG63iZrM7VTXJ134+yIoHexEe7EXQDiBke0nJG0XYPYFQNI3myCJCaYKUd+Hus0lW/SnOA9UJyq8mb212N9v1qcoxUrOHWPFwHykZg6Tk+EjJC6N5fhyNfgbNUQWhLMGdZ+CePyTJ+DTJ++7EV9v1rQLnYts0Ba+EWbnJi+ZpPyn5/wQQY0sAJ5OsrITCVrCHE/8+cJYzWR6Zbc45LB9EyT0WJVUfI/WoQu5ZFUtzgrZg8r+LzOWa/N9C/wY2/4Nvyz8A92FZT9kSnHgAAAAASUVORK5CYII=";
const PAUSE_ICON =
  "data:image/png;base64,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";

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

type GetElementOptions = {
  container: HTMLElement;
  selector: string;
};

function getElement<T extends Element>({ container, selector }: GetElementOptions): T | null {
  return container.querySelector<T>(selector);
}

function getElements<T extends Element>({ container, selector }: GetElementOptions): T[] {
  return Array.from(container.querySelectorAll<T>(selector));
}

function hideElement(element: HTMLElement): void {
  element.style.display = "none";
}

function showElement(element: HTMLElement): void {
  element.style.removeProperty("display");
}

function isVisible(element: HTMLElement): boolean {
  return element.offsetParent !== null && getComputedStyle(element).display !== "none";
}

type FadeOptions = {
  element: HTMLElement;
  durationMs: number;
};

function fadeIn({ element, durationMs }: FadeOptions): void {
  showElement(element);
  element.style.opacity = "0";
  if (durationMs <= 0 || !("animate" in element)) {
    element.style.opacity = "1";
    return;
  }
  const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: durationMs,
    fill: "forwards",
  });
  animation.onfinish = () => {
    element.style.opacity = "1";
  };
}

function fadeOut({ element, durationMs }: FadeOptions): void {
  if (durationMs <= 0 || !("animate" in element)) {
    hideElement(element);
    element.style.opacity = "";
    return;
  }
  const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: durationMs,
    fill: "forwards",
  });
  animation.onfinish = () => {
    hideElement(element);
    element.style.opacity = "";
  };
}

type SlideOptions = {
  element: HTMLElement;
  durationMs: number;
};

function slideDown({ element, durationMs }: SlideOptions): void {
  showElement(element);
  const fullHeight = element.scrollHeight;
  if (durationMs <= 0 || !("animate" in element)) {
    element.style.height = "";
    element.style.overflow = "";
    return;
  }
  element.style.overflow = "hidden";
  element.style.height = "0px";
  const animation = element.animate([{ height: "0px" }, { height: `${fullHeight}px` }], {
    duration: durationMs,
    fill: "forwards",
  });
  animation.onfinish = () => {
    element.style.height = "";
    element.style.overflow = "";
  };
}

function slideUp({ element, durationMs }: SlideOptions): void {
  const height = element.getBoundingClientRect().height;
  if (durationMs <= 0 || !("animate" in element)) {
    hideElement(element);
    element.style.height = "";
    element.style.overflow = "";
    return;
  }
  element.style.overflow = "hidden";
  element.style.height = `${height}px`;
  const animation = element.animate([{ height: `${height}px` }, { height: "0px" }], {
    duration: durationMs,
    fill: "forwards",
  });
  animation.onfinish = () => {
    hideElement(element);
    element.style.height = "";
    element.style.overflow = "";
  };
}

function resolveTransition(transition: TransitionType): "default" | "fade" | "slid" {
  if (transition !== "random") {
    return transition;
  }
  const availableTransitionTypes = ["default", "fade", "slid"] as const;
  const randomIndex = Math.floor(Math.random() * availableTransitionTypes.length);
  return availableTransitionTypes[randomIndex];
}

type TransitionOptions = {
  element: HTMLElement;
  transition: "default" | "fade" | "slid";
  durationMs: number;
};

function showWithTransition({ element, transition, durationMs }: TransitionOptions): void {
  if (transition === "fade") {
    fadeIn({ element, durationMs });
    return;
  }
  if (transition === "slid") {
    slideDown({ element, durationMs });
    return;
  }
  showElement(element);
}

function hideWithTransition({ element, transition, durationMs }: TransitionOptions): void {
  if (transition === "fade") {
    fadeOut({ element, durationMs });
    return;
  }
  if (transition === "slid") {
    slideUp({ element, durationMs });
    return;
  }
  hideElement(element);
}

type WrapAllOptions = {
  elements: HTMLElement[];
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

function getScaleFromTransform(transform: string): string {
  if (!transform || transform === "none") {
    return "1";
  }
  const match = transform.match(/matrix3d\(([^)]+)\)/) ?? transform.match(/matrix\(([^)]+)\)/);
  if (!match) {
    return "1";
  }
  const parts = match[1].split(",");
  return parts[0]?.trim() || "1";
}

function setHoverOpacity(element: HTMLElement): void {
  element.addEventListener("mouseover", () => {
    element.style.opacity = "1";
  });
  element.addEventListener("mouseout", () => {
    element.style.opacity = "0.7";
  });
}

function createIconButton(options: {
  id: string;
  className: string;
  alt: string;
  src: string;
  style: string;
  onClick: () => void;
}): HTMLImageElement {
  const img = document.createElement("img");
  img.id = options.id;
  img.className = options.className;
  img.alt = options.alt;
  img.src = options.src;
  img.style.cssText = options.style;
  img.addEventListener("click", options.onClick);
  return img;
}

type CreateSpanOptions = {
  id: string;
  text: string;
};

function createSpan({ id, text }: CreateSpanOptions): HTMLSpanElement {
  const span = document.createElement("span");
  span.id = id;
  span.textContent = text;
  return span;
}

/**
 * Initialize divs2slides for a container element
 */
type InitDivs2SlidesOptions = {
  target: HTMLElement;
  options?: Partial<Divs2SlidesSettings>;
};

export function initDivs2Slides({ target, options = {} }: InitDivs2SlidesOptions) {
  const defaultSettings: Divs2SlidesSettings = {
    first: 1,
    nav: true /** true,false : show or not nav buttons*/,
    showPlayPauseBtn: true /** true,false */,
    showFullscreenBtn: true /** true,false */,
    navTxtColor: "black" /** color */,
    keyBoardShortCut: true /** true,false */,
    showSlideNum: true /** true,false */,
    showTotalSlideNum: true /** true,false */,
    autoSlide: 1 /** false or seconds (the pause time between slides) , F8 to active(condition: keyBoardShortCut: true) */,
    randomAutoSlide: false /** true,false ,(condition: autoSlide:true */,
    loop: false /** true,false */,
    background: false /** false or color*/,
    transition:
      "default" /** transition type: "slid","fade","default","random" , to show transition efects :transitionTime > 0.5 */,
    transitionTime: 1 /** transition time in seconds */,
  };

  const settings: Divs2SlidesSettings = {
    ...defaultSettings,
    ...options,
  };

  const divId = ensureElementId(target);
  const slides = getElements<HTMLElement>({ container: target, selector: ".slide" });
  const totalSlides = slides.length;
  if (totalSlides === 0) {
    // Avoid initializing slide mode when there are no slides.
    return;
  }
  const slideCount = Math.min(Math.max(settings.first, 1), totalSlides);
  const autoSlideValue =
    typeof settings.autoSlide === "number" &&
    Number.isFinite(settings.autoSlide) &&
    settings.autoSlide > 0
      ? settings.autoSlide
      : settings.autoSlide
        ? 1
        : false;
  const backgroundValue = typeof settings.background === "string" ? settings.background : false;
  const transitionTime =
    Number.isFinite(settings.transitionTime) && settings.transitionTime > 0
      ? settings.transitionTime
      : defaultSettings.transitionTime;

  let orginalMainDivWidth = 0;
  let orginalMainDivHeight = 0;
  let orginalSlidesWarpperScale = "1";
  let orginalSlidesToolbarWidth = 0;
  let orginalSlidesToolbarTop = 0;

  const pptxjslideObj = {
    data: undefined as SlideData,

    init: function () {
      const data = pptxjslideObj.data;
      const isInit = data.isInit;

      data.slides.forEach((slide) => hideElement(slide));
      if (data.slctdBgClr !== false) {
        const preBgClr = document.body.style.backgroundColor;
        data.prevBgColor = preBgClr;
        document.body.style.backgroundColor = data.slctdBgClr;
      }
      if (data.nav && !isInit) {
        data.isInit = true;
        // Create navigators
        const toolbar = document.createElement("div");
        toolbar.className = "slides-toolbar";
        toolbar.style.cssText =
          "width: 90%; padding: 10px; text-align: center;font-size:18px; color: " +
          data.navTxtColor +
          ";";
        data.target.prepend(toolbar);

        toolbar.prepend(
          createIconButton({
            id: "slides-next",
            className: "slides-nav",
            alt: "Next Slide",
            src: NEXT_ICON,
            style: "float: right;cursor: pointer;opacity: 0.7;",
            onClick: () => pptxjslideObj.nextSlide(),
          })
        );

        if (data.showTotalSlideNum) {
          toolbar.prepend(
            createSpan({ id: "slides-total-slides-num", text: data.totalSlides.toString() })
          );
        }
        if (data.showSlideNum && data.showTotalSlideNum) {
          toolbar.prepend(createSpan({ id: "slides-slides-num-separator", text: " / " }));
        }
        if (data.showSlideNum) {
          toolbar.prepend(createSpan({ id: "slides-slide-num", text: data.slideCount.toString() }));
        }
        if (data.showFullscreenBtn) {
          toolbar.prepend(
            createIconButton({
              id: "slides-full-screen",
              className: "slides-nav-play",
              alt: "fullscreen Slide",
              src: FULLSCREEN_ICON,
              style: "float: left;cursor: pointer;opacity: 0.7; padding: 0 10px 0 10px",
              onClick: () => pptxjslideObj.fullscreen(),
            })
          );
        }
        if (data.showPlayPauseBtn) {
          toolbar.prepend(
            createIconButton({
              id: "slides-play-pause",
              className: "slides-nav-play",
              alt: "Play/Pause Slide",
              src: PLAY_ICON,
              style: "float: left;cursor: pointer;opacity: 0.7;  padding: 0 10px 0 10px",
              onClick: () => {
                if (data.isSlideMode) {
                  pptxjslideObj.startAutoSlide();
                }
              },
            })
          );
        }
        toolbar.prepend(
          createIconButton({
            id: "slides-prev",
            className: "slides-nav",
            alt: "Prev. Slide",
            src: PREV_ICON,
            style: "float: left;cursor: pointer; opacity: 0.7;",
            onClick: () => pptxjslideObj.prevSlide(),
          })
        );

        getElements<HTMLElement>({
          container: toolbar,
          selector: ".slides-nav, .slides-nav-play",
        }).forEach((nav) => setHoverOpacity(nav));

        const prevButton = getElement<HTMLElement>({
          container: data.target,
          selector: "#slides-prev",
        });
        const nextButton = getElement<HTMLElement>({
          container: data.target,
          selector: "#slides-next",
        });
        if (data.slideCount === 1) {
          if (prevButton) {
            hideElement(prevButton);
          }
        } else if (data.slideCount === data.totalSlides) {
          if (nextButton) {
            hideElement(nextButton);
          }
        } else if (nextButton) {
          showElement(nextButton);
        }
      } else {
        const toolbar = getElement<HTMLElement>({
          container: data.target,
          selector: ".slides-toolbar",
        });
        if (toolbar) {
          showElement(toolbar);
        }
        data.isEnbleNextBtn = true;
        data.isEnblePrevBtn = true;
      }
      if (!data.target.querySelector("#all_slides_warpper")) {
        const wrapper = document.createElement("div");
        wrapper.id = "all_slides_warpper";
        wrapAll({ elements: data.slides, wrapper });
      }
      // Go to first slide
      pptxjslideObj.gotoSlide(1);
    },
    nextSlide: function () {
      const data = pptxjslideObj.data;
      const isLoop = data.isLoop;
      const isAutoMode = data.isAutoSlideMode;
      if (data.slideCount < data.totalSlides) {
        pptxjslideObj.gotoSlide(data.slideCount + 1);
        if (!isAutoMode) {
          const nextButton = getElement<HTMLElement>({
            container: data.target,
            selector: "#slides-next",
          });
          if (nextButton) {
            showElement(nextButton);
          }
        }
      } else {
        if (isLoop) {
          pptxjslideObj.gotoSlide(1);
        } else {
          if (!isAutoMode) {
            const nextButton = getElement<HTMLElement>({
              container: data.target,
              selector: "#slides-next",
            });
            if (nextButton) {
              hideElement(nextButton);
            }
          }
        }
      }
      if (!isAutoMode) {
        const prevButton = getElement<HTMLElement>({
          container: data.target,
          selector: "#slides-prev",
        });
        const nextButton = getElement<HTMLElement>({
          container: data.target,
          selector: "#slides-next",
        });
        if (data.slideCount > 1) {
          if (prevButton) {
            showElement(prevButton);
          }
        } else if (prevButton) {
          hideElement(prevButton);
        }
        if (data.slideCount === data.totalSlides && !isLoop && nextButton) {
          hideElement(nextButton);
        }
      }
      //return this;
    },
    prevSlide: function () {
      const data = pptxjslideObj.data;
      const isAutoMode = data.isAutoSlideMode;
      if (data.slideCount > 1) {
        pptxjslideObj.gotoSlide(data.slideCount - 1);
      }
      if (!isAutoMode) {
        const prevButton = getElement<HTMLElement>({
          container: data.target,
          selector: "#slides-prev",
        });
        const nextButton = getElement<HTMLElement>({
          container: data.target,
          selector: "#slides-next",
        });
        if (data.slideCount === 1) {
          if (prevButton) {
            hideElement(prevButton);
          }
        } else if (prevButton) {
          showElement(prevButton);
        }
        if (nextButton) {
          showElement(nextButton);
        }
      }
      return this;
    },
    gotoSlide: function (idx: number) {
      const index = idx - 1;
      const data = pptxjslideObj.data;
      const slides = data.slides;
      const prevSlidNum = data.prevSlide;
      const transitionType = resolveTransition(data.transition);
      const transTime = 1000 * data.transitionTime;
      if (slides[index]) {
        const nextSlide = slides[index];
        const prevSlide = slides[prevSlidNum];
        if (prevSlide && isVisible(prevSlide)) {
          //remove "index >= 1 &&" bugFix to ver. 1.2.1
          hideWithTransition({
            element: prevSlide,
            transition: transitionType,
            durationMs: transTime,
          });
        }
        showWithTransition({
          element: nextSlide,
          transition: transitionType,
          durationMs: transTime,
        });
        data.prevSlide = index;
        pptxjslideObj.data.slideCount = idx;
        const slideNum = getElement<HTMLElement>({
          container: data.target,
          selector: "#slides-slide-num",
        });
        if (slideNum) {
          slideNum.textContent = idx.toString();
        }
      }
      return this;
    },
    keyDown: function (event: KeyboardEvent) {
      event.preventDefault();
      const key = event.keyCode;
      //console.log(key);
      const data = pptxjslideObj.data;
      switch (key) {
        case 37: // Left arrow
        case 8: // Backspace
          if (data.isSlideMode && data.isEnblePrevBtn) {
            pptxjslideObj.prevSlide();
          }
          break;
        case 39: // Right arrow
        case 32: // Space
        case 13: // Enter
          if (data.isSlideMode && data.isEnbleNextBtn) {
            pptxjslideObj.nextSlide();
          }
          break;
        case 46: //Delete
          //if in auto mode , stop auto mode TODO
          if (data.isSlideMode) {
            data.slides.forEach((slide) => hideElement(slide));
            pptxjslideObj.gotoSlide(1); //bugFix to ver. 1.2.1
          }
          break;
        case 27: //Esc
          if (data.isSlideMode) {
            pptxjslideObj.closeSileMode();
            data.isSlideMode = false;
          }
          break;
        case 116: //F5
          if (!data.isSlideMode) {
            pptxjslideObj.startSlideMode();
            data.isSlideMode = true;
            if (data.isAutoSlideMode || data.isLoopMode) {
              clearInterval(data.loopIntrval);
              data.isAutoSlideMode = false;
              data.isLoopMode = false;
            }
          }
          break;
        case 113: // F2
          if (data.isSlideMode) {
            pptxjslideObj.fullscreen();
          }
          break;
        case 119: // F8
          if (data.isSlideMode) {
            pptxjslideObj.startAutoSlide();
            //TODO : ADD indication that it is in auto slide mode
          }
          break;
      }
      return true;
    },
    startSlideMode: function () {
      pptxjslideObj.init();
    },
    closeSileMode: function () {
      const data = pptxjslideObj.data;
      data.isSlideMode = false;
      const toolbar = getElement<HTMLElement>({
        container: data.target,
        selector: ".slides-toolbar",
      });
      if (toolbar) {
        hideElement(toolbar);
      }
      data.slides.forEach((slide) => showElement(slide));
      if (pptxjslideObj.data.prevBgColor !== undefined) {
        document.body.style.backgroundColor = pptxjslideObj.data.prevBgColor;
      }
      if (data.isLoopMode) {
        clearInterval(data.loopIntrval);
        data.isLoopMode = false;
      }
      pptxjslideObj.exitFullscreenMod();
    },
    startAutoSlide: function () {
      const data = pptxjslideObj.data;
      const isAutoSlideOption = data.timeBetweenSlides;
      const isAutoSlideMode = data.isAutoSlideMode;
      if (!isAutoSlideMode && isAutoSlideOption !== false) {
        data.isAutoSlideMode = true;
        //var isLoopOption = data.isLoop;
        const isStrtLoop = data.isLoopMode;
        //hide and disable next and prev btn
        if (data.nav) {
          const navButtons = getElements<HTMLElement>({
            container: data.target,
            selector: ".slides-toolbar .slides-nav",
          });
          navButtons.forEach((button) => hideElement(button));
          const playPause = getElement<HTMLImageElement>({
            container: data.target,
            selector: "#slides-play-pause",
          });
          if (playPause) {
            playPause.src = PAUSE_ICON;
          }
        }
        data.isEnbleNextBtn = false;
        data.isEnblePrevBtn = false;
        ///////////////////////////////

        const slideIntervalSeconds = typeof isAutoSlideOption === "number" ? isAutoSlideOption : 1;
        const t = slideIntervalSeconds + data.transitionTime;

        const slideNums = data.totalSlides;
        const isRandomSlide = data.randomAutoSlide;

        if (!isStrtLoop) {
          const timeBtweenSlides = t * 1000; //milisecons
          data.isLoopMode = true;
          data.loopIntrval = setInterval(function () {
            if (isRandomSlide) {
              const randomSlideNum = Math.floor(Math.random() * slideNums) + 1;
              pptxjslideObj.gotoSlide(randomSlideNum);
            } else {
              pptxjslideObj.nextSlide();
            }
          }, timeBtweenSlides);
        } else {
          clearInterval(data.loopIntrval);
          data.isLoopMode = false;
        }
      } else {
        clearInterval(data.loopIntrval);
        data.isAutoSlideMode = false;
        data.isLoopMode = false;
        //show and enable next and prev btn
        if (data.nav) {
          const navButtons = getElements<HTMLElement>({
            container: data.target,
            selector: ".slides-toolbar .slides-nav",
          });
          navButtons.forEach((button) => showElement(button));
          const playPause = getElement<HTMLImageElement>({
            container: data.target,
            selector: "#slides-play-pause",
          });
          if (playPause) {
            playPause.src = PLAY_ICON;
          }
        }
        data.isEnbleNextBtn = true;
        data.isEnblePrevBtn = true;
      }
    },
    fullscreen: function () {
      const data = pptxjslideObj.data;
      const container = data.target;
      if (!document.fullscreenElement) {
        // current working methods
        if (!container.requestFullscreen) {
          return;
        }
        void container.requestFullscreen().catch(() => undefined);
        const winWidth = window.innerWidth || document.documentElement.clientWidth;
        const winHeight = window.innerHeight || document.documentElement.clientHeight;
        //Need to save:
        const containerRect = container.getBoundingClientRect();
        orginalMainDivWidth = containerRect.width;
        orginalMainDivHeight = containerRect.height;
        const wrapper = getElement<HTMLElement>({
          container: container,
          selector: "#all_slides_warpper",
        });
        if (wrapper) {
          const m = getComputedStyle(wrapper).transform;
          orginalSlidesWarpperScale = getScaleFromTransform(m);
        }
        const toolbar = getElement<HTMLElement>({
          container: container,
          selector: ".slides-toolbar",
        });
        if (toolbar) {
          const toolbarRect = toolbar.getBoundingClientRect();
          orginalSlidesToolbarWidth = toolbarRect.width;
          orginalSlidesToolbarTop = toolbarRect.top + window.scrollY;
        }

        container.style.width = `${winWidth - 10}px`;
        container.style.height = `${winHeight - 10}px`;

        if (wrapper) {
          wrapper.style.transform = "scale(1)";
        }

        const slide = getElement<HTMLElement>({
          container: container,
          selector: "#all_slides_warpper .slide",
        });
        if (slide) {
          const slideRect = slide.getBoundingClientRect();
          slide.style.top = `${(winHeight - slideRect.height) / 2}px`;
          slide.style.left = `${(winWidth - slideRect.width) / 2}px`;
        }

        if (data.nav && toolbar) {
          toolbar.style.width = "99%";
          toolbar.style.top = "20px";
        }
        //change fullscreen icon to other icon (red color)
        const fullscreenBtn = getElement<HTMLImageElement>({
          container: container,
          selector: "#slides-full-screen",
        });
        if (fullscreenBtn) {
          fullscreenBtn.src = FULLSCREEN_EXIT_ICON;
        }
      } else {
        if (document.exitFullscreen) {
          void document.exitFullscreen().catch(() => undefined);
        }

        pptxjslideObj.exitFullscreenMod();
      }
    },
    exitFullscreenMod: function () {
      const data = pptxjslideObj.data;
      const container = data.target;
      //saved:
      /*
            orginalMainDivWidth
            orginalMainDivHeight
            orginalSlidesWarpperScale
            orginalSlidesToolbarWidth
            orginalSlidesToolbarTop
            */
      container.style.width = `${orginalMainDivWidth}px`;
      container.style.height = `${orginalMainDivHeight}px`;
      const wrapper = getElement<HTMLElement>({
        container: container,
        selector: "#all_slides_warpper",
      });
      if (wrapper) {
        wrapper.style.transform = `scale(${orginalSlidesWarpperScale})`;
      }

      const slide = getElement<HTMLElement>({
        container: container,
        selector: "#all_slides_warpper .slide",
      });
      if (slide) {
        slide.style.top = "0px";
        slide.style.left = "0px";
      }

      const toolbar = getElement<HTMLElement>({
        container: container,
        selector: ".slides-toolbar",
      });
      if (data.nav && toolbar) {
        toolbar.style.width = `${orginalSlidesToolbarWidth}px`;
        toolbar.style.top = `${orginalSlidesToolbarTop}px`;
      }

      //change fullscreen icon to orginal icon - TODO
      const fullscreenBtn = getElement<HTMLImageElement>({
        container: container,
        selector: "#slides-full-screen",
      });
      if (fullscreenBtn) {
        fullscreenBtn.src = FULLSCREEN_ICON;
      }
    },
  };

  pptxjslideObj.data = {
    nav: settings.nav,
    navTxtColor: settings.navTxtColor,
    showPlayPauseBtn: settings.showPlayPauseBtn,
    showFullscreenBtn: settings.showFullscreenBtn,
    showSlideNum: settings.showSlideNum,
    showTotalSlideNum: settings.showTotalSlideNum,
    target: target,
    divId: divId,
    slides: slides,
    isSlideMode: true,
    totalSlides: totalSlides,
    slideCount: slideCount,
    prevSlide: 0,
    transition: settings.transition,
    transitionTime: transitionTime,
    slctdBgClr: backgroundValue,
    prevBgColor: undefined,
    timeBetweenSlides: autoSlideValue,
    isLoop: settings.loop,
    isLoopMode: false,
    isAutoSlideMode: false,
    randomAutoSlide: settings.randomAutoSlide,
    isEnbleNextBtn: true,
    isEnblePrevBtn: true,
    isInit: false,
  } as SlideData;

  // Keyboard shortcuts
  if (settings.keyBoardShortCut) {
    document.addEventListener("keydown", pptxjslideObj.keyDown);
  }
  if (document.addEventListener) {
    document.addEventListener("fullscreenchange", exitHandler, false);
  }

  function exitHandler() {
    if (document.fullscreenElement === null) {
      pptxjslideObj.exitFullscreenMod();
    }
  }
  pptxjslideObj.init();
}
