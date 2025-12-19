/**
 * PPTX extent node containing size attributes
 */
interface ExtentNode {
  "a:ext"?: {
    attrs?: {
      cx?: string;
      cy?: string;
    };
  };
  [key: string]: any;
}

/**
 * Calculates the CSS size styling for a PPTX shape element
 *
 * Handles sizing with fallback hierarchy:
 * 1. Slide-level sizing (highest priority)
 * 2. Layout-level sizing
 * 3. Master slide sizing (lowest priority)
 *
 * @param slideSpNode - Extent node from slide content
 * @param slideLayoutSpNode - Extent node from layout
 * @param slideMasterSpNode - Extent node from master slide
 * @param slideFactor - Conversion factor from PPTX units to pixels (default: 96/914400)
 * @returns CSS size string (e.g., "width: 100px; height: 50px;") or empty string if no extent found
 */
export function getSize(
  slideSpNode: ExtentNode | undefined,
  slideLayoutSpNode: ExtentNode | undefined,
  slideMasterSpNode: ExtentNode | undefined,
  slideFactor: number
): string {
  let ext: { cx?: string; cy?: string } | undefined;
  let w = -1,
    h = -1;

  // Find extent with fallback hierarchy: slide -> layout -> master
  if (slideSpNode !== undefined) {
    ext = slideSpNode["a:ext"]?.attrs;
  } else if (slideLayoutSpNode !== undefined) {
    ext = slideLayoutSpNode["a:ext"]?.attrs;
  } else if (slideMasterSpNode !== undefined) {
    ext = slideMasterSpNode["a:ext"]?.attrs;
  }

  // Return empty string if no extent found
  if (ext === undefined) {
    return "";
  } else {
    w = parseInt(ext["cx"] || "0") * slideFactor;
    h = parseInt(ext["cy"] || "0") * slideFactor;
    return isNaN(w) || isNaN(h)
      ? ""
      : "width:" + w + "px; height:" + h + "px;";
  }
}
