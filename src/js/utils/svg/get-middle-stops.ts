/**
 * Calculates middle stops for gradient color distribution
 * For example, with 3 middle stops: 0%, 25%, 50%, 75%, 100%
 *
 * @param s - Number of middle stops (not including 0% and 100%)
 * @returns Array of stop percentage strings
 */
export function getMiddleStops(s: number): string[] {
  const sArry: string[] = ["0%", "100%"];

  if (s === 0) {
    return sArry;
  }

  let i = s;
  while (i--) {
    // Calculate evenly distributed middle stops
    // Ex: For 3 middle stops, progression will be 25%, 50%, and 75%
    const middleStop = 100 - (100 / (s + 1)) * (i + 1);
    const middleStopString = middleStop + "%";
    // Add into sArry before 100%
    sArry.splice(-1, 0, middleStopString);
  }

  return sArry;
}
