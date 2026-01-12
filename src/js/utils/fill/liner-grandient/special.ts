type GetSpecialPatternOptions = {
  patternPreset: string;
  backgroundColor: string;
  foregroundColor: string;
};

export function getSpecialPattern({
  patternPreset,
  backgroundColor,
  foregroundColor,
}: GetSpecialPatternOptions): string[] | undefined {
  switch (patternPreset) {
    case "plaid":
      return [
        "linear-gradient(0deg, transparent, transparent 25%, #" +
          foregroundColor +
          "33 25%, #" +
          foregroundColor +
          "33 50%)," +
          "linear-gradient(90deg, transparent, transparent 25%, #" +
          foregroundColor +
          "66 25%, #" +
          foregroundColor +
          "66 50%) " +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    case "sphere":
      return [
        "radial-gradient(#" +
          foregroundColor +
          " 50%, transparent 50%)," +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    case "weave":
    case "shingle":
      return [
        "linear-gradient(45deg, #" +
          backgroundColor +
          " 1.31px , #" +
          foregroundColor +
          " 1.4px, #" +
          foregroundColor +
          " 1.5px, transparent 1.5px, transparent 4.2px, #" +
          foregroundColor +
          " 4.2px, #" +
          foregroundColor +
          " 4.3px, transparent 4.31px), " +
          "linear-gradient(-45deg,  #" +
          backgroundColor +
          " 1.31px , #" +
          foregroundColor +
          " 1.4px, #" +
          foregroundColor +
          " 1.5px, transparent 1.5px, transparent 4.2px, #" +
          foregroundColor +
          " 4.2px, #" +
          foregroundColor +
          " 4.3px, transparent 4.31px) 0 4px, " +
          "#" +
          backgroundColor +
          ";",
        "4px 8px",
      ];
    default:
      return undefined;
  }
}
