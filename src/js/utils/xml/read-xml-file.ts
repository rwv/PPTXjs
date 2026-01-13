import type { PptxArchive } from "../../archive/pptx-archive";
import { tXml } from "../vendors/txml";
import type { TXmlResult } from "../vendors/txml";

type ReadXmlFileOptions = {
  archive: PptxArchive;
  filename: string;
  isSlideContent?: boolean;
  appVersion?: number;
};

/**
 * Reads and parses an XML file from a PPTX archive
 *
 * @param archive - PPTX archive instance
 * @param filename - Path to the XML file within the archive
 * @param isSlideContent - Whether this is slide content (affects CDATA handling)
 * @param appVersion - Office application version (only used when isSlideContent is true)
 * @returns Parsed XML data object or null if file doesn't exist
 */
export async function readXmlFile({
  archive,
  filename,
  isSlideContent,
  appVersion,
}: ReadXmlFileOptions): Promise<TXmlResult | null> {
  try {
    const file = await archive.file(filename);
    if (!file) {
      return null;
    }

    let fileContent = await file.text();

    if (isSlideContent && appVersion !== undefined && appVersion <= 12) {
      // Office 2007 and earlier
      // Remove "<![CDATA[ ... ]]>" tag
      fileContent = fileContent.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1");
    }

    const xmlData = tXml({ xml: fileContent, options: { simplify: 1 } });

    if (xmlData && typeof xmlData === "object" && !Array.isArray(xmlData)) {
      const xmlRecord = xmlData as Record<string, TXmlResult>;
      if (xmlRecord["?xml"] !== undefined) {
        return xmlRecord["?xml"];
      }
    }
    return xmlData;
  } catch {
    // console.log("error readXmlFile: the file '", filename, "' not exit")
    return null;
  }
}
