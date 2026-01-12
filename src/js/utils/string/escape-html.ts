/**
 * HTML entity escape map
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

/**
 * Escapes HTML special characters to prevent XSS attacks
 * Converts characters like <, >, &, ", ' to their HTML entity equivalents
 *
 * @param text - Text to escape
 * @returns Escaped text safe for HTML insertion
 */
type EscapeHtmlOptions = {
  text: string;
};

export function escapeHtml({ text }: EscapeHtmlOptions): string {
  return text.replace(/[&<>"']/g, (m) => HTML_ESCAPE_MAP[m]);
}
