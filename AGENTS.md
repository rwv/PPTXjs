# AGENTS.md

## Project status
- This repo is the standalone `pptx-js` library for converting PPTX files to HTML. It ships ESM + IIFE builds via Vite and uses native DOM APIs with TypeScript types.

## Scripts
- test: `pnpm test`
- test:ui: `pnpm test:ui`
- test:watch: `pnpm test:watch`
- build: `pnpm build`
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
- Keep the PPTX-to-HTML renderer stable while improving type safety and keeping ESM/IIFE builds and tests green.

## Repo overview
- `src/index.ts`: public entry for bundling (exports `pptxToHtml`).
- `src/js/pptxjs.ts`: main PPTX parser and renderer (exports `pptxToHtml`; no global window attach).
- `src/js/divs2slides.ts`: slideshow/presentation mode implementation.
- `src/js/types/**`: shared TypeScript types (settings, XML, styles).
- `src/js/utils/**`: utility modules grouped by domain (layout, color, font, shape, media, chart, xml, vendors).
- `src/js/utils/vendors/import-nv-d3.ts`: loads D3/NVD3 globals and NVD3 CSS for charts.
- `src/js/utils/vendors/txml/**`: typed TXML parser for PPTX XML.
- `src/js/archive/zipjs-adapter.ts`: zip.js-backed archive adapter used by `createPptxArchive`.
- `src/css/pptxjs.css`: runtime styles bundled by Vite.
- `src/__tests__/index.browser.test.ts`: browser tests (Vitest + Playwright).
- `src/__tests__/__screenshots__/**`: Playwright snapshot images (OS/browser specific).
- `src/__tests__/__snapshots__/**`: Vitest snapshot files.
- `src/__tests__/fixtures/example.pptx`: test fixture PPTX.
- `vite.config.ts`: Vite library build (ESM + IIFE).
- `dist/`: build outputs (`pptxjs.esm.js`, `pptxjs.iife.js`, `pptxjs.css`).
- `.husky/`, `commitlint.config.ts`, `.lintstagedrc.json`: commit hooks and lint-staged rules.

## Rendering flow
1) `pptxToHtml` in `src/js/pptxjs.ts` loads the PPTX (fetch or file input), creates a PPTX archive (`createPptxArchive`), and prepares settings/state.
2) `processPPTX` in `src/js/utils/pptx/process-pptx.ts` reads content types, slide size/default text, and table styles; it loops slides and calls `processSingleSlide`, then emits `globalCSS` and `ExecutionTime`.
3) `processSingleSlide` in `src/js/utils/slide/process-single-slide.ts` resolves slide/layout/master/theme/diagram relationships, builds the `warpContext`, renders background, and iterates `p:spTree` nodes via `processNodesInSlide`.
4) Node processors under `src/js/utils/node/**` and `src/js/utils/**` render shapes, text, tables, media, charts, and fill the `styleTable` plus chart message queue.
5) Back in `pptxToHtml`, the renderer appends slide HTML/CSS, flushes chart rendering (`processMsgQueue`), applies numeric bullets, wraps slides for reveal/divs2slides, and applies scaling/slide mode.
