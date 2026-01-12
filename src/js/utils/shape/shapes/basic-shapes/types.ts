import type { XmlNode } from "../../../../types/pptx-xml";

export interface BasicShapeParams {
  node: XmlNode;
  w: number;
  h: number;
  shpId: number | string;
  fillColor: string;
  grndFillFlg: boolean;
  imgFillFlg: boolean;
  border: {
    color: string;
    width: string;
    strokeDasharray: string;
  };
}
