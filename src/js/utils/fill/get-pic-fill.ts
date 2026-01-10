import { getTextByPathList, setTextByPathList } from "../object";
import { escapeHtml } from "../string/escape-html";
import { getMimeType } from "../media/get-mime-type";
import { base64ArrayBuffer } from "../media/base64-array-buffer";
import type { PptxArchive } from "../../archive/pptx-archive";

/**
 * Extracts picture fill from PPTX and returns base64 data URL
 *
 * Resolves image resource ID (r:embed) to actual image path, reads the image
 * from the ZIP archive, and converts it to a base64 data URL for use in CSS.
 * Caches loaded images in warpObj to avoid duplicate processing.
 *
 * @param type - Source type (slide, slideBg, slideLayoutBg, slideMasterBg, themeBg, diagramBg)
 * @param node - Blip fill node containing image reference (a:blipFill)
 * @param warpObj - Container object with ZIP file and resource mappings
 * @returns Base64 data URL of the image, or undefined if not found
 */
type ResourceMap = Record<string, { target: string }>;
type PicWarpObj = {
  slideResObj?: ResourceMap;
  layoutResObj?: ResourceMap;
  masterResObj?: ResourceMap;
  themeResObj?: ResourceMap;
  diagramResObj?: ResourceMap;
  archive: PptxArchive;
  [key: string]: unknown;
};

export async function getPicFill(
  type: string,
  node: Record<string, unknown>,
  warpObj: PicWarpObj
): Promise<string | undefined> {
  let img: string | undefined;
  const rId = getTextByPathList<string>(node, ["a:blip", "attrs", "r:embed"]);
  if (rId === undefined) {
    return undefined;
  }
  let imgPath;
  if (type === "slideBg" || type === "slide") {
    imgPath = getTextByPathList<string>(warpObj, ["slideResObj", rId, "target"]);
  } else if (type === "slideLayoutBg") {
    imgPath = getTextByPathList<string>(warpObj, ["layoutResObj", rId, "target"]);
  } else if (type === "slideMasterBg") {
    imgPath = getTextByPathList<string>(warpObj, ["masterResObj", rId, "target"]);
  } else if (type === "themeBg") {
    imgPath = getTextByPathList<string>(warpObj, ["themeResObj", rId, "target"]);
  } else if (type === "diagramBg") {
    imgPath = getTextByPathList<string>(warpObj, ["diagramResObj", rId, "target"]);
  }
  if (imgPath === undefined) {
    return undefined;
  }
  img = getTextByPathList<string>(warpObj, ["loaded-images", imgPath]);
  if (img === undefined) {
    imgPath = escapeHtml(imgPath);

    const imgExt = imgPath.split(".").pop() ?? "";
    if (imgExt === "xml") {
      return undefined;
    }
    const imgFile = await warpObj.archive.file(imgPath);
    if (!imgFile) {
      throw new Error(`File not found in archive: ${imgPath}`);
    }
    const imgArrayBuffer = await imgFile.arrayBuffer();
    const imgMimeType = getMimeType(imgExt);
    img = "data:" + imgMimeType + ";base64," + base64ArrayBuffer(imgArrayBuffer);
    setTextByPathList(warpObj, ["loaded-images", imgPath], img);
  }
  return img;
}
