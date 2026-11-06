#!/usr/bin/env node
// Builds a design-review packet for one round: large side-by-side sheets (17 x 11 in) with plans,
// schedules, key metrics, check results, and decision cards; plus a PNG and PDF for every plan.
// Private working output: studies/rounds/out/<round>/ (never published to the site).
//
//   node studies/tools/plans.mjs && node studies/tools/round-sheets.mjs r1
//
// Uses the environment's Playwright + Chromium (not a project dependency).
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const round = process.argv[2] || "r1";
const R = JSON.parse(readFileSync(join(ROOT, "studies", "rounds", `${round}.json`), "utf8"));
const OUT = join(ROOT, "studies", "rounds", "out", round);
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const num = (v) => Math.round(v).toLocaleString("en-US");

function load(id) {
  const spec = JSON.parse(readFileSync(join(ROOT, "studies", "plans", `${id}.json`), "utf8"));
  const dir = join(OUT, "plans", id);
  const f = (ext) => join(dir, readdirSync(dir).find((x) => x.endsWith(ext) && !x.endsWith("-schedule.csv")));
  const rep = JSON.parse(readFileSync(f(".json"), "utf8"));
  const svgPath = f(".svg");
  const [, w, h] = readFileSync(svgPath, "utf8").match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
  const items = spec.items || [];
  const showers = items.filter((i) => i.kind === "shower").length, wcs = items.filter((i) => i.kind === "wc").length;
  return { id, spec, rep, svgPath, w, h, dir, showers, wcs };
}

function planBlock(p) {
  const s = p.rep, beds = s.beds;
  // Identical rooms (same name, size, beds) are grouped into one line with a count.
  const groups = new Map();
  for (const r of s.rooms) {
    const size = r.shape === "L" ? "L-shaped" : `${ftin(r.width)} × ${ftin(r.depth)}`;
    const k = [r.name, size, r.area, r.beds, !!r.accessible].join("|");
    if (!groups.has(k)) groups.set(k, { ...r, size, count: 0 });
    groups.get(k).count++;
  }
  const rows = [...groups.values()].map((r) => `<tr><td>${esc(r.name)}${r.accessible ? " <b class=acc>ACC</b>" : ""}</td><td>${r.size}</td><td class=n>${r.count}</td><td class=n>${num(r.area)}</td><td class=n>${r.beds ? r.beds * r.count : ""}</td></tr>`).join("");
  const metrics = [
    ["Envelope", `${ftin(s.envelope.width)} × ${ftin(s.envelope.depth)} = ${num(s.envelope.grossArea)} sf`],
    ...(beds ? [["Residents", beds], ["Area per resident", `${num(s.grossAreaPerBed)} sf`]] : []),
    ...(beds && p.showers ? [["Residents per shower", (beds / p.showers).toFixed(1)], ["Residents per WC", (beds / p.wcs).toFixed(1)]] : []),
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  const errs = s.checks.errors.length, warns = s.checks.warnings;
  return `<section class="plan">
    <h3>${esc(p.spec.option)} · ${esc(p.spec.title.replace(/^T\d-?\w* · /, ""))}</h3>
    <p class="sub">${esc(p.spec.description)}</p>
    <div class="pb"><img src="${cropped(p.svgPath)}" alt=""><div class="meta">
    <dl class="metrics">${metrics}</dl>
    <p class="checks ${errs ? "bad" : "good"}">Automatic checks: ${errs ? `${errs} errors` : "pass"} · geometry, door swings, furniture overlap, clearance zones${s.rooms.some((r) => r.accessible) ? ", accessible turning space" : ""}${warns.length ? `<br>Open notes: ${warns.map(esc).join("; ")}` : ""}</p>
    <table class="sched"><thead><tr><th>Room</th><th>Size</th><th class=n>No.</th><th class=n>sf each</th><th class=n>Beds</th></tr></thead><tbody>${rows}</tbody></table>
  </div></div></section>`;
}
/** The plan without its title block and side margins (sheets carry their own titles). */
function cropped(svgPath) {
  let t = readFileSync(svgPath, "utf8");
  const m = t.match(/data-crop="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/);
  if (m) t = t.replace(/viewBox="[^"]+" width="\d+" height="\d+"/, `viewBox="${m[1]} ${m[2]} ${m[3]} ${m[4]}"`);
  return "data:image/svg+xml;base64," + Buffer.from(t).toString("base64");
}
const ftin = (v) => { const t = Math.round(v * 12), f = Math.floor(t / 12), i = t - f * 12; return `${f}'-${i}"`; };

function card(sheet, plans) {
  const all = (k) => [...new Set(plans.flatMap((p) => p.spec.decision?.[k] || []))];
  const qs = all("questions");
  const li = (a) => a.map((x) => `<li>${esc(x)}</li>`).join("");
  return `<aside class="card">
    <div><h4>Your decisions applied</h4><ul>${li(all("ivan"))}</ul></div>
    <div><h4>My design choices (AI-drafted, for you to accept or change)</h4><ul>${li(all("ai"))}</ul></div>
    <div><h4>Invented here: please confirm</h4><ul>${li(all("invented"))}</ul></div>
    <div><h4>Questions (answer by code)</h4><ol class="q">${qs.map((q, i) => `<li><b>${sheet.code}-Q${i + 1}</b> ${esc(q)}</li>`).join("") || "<li>None</li>"}</ol></div>
  </aside>`;
}

const css = `@page{size:17in 11in;margin:0}*{box-sizing:border-box}body{margin:0;font:11pt/1.4 "IBM Plex Sans",Helvetica,Arial,sans-serif;color:#1f2b2c;background:#fff}
.sheet{width:17in;height:11in;padding:.45in .5in;page-break-after:always;display:flex;flex-direction:column;gap:.15in;overflow:hidden}
header{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #1f2b2c;padding-bottom:.06in}
header h1{font:600 20pt/1.1 Literata,Georgia,serif;margin:0}header h2{font:600 15pt/1.2 Literata,Georgia,serif;margin:0}header span{font-size:9pt;color:#8b4d36;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.body{display:flex;gap:.25in;flex:1;min-height:0}.plans{display:flex;gap:.2in;flex:1;min-width:0}.plans.stack{flex-direction:column}
.plan{flex:1;min-width:0;display:flex;flex-direction:column;gap:.05in;border:1px solid #d6d2c6;padding:.1in;background:#fbfaf6}
.plan h3{margin:0;font:600 12pt/1.2 Literata,Georgia,serif}.plan .sub{margin:0;font-size:8.5pt;color:#4a524d}
.plan img{width:100%;height:auto;max-height:5.6in;object-fit:contain;background:#fbfaf6}.pb{display:flex;flex-direction:column;gap:.06in;min-height:0}.meta{display:flex;flex-direction:column;gap:.05in}.plans.stack .pb{flex-direction:row;align-items:flex-start}.plans.stack .meta{width:34%}.plans.stack .plan img{max-height:3.55in;width:64%}
.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(1.3in,1fr));gap:2px 10px;margin:0;font-size:8.5pt}.metrics dt{color:#4a524d}.metrics dd{margin:0;font-weight:600}
.checks{margin:0;font-size:8pt}.checks.good{color:#24573a}.checks.bad{color:#a3333d}
.sched{border-collapse:collapse;font-size:7.5pt;width:100%}.sched th,.sched td{border-bottom:1px solid #e3dfd3;padding:1px 4px;text-align:left}.sched .n{text-align:right}
.acc{color:#3a7bd5;font-size:6.5pt}
.card{width:3.6in;flex-shrink:0;display:flex;flex-direction:column;gap:.1in;font-size:8.5pt;background:#f3efe6;padding:.14in}.card h4{margin:0 0 2px;font-size:9pt;color:#8b4d36}.card ul,.card ol{margin:0;padding-left:1.1em}.card li{margin-bottom:2px}
footer{font-size:7.5pt;color:#4a524d;border-top:1px solid #d6d2c6;padding-top:.05in}
.cover .grid{display:grid;grid-template-columns:1.2fr 1fr;gap:.4in;font-size:11pt}.cover table{border-collapse:collapse;width:100%;font-size:10pt}.cover td,.cover th{border-bottom:1px solid #ddd;padding:3px 6px;text-align:left}
.legend span{display:inline-block;margin-right:14px}.sw{display:inline-block;width:22px;height:12px;vertical-align:middle;margin-right:5px}`;

const foot = `Trinity Peaks design studies · ${esc(R.title)} · ${esc(R.date)} · Independent student study by Ivan Minier, drafted with AI assistance. Not a UVM design; not code-reviewed; exploratory dimensions; not for construction or publication. Informed by University Heights and CCRH typologies (UVM drawings not reproduced).`;

const sheets = R.sheets.map((sh) => ({ ...sh, P: sh.plans.map(load) }));
const confirmed = [["1", "Building is Trinity Peaks"], ["2", "3 RA rooms per floor per building"], ["3", "Front = dining-entrance side; J&J block + RA above each lobby"], ["4", "Middle towers straight (communal + pods); outer towers L-shaped (attached baths)"], ["5", "End suites floors 2–5: 4 bedrooms, living, 2 baths, no kitchen"], ["6", "Designed triples only, mainly odd ends and spiral-stair lofts"], ["7", "Floor 1: 2 staff/faculty apartments per building"], ["8", "Target 1,450–1,600 beds; drawings report what fits"], ["9", "Preferred tall design + ≤55-ft alternative"], ["10", "No UVM-drawing figures published"]];
let html = `<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>`;
html += `<div class="sheet cover"><header><h1>${esc(R.title)}</h1><span>Review packet · ${esc(R.date)}</span></header>
<div class="grid"><div><p>${esc(R.intro)}</p>
<h3>How to read the drawings</h3><p class="legend"><span><i class="sw" style="background:#e8a23a33;border:1px dashed #c9822a"></i>Use zone: floor needed to use a desk, bed, fixture, or appliance</span><br><span><i class="sw" style="border:1px dashed #3a7bd5;border-radius:6px"></i>5'-0" turning space in accessible rooms</span><br><span>Dashed arc = swing door · thick bar = pocket door · blue line = window</span></p>
<h3>What the checks do and don't mean</h3><p>The automatic checks confirm that rooms connect, doors fit, furniture and fixtures don't collide, every use zone is clear, and accessible rooms fit a turning space. They are <b>not</b> code compliance, accessibility certification, structure, egress, or professional review.</p>
<h3>Sheets</h3><table><tr><th>Code</th><th>Family</th><th>Options</th></tr>${sheets.map((s) => `<tr><td>${s.code}</td><td>${esc(s.title)}</td><td>${s.P.map((p) => esc(p.spec.option)).join(", ")}</td></tr>`).join("")}</table></div>
<div><h3>Your confirmed program (6 Nov)</h3><table>${confirmed.map(([n, t]) => `<tr><td>${n}</td><td>${esc(t)}</td></tr>`).join("")}</table>
<h3>Summary of options</h3><table><tr><th>Plan</th><th>Residents</th><th>Envelope</th><th>sf / resident</th></tr>${sheets.flatMap((s) => s.P).map((p) => `<tr><td>${esc(p.spec.title.split(" · ")[0])}</td><td>${p.rep.beds || "staff"}</td><td>${num(p.rep.envelope.grossArea)} sf</td><td>${p.rep.beds ? num(p.rep.grossAreaPerBed) : "—"}</td></tr>`).join("")}</table></div></div>
<footer>${foot}</footer></div>`;
for (const sh of sheets) {
  html += `<div class="sheet"><header><h2>${sh.code} · ${esc(sh.title)}</h2><span>${esc(R.title)}</span></header>
<div class="body"><div class="plans ${sh.layout === "stack" ? "stack" : ""}">${sh.P.map(planBlock).join("")}</div>${card(sh, sh.P)}</div><footer>${foot}</footer></div>`;
}
html += `</body></html>`;
mkdirSync(OUT, { recursive: true });
const htmlPath = join(OUT, `${round}-review.html`);
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1632, height: 1056 } });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" });
await page.pdf({ path: join(OUT, `Trinity-Peaks-${round.toUpperCase()}-review.pdf`), width: "17in", height: "11in", printBackground: true });
const n = await page.locator(".sheet").count();
for (let i = 0; i < n; i++) await page.locator(".sheet").nth(i).screenshot({ path: join(OUT, `sheet-${String(i).padStart(2, "0")}.png`) });
// Per-plan PNG (2x) and PDF.
for (const p of sheets.flatMap((s) => s.P)) {
  const pg = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 2 });
  await pg.goto(pathToFileURL(p.svgPath).href);
  const base = p.svgPath.replace(/\.svg$/, "");
  await pg.screenshot({ path: `${base}.png` });
  await pg.pdf({ path: `${base}.pdf`, width: `${p.w}px`, height: `${p.h}px`, printBackground: true, pageRanges: "1" });
  await pg.close();
}
await browser.close();
console.log(`wrote ${n} sheets and ${sheets.flatMap((s) => s.P).length} plan PNG/PDFs to ${OUT}`);
