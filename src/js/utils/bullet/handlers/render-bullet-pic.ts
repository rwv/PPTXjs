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
  var buPicId = getTextByPathList(buPic, ["a:blip", "attrs", "r:embed"]);
  var buImg;

  if (buPicId !== undefined) {
    var imgPath = warpObj["slideResObj"][buPicId]["target"];
    var imgArrayBuffer = warpObj["zip"].file(imgPath).asArrayBuffer();
    var imgExt = imgPath.split(".").pop();
    var imgMimeType = getMimeType(imgExt);
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

  var bullet =
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
