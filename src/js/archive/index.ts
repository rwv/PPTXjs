import type { PptxArchive } from "./pptx-archive";
import { ZipJsAdapter } from "./zipjs-adapter";

export type { PptxArchive, PPTXArchiveFile } from "./pptx-archive";
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
 * const slideFile = await archive.file("ppt/slides/slide1.xml");
 * const slideXml = slideFile ? await slideFile.text() : "";
 * const imageFile = await archive.file("ppt/media/image1.png");
 * const imageData = imageFile ? await imageFile.arrayBuffer() : new ArrayBuffer(0);
 */
export async function createPptxArchive(data: ArrayBuffer): Promise<PptxArchive> {
  return ZipJsAdapter.fromArrayBuffer(data);
}
