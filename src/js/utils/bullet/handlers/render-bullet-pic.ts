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
import type { PptxArchive } from "../../../archive/pptx-archive";

type BulletPicNode = Record<string, unknown>;
type BulletWarpObj = {
  slideResObj: Record<string, { target: string }>;
  archive: PptxArchive;
};

export async function renderBulletPic(
  bulletPicNode: BulletPicNode,
  warpContext: BulletWarpObj,
  marginLeftStyle: string,
  marginRightStyle: string,
  bulletSize: string,
  isRtl: boolean
): Promise<string> {
  const bulletPicId = getTextByPathList<string>(bulletPicNode, ["a:blip", "attrs", "r:embed"]);
  let bulletImageHtml = "";

  if (bulletPicId !== undefined) {
    const imgPath = warpContext["slideResObj"][bulletPicId]["target"];
    const imgFile = await warpContext.archive.file(imgPath);
    if (!imgFile) {
      bulletImageHtml = "&#8227;";
    } else {
      const imgArrayBuffer = await imgFile.arrayBuffer();
      const imgExt = imgPath.split(".").pop() ?? "";
      const imgMimeType = getMimeType(imgExt);
      bulletImageHtml =
        "<img src='data:" +
        imgMimeType +
        ";base64," +
        base64ArrayBuffer(imgArrayBuffer) +
        "' style='width: 100%;'/>";
    }
  }

  if (bulletPicId === undefined) {
    bulletImageHtml = "&#8227;";
  }

  let bullet =
    "<div style='height: 100%;" +
    marginLeftStyle +
    marginRightStyle +
    "width:" +
    bulletSize +
    ";display: inline-block; ";

  if (isRtl) {
    bullet += "display: inline-block;white-space: nowrap ;direction:rtl;";
  }

  bullet += "'>" + bulletImageHtml + "  </div>";

  return bullet;
}
