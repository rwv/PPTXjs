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
    var typefaceNode = getTextByPathList(pPrNode, ["a:buFont", "attrs", "typeface"]);
    var typeface = "";
    if (typefaceNode !== undefined) {
        typeface = "font-family: " + typefaceNode;
    }

    var bullet = "<div style='height: 100%;" + typeface + ";" +
        marLStr + marRStr +
        "font-size:" + bultSize + ";";

    // Handle different color types
    if (color_tye == "solid") {
        if (bultColor[0] !== undefined && bultColor[0] != "") {
            bullet += "color:#" + bultColor[0] + "; ";
        }
        if (bultColor[1] !== undefined && bultColor[1] != "" && bultColor[1] != ";") {
            bullet += "text-shadow:" + bultColor[1] + ";";
        }
    } else if (color_tye == "pattern" || color_tye == "pic" || color_tye == "gradient") {
        if (color_tye == "pattern") {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            bullet += "background:" + bultColor[0][0] + ";";
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (bultColor[0][1] !== null && bultColor[0][1] !== undefined && bultColor[0][1] != "") {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                bullet += "background-size:" + bultColor[0][1] + ";";
            }
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            if (bultColor[0][2] !== null && bultColor[0][2] !== undefined && bultColor[0][2] != "") {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                bullet += "background-position:" + bultColor[0][2] + ";";
            }
        } else if (color_tye == "pic") {
            bullet += bultColor[0] + ";";
        } else if (color_tye == "gradient") {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            var colorAry = bultColor[0].color;
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            var rot = bultColor[0].rot;

            bullet += "background: linear-gradient(" + rot + "deg,";
            for (var i = 0; i < colorAry.length; i++) {
                if (i == colorAry.length - 1) {
                    bullet += "#" + colorAry[i] + ");";
                } else {
                    bullet += "#" + colorAry[i] + ", ";
                }
            }
        }

        // Apply background clipping for non-solid colors
        bullet += "-webkit-background-clip: text;" +
            "background-clip: text;" +
            "color: transparent;";
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        if (bultColor[1].border !== undefined && bultColor[1].border !== "") {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            bullet += "-webkit-text-stroke: " + bultColor[1].border + ";";
        }
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        if (bultColor[1].effcts !== undefined && bultColor[1].effcts !== "") {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            bullet += "filter: " + bultColor[1].effcts + ";";
        }
    }

    // RTL support
    if (isRTL) {
        bullet += "white-space: nowrap ;direction:rtl";
    }

    // IE11 compatibility check
    // @ts-expect-error TS(2339): Property 'MSInputMethodContext' does not exist on type 'Window & typeof globalThis'.
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    var htmlBu = buChar;

    if (!isIE11) {
        // IE11 does not support unicode
        htmlBu = getHtmlBullet(typefaceNode, buChar);
    }

    bullet += "'><div style='line-height: " + (font_val / 2) + "px;'>" + htmlBu + "</div></div>";

    return bullet;
}
