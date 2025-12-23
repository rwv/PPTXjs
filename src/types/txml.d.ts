/**
 * Type declarations for txml package
 * The official package has exports configuration issues with TypeScript
 */

declare module "txml" {
  export interface tNode {
    tagName: string;
    attributes: Record<string, string>;
    children: (tNode | string)[];
  }

  export interface TParseOptions {
    pos?: number;
    noChildNodes?: string[];
    setPos?: boolean;
    keepComments?: boolean;
    keepWhitespace?: boolean;
    simplify?: boolean;
    filter?: (a: tNode, b: tNode) => boolean;
  }

  export function parse(S: string, options?: TParseOptions): (tNode | string)[];
  export function simplify(children: tNode[]): any;
  export function simplifyLostLess(
    children: tNode[],
    parentAttributes?: object
  ): any;
  export function filter(
    children: any,
    f: Function,
    dept?: number,
    path?: string
  ): any[];
  export function stringify(O: tNode): string;
  export function toContentString(tDom: any): string;
  export function getElementById(S: any, id: any, simplified: any): any;
  export function getElementsByClassName(
    S: any,
    classname: any,
    simplified: any
  ): any;
}

declare module "txml/txml" {
  export interface tNode {
    tagName: string;
    attributes: Record<string, string>;
    children: (tNode | string)[];
  }

  export interface TParseOptions {
    pos?: number;
    noChildNodes?: string[];
    setPos?: boolean;
    keepComments?: boolean;
    keepWhitespace?: boolean;
    simplify?: boolean;
    filter?: (a: tNode, b: tNode) => boolean;
  }

  export function parse(S: string, options?: TParseOptions): (tNode | string)[];
  export function simplify(children: tNode[]): any;
  export function simplifyLostLess(
    children: tNode[],
    parentAttributes?: object
  ): any;
  export function filter(
    children: any,
    f: Function,
    dept?: number,
    path?: string
  ): any[];
  export function stringify(O: tNode): string;
  export function toContentString(tDom: any): string;
  export function getElementById(S: any, id: any, simplified: any): any;
  export function getElementsByClassName(
    S: any,
    classname: any,
    simplified: any
  ): any;
}
