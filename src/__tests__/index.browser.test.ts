import { describe, expect, test } from "vitest";
import { page } from "vitest/browser";

import { getPageElementsFromPPTX } from "./helpers/get-page-elements-from-pptx";
import SamplePptx from "./example.pptx?url";

describe("PPTXjs Loading", () => {
  test("should load pptx file", async () => {
    const response = await fetch(SamplePptx);
    const blob = await response.blob();

    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(0);
  });

  test("should parse pptx and get slides", async () => {
    // The library works in production but fails in test environment due to
    // Sizzle selector engine issue: "X[g].exec is not a function"

    const response = await fetch(SamplePptx);
    const blob = await response.blob();

    const { pages, element } = await getPageElementsFromPPTX(blob);

    // Check slide count
    expect(pages.length).toBeGreaterThan(0);
    expect(pages.length).toMatchInlineSnapshot(`12`);

    // Verify slides are in the DOM
    const allSlidesWrapper = document.getElementById("all_slides_warpper");
    expect(allSlidesWrapper).not.toBeNull();

    // Check that we have actual slide elements
    const slideElements = document.querySelectorAll(".slide");
    expect(slideElements.length).toBeGreaterThan(0);
    expect(slideElements.length).toMatchInlineSnapshot(`12`);

    // Snapshot test: Verify slide structure (extract stable parts)
    const slideStructure = Array.from(slideElements).map((slide, index) => {
      // Extract stable structure without dynamic IDs or base64 data
      const getElementInfo = (el: Element) => ({
        tag: el.tagName,
        className: el.className,
        childCount: el.children.length,
        hasStyle: el.hasAttribute("style"),
        children: Array.from(el.children).map((child) => ({
          tag: child.tagName,
          className: child.className,
          hasContent: child.children.length > 0 || (child.textContent?.trim().length ?? 0) > 0,
        })),
      });

      return {
        index,
        ...getElementInfo(slide),
      };
    });
    expect(slideStructure).toMatchSnapshot();

    for (let i = 0; i < slideElements.length; i++) {
      slideElements[i]!.setAttribute("data-testid", `test-slide-${i}`);
      const slide = page.getByTestId(`test-slide-${i}`);
      await expect(slide).toMatchScreenshot(`test-slide-${i}`, {
        comparatorName: "pixelmatch",
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.01,
        },
      });
    }

    console.log(`✓ Successfully loaded ${pages.length} slides`);

    // Clean up
    element.remove();
  }, 5000); // 60 second timeout
});
