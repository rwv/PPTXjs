/**
 * Render character bullet (TYPE_BULLET)
 *
 * Handles character bullets like •, ■, ▪, etc. with:
 * - Custom font families
 * - Multiple color types (solid, pattern, pic, gradient)
 * - RTL support
 * - IE11 compatibility
 */

import { getTextByPathList } from "../../object";
import { getHtmlBullet } from "../get-html-bullet";

type BulletColorEffects = { border?: string; effcts?: string };
type BulletColor =
  | [string, string]
  | [string, BulletColorEffects]
  | [[string, string?, string?], BulletColorEffects]
  | [{ color: string[]; rot: number }, BulletColorEffects];

export function renderBulletChar(
  pPrNode: Record<string, unknown> | undefined,
  bulletChar: string,
  bulletColor: BulletColor,
  colorType: string,
  bulletSize: string,
  marginLeftStyle: string,
  marginRightStyle: string,
  isRtl: boolean,
  fontSizeValue: number
): string {
  const typefaceName = getTextByPathList<string>(pPrNode, ["a:buFont", "attrs", "typeface"]);
  let typefaceStyle = "";
  if (typefaceName !== undefined) {
    typefaceStyle = "font-family: " + typefaceName;
  }

  let bullet =
    "<div style='height: 100%;" +
    typefaceStyle +
    ";" +
    marginLeftStyle +
    marginRightStyle +
    "font-size:" +
    bulletSize +
    ";";

  // Handle different color types
  if (colorType === "solid") {
    const [solidColor, solidShadow] = bulletColor as [string, string];
    if (solidColor !== undefined && solidColor !== "") {
      bullet += "color:#" + solidColor + "; ";
    }
    if (solidShadow !== undefined && solidShadow !== "" && solidShadow !== ";") {
      bullet += "text-shadow:" + solidShadow + ";";
    }
  } else if (colorType === "pattern" || colorType === "pic" || colorType === "gradient") {
    if (colorType === "pattern") {
      const [patternColor, patternSize, patternPos] = (
        bulletColor as [[string, string?, string?], BulletColorEffects]
      )[0];
      bullet += "background:" + patternColor + ";";
      if (patternSize !== null && patternSize !== undefined && patternSize !== "") {
        bullet += "background-size:" + patternSize + ";";
      }
      if (patternPos !== null && patternPos !== undefined && patternPos !== "") {
        bullet += "background-position:" + patternPos + ";";
      }
    } else if (colorType === "pic") {
      const pictureFillStyle = (bulletColor as [string, BulletColorEffects])[0];
      bullet += pictureFillStyle + ";";
    } else if (colorType === "gradient") {
      const gradientFill = (
        bulletColor as [{ color: string[]; rot: number }, BulletColorEffects]
      )[0];
      const gradientColors = gradientFill.color;
      const gradientRotation = gradientFill.rot;

      bullet += "background: linear-gradient(" + gradientRotation + "deg,";
      for (let i = 0; i < gradientColors.length; i++) {
        if (i === gradientColors.length - 1) {
          bullet += "#" + gradientColors[i] + ");";
        } else {
          bullet += "#" + gradientColors[i] + ", ";
        }
      }
    }

    // Apply background clipping for non-solid colors
    bullet += "-webkit-background-clip: text;" + "background-clip: text;" + "color: transparent;";
    const bulletEffects = (bulletColor as [unknown, BulletColorEffects])[1];
    if (bulletEffects.border !== undefined && bulletEffects.border !== "") {
      bullet += "-webkit-text-stroke: " + bulletEffects.border + ";";
    }
    if (bulletEffects.effcts !== undefined && bulletEffects.effcts !== "") {
      bullet += "filter: " + bulletEffects.effcts + ";";
    }
  }

  // RTL support
  if (isRtl) {
    bullet += "white-space: nowrap ;direction:rtl";
  }

  // IE11 compatibility check
  const isIE11 =
    !!(window as { MSInputMethodContext?: unknown }).MSInputMethodContext &&
    !!(document as Document & { documentMode?: unknown }).documentMode;
  let bulletHtml = bulletChar;

  if (!isIE11) {
    // IE11 does not support unicode
    bulletHtml = getHtmlBullet(typefaceName, bulletChar);
  }

  bullet +=
    "'><div style='line-height: " + fontSizeValue / 2 + "px;'>" + bulletHtml + "</div></div>";

  return bullet;
}
