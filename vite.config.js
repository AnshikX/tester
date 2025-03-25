import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], //change based on framework
  server: {
    host: true,
    hmr: {
      host: "",
    },
    allowedHosts: [],
  },
  build: {
    outDir: "",
  },
});
