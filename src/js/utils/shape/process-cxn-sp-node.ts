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
 * @param genShape - The genShape function to delegate rendering to
 * @returns HTML string for the connection shape
 */
export function processCxnSpNode(
    node: any,
    pNode: any,
    warpObj: any,
    source: any,
    sType: any,
    genShape: any
): string {
    var id = node["p:nvCxnSpPr"]["p:cNvPr"]["attrs"]["id"];
    var name = node["p:nvCxnSpPr"]["p:cNvPr"]["attrs"]["name"];
    var idx = (node["p:nvCxnSpPr"]["p:nvPr"]["p:ph"] === undefined) ? undefined : node["p:nvSpPr"]["p:nvPr"]["p:ph"]["attrs"]["idx"];
    var type = (node["p:nvCxnSpPr"]["p:nvPr"]["p:ph"] === undefined) ? undefined : node["p:nvSpPr"]["p:nvPr"]["p:ph"]["attrs"]["type"];
    // <p:cNvCxnSpPr>(<p:cNvCxnSpPr>, <a:endCxn>)
    var order = node["attrs"]["order"];

    return genShape(node, pNode, undefined, undefined, id, name, idx, type, order, warpObj, undefined, sType, source);
}
