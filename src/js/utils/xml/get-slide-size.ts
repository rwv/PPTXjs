import { readXmlFile } from "./read-xml-file";
import type { PptxArchive } from "../../archive/pptx-archive";

/**
 * Get slide size from presentation.xml and read default text style
 *
 * @param archive - PPTX archive instance
 * @param slideFactor - EMU to pixel conversion factor
 * @param settings - Settings object containing incSlide dimensions
 * @returns Object containing width, height, appVersion, and defaultTextStyle
 */
export async function getSlideSizeAndSetDefaultTextStyle(
  archive: PptxArchive,
  slideFactor: number,
  settings: { incSlide: { width: number; height: number } }
): Promise<{ width: number; height: number; appVersion: number; defaultTextStyle: unknown }> {
  //get app version
  const app = await readXmlFile(archive, "docProps/app.xml");
  if (!app) {
    throw new Error("Missing docProps/app.xml in PPTX.");
  }
  const appVersionString = app["Properties"]["AppVersion"];
  const appVersion = parseInt(appVersionString);
  console.log("create by Office PowerPoint app verssion: ", appVersionString);

  //get slide dimensions
  const content = await readXmlFile(archive, "ppt/presentation.xml");
  if (!content) {
    throw new Error("Missing ppt/presentation.xml in PPTX.");
  }
  const slideSizeAttributes = content["p:presentation"]["p:sldSz"]["attrs"];
  const slideSizeWidth = parseInt(slideSizeAttributes["cx"]);
  const slideSizeHeight = parseInt(slideSizeAttributes["cy"]);
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
  // var scaleLoc = getTextByPathList(viewProps, ["p:viewPr", "p:slideViewPr", "p:cSldViewPr", "p:cViewPr","p:scale"]);
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

  const defaultTextStyle = content["p:presentation"]["p:defaultTextStyle"];

  const slideWidth = (slideSizeWidth * slideFactor + settings.incSlide.width) | 0; // * scaleX;//parseInt(slideSizeAttributes["cx"]) * 96 / 914400;
  const slideHeight = (slideSizeHeight * slideFactor + settings.incSlide.height) | 0; // * scaleY;//parseInt(slideSizeAttributes["cy"]) * 96 / 914400;

  return {
    width: slideWidth,
    height: slideHeight,
    appVersion,
    defaultTextStyle,
  };
}
