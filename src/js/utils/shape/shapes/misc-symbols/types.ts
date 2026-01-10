/**
 * Context for rendering misc symbol shapes
 */
export interface MiscSymbolContext {
  node: unknown;
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
