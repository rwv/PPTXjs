# AGENTS.md

## Project status
- This repo modernizes the legacy PPTXjs jQuery plugin and now targets native DOM APIs plus stronger TypeScript types for PPTX-to-HTML conversion.

## Scripts
- test: `pnpm test`
- test:ui: `pnpm test:ui`
- test:watch: `pnpm test:watch`
- format: `pnpm format`
- format:check: `pnpm format:check`
- lint: `pnpm lint`
- lint:fix: `pnpm lint:fix`
- type-check: `pnpm type-check`

## Required pre-commit checklist
1) `pnpm install`
2) `pnpm format`
3) `pnpm lint`
4) `pnpm type-check`
5) `pnpm test`
All commands must pass before committing.

## Current goal
- Replace any remaining jQuery usage with native DOM APIs and keep all checks passing.

## Repo overview
- `src/js/pptxjs.ts`: main PPTX parser and renderer (exports `pptxToHtml` and attaches to `window`).
- `src/js/divs2slides.ts`: slideshow/presentation mode implementation.
- `src/js/types/**`: shared TypeScript types (settings, XML, styles).
- `src/js/utils/**`: utility modules grouped by domain (layout, color, font, shape, media, chart, xml, vendors).
- `src/js/utils/vendors/import-nv-d3.ts`: loads D3/NVD3 globals and the NVD3 CSS for charts.
- `src/js/utils/vendors/txml/**`: typed TXML parser for PPTX XML.
- `src/js/archive/zipjs-adapter.ts`: zip.js-backed archive adapter used by `createPptxArchive`.
- `src/index.ts`: test helper that uses `pptxToHtml` to render slides.
- `src/__tests__/index.browser.test.ts`: browser tests (Vitest + Playwright).
- `src/__tests__/__screenshots__/**`: Playwright snapshot images (OS/browser specific).
- `src/__tests__/__snapshots__/**`: Vitest snapshot files.
- `src/__tests__/example.pptx`: test fixture PPTX.
- `src/css/`: runtime styles.
