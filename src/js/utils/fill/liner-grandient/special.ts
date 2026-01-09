export function getSpecialPattern(
  prst: string,
  bgColor: string,
  fgColor: string
): string[] | undefined {
  switch (prst) {
    case "plaid":
      return [
        "linear-gradient(0deg, transparent, transparent 25%, #" +
          fgColor +
          "33 25%, #" +
          fgColor +
          "33 50%)," +
          "linear-gradient(90deg, transparent, transparent 25%, #" +
          fgColor +
          "66 25%, #" +
          fgColor +
          "66 50%) " +
          "#" +
          bgColor +
          ";",
        "4px 4px",
      ];
    case "sphere":
      return [
        "radial-gradient(#" + fgColor + " 50%, transparent 50%)," + "#" + bgColor + ";",
        "4px 4px",
      ];
    case "weave":
    case "shingle":
      return [
        "linear-gradient(45deg, #" +
          bgColor +
          " 1.31px , #" +
          fgColor +
          " 1.4px, #" +
          fgColor +
          " 1.5px, transparent 1.5px, transparent 4.2px, #" +
          fgColor +
          " 4.2px, #" +
          fgColor +
          " 4.3px, transparent 4.31px), " +
          "linear-gradient(-45deg,  #" +
          bgColor +
          " 1.31px , #" +
          fgColor +
          " 1.4px, #" +
          fgColor +
          " 1.5px, transparent 1.5px, transparent 4.2px, #" +
          fgColor +
          " 4.2px, #" +
          fgColor +
          " 4.3px, transparent 4.31px) 0 4px, " +
          "#" +
          bgColor +
          ";",
        "4px 8px",
      ];
    default:
      return undefined;
  }
}
