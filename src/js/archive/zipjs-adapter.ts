import { ZipReader, Uint8ArrayReader } from "@zip.js/zip.js";

import type { FileEntry } from "@zip.js/zip.js";
import type { PptxArchive } from "./pptx-archive";

type EntryMap = Map<string, FileEntry>;

/**
 * Zip.js adapter for PptxArchive interface
 *
 * Zip.js exposes async-only APIs, so reads are async and cached.
 */
export class ZipJsAdapter implements PptxArchive {
  private reader: ZipReader<Uint8Array>;
  private entries: EntryMap;
  private arrayBufferCache = new Map<string, ArrayBuffer>();
  private textCache = new Map<string, string>();
  private decoder = new TextDecoder();

  private constructor(reader: ZipReader<Uint8Array>, entries: EntryMap) {
    this.reader = reader;
    this.entries = entries;
  }

  static async fromArrayBuffer(data: ArrayBuffer): Promise<ZipJsAdapter> {
    const reader = new ZipReader(new Uint8ArrayReader(new Uint8Array(data)));
    const entries = await reader.getEntries();
    const fileEntries: EntryMap = new Map();

    for (const entry of entries) {
      if (entry.directory) {
        continue;
      }
      const fileEntry = entry as FileEntry;
      fileEntries.set(entry.filename, fileEntry);
    }

    return new ZipJsAdapter(reader, fileEntries);
  }

  async hasFile(path: string): Promise<boolean> {
    return this.entries.has(path);
  }

  async readAsArrayBuffer(path: string): Promise<ArrayBuffer> {
    const cached = this.arrayBufferCache.get(path);
    if (cached) {
      return cached;
    }
    const entry = this.entries.get(path);
    if (!entry) {
      throw new Error(`File not found in archive: ${path}`);
    }
    const fileBuffer = await entry.arrayBuffer();
    this.arrayBufferCache.set(path, fileBuffer);
    return fileBuffer;
  }

  async readAsText(path: string): Promise<string> {
    const cached = this.textCache.get(path);
    if (cached) {
      return cached;
    }
    const file = await this.readAsArrayBuffer(path);
    const text = this.decoder.decode(file);
    this.textCache.set(path, text);
    return text;
  }
}
