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
  const ContentTypesJson = await readXmlFile(archive, "[Content_Types].xml");
  if (!ContentTypesJson) {
    return { slides: [], slideLayouts: [] };
  }

  const subObj = ContentTypesJson["Types"]["Override"];
  const slidesLocArray = [];
  const slideLayoutsLocArray = [];
  for (let i = 0; i < subObj.length; i++) {
    switch (subObj[i]["attrs"]["ContentType"]) {
      case "application/vnd.openxmlformats-officedocument.presentationml.slide+xml":
        slidesLocArray.push(subObj[i]["attrs"]["PartName"].substr(1));
        break;
      case "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml":
        slideLayoutsLocArray.push(subObj[i]["attrs"]["PartName"].substr(1));
        break;
      default:
    }
  }
  return {
    slides: slidesLocArray,
    slideLayouts: slideLayoutsLocArray,
  };
}
