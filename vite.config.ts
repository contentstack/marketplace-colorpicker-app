import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    include: ["src/**/*.spec.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.spec.{ts,tsx}",
        "src/**/*.d.ts",
        "src/setupTests.ts",
        "src/test-utils/**",
        "src/common/types/**",
      ],
      thresholds: { lines: 99, branches: 96, functions: 100, statements: 99 },
    },
  },
  build: {
    outDir: "build",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
