/// <reference types="vitest/config" />
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// GitHub Pages serves project sites from a subpath and has no SPA rewrite rule,
// so a deep link like /railsathi/journey/refund would 404. Serving a copy of
// index.html as 404.html lets the router boot and resolve the path client-side.
function spaFallback(): Plugin {
  let outDir = 'dist'
  return {
    name: 'railsathi-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const index = resolve(process.cwd(), outDir, 'index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve(process.cwd(), outDir, '404.html'))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/railsathi/',
  plugins: [react(), spaFallback()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
