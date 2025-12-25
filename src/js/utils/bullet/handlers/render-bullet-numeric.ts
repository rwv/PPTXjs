/**
 * Render numeric bullet (TYPE_NUMERIC)
 *
 * Handles numbered bullets (1, 2, 3, a, b, c, i, ii, iii, etc.) with:
 * - Solid color support
 * - RTL/LTR direction support
 * - Level tracking via data attributes
 * - Bullet type tracking (arabicPeriod, alphaLcPeriod, romanLcPeriod, etc.)
 */

export function renderBulletNumeric(
  bultColor: any[],
  bultSize: string,
  marLStr: string,
  marRStr: string,
  isRTL: boolean,
  buNum: string,
  lvl: number
): string {
  let bullet =
    "<div style='height: 100%;" +
    marLStr +
    marRStr +
    "color:#" +
    bultColor[0] +
    ";" +
    "font-size:" +
    bultSize +
    ";";

  if (isRTL) {
    bullet += "display: inline-block;white-space: nowrap ;direction:rtl;";
  } else {
    bullet += "display: inline-block;white-space: nowrap ;direction:ltr;";
  }

  bullet +=
    "' data-bulltname = '" +
    buNum +
    "' data-bulltlvl = '" +
    lvl +
    "' class='numeric-bullet-style'></div>";

  return bullet;
}
