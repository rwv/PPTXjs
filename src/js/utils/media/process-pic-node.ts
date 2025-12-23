import { getTextByPathList } from "../object";
import { getPosition } from "../layout/get-position";
import { getSize } from "../layout/get-size";
import { angleToDegrees } from "../layout";
import { extractFileExtension } from "./extract-file-extension";
import { isVideoLink } from "./is-video-link";
import { getMimeType } from "./get-mime-type";
import { base64ArrayBuffer } from "./base64-array-buffer";
import { escapeHtml } from "../string";

/**
 * Process picture/video/audio node and generate HTML
 *
 * @param node - Picture node from PPTX
 * @param warpObj - Warp object containing slide resources and zip
 * @param source - Source type (slideMasterBg, slideLayoutBg, etc.)
 * @param sType - Shape type
 * @param slideFactor - EMU to pixel conversion factor
 * @param settings - Settings object containing mediaProcess flag
 * @returns HTML string for the picture/video/audio element
 */
export function processPicNode(
  node: any,
  warpObj: any,
  source: any,
  sType: any,
  slideFactor: number,
  settings: any
): string {
  //console.log("processPicNode node:", node, "source:", source, "sType:", sType, "warpObj;", warpObj);
  let rtrnData = "";
  let mediaPicFlag = false;
  const order = node["attrs"]["order"];

  const rid = node["p:blipFill"]["a:blip"]["attrs"]["r:embed"];
  let resObj;
  if (source == "slideMasterBg") {
    resObj = warpObj["masterResObj"];
  } else if (source == "slideLayoutBg") {
    resObj = warpObj["layoutResObj"];
  } else {
    //imgName = warpObj["slideResObj"][rid]["target"];
    resObj = warpObj["slideResObj"];
  }
  const imgName = resObj[rid]["target"];

  //console.log("processPicNode imgName:", imgName);
  const imgFileExt = extractFileExtension(imgName).toLowerCase();
  const zip = warpObj["zip"];
  const imgArrayBuffer = zip.file(imgName).asArrayBuffer();
  let mimeType = "";
  let xfrmNode = node["p:spPr"]["a:xfrm"];
  if (xfrmNode === undefined) {
    const idx = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "p:ph", "attrs", "idx"]);
    const type = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "p:ph", "attrs", "type"]);
    if (idx !== undefined) {
      xfrmNode = getTextByPathList(warpObj["slideLayoutTables"], [
        "idxTable",
        idx,
        "p:spPr",
        "a:xfrm",
      ]);
    }
  }
  ///////////////////////////////////////Amir//////////////////////////////
  let rotate = 0;
  const rotateNode = getTextByPathList(node, ["p:spPr", "a:xfrm", "attrs", "rot"]);
  if (rotateNode !== undefined) {
    rotate = angleToDegrees(rotateNode);
  }
  //video
  const vdoNode = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "a:videoFile"]);
  let vdoRid,
    vdoFile,
    vdoFileExt,
    vdoMimeType,
    uInt8Array,
    blob,
    vdoBlob,
    mediaSupportFlag = false,
    isVdeoLink = false;
  const mediaProcess = settings.mediaProcess;
  // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
  if ((vdoNode !== undefined) & mediaProcess) {
    vdoRid = vdoNode["attrs"]["r:link"];
    vdoFile = resObj[vdoRid]["target"];
    const checkIfLink = isVideoLink(vdoFile);
    if (checkIfLink) {
      vdoFile = escapeHtml(vdoFile);
      //vdoBlob = vdoFile;
      isVdeoLink = true;
      mediaSupportFlag = true;
      mediaPicFlag = true;
    } else {
      vdoFileExt = extractFileExtension(vdoFile).toLowerCase();
      if (vdoFileExt == "mp4" || vdoFileExt == "webm" || vdoFileExt == "ogg") {
        uInt8Array = zip.file(vdoFile).asArrayBuffer();
        vdoMimeType = getMimeType(vdoFileExt);
        blob = new Blob([uInt8Array], {
          type: vdoMimeType,
        });
        vdoBlob = URL.createObjectURL(blob);
        mediaSupportFlag = true;
        mediaPicFlag = true;
      }
    }
  }
  //Audio
  const audioNode = getTextByPathList(node, ["p:nvPicPr", "p:nvPr", "a:audioFile"]);
  let audioRid, audioFile, audioFileExt, audioMimeType, uInt8ArrayAudio, blobAudio, audioBlob;
  let audioPlayerFlag = false;
  let audioObjc;
  // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
  if ((audioNode !== undefined) & mediaProcess) {
    audioRid = audioNode["attrs"]["r:link"];
    audioFile = resObj[audioRid]["target"];
    audioFileExt = extractFileExtension(audioFile).toLowerCase();
    if (audioFileExt == "mp3" || audioFileExt == "wav" || audioFileExt == "ogg") {
      uInt8ArrayAudio = zip.file(audioFile).asArrayBuffer();
      blobAudio = new Blob([uInt8ArrayAudio]);
      audioBlob = URL.createObjectURL(blobAudio);
      const cx = parseInt(xfrmNode["a:ext"]["attrs"]["cx"]) * 20;
      const cy = xfrmNode["a:ext"]["attrs"]["cy"];
      const x = parseInt(xfrmNode["a:off"]["attrs"]["x"]) / 2.5;
      const y = xfrmNode["a:off"]["attrs"]["y"];
      audioObjc = {
        "a:ext": {
          attrs: {
            cx: cx,
            cy: cy,
          },
        },
        "a:off": {
          attrs: {
            x: x,
            y: y,
          },
        },
      };
      audioPlayerFlag = true;
      mediaSupportFlag = true;
      mediaPicFlag = true;
    }
  }
  //console.log(node)
  //////////////////////////////////////////////////////////////////////////
  mimeType = getMimeType(imgFileExt);
  rtrnData =
    "<div class='block content' style='" +
    (mediaProcess && audioPlayerFlag
      ? getPosition(audioObjc, node, undefined, undefined, undefined, slideFactor)
      : getPosition(xfrmNode, node, undefined, undefined, undefined, slideFactor)) +
    (mediaProcess && audioPlayerFlag
      ? getSize(audioObjc, undefined, undefined, slideFactor)
      : getSize(xfrmNode, undefined, undefined, slideFactor)) +
    " z-index: " +
    order +
    ";" +
    "transform: rotate(" +
    rotate +
    "deg);'>";
  if ((vdoNode === undefined && audioNode === undefined) || !mediaProcess || !mediaSupportFlag) {
    rtrnData +=
      "<img src='data:" +
      mimeType +
      ";base64," +
      base64ArrayBuffer(imgArrayBuffer) +
      "' style='width: 100%; height: 100%'/>";
  } else if (
    (vdoNode !== undefined || audioNode !== undefined) &&
    mediaProcess &&
    mediaSupportFlag
  ) {
    if (vdoNode !== undefined && !isVdeoLink) {
      rtrnData +=
        "<video  src='" +
        vdoBlob +
        "' controls style='width: 100%; height: 100%'>Your browser does not support the video tag.</video>";
    } else if (vdoNode !== undefined && isVdeoLink) {
      rtrnData +=
        "<iframe   src='" + vdoFile + "' controls style='width: 100%; height: 100%'></iframe >";
    }
    if (audioNode !== undefined) {
      rtrnData += '<audio id="audio_player" controls ><source src="' + audioBlob + '"></audio>';
      //'<button onclick="audio_player.play()">Play</button>'+
      //'<button onclick="audio_player.pause()">Pause</button>';
    }
  }
  if (!mediaSupportFlag && mediaPicFlag) {
    rtrnData +=
      "<span style='color:red;font-size:40px;position: absolute;'>This media file Not supported by HTML5</span>";
  }
  if ((vdoNode !== undefined || audioNode !== undefined) && !mediaProcess && mediaSupportFlag) {
    console.log("Founded supported media file but media process disabled (mediaProcess=false)");
  }
  rtrnData += "</div>";
  //console.log(rtrnData)
  return rtrnData;
}
