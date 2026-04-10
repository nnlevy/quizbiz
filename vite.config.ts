import { defineConfig } from 'vite';

export default defineConfig({
  define: { __name: JSON.stringify('watershortcut'), global: 'globalThis' },
  build: { target: 'esnext' }
});