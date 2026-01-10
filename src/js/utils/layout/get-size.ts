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
  [key: string]: unknown;
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
  let extentAttrs: { cx?: string; cy?: string } | undefined;
  let widthPx = -1,
    heightPx = -1;

  // Find extent with fallback hierarchy: slide -> layout -> master
  if (slideSpNode !== undefined) {
    extentAttrs = slideSpNode["a:ext"]?.attrs;
  } else if (slideLayoutSpNode !== undefined) {
    extentAttrs = slideLayoutSpNode["a:ext"]?.attrs;
  } else if (slideMasterSpNode !== undefined) {
    extentAttrs = slideMasterSpNode["a:ext"]?.attrs;
  }

  // Return empty string if no extent found
  if (extentAttrs === undefined) {
    return "";
  } else {
    widthPx = parseInt(extentAttrs["cx"] || "0") * slideFactor;
    heightPx = parseInt(extentAttrs["cy"] || "0") * slideFactor;
    return isNaN(widthPx) || isNaN(heightPx)
      ? ""
      : "width:" + widthPx + "px; height:" + heightPx + "px;";
  }
}
