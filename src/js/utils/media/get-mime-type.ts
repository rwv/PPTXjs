/**
 * MIME type mapping for common file extensions
 */
const MIME_TYPE_MAP: Record<string, string> = {
  // Images
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  emf: "image/x-emf",
  wmf: "image/x-wmf",
  tif: "image/tiff",
  tiff: "image/tiff",

  // Videos
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  avi: "video/avi",
  mpg: "video/mpg",
  wmv: "video/wmv",

  // Audio
  mp3: "audio/mpeg",
  wav: "audio/wav",
};

/**
 * Gets the MIME type for a given file extension
 * Uses object lookup for O(1) performance (much faster than switch statements)
 *
 * @param fileExtension - File extension (e.g., "jpg", "png", "mp4")
 * @returns MIME type string (e.g., "image/jpeg", "video/mp4"), or empty string if not found
 */
type GetMimeTypeOptions = {
  fileExtension: string;
};

export function getMimeType({ fileExtension }: GetMimeTypeOptions): string {
  return MIME_TYPE_MAP[fileExtension.toLowerCase()] || "";
}
