import { getDingbatToUnicode } from "./get-dingbat-to-unicode";

/**
 * Converts bullet characters to HTML entities
 * Handles special characters and Wingdings fonts
 *
 * @param typefaceNode - Font typeface name (e.g., "Wingdings 2", "Wingdings 3")
 * @param bulletChar - Bullet character to convert
 * @returns HTML entity string
 */
type GetHtmlBulletOptions = {
  typefaceNode: string | undefined;
  bulletChar: string;
};

export function getHtmlBullet({ typefaceNode, bulletChar }: GetHtmlBulletOptions): string {
  // http://www.alanwood.net/demos/wingdings.html
  if (!bulletChar) {
    return "";
  }
  // Handle common special cases
  switch (bulletChar) {
    case "§":
      return "&#9632;"; // ■ Black square (U+25A0)
    case "q":
      return "&#10065;"; // ❑ Lower right shadowed white square (U+2751)
    case "v":
      return "&#10070;"; // ❖ Black diamond minus white X (U+2756)
    case "Ø":
      return "&#11162;"; // ⮚ Three-D top-lighted rightwards equilateral arrowhead (U+2B9A)
    case "ü":
      return "&#10004;"; // ✔ Heavy check mark (U+2714)
    default:
      // Handle Wingdings fonts
      if (typefaceNode === "Wingdings 2" || typefaceNode === "Wingdings 3") {
        const wingCharCode = getDingbatToUnicode({ typefaceNode, bulletChar });
        if (wingCharCode !== null) {
          return "&#" + wingCharCode + ";";
        }
      }
      // Default: use the character's code point
      return "&#" + bulletChar.charCodeAt(0) + ";";
  }
}
