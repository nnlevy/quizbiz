import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command }) => {
  const cloudflareEnabled =
    process.env.WS_ENABLE_CLOUDFLARE === "true" || command === "build";

  return {
    define: {
      __name: 'watershortcut'
    },
    plugins: [react(), ...(cloudflareEnabled ? [cloudflare()] : [])],
    build: {
      minify: "esbuild",
      cssMinify: "esbuild",
      rollupOptions: {
        treeshake: true,
      },
    },
  };
});