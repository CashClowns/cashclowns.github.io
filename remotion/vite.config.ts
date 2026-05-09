import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "preview-src"),
  base: "/preview/",
  build: {
    outDir: path.resolve(__dirname, "../preview"),
    emptyOutDir: true,
    target: "es2020",
  },
});
