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
  node: unknown,
  pNode: unknown,
  warpObj: unknown,
  source: string,
  sType: string,
  slideFactor: number,
  styleTable: unknown,
  fontSizeFactor: number,
  rtlLangsArray: string[],
  isFirstBr: { value: boolean }
): string {
  const nodeRecord = node as Record<string, unknown>;
  const nvCxnSpPr = nodeRecord["p:nvCxnSpPr"] as Record<string, unknown>;
  const cNvPrAttrs = (nvCxnSpPr["p:cNvPr"] as Record<string, unknown>)["attrs"] as Record<
    string,
    string | number
  >;
  const id = cNvPrAttrs["id"];
  const name = cNvPrAttrs["name"] as string | undefined;
  const phNode = (nvCxnSpPr["p:nvPr"] as Record<string, unknown>)["p:ph"];
  let idx: string | number | undefined;
  let type: string | undefined;
  if (phNode !== undefined) {
    const spNvPr = nodeRecord["p:nvSpPr"] as Record<string, unknown>;
    const spNvPrPhAttrs = (
      (spNvPr["p:nvPr"] as Record<string, unknown>)["p:ph"] as Record<string, unknown>
    )["attrs"] as Record<string, string | number>;
    idx = spNvPrPhAttrs["idx"];
    type = spNvPrPhAttrs["type"] as string | undefined;
  }
  // <p:cNvCxnSpPr>(<p:cNvCxnSpPr>, <a:endCxn>)
  const order = (nodeRecord["attrs"] as Record<string, string | number>)["order"];

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
