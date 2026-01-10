# AGENTS.md

## Project status
- This repo modernizes the legacy PPTXjs jQuery plugin and now targets native DOM APIs for PPTX-to-HTML conversion.

## Scripts
- build: `pnpm build`
- test: `pnpm test`
- format: `pnpm format`
- lint: `pnpm lint`
- type-check: `pnpm type-check`

## Required pre-commit checklist
1) `pnpm install`
2) `pnpm format`
3) `pnpm lint`
4) `pnpm type-check`
5) `pnpm build`
6) `pnpm test`
All commands must pass before committing.

## Current goal
- Replace any remaining jQuery usage with native DOM APIs and keep all checks passing.

## Repo overview
- `src/js/pptxjs.ts`: main PPTX parser and renderer (exports `pptxToHtml` and attaches to `window`).
- `src/js/divs2slides.ts`: slideshow/presentation mode implementation.
- `src/js/utils/**`: utility modules grouped by domain (layout, color, font, shape, media, chart, xml, vendors).
- `src/index.ts` and `src/load-pptxjs.ts`: programmatic loader and browser entry used by tests.
- `rollup.config.js`: builds IIFE output to `dist/js/pptxjs.js`.
- `css/`: runtime styles; `js/` and `js-original/`: built and legacy artifacts.
- `src/__tests__/*.browser.test.ts`: browser tests (Vitest + Playwright).
- `Sample_12.pptx`: sample PPTX for manual/testing.
