import { getTextByPathList } from "../object";
import { genShape } from "../shape";

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
 * @param node - Shape node (p:sp) containing shape data
 * @param pNode - Parent node for context
 * @param warpObj - Warp object containing slide resources, layout/master tables
 * @param source - Source context (e.g., "slideLayoutBg", "slideMasterBg", "diagramBg")
 * @param sType - Shape type context
 * @param slideFactor - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeFactor - Font size scaling factor
 * @param rtlLangsArray - Array of RTL language codes
 * @param isFirstBr - Mutable object tracking first line break state
 * @returns HTML string for the shape
 */
export function processSpNode(
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

  const nodeRecord = node as Record<string, unknown>;
  const warpRecord = warpObj as Record<string, unknown>;
  const id = getTextByPathList<string | number>(nodeRecord, ["p:nvSpPr", "p:cNvPr", "attrs", "id"]);
  const name = getTextByPathList<string>(nodeRecord, ["p:nvSpPr", "p:cNvPr", "attrs", "name"]);
  const idx = getTextByPathList<string | number>(nodeRecord, [
    "p:nvSpPr",
    "p:nvPr",
    "p:ph",
    "attrs",
    "idx",
  ]);
  let type = getTextByPathList<string>(nodeRecord, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
  const order = getTextByPathList<string | number>(nodeRecord, ["attrs", "order"]);
  let isUserDrawnBg;
  if (source === "slideLayoutBg" || source === "slideMasterBg") {
    const userDrawn = getTextByPathList<string>(nodeRecord, [
      "p:nvSpPr",
      "p:nvPr",
      "attrs",
      "userDrawn",
    ]);
    if (userDrawn === "1") {
      isUserDrawnBg = true;
    } else {
      isUserDrawnBg = false;
    }
  }
  let slideLayoutSpNode = undefined;
  let slideMasterSpNode = undefined;

  const slideLayoutTables = warpRecord["slideLayoutTables"] as Record<string, unknown>;
  const slideMasterTables = warpRecord["slideMasterTables"] as Record<string, unknown>;
  if (idx !== undefined) {
    slideLayoutSpNode = (slideLayoutTables["idxTable"] as Record<string | number, unknown>)[idx];
    if (type !== undefined) {
      slideMasterSpNode = (slideMasterTables["typeTable"] as Record<string, unknown>)[type];
    } else {
      slideMasterSpNode = (slideMasterTables["idxTable"] as Record<string | number, unknown>)[idx];
    }
  } else {
    if (type !== undefined) {
      slideLayoutSpNode = (slideLayoutTables["typeTable"] as Record<string, unknown>)[type];
      slideMasterSpNode = (slideMasterTables["typeTable"] as Record<string, unknown>)[type];
    }
  }

  if (type === undefined) {
    const txBoxVal = getTextByPathList<string>(nodeRecord, [
      "p:nvSpPr",
      "p:cNvSpPr",
      "attrs",
      "txBox",
    ]);
    if (txBoxVal === "1") {
      type = "textBox";
    }
  }
  if (type === undefined) {
    type = getTextByPathList<string>(slideLayoutSpNode, [
      "p:nvSpPr",
      "p:nvPr",
      "p:ph",
      "attrs",
      "type",
    ]);
    if (type === undefined) {
      //type = getTextByPathList(slideMasterSpNode, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
      if (source === "diagramBg") {
        type = "diagram";
      } else {
        type = "obj"; //default type
      }
    }
  }
  //console.log("processSpNode type:", type, "idx:", idx);
  return genShape(
    node,
    pNode,
    slideLayoutSpNode,
    slideMasterSpNode,
    id,
    name,
    idx,
    type,
    order,
    warpObj,
    isUserDrawnBg,
    sType,
    source,
    slideFactor,
    styleTable,
    fontSizeFactor,
    rtlLangsArray,
    isFirstBr
  );
}
