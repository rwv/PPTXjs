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
  buChar: string,
  bultColor: BulletColor,
  color_tye: string,
  bultSize: string,
  marLStr: string,
  marRStr: string,
  isRTL: boolean,
  font_val: number
): string {
  const typefaceNode = getTextByPathList<string>(pPrNode, ["a:buFont", "attrs", "typeface"]);
  let typeface = "";
  if (typefaceNode !== undefined) {
    typeface = "font-family: " + typefaceNode;
  }

  let bullet =
    "<div style='height: 100%;" +
    typeface +
    ";" +
    marLStr +
    marRStr +
    "font-size:" +
    bultSize +
    ";";

  // Handle different color types
  if (color_tye === "solid") {
    const [solidColor, solidShadow] = bultColor as [string, string];
    if (solidColor !== undefined && solidColor !== "") {
      bullet += "color:#" + solidColor + "; ";
    }
    if (solidShadow !== undefined && solidShadow !== "" && solidShadow !== ";") {
      bullet += "text-shadow:" + solidShadow + ";";
    }
  } else if (color_tye === "pattern" || color_tye === "pic" || color_tye === "gradient") {
    if (color_tye === "pattern") {
      const [patternColor, patternSize, patternPos] = (
        bultColor as [[string, string?, string?], BulletColorEffects]
      )[0];
      bullet += "background:" + patternColor + ";";
      if (patternSize !== null && patternSize !== undefined && patternSize !== "") {
        bullet += "background-size:" + patternSize + ";";
      }
      if (patternPos !== null && patternPos !== undefined && patternPos !== "") {
        bullet += "background-position:" + patternPos + ";";
      }
    } else if (color_tye === "pic") {
      const picFill = (bultColor as [string, BulletColorEffects])[0];
      bullet += picFill + ";";
    } else if (color_tye === "gradient") {
      const gradientFill = (bultColor as [{ color: string[]; rot: number }, BulletColorEffects])[0];
      const colorAry = gradientFill.color;
      const rot = gradientFill.rot;

      bullet += "background: linear-gradient(" + rot + "deg,";
      for (let i = 0; i < colorAry.length; i++) {
        if (i === colorAry.length - 1) {
          bullet += "#" + colorAry[i] + ");";
        } else {
          bullet += "#" + colorAry[i] + ", ";
        }
      }
    }

    // Apply background clipping for non-solid colors
    bullet += "-webkit-background-clip: text;" + "background-clip: text;" + "color: transparent;";
    const effects = (bultColor as [unknown, BulletColorEffects])[1];
    if (effects.border !== undefined && effects.border !== "") {
      bullet += "-webkit-text-stroke: " + effects.border + ";";
    }
    if (effects.effcts !== undefined && effects.effcts !== "") {
      bullet += "filter: " + effects.effcts + ";";
    }
  }

  // RTL support
  if (isRTL) {
    bullet += "white-space: nowrap ;direction:rtl";
  }

  // IE11 compatibility check
  const isIE11 =
    !!(window as { MSInputMethodContext?: unknown }).MSInputMethodContext &&
    !!(document as Document & { documentMode?: unknown }).documentMode;
  let htmlBu = buChar;

  if (!isIE11) {
    // IE11 does not support unicode
    htmlBu = getHtmlBullet(typefaceNode, buChar);
  }

  bullet += "'><div style='line-height: " + font_val / 2 + "px;'>" + htmlBu + "</div></div>";

  return bullet;
}
