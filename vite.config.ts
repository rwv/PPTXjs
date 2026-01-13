import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "PPTXjs",
      formats: ["es", "iife"],
      fileName: (format) => (format === "es" ? "pptxjs.esm" : "pptxjs.iife"),
      cssFileName: "pptxjs",
    },
    rollupOptions: {
      output: {
        // Ensure IIFE output doesn't emit dynamic import wrappers.
        inlineDynamicImports: true,
      },
    },
  },
});
