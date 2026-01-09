# AGENTS.md

## Project status
- This repo is a modernization of the legacy PPTXjs jQuery plugin that converts PPTX to HTML.

## Scripts
- build: `pnpm build`
- test: `pnpm test`
- format: `pnpm format`
- lint: `pnpm lint`
- type-check: `pnpm type-check`

## Required pre-commit checklist
1) `pnpm install`
2) `pnpm format`
3) `pnpm build`
4) `pnpm test`
All commands must pass before committing.

## Current goal
- Eliminate all lint and type-check errors (use `pnpm lint` and `pnpm type-check` while fixing issues).

## Repo overview
- `src/js/pptxjs.ts`: main PPTX parser and renderer plugin (extends `$.fn.pptxToHtml`).
- `src/js/divs2slides.ts`: slideshow/presentation mode plugin.
- `src/js/utils/**`: utility modules grouped by domain (layout, color, font, shape, media, chart, xml, vendors).
- `src/index.ts` and `src/load-pptxjs.ts`: programmatic loader and browser entry used by tests.
- `rollup.config.js`: builds IIFE output to `dist/js/pptxjs.js`.
- `css/`: runtime styles; `js/` and `js-original/`: built and legacy artifacts.
- `src/__tests__/*.browser.test.ts`: browser tests (Vitest + Playwright).
- `Sample_12.pptx`: sample PPTX for manual/testing.
