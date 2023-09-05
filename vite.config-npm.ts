import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { PreRenderedChunk } from "rollup";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        Card: "src/module/card/index.ts",
        Kushki: "src/index.ts"
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: (chunkInfo: PreRenderedChunk) => {
          if (chunkInfo.name === "Kushki") return "[name].js";

          return "module/[name]/[name].js";
        }
      }
    }
  },
  plugins: [
    dts({
      copyDtsFiles: true,
      exclude: ["src/**/*.spec.ts"],
      include: ["src"]
    }),
    react({ tsDecorators: true }),
    tsconfigPaths()
  ],
});
