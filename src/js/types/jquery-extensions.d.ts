/// <reference types="jquery" />

/**
 * jQuery plugin extensions for PPTXjs
 */
interface JQuery {
  /**
   * Convert PPTX file to HTML
   * @param options - Plugin options
   */
  pptxToHtml(options?: any): JQuery;

  /**
   * Convert HTML divs to slides presentation
   * @param options - Slideshow options
   */
  divs2slides(options?: any): JQuery;

  /**
   * Extend html() to accept jQuery objects (jQuery 1.x compatibility)
   */
  html(val: JQuery): JQuery;
}
