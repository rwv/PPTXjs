import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/js/pptxjs.ts',
    output: {
      file: 'dist/js/pptxjs.js',
      format: 'iife',
      strict: false,
      sourcemap: true,
      globals: {
        jquery: 'jQuery'
      }
    },
    external: ['jquery', 'fs'],
    plugins: [
      resolve(),
      typescript()
    ]
};
