import { tXml } from "./t-xml";
import type { TXmlResult } from "./types";

export const getElementsByClassName = (
  xml: string,
  className: string,
  simplify?: boolean | number
): TXmlResult =>
  tXml({
    xml,
    options: {
      attrName: "class",
      attrValue: `[a-zA-Z0-9-s ]*${className}[a-zA-Z0-9-s ]*`,
      simplify,
    },
  });
