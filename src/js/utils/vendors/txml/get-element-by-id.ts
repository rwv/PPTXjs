import { tXml } from "./t-xml";
import type { TXmlResult } from "./types";

export const getElementById = (
  xml: string,
  id: string,
  simplify?: boolean | number
): TXmlResult | undefined => {
  const result = tXml({ xml, options: { attrValue: id, simplify } });
  if (simplify) {
    return result;
  }
  return Array.isArray(result) ? result[0] : undefined;
};
