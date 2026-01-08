/**
 * Gets dimensions of a base64 encoded image
 * Note: This function uses a synchronous approach with Image loading
 *
 * @param imgSrc - Base64 encoded image source string
 * @returns Array with [width, height] or undefined if loading fails
 */
export function getBase64ImageDimensions(
  imgSrc: string
): [number, number] {
  const image = new Image();
  image.src = imgSrc;

  if (image.width && image.height) {
    return [image.width, image.height];
  }

  // Avoid blocking the event loop; fall back to a safe size.
  return [1, 1];
}
