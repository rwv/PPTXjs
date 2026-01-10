import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/js/pptxjs.ts',
    output: {
      file: 'dist/js/pptxjs.js',
      format: 'iife',
      strict: false,
      sourcemap: true
    },
    external: ['fs'],
    plugins: [
      resolve(),
      typescript()
    ]
};
