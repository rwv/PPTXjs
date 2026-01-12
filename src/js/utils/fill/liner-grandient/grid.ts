type GetGridPatternOptions = {
  patternPreset: string;
  backgroundColor: string;
  foregroundColor: string;
};

export function getGridPattern({
  patternPreset,
  backgroundColor,
  foregroundColor,
}: GetGridPatternOptions): string[] | undefined {
  switch (patternPreset) {
    case "smGrid":
      return [
        "linear-gradient(to right,  #" +
          foregroundColor +
          " -1px, transparent 1px ), " +
          "linear-gradient(to bottom,  #" +
          foregroundColor +
          " -1px, transparent 1px)  #" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    case "dotGrid":
      return [
        "linear-gradient(to right,  #" +
          foregroundColor +
          " -1px, transparent 1px ), " +
          "linear-gradient(to bottom,  #" +
          foregroundColor +
          " -1px, transparent 1px)  #" +
          backgroundColor +
          ";",
        "8px 8px",
      ];
    case "lgGrid":
      return [
        "linear-gradient(to right,  #" +
          foregroundColor +
          " -1px, transparent 1.5px ), " +
          "linear-gradient(to bottom,  #" +
          foregroundColor +
          " -1px, transparent 1.5px)  #" +
          backgroundColor +
          ";",
        "8px 8px",
      ];
    case "lgCheck":
    case "smCheck": {
      let size = "";
      let pos = "";
      if (patternPreset === "lgCheck") {
        size = "8px 8px";
        pos = "0 0, 4px 4px, 4px 4px, 8px 8px";
      } else {
        size = "4px 4px";
        pos = "0 0, 2px 2px, 2px 2px, 4px 4px";
      }
      return [
        "linear-gradient(45deg,  #" +
          foregroundColor +
          " 25%, transparent 0, transparent 75%,  #" +
          foregroundColor +
          " 0), " +
          "linear-gradient(45deg,  #" +
          foregroundColor +
          " 25%, transparent 0, transparent 75%,  #" +
          foregroundColor +
          " 0) " +
          "#" +
          backgroundColor +
          ";",
        size,
        pos,
      ];
    }
    default:
      return undefined;
  }
}
