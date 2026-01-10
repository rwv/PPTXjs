/* global ReadableStream */
/**
 * Abstract interface for PPTX archive file access
 * Isolates zip library implementation details to allow future migration
 * between archive backends (zip.js, JSZip, or other libraries)
 */
export interface PPTXArchiveFile {
  /**
   * Read file as ArrayBuffer
   * @returns ArrayBuffer of file contents
   */
  arrayBuffer(): Promise<ArrayBuffer>;

  /**
   * Read file as text string
   * @returns String content of file
   */
  text(): Promise<string>;

  /**
   * Stream file contents as bytes
   * @returns ReadableStream of Uint8Array chunks
   */
  stream(): ReadableStream<Uint8Array>;
}

export interface PptxArchive {
  /**
   * Get a file accessor from the archive
   * @param path - File path within the PPTX archive (e.g., "ppt/slides/slide1.xml")
   * @returns PPTXArchiveFile if found, otherwise undefined
   */
  file(path: string): Promise<PPTXArchiveFile | undefined>;
}
