/**
 * Miscellaneous symbol shape rendering functions.
 *
 * Handles misc shapes:
 * - moon, corner, diagStripe, gear6, gear9
 * - plus, teardrop, plaque, sun
 * - heart, lightningBolt, cube, bevel, foldedCorner
 * - cloud, cloudCallout, smileyFace
 */

import type { MiscSymbolContext } from "./misc-symbols/types";
import {
  renderCorner,
  renderDiagStripe,
  renderGear,
  renderMoon,
  renderPlaque,
  renderPlus,
  renderSun,
  renderTeardrop,
} from "./misc-symbols/basic";
import {
  renderBevel,
  renderCube,
  renderFoldedCorner,
  renderHeart,
  renderLightningBolt,
} from "./misc-symbols/special";
import { renderCloud, renderSmileyFace } from "./misc-symbols/cloud";

export type { MiscSymbolContext } from "./misc-symbols/types";

/**
 * List of misc symbol shape types handled by this module
 */
export const MISC_SYMBOL_TYPES = [
  "moon",
  "corner",
  "diagStripe",
  "gear6",
  "gear9",
  "plus",
  "teardrop",
  "plaque",
  "sun",
  "heart",
  "lightningBolt",
  "cube",
  "bevel",
  "foldedCorner",
  "cloud",
  "cloudCallout",
  "smileyFace",
] as const;

// =============================================================================
// Shape Registry
// =============================================================================

const MISC_SYMBOL_RENDERERS: Record<string, (ctx: MiscSymbolContext, shapType: string) => string> =
  {
    moon: (ctx) => renderMoon(ctx),
    corner: (ctx) => renderCorner(ctx),
    diagStripe: (ctx) => renderDiagStripe(ctx),
    gear6: renderGear,
    gear9: renderGear,
    plus: (ctx) => renderPlus(ctx),
    teardrop: (ctx) => renderTeardrop(ctx),
    plaque: (ctx) => renderPlaque(ctx),
    sun: (ctx) => renderSun(ctx),
    heart: (ctx) => renderHeart(ctx),
    lightningBolt: (ctx) => renderLightningBolt(ctx),
    cube: (ctx) => renderCube(ctx),
    bevel: (ctx) => renderBevel(ctx),
    foldedCorner: (ctx) => renderFoldedCorner(ctx),
    cloud: (ctx) => renderCloud(ctx),
    cloudCallout: (ctx) => renderCloud(ctx),
    smileyFace: (ctx) => renderSmileyFace(ctx),
  };

export function isMiscSymbolShape(shapType: string): boolean {
  return shapType in MISC_SYMBOL_RENDERERS;
}

export function renderMiscSymbolShape(shapType: string, ctx: MiscSymbolContext): string {
  const renderer = MISC_SYMBOL_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
