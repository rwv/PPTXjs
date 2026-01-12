/**
 * Converts an ArrayBuffer to a base64 encoded string
 *
 * @param arrayBuffer - ArrayBuffer to convert
 * @returns Base64 encoded string
 */
type Base64ArrayBufferOptions = {
  arrayBuffer: ArrayBuffer;
};

export function base64ArrayBuffer({ arrayBuffer }: Base64ArrayBufferOptions): string {
  let base64 = "";
  const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const byteArray = new Uint8Array(arrayBuffer);
  const byteLength = byteArray.byteLength;
  const remainingBytes = byteLength % 3;
  const fullChunkLength = byteLength - remainingBytes;

  let sextetA: number, sextetB: number, sextetC: number, sextetD: number;
  let byteChunk: number;

  // Process main chunks (3 bytes at a time)
  for (let i = 0; i < fullChunkLength; i = i + 3) {
    byteChunk = (byteArray[i] << 16) | (byteArray[i + 1] << 8) | byteArray[i + 2];
    sextetA = (byteChunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    sextetB = (byteChunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    sextetC = (byteChunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    sextetD = byteChunk & 63; // 63       = 2^6 - 1
    base64 +=
      base64Alphabet[sextetA] +
      base64Alphabet[sextetB] +
      base64Alphabet[sextetC] +
      base64Alphabet[sextetD];
  }

  // Process remaining bytes
  if (remainingBytes === 1) {
    byteChunk = byteArray[fullChunkLength];
    sextetA = (byteChunk & 252) >> 2; // 252 = (2^6 - 1) << 2
    sextetB = (byteChunk & 3) << 4; // 3   = 2^2 - 1
    base64 += base64Alphabet[sextetA] + base64Alphabet[sextetB] + "==";
  } else if (remainingBytes === 2) {
    byteChunk = (byteArray[fullChunkLength] << 8) | byteArray[fullChunkLength + 1];
    sextetA = (byteChunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    sextetB = (byteChunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
    sextetC = (byteChunk & 15) << 2; // 15    = 2^4 - 1
    base64 += base64Alphabet[sextetA] + base64Alphabet[sextetB] + base64Alphabet[sextetC] + "=";
  }

  return base64;
}
