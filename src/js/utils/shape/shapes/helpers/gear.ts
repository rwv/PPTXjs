/**
 * Generates an SVG path for a gear shape
 *
 * @param w - Width (not used, kept for API compatibility)
 * @param h - Height, determines the inner radius
 * @param points - Number of teeth/notches on the gear
 * @returns SVG path string representing the gear shape
 */
export function shapeGear(w: number | string, h: number | string, points: number | string): string {
  // Convert to numbers
  const height = typeof h === "number" ? h : parseFloat(h);
  const notches = typeof points === "number" ? points : parseFloat(points);

  // Calculate radii
  const innerRadius = height;
  const outerRadius = 1.5 * innerRadius;

  // Center point (gear is centered at this position)
  const cx = outerRadius;
  const cy = outerRadius;

  // Radii aliases (kept for clarity)
  const radiusO = outerRadius;
  const radiusI = innerRadius;

  // Taper percentages (controls the width of teeth)
  const taperO = 50; // outer taper %
  const taperI = 35; // inner taper %

  // Pre-calculate values for loop
  const pi2 = 2 * Math.PI; // cache 2xPI (360deg)
  const angle = pi2 / (notches * 2); // angle between notches
  const taperAI = angle * taperI * 0.005; // inner taper offset (100% = half notch)
  const taperAO = angle * taperO * 0.005; // outer taper offset

  // Move to starting point
  let d = `M${cx + radiusO * Math.cos(taperAO)} ${cy + radiusO * Math.sin(taperAO)}`;

  // Loop through each tooth
  let a = angle; // iterator (angle)
  let toggle = false; // alternates between inner and outer

  for (; a <= pi2 + angle; a += angle) {
    if (toggle) {
      // Draw inner to outer line
      const innerX = cx + radiusI * Math.cos(a - taperAI);
      const innerY = cy + radiusI * Math.sin(a - taperAI);
      d += ` L${innerX},${innerY}`;

      const outerX = cx + radiusO * Math.cos(a + taperAO);
      const outerY = cy + radiusO * Math.sin(a + taperAO);
      d += ` L${outerX},${outerY}`;
    } else {
      // Draw outer to inner line
      const outerX = cx + radiusO * Math.cos(a - taperAO);
      const outerY = cy + radiusO * Math.sin(a - taperAO);
      d += ` L${outerX},${outerY}`; // outer line

      const innerX = cx + radiusI * Math.cos(a + taperAI);
      const innerY = cy + radiusI * Math.sin(a + taperAI);
      d += ` L${innerX},${innerY}`; // inner line
    }

    // Switch between inner and outer
    toggle = !toggle;
  }

  // Close the path (space at end for compatibility)
  d += " ";

  return d;
}
