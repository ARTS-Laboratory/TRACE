import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Normal dev/build keeps the standalone demonstration page.
  // `vite build --mode renderer` builds the embeddable browser module.
  ...(mode === 'renderer' ? {
    base: '/static/intelligent-ui/',
    publicDir: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
      outDir: fileURLToPath(new URL('../../src/Web/static/intelligent-ui', import.meta.url)),
      // This directory contains generated renderer assets only.
      emptyOutDir: true,
      lib: {
        entry: fileURLToPath(new URL('./src/renderer.tsx', import.meta.url)),
        formats: ['es'],
        fileName: () => 'renderer.js',
        cssFileName: 'renderer',
      },
    },
  } : {}),
}))
