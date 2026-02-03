import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/widget.js',
      name: 'AlbatoWidget',
      fileName: 'albato-widget',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        extend: true,
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
