export type RenderSettings = {
  incSlide: { width: number; height: number };
  themeProcess: boolean | "colorsAndImageOnly";
  slideMode: boolean;
  slideType: "divs2slidesjs" | "revealjs";
  mediaProcess: boolean;
} & Record<string, unknown>;
