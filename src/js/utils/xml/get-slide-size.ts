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
export function getSlideSizeAndSetDefaultTextStyle(
  archive: PptxArchive,
  slideFactor: number,
  settings: any
): { width: number; height: number; appVersion: number; defaultTextStyle: any } {
  //get app version
  const app = readXmlFile(archive, "docProps/app.xml");
  const app_verssion_str = app["Properties"]["AppVersion"];
  const app_verssion = parseInt(app_verssion_str);
  console.log("create by Office PowerPoint app verssion: ", app_verssion_str);

  //get slide dimensions
  const content = readXmlFile(archive, "ppt/presentation.xml");
  const sldSzAttrs = content["p:presentation"]["p:sldSz"]["attrs"];
  const sldSzWidth = parseInt(sldSzAttrs["cx"]);
  const sldSzHeight = parseInt(sldSzAttrs["cy"]);
  const sldSzType = sldSzAttrs["type"];
  console.log("Presentation size type: ", sldSzType);

  //1 inches  = 96px = 2.54cm
  // 1 EMU = 1 / 914400 inch
  // Pixel = EMUs * Resolution / 914400;  (Resolution = 96)
  //var standardHeight = 6858000;
  //console.log("slideFactor: ", slideFactor, "standardHeight:", standardHeight, (standardHeight - sldSzHeight) / standardHeight)

  //slideFactor = (96 * (1 + ((standardHeight - sldSzHeight) / standardHeight))) / 914400 ;

  //slideFactor = slideFactor + sldSzHeight*((standardHeight - sldSzHeight) / standardHeight) ;

  //var ration = sldSzWidth / sldSzHeight;

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

  const slideWidth = (sldSzWidth * slideFactor + settings.incSlide.width) | 0; // * scaleX;//parseInt(sldSzAttrs["cx"]) * 96 / 914400;
  const slideHeight = (sldSzHeight * slideFactor + settings.incSlide.height) | 0; // * scaleY;//parseInt(sldSzAttrs["cy"]) * 96 / 914400;

  return {
    width: slideWidth,
    height: slideHeight,
    appVersion: app_verssion,
    defaultTextStyle: defaultTextStyle,
  };
}
