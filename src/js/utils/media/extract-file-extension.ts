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
  const cleanName = filename.split(/[?#]/, 1)[0];
  const dotIndex = cleanName.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === cleanName.length - 1) {
    return "";
  }
  return cleanName.slice(dotIndex + 1);
}
