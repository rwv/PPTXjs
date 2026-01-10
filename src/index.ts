import { ensurePptxDependencies, pptxToHtml } from "./pptxjs-entry";

type PptxToHtmlOptions = {
  pptxFileUrl: string;
  slidesScale: string;
  slideMode: boolean;
  keyBoardShortCut: boolean;
  mediaProcess: boolean;
};

export async function getPageElementsFromPPTX(file: Blob) {
  const url = URL.createObjectURL(file);

  await ensurePptxDependencies();

  const element = document.createElement("div");
  const elementID = crypto.randomUUID();
  element.id = elementID;
  document.body.appendChild(element);

  const options: PptxToHtmlOptions = {
    pptxFileUrl: url,
    slidesScale: "100%",
    slideMode: false,
    keyBoardShortCut: false,
    mediaProcess: false,
  };
  await pptxToHtml(element, options);

  // Wait until slides are loaded
  await new Promise<void>((resolve) => {
    const check = () => {
      const slidesWrapper = document.getElementById("all_slides_warpper");
      if (slidesWrapper) {
        // Add test-id for easier testing
        slidesWrapper.setAttribute("data-testid", "pptx-slides");
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

  URL.revokeObjectURL(url);

  const pages = document.querySelectorAll(`.slide`);
  if (pages.length === 0) {
    throw new Error("Failed to find slides");
  }

  return {
    pages,
    element,
  };
}
