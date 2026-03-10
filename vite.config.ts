import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  base: process.env.BASE_URL || "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": __dirname,
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== "true",
  },
});

