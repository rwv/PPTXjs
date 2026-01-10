import { getTextByPathList } from "../object";
import { getPosition } from "../layout/get-position";
import { getSize } from "../layout/get-size";
import { angleToDegrees } from "../layout";
import { extractFileExtension } from "./extract-file-extension";
import { isVideoLink } from "./is-video-link";
import { getMimeType } from "./get-mime-type";
import { base64ArrayBuffer } from "./base64-array-buffer";
import { escapeHtml } from "../string";
import type { PptxArchive } from "../../archive/pptx-archive";

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
export async function processPicNode(
  node: unknown,
  warpObj: unknown,
  source: string,
  sType: string,
  slideFactor: number,
  settings: { mediaProcess: boolean }
): Promise<string> {
  //console.log("processPicNode node:", node, "source:", source, "sType:", sType, "warpObj;", warpObj);
  type ResourceMap = Record<string, { target: string }>;
  type WarpObj = {
    masterResObj?: ResourceMap;
    layoutResObj?: ResourceMap;
    slideResObj: ResourceMap;
    archive: PptxArchive;
    slideLayoutTables?: Record<string, unknown>;
  };
  const nodeRecord = node as Record<string, unknown>;
  const warp = warpObj as WarpObj;
  let rtrnData = "";
  let mediaPicFlag = false;
  const order = (nodeRecord["attrs"] as Record<string, string | number>)["order"];

  const blipFill = nodeRecord["p:blipFill"] as Record<string, unknown>;
  const blip = blipFill["a:blip"] as Record<string, unknown>;
  const rid = (blip["attrs"] as Record<string, string>)["r:embed"];
  let resObj: ResourceMap;
  if (source === "slideMasterBg") {
    resObj = warp.masterResObj as ResourceMap;
  } else if (source === "slideLayoutBg") {
    resObj = warp.layoutResObj as ResourceMap;
  } else {
    //imgName = warpObj["slideResObj"][rid]["target"];
    resObj = warp.slideResObj;
  }
  const imgName = resObj[rid]["target"];

  //console.log("processPicNode imgName:", imgName);
  const imgFileExt = extractFileExtension(imgName).toLowerCase();
  const archive = warp.archive;
  const imgFile = await archive.file(imgName);
  if (!imgFile) {
    throw new Error(`File not found in archive: ${imgName}`);
  }
  const imgArrayBuffer = await imgFile.arrayBuffer();
  let mimeType = "";
  const spPrNode = nodeRecord["p:spPr"] as Record<string, unknown>;
  let xfrmNode = spPrNode["a:xfrm"] as Record<string, unknown> | undefined;
  if (xfrmNode === undefined) {
    const idx = getTextByPathList<string | number>(nodeRecord, [
      "p:nvPicPr",
      "p:nvPr",
      "p:ph",
      "attrs",
      "idx",
    ]);
    if (idx !== undefined) {
      xfrmNode = getTextByPathList<Record<string, unknown>>(warp.slideLayoutTables, [
        "idxTable",
        idx,
        "p:spPr",
        "a:xfrm",
      ]);
    }
  }
  ///////////////////////////////////////Amir//////////////////////////////
  let rotate = 0;
  const rotateNode = getTextByPathList<number | string | null>(nodeRecord, [
    "p:spPr",
    "a:xfrm",
    "attrs",
    "rot",
  ]);
  if (rotateNode !== undefined) {
    rotate = angleToDegrees(rotateNode);
  }
  //video
  const vdoNode = getTextByPathList<Record<string, unknown>>(nodeRecord, [
    "p:nvPicPr",
    "p:nvPr",
    "a:videoFile",
  ]);
  let vdoRid: string | undefined;
  let vdoFile: string | undefined;
  let vdoFileExt: string | undefined;
  let vdoMimeType: string | undefined;
  let uInt8Array: ArrayBuffer | undefined;
  let blob: Blob | undefined;
  let vdoBlob: string | undefined;
  let mediaSupportFlag = false;
  let isVdeoLink = false;
  const mediaProcess = settings.mediaProcess;
  if (vdoNode !== undefined && mediaProcess) {
    vdoRid = (vdoNode["attrs"] as Record<string, string>)["r:link"];
    vdoFile = resObj[vdoRid]?.target;
    if (vdoFile) {
      const checkIfLink = isVideoLink(vdoFile);
      if (checkIfLink) {
        vdoFile = escapeHtml(vdoFile);
        //vdoBlob = vdoFile;
        isVdeoLink = true;
        mediaSupportFlag = true;
        mediaPicFlag = true;
      } else {
        vdoFileExt = extractFileExtension(vdoFile).toLowerCase();
        if (vdoFileExt === "mp4" || vdoFileExt === "webm" || vdoFileExt === "ogg") {
          const vdoArchiveFile = await archive.file(vdoFile);
          if (!vdoArchiveFile) {
            throw new Error(`File not found in archive: ${vdoFile}`);
          }
          uInt8Array = await vdoArchiveFile.arrayBuffer();
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
  }
  //Audio
  const audioNode = getTextByPathList<Record<string, unknown>>(nodeRecord, [
    "p:nvPicPr",
    "p:nvPr",
    "a:audioFile",
  ]);
  let audioRid: string | undefined;
  let audioFile: string | undefined;
  let audioFileExt: string | undefined;
  let uInt8ArrayAudio: ArrayBuffer | undefined;
  let blobAudio: Blob | undefined;
  let audioBlob: string | undefined;
  let audioPlayerFlag = false;
  let audioObjc: Record<string, unknown> | undefined;
  if (audioNode !== undefined && mediaProcess) {
    audioRid = (audioNode["attrs"] as Record<string, string>)["r:link"];
    audioFile = resObj[audioRid]?.target;
    if (audioFile) {
      audioFileExt = extractFileExtension(audioFile).toLowerCase();
      if (audioFileExt === "mp3" || audioFileExt === "wav" || audioFileExt === "ogg") {
        const audioArchiveFile = await archive.file(audioFile);
        if (!audioArchiveFile) {
          throw new Error(`File not found in archive: ${audioFile}`);
        }
        uInt8ArrayAudio = await audioArchiveFile.arrayBuffer();
        blobAudio = new Blob([uInt8ArrayAudio]);
        audioBlob = URL.createObjectURL(blobAudio);
        const xfrmAttrs = xfrmNode as Record<string, unknown>;
        const extAttrs = (xfrmAttrs["a:ext"] as Record<string, unknown>)["attrs"] as Record<
          string,
          string
        >;
        const offAttrs = (xfrmAttrs["a:off"] as Record<string, unknown>)["attrs"] as Record<
          string,
          string
        >;
        const cx = parseInt(extAttrs["cx"]) * 20;
        const cy = extAttrs["cy"];
        const x = parseInt(offAttrs["x"]) / 2.5;
        const y = offAttrs["y"];
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
  }
  //console.log(node)
  //////////////////////////////////////////////////////////////////////////
  mimeType = getMimeType(imgFileExt);
  rtrnData =
    "<div class='block content' style='" +
    (mediaProcess && audioPlayerFlag
      ? getPosition(audioObjc, nodeRecord, undefined, undefined, undefined, slideFactor)
      : getPosition(xfrmNode, nodeRecord, undefined, undefined, undefined, slideFactor)) +
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
