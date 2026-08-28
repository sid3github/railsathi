/// <reference types="vitest/config" />
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { ROUTE_PATHS } from './src/routeManifest.ts'

// GitHub Pages has no SPA rewrite rule, so a deep link would fall through to
// 404.html and be served with a 404 status. The route set is known and fixed, so
// the build emits a real index.html at each path — every shared link gets a 200.
// 404.html still covers genuinely unknown paths.
function staticRoutes(): Plugin {
  let outDir = 'dist'
  return {
    name: 'railsathi-static-routes',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const root = resolve(process.cwd(), outDir)
      const index = resolve(root, 'index.html')
      if (!existsSync(index)) return

      copyFileSync(index, resolve(root, '404.html'))

      for (const path of ROUTE_PATHS) {
        if (path === '/') continue
        const target = resolve(root, `.${path}`, 'index.html')
        mkdirSync(dirname(target), { recursive: true })
        copyFileSync(index, target)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/railsathi/',
  plugins: [react(), staticRoutes()],
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
