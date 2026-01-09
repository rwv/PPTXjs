/**
 * Converts PPTX pattern preset to CSS linear gradient patterns
 *
 * Implements 40+ OOXML pattern presets using CSS gradients.
 * Each pattern maps to specific CSS linear/radial gradients with precise
 * colors, angles, and repetitions to match PowerPoint's visual appearance.
 *
 * Supported patterns include:
 * - Grids: smGrid, dotGrid, lgGrid
 * - Diagonals: wdUpDiag, wdDnDiag, dkUpDiag, ltUpDiag, etc.
 * - Checks: lgCheck, smCheck
 * - Bricks: diagBrick, horzBrick
 * - Dashes: dashUpDiag, dashDnDiag, dashVert, dashHorz
 * - Diamonds: solidDmnd, openDmnd, dotDmnd
 * - Waves: zigZag, wave
 * - Confetti: lgConfetti, smConfetti
 * - Special: plaid, sphere, weave, shingle, trellis, divot
 * - Percentages: pct5-pct90 (dot density patterns)
 *
 * @param prst - Pattern preset name from PPTX
 * @param bgColor - Background color (hex without #)
 * @param fgColor - Foreground color (hex without #)
 * @returns Array: [CSS gradient string, optional size, optional position]
 */
export function getLinerGrandient(prst: any, bgColor: any, fgColor: any) {
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
    case "pct5":
    case "pct10":
    case "pct20":
    case "pct25":
    case "pct30":
    case "pct40":
    case "pct50":
    case "pct60":
    case "pct70":
    case "pct75":
    case "pct80":
    case "pct90":
    case "trellis":
    case "divot": {
      let px_pr_ary;
      switch (prst) {
        case "pct5":
          px_pr_ary = ["0.3px", "10%", "2px 2px"];
          break;
        case "divot":
          px_pr_ary = ["0.3px", "40%", "4px 4px"];
          break;
        case "pct10":
          px_pr_ary = ["0.3px", "20%", "2px 2px"];
          break;
        case "pct20":
          px_pr_ary = ["0.2px", "40%", "2px 2px"];
          break;
        case "pct25":
          px_pr_ary = ["0.2px", "50%", "2px 2px"];
          break;
        case "pct30":
          px_pr_ary = ["0.5px", "50%", "2px 2px"];
          break;
        case "pct40":
          px_pr_ary = ["0.5px", "70%", "2px 2px"];
          break;
        case "pct50":
          px_pr_ary = ["0.09px", "90%", "2px 2px"];
          break;
        case "pct60":
          px_pr_ary = ["0.3px", "90%", "2px 2px"];
          break;
        case "pct70":
        case "trellis":
          px_pr_ary = ["0.5px", "95%", "2px 2px"];
          break;
        case "pct75":
          px_pr_ary = ["0.65px", "100%", "2px 2px"];
          break;
        case "pct80":
          px_pr_ary = ["0.85px", "100%", "2px 2px"];
          break;
        case "pct90":
          px_pr_ary = ["1px", "100%", "2px 2px"];
          break;
      }
      return [
        "radial-gradient(#" +
          fgColor +
          " " +
          px_pr_ary[0] +
          ", transparent " +
          px_pr_ary[1] +
          ")," +
          "#" +
          bgColor +
          ";",
        px_pr_ary[2],
      ];
    }
    default:
      return [0, 0];
  }
}
