export function getGridPattern(
  prst: string,
  bgColor: string,
  fgColor: string
): string[] | undefined {
  switch (prst) {
    case "smGrid":
      return [
        "linear-gradient(to right,  #" +
          fgColor +
          " -1px, transparent 1px ), " +
          "linear-gradient(to bottom,  #" +
          fgColor +
          " -1px, transparent 1px)  #" +
          bgColor +
          ";",
        "4px 4px",
      ];
    case "dotGrid":
      return [
        "linear-gradient(to right,  #" +
          fgColor +
          " -1px, transparent 1px ), " +
          "linear-gradient(to bottom,  #" +
          fgColor +
          " -1px, transparent 1px)  #" +
          bgColor +
          ";",
        "8px 8px",
      ];
    case "lgGrid":
      return [
        "linear-gradient(to right,  #" +
          fgColor +
          " -1px, transparent 1.5px ), " +
          "linear-gradient(to bottom,  #" +
          fgColor +
          " -1px, transparent 1.5px)  #" +
          bgColor +
          ";",
        "8px 8px",
      ];
    case "lgCheck":
    case "smCheck": {
      let size = "";
      let pos = "";
      if (prst === "lgCheck") {
        size = "8px 8px";
        pos = "0 0, 4px 4px, 4px 4px, 8px 8px";
      } else {
        size = "4px 4px";
        pos = "0 0, 2px 2px, 2px 2px, 4px 4px";
      }
      return [
        "linear-gradient(45deg,  #" +
          fgColor +
          " 25%, transparent 0, transparent 75%,  #" +
          fgColor +
          " 0), " +
          "linear-gradient(45deg,  #" +
          fgColor +
          " 25%, transparent 0, transparent 75%,  #" +
          fgColor +
          " 0) " +
          "#" +
          bgColor +
          ";",
        size,
        pos,
      ];
    }
    default:
      return undefined;
  }
}
