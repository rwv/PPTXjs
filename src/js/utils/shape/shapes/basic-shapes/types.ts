export interface BasicShapeParams {
  node: unknown;
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
