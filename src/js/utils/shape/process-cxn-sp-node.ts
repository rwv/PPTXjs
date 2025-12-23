import type { PptxNode, WarpObject, SlideFactor, FontSizeFactor } from "../../types";
import { genShape } from "./gen-shape";

/**
 * Process connection shape node and delegate to genShape
 *
 * Connection shapes are connector lines between shapes in PPTX.
 * This function extracts metadata and passes it to genShape for rendering.
 *
 * @param node - Connection shape node from PPTX
 * @param pNode - Parent node
 * @param warpObj - Warp object containing slide resources
 * @param source - Source type (slide, slideLayout, slideMaster, etc.)
 * @param sType - Shape type
 * @param slideFactor - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeFactor - Font size scaling factor
 * @param rtlLangsArray - Array of RTL language codes
 * @param isFirstBr - Mutable object tracking first line break state
 * @returns HTML string for the connection shape
 */
export function processCxnSpNode(
  node: PptxNode,
  pNode: PptxNode,
  warpObj: WarpObject,
  source: any,
  sType: any,
  slideFactor: SlideFactor,
  styleTable: any,
  fontSizeFactor: FontSizeFactor,
  rtlLangsArray: string[],
  isFirstBr: { value: boolean }
): string {
  const id = node["p:nvCxnSpPr"]["p:cNvPr"]["attrs"]["id"];
  const name = node["p:nvCxnSpPr"]["p:cNvPr"]["attrs"]["name"];
  const idx =
    node["p:nvCxnSpPr"]["p:nvPr"]["p:ph"] === undefined
      ? undefined
      : node["p:nvSpPr"]["p:nvPr"]["p:ph"]["attrs"]["idx"];
  const type =
    node["p:nvCxnSpPr"]["p:nvPr"]["p:ph"] === undefined
      ? undefined
      : node["p:nvSpPr"]["p:nvPr"]["p:ph"]["attrs"]["type"];
  // <p:cNvCxnSpPr>(<p:cNvCxnSpPr>, <a:endCxn>)
  const order = node["attrs"]["order"];

  return genShape(
    node,
    pNode,
    undefined,
    undefined,
    id,
    name,
    idx,
    type,
    order,
    warpObj,
    undefined,
    sType,
    source,
    slideFactor,
    styleTable,
    fontSizeFactor,
    rtlLangsArray,
    isFirstBr
  );
}
