import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { PreRenderedChunk } from "rollup";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      include: ["src"],
      exclude: ["src/**/*.spec.ts"],
      copyDtsFiles: true
    }),
    tsconfigPaths()
  ],
  build: {
    lib: {
      entry: {
        Payment: "src/module/index.ts",
        Kushki: "src/index.ts"
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo: PreRenderedChunk) => {
          if (chunkInfo.name === "Kushki") return "[name].js";

          return "module/[name].js";
        }
      }
    }
  }
});
