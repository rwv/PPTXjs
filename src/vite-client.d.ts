/// <reference types="vite/client" />

declare module "vitest/browser" {
  export const page: import("@vitest/browser/context").BrowserPage;
}
