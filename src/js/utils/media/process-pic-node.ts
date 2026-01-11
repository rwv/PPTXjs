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
  type RelationshipMap = Record<string, { target: string }>;
  type WarpContext = {
    masterResObj?: RelationshipMap;
    layoutResObj?: RelationshipMap;
    slideResObj: RelationshipMap;
    archive: PptxArchive;
    slideLayoutTables?: Record<string, unknown>;
  };
  const pictureNode = picNode as Record<string, unknown>;
  const warpContextValue = warpContext as WarpContext;
  let htmlOutput = "";
  let hasMediaAsset = false;
  const zIndexValue = (pictureNode["attrs"] as Record<string, string | number>)["order"];

  const blipFillNode = pictureNode["p:blipFill"] as Record<string, unknown>;
  const blipNode = blipFillNode["a:blip"] as Record<string, unknown>;
  const relationshipId = (blipNode["attrs"] as Record<string, string>)["r:embed"];
  let relationshipTargets: RelationshipMap;
  if (sourceType === "slideMasterBg") {
    relationshipTargets = warpContextValue.masterResObj as RelationshipMap;
  } else if (sourceType === "slideLayoutBg") {
    relationshipTargets = warpContextValue.layoutResObj as RelationshipMap;
  } else {
    //imgName = warpObj["slideResObj"][rid]["target"];
    relationshipTargets = warpContextValue.slideResObj;
  }
  const imagePath = relationshipTargets[relationshipId]["target"];

  //console.log("processPicNode imgName:", imgName);
  const imageExtension = extractFileExtension(imagePath).toLowerCase();
  const archive = warpContextValue.archive;
  const imageArchiveFile = await archive.file(imagePath);
  if (!imageArchiveFile) {
    throw new Error(`File not found in archive: ${imagePath}`);
  }
  const imageArrayBuffer = await imageArchiveFile.arrayBuffer();
  let imageMimeType = "";
  const shapePropertiesNode = pictureNode["p:spPr"] as Record<string, unknown>;
  let transformPropertiesNode = shapePropertiesNode["a:xfrm"] as
    | Record<string, unknown>
    | undefined;
  if (transformPropertiesNode === undefined) {
    const placeholderIndex = getTextByPathList<string | number>(pictureNode, [
      "p:nvPicPr",
      "p:nvPr",
      "p:ph",
      "attrs",
      "idx",
    ]);
    if (placeholderIndex !== undefined) {
      transformPropertiesNode = getTextByPathList<Record<string, unknown>>(
        warpContextValue.slideLayoutTables,
        ["idxTable", placeholderIndex, "p:spPr", "a:xfrm"]
      );
    }
  }
  ///////////////////////////////////////Amir//////////////////////////////
  let rotationDegrees = 0;
  const rotationValue = getTextByPathList<number | string | null>(pictureNode, [
    "p:spPr",
    "a:xfrm",
    "attrs",
    "rot",
  ]);
  if (rotationValue !== undefined) {
    rotationDegrees = angleToDegrees(rotationValue);
  }
  //video
  const videoNode = getTextByPathList<Record<string, unknown>>(pictureNode, [
    "p:nvPicPr",
    "p:nvPr",
    "a:videoFile",
  ]);
  let videoRelationshipId: string | undefined;
  let videoPath: string | undefined;
  let videoExtension: string | undefined;
  let videoMimeType: string | undefined;
  let videoArrayBuffer: ArrayBuffer | undefined;
  let videoBlob: Blob | undefined;
  let videoObjectUrl: string | undefined;
  let isMediaSupported = false;
  let isVideoLinkSource = false;
  const shouldProcessMedia = renderSettings.mediaProcess;
  if (videoNode !== undefined && shouldProcessMedia) {
    videoRelationshipId = (videoNode["attrs"] as Record<string, string>)["r:link"];
    videoPath = relationshipTargets[videoRelationshipId]?.target;
    if (videoPath) {
      const isLink = isVideoLink(videoPath);
      if (isLink) {
        videoPath = escapeHtml(videoPath);
        //videoObjectUrl = videoPath;
        isVideoLinkSource = true;
        isMediaSupported = true;
        hasMediaAsset = true;
      } else {
        videoExtension = extractFileExtension(videoPath).toLowerCase();
        if (videoExtension === "mp4" || videoExtension === "webm" || videoExtension === "ogg") {
          const videoArchiveFile = await archive.file(videoPath);
          if (!videoArchiveFile) {
            throw new Error(`File not found in archive: ${videoPath}`);
          }
          videoArrayBuffer = await videoArchiveFile.arrayBuffer();
          videoMimeType = getMimeType(videoExtension);
          videoBlob = new Blob([videoArrayBuffer], {
            type: videoMimeType,
          });
          videoObjectUrl = URL.createObjectURL(videoBlob);
          isMediaSupported = true;
          hasMediaAsset = true;
        }
      }
    }
  }
  //Audio
  const audioNode = getTextByPathList<Record<string, unknown>>(pictureNode, [
    "p:nvPicPr",
    "p:nvPr",
    "a:audioFile",
  ]);
  let audioRelationshipId: string | undefined;
  let audioPath: string | undefined;
  let audioExtension: string | undefined;
  let audioArrayBuffer: ArrayBuffer | undefined;
  let audioBlob: Blob | undefined;
  let audioObjectUrl: string | undefined;
  let shouldRenderAudioPlayer = false;
  let audioTransformOverride: Record<string, unknown> | undefined;
  if (audioNode !== undefined && shouldProcessMedia) {
    audioRelationshipId = (audioNode["attrs"] as Record<string, string>)["r:link"];
    audioPath = relationshipTargets[audioRelationshipId]?.target;
    if (audioPath) {
      audioExtension = extractFileExtension(audioPath).toLowerCase();
      if (audioExtension === "mp3" || audioExtension === "wav" || audioExtension === "ogg") {
        const audioArchiveFile = await archive.file(audioPath);
        if (!audioArchiveFile) {
          throw new Error(`File not found in archive: ${audioPath}`);
        }
        audioArrayBuffer = await audioArchiveFile.arrayBuffer();
        audioBlob = new Blob([audioArrayBuffer]);
        audioObjectUrl = URL.createObjectURL(audioBlob);
        const transformAttributes = transformPropertiesNode as Record<string, unknown>;
        const extentAttributes = (transformAttributes["a:ext"] as Record<string, unknown>)[
          "attrs"
        ] as Record<string, string>;
        const offsetAttributes = (transformAttributes["a:off"] as Record<string, unknown>)[
          "attrs"
        ] as Record<string, string>;
        const extentWidth = parseInt(extentAttributes["cx"]) * 20;
        const extentHeight = extentAttributes["cy"];
        const offsetX = parseInt(offsetAttributes["x"]) / 2.5;
        const offsetY = offsetAttributes["y"];
        audioTransformOverride = {
          "a:ext": {
            attrs: {
              cx: extentWidth,
              cy: extentHeight,
            },
          },
          "a:off": {
            attrs: {
              x: offsetX,
              y: offsetY,
            },
          },
        };
        shouldRenderAudioPlayer = true;
        isMediaSupported = true;
        hasMediaAsset = true;
      }
    }
  }
  //console.log(node)
  //////////////////////////////////////////////////////////////////////////
  imageMimeType = getMimeType(imageExtension);
  htmlOutput =
    "<div class='block content' style='" +
    (shouldProcessMedia && shouldRenderAudioPlayer
      ? getPosition(audioTransformOverride, pictureNode, undefined, undefined, undefined, emuToPx)
      : getPosition(
          transformPropertiesNode,
          pictureNode,
          undefined,
          undefined,
          undefined,
          emuToPx
        )) +
    (shouldProcessMedia && shouldRenderAudioPlayer
      ? getSize(audioTransformOverride, undefined, undefined, emuToPx)
      : getSize(transformPropertiesNode, undefined, undefined, emuToPx)) +
    " z-index: " +
    zIndexValue +
    ";" +
    "transform: rotate(" +
    rotationDegrees +
    "deg);'>";
  if (
    (videoNode === undefined && audioNode === undefined) ||
    !shouldProcessMedia ||
    !isMediaSupported
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
    isMediaSupported
  ) {
    if (videoNode !== undefined && !isVideoLinkSource) {
      htmlOutput +=
        "<video  src='" +
        videoObjectUrl +
        "' controls style='width: 100%; height: 100%'>Your browser does not support the video tag.</video>";
    } else if (videoNode !== undefined && isVideoLinkSource) {
      htmlOutput +=
        "<iframe   src='" + videoPath + "' controls style='width: 100%; height: 100%'></iframe >";
    }
    if (audioNode !== undefined) {
      htmlOutput +=
        '<audio id="audio_player" controls ><source src="' + audioObjectUrl + '"></audio>';
      //'<button onclick="audio_player.play()">Play</button>'+
      //'<button onclick="audio_player.pause()">Pause</button>';
    }
  }
  if (!isMediaSupported && hasMediaAsset) {
    htmlOutput +=
      "<span style='color:red;font-size:40px;position: absolute;'>This media file Not supported by HTML5</span>";
  }
  if (
    (videoNode !== undefined || audioNode !== undefined) &&
    !shouldProcessMedia &&
    isMediaSupported
  ) {
    console.log("Founded supported media file but media process disabled (mediaProcess=false)");
  }
  htmlOutput += "</div>";
  //console.log(rtrnData)
  return htmlOutput;
}
