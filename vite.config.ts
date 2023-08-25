import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import { PreRenderedChunk } from "rollup";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
        card: "src/module/card/index.ts"
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
