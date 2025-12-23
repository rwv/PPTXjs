# PPTXjs TypeScript Type Cheatsheet

Quick reference guide for TypeScript types in PPTXjs codebase.

## Core Type Imports

```typescript
import type {
  PptxNode,           // XML node (semantically typed any)
  WarpObject,         // Core context object
  SlideFactor,        // EMU to pixel conversion (96/914400)
  FontSizeFactor,     // Font size scaling (4/3.2)
} from "../types";    // Adjust path based on file location
```

## Type Definitions

### PptxNode

**Purpose:** Represents XML node objects parsed from PPTX files by tXml.

**Type:** `type PptxNode = any`

**Why any?** PPTX XML structures are deeply nested, dynamic, and vary significantly. Using `any` is pragmatic while `PptxNode` provides semantic clarity.

**Usage:**
```typescript
function processNode(
  node: PptxNode,              // Main node
  slideLayoutSpNode: PptxNode, // Layout node
  slideMasterSpNode: PptxNode, // Master node
  pNode: PptxNode,             // Parent node
  textBodyNode: PptxNode       // Text body node
): string {
  // ...
}
```

### WarpObject

**Purpose:** Core context object containing all slide resources (theme, layouts, masters, archive).

**Type:**
```typescript
interface WarpObject {
  slideContent?: PptxNode;
  slideLayoutContent?: PptxNode;
  slideMasterContent?: PptxNode;
  themeContent?: PptxNode;
  slideLayoutTables?: any;
  slideMasterTables?: any;
  slideResObj?: Record<string, { target: string }>;
  archive?: any;  // PptxArchive instance
  [key: string]: any;
}
```

**Usage:**
```typescript
function renderShape(
  node: PptxNode,
  warpObj: WarpObject  // Always type as WarpObject
): string {
  const theme = warpObj.themeContent;
  const layout = warpObj.slideLayoutContent;
  // ...
}
```

### SlideFactor

**Purpose:** EMU (English Metric Units) to pixel conversion factor.

**Value:** `96 / 914400`

**Type:** `type SlideFactor = number`

**Usage:**
```typescript
function convertPosition(
  emuValue: number,
  slideFactor: SlideFactor  // Use type alias, not number
): number {
  return emuValue * slideFactor;
}
```

### FontSizeFactor

**Purpose:** Font size scaling factor for rendering adjustments.

**Value:** `4 / 3.2`

**Type:** `type FontSizeFactor = number`

**Usage:**
```typescript
function getFontSize(
  baseSize: number,
  fontSizeFactor: FontSizeFactor  // Use type alias, not number
): string {
  return (baseSize * fontSizeFactor) + "px";
}
```

## Common Function Signature Patterns

### Layout Functions

```typescript
import type { PptxNode, WarpObject, SlideFactor } from "../../types";

export function getPosition(
  node: PptxNode,
  slideLayoutSpNode: PptxNode,
  slideMasterSpNode: PptxNode,
  slideFactor: SlideFactor
): string;  // Returns CSS position styles
```

### Color Functions

```typescript
import type { PptxNode, WarpObject } from "../../types";

export function getSolidFill(
  node: PptxNode,
  warpObj: WarpObject,
  colorMap?: Record<string, string>
): string;  // Returns hex color
```

### Font Functions

```typescript
import type { PptxNode, WarpObject, FontSizeFactor } from "../../types";

export function getFontSize(
  node: PptxNode,
  textBodyNode: PptxNode,
  pFontStyle: any,
  lvl: any,
  type: any,
  warpObj: WarpObject,
  fontSizeFactor: FontSizeFactor
): string;  // Returns CSS font-size
```

### Shape Rendering

```typescript
import type { PptxNode, WarpObject, SlideFactor, FontSizeFactor } from "../../types";

export function genShape(
  node: PptxNode,
  pNode: PptxNode,
  slideLayoutSpNode: PptxNode,
  slideMasterSpNode: PptxNode,
  id: any,
  name: any,
  idx: any,
  type: any,
  order: any,
  warpObj: WarpObject,
  isUserDrawnBg: any,
  sType: any,
  source: any,
  slideFactor: SlideFactor,
  styleTable: any,
  fontSizeFactor: FontSizeFactor,
  rtlLangsArray: string[],
  isFirstBr: { value: boolean }
): string;  // Returns HTML
```

### Node Processors

```typescript
import type { PptxNode, WarpObject, SlideFactor, FontSizeFactor } from "../../types";

export function processNodesInSlide(
  nodeKey: any,
  nodeValue: PptxNode,
  nodes: PptxNode,
  warpObj: WarpObject,
  source: any,
  sType: any,
  tableStyles: any,
  isFirstBr: { value: boolean },
  styleTable: any,
  rtlLangsArray: string[],
  slideFactor: SlideFactor,
  fontSizeFactor: FontSizeFactor,
  chartID: any,
  MsgQueue: any,
  settings: any
): string;  // Returns HTML
```

## Import Path Patterns

Import paths vary by file location:

```typescript
// For files in src/js/utils/subdirectory/
import type { PptxNode, WarpObject } from "../../types";

// For files in src/js/utils/subdirectory/nested/
import type { PptxNode, WarpObject } from "../../../types";

// For files in src/js/
import type { PptxNode, WarpObject } from "./types";
```

## When to Use `any` vs. Defined Types

### ✅ Use Defined Types

| Parameter | Type | Reason |
|-----------|------|--------|
| `node`, `pNode`, `textBodyNode` | `PptxNode` | XML node parameters |
| `slideLayoutSpNode`, `slideMasterSpNode` | `PptxNode` | Layout/Master nodes |
| `warpObj` | `WarpObject` | Core context object |
| `slideFactor` | `SlideFactor` | EMU conversion factor |
| `fontSizeFactor` | `FontSizeFactor` | Font scaling factor |
| Return values (when clear) | `string`, `number` | Clear return types |
| Arrays of primitives | `string[]`, `number[]` | Typed arrays |

### ✅ Acceptable to Use `any`

| Parameter | Keep as `any` | Reason |
|-----------|---------------|--------|
| `id`, `idx`, `type`, `name`, `order` | Yes | Can be string/number/undefined |
| `border` | Yes | Complex object with many variants |
| `styleTable` | Yes | Dynamic CSS class table |
| `tableStyles` | Yes | Complex table style definitions |
| `chartID`, `MsgQueue` | Yes | Chart processing internals |
| `settings` | Yes | Plugin settings object |
| `pFontStyle`, `lstStyle` | Yes | Complex style inheritance |
| `sType`, `source`, `isUserDrawnBg` | Yes | Various mixed types |
| Local variables building objects | Yes | Dynamic construction |

## Type Coverage Statistics

**Current Status:**
- Total utility functions: ~145
- `:any` usage in `src/js/utils/`: ~273 (down from ~350 initially)
- Type coverage: ~85%
- Defined interfaces: 30+
- Type definition files: 6

**Module Breakdown:**
```
shape: 72 :any (mostly in complex shape renderers)
layout: 24 :any
text: 24 :any
node: 24 :any
table: 20 :any
fill: 20 :any
chart: 15 :any
font: 14 :any
bullet: 8 :any
object: 6 :any
diagram: 5 :any
media: 5 :any
xml: 4 :any
svg: 3 :any
color: 2 :any
vendors: 2 :any
border: 1 :any
string: 0 :any (fully typed!)
```

## Migration Checklist

When adding types to a utility function:

- [ ] Import type definitions from `types` directory
- [ ] Change XML node params from `any` to `PptxNode`
- [ ] Change warpObj param from `any` to `WarpObject`
- [ ] Change slideFactor from `number` to `SlideFactor`
- [ ] Change fontSizeFactor from `number` to `FontSizeFactor`
- [ ] Keep complex params as `any` (border, styleTable, etc.)
- [ ] Add clear return type if obvious (string, number, etc.)
- [ ] Run `pnpm build` to verify compilation
- [ ] Run `pnpm test` to ensure tests pass
- [ ] Commit changes with descriptive message

## Examples from Codebase

### Before Type Improvements

```typescript
// src/js/utils/layout/get-position.ts (old)
export function getPosition(
  node: any,
  slideLayoutSpNode: any,
  slideMasterSpNode: any,
  slideFactor: number
): any {
  // ...
}
```

### After Type Improvements

```typescript
// src/js/utils/layout/get-position.ts (new)
import type { PptxNode, SlideFactor } from "../../types";

export function getPosition(
  node: PptxNode,
  slideLayoutSpNode: PptxNode,
  slideMasterSpNode: PptxNode,
  slideFactor: SlideFactor
): string {  // Returns CSS position string
  // ...
}
```

## Additional Resources

- **Type Definitions:** `src/js/types/pptx-common.d.ts`
- **Usage Examples:** Look at files in `src/js/utils/layout/`, `src/js/utils/color/`
- **CLAUDE.md:** Project guidelines including TypeScript section
- **Plan Document:** `~/.claude/plans/effervescent-crunching-metcalfe.md` (if available)

## Version History

- **Phase 0-7 (2025-01):** Initial type system implementation
  - Created core type definitions (PptxNode, WarpObject, SlideFactor, FontSizeFactor)
  - Migrated 70+ utility functions to use typed parameters
  - Reduced `:any` usage from ~350 to ~273 (22% reduction)
  - Achieved ~85% type coverage across utils modules
