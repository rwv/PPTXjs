import { readXmlFile } from "./read-xml-file";
import type { PptxArchive } from "../../archive/pptx-archive";
import type { XmlNode } from "../../types/pptx-xml";

type GetSlideSizeOptions = {
  archive: PptxArchive;
  slideFactor: number;
  settings: { incSlide: { width: number; height: number } };
};

/**
 * Get slide size from presentation.xml and read default text style
 *
 * @param archive - PPTX archive instance
 * @param slideFactor - EMU to pixel conversion factor
 * @param settings - Settings object containing incSlide dimensions
 * @returns Object containing width, height, appVersion, and defaultTextStyle
 */
export async function getSlideSizeAndSetDefaultTextStyle({
  archive,
  slideFactor,
  settings,
}: GetSlideSizeOptions): Promise<{
  width: number;
  height: number;
  appVersion: number;
  defaultTextStyle: XmlNode | undefined;
}> {
  //get app version
  const app = await readXmlFile({ archive, filename: "docProps/app.xml" });
  if (!app) {
    throw new Error("Missing docProps/app.xml in PPTX.");
  }
  const appVersionString = app["Properties"]?.["AppVersion"];
  const appVersionParsed = Number.parseInt(String(appVersionString ?? ""), 10);
  const appVersion = Number.isFinite(appVersionParsed) ? appVersionParsed : 0;
  console.log("create by Office PowerPoint app verssion: ", appVersionString ?? "unknown");

  //get slide dimensions
  const content = await readXmlFile({ archive, filename: "ppt/presentation.xml" });
  if (!content) {
    throw new Error("Missing ppt/presentation.xml in PPTX.");
  }
  const presentation = content["p:presentation"];
  if (!presentation || typeof presentation !== "object") {
    throw new Error("Missing presentation info in ppt/presentation.xml.");
  }
  const rawSlideSizeNode = (presentation as Record<string, unknown>)["p:sldSz"];
  const slideSizeNode =
    rawSlideSizeNode && typeof rawSlideSizeNode === "object"
      ? (rawSlideSizeNode as { attrs?: Record<string, unknown> })
      : undefined;
  const slideSizeAttributes = slideSizeNode?.attrs;
  if (!slideSizeAttributes) {
    throw new Error("Missing slide size info in ppt/presentation.xml.");
  }
  const slideSizeWidth = Number.parseInt(String(slideSizeAttributes["cx"] ?? ""), 10);
  const slideSizeHeight = Number.parseInt(String(slideSizeAttributes["cy"] ?? ""), 10);
  if (!Number.isFinite(slideSizeWidth) || !Number.isFinite(slideSizeHeight)) {
    throw new Error("Invalid slide size values in ppt/presentation.xml.");
  }
  const slideSizeType = slideSizeAttributes["type"];
  console.log("Presentation size type: ", slideSizeType);

  //1 inches  = 96px = 2.54cm
  // 1 EMU = 1 / 914400 inch
  // Pixel = EMUs * Resolution / 914400;  (Resolution = 96)
  //var standardHeight = 6858000;
  //console.log("slideFactor: ", slideFactor, "standardHeight:", standardHeight, (standardHeight - slideSizeHeight) / standardHeight)

  //slideFactor = (96 * (1 + ((standardHeight - slideSizeHeight) / standardHeight))) / 914400 ;

  //slideFactor = slideFactor + slideSizeHeight*((standardHeight - slideSizeHeight) / standardHeight) ;

  //var ration = slideSizeWidth / slideSizeHeight;

  //Scale
  // var viewProps = readXmlFile(zip, "ppt/viewProps.xml");
  // var scaleLoc = getTextByPathList({ node: viewProps, path: ["p:viewPr", "p:slideViewPr", "p:cSldViewPr", "p:cViewPr","p:scale"] });
  // var scaleXnodes, scaleX = 1, scaleYnode, scaleY = 1;
  // if (scaleLoc !== undefined){
  //     scaleXnodes = scaleLoc["a:sx"]["attrs"];
  //     var scaleXnodesN = scaleXnodes["n"];
  //     var scaleXnodesD = scaleXnodes["d"];
  //     if (scaleXnodesN !== undefined && scaleXnodesD !== undefined && scaleXnodesN != 0){
  //         scaleX = parseInt(scaleXnodesD)/parseInt(scaleXnodesN);
  //     }
  //     scaleYnode = scaleLoc["a:sy"]["attrs"];
  //     var scaleYnodeN = scaleYnode["n"];
  //     var scaleYnodeD = scaleYnode["d"];
  //     if (scaleYnodeN !== undefined && scaleYnodeD !== undefined && scaleYnodeN != 0) {
  //         scaleY = parseInt(scaleYnodeD) / parseInt(scaleYnodeN) ;
  //     }

  // }
  //console.log("scaleX: ", scaleX, "scaleY:", scaleY)
  //slideFactor = slideFactor * scaleX;

  const defaultTextStyle = (presentation as XmlNode)["p:defaultTextStyle"] as XmlNode | undefined;

  const slideWidth = (slideSizeWidth * slideFactor + settings.incSlide.width) | 0; // * scaleX;//parseInt(slideSizeAttributes["cx"]) * 96 / 914400;
  const slideHeight = (slideSizeHeight * slideFactor + settings.incSlide.height) | 0; // * scaleY;//parseInt(slideSizeAttributes["cy"]) * 96 / 914400;

  return {
    width: slideWidth,
    height: slideHeight,
    appVersion,
    defaultTextStyle,
  };
}
