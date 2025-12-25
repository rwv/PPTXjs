/**
 * Miscellaneous symbol shape rendering module.
 *
 * Handles misc shapes:
 * - moon, corner, diagStripe, gear6, gear9
 * - plus, teardrop, plaque, sun
 * - heart, lightningBolt, cube, bevel, foldedCorner
 * - cloud, cloudCallout, smileyFace
 */

// Export shared utilities and types
export type { MiscSymbolContext } from "./shared";
export { getFillAttr, getStrokeAttrs, createPath } from "./shared";

// Export individual renderers
export { renderMoon } from "./moon";
export { renderCorner } from "./corner";
export { renderDiagStripe } from "./diag-stripe";
export { renderGear } from "./gear";
export { renderPlus } from "./plus";
export { renderTeardrop } from "./teardrop";
export { renderPlaque } from "./plaque";
export { renderSun } from "./sun";
export { renderHeart } from "./heart";
export { renderLightningBolt } from "./lightning-bolt";
export { renderCube } from "./cube";
export { renderBevel } from "./bevel";
export { renderFoldedCorner } from "./folded-corner";
export { renderCloud } from "./cloud";
export { renderSmileyFace } from "./smiley-face";

// Import for building the renderers map
import type { MiscSymbolContext } from "./shared";
import { renderMoon } from "./moon";
import { renderCorner } from "./corner";
import { renderDiagStripe } from "./diag-stripe";
import { renderGear } from "./gear";
import { renderPlus } from "./plus";
import { renderTeardrop } from "./teardrop";
import { renderPlaque } from "./plaque";
import { renderSun } from "./sun";
import { renderHeart } from "./heart";
import { renderLightningBolt } from "./lightning-bolt";
import { renderCube } from "./cube";
import { renderBevel } from "./bevel";
import { renderFoldedCorner } from "./folded-corner";
import { renderCloud } from "./cloud";
import { renderSmileyFace } from "./smiley-face";

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

/**
 * Registry mapping shape types to their render functions
 */
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

/**
 * Check if a shape type is a misc symbol shape
 */
export function isMiscSymbolShape(shapType: string): boolean {
  return shapType in MISC_SYMBOL_RENDERERS;
}

/**
 * Render a misc symbol shape
 * @returns SVG string for the shape, or empty string if not a misc symbol shape
 */
export function renderMiscSymbolShape(shapType: string, ctx: MiscSymbolContext): string {
  const renderer = MISC_SYMBOL_RENDERERS[shapType];
  return renderer ? renderer(ctx, shapType) : "";
}
