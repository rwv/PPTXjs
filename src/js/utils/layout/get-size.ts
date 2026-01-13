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
 * @param emuToPx - Conversion factor from PPTX units to pixels (default: 96/914400)
 * @returns CSS size string (e.g., "width: 100px; height: 50px;") or empty string if no extent found
 */
type GetSizeOptions = {
  slideSpNode: ExtentNode | undefined;
  slideLayoutSpNode: ExtentNode | undefined;
  slideMasterSpNode: ExtentNode | undefined;
  emuToPx: number;
};

export function getSize({
  slideSpNode,
  slideLayoutSpNode,
  slideMasterSpNode,
  emuToPx,
}: GetSizeOptions): string {
  let extentAttributes: { cx?: string; cy?: string } | undefined;
  let widthPx = -1,
    heightPx = -1;

  // Find extent with fallback hierarchy: slide -> layout -> master
  if (slideSpNode !== undefined) {
    extentAttributes = slideSpNode["a:ext"]?.attrs;
  }
  if (extentAttributes === undefined && slideLayoutSpNode !== undefined) {
    extentAttributes = slideLayoutSpNode["a:ext"]?.attrs;
  }
  if (extentAttributes === undefined && slideMasterSpNode !== undefined) {
    extentAttributes = slideMasterSpNode["a:ext"]?.attrs;
  }

  // Return empty string if no extent found
  if (extentAttributes === undefined) {
    return "";
  } else {
    widthPx = parseInt(extentAttributes["cx"] || "0") * emuToPx;
    heightPx = parseInt(extentAttributes["cy"] || "0") * emuToPx;
    return isNaN(widthPx) || isNaN(heightPx)
      ? ""
      : "width:" + widthPx + "px; height:" + heightPx + "px;";
  }
}
