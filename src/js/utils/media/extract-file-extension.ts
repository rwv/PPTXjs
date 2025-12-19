/**
 * Extracts the file extension from a filename
 *
 * @param filename - Filename or path to extract extension from
 * @returns File extension without the dot (e.g., "jpg", "png")
 */
export function extractFileExtension(filename: string): string {
  return filename.substr((~-filename.lastIndexOf(".") >>> 0) + 2);
}
