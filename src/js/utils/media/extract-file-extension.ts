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
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === filename.length - 1) {
    return "";
  }
  return filename.slice(dotIndex + 1);
}
