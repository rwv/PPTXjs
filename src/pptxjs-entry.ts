import "../css/pptxjs.css";
import "nvd3/build/nv.d3.min.css";

import { pptxToHtml } from "./js/pptxjs";

type MaybeDefaultModule<T> = T | { default?: T };

function resolveDefault<T>(mod: MaybeDefaultModule<T>): T {
  return (mod as { default?: T }).default ?? (mod as T);
}

let depsPromise: Promise<void> | null = null;

export function ensurePptxDependencies(): Promise<void> {
  if (!depsPromise) {
    depsPromise = (async () => {
      const globals = globalThis as Record<string, unknown>;

      if (!globals.d3) {
        const d3SourceModule = await import("d3/d3.js?raw");
        const d3Source = resolveDefault(d3SourceModule);
        const d3Factory = new Function(String(d3Source));
        d3Factory.call(globalThis);
      }

      if (!globals.nv) {
        const nvd3SourceModule = await import("nvd3/build/nv.d3.js?raw");
        const nvd3Source = resolveDefault(nvd3SourceModule);
        const nvd3Factory = new Function(String(nvd3Source));
        nvd3Factory.call(globalThis);
      }
    })();
  }
  return depsPromise;
}

export { pptxToHtml };
