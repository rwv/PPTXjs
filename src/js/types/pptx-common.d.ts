/**
 * PPTXjs核心类型定义
 *
 * 用途：为PPTX处理提供统一的类型定义
 */

/**
 * PPTX XML节点类型
 *
 * 注意：根据CLAUDE.md指导，tXml解析器产生的XML节点对象
 * 结构复杂且动态，应保持为any类型
 */
export type PptxNode = any;

/**
 * WarpObject - PPTXjs的核心上下文对象
 *
 * 包含幻灯片内容、布局、母版、主题和资源引用
 */
export interface WarpObject {
  // 幻灯片内容层级
  slideContent?: PptxNode;
  slideLayoutContent?: PptxNode;
  slideMasterContent?: PptxNode;
  themeContent?: PptxNode;

  // 布局和母版表
  slideLayoutTables?: SlideLayoutTables;
  slideMasterTables?: SlideMasterTables;

  // 资源引用
  slideResObj?: Record<string, { target: string }>;

  // JSZip存档
  archive?: any; // PptxArchive接口

  // 其他动态属性
  [key: string]: any;
}

/**
 * 颜色映射表（来自主题）
 */
export interface ColorMap {
  tx1?: string; // Text 1
  bg1?: string; // Background 1
  tx2?: string; // Text 2
  bg2?: string; // Background 2
  accent1?: string; // Accent 1
  accent2?: string;
  accent3?: string;
  accent4?: string;
  accent5?: string;
  accent6?: string;
  hlink?: string; // Hyperlink
  folHlink?: string; // Followed hyperlink
  [key: string]: string | undefined;
}

/**
 * 幻灯片布局表
 */
export interface SlideLayoutTables {
  layoutTables?: Record<string, any>;
  [key: string]: any;
}

/**
 * 母版幻灯片表
 */
export interface SlideMasterTables {
  masterTextStyles?: Record<string, any>;
  [key: string]: any;
}

/**
 * 形状类型
 */
export type ShapeType =
  | "title"
  | "body"
  | "textBox"
  | "pic"
  | "chart"
  | "tbl"
  | "cxnSp" // Connector shape
  | "grpSp" // Group shape
  | string;

/**
 * 填充类型
 */
export type FillType =
  | "NO_FILL"
  | "SOLID_FILL"
  | "GRADIENT_FILL"
  | "PATTERN_FILL"
  | "PICTURE_FILL"
  | "";

/**
 * 边框样式
 */
export interface BorderStyle {
  color: string;
  width: number | string;
  strokeDasharray: string;
}

/**
 * Border type used in shape rendering
 * Can be a string ("hidden"), an object with border properties, or undefined
 */
export type BorderType =
  | string
  | {
      color: string;
      width: string;
      strokeDasharray: string;
    }
  | undefined;

/**
 * 文本方向
 */
export type TextDirection = "ltr" | "rtl" | "";

/**
 * 垂直对齐
 */
export type VerticalAlign = "t" | "ctr" | "b" | "";

/**
 * 水平对齐
 */
export type HorizontalAlign = "l" | "ctr" | "r" | "just" | "dist" | "";

/**
 * 幻灯片尺寸
 */
export interface SlideSize {
  width: number;
  height: number;
  appVersion?: any; // PPT application version (optional, complex structure)
}

/**
 * PPTXjs插件设置
 */
export interface PptxSettings {
  pptxFileUrl: string;
  fileInputId: string;
  slidesScale: string;
  slideMode: boolean;
  slideType: string; // "divs2slidesjs" | "revealjs"
  revealjsPath: string;
  keyBoardShortCut: boolean;
  mediaProcess: boolean;
  jsZipV2: boolean | string; // false or path to JSZip v2
  themeProcess: boolean | string; // true | false | "colorsAndImageOnly"
  incSlide: {
    width: number;
    height: number;
  };
  slideModeConfig: any; // Complex configuration object
  revealjsConfig: any; // Reveal.js configuration object
}
