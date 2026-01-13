/**
 * Checks if a string is a valid video URL
 *
 * @param videoUrl - URL string to check
 * @returns True if the string is a valid HTTP/HTTPS/FTP URL
 */
type IsVideoLinkOptions = {
  videoUrl: string;
};

export function isVideoLink({ videoUrl }: IsVideoLinkOptions): boolean {
  const trimmedUrl = videoUrl.trim();
  if (trimmedUrl.length === 0) {
    return false;
  }

  try {
    const parsed = new URL(trimmedUrl);
    const protocol = parsed.protocol.toLowerCase();
    return protocol === "http:" || protocol === "https:" || protocol === "ftp:";
  } catch {
    return false;
  }
}
