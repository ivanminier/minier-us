#!/usr/bin/env node
// Prints the built portfolio presentation and résumé to PDF with the environment's
// Playwright + Chromium (not a project dependency). Run after `npm run build`; the PDFs are
// written to public/ so the next build ships them.
//
//   node scripts/render-pdfs.mjs
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json" };

const server = createServer(async (req, res) => {
  let p = join(DIST, decodeURIComponent(new URL(req.url, "http://x").pathname));
  try {
    if ((await stat(p)).isDirectory()) p = join(p, "index.html");
  } catch {
    p = p + ".html";
  }
  try {
    const body = await readFile(p); // read first, so a missing file can still get a 404
    res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.emulateMedia({ colorScheme: "light" });

// The admissions presentation is held back (src/pages/_portfolio); only print it when it is published.
const pf = await page.goto(`${base}/portfolio/trinity/`, { waitUntil: "networkidle" });
if (pf && pf.status() === 200) {
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(ROOT, "public", "ivan-minier-trinity-portfolio.pdf"), width: "11in", height: "8.5in", margin: { top: 0, right: 0, bottom: 0, left: 0 }, printBackground: true });
  console.log("wrote public/ivan-minier-trinity-portfolio.pdf");
} else console.log("skipped portfolio PDF (page not published)");

await page.goto(`${base}/resume/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: join(ROOT, "public", "ivan-minier-resume.pdf"), format: "Letter", preferCSSPageSize: true, printBackground: true });
console.log("wrote public/ivan-minier-resume.pdf");

await browser.close();
server.close();
