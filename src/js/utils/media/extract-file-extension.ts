/**
 * Extracts the file extension from a filename
 *
 * @param filename - Filename or path to extract extension from
 * @returns File extension without the dot (e.g., "jpg", "png")
 */
type ExtractFileExtensionOptions = {
  filename: string;
};

export function extractFileExtension({ filename }: ExtractFileExtensionOptions): string {
  return filename.substr((~-filename.lastIndexOf(".") >>> 0) + 2);
}
