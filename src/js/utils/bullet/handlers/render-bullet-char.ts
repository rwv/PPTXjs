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

export function renderBulletChar(
  pPrNode: any,
  buChar: string,
  bultColor: any,
  color_tye: string,
  bultSize: string,
  marLStr: string,
  marRStr: string,
  isRTL: boolean,
  font_val: number
): string {
  const typefaceNode = getTextByPathList(pPrNode, ["a:buFont", "attrs", "typeface"]);
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
    if (bultColor[0] !== undefined && bultColor[0] !== "") {
      bullet += "color:#" + bultColor[0] + "; ";
    }
    if (bultColor[1] !== undefined && bultColor[1] !== "" && bultColor[1] !== ";") {
      bullet += "text-shadow:" + bultColor[1] + ";";
    }
  } else if (color_tye === "pattern" || color_tye === "pic" || color_tye === "gradient") {
    if (color_tye === "pattern") {
      bullet += "background:" + bultColor[0][0] + ";";
      if (bultColor[0][1] !== null && bultColor[0][1] !== undefined && bultColor[0][1] !== "") {
        bullet += "background-size:" + bultColor[0][1] + ";";
      }
      if (bultColor[0][2] !== null && bultColor[0][2] !== undefined && bultColor[0][2] !== "") {
        bullet += "background-position:" + bultColor[0][2] + ";";
      }
    } else if (color_tye === "pic") {
      bullet += bultColor[0] + ";";
    } else if (color_tye === "gradient") {
      const colorAry = bultColor[0].color;
      const rot = bultColor[0].rot;

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
    if (bultColor[1].border !== undefined && bultColor[1].border !== "") {
      bullet += "-webkit-text-stroke: " + bultColor[1].border + ";";
    }
    if (bultColor[1].effcts !== undefined && bultColor[1].effcts !== "") {
      bullet += "filter: " + bultColor[1].effcts + ";";
    }
  }

  // RTL support
  if (isRTL) {
    bullet += "white-space: nowrap ;direction:rtl";
  }

  // IE11 compatibility check
  // @ts-expect-error TS(2339): Property 'MSInputMethodContext' does not exist on type 'Window & typeof globalThis'.
  const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  let htmlBu = buChar;

  if (!isIE11) {
    // IE11 does not support unicode
    htmlBu = getHtmlBullet(typefaceNode, buChar);
  }

  bullet += "'><div style='line-height: " + font_val / 2 + "px;'>" + htmlBu + "</div></div>";

  return bullet;
}
