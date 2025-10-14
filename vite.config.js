import { defineConfig } from 'vite';

// Single-file self-contained build (bundles lit) for direct <script> usage (no type="module" needed).
export default defineConfig({
  build: {
    lib: {
      entry: 'src/planb.js',
      name: 'PlanB',
      formats: ['iife'],
      fileName: () => 'planb.js',
    },
    // Do NOT mark lit external so everything is bundled.
    minify: true,
    sourcemap: false,
  },
});
