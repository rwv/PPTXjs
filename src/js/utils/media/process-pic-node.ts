import { getTextByPathList } from "../object";
import { getPosition } from "../layout/get-position";
import { getSize } from "../layout/get-size";
import { angleToDegrees } from "../layout";
import { extractFileExtension } from "./extract-file-extension";
import { isVideoLink } from "./is-video-link";
import { getMimeType } from "./get-mime-type";
import { base64ArrayBuffer } from "./base64-array-buffer";
import { escapeHtml } from "../string";
import type { RelationshipMap, WarpContext, XmlNode, XmlValue } from "../../types/pptx-xml";

function isXmlNode(value: XmlValue): value is XmlNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asXmlNode(value: XmlValue | undefined): XmlNode | undefined {
  return value !== undefined && isXmlNode(value) ? value : undefined;
}

/**
 * Process picture/video/audio node and generate HTML
 *
 * @param picNode - Picture node from PPTX
 * @param warpContext - Warp object containing slide resources and zip
 * @param sourceType - Source type (slideMasterBg, slideLayoutBg, etc.)
 * @param emuToPx - EMU to pixel conversion factor
 * @param renderSettings - Settings object containing mediaProcess flag
 * @returns HTML string for the picture/video/audio element
 */
type ProcessPicNodeOptions = {
  picNode: XmlNode;
  warpContext: WarpContext;
  sourceType: string;
  emuToPx: number;
  renderSettings: { mediaProcess: boolean };
};

export async function processPicNode({
  picNode,
  warpContext,
  sourceType,
  emuToPx,
  renderSettings,
}: ProcessPicNodeOptions): Promise<string> {
  //console.log("processPicNode node:", node, "source:", source, "sType:", sType, "warpObj;", warpObj);
  const pictureNode = picNode;
  const warpContextValue = warpContext;
  let htmlOutput = "";
  let hasMediaAsset = false;
  const zIndexValue = String(pictureNode.attrs?.order ?? 0);

  const blipFillNode = pictureNode["p:blipFill"] as XmlNode;
  const blipNode = blipFillNode["a:blip"] as XmlNode;
  const relationshipIdValue = blipNode.attrs?.["r:embed"];
  if (relationshipIdValue === undefined) {
    throw new Error("Missing relationship id for picture embed.");
  }
  const relationshipId = String(relationshipIdValue);
  let relationshipTargets: RelationshipMap;
  if (sourceType === "slideMasterBg") {
    relationshipTargets = warpContextValue.masterResObj ?? warpContextValue.slideResObj;
  } else if (sourceType === "slideLayoutBg") {
    relationshipTargets = warpContextValue.layoutResObj ?? warpContextValue.slideResObj;
  } else {
    //imgName = warpObj["slideResObj"][rid]["target"];
    relationshipTargets = warpContextValue.slideResObj;
  }
  const imagePath = relationshipTargets[relationshipId]?.target;
  if (!imagePath) {
    throw new Error(`Missing relationship target for id: ${relationshipId}`);
  }

  //console.log("processPicNode imgName:", imgName);
  const imageExtension = extractFileExtension({ filename: imagePath }).toLowerCase();
  const archive = warpContextValue.archive;
  const imageArchiveFile = await archive.file(imagePath);
  if (!imageArchiveFile) {
    throw new Error(`File not found in archive: ${imagePath}`);
  }
  const imageArrayBuffer = await imageArchiveFile.arrayBuffer();
  let imageMimeType = "";
  const shapePropertiesNode = asXmlNode(pictureNode["p:spPr"]);
  let transformPropertiesNode = shapePropertiesNode
    ? asXmlNode(shapePropertiesNode["a:xfrm"])
    : undefined;
  if (transformPropertiesNode === undefined) {
    const placeholderIndex = getTextByPathList<string | number>({
      node: pictureNode,
      path: ["p:nvPicPr", "p:nvPr", "p:ph", "attrs", "idx"],
    });
    if (placeholderIndex !== undefined && warpContextValue.slideLayoutTables) {
      const layoutShapeNode = warpContextValue.slideLayoutTables.idxTable[placeholderIndex];
      const layoutTransformNode = layoutShapeNode
        ? asXmlNode(getTextByPathList({ node: layoutShapeNode, path: ["p:spPr", "a:xfrm"] }))
        : undefined;
      if (layoutTransformNode !== undefined) {
        transformPropertiesNode = layoutTransformNode;
      }
    }
  }
  ///////////////////////////////////////Amir//////////////////////////////
  let rotationDegrees = 0;
  const rotationValue = getTextByPathList<number | string | null>({
    node: pictureNode,
    path: ["p:spPr", "a:xfrm", "attrs", "rot"],
  });
  if (rotationValue !== undefined && rotationValue !== null) {
    rotationDegrees = angleToDegrees({ angle: rotationValue });
  }
  //video
  const videoNode = asXmlNode(
    getTextByPathList({ node: pictureNode, path: ["p:nvPicPr", "p:nvPr", "a:videoFile"] })
  );
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
    const videoRelationshipIdValue = videoNode.attrs?.["r:link"];
    if (videoRelationshipIdValue !== undefined) {
      videoRelationshipId = String(videoRelationshipIdValue);
      videoPath = relationshipTargets[videoRelationshipId]?.target;
    }
    if (videoPath) {
      const isLink = isVideoLink({ videoUrl: videoPath });
      if (isLink) {
        videoPath = escapeHtml({ text: videoPath });
        //videoObjectUrl = videoPath;
        isVideoLinkSource = true;
        isMediaSupported = true;
        hasMediaAsset = true;
      } else {
        videoExtension = extractFileExtension({ filename: videoPath }).toLowerCase();
        if (videoExtension === "mp4" || videoExtension === "webm" || videoExtension === "ogg") {
          const videoArchiveFile = await archive.file(videoPath);
          if (!videoArchiveFile) {
            throw new Error(`File not found in archive: ${videoPath}`);
          }
          videoArrayBuffer = await videoArchiveFile.arrayBuffer();
          videoMimeType = getMimeType({ fileExtension: videoExtension });
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
  const audioNode = asXmlNode(
    getTextByPathList({ node: pictureNode, path: ["p:nvPicPr", "p:nvPr", "a:audioFile"] })
  );
  let audioRelationshipId: string | undefined;
  let audioPath: string | undefined;
  let audioExtension: string | undefined;
  let audioArrayBuffer: ArrayBuffer | undefined;
  let audioBlob: Blob | undefined;
  let audioObjectUrl: string | undefined;
  let shouldRenderAudioPlayer = false;
  let audioTransformOverride: XmlNode | undefined;
  if (audioNode !== undefined && shouldProcessMedia) {
    const audioRelationshipIdValue = audioNode.attrs?.["r:link"];
    if (audioRelationshipIdValue !== undefined) {
      audioRelationshipId = String(audioRelationshipIdValue);
      audioPath = relationshipTargets[audioRelationshipId]?.target;
    }
    if (audioPath) {
      audioExtension = extractFileExtension({ filename: audioPath }).toLowerCase();
      if (audioExtension === "mp3" || audioExtension === "wav" || audioExtension === "ogg") {
        const audioArchiveFile = await archive.file(audioPath);
        if (!audioArchiveFile) {
          throw new Error(`File not found in archive: ${audioPath}`);
        }
        audioArrayBuffer = await audioArchiveFile.arrayBuffer();
        audioBlob = new Blob([audioArrayBuffer]);
        audioObjectUrl = URL.createObjectURL(audioBlob);
        if (transformPropertiesNode) {
          const extentAttributes = asXmlNode(transformPropertiesNode["a:ext"])?.attrs;
          const offsetAttributes = asXmlNode(transformPropertiesNode["a:off"])?.attrs;
          if (extentAttributes && offsetAttributes) {
            const extentWidth = parseInt(String(extentAttributes["cx"] ?? "0"), 10) * 20;
            const extentHeight = extentAttributes["cy"] ?? 0;
            const offsetX = parseInt(String(offsetAttributes["x"] ?? "0"), 10) / 2.5;
            const offsetY = offsetAttributes["y"] ?? 0;
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
          }
        }
        shouldRenderAudioPlayer = true;
        isMediaSupported = true;
        hasMediaAsset = true;
      }
    }
  }
  //console.log(node)
  //////////////////////////////////////////////////////////////////////////
  imageMimeType = getMimeType({ fileExtension: imageExtension });
  htmlOutput =
    "<div class='block content' style='" +
    (shouldProcessMedia && shouldRenderAudioPlayer
      ? getPosition({
          slideSpNode: audioTransformOverride,
          parentNode: pictureNode,
          slideLayoutSpNode: undefined,
          slideMasterSpNode: undefined,
          shapeType: undefined,
          emuToPx,
        })
      : getPosition({
          slideSpNode: transformPropertiesNode,
          parentNode: pictureNode,
          slideLayoutSpNode: undefined,
          slideMasterSpNode: undefined,
          shapeType: undefined,
          emuToPx,
        })) +
    (shouldProcessMedia && shouldRenderAudioPlayer
      ? getSize({
          slideSpNode: audioTransformOverride,
          slideLayoutSpNode: undefined,
          slideMasterSpNode: undefined,
          emuToPx,
        })
      : getSize({
          slideSpNode: transformPropertiesNode,
          slideLayoutSpNode: undefined,
          slideMasterSpNode: undefined,
          emuToPx,
        })) +
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
      base64ArrayBuffer({ arrayBuffer: imageArrayBuffer }) +
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
