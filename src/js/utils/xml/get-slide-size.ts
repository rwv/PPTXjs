import { readXmlFile } from "./read-xml-file";
import type { JsZip } from "../../types/jszip";

/**
 * Get slide size from presentation.xml and read default text style
 *
 * @param zip - JSZip instance containing the PPTX file
 * @param slideFactor - EMU to pixel conversion factor
 * @param settings - Settings object containing incSlide dimensions
 * @returns Object containing width, height, appVersion, and defaultTextStyle
 */
export function getSlideSizeAndSetDefaultTextStyle(zip: JsZip, slideFactor: number, settings: any): { width: number; height: number; appVersion: number; defaultTextStyle: any } {
    //get app version
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    var app = readXmlFile(zip, "docProps/app.xml");
    var app_verssion_str = app["Properties"]["AppVersion"]
    var app_verssion = parseInt(app_verssion_str);
    console.log("create by Office PowerPoint app verssion: ", app_verssion_str)

    //get slide dimensions
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    var content = readXmlFile(zip, "ppt/presentation.xml");
    var sldSzAttrs = content["p:presentation"]["p:sldSz"]["attrs"];
    var sldSzWidth = parseInt(sldSzAttrs["cx"]);
    var sldSzHeight = parseInt(sldSzAttrs["cy"]);
    var sldSzType = sldSzAttrs["type"];
    console.log("Presentation size type: ", sldSzType)

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

    var defaultTextStyle = content["p:presentation"]["p:defaultTextStyle"];

    var slideWidth = sldSzWidth * slideFactor + settings.incSlide.width|0;// * scaleX;//parseInt(sldSzAttrs["cx"]) * 96 / 914400;
    var slideHeight = sldSzHeight * slideFactor + settings.incSlide.height|0;// * scaleY;//parseInt(sldSzAttrs["cy"]) * 96 / 914400;

    return {
        "width": slideWidth,
        "height": slideHeight,
        "appVersion": app_verssion,
        "defaultTextStyle": defaultTextStyle
    };
}
