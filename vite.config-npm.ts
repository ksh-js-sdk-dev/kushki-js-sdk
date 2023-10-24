import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
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
        Card: "src/module/Card.ts",
        Kushki: "src/module/Kushki.ts"
      },
      formats: ["cjs"]
    },
    rollupOptions: {
      output: {
        entryFileNames: () => {
          return "module/[name].js";
        }
      }
    }
  }
});
