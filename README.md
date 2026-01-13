# pptx-js

pptx-js converts PowerPoint (PPTX) files to HTML using pure JavaScript and native DOM APIs. It is a
modernized continuation of meshesha/PPTXjs with TypeScript-friendly modules and no jQuery dependency.

## Features

- Text, shapes, tables, charts (D3/NVD3), media, SmartArt, and themes
- Slide mode (divs2slides or Reveal.js)
- Browser-focused rendering with CSS output

## Install

```bash
pnpm add pptx-js
```

## Usage (ESM)

```ts
import { pptxToHtml } from "pptx-js";

await pptxToHtml({
  container: "#result",
  options: {
    pptxFileUrl: "/path/to/file.pptx",
    slideMode: false,
  },
});
```

## Usage (IIFE)

```html
<link rel="stylesheet" href="/dist/pptxjs.css" />
<script src="/dist/pptxjs.iife.js"></script>
<script>
  window.PPTXjs.pptxToHtml({
    container: "#result",
    options: {
      pptxFileUrl: "/path/to/file.pptx",
    },
  });
</script>
```

## Common Options

- `pptxFileUrl`: URL to a PPTX file.
- `fileInputId`: File input element id for local uploads.
- `slideMode`: Enable slideshow mode.
- `slideType`: `divs2slidesjs` or `revealjs`.
- `mediaProcess`: Enable video/audio processing.
- `themeProcess`: `true`, `false`, or `colorsAndImageOnly`.

## Build

```bash
pnpm build
```

Outputs:
- `dist/pptxjs.esm.js`
- `dist/pptxjs.iife.js`
- `dist/pptxjs.css`

## Testing

```bash
pnpm test
```

## License

This project includes MIT-licensed code from meshesha/PPTXjs. That portion remains under the MIT
License. All other code in this repository is licensed under AGPLv3 or a commercial license.
Commercial licensing: i@rwv.dev

See `LICENSE` for details.
