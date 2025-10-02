import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    globals: true,              
  },
});