import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isGlobal = mode === 'global';
  return {
    define: {
      __BUILD_GLOBAL__: isGlobal,
    },
    build: {
      lib: {
        entry: 'src/widget.js',
        name: 'AlbatoWidget',
        fileName: isGlobal ? 'albato-widget-global' : 'albato-widget',
        formats: ['iife'],
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          extend: true,
        },
      },
      outDir: 'dist',
      emptyOutDir: !isGlobal,
    },
  };
});
