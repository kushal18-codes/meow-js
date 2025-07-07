import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["test/**/*.test.ts"],
    transformMode: { web: [/\.ts$/, /\.js$/] },
    poolOptions: {
      threads: {
        singleThread: true,
        isolate: false,
      },
    },
  },
  resolve: {
    alias: {
      "~/": path.resolve(__dirname, "./src"),
    },
  },
});
