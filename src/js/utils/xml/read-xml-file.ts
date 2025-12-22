import type { JsZip } from "../../types/jszip";
import { tXml } from "../vendors/txml";

/**
 * Reads and parses an XML file from a PPTX archive
 *
 * @param zip - JSZip instance containing the PPTX files
 * @param filename - Path to the XML file within the archive
 * @param isSlideContent - Whether this is slide content (affects CDATA handling)
 * @param appVersion - Office application version (only used when isSlideContent is true)
 * @returns Parsed XML data object or null if file doesn't exist
 */
export function readXmlFile(
  zip: JsZip,
  filename: string,
  isSlideContent?: boolean,
  appVersion?: number
): any | null {
  try {
    const zipFile = zip.file(filename);
    if (!zipFile) {
      return null;
    }

    let fileContent = zipFile.asText();

    if (isSlideContent && appVersion !== undefined && appVersion <= 12) {
      // Office 2007 and earlier
      // Remove "<![CDATA[ ... ]]>" tag
      fileContent = fileContent.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");
    }

    const xmlData = tXml(fileContent, { simplify: 1 });

    if (xmlData["?xml"] !== undefined) {
      return xmlData["?xml"];
    } else {
      return xmlData;
    }
  } catch (e) {
    // console.log("error readXmlFile: the file '", filename, "' not exit")
    return null;
  }
}
