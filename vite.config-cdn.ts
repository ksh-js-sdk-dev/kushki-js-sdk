import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: {
        KushkiLib: "src/module/index.ts",
        KushkiCardLib: "src/module/card/index.ts"
      },
      formats: ["es"]
    },
    outDir: "lib",
    minify: true
  },
});
