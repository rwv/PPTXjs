/* global ReadableStream, TransformStream */
import { ZipReader, Uint8ArrayReader } from "@zip.js/zip.js";

import type { FileEntry } from "@zip.js/zip.js";
import type { PptxArchive, PPTXArchiveFile } from "./pptx-archive";

type EntryMap = Map<string, FileEntry>;

class ZipJsArchiveFile implements PPTXArchiveFile {
  private adapter: ZipJsAdapter;
  private path: string;
  private entry: FileEntry;

  constructor(adapter: ZipJsAdapter, path: string, entry: FileEntry) {
    this.adapter = adapter;
    this.path = path;
    this.entry = entry;
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return this.adapter.readEntryArrayBuffer(this.path, this.entry);
  }

  async text(): Promise<string> {
    return this.adapter.readEntryText(this.path, this.entry);
  }

  stream(): ReadableStream<Uint8Array> {
    const stream = new TransformStream<Uint8Array, Uint8Array>();
    void this.entry.getData(stream.writable).catch((error) => {
      stream.writable.abort(error).catch(() => undefined);
    });
    return stream.readable;
  }
}

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
  private fileCache = new Map<string, PPTXArchiveFile>();

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

  async file(path: string): Promise<PPTXArchiveFile | undefined> {
    const cached = this.fileCache.get(path);
    if (cached) {
      return cached;
    }
    const entry = this.entries.get(path);
    if (!entry) {
      return undefined;
    }
    const file = new ZipJsArchiveFile(this, path, entry);
    this.fileCache.set(path, file);
    return file;
  }

  async readEntryArrayBuffer(path: string, entry: FileEntry): Promise<ArrayBuffer> {
    const cached = this.arrayBufferCache.get(path);
    if (cached) {
      return cached;
    }
    const fileBuffer = await entry.arrayBuffer();
    this.arrayBufferCache.set(path, fileBuffer);
    return fileBuffer;
  }

  async readEntryText(path: string, entry: FileEntry): Promise<string> {
    const cached = this.textCache.get(path);
    if (cached) {
      return cached;
    }
    const file = await this.readEntryArrayBuffer(path, entry);
    const text = this.decoder.decode(file);
    this.textCache.set(path, text);
    return text;
  }
}
