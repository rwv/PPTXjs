import type { PptxArchive } from "./pptx-archive";
import { ZipJsAdapter } from "./zipjs-adapter";

export type { PptxArchive } from "./pptx-archive";
export { ZipJsAdapter } from "./zipjs-adapter";

/**
 * Create a new PPTX archive instance
 * Factory function to allow future switching of implementations
 *
 * @param data - PPTX file as ArrayBuffer
 * @returns PptxArchive instance with loaded PPTX file
 *
 * @example
 * const archive = await createPptxArchive(fileData);
 * const slideXml = archive.readAsText("ppt/slides/slide1.xml");
 * const imageData = archive.readAsArrayBuffer("ppt/media/image1.png");
 */
export async function createPptxArchive(data: ArrayBuffer): Promise<PptxArchive> {
  return ZipJsAdapter.fromArrayBuffer(data);
}
