import { getTextByPathList } from "../object";
import { genShape } from "./gen-shape";
import type { StyleTable } from "../../types/style";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

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
  spNode: XmlNode;
  parentNodes: XmlNode | XmlNode[] | undefined;
  warpContext: WarpContext;
  sourceType: string;
  shapeType: string;
  emuToPx: number;
  styleTable: StyleTable;
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
  const shapeId = getTextByPathList<string | number>({
    node: spNode,
    path: ["p:nvCxnSpPr", "p:cNvPr", "attrs", "id"],
  });
  const shapeName = getTextByPathList<string>({
    node: spNode,
    path: ["p:nvCxnSpPr", "p:cNvPr", "attrs", "name"],
  });
  const placeholderIndex = getTextByPathList<string | number>({
    node: spNode,
    path: ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "idx"],
  });
  const placeholderType = getTextByPathList<string>({
    node: spNode,
    path: ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"],
  });
  // <p:cNvCxnSpPr>(<p:cNvCxnSpPr>, <a:endCxn>)
  const zIndexOrder = getTextByPathList<string | number>({
    node: spNode,
    path: ["attrs", "order"],
  });

  return await genShape({
    shapeNode: spNode,
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
