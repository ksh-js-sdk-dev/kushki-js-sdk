import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        AntiFraud: "src/module/AntiFraud.ts",
        Card: "src/module/Card.ts",
        CardAnimation: "src/module/CardAnimation.ts",
        CardPayouts: "src/module/CardPayouts.ts",
        Kushki: "src/module/Kushki.ts",
        Merchant: "src/module/Merchant.ts",
        Transfer: "src/module/Transfer.ts"
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
  },
  plugins: [
    dts({
      copyDtsFiles: true,
      exclude: ["src/**/*.spec.ts"],
      include: ["src"]
    }),
    tsconfigPaths()
  ]
});
