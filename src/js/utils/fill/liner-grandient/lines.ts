type GetLinePatternOptions = {
  patternPreset: string;
  backgroundColor: string;
  foregroundColor: string;
};

export function getLinePattern({
  patternPreset,
  backgroundColor,
  foregroundColor,
}: GetLinePatternOptions): string[] | undefined {
  switch (patternPreset) {
    case "wdUpDiag":
      return [
        "repeating-linear-gradient(-45deg, transparent 1px , transparent 4px, #" +
          foregroundColor +
          " 7px)" +
          "#" +
          backgroundColor +
          ";",
      ];
    case "dkUpDiag":
      return [
        "repeating-linear-gradient(-45deg, transparent 1px , #" +
          backgroundColor +
          " 5px)" +
          "#" +
          foregroundColor +
          ";",
      ];
    case "ltUpDiag":
      return [
        "repeating-linear-gradient(-45deg, transparent 1px , transparent 2px, #" +
          foregroundColor +
          " 4px)" +
          "#" +
          backgroundColor +
          ";",
      ];
    case "wdDnDiag":
      return [
        "repeating-linear-gradient(45deg, transparent 1px , transparent 4px, #" +
          foregroundColor +
          " 7px)" +
          "#" +
          backgroundColor +
          ";",
      ];
    case "dkDnDiag":
      return [
        "repeating-linear-gradient(45deg, transparent 1px , #" +
          backgroundColor +
          " 5px)" +
          "#" +
          foregroundColor +
          ";",
      ];
    case "ltDnDiag":
      return [
        "repeating-linear-gradient(45deg, transparent 1px , transparent 2px, #" +
          foregroundColor +
          " 4px)" +
          "#" +
          backgroundColor +
          ";",
      ];
    case "dkHorz":
      return [
        "repeating-linear-gradient(0deg, transparent 1px , transparent 2px, #" +
          backgroundColor +
          " 7px)" +
          "#" +
          foregroundColor +
          ";",
      ];
    case "ltHorz":
      return [
        "repeating-linear-gradient(0deg, transparent 1px , transparent 5px, #" +
          foregroundColor +
          " 7px)" +
          "#" +
          backgroundColor +
          ";",
      ];
    case "narHorz":
      return [
        "repeating-linear-gradient(0deg, transparent 1px , transparent 2px, #" +
          foregroundColor +
          " 4px)" +
          "#" +
          backgroundColor +
          ";",
      ];
    case "dkVert":
      return [
        "repeating-linear-gradient(90deg, transparent 1px , transparent 2px, #" +
          backgroundColor +
          " 7px)" +
          "#" +
          foregroundColor +
          ";",
      ];
    case "ltVert":
      return [
        "repeating-linear-gradient(90deg, transparent 1px , transparent 5px, #" +
          foregroundColor +
          " 7px)" +
          "#" +
          backgroundColor +
          ";",
      ];
    case "narVert":
      return [
        "repeating-linear-gradient(90deg, transparent 1px , transparent 2px, #" +
          foregroundColor +
          " 4px)" +
          "#" +
          backgroundColor +
          ";",
      ];
    case "dashUpDiag":
      return [
        "repeating-linear-gradient(152deg, #" +
          foregroundColor +
          ", #" +
          foregroundColor +
          " 5% , transparent 0, transparent 70%)" +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    case "dashDnDiag":
      return [
        "repeating-linear-gradient(45deg, #" +
          foregroundColor +
          ", #" +
          foregroundColor +
          " 5% , transparent 0, transparent 70%)" +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    case "dashVert":
      return [
        "linear-gradient(0deg,  #" +
          backgroundColor +
          " 30%, transparent 30%)," +
          "linear-gradient(90deg,transparent, transparent 40%, #" +
          foregroundColor +
          " 40%, #" +
          foregroundColor +
          " 60% , transparent 60%)" +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    case "dashHorz":
      return [
        "linear-gradient(90deg,  #" +
          backgroundColor +
          " 30%, transparent 30%)," +
          "linear-gradient(0deg,transparent, transparent 40%, #" +
          foregroundColor +
          " 40%, #" +
          foregroundColor +
          " 60% , transparent 60%)" +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    default:
      return undefined;
  }
}
