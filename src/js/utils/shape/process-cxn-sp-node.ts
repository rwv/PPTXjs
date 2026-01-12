import { genShape } from "./gen-shape";

/**
 * Process connection shape node and delegate to genShape
 *
 * Connection shapes are connector lines between shapes in PPTX.
 * This function extracts metadata and passes it to genShape for rendering.
 *
 * @param connectionNode - Connection shape node from PPTX
 * @param parentNode - Parent node
 * @param warpContext - Warp object containing slide resources
 * @param sourceType - Source type (slide, slideLayout, slideMaster, etc.)
 * @param shapeType - Shape type
 * @param emuToPx - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeScale - Font size scaling factor
 * @param rtlLanguages - Array of RTL language codes
 * @param isFirstLineBreak - Mutable object tracking first line break state
 * @returns HTML string for the connection shape
 */
type ProcessCxnSpNodeOptions = {
  spNode: Record<string, unknown>;
  parentNodes: unknown;
  warpContext: unknown;
  sourceType: string;
  shapeType: string;
  emuToPx: number;
  styleTable: unknown;
  fontSizeScale: number;
  rtlLanguages: string[];
  firstLineBreak: { value: boolean };
};

export async function processCxnSpNode({
  spNode,
  parentNodes,
  warpContext,
  sourceType,
  shapeType,
  emuToPx,
  styleTable,
  fontSizeScale,
  rtlLanguages,
  firstLineBreak,
}: ProcessCxnSpNodeOptions): Promise<string> {
  const connectionNodeRecord = spNode as Record<string, unknown>;
  const nonVisualConnectionProps = connectionNodeRecord["p:nvCxnSpPr"] as Record<string, unknown>;
  const connectionPropsAttrs = (nonVisualConnectionProps["p:cNvPr"] as Record<string, unknown>)[
    "attrs"
  ] as Record<string, string | number>;
  const shapeId = connectionPropsAttrs["id"];
  const shapeName = connectionPropsAttrs["name"] as string | undefined;
  const placeholderNode = (nonVisualConnectionProps["p:nvPr"] as Record<string, unknown>)["p:ph"];
  let placeholderIndex: string | number | undefined;
  let placeholderType: string | undefined;
  if (placeholderNode !== undefined) {
    const shapeNonVisualProps = connectionNodeRecord["p:nvSpPr"] as Record<string, unknown>;
    const placeholderAttrs = (
      (shapeNonVisualProps["p:nvPr"] as Record<string, unknown>)["p:ph"] as Record<string, unknown>
    )["attrs"] as Record<string, string | number>;
    placeholderIndex = placeholderAttrs["idx"];
    placeholderType = placeholderAttrs["type"] as string | undefined;
  }
  // <p:cNvCxnSpPr>(<p:cNvCxnSpPr>, <a:endCxn>)
  const zIndexOrder = (connectionNodeRecord["attrs"] as Record<string, string | number>)["order"];

  return await genShape({
    shapeNode: connectionNodeRecord,
    parentNode: parentNodes,
    layoutShapeNode: undefined,
    masterShapeNode: undefined,
    shapeId,
    shapeName,
    placeholderIndex,
    placeholderType,
    zIndexOrder,
    warpContext,
    isUserDrawnBackground: undefined,
    shapeType,
    sourceType,
    emuToPx,
    styleTable,
    fontSizeScale,
    rtlLanguages,
    firstLineBreak,
  });
}
