# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PPTXjs converts PowerPoint (PPTX) files to HTML using pure JavaScript and native DOM APIs. It parses the OOXML structure of PPTX files and renders slides as HTML/CSS with support for text, shapes, images, videos, charts, SmartArt diagrams, tables, and themes.

**Current Goal**: Continue modernizing legacy JavaScript into ESM TypeScript modules while keeping checks passing (`pnpm lint && pnpm type-check && pnpm test`).

**Key Technologies:**
- @zip.js/zip.js for PPTX file parsing (async API; adapter preloads entries for sync reads)
- D3.js + NVD3 for chart rendering
- TypeScript with `strict: false` (gradual migration from JavaScript)

## Commands

```bash
# Format sources
pnpm format

# Lint sources
pnpm lint

# Type checking (expect many errors - strict mode is disabled)
pnpm type-check

# Run tests with browser automation (Playwright + Vitest)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui
```

## Architecture Overview

### Entry Points

1. **pptxjs-entry** (`src/pptxjs-entry.ts`) - ESM entry that loads D3 v3 and NVD3, then exports `pptxToHtml`.
2. **pptxjs core** (`src/js/pptxjs.ts`) - Main PPTX parser and renderer (exported and attached to `window`).
3. **divs2slides** (`src/js/divs2slides.ts`) - Slideshow presentation mode with navigation and transitions.

### ESM Entry (No Script Tags)

- Import `pptxToHtml` from the entry and call `await ensurePptxDependencies()` before use.

### Core PPTX Processing Flow

The main processing happens in `src/js/pptxjs.ts` (~13,000 lines):

1. **ZIP Extraction**: Uses zip.js via the archive adapter to read PPTX entries
2. **XML Parsing**: Custom tXml parser (`src/js/utils/vendors/txml.js`) converts XML to JS objects
3. **Theme Resolution**: Extracts color schemes, fonts from `theme/theme*.xml`
4. **Layout Hierarchy**: Resolves properties through slide → layout → master → theme fallback chain
5. **HTML Generation**: Creates HTML divs with inline CSS for each slide element

### Utility Module Organization

Utilities are organized under `src/js/utils/` by domain:

- **layout/** - Position, size, alignment, margins, text direction (RTL/LTR)
- **color/** - Color parsing, scheme colors, tints/shades, gradients
- **font/** - Font size calculations with complex fallback hierarchy
- **shape/** - Custom shape rendering (pie, arc, gear, snip-round-rect)
- **bullet/** - Bullet and numbering generation
- **media/** - Image/video/audio processing, MIME types, base64 encoding
- **chart/** - Chart data extraction (delegates rendering to D3/NVD3)
- **text/** - Text formatting (romanize, alpha-numeric, archaic numbers)
- **object/** - Path-based object traversal (`getTextByPathList`, `setTextByPathList`)
- **svg/** - SVG gradient generation
- **xml/** - XML file reading utilities
- **vendors/** - Third-party code (tXml parser)

### Key Constants and Factors

Located at the top of `pptxjs.ts`:

```typescript
var slideFactor = 96 / 914400;      // EMU to pixel conversion
var fontSizeFactor = 4 / 3.2;       // Font size scaling factor
```

These constants are passed down through many utility functions and affect all measurements.

### Fallback Hierarchy Pattern

Most property lookups follow this pattern:
1. Element-level property (highest priority)
2. Slide-level property
3. Layout-level property (from `slideLayoutTables`)
4. Master-level property (from `slideMasterTextStyles`)
5. Theme-level property (lowest priority)

This pattern appears in font sizing, colors, alignment, spacing, etc.

## TypeScript Migration Status

The codebase is actively being migrated from JavaScript to TypeScript with ESM modules:

**Type Annotation Guidelines:**
- `strict: false` in tsconfig - gradual typing approach
- **Use proper types for simple values**: `string`, `number`, `boolean`, etc. should be typed
- **Use `any` for complex PPTX XML structures**: The XML node objects from PPTX files are deeply nested and dynamic - use `any` for these
- **Don't over-engineer types**: If a type would be complex to define, `any` is acceptable
- `@ts-expect-error` comments suppress specific errors (many are legacy, can be cleaned up over time)

**Examples:**
```typescript
// Good - simple types are annotated
export function getVerticalMargins(
  pNode: any,              // Complex XML node - use any
  textBodyNode: any,       // Complex XML node - use any
  type: any,               // Could be string but has many values - any is fine
  idx: any,                // Could be number but might be undefined - any is fine
  warpObj: any,            // Complex object with many properties - use any
  fontSizeFactor: number   // Simple numeric value - use number
): string {                // Returns CSS string - use string
  // ...
}
```

## Testing

Tests use Vitest browser mode with Playwright:
- Browser-based testing required (DOM manipulation)
- Tests load real PPTX files and render them
- Visual regression testing with screenshot comparisons
- Snapshot testing for DOM structure

Test files: `src/__tests__/*.browser.test.ts`

## Migration and Refactoring Guidelines

When extracting functions from the large `pptxjs.ts` file to separate modules:

### Extraction Process

1. **Preserve behavior exactly** - no refactoring logic during extraction
2. **Type simple parameters** - use `string`, `number` for clear types; use `any` for complex XML nodes
3. **No default parameters** - all parameters must be explicitly passed
4. **Update imports** in `pptxjs.ts` and create barrel exports (`index.ts`)
5. **Pass constants down** - `fontSizeFactor`, `slideFactor` are passed as parameters, not globals
6. **Delete inline functions** - remove the original inline function from `pptxjs.ts` after extraction
7. **Update all call sites** - ensure all function calls use the imported version
8. **Verify immediately** - run `pnpm lint && pnpm type-check && pnpm test` after each extraction

### Completed Extractions

**Layout utilities** (`src/js/utils/layout/`):
- `getPosition`, `getSize`, `getVerticalAlign`, `getVerticalMargins`
- `getHorizontalAlign`, `getPregraphDir`, `getContentDir`, `getLayoutAndMasterNode`

**Font utilities** (`src/js/utils/font/`):
- `getFontSize`

### Extraction Checklist

For each function extraction:
- [ ] Read the function and its dependencies
- [ ] Create new file in appropriate `utils/` subdirectory
- [ ] Add JSDoc comments explaining purpose and parameters
- [ ] Export from barrel file (`index.ts`)
- [ ] Import in `pptxjs.ts`
- [ ] Delete inline function definition
- [ ] Update all call sites
- [ ] Run `pnpm test` - should pass
- [ ] Commit changes

## Important Constraints

- **zip.js async backend** - archive creation is async; adapter preloads entries for sync reads
- **Native DOM APIs** - slide mode and renderer use standard browser APIs
- **Inline styles** - all CSS is inline, no external stylesheets for slide content
- **No strict mode** - TypeScript strict checks disabled due to legacy code

## PPTX/OOXML Structure Notes

PPTX files are ZIP archives containing:
- `ppt/slides/slide*.xml` - Individual slides
- `ppt/slideLayouts/slideLayout*.xml` - Layout templates
- `ppt/slideMasters/slideMaster*.xml` - Master slides
- `ppt/theme/theme*.xml` - Color schemes and fonts
- `ppt/charts/chart*.xml` - Embedded charts
- `ppt/media/*` - Images, videos, audio files

The code uses path-based traversal extensively:
```javascript
getTextByPathList(node, ["a:pPr", "attrs", "rtl"])
```

Common XML namespaces:
- `a:` - DrawingML namespace (shapes, text formatting)
- `p:` - PresentationML namespace (slides, layouts)
- `c:` - Chart namespace
