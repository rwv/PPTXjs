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
  bulletColor: string[],
  bulletSize: string,
  marginLeftStyle: string,
  marginRightStyle: string,
  isRtl: boolean,
  bulletType: string,
  bulletLevel: number
): string {
  let bullet =
    "<div style='height: 100%;" +
    marginLeftStyle +
    marginRightStyle +
    "color:#" +
    bulletColor[0] +
    ";" +
    "font-size:" +
    bulletSize +
    ";";

  if (isRtl) {
    bullet += "display: inline-block;white-space: nowrap ;direction:rtl;";
  } else {
    bullet += "display: inline-block;white-space: nowrap ;direction:ltr;";
  }

  bullet +=
    "' data-bulltname = '" +
    bulletType +
    "' data-bulltlvl = '" +
    bulletLevel +
    "' class='numeric-bullet-style'></div>";

  return bullet;
}
