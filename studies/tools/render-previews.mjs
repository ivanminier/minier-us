#!/usr/bin/env node
// Renders PNG previews (2x) and single-page PDFs for every generated plan SVG, using the
// Playwright + Chromium already available in the environment (not a project dependency).
//
//   node studies/tools/render-previews.mjs            all plans listed in src/data/plans-index.json
//   PLAYWRIGHT_MODULE=/path/to/playwright node ...    use a specific Playwright install
//
// Run after `node studies/tools/plans.mjs`.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const index = JSON.parse(readFileSync(join(ROOT, "src", "data", "plans-index.json"), "utf8"));

const browser = await chromium.launch();
for (const p of index) {
  const STAGE = join(ROOT, "studies", "staging", "public-studies"); // see plans.mjs OUT
  const svgPath = join(STAGE, p.files.svg.replace(/^\/studies/, ""));
  const svg = readFileSync(svgPath, "utf8");
  const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(svgPath).href);
  await page.screenshot({ path: join(STAGE, p.files.png.replace(/^\/studies/, "")), omitBackground: false });
  // PDF: one page sized to the drawing.
  await page.pdf({ path: join(STAGE, p.files.pdf.replace(/^\/studies/, "")), width: `${w}px`, height: `${h}px`, printBackground: true, pageRanges: "1" });
  await page.close();
  console.log(`rendered ${p.id}`);
}
await browser.close();
