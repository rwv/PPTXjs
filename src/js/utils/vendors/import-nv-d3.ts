import "nvd3/build/nv.d3.min.css";

import d3Source from "d3/d3.js?raw";
import nvd3Source from "nvd3/build/nv.d3.js?raw";

type D3Module = typeof import("d3");
type NvModule = typeof import("nvd3");

type GlobalChartDeps = {
  d3?: D3Module;
  nv?: NvModule;
};

const globals = globalThis as GlobalChartDeps;

const ensureGlobalScript = (source: string) => {
  const factory = new Function(String(source));
  factory.call(globalThis);
};

if (!globals.d3) {
  ensureGlobalScript(d3Source);
}

if (!globals.nv) {
  ensureGlobalScript(nvd3Source);
}

const d3 = globals.d3;
const nv = globals.nv;

if (!d3 || !nv) {
  throw new Error("Failed to load d3/nvd3 dependencies.");
}

export { d3, nv };
export type { D3Module, NvModule };
