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

type MiscSymbolRendererOptions = {
  ctx: MiscSymbolContext;
  shapeType: string;
};

const withCtx = (renderer: (ctx: MiscSymbolContext) => string) => {
  return ({ ctx }: MiscSymbolRendererOptions) => renderer(ctx);
};

const withCtxAndShape = (
  renderer: (options: { ctx: MiscSymbolContext; shapeType: string }) => string
) => {
  return ({ ctx, shapeType }: MiscSymbolRendererOptions) => renderer({ ctx, shapeType });
};

const MISC_SYMBOL_RENDERERS: Record<string, (options: MiscSymbolRendererOptions) => string> = {
  moon: withCtx(renderMoon),
  corner: withCtx(renderCorner),
  diagStripe: withCtx(renderDiagStripe),
  gear6: withCtxAndShape(renderGear),
  gear9: withCtxAndShape(renderGear),
  plus: withCtx(renderPlus),
  teardrop: withCtx(renderTeardrop),
  plaque: withCtx(renderPlaque),
  sun: withCtx(renderSun),
  heart: withCtx(renderHeart),
  lightningBolt: withCtx(renderLightningBolt),
  cube: withCtx(renderCube),
  bevel: withCtx(renderBevel),
  foldedCorner: withCtx(renderFoldedCorner),
  cloud: withCtx(renderCloud),
  cloudCallout: withCtx(renderCloud),
  smileyFace: withCtx(renderSmileyFace),
};

type IsMiscSymbolShapeOptions = {
  shapeType: string | undefined;
};

export function isMiscSymbolShape({ shapeType }: IsMiscSymbolShapeOptions): boolean {
  return shapeType !== undefined && shapeType in MISC_SYMBOL_RENDERERS;
}

type RenderMiscSymbolShapeOptions = {
  shapeType: string;
  ctx: MiscSymbolContext;
};

export function renderMiscSymbolShape({ shapeType, ctx }: RenderMiscSymbolShapeOptions): string {
  const renderer = MISC_SYMBOL_RENDERERS[shapeType];
  return renderer ? renderer({ ctx, shapeType }) : "";
}
