/**
 * Gets dimensions of a base64 encoded image
 * Note: This function uses a synchronous approach with Image loading
 *
 * @param imgSrc - Base64 encoded image source string
 * @returns Array with [width, height] or undefined if loading fails
 */
export function getBase64ImageDimensions(
  imgSrc: string
): [number, number] | undefined {
  const image = new Image();

  image.onload = function () {
    // This callback is just for potential future use
    // The synchronous check below will catch the dimensions
  };

  image.src = imgSrc;

  // Synchronous check loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (image.width !== undefined && image.width !== 0) {
      return [image.width, image.height];
    }
    // If width is still undefined after initial check, return undefined
    // to avoid infinite loop
    if (image.complete && image.width === 0) {
      return undefined;
    }
  }
}
