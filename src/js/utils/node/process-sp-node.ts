import { getTextByPathList } from "../object";

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
 * @param genShape - genShape function to delegate HTML generation to
 * @param slideFactor - EMU to pixel conversion factor
 * @param styleTable - Global CSS style table
 * @param fontSizeFactor - Font size scaling factor
 * @param rtlLangsArray - Array of RTL language codes
 * @param isFirstBr - Mutable object tracking first line break state
 * @returns HTML string for the shape
 */
export function processSpNode(
  node: any,
  pNode: any,
  warpObj: any,
  source: any,
  sType: any,
  genShape: any,
  slideFactor: number,
  styleTable: any,
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

  const id = getTextByPathList(node, ["p:nvSpPr", "p:cNvPr", "attrs", "id"]);
  const name = getTextByPathList(node, ["p:nvSpPr", "p:cNvPr", "attrs", "name"]);
  const idx =
    getTextByPathList(node, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "idx"]) === undefined
      ? undefined
      : getTextByPathList(node, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "idx"]);
  let type =
    getTextByPathList(node, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]) === undefined
      ? undefined
      : getTextByPathList(node, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
  const order = getTextByPathList(node, ["attrs", "order"]);
  let isUserDrawnBg;
  if (source == "slideLayoutBg" || source == "slideMasterBg") {
    const userDrawn = getTextByPathList(node, ["p:nvSpPr", "p:nvPr", "attrs", "userDrawn"]);
    if (userDrawn == "1") {
      isUserDrawnBg = true;
    } else {
      isUserDrawnBg = false;
    }
  }
  let slideLayoutSpNode = undefined;
  let slideMasterSpNode = undefined;

  if (idx !== undefined) {
    slideLayoutSpNode = warpObj["slideLayoutTables"]["idxTable"][idx];
    if (type !== undefined) {
      slideMasterSpNode = warpObj["slideMasterTables"]["typeTable"][type];
    } else {
      slideMasterSpNode = warpObj["slideMasterTables"]["idxTable"][idx];
    }
  } else {
    if (type !== undefined) {
      slideLayoutSpNode = warpObj["slideLayoutTables"]["typeTable"][type];
      slideMasterSpNode = warpObj["slideMasterTables"]["typeTable"][type];
    }
  }

  if (type === undefined) {
    const txBoxVal = getTextByPathList(node, ["p:nvSpPr", "p:cNvSpPr", "attrs", "txBox"]);
    if (txBoxVal === "1") {
      type = "textBox";
    }
  }
  if (type === undefined) {
    type = getTextByPathList(slideLayoutSpNode, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
    if (type === undefined) {
      //type = getTextByPathList(slideMasterSpNode, ["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"]);
      if (source == "diagramBg") {
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
