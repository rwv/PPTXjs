export type TXmlAttributeValue = string | null;

export type TXmlAttributes = Record<string, TXmlAttributeValue>;

export type TXmlNode = {
  tagName: string;
  attributes?: TXmlAttributes;
  children?: Array<TXmlNode | string>;
};

export type TXmlOptions = {
  pos?: number;
  attrName?: string;
  attrValue?: string;
  simplify?: boolean | number;
  filter?: (node: TXmlNode) => boolean;
  parseNode?: boolean;
};

export type TXmlInput = {
  xml: string;
  options?: TXmlOptions;
};

export type TXmlResult = any;
