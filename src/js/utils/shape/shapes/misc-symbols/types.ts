/**
 * Context for rendering misc symbol shapes
 */
import type { XmlNode } from "../../../../types/pptx-xml";

export interface MiscSymbolContext {
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
  setTxtRotate?: (angle: number) => void;
}
