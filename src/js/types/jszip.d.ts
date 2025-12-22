/**
 * Custom JSZip type definitions for v2.x
 *
 * This project uses JSZip v2.7.0 which has a different API than v3.x
 * The @types/jszip package is for v3.x, so we define our own types here.
 */

/**
 * Represents a file in the JSZip archive
 */
export interface JSZipFile {
  /**
   * Get the file content as text
   */
  asText(): string;

  /**
   * Get the file content as ArrayBuffer
   */
  asArrayBuffer(): ArrayBuffer;

  /**
   * Get the file content as Uint8Array
   */
  asUint8Array(): Uint8Array;

  /**
   * Get the file content as binary string
   */
  asBinary(): string;

  /**
   * File name
   */
  name: string;

  /**
   * File options
   */
  options: {
    dir: boolean;
    date: Date;
  };
}

/**
 * JSZip v2.x interface
 */
export interface JsZip {
  /**
   * Get a file from the archive
   * @param path - Path to the file
   * @returns JSZipFile if found, null otherwise
   */
  file(path: string): JSZipFile | null;

  /**
   * Get files matching a pattern
   * @param pattern - RegExp or string pattern
   * @returns Array of matching files
   */
  file(pattern: RegExp): JSZipFile[];

  /**
   * Add a file to the archive
   * @param path - Path for the new file
   * @param data - File content
   * @param options - File options
   */
  file(path: string, data: string | ArrayBuffer | Uint8Array, options?: any): JsZip;

  /**
   * Get or create a folder
   * @param path - Folder path
   * @returns JSZip instance
   */
  folder(path: string): JsZip | null;

  /**
   * Load data into JSZip
   * @param data - Data to load (ArrayBuffer, binary string, etc.)
   * @param options - Load options
   * @returns JSZip instance
   */
  load(data: ArrayBuffer | string, options?: { base64?: boolean }): JsZip;

  /**
   * Get all files in the archive
   */
  files: { [key: string]: JSZipFile };

  /**
   * Generate the zip file
   * @param options - Generation options
   * @returns Generated data
   */
  generate(options?: {
    type?: "string" | "base64" | "uint8array" | "arraybuffer" | "blob";
    compression?: "STORE" | "DEFLATE";
  }): any;

  /**
   * Remove a file or folder
   * @param path - Path to remove
   * @returns JSZip instance
   */
  remove(path: string): JsZip;
}
