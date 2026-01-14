/**
 * Gets dimensions of a base64 encoded image.
 *
 * @param imgSrc - Base64 encoded image source string
 * @returns Array with [width, height], or a safe fallback if unavailable
 */
type GetBase64ImageDimensionsOptions = {
  imgSrc: string;
};

export function getBase64ImageDimensions({
  imgSrc,
}: GetBase64ImageDimensionsOptions): [number, number] {
  if (!imgSrc.trim()) {
    return [1, 1];
  }
  const base64Match = imgSrc.match(/base64,(.*)$/);
  const base64Data = (base64Match ? base64Match[1] : imgSrc).replace(/\s/g, "");

  try {
    const atobFn = typeof globalThis !== "undefined" ? globalThis.atob : undefined;
    if (typeof atobFn !== "function") {
      return [1, 1];
    }
    const binary = atobFn(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    const svgStart = binary.indexOf("<svg");
    if (svgStart !== -1) {
      const svgText = binary.slice(svgStart);
      const widthMatch = svgText.match(/\bwidth=["']?([\d.]+)[^"']*["']?/i);
      const heightMatch = svgText.match(/\bheight=["']?([\d.]+)[^"']*["']?/i);
      if (widthMatch && heightMatch) {
        const width = parseFloat(widthMatch[1]);
        const height = parseFloat(heightMatch[1]);
        if (width > 0 && height > 0) {
          return [width, height];
        }
      }

      const viewBoxMatch = svgText.match(/\bviewBox=["']?([^"']+)["']?/i);
      if (viewBoxMatch) {
        const parts = viewBoxMatch[1]
          .trim()
          .split(/[,\s]+/)
          .map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          return [parts[2], parts[3]];
        }
      }
    }

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A, IHDR at offset 16.
    if (
      bytes.length >= 24 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
      const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
      if (width > 0 && height > 0) {
        return [width, height];
      }
    }

    // GIF header: GIF87a/GIF89a, width/height at offset 6/8 (little-endian).
    if (bytes.length >= 10 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
      const width = bytes[6] | (bytes[7] << 8);
      const height = bytes[8] | (bytes[9] << 8);
      if (width > 0 && height > 0) {
        return [width, height];
      }
    }

    // JPEG: scan for SOF0/SOF2 markers.
    if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < bytes.length) {
        if (bytes[offset] !== 0xff) {
          offset += 1;
          continue;
        }
        const marker = bytes[offset + 1];
        if (marker === 0xd9 || marker === 0xda) {
          break;
        }
        const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
        if (marker === 0xc0 || marker === 0xc2) {
          const height = (bytes[offset + 5] << 8) | bytes[offset + 6];
          const width = (bytes[offset + 7] << 8) | bytes[offset + 8];
          if (width > 0 && height > 0) {
            return [width, height];
          }
        }
        if (length <= 0) {
          break;
        }
        offset += 2 + length;
      }
    }
  } catch {
    // Fall through to Image-based fallback.
  }

  if (typeof Image === "undefined") {
    return [1, 1];
  }
  const image = new Image();
  image.src = imgSrc;
  if (image.width && image.height) {
    return [image.width, image.height];
  }

  // Avoid blocking the event loop; fall back to a safe size.
  return [1, 1];
}
