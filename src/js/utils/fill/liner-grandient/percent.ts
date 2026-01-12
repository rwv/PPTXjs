type GetPercentPatternOptions = {
  patternPreset: string;
  backgroundColor: string;
  foregroundColor: string;
};

export function getPercentPattern({
  patternPreset,
  backgroundColor,
  foregroundColor,
}: GetPercentPatternOptions): string[] | undefined {
  switch (patternPreset) {
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
      let px_pr_ary: string[];
      switch (patternPreset) {
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
          foregroundColor +
          " " +
          px_pr_ary[0] +
          ", transparent " +
          px_pr_ary[1] +
          ")," +
          "#" +
          backgroundColor +
          ";",
        px_pr_ary[2],
      ];
    }
    default:
      return undefined;
  }
}
