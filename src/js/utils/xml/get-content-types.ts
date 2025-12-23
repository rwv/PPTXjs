import { readXmlFile } from "./read-xml-file";
import type { JsZip } from "../../types/jszip";

/**
 * Get content types from PPTX [Content_Types].xml
 *
 * Extracts the locations of slides and slide layouts from the content types XML file
 *
 * @param zip - JSZip instance containing the PPTX file
 * @returns Object containing arrays of slide and slideLayout file paths
 */
export function getContentTypes(zip: JsZip) {
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  const ContentTypesJson = readXmlFile(zip, "[Content_Types].xml");

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
