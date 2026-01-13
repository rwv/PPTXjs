/**
 * Render numeric bullet (TYPE_NUMERIC)
 *
 * Handles numbered bullets (1, 2, 3, a, b, c, i, ii, iii, etc.) with:
 * - Solid color support
 * - RTL/LTR direction support
 * - Level tracking via data attributes
 * - Bullet type tracking (arabicPeriod, alphaLcPeriod, romanLcPeriod, etc.)
 */

type RenderBulletNumericOptions = {
  bulletColor: string[];
  bulletSize: string;
  marginLeftStyle: string;
  marginRightStyle: string;
  isRtl: boolean;
  bulletNumberType: string;
  level: number;
};

export function renderBulletNumeric({
  bulletColor,
  bulletSize,
  marginLeftStyle,
  marginRightStyle,
  isRtl,
  bulletNumberType,
  level,
}: RenderBulletNumericOptions): string {
  const colorValue = bulletColor[0] ?? "000000";
  let bullet =
    "<div style='height: 100%;" +
    marginLeftStyle +
    marginRightStyle +
    "color:#" +
    colorValue +
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
    bulletNumberType +
    "' data-bulltlvl = '" +
    level +
    "' class='numeric-bullet-style'></div>";

  return bullet;
}
