import fs from "node:fs";

const threshold = Number(process.argv[2] ?? 0);
const summaryPath = "coverage/coverage-summary.json";

if (!fs.existsSync(summaryPath)) {
  console.error("Coverage summary not found at coverage/coverage-summary.json");
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
const linesPct = summary?.total?.lines?.pct;

if (typeof linesPct !== "number") {
  console.error("Coverage summary format is invalid.");
  process.exit(1);
}

if (linesPct < threshold) {
  console.error(`Coverage gate failed: ${linesPct}% < ${threshold}%`);
  process.exit(1);
}

console.log(`Coverage gate passed: ${linesPct}% >= ${threshold}%`);
