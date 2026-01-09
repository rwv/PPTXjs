export function getLinePattern(
  prst: string,
  bgColor: string,
  fgColor: string
): string[] | undefined {
  switch (prst) {
    case "wdUpDiag":
      return [
        "repeating-linear-gradient(-45deg, transparent 1px , transparent 4px, #" +
          fgColor +
          " 7px)" +
          "#" +
          bgColor +
          ";",
      ];
    case "dkUpDiag":
      return [
        "repeating-linear-gradient(-45deg, transparent 1px , #" +
          bgColor +
          " 5px)" +
          "#" +
          fgColor +
          ";",
      ];
    case "ltUpDiag":
      return [
        "repeating-linear-gradient(-45deg, transparent 1px , transparent 2px, #" +
          fgColor +
          " 4px)" +
          "#" +
          bgColor +
          ";",
      ];
    case "wdDnDiag":
      return [
        "repeating-linear-gradient(45deg, transparent 1px , transparent 4px, #" +
          fgColor +
          " 7px)" +
          "#" +
          bgColor +
          ";",
      ];
    case "dkDnDiag":
      return [
        "repeating-linear-gradient(45deg, transparent 1px , #" +
          bgColor +
          " 5px)" +
          "#" +
          fgColor +
          ";",
      ];
    case "ltDnDiag":
      return [
        "repeating-linear-gradient(45deg, transparent 1px , transparent 2px, #" +
          fgColor +
          " 4px)" +
          "#" +
          bgColor +
          ";",
      ];
    case "dkHorz":
      return [
        "repeating-linear-gradient(0deg, transparent 1px , transparent 2px, #" +
          bgColor +
          " 7px)" +
          "#" +
          fgColor +
          ";",
      ];
    case "ltHorz":
      return [
        "repeating-linear-gradient(0deg, transparent 1px , transparent 5px, #" +
          fgColor +
          " 7px)" +
          "#" +
          bgColor +
          ";",
      ];
    case "narHorz":
      return [
        "repeating-linear-gradient(0deg, transparent 1px , transparent 2px, #" +
          fgColor +
          " 4px)" +
          "#" +
          bgColor +
          ";",
      ];
    case "dkVert":
      return [
        "repeating-linear-gradient(90deg, transparent 1px , transparent 2px, #" +
          bgColor +
          " 7px)" +
          "#" +
          fgColor +
          ";",
      ];
    case "ltVert":
      return [
        "repeating-linear-gradient(90deg, transparent 1px , transparent 5px, #" +
          fgColor +
          " 7px)" +
          "#" +
          bgColor +
          ";",
      ];
    case "narVert":
      return [
        "repeating-linear-gradient(90deg, transparent 1px , transparent 2px, #" +
          fgColor +
          " 4px)" +
          "#" +
          bgColor +
          ";",
      ];
    case "dashUpDiag":
      return [
        "repeating-linear-gradient(152deg, #" +
          fgColor +
          ", #" +
          fgColor +
          " 5% , transparent 0, transparent 70%)" +
          "#" +
          bgColor +
          ";",
        "4px 4px",
      ];
    case "dashDnDiag":
      return [
        "repeating-linear-gradient(45deg, #" +
          fgColor +
          ", #" +
          fgColor +
          " 5% , transparent 0, transparent 70%)" +
          "#" +
          bgColor +
          ";",
        "4px 4px",
      ];
    case "dashVert":
      return [
        "linear-gradient(0deg,  #" +
          bgColor +
          " 30%, transparent 30%)," +
          "linear-gradient(90deg,transparent, transparent 40%, #" +
          fgColor +
          " 40%, #" +
          fgColor +
          " 60% , transparent 60%)" +
          "#" +
          bgColor +
          ";",
        "4px 4px",
      ];
    case "dashHorz":
      return [
        "linear-gradient(90deg,  #" +
          bgColor +
          " 30%, transparent 30%)," +
          "linear-gradient(0deg,transparent, transparent 40%, #" +
          fgColor +
          " 40%, #" +
          fgColor +
          " 60% , transparent 60%)" +
          "#" +
          bgColor +
          ";",
        "4px 4px",
      ];
    default:
      return undefined;
  }
}
