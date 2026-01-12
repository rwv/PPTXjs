type GetTilePatternOptions = {
  patternPreset: string;
  backgroundColor: string;
  foregroundColor: string;
};

export function getTilePattern({
  patternPreset,
  backgroundColor,
  foregroundColor,
}: GetTilePatternOptions): string[] | undefined {
  switch (patternPreset) {
    case "diagBrick":
      return [
        "linear-gradient(45deg, transparent 15%,  #" +
          foregroundColor +
          " 30%, transparent 30%), " +
          "linear-gradient(-45deg, transparent 15%,  #" +
          foregroundColor +
          " 30%, transparent 30%), " +
          "linear-gradient(-45deg, transparent 65%,  #" +
          foregroundColor +
          " 80%, transparent 0) " +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    case "horzBrick":
      return [
        "linear-gradient(335deg, #" +
          backgroundColor +
          " 1.6px, transparent 1.6px), " +
          "linear-gradient(155deg, #" +
          backgroundColor +
          " 1.6px, transparent 1.6px), " +
          "linear-gradient(335deg, #" +
          backgroundColor +
          " 1.6px, transparent 1.6px), " +
          "linear-gradient(155deg, #" +
          backgroundColor +
          " 1.6px, transparent 1.6px) " +
          "#" +
          foregroundColor +
          ";",
        "4px 4px",
        "0 0.15px, 0.3px 2.5px, 2px 2.15px, 2.35px 0.4px",
      ];
    case "solidDmnd":
      return [
        "linear-gradient(135deg,  #" +
          foregroundColor +
          " 25%, transparent 25%), " +
          "linear-gradient(225deg,  #" +
          foregroundColor +
          " 25%, transparent 25%), " +
          "linear-gradient(315deg,  #" +
          foregroundColor +
          " 25%, transparent 25%), " +
          "linear-gradient(45deg,  #" +
          foregroundColor +
          " 25%, transparent 25%) " +
          "#" +
          backgroundColor +
          ";",
        "8px 8px",
      ];
    case "openDmnd":
      return [
        "linear-gradient(45deg, transparent 0%, transparent calc(50% - 0.5px),  #" +
          foregroundColor +
          " 50%, transparent calc(50% + 0.5px),  transparent 100%), " +
          "linear-gradient(-45deg, transparent 0%, transparent calc(50% - 0.5px) , #" +
          foregroundColor +
          " 50%, transparent calc(50% + 0.5px),  transparent 100%) " +
          "#" +
          backgroundColor +
          ";",
        "8px 8px",
      ];
    case "dotDmnd":
      return [
        "radial-gradient(#" +
          foregroundColor +
          " 15%, transparent 0), " +
          "radial-gradient(#" +
          foregroundColor +
          " 15%, transparent 0) " +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
        "0 0, 2px 2px",
      ];
    case "zigZag":
    case "wave": {
      let size = "";
      if (patternPreset === "zigZag") size = "0";
      else size = "1px";
      return [
        "linear-gradient(135deg,  #" +
          foregroundColor +
          " 25%, transparent 25%) 50px " +
          size +
          ", " +
          "linear-gradient(225deg,  #" +
          foregroundColor +
          " 25%, transparent 25%) 50px " +
          size +
          ", " +
          "linear-gradient(315deg,  #" +
          foregroundColor +
          " 25%, transparent 25%), " +
          "linear-gradient(45deg,  #" +
          foregroundColor +
          " 25%, transparent 25%) " +
          "#" +
          backgroundColor +
          ";",
        "4px 4px",
      ];
    }
    case "lgConfetti":
    case "smConfetti": {
      let size = "";
      if (patternPreset === "lgConfetti") size = "4px 4px";
      else size = "2px 2px";
      return [
        "linear-gradient(135deg,  #" +
          foregroundColor +
          " 25%, transparent 25%) 50px 1px, " +
          "linear-gradient(225deg,  #" +
          foregroundColor +
          " 25%, transparent 25%), " +
          "linear-gradient(315deg,  #" +
          foregroundColor +
          " 25%, transparent 25%) 50px 1px , " +
          "linear-gradient(45deg,  #" +
          foregroundColor +
          " 25%, transparent 25%) " +
          "#" +
          backgroundColor +
          ";",
        size,
      ];
    }
    default:
      return undefined;
  }
}
