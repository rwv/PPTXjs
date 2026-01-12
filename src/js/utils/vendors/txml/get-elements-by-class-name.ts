import { tXml } from "./t-xml";

export const getElementsByClassName = (
  xml: string,
  className: string,
  simplify?: boolean | number
): any =>
  tXml({
    xml,
    options: {
      attrName: "class",
      attrValue: `[a-zA-Z0-9-s ]*${className}[a-zA-Z0-9-s ]*`,
      simplify,
    },
  });
