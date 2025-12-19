import { playwright } from '@vitest/browser-playwright'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig, type Plugin } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json', 'html', 'clover'],
      include: ['js/**/*.js']
    },
    include: ['src/**/*.browser.test.ts'],
    retry: 0,
    browser: {
      enabled: true,
      screenshotFailures: false,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      viewport: {
        width: 1024,
        height: 1000
      }
    },
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/other-repo-code/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'
    ]
  },
  optimizeDeps: {
    include: [
      'vite-plugin-node-polyfills/shims/buffer',
      'vite-plugin-node-polyfills/shims/global',
      'vite-plugin-node-polyfills/shims/process'
    ]
  },
  plugins: [
    nodePolyfills({
      globals: { global: true, process: true }
    }) as Plugin
  ],
  cacheDir: './node_modules/.cache/vitest'
})
