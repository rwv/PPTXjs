import { PptxArchive } from "./pptx-archive";

/**
 * JSZip v2.x adapter for PptxArchive interface
 * Wraps JSZip v2 API to isolate library-specific code
 *
 * This adapter allows the codebase to use a clean, simple interface
 * while maintaining compatibility with JSZip v2.x. When upgrading to
 * JSZip v3.x, only this adapter needs to be replaced.
 */
export class JSZipV2Adapter implements PptxArchive {
  private zip: any; // JSZip v2 instance (type is 'any' because JSZip v2 has no types)

  /**
   * Create and load PPTX archive from file
   * @param data - PPTX file as ArrayBuffer
   */
  constructor(data: ArrayBuffer) {
    // @ts-expect-error - JSZip v2 is loaded globally via script tag
    this.zip = new JSZip();
    this.zip.load(data);
  }

  hasFile(path: string): boolean {
    return this.zip.file(path) !== null;
  }

  readAsArrayBuffer(path: string): ArrayBuffer {
    const file = this.zip.file(path);
    if (!file) {
      throw new Error(`File not found in archive: ${path}`);
    }
    return file.asArrayBuffer();
  }

  readAsText(path: string): string {
    const file = this.zip.file(path);
    if (!file) {
      throw new Error(`File not found in archive: ${path}`);
    }
    return file.asText();
  }
}
