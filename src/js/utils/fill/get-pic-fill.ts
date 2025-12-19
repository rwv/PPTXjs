import { getTextByPathList, setTextByPathList } from "../object";
import { escapeHtml } from "../string/escape-html";
import { getMimeType } from "../media/get-mime-type";
import { base64ArrayBuffer } from "../media/base64-array-buffer";

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
export function getPicFill(type: any, node: any, warpObj: any) {
  var img;
  var rId = node["a:blip"]["attrs"]["r:embed"];
  var imgPath;
  if (type == "slideBg" || type == "slide") {
    imgPath = getTextByPathList(warpObj, ["slideResObj", rId, "target"]);
  } else if (type == "slideLayoutBg") {
    imgPath = getTextByPathList(warpObj, ["layoutResObj", rId, "target"]);
  } else if (type == "slideMasterBg") {
    imgPath = getTextByPathList(warpObj, ["masterResObj", rId, "target"]);
  } else if (type == "themeBg") {
    imgPath = getTextByPathList(warpObj, ["themeResObj", rId, "target"]);
  } else if (type == "diagramBg") {
    imgPath = getTextByPathList(warpObj, ["diagramResObj", rId, "target"]);
  }
  if (imgPath === undefined) {
    return undefined;
  }
  img = getTextByPathList(warpObj, ["loaded-images", imgPath]);
  if (img === undefined) {
    imgPath = escapeHtml(imgPath);

    var imgExt = imgPath.split(".").pop();
    if (imgExt == "xml") {
      return undefined;
    }
    var imgArrayBuffer = warpObj["zip"].file(imgPath).asArrayBuffer();
    var imgMimeType = getMimeType(imgExt);
    img = "data:" + imgMimeType + ";base64," + base64ArrayBuffer(imgArrayBuffer);
    setTextByPathList(warpObj, ["loaded-images", imgPath], img);
  }
  return img;
}
