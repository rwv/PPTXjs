import { ZipReader, Uint8ArrayReader } from "@zip.js/zip.js";

import type { FileEntry } from "@zip.js/zip.js";
import type { PptxArchive } from "./pptx-archive";

type FileMap = Map<string, ArrayBuffer>;

/**
 * Zip.js adapter for PptxArchive interface
 *
 * Zip.js exposes async-only APIs, so we pre-load all entries into memory
 * to keep the existing synchronous archive interface intact.
 */
export class ZipJsAdapter implements PptxArchive {
  private files: FileMap;
  private textCache = new Map<string, string>();
  private decoder = new TextDecoder();

  private constructor(files: FileMap) {
    this.files = files;
  }

  static async fromArrayBuffer(data: ArrayBuffer): Promise<ZipJsAdapter> {
    const reader = new ZipReader(new Uint8ArrayReader(new Uint8Array(data)));
    const entries = await reader.getEntries();
    const files: FileMap = new Map();

    for (const entry of entries) {
      if (entry.directory) {
        continue;
      }
      const fileEntry = entry as FileEntry;
      const fileBuffer = await fileEntry.arrayBuffer();
      files.set(entry.filename, fileBuffer);
    }

    await reader.close();

    return new ZipJsAdapter(files);
  }

  hasFile(path: string): boolean {
    return this.files.has(path);
  }

  readAsArrayBuffer(path: string): ArrayBuffer {
    const file = this.files.get(path);
    if (!file) {
      throw new Error(`File not found in archive: ${path}`);
    }
    return file;
  }

  readAsText(path: string): string {
    const cached = this.textCache.get(path);
    if (cached) {
      return cached;
    }
    const file = this.readAsArrayBuffer(path);
    const text = this.decoder.decode(file);
    this.textCache.set(path, text);
    return text;
  }
}
