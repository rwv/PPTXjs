import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/js/divs2slides.ts',
    output: {
      file: 'js/divs2slides.js',
      format: 'iife',
      strict: false,
      sourcemap: true,
      globals: {
        jquery: 'jQuery'
      }
    },
    external: ['jquery'],
    plugins: [
      resolve(),
      typescript({
        tsconfig: false,
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          strict: false,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true
        }
      })
    ]
  },
  {
    input: 'src/js/pptxjs.ts',
    output: {
      file: 'js/pptxjs.js',
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
      typescript({
        tsconfig: false,
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          strict: false,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true
        }
      })
    ]
  }
];
