import { readXmlFile } from "./read-xml-file";
import type { PptxArchive } from "../../archive/pptx-archive";

/**
 * Get content types from PPTX [Content_Types].xml
 *
 * Extracts the locations of slides and slide layouts from the content types XML file
 *
 * @param archive - PPTX archive instance
 * @returns Object containing arrays of slide and slideLayout file paths
 */
export async function getContentTypes(archive: PptxArchive): Promise<{
  slides: string[];
  slideLayouts: string[];
}> {
  const contentTypesData = await readXmlFile(archive, "[Content_Types].xml");
  if (!contentTypesData) {
    return { slides: [], slideLayouts: [] };
  }

  const overrideEntries = contentTypesData["Types"]["Override"];
  const slidePaths: string[] = [];
  const slideLayoutPaths: string[] = [];
  for (const overrideEntry of overrideEntries) {
    switch (overrideEntry["attrs"]["ContentType"]) {
      case "application/vnd.openxmlformats-officedocument.presentationml.slide+xml":
        slidePaths.push(overrideEntry["attrs"]["PartName"].substr(1));
        break;
      case "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml":
        slideLayoutPaths.push(overrideEntry["attrs"]["PartName"].substr(1));
        break;
      default:
    }
  }
  return {
    slides: slidePaths,
    slideLayouts: slideLayoutPaths,
  };
}
