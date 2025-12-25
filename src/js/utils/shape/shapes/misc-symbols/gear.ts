/**
 * Gear shape renderer (gear6 and gear9).
 */

import { shapeGear } from "../helpers/gear";
import type { MiscSymbolContext } from "./shared";
import { createPath } from "./shared";

export function renderGear(ctx: MiscSymbolContext, shapType: string): string {
  const { w, h, setTxtRotate } = ctx;
  if (setTxtRotate) setTxtRotate(0);
  const gearNum = shapType.substr(4);
  const d = shapeGear(w, h / 3.5, parseInt(gearNum));
  return createPath(d, ctx, `rotate(20,${(3 / 7) * h},${(3 / 7) * h})`);
}
