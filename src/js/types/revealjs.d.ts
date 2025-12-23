/**
 * Global type declaration for Reveal.js
 * Reveal.js is loaded dynamically via script tag and exposes a global Reveal object
 */
declare const Reveal: {
  initialize: (config?: any) => void;
  [key: string]: any;
};
