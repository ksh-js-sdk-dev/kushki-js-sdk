import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { PreRenderedChunk } from "rollup";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      include: ["src/module/"],
      exclude: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
      copyDtsFiles: true
    })
  ],
  build: {
    lib: {
      entry: {
        Kushki: "src/module/index.ts",
        Card: "src/module/card/index.ts"
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo: PreRenderedChunk) => {
          if (chunkInfo.name === "Kushki") return "[name].js";

          return "[name]/[name].js";
        }
      }
    }
  }
});
