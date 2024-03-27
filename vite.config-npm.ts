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
        AntiFraud: "src/module/AntiFraud.ts",
        Card: "src/module/Card.ts",
        Transfer: "src/module/Transfer.ts",
        Merchant: "src/module/Merchant.ts",
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
