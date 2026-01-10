/**
 * Abstract interface for PPTX archive file access
 * Isolates zip library implementation details to allow future migration
 * between archive backends (zip.js, JSZip, or other libraries)
 */
export interface PptxArchive {
  /**
   * Check if a file exists in the archive
   * @param path - File path within the PPTX archive (e.g., "ppt/slides/slide1.xml")
   * @returns true if file exists, false otherwise
   */
  hasFile(path: string): Promise<boolean>;

  /**
   * Read file as ArrayBuffer
   * @param path - File path within the PPTX archive
   * @returns ArrayBuffer of file contents
   * @throws Error if file not found
   */
  readAsArrayBuffer(path: string): Promise<ArrayBuffer>;

  /**
   * Read file as text string
   * @param path - File path within the PPTX archive
   * @returns String content of file
   * @throws Error if file not found
   */
  readAsText(path: string): Promise<string>;
}
