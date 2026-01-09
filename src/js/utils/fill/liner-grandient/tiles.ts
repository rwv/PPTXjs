export function getTilePattern(prst: any, bgColor: any, fgColor: any) {
  switch (prst) {
    case "diagBrick":
      return [
        "linear-gradient(45deg, transparent 15%,  #" +
          fgColor +
          " 30%, transparent 30%), " +
          "linear-gradient(-45deg, transparent 15%,  #" +
          fgColor +
          " 30%, transparent 30%), " +
          "linear-gradient(-45deg, transparent 65%,  #" +
          fgColor +
          " 80%, transparent 0) " +
          "#" +
          bgColor +
          ";",
        "4px 4px",
      ];
    case "horzBrick":
      return [
        "linear-gradient(335deg, #" +
          bgColor +
          " 1.6px, transparent 1.6px), " +
          "linear-gradient(155deg, #" +
          bgColor +
          " 1.6px, transparent 1.6px), " +
          "linear-gradient(335deg, #" +
          bgColor +
          " 1.6px, transparent 1.6px), " +
          "linear-gradient(155deg, #" +
          bgColor +
          " 1.6px, transparent 1.6px) " +
          "#" +
          fgColor +
          ";",
        "4px 4px",
        "0 0.15px, 0.3px 2.5px, 2px 2.15px, 2.35px 0.4px",
      ];
    case "solidDmnd":
      return [
        "linear-gradient(135deg,  #" +
          fgColor +
          " 25%, transparent 25%), " +
          "linear-gradient(225deg,  #" +
          fgColor +
          " 25%, transparent 25%), " +
          "linear-gradient(315deg,  #" +
          fgColor +
          " 25%, transparent 25%), " +
          "linear-gradient(45deg,  #" +
          fgColor +
          " 25%, transparent 25%) " +
          "#" +
          bgColor +
          ";",
        "8px 8px",
      ];
    case "openDmnd":
      return [
        "linear-gradient(45deg, transparent 0%, transparent calc(50% - 0.5px),  #" +
          fgColor +
          " 50%, transparent calc(50% + 0.5px),  transparent 100%), " +
          "linear-gradient(-45deg, transparent 0%, transparent calc(50% - 0.5px) , #" +
          fgColor +
          " 50%, transparent calc(50% + 0.5px),  transparent 100%) " +
          "#" +
          bgColor +
          ";",
        "8px 8px",
      ];
    case "dotDmnd":
      return [
        "radial-gradient(#" +
          fgColor +
          " 15%, transparent 0), " +
          "radial-gradient(#" +
          fgColor +
          " 15%, transparent 0) " +
          "#" +
          bgColor +
          ";",
        "4px 4px",
        "0 0, 2px 2px",
      ];
    case "zigZag":
    case "wave": {
      let size = "";
      if (prst === "zigZag") size = "0";
      else size = "1px";
      return [
        "linear-gradient(135deg,  #" +
          fgColor +
          " 25%, transparent 25%) 50px " +
          size +
          ", " +
          "linear-gradient(225deg,  #" +
          fgColor +
          " 25%, transparent 25%) 50px " +
          size +
          ", " +
          "linear-gradient(315deg,  #" +
          fgColor +
          " 25%, transparent 25%), " +
          "linear-gradient(45deg,  #" +
          fgColor +
          " 25%, transparent 25%) " +
          "#" +
          bgColor +
          ";",
        "4px 4px",
      ];
    }
    case "lgConfetti":
    case "smConfetti": {
      let size = "";
      if (prst === "lgConfetti") size = "4px 4px";
      else size = "2px 2px";
      return [
        "linear-gradient(135deg,  #" +
          fgColor +
          " 25%, transparent 25%) 50px 1px, " +
          "linear-gradient(225deg,  #" +
          fgColor +
          " 25%, transparent 25%), " +
          "linear-gradient(315deg,  #" +
          fgColor +
          " 25%, transparent 25%) 50px 1px , " +
          "linear-gradient(45deg,  #" +
          fgColor +
          " 25%, transparent 25%) " +
          "#" +
          bgColor +
          ";",
        size,
      ];
    }
    default:
      return undefined;
  }
}
