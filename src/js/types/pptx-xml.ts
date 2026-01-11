/**
 * Shared PPTX XML node types produced by tXml.simplify().
 *
 * Nodes are plain objects with optional `attrs` (string/number values)
 * and child entries that can be nested nodes, arrays, or primitive values.
 */
import type { PptxArchive } from "../archive/pptx-archive";

export type XmlValue = string | number | boolean | null | undefined | XmlNode | XmlNode[];

export interface XmlAttrs {
  [key: string]: string | number;
}

export interface XmlNode {
  attrs?: XmlAttrs;
  [key: string]: XmlValue;
}

export type RelationshipMap = Record<string, { target: string }>;

export interface WarpContext {
  archive: PptxArchive;
  slideResObj: RelationshipMap;
  layoutResObj?: RelationshipMap;
  masterResObj?: RelationshipMap;
  themeResObj?: RelationshipMap;
  diagramResObj?: RelationshipMap;
  slideLayoutTables?: {
    idxTable: Record<string | number, XmlNode>;
    typeTable: Record<string, XmlNode>;
  };
  slideMasterTables?: {
    idxTable: Record<string | number, XmlNode>;
    typeTable: Record<string, XmlNode>;
  };
  slideMasterTextStyles?: XmlNode;
  defaultTextStyle?: XmlNode;
  slideContent?: XmlNode;
  slideLayoutContent?: XmlNode;
  slideMasterContent?: XmlNode;
  themeContent?: XmlNode;
}
