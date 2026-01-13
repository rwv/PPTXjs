import { getTextByPathList } from "../object";
import { genShape } from "../shape";
import type { StyleTable } from "../../types/style";
import type { WarpContext, XmlNode } from "../../types/pptx-xml";

/**
 * Process shape node (p:sp) to generate HTML
 *
 * Extracts shape metadata and properties, resolves layout/master nodes,
 * and delegates to genShape for HTML generation.
 *
 * Shape types include:
 * - Placeholder types (title, body, ctrTitle, subTitle, etc.)
 * - Text boxes (txBox="1")
 * - Diagrams (from diagram backgrounds)
 * - Generic objects (default type)
 *
 * @param shapeNode - Shape node (p:sp) containing shape data
 * @param parentNode - Parent node for context
 * @param warpContext - Warp object containing slide resources, layout/master tables
 * @param sourceType - Source context (e.g., "slideLayoutBg", "slideMasterBg", "diagramBg")
 * @param shapeType - Shape type context
 * @param emuToPx - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeScale - Font size scaling factor
 * @param rtlLanguages - Array of RTL language codes
 * @param isFirstLineBreak - Mutable object tracking first line break state
 * @returns HTML string for the shape
 */
type ProcessSpNodeOptions = {
  spNode: XmlNode;
  parentNodes: XmlNode | XmlNode[] | undefined;
  warpContext: WarpContext | Record<string, unknown>;
  sourceType: string;
  shapeType: string;
  emuToPx: number;
  styleTable: StyleTable;
  fontSizeScale: number;
  rtlLanguages: string[];
  firstLineBreak: { value: boolean };
};

export async function processSpNode({
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
}: ProcessSpNodeOptions): Promise<string> {
  /*
   *  958    <xsd:complexType name="CT_GvmlShape">
   *  959   <xsd:sequence>
   *  960     <xsd:element name="nvSpPr" type="CT_GvmlShapeNonVisual"     minOccurs="1" maxOccurs="1"/>
   *  961     <xsd:element name="spPr"   type="CT_ShapeProperties"        minOccurs="1" maxOccurs="1"/>
   *  962     <xsd:element name="txSp"   type="CT_GvmlTextShape"          minOccurs="0" maxOccurs="1"/>
   *  963     <xsd:element name="style"  type="CT_ShapeStyle"             minOccurs="0" maxOccurs="1"/>
   *  964     <xsd:element name="extLst" type="CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
   *  965   </xsd:sequence>
   *  966 </xsd:complexType>
   */

  const shapeNodeRecord = spNode;
  const context = warpContext as WarpContext;
  const shapeId = getTextByPathList<string | number>({
    node: shapeNodeRecord,
    path: ["p:nvSpPr", "p:cNvPr", "attrs", "id"],
  });
  const shapeName = getTextByPathList<string>({
    node: shapeNodeRecord,
    path: ["p:nvSpPr", "p:cNvPr", "attrs", "name"],
  });
  const placeholderIndex = getTextByPathList<string | number>({
    node: shapeNodeRecord,
    path: ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "idx"],
  });
  let placeholderType = getTextByPathList<string>({
    node: shapeNodeRecord,
    path: ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"],
  });
  const zIndexOrder = getTextByPathList<string | number>({
    node: shapeNodeRecord,
    path: ["attrs", "order"],
  });
  let isUserDrawnBackground;
  if (sourceType === "slideLayoutBg" || sourceType === "slideMasterBg") {
    const userDrawn = getTextByPathList<string>({
      node: shapeNodeRecord,
      path: ["p:nvSpPr", "p:nvPr", "attrs", "userDrawn"],
    });
    if (userDrawn === "1") {
      isUserDrawnBackground = true;
    } else {
      isUserDrawnBackground = false;
    }
  }
  let layoutShapeNode = undefined;
  let masterShapeNode = undefined;

  const slideLayoutTables = context.slideLayoutTables;
  const slideMasterTables = context.slideMasterTables;
  if (slideLayoutTables !== undefined && slideMasterTables !== undefined) {
    if (placeholderIndex !== undefined) {
      layoutShapeNode = slideLayoutTables.idxTable[placeholderIndex];
      if (placeholderType !== undefined) {
        masterShapeNode = slideMasterTables.typeTable[placeholderType];
      } else {
        masterShapeNode = slideMasterTables.idxTable[placeholderIndex];
      }
    } else if (placeholderType !== undefined) {
      layoutShapeNode = slideLayoutTables.typeTable[placeholderType];
      masterShapeNode = slideMasterTables.typeTable[placeholderType];
    }
  }

  if (placeholderType === undefined) {
    const txBoxVal = getTextByPathList<string>({
      node: shapeNodeRecord,
      path: ["p:nvSpPr", "p:cNvSpPr", "attrs", "txBox"],
    });
    if (txBoxVal === "1") {
      placeholderType = "textBox";
    }
  }
  if (placeholderType === undefined) {
    placeholderType = getTextByPathList<string>({
      node: layoutShapeNode,
      path: ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"],
    });
    if (placeholderType === undefined) {
      //placeholderType = getTextByPathList({ node: masterShapeNode, path: ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"] });
      if (sourceType === "diagramBg") {
        placeholderType = "diagram";
      } else {
        placeholderType = "obj"; //default type
      }
    }
  }
  //console.log("processSpNode type:", placeholderType, "idx:", placeholderIndex);
  return await genShape({
    shapeNode: shapeNodeRecord,
    parentNode: parentNodes,
    layoutShapeNode,
    masterShapeNode,
    shapeId,
    shapeName,
    placeholderIndex,
    placeholderType,
    zIndexOrder,
    warpContext: context,
    isUserDrawnBackground,
    shapeType,
    sourceType,
    emuToPx,
    styleTable,
    fontSizeScale,
    rtlLanguages,
    firstLineBreak,
  });
}
