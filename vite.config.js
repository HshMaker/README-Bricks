import { defineConfig } from "vite";

export default defineConfig({
  base: "/README-Bricks/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "main.html"),
        index: resolve(__dirname, "index.html"),
      },
    },
  },
});
