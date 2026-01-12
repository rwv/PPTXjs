/**
 * Context for rendering math shapes
 */
import type { XmlNode } from "../../../../types/pptx-xml";

export interface MathShapeContext {
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
