import { readXmlFile } from "./read-xml-file";
import type { PptxArchive } from "../../archive/pptx-archive";

type GetContentTypesOptions = {
  archive: PptxArchive;
};

/**
 * Get content types from PPTX [Content_Types].xml
 *
 * Extracts the locations of slides and slide layouts from the content types XML file
 *
 * @param archive - PPTX archive instance
 * @returns Object containing arrays of slide and slideLayout file paths
 */
export async function getContentTypes({ archive }: GetContentTypesOptions): Promise<{
  slides: string[];
  slideLayouts: string[];
}> {
  const contentTypesData = await readXmlFile({ archive, filename: "[Content_Types].xml" });
  if (!contentTypesData) {
    return { slides: [], slideLayouts: [] };
  }

  const overrideEntries = contentTypesData["Types"]?.["Override"];
  const overrideList = Array.isArray(overrideEntries)
    ? overrideEntries
    : overrideEntries
      ? [overrideEntries]
      : [];
  const slidePaths: string[] = [];
  const slideLayoutPaths: string[] = [];
  for (const overrideEntry of overrideList) {
    const attrs =
      overrideEntry && typeof overrideEntry === "object" ? overrideEntry["attrs"] : undefined;
    const contentType = typeof attrs?.["ContentType"] === "string" ? attrs["ContentType"] : "";
    const partNameRaw = typeof attrs?.["PartName"] === "string" ? attrs["PartName"] : "";
    if (!partNameRaw) {
      continue;
    }
    const partName = partNameRaw.startsWith("/") ? partNameRaw.slice(1) : partNameRaw;
    switch (contentType) {
      case "application/vnd.openxmlformats-officedocument.presentationml.slide+xml":
        slidePaths.push(partName);
        break;
      case "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml":
        slideLayoutPaths.push(partName);
        break;
      default:
    }
  }
  return {
    slides: slidePaths,
    slideLayouts: slideLayoutPaths,
  };
}
