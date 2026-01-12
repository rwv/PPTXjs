/**
 * Context for rendering ribbon shapes
 */
import type { XmlNode } from "../../../../types/pptx-xml";

export interface RibbonContext {
  node: XmlNode;
  w: number;
  h: number;
  shpId: string;
  fillColor: string;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  border: {
    color: string;
    width: string;
    strokeDasharray: string;
  };
  slideFactor: number;
}
