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
 * @param patternPreset - Pattern preset name from PPTX
 * @param backgroundColor - Background color (hex without #)
 * @param foregroundColor - Foreground color (hex without #)
 * @returns Array: [CSS gradient string, optional size, optional position]
 */

import { getGridPattern } from "./liner-grandient/grid";
import { getLinePattern } from "./liner-grandient/lines";
import { getTilePattern } from "./liner-grandient/tiles";
import { getSpecialPattern } from "./liner-grandient/special";
import { getPercentPattern } from "./liner-grandient/percent";

type GetLinerGrandientOptions = {
  patternPreset: string;
  backgroundColor: string;
  foregroundColor: string;
};

export function getLinerGrandient({
  patternPreset,
  backgroundColor,
  foregroundColor,
}: GetLinerGrandientOptions): Array<string | number> {
  const gridPattern = getGridPattern({ patternPreset, backgroundColor, foregroundColor });
  if (gridPattern) return gridPattern;

  const linePattern = getLinePattern({ patternPreset, backgroundColor, foregroundColor });
  if (linePattern) return linePattern;

  const tilePattern = getTilePattern({ patternPreset, backgroundColor, foregroundColor });
  if (tilePattern) return tilePattern;

  const specialPattern = getSpecialPattern({ patternPreset, backgroundColor, foregroundColor });
  if (specialPattern) return specialPattern;

  const percentPattern = getPercentPattern({ patternPreset, backgroundColor, foregroundColor });
  if (percentPattern) return percentPattern;

  return [0, 0];
}
