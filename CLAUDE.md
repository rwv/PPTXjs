# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

pptx-js converts PowerPoint (PPTX) files to HTML using native DOM APIs. It ships as a Vite library build
with ESM and IIFE outputs, and uses zip.js for PPTX archives plus D3/NVD3 for chart rendering.

## Commands

```bash
# Format sources
pnpm format

# Lint sources
pnpm lint

# Type checking
pnpm type-check

# Run tests with browser automation (Playwright + Vitest)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Build library bundles (ESM + IIFE)
pnpm build
```

## Architecture snapshot

### Entry points

- `src/index.ts`: bundle entry that re-exports `pptxToHtml`.
- `src/js/pptxjs.ts`: main parser/renderer and public API (no global window attach).
- `src/js/divs2slides.ts`: slideshow/presentation mode logic.
- `src/js/utils/vendors/import-nv-d3.ts`: chart runtime dependencies (D3/NVD3 + CSS).

### Build outputs

- `pnpm build` emits `dist/pptxjs.esm.js`, `dist/pptxjs.iife.js`, and `dist/pptxjs.css`.
- The IIFE bundle exposes `window.PPTXjs` via Vite's library name, while source code stays module-only.

### Core PPTX processing flow

1) `pptxToHtml` loads PPTX data (URL or file input), creates a PPTX archive, and prepares settings.
2) `processPPTX` reads content types, slide size, themes, and table styles, then iterates slides.
3) `processSingleSlide` resolves layout/master/theme relationships and renders background and nodes.
4) Renderers in `src/js/utils/**` build HTML/CSS and queue chart work.
5) `pptxToHtml` appends results, processes charts, applies bullets, and enables slide mode as needed.

## Types and refactors

- Prefer shared types from `src/js/types/**` (for example `XmlNode`, `RenderSettings`, `StyleTable`).
- Use XML helpers like `getRelationshipType`, `normalizeTarget`, and `isXmlNode` instead of ad-hoc checks.
- Avoid introducing new `any` unless there is no practical type; be explicit where possible.
- Keep DOM side effects localized to entry points or UI helpers.

## Testing

- Vitest browser mode with Playwright; snapshots live in `src/__tests__/__snapshots__` and screenshots in
  `src/__tests__/__screenshots__`.
- Fixture PPTX lives in `src/__tests__/fixtures/example.pptx`.

## PPTX structure quick notes

PPTX files are ZIP archives containing:
- `ppt/slides/slide*.xml` for slides
- `ppt/slideLayouts/slideLayout*.xml` and `ppt/slideMasters/slideMaster*.xml`
- `ppt/theme/theme*.xml` for colors and fonts
- `ppt/charts/chart*.xml` and `ppt/media/*`
