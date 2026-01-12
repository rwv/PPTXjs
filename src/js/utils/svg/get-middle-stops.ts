/**
 * Calculates middle stops for gradient color distribution
 * For example, with 3 middle stops: 0%, 25%, 50%, 75%, 100%
 *
 * @param middleStopCount - Number of middle stops (not including 0% and 100%)
 * @returns Array of stop percentage strings
 */
type GetMiddleStopsOptions = {
  middleStopCount: number;
};

export function getMiddleStops({ middleStopCount }: GetMiddleStopsOptions): string[] {
  const stopPercentages: string[] = ["0%", "100%"];

  if (middleStopCount === 0) {
    return stopPercentages;
  }

  let index = middleStopCount;
  while (index--) {
    // Calculate evenly distributed middle stops
    // Ex: For 3 middle stops, progression will be 25%, 50%, and 75%
    const middleStop = 100 - (100 / (middleStopCount + 1)) * (index + 1);
    const middleStopString = middleStop + "%";
    // Add into stopPercentages before 100%
    stopPercentages.splice(-1, 0, middleStopString);
  }

  return stopPercentages;
}
