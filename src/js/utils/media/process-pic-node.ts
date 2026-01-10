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
 * @param picNode - Picture node from PPTX
 * @param warpContext - Warp object containing slide resources and zip
 * @param sourceType - Source type (slideMasterBg, slideLayoutBg, etc.)
 * @param shapeType - Shape type
 * @param emuToPx - EMU to pixel conversion factor
 * @param renderSettings - Settings object containing mediaProcess flag
 * @returns HTML string for the picture/video/audio element
 */
export async function processPicNode(
  picNode: unknown,
  warpContext: unknown,
  sourceType: string,
  shapeType: string,
  emuToPx: number,
  renderSettings: { mediaProcess: boolean }
): Promise<string> {
  void shapeType;
  //console.log("processPicNode node:", node, "source:", source, "sType:", sType, "warpObj;", warpObj);
  type ResourceMap = Record<string, { target: string }>;
  type WarpContext = {
    masterResObj?: ResourceMap;
    layoutResObj?: ResourceMap;
    slideResObj: ResourceMap;
    archive: PptxArchive;
    slideLayoutTables?: Record<string, unknown>;
  };
  const picNodeRecord = picNode as Record<string, unknown>;
  const warpContextTyped = warpContext as WarpContext;
  let htmlOutput = "";
  let hasMediaAsset = false;
  const zIndexOrder = (picNodeRecord["attrs"] as Record<string, string | number>)["order"];

  const blipFillNode = picNodeRecord["p:blipFill"] as Record<string, unknown>;
  const blipNode = blipFillNode["a:blip"] as Record<string, unknown>;
  const relationshipId = (blipNode["attrs"] as Record<string, string>)["r:embed"];
  let resourceMap: ResourceMap;
  if (sourceType === "slideMasterBg") {
    resourceMap = warpContextTyped.masterResObj as ResourceMap;
  } else if (sourceType === "slideLayoutBg") {
    resourceMap = warpContextTyped.layoutResObj as ResourceMap;
  } else {
    //imgName = warpObj["slideResObj"][rid]["target"];
    resourceMap = warpContextTyped.slideResObj;
  }
  const imagePath = resourceMap[relationshipId]["target"];

  //console.log("processPicNode imgName:", imgName);
  const imageExtension = extractFileExtension(imagePath).toLowerCase();
  const archive = warpContextTyped.archive;
  const imageFile = await archive.file(imagePath);
  if (!imageFile) {
    throw new Error(`File not found in archive: ${imagePath}`);
  }
  const imageArrayBuffer = await imageFile.arrayBuffer();
  let imageMimeType = "";
  const shapePropsNode = picNodeRecord["p:spPr"] as Record<string, unknown>;
  let transformNode = shapePropsNode["a:xfrm"] as Record<string, unknown> | undefined;
  if (transformNode === undefined) {
    const placeholderIndex = getTextByPathList<string | number>(picNodeRecord, [
      "p:nvPicPr",
      "p:nvPr",
      "p:ph",
      "attrs",
      "idx",
    ]);
    if (placeholderIndex !== undefined) {
      transformNode = getTextByPathList<Record<string, unknown>>(
        warpContextTyped.slideLayoutTables,
        ["idxTable", placeholderIndex, "p:spPr", "a:xfrm"]
      );
    }
  }
  ///////////////////////////////////////Amir//////////////////////////////
  let rotationDegrees = 0;
  const rotationNode = getTextByPathList<number | string | null>(picNodeRecord, [
    "p:spPr",
    "a:xfrm",
    "attrs",
    "rot",
  ]);
  if (rotationNode !== undefined) {
    rotationDegrees = angleToDegrees(rotationNode);
  }
  //video
  const videoNode = getTextByPathList<Record<string, unknown>>(picNodeRecord, [
    "p:nvPicPr",
    "p:nvPr",
    "a:videoFile",
  ]);
  let videoRelId: string | undefined;
  let videoPath: string | undefined;
  let videoExtension: string | undefined;
  let videoMimeType: string | undefined;
  let videoBuffer: ArrayBuffer | undefined;
  let videoBlob: Blob | undefined;
  let videoUrl: string | undefined;
  let mediaSupported = false;
  let isVideoLinkSource = false;
  const shouldProcessMedia = renderSettings.mediaProcess;
  if (videoNode !== undefined && shouldProcessMedia) {
    videoRelId = (videoNode["attrs"] as Record<string, string>)["r:link"];
    videoPath = resourceMap[videoRelId]?.target;
    if (videoPath) {
      const isLink = isVideoLink(videoPath);
      if (isLink) {
        videoPath = escapeHtml(videoPath);
        //videoUrl = videoPath;
        isVideoLinkSource = true;
        mediaSupported = true;
        hasMediaAsset = true;
      } else {
        videoExtension = extractFileExtension(videoPath).toLowerCase();
        if (videoExtension === "mp4" || videoExtension === "webm" || videoExtension === "ogg") {
          const videoArchiveFile = await archive.file(videoPath);
          if (!videoArchiveFile) {
            throw new Error(`File not found in archive: ${videoPath}`);
          }
          videoBuffer = await videoArchiveFile.arrayBuffer();
          videoMimeType = getMimeType(videoExtension);
          videoBlob = new Blob([videoBuffer], {
            type: videoMimeType,
          });
          videoUrl = URL.createObjectURL(videoBlob);
          mediaSupported = true;
          hasMediaAsset = true;
        }
      }
    }
  }
  //Audio
  const audioNode = getTextByPathList<Record<string, unknown>>(picNodeRecord, [
    "p:nvPicPr",
    "p:nvPr",
    "a:audioFile",
  ]);
  let audioRelId: string | undefined;
  let audioPath: string | undefined;
  let audioExtension: string | undefined;
  let audioBuffer: ArrayBuffer | undefined;
  let audioBlob: Blob | undefined;
  let audioUrl: string | undefined;
  let audioPlayerEnabled = false;
  let audioTransformNode: Record<string, unknown> | undefined;
  if (audioNode !== undefined && shouldProcessMedia) {
    audioRelId = (audioNode["attrs"] as Record<string, string>)["r:link"];
    audioPath = resourceMap[audioRelId]?.target;
    if (audioPath) {
      audioExtension = extractFileExtension(audioPath).toLowerCase();
      if (audioExtension === "mp3" || audioExtension === "wav" || audioExtension === "ogg") {
        const audioArchiveFile = await archive.file(audioPath);
        if (!audioArchiveFile) {
          throw new Error(`File not found in archive: ${audioPath}`);
        }
        audioBuffer = await audioArchiveFile.arrayBuffer();
        audioBlob = new Blob([audioBuffer]);
        audioUrl = URL.createObjectURL(audioBlob);
        const transformAttrs = transformNode as Record<string, unknown>;
        const extAttrs = (transformAttrs["a:ext"] as Record<string, unknown>)["attrs"] as Record<
          string,
          string
        >;
        const offAttrs = (transformAttrs["a:off"] as Record<string, unknown>)["attrs"] as Record<
          string,
          string
        >;
        const cxValue = parseInt(extAttrs["cx"]) * 20;
        const cyValue = extAttrs["cy"];
        const xValue = parseInt(offAttrs["x"]) / 2.5;
        const yValue = offAttrs["y"];
        audioTransformNode = {
          "a:ext": {
            attrs: {
              cx: cxValue,
              cy: cyValue,
            },
          },
          "a:off": {
            attrs: {
              x: xValue,
              y: yValue,
            },
          },
        };
        audioPlayerEnabled = true;
        mediaSupported = true;
        hasMediaAsset = true;
      }
    }
  }
  //console.log(node)
  //////////////////////////////////////////////////////////////////////////
  imageMimeType = getMimeType(imageExtension);
  htmlOutput =
    "<div class='block content' style='" +
    (shouldProcessMedia && audioPlayerEnabled
      ? getPosition(audioTransformNode, picNodeRecord, undefined, undefined, undefined, emuToPx)
      : getPosition(transformNode, picNodeRecord, undefined, undefined, undefined, emuToPx)) +
    (shouldProcessMedia && audioPlayerEnabled
      ? getSize(audioTransformNode, undefined, undefined, emuToPx)
      : getSize(transformNode, undefined, undefined, emuToPx)) +
    " z-index: " +
    zIndexOrder +
    ";" +
    "transform: rotate(" +
    rotationDegrees +
    "deg);'>";
  if (
    (videoNode === undefined && audioNode === undefined) ||
    !shouldProcessMedia ||
    !mediaSupported
  ) {
    htmlOutput +=
      "<img src='data:" +
      imageMimeType +
      ";base64," +
      base64ArrayBuffer(imageArrayBuffer) +
      "' style='width: 100%; height: 100%'/>";
  } else if (
    (videoNode !== undefined || audioNode !== undefined) &&
    shouldProcessMedia &&
    mediaSupported
  ) {
    if (videoNode !== undefined && !isVideoLinkSource) {
      htmlOutput +=
        "<video  src='" +
        videoUrl +
        "' controls style='width: 100%; height: 100%'>Your browser does not support the video tag.</video>";
    } else if (videoNode !== undefined && isVideoLinkSource) {
      htmlOutput +=
        "<iframe   src='" + videoPath + "' controls style='width: 100%; height: 100%'></iframe >";
    }
    if (audioNode !== undefined) {
      htmlOutput += '<audio id="audio_player" controls ><source src="' + audioUrl + '"></audio>';
      //'<button onclick="audio_player.play()">Play</button>'+
      //'<button onclick="audio_player.pause()">Pause</button>';
    }
  }
  if (!mediaSupported && hasMediaAsset) {
    htmlOutput +=
      "<span style='color:red;font-size:40px;position: absolute;'>This media file Not supported by HTML5</span>";
  }
  if (
    (videoNode !== undefined || audioNode !== undefined) &&
    !shouldProcessMedia &&
    mediaSupported
  ) {
    console.log("Founded supported media file but media process disabled (mediaProcess=false)");
  }
  htmlOutput += "</div>";
  //console.log(rtrnData)
  return htmlOutput;
}
