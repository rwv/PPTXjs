import { tXml } from "./t-xml";

export const getElementById = (xml: string, id: string, simplify?: boolean | number): any => {
  const result = tXml({ xml, options: { attrValue: id, simplify } });
  return simplify ? result : result[0];
};
