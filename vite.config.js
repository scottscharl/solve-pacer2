import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      "@components": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/components"
      ),
      "@hooks": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/hooks"
      ),
      "@routes": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/routes"
      ),
      "@contexts": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/contexts"
      ),
      "@lib": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/lib"
      ),
    },
  },
});
