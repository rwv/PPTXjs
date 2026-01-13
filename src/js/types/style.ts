export type StyleTableEntry = {
  name: string;
  text: string;
  suffix?: string;
};

export type StyleTable = Record<string, StyleTableEntry>;
