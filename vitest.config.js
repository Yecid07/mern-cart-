import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["backend/tests/**/*.test.js"],
    environment: "node",
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "json-summary", "lcov"],
      include: ["backend/controllers/**/*.js"],
      exclude: ["backend/tests/**"]
    }
  }
});
