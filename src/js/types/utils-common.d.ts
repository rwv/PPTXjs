/**
 * PPTXjs工具函数通用类型
 *
 * 用途：为工具函数提供共享的类型定义
 */

/**
 * EMU（English Metric Units）到像素的转换因子
 *
 * 值：96 / 914400
 * 用途：PPTX内部使用EMU单位，需要转换为CSS像素
 */
export type SlideFactor = number;

/**
 * 字体大小缩放因子
 *
 * 值：4 / 3.2
 * 用途：调整字体大小以匹配渲染
 */
export type FontSizeFactor = number;

/**
 * 路径列表 - 用于对象遍历
 *
 * 示例：["a:pPr", "attrs", "rtl"] 或 ["p:txBody", 0, "a:p"]
 */
export type PathList = (string | number)[];

/**
 * RGB颜色对象
 */
export interface RgbColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * HSL颜色对象
 */
export interface HslColor {
  h: number; // 0-360
  s: number; // 0-1
  l: number; // 0-1
}

/**
 * 位置信息（CSS定位）
 */
export interface PositionInfo {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
}

/**
 * 尺寸信息
 */
export interface SizeInfo {
  width: string;
  height: string;
}
