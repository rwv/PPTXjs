import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/js/dingbat.ts',
    output: {
      file: 'js/dingbat.js',
      format: 'iife',
      strict: false,
      sourcemap: true
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: false,
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          strict: false
        }
      })
    ]
  },
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
          strict: false
        }
      })
    ]
  }
];
