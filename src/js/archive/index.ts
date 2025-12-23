import type { PptxArchive } from "./pptx-archive";
import { JSZipV2Adapter } from "./jszip-v2-adapter";

export type { PptxArchive } from "./pptx-archive";
export { JSZipV2Adapter } from "./jszip-v2-adapter";

/**
 * Create a new PPTX archive instance
 * Factory function to allow future switching of implementations
 *
 * @param data - PPTX file as ArrayBuffer
 * @returns PptxArchive instance with loaded PPTX file
 *
 * @example
 * const archive = createPptxArchive(fileData);
 * const slideXml = archive.readAsText("ppt/slides/slide1.xml");
 * const imageData = archive.readAsArrayBuffer("ppt/media/image1.png");
 */
export function createPptxArchive(data: ArrayBuffer): PptxArchive {
  return new JSZipV2Adapter(data);
}
