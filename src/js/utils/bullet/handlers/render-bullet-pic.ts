/**
 * Render picture bullet (TYPE_BULPIC)
 *
 * Handles picture bullets (embedded images) with:
 * - Image extraction from PPTX ZIP
 * - Base64 encoding for inline embedding
 * - MIME type detection
 * - Fallback to character bullet if image not found
 * - RTL support
 */

import { getTextByPathList } from "../../object";
import { getMimeType, base64ArrayBuffer } from "../../media";

export function renderBulletPic(
  buPic: any,
  warpObj: any,
  marLStr: string,
  marRStr: string,
  bultSize: string,
  isRTL: boolean
): string {
  const buPicId = getTextByPathList(buPic, ["a:blip", "attrs", "r:embed"]);
  let buImg;

  if (buPicId !== undefined) {
    const imgPath = warpObj["slideResObj"][buPicId]["target"];
    const imgArrayBuffer = warpObj["zip"].file(imgPath).asArrayBuffer();
    const imgExt = imgPath.split(".").pop();
    const imgMimeType = getMimeType(imgExt);
    buImg =
      "<img src='data:" +
      imgMimeType +
      ";base64," +
      base64ArrayBuffer(imgArrayBuffer) +
      "' style='width: 100%;'/>";
  }

  if (buPicId === undefined) {
    buImg = "&#8227;";
  }

  let bullet =
    "<div style='height: 100%;" +
    marLStr +
    marRStr +
    "width:" +
    bultSize +
    ";display: inline-block; ";

  if (isRTL) {
    bullet += "display: inline-block;white-space: nowrap ;direction:rtl;";
  }

  bullet += "'>" + buImg + "  </div>";

  return bullet;
}
