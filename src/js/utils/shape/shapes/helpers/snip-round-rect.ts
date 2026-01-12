/**
 * Generates an SVG path for a rounded or snipped rectangle
 *
 * @param w - Width of the rectangle
 * @param h - Height of the rectangle
 * @param adj1 - First adjustment value (0-1 range)
 * @param adj2 - Second adjustment value (0-1 range)
 * @param shapeType - Type of shape: "round" for rounded corners or "snip" for cut corners
 * @param adjType - Adjustment type for corners:
 *   - "cornr1": adjust only corner D (bottom-right)
 *   - "cornr2": adjust corners A,D and B,C equally
 *   - "cornrAll": adjust all corners equally
 *   - "diag": adjust corners A,C with adj1 and B,D with adj2
 * @returns SVG path string
 */
type ShapeSnipRoundRectOptions = {
  w: number | string;
  h: number | string;
  adj1: number | string;
  adj2: number | string;
  shapeType: "round" | "snip";
  adjType: "cornr1" | "cornr2" | "cornrAll" | "diag";
};

export function shapeSnipRoundRect({
  w,
  h,
  adj1,
  adj2,
  shapeType,
  adjType,
}: ShapeSnipRoundRectOptions): string {
  // Convert to numbers
  const width = typeof w === "number" ? w : parseFloat(w);
  const height = typeof h === "number" ? h : parseFloat(h);
  const adjust1 = typeof adj1 === "number" ? adj1 : parseFloat(adj1);
  const adjust2 = typeof adj2 === "number" ? adj2 : parseFloat(adj2);

  // Determine corner adjustments based on type
  // adjA = top-left, adjB = bottom-left, adjC = bottom-right, adjD = top-right
  let adjA: number;
  let adjB: number;
  let adjC: number;
  let adjD: number;

  switch (adjType) {
    case "cornr1":
      // Only adjust corner D (top-right)
      adjA = 0;
      adjB = 0;
      adjC = 0;
      adjD = adjust1;
      break;
    case "cornr2":
      // Adjust A,D with adj1 and B,C with adj2
      adjA = adjust1;
      adjB = adjust2;
      adjC = adjust2;
      adjD = adjust1;
      break;
    case "cornrAll":
      // All corners use adj1
      adjA = adjust1;
      adjB = adjust1;
      adjC = adjust1;
      adjD = adjust1;
      break;
    case "diag":
      // Diagonal: A,C with adj1 and B,D with adj2
      adjA = adjust1;
      adjB = adjust2;
      adjC = adjust1;
      adjD = adjust2;
      break;
    default:
      // Fallback to no adjustment
      adjA = 0;
      adjB = 0;
      adjC = 0;
      adjD = 0;
  }

  // Generate SVG path based on shape type
  if (shapeType === "round") {
    // Rounded corners using quadratic bezier curves (Q command)
    const d = [
      // Start at left middle, adjusted for corner B
      `M0,${height / 2 + (1 - adjB) * (height / 2)}`,
      // Curve to bottom-left corner
      `Q0,${height} ${adjB * (width / 2)},${height}`,
      // Line to bottom-right corner
      `L${width / 2 + (1 - adjC) * (width / 2)},${height}`,
      // Curve to right middle
      `Q${width},${height} ${width},${height / 2 + (height / 2) * (1 - adjC)}`,
      // Line to top-right corner
      `L${width},${(height / 2) * adjD}`,
      // Curve to top-right
      `Q${width},0 ${width / 2 + (width / 2) * (1 - adjD)},0`,
      // Line to top-left corner
      `L${(width / 2) * adjA},0`,
      // Curve to left middle
      `Q0,0 0,${(height / 2) * adjA}`,
      // Close path
      "z",
    ].join(" ");
    return d;
  } else {
    // Snipped/cut corners using straight lines (L command)
    const d = [
      // Start at left side, adjusted for corner A
      `M0,${adjA * (height / 2)}`,
      // Line to bottom-left, adjusted for corner B
      `L0,${height / 2 + (height / 2) * (1 - adjB)}`,
      // Line to bottom-left corner
      `L${adjB * (width / 2)},${height}`,
      // Line to bottom-right corner
      `L${width / 2 + (width / 2) * (1 - adjC)},${height}`,
      // Line to right side, adjusted for corner C
      `L${width},${height / 2 + (height / 2) * (1 - adjC)}`,
      // Line to top-right, adjusted for corner D
      `L${width},${adjD * (height / 2)}`,
      // Line to top-right corner
      `L${width / 2 + (width / 2) * (1 - adjD)},0`,
      // Line to top-left corner
      `L${(width / 2) * adjA},0`,
      // Close path
      "z",
    ].join(" ");
    return d;
  }
}
