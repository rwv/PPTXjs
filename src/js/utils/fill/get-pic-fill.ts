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
 * Caches loaded images in warpContext to avoid duplicate processing.
 *
 * @param sourceType - Source type (slide, slideBg, slideLayoutBg, slideMasterBg, themeBg, diagramBg)
 * @param blipFillNode - Blip fill node containing image reference (a:blipFill)
 * @param warpContext - Container object with ZIP file and resource mappings
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
  sourceType: string,
  blipFillNode: Record<string, unknown>,
  warpContext: PicWarpObj
): Promise<string | undefined> {
  let imageDataUrl: string | undefined;
  const relationshipId = getTextByPathList<string>(blipFillNode, ["a:blip", "attrs", "r:embed"]);
  if (relationshipId === undefined) {
    return undefined;
  }
  let imagePath;
  if (sourceType === "slideBg" || sourceType === "slide") {
    imagePath = getTextByPathList<string>(warpContext, ["slideResObj", relationshipId, "target"]);
  } else if (sourceType === "slideLayoutBg") {
    imagePath = getTextByPathList<string>(warpContext, ["layoutResObj", relationshipId, "target"]);
  } else if (sourceType === "slideMasterBg") {
    imagePath = getTextByPathList<string>(warpContext, ["masterResObj", relationshipId, "target"]);
  } else if (sourceType === "themeBg") {
    imagePath = getTextByPathList<string>(warpContext, ["themeResObj", relationshipId, "target"]);
  } else if (sourceType === "diagramBg") {
    imagePath = getTextByPathList<string>(warpContext, ["diagramResObj", relationshipId, "target"]);
  }
  if (imagePath === undefined) {
    return undefined;
  }
  imageDataUrl = getTextByPathList<string>(warpContext, ["loaded-images", imagePath]);
  if (imageDataUrl === undefined) {
    imagePath = escapeHtml(imagePath);

    const imageExtension = imagePath.split(".").pop() ?? "";
    if (imageExtension === "xml") {
      return undefined;
    }
    const imageFile = await warpContext.archive.file(imagePath);
    if (!imageFile) {
      throw new Error(`File not found in archive: ${imagePath}`);
    }
    const imageArrayBuffer = await imageFile.arrayBuffer();
    const imageMimeType = getMimeType(imageExtension);
    imageDataUrl = "data:" + imageMimeType + ";base64," + base64ArrayBuffer(imageArrayBuffer);
    setTextByPathList(warpContext, ["loaded-images", imagePath], imageDataUrl);
  }
  return imageDataUrl;
}
