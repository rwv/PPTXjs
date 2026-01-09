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

import { getGridPattern } from "./liner-grandient/grid";
import { getLinePattern } from "./liner-grandient/lines";
import { getTilePattern } from "./liner-grandient/tiles";
import { getSpecialPattern } from "./liner-grandient/special";
import { getPercentPattern } from "./liner-grandient/percent";

export function getLinerGrandient(
  prst: string,
  bgColor: string,
  fgColor: string
): Array<string | number> {
  const gridPattern = getGridPattern(prst, bgColor, fgColor);
  if (gridPattern) return gridPattern;

  const linePattern = getLinePattern(prst, bgColor, fgColor);
  if (linePattern) return linePattern;

  const tilePattern = getTilePattern(prst, bgColor, fgColor);
  if (tilePattern) return tilePattern;

  const specialPattern = getSpecialPattern(prst, bgColor, fgColor);
  if (specialPattern) return specialPattern;

  const percentPattern = getPercentPattern(prst, bgColor, fgColor);
  if (percentPattern) return percentPattern;

  return [0, 0];
}
