import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/module/"],
      exclude: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
      copyDtsFiles: true
    }),
    tsconfigPaths()
  ],
  build: {
    lib: {
      entry: {
        Kushki: "src/module/index.ts",
        Card: "src/module/card/index.ts"
      },
      formats: ["cjs", "es"]
    }
  }
});
