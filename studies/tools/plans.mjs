#!/usr/bin/env node
// Trinity Residential Design Studies: schematic floor-plan generator.
//
// Reads editable plan specs (studies/plans/<id>.json), validates their geometry, and writes
// for each plan: SVG drawing, DXF (R12 ASCII, 1 unit = 1 foot), room/unit schedule (JSON + CSV),
// and a check report. No dependencies beyond Node.
//
//   node studies/tools/plans.mjs                 build every plan
//   node studies/tools/plans.mjs peaks-p4a       build one plan
//   node studies/tools/plans.mjs --check         validate only; exit 1 on any error
//   node studies/tools/plans.mjs --snapshot <id> copy the current spec into studies/plans/history/<id>/v<version>.json
//
// Round 1 additions (opt-in per spec): L-shaped rooms (`partOf`), pocket doors (`kind: "pocket"`),
// clearance zones (`use` side on items), accessible-room turning-space check (`accessible: true`),
// dimension chains on all sides (`dimsAllSides`), clearance drawing (`showClear`), and round outputs
// (`round`: written to studies/rounds/out/<round>/, never to the public site).
//
// Coordinates: feet, origin top-left, x to the right, y downward (SVG convention). The DXF
// flips y so north-up CAD viewers show the same picture. Orientation is NOT established:
// "top of sheet" is not north. These drawings are schematic explorations, not measured,
// code-reviewed, or construction drawings.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PLANS = join(ROOT, "studies", "plans");
// Held out of the public site until the studies are approved for publication (see
// docs/RELEASE-CANDIDATE.md). To publish, move studies/staging/public-studies back to public/studies.
const OUT = join(ROOT, "studies", "staging", "public-studies", "plans");
const EPS = 1e-6;

// ---------------------------------------------------------------- loading
const loadSpec = (id) => JSON.parse(readFileSync(join(PLANS, `${id}.json`), "utf8"));
const listSpecs = () =>
  readdirSync(PLANS)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -5))
    .sort();

const R = (r) => ({ x: r[0], y: r[1], w: r[2], h: r[3] });
const area = (r) => r.w * r.h;

/** Transform a rect by an instance placement (optional flips within the module's own bbox). */
function placeRect(r, inst, bbox) {
  let { x, y, w, h } = r;
  if (inst.flipX) x = bbox.x + bbox.w - (x - bbox.x) - w;
  if (inst.flipY) y = bbox.y + bbox.h - (y - bbox.y) - h;
  return { x: x - bbox.x + inst.at[0], y: y - bbox.y + inst.at[1], w, h };
}
const flipSide = (s, inst) =>
  inst.flipY && (s === "N" || s === "S") ? (s === "N" ? "S" : "N") : inst.flipX && (s === "E" || s === "W") ? (s === "E" ? "W" : "E") : s;

function bboxOf(rects) {
  const x0 = Math.min(...rects.map((r) => r.x));
  const y0 = Math.min(...rects.map((r) => r.y));
  const x1 = Math.max(...rects.map((r) => r.x + r.w));
  const y1 = Math.max(...rects.map((r) => r.y + r.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/**
 * Flatten a spec (and any module instances) into plain geometry:
 * rooms, doors (resolved to absolute segments), windows, items.
 */
function flatten(spec, prefix = "", inst = null, depth = 0) {
  if (depth > 3) throw new Error("instance nesting too deep");
  const rooms0 = (spec.rooms || []).map((r) => ({ ...r, rect: R(r.rect) }));
  const own = rooms0.length ? bboxOf(rooms0.map((r) => r.rect)) : { x: 0, y: 0, w: 0, h: 0 };
  const T = (rect) => (inst ? placeRect(rect, inst, inst.bbox) : rect);
  const out = { rooms: [], doors: [], windows: [], items: [], modules: [] };
  for (const r of rooms0) out.rooms.push({ ...r, id: prefix + r.id, local: r.id, partOf: r.partOf ? prefix + r.partOf : undefined, rect: T(r.rect), module: inst ? inst.label : null });
  const roomById = Object.fromEntries(out.rooms.map((r) => [r.id, r]));

  for (const d of spec.doors || []) {
    const a = prefix + d.between[0];
    const b = d.between[1] === "OUT" ? "OUT" : prefix + d.between[1];
    out.doors.push({ ...d, a, b, swing: d.swing === "OUT" ? "OUT" : d.swing ? prefix + d.swing : null, side: d.side ? (inst ? flipSide(d.side, inst) : d.side) : null, _inst: inst, _bboxOwn: own, id: prefix + (d.id || `${d.between.join("-")}`) });
  }
  for (const w of spec.windows || []) out.windows.push({ ...w, room: prefix + w.room, side: inst ? flipSide(w.side, inst) : w.side, _inst: inst });
  for (const it of spec.items || []) {
    const rect = T(R(it.rect));
    out.items.push({ ...it, room: prefix + it.room, rect, head: it.head ? (inst ? flipSide(it.head, inst) : it.head) : undefined, use: it.use ? (inst ? flipSide(it.use, inst) : it.use) : undefined });
  }
  for (const m of spec.instances || []) {
    const sub = loadSpec(m.plan);
    const subRooms = sub.rooms.map((r) => R(r.rect));
    const sb = bboxOf(subRooms);
    const label = `${m.id}`;
    const f = flatten(sub, `${m.id}.`, { ...m, bbox: sb, label }, depth + 1);
    out.rooms.push(...f.rooms);
    out.doors.push(...f.doors);
    out.windows.push(...f.windows);
    out.items.push(...f.items);
    out.modules.push({ id: m.id, plan: m.plan, title: sub.title, beds: f.rooms.reduce((s, r) => s + (r.beds || 0), 0), rect: placeRect(sb, { ...m, bbox: sb }, sb) }, ...f.modules);
  }
  // Resolve door segments now that all rooms are absolute.
  void roomById;
  return out;
}

/** Shared edge between two rects: {orient:'h'|'v', at, from, to} or null. */
function sharedEdge(p, q) {
  const ov = (a0, a1, b0, b1) => [Math.max(a0, b0), Math.min(a1, b1)];
  if (Math.abs(p.y + p.h - q.y) < EPS || Math.abs(q.y + q.h - p.y) < EPS) {
    const at = Math.abs(p.y + p.h - q.y) < EPS ? q.y : p.y;
    const [f, t] = ov(p.x, p.x + p.w, q.x, q.x + q.w);
    if (t - f > EPS) return { orient: "h", at, from: f, to: t };
  }
  if (Math.abs(p.x + p.w - q.x) < EPS || Math.abs(q.x + q.w - p.x) < EPS) {
    const at = Math.abs(p.x + p.w - q.x) < EPS ? q.x : p.x;
    const [f, t] = ov(p.y, p.y + p.h, q.y, q.y + q.h);
    if (t - f > EPS) return { orient: "v", at, from: f, to: t };
  }
  return null;
}
function sideEdge(r, side) {
  if (side === "N") return { orient: "h", at: r.y, from: r.x, to: r.x + r.w };
  if (side === "S") return { orient: "h", at: r.y + r.h, from: r.x, to: r.x + r.w };
  if (side === "W") return { orient: "v", at: r.x, from: r.y, to: r.y + r.h };
  return { orient: "v", at: r.x + r.w, from: r.y, to: r.y + r.h };
}

// ---------------------------------------------------------------- resolve + check
function resolve(spec) {
  const g = flatten(spec);
  const errors = [];
  const warnings = [];
  const roomById = Object.fromEntries(g.rooms.map((r) => [r.id, r]));
  const grp = (id) => roomById[id]?.partOf ?? id;
  const groupRects = (gid) => g.rooms.filter((r) => grp(r.id) === gid).map((r) => r.rect);
  const groupArea = (gid) => groupRects(gid).reduce((t, q) => t + area(q), 0);
  const bb = bboxOf(g.rooms.map((r) => r.rect));
  const exteriorSides = new Set(spec.exterior || []);
  const onBoundary = (e) =>
    (e.orient === "h" && (Math.abs(e.at - bb.y) < EPS || Math.abs(e.at - (bb.y + bb.h)) < EPS)) ||
    (e.orient === "v" && (Math.abs(e.at - bb.x) < EPS || Math.abs(e.at - (bb.x + bb.w)) < EPS));
  const boundarySide = (e) =>
    e.orient === "h" ? (Math.abs(e.at - bb.y) < EPS ? "N" : Math.abs(e.at - (bb.y + bb.h)) < EPS ? "S" : null) : Math.abs(e.at - bb.x) < EPS ? "W" : Math.abs(e.at - (bb.x + bb.w)) < EPS ? "E" : null;

  // Room overlaps.
  for (let i = 0; i < g.rooms.length; i++)
    for (let j = i + 1; j < g.rooms.length; j++) {
      const p = g.rooms[i].rect, q = g.rooms[j].rect;
      const ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x);
      const iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y);
      if (ix > EPS && iy > EPS) errors.push(`rooms overlap: ${g.rooms[i].id} and ${g.rooms[j].id}`);
    }

  // Doors → absolute segments + connectivity edges.
  const links = [];
  for (const d of g.doors) {
    const A = roomById[d.a];
    if (!A) { errors.push(`door ${d.id}: unknown room ${d.a}`); continue; }
    let edge;
    if (d.b === "OUT") {
      if (!d.side) { errors.push(`door ${d.id}: OUT door needs a side`); continue; }
      edge = sideEdge(A.rect, d.side);
    } else {
      const B = roomById[d.b];
      if (!B) { errors.push(`door ${d.id}: unknown room ${d.b}`); continue; }
      edge = sharedEdge(A.rect, B.rect);
      if (!edge) { errors.push(`door ${d.id}: ${d.a} and ${d.b} share no wall`); continue; }
    }
    const width = d.width ?? 3;
    // `at` is measured from the start of the room's edge in the module's own (unflipped) frame.
    let start;
    if (d.at === undefined) start = (edge.from + edge.to) / 2 - width / 2;
    else {
      const inst = d._inst;
      const flipped = inst && ((edge.orient === "h" && inst.flipX) || (edge.orient === "v" && inst.flipY));
      start = flipped ? edge.to - d.at - width : edge.from + d.at;
    }
    if (start < edge.from - EPS || start + width > edge.to + EPS)
      errors.push(`door ${d.id}: ${width}' opening does not fit the ${(edge.to - edge.from).toFixed(2)}' shared wall`);
    // Swing direction: +1 means toward increasing coordinate.
    let swingRoom = d.swing ?? d.a;
    let dir = 0;
    if (d.kind !== "opening" && d.kind !== "pocket") {
      if (swingRoom === "OUT") dir = d.side === "N" || d.side === "W" ? -1 : 1;
      else {
        const S = roomById[swingRoom];
        if (!S) { errors.push(`door ${d.id}: swing room ${swingRoom} unknown`); continue; }
        dir = edge.orient === "h" ? (S.rect.y + S.rect.h / 2 > edge.at ? 1 : -1) : (S.rect.x + S.rect.w / 2 > edge.at ? 1 : -1);
      }
    }
    let hingeAtStart = (d.hinge ?? "start") === "start";
    if (d._inst && ((edge.orient === "h" && d._inst.flipX) || (edge.orient === "v" && d._inst.flipY))) hingeAtStart = !hingeAtStart;
    d.seg = { orient: edge.orient, at: edge.at, from: start, to: start + width, dir, hingeAtStart, width };
    // Connectivity; an OUT door connects to whichever room lies across the edge, if any.
    let other = d.b;
    if (d.b === "OUT") {
      const across = g.rooms.find((r) => r.id !== A.id && (() => { const e = sharedEdge(A.rect, r.rect); return e && e.orient === edge.orient && Math.abs(e.at - edge.at) < EPS && e.from <= start + EPS && e.to >= start + width - EPS; })());
      other = across ? across.id : "OUTSIDE";
    }
    links.push([A.id, other]);
  }

  for (const r of g.rooms) if (r.partOf) links.push([r.id, r.partOf]);

  // Connectivity from the root.
  const root = spec.root ?? "OUTSIDE";
  const adj = new Map();
  for (const [a, b] of links) {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a).add(b);
    adj.get(b).add(a);
  }
  const seen = new Set([root]);
  const queue = [root];
  while (queue.length) for (const n of adj.get(queue.shift()) || []) if (!seen.has(n)) { seen.add(n); queue.push(n); }
  for (const r of g.rooms) if (!seen.has(r.id) && !r.noAccess) errors.push(`room ${r.id} (${r.name}) is not reachable from ${root}`);

  // Windows.
  for (const w of g.windows) {
    const A = roomById[w.room];
    if (!A) { errors.push(`window: unknown room ${w.room}`); continue; }
    const e = sideEdge(A.rect, w.side);
    const side = boundarySide(e);
    if (!onBoundary(e)) errors.push(`window in ${w.room}: ${w.side} wall is interior`);
    else if (exteriorSides.size && !exteriorSides.has(side)) errors.push(`window in ${w.room}: ${side} side is not an exterior wall in this module`);
    const width = w.width ?? 4;
    let start;
    if (w.at === undefined) start = (e.from + e.to) / 2 - width / 2;
    else start = w._inst && ((e.orient === "h" && w._inst.flipX) || (e.orient === "v" && w._inst.flipY)) ? e.to - w.at - width : e.from + w.at;
    if (start < e.from - EPS || start + width > e.to + EPS) errors.push(`window in ${w.room}: does not fit its wall`);
    w.seg = { orient: e.orient, at: e.at, from: start, to: start + width };
  }

  // Items inside rooms, no overlaps, clear of door swings.
  const inside = (r, R0) => r.x >= R0.x - EPS && r.y >= R0.y - EPS && r.x + r.w <= R0.x + R0.w + EPS && r.y + r.h <= R0.y + R0.h + EPS;
  const hit = (p, q) => Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x) > 0.01 && Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y) > 0.01;
  const insideUnion = (r, rects) => {
    if (rects.some((R0) => inside(r, R0))) return true;
    for (let x = r.x + 0.05; x < r.x + r.w; x += 0.25) for (let y = r.y + 0.05; y < r.y + r.h; y += 0.25) if (!rects.some((R0) => x >= R0.x - EPS && x <= R0.x + R0.w + EPS && y >= R0.y - EPS && y <= R0.y + R0.h + EPS)) return false;
    return true;
  };
  for (const it of g.items) {
    const A = roomById[it.room];
    if (!A) { errors.push(`item ${it.kind}: unknown room ${it.room}`); continue; }
    if (!insideUnion(it.rect, groupRects(grp(it.room)))) errors.push(`item ${it.kind} sits outside room ${it.room}`);
  }
  for (let i = 0; i < g.items.length; i++)
    for (let j = i + 1; j < g.items.length; j++)
      if (grp(g.items[i].room) === grp(g.items[j].room) && hit(g.items[i].rect, g.items[j].rect))
        errors.push(`items overlap in ${g.items[i].room}: ${g.items[i].kind} and ${g.items[j].kind}`);
  for (const d of g.doors) {
    if (!d.seg || d.seg.dir === 0) continue;
    const s = d.seg;
    const sw = s.orient === "h"
      ? { x: s.from, y: s.dir > 0 ? s.at : s.at - s.width, w: s.width, h: s.width }
      : { x: s.dir > 0 ? s.at : s.at - s.width, y: s.from, w: s.width, h: s.width };
    for (const it of g.items) if (hit(sw, it.rect)) errors.push(`door ${d.id} swing hits ${it.kind} in ${it.room}`);
    for (const d2 of g.doors) {
      if (d2 === d || !d2.seg || d2.seg.dir === 0 || d2.id < d.id) continue;
      const t = d2.seg;
      const sw2 = t.orient === "h" ? { x: t.from, y: t.dir > 0 ? t.at : t.at - t.width, w: t.width, h: t.width } : { x: t.dir > 0 ? t.at : t.at - t.width, y: t.from, w: t.width, h: t.width };
      if (hit(sw, sw2)) warnings.push(`door swings may clash: ${d.id} and ${d2.id}`);
    }
  }

  // Clearance zones (items with a `use` side): the floor a person needs to use the item.
  const CLEAR = { desk: 2.5, bed: 1.75, wardrobe: 2.0, dresser: 2.5, wc: 2.0, lav: 1.75, shower: 2.0, range: 3.5, counter: 3.5, sink: 3.5, fridge: 3.0, washer: 3.0, sofa: 1.5 };
  const swings = g.doors.filter((d) => d.seg && d.seg.dir !== 0).map((d) => { const t = d.seg; return { id: d.id, r: t.orient === "h" ? { x: t.from, y: t.dir > 0 ? t.at : t.at - t.width, w: t.width, h: t.width } : { x: t.dir > 0 ? t.at : t.at - t.width, y: t.from, w: t.width, h: t.width } }; });
  g.zones = [];
  for (const it of g.items.filter((i) => i.use)) {
    const dpt = it.clear ?? CLEAR[it.kind] ?? 2, q = it.rect;
    const z = it.use === "N" ? { x: q.x, y: q.y - dpt, w: q.w, h: dpt } : it.use === "S" ? { x: q.x, y: q.y + q.h, w: q.w, h: dpt } : it.use === "W" ? { x: q.x - dpt, y: q.y, w: dpt, h: q.h } : { x: q.x + q.w, y: q.y, w: dpt, h: q.h };
    g.zones.push({ item: it, rect: z });
    const gid = grp(it.room);
    if (!insideUnion(z, groupRects(gid))) errors.push(`clearance: ${it.kind} in ${it.room} needs ${dpt}' on its ${it.use} side but runs into a wall`);
    for (const o of g.items) if (o !== it && grp(o.room) === gid && hit(z, o.rect)) errors.push(`clearance: ${it.kind} in ${it.room} — its ${dpt}' use zone is blocked by ${o.kind}`);
    for (const sw of swings) if (hit(z, sw.r)) warnings.push(`clearance: ${it.kind} use zone in ${it.room} is crossed by door ${sw.id} swing`);
  }
  // Accessible rooms: a 5'-0" clear turning square must fit, and doors must be at least 3'-0".
  g.turning = [];
  for (const r of g.rooms.filter((r) => r.accessible && !r.partOf)) {
    const rects = groupRects(r.id), b = bboxOf(rects), its = g.items.filter((i) => grp(i.room) === r.id && !i.floorLevel); // roll-in showers count as usable floor
    let found = null;
    for (let x = b.x; x <= b.x + b.w - 5 + EPS && !found; x += 0.25)
      for (let y = b.y; y <= b.y + b.h - 5 + EPS && !found; y += 0.25) {
        const sq = { x, y, w: 5, h: 5 };
        if (insideUnion(sq, rects) && !its.some((i) => hit(sq, i.rect))) found = sq;
      }
    if (!found) errors.push(`accessible room ${r.id}: no 5'-0" clear turning space`);
    else g.turning.push({ room: r.id, rect: found });
    for (const d of g.doors) if ((grp(d.a) === r.id || grp(d.b) === r.id) && (d.width ?? 3) < 3 - EPS) errors.push(`accessible room ${r.id}: door ${d.id} is ${d.width}' wide (needs 3'-0")`);
  }

  // Beds and occupancy.
  const beds = g.rooms.reduce((s, r) => s + (r.beds || 0), 0);
  const bedItems = g.items.filter((i) => i.kind === "bed").length;
  if (spec.declaredBeds !== undefined && beds !== spec.declaredBeds) errors.push(`declared beds ${spec.declaredBeds} but rooms carry ${beds}`);
  if (!spec.instances?.length || g.items.some((i) => i.kind === "bed")) {
    for (const r of g.rooms.filter((r) => r.beds)) {
      const n = g.items.filter((i) => i.kind === "bed" && grp(i.room) === r.id).length;
      if (n !== r.beds) errors.push(`room ${r.id} declares ${r.beds} beds but draws ${n}`);
      if (!g.windows.some((w) => grp(w.room) === r.id)) warnings.push(`bedroom ${r.id} has no window`);
      const per = groupArea(r.id) / r.beds;
      if (per < (spec.minSfPerBed ?? 90)) warnings.push(`bedroom ${r.id}: ${per.toFixed(0)} sf per bed is below the ${spec.minSfPerBed ?? 90} sf study threshold`);
    }
  }
  void bedItems;

  // Schedule.
  const cat = (t) => ({ bedroom: "unit", bath: "unit", living: "unit", kitchen: "unit", suite: "unit", "suite-lounge": "unit", entry: "unit", hall: "unit", storage: "unit", laundry: "unit", study: "unit", corridor: "circulation", stair: "core", elevator: "core", mech: "core", trash: "core", lounge: "support", "floor-laundry": "support", ra: "residential", "study-room": "support", "staff": "residential" }[t] ?? "other");
  const rooms = g.rooms.filter((r) => !r.partOf).map((r) => { const parts = g.rooms.filter((q) => q.partOf === r.id); return { id: r.id, module: r.module, name: r.name, type: r.type, category: cat(r.type), width: r.rect.w, depth: r.rect.h, area: +groupArea(r.id).toFixed(1), beds: r.beds || 0, ...(parts.length ? { shape: "L" } : {}), ...(r.accessible ? { accessible: true } : {}) }; });
  const totals = {};
  for (const r of rooms) totals[r.category] = +((totals[r.category] || 0) + r.area).toFixed(1);
  const gross = +(bb.w * bb.h).toFixed(1);
  const schedule = {
    id: spec.id, title: spec.title, version: spec.version, date: spec.date, status: spec.status,
    envelope: { width: bb.w, depth: bb.h, grossArea: gross },
    beds, sumRoomArea: +rooms.reduce((s, r) => s + r.area, 0).toFixed(1), areaByCategory: totals,
    grossAreaPerBed: beds ? +(gross / beds).toFixed(1) : null,
    modules: summarizeModules(g.modules),
    rooms,
    assumptions: spec.assumptions || [],
  };
  if (Math.abs(schedule.sumRoomArea - gross) > 0.5) warnings.push(`rooms cover ${schedule.sumRoomArea} sf of a ${gross} sf envelope (${(gross - schedule.sumRoomArea).toFixed(1)} sf unassigned)`);
  return { g, bb, errors, warnings, schedule };
}

function summarizeModules(mods) {
  const by = {};
  for (const m of mods) {
    by[m.plan] ??= { plan: m.plan, title: m.title, count: 0, bedsEach: m.beds, beds: 0 };
    by[m.plan].count++;
    by[m.plan].beds += m.beds;
  }
  return Object.values(by);
}

// ---------------------------------------------------------------- drawing helpers
const ftin = (v) => {
  const tot = Math.round(v * 12);
  const f = Math.floor(tot / 12), i = tot - f * 12;
  return i ? `${f}'-${i}"` : `${f}'-0"`;
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const FILL = { void: "#ffffff", bedroom: "#f6f1e7", bath: "#e3edf0", living: "#f3ead8", kitchen: "#efe4cf", "suite-lounge": "#f3ead8", entry: "#ece6dc", hall: "#ece6dc", corridor: "#e2e0d8", stair: "#d9d6cc", elevator: "#d9d6cc", mech: "#d9d6cc", trash: "#d9d6cc", storage: "#e8e3d8", laundry: "#e3edf0", "floor-laundry": "#e3edf0", lounge: "#eaeedd", study: "#eaeedd", "study-room": "#eaeedd", ra: "#f1e3de", staff: "#f1e3de" };

/** Wall segments for a rect edge minus openings. */
function subtract(from, to, cuts) {
  const segs = [];
  let cur = from;
  for (const [a, b] of cuts.filter(([a, b]) => b > from && a < to).sort((p, q) => p[0] - q[0])) {
    if (a > cur + EPS) segs.push([cur, Math.min(a, to)]);
    cur = Math.max(cur, b);
  }
  if (to > cur + EPS) segs.push([cur, to]);
  return segs;
}

function geometry(res) {
  const { g, bb } = res;
  const lines = []; // {x1,y1,x2,y2,layer,weight}
  const gcuts = [];
  for (const r of g.rooms) for (const q of g.rooms) if (r !== q && (r.partOf ?? r.id) === (q.partOf ?? q.id)) { const e = sharedEdge(r.rect, q.rect); if (e) gcuts.push(e); }
  const cutsOn = (orient, at) => [...[...g.doors, ...g.windows].filter((o) => o.seg && o.seg.orient === orient && Math.abs(o.seg.at - at) < EPS).map((o) => [o.seg.from, o.seg.to]), ...gcuts.filter((e) => e.orient === orient && Math.abs(e.at - at) < EPS).map((e) => [e.from, e.to])];
  const edgeWeight = (orient, at) => {
    const ext = (orient === "h" && (Math.abs(at - bb.y) < EPS || Math.abs(at - bb.y - bb.h) < EPS)) || (orient === "v" && (Math.abs(at - bb.x) < EPS || Math.abs(at - bb.x - bb.w) < EPS));
    return ext ? "ext" : "int";
  };
  const seen = new Set();
  for (const r of g.rooms) {
    const { x, y, w, h } = r.rect;
    const edges = [["h", y, x, x + w], ["h", y + h, x, x + w], ["v", x, y, y + h], ["v", x + w, y, y + h]];
    for (const [o, at, f, t] of edges) {
      for (const [a, b] of subtract(f, t, cutsOn(o, at))) {
        const key = `${o}|${at.toFixed(3)}|${a.toFixed(3)}|${b.toFixed(3)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const wt = r.wallOverride ?? edgeWeight(o, at);
        lines.push(o === "h" ? { x1: a, y1: at, x2: b, y2: at, layer: "WALLS", weight: wt } : { x1: at, y1: a, x2: at, y2: b, layer: "WALLS", weight: wt });
      }
    }
  }
  return lines;
}

// ---------------------------------------------------------------- SVG
function svg(spec, res) {
  const { g, bb, schedule } = res;
  const s = spec.drawScale ?? 14; // px per foot
  const pad = 70, titleH = 150;
  const W = Math.max(bb.w * s + pad * 2, 1000), H = bb.h * s + pad * 2 + titleH;
  const ox = (W - bb.w * s) / 2; // centre narrow plans on the sheet
  const X = (v) => (ox + (v - bb.x) * s).toFixed(2);
  const Y = (v) => (pad + (v - bb.y) * s).toFixed(2);
  const wt = { ext: Math.max(1.0 * s, 3), int: Math.max(0.42 * s, 1.6) };
  const o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${W.toFixed(0)}" height="${H.toFixed(0)}" role="img" aria-labelledby="t d" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif"${spec.round ? ` data-crop="${Math.max(0, ox - 62).toFixed(0)} 0 ${(bb.w * s + 124).toFixed(0)} ${(bb.h * s + pad * 2).toFixed(0)}"` : ""}>`);
  o.push(`<title id="t">${esc(spec.title)} — schematic exploration v${spec.version}</title>`);
  o.push(`<desc id="d">${esc(spec.description || "")} ${schedule.beds} beds. Envelope ${ftin(bb.w)} by ${ftin(bb.h)} (${schedule.envelope.grossArea} sf) using exploratory dimensions. Not measured, not code reviewed, not for construction.</desc>`);
  o.push(`<rect width="100%" height="100%" fill="#fbfaf6"/>`);
  // Room fills.
  for (const r of g.rooms) o.push(`<rect x="${X(r.rect.x)}" y="${Y(r.rect.y)}" width="${(r.rect.w * s).toFixed(2)}" height="${(r.rect.h * s).toFixed(2)}" fill="${FILL[r.type] ?? "#f2f0ea"}"/>`);
  // Module outlines (floor plans).
  for (const m of g.modules || []) void m;
  // Items.
  for (const it of g.items) o.push(itemSvg(it, X, Y, s));
  // Clearance zones and accessible turning spaces (round sheets).
  if (spec.showClear) {
    for (const z of g.zones || []) o.push(`<rect x="${X(z.rect.x)}" y="${Y(z.rect.y)}" width="${(z.rect.w * s).toFixed(2)}" height="${(z.rect.h * s).toFixed(2)}" fill="#e8a23a" fill-opacity="0.13" stroke="#c9822a" stroke-width="0.8" stroke-dasharray="2 2"/>`);
    for (const t of g.turning || []) o.push(`<circle cx="${X(t.rect.x + 2.5)}" cy="${Y(t.rect.y + 2.5)}" r="${(2.5 * s).toFixed(2)}" fill="#3a7bd5" fill-opacity="0.08" stroke="#3a7bd5" stroke-width="1.1" stroke-dasharray="5 3"/><text x="${X(t.rect.x + 2.5)}" y="${(+Y(t.rect.y + 2.5) + 2.5 * s - 4).toFixed(1)}" text-anchor="middle" font-size="9.5" fill="#3a7bd5">5'-0" turning</text>`);
  }
  // Walls.
  for (const l of geometry(res)) o.push(`<line x1="${X(l.x1)}" y1="${Y(l.y1)}" x2="${X(l.x2)}" y2="${Y(l.y2)}" stroke="#26302b" stroke-width="${wt[l.weight].toFixed(2)}" stroke-linecap="square"/>`);
  // Windows.
  for (const w of g.windows) {
    const q = w.seg; if (!q) continue;
    const t = wt.ext;
    if (q.orient === "h") o.push(`<rect x="${X(q.from)}" y="${(+Y(q.at) - t / 2).toFixed(2)}" width="${((q.to - q.from) * s).toFixed(2)}" height="${t.toFixed(2)}" fill="#fbfaf6" stroke="#26302b" stroke-width="1"/><line x1="${X(q.from)}" y1="${Y(q.at)}" x2="${X(q.to)}" y2="${Y(q.at)}" stroke="#4d7f99" stroke-width="1.6"/>`);
    else o.push(`<rect x="${(+X(q.at) - t / 2).toFixed(2)}" y="${Y(q.from)}" width="${t.toFixed(2)}" height="${((q.to - q.from) * s).toFixed(2)}" fill="#fbfaf6" stroke="#26302b" stroke-width="1"/><line x1="${X(q.at)}" y1="${Y(q.from)}" x2="${X(q.at)}" y2="${Y(q.to)}" stroke="#4d7f99" stroke-width="1.6"/>`);
  }
  // Doors.
  for (const d of g.doors) {
    const q = d.seg; if (!q || d.kind === "opening") continue;
    if (d.kind === "pocket") {
      const pf = q.hingeAtStart ? q.from - q.width : q.to, pt = q.hingeAtStart ? q.from : q.to + q.width;
      if (q.orient === "h") o.push(`<line x1="${X(q.from)}" y1="${Y(q.at)}" x2="${X(q.to)}" y2="${Y(q.at)}" stroke="#26302b" stroke-width="2.2"/><line x1="${X(pf)}" y1="${Y(q.at)}" x2="${X(pt)}" y2="${Y(q.at)}" stroke="#fbfaf6" stroke-width="1" stroke-dasharray="3 2"/>`);
      else o.push(`<line x1="${X(q.at)}" y1="${Y(q.from)}" x2="${X(q.at)}" y2="${Y(q.to)}" stroke="#26302b" stroke-width="2.2"/><line x1="${X(q.at)}" y1="${Y(pf)}" x2="${X(q.at)}" y2="${Y(pt)}" stroke="#fbfaf6" stroke-width="1" stroke-dasharray="3 2"/>`);
      continue;
    }
    const hp = q.hingeAtStart ? q.from : q.to, op = q.hingeAtStart ? q.to : q.from;
    if (q.orient === "h") {
      const ly = q.at + q.dir * q.width;
      const sweep = (q.dir > 0) === q.hingeAtStart ? 1 : 0;
      o.push(`<line x1="${X(hp)}" y1="${Y(q.at)}" x2="${X(hp)}" y2="${Y(ly)}" stroke="#26302b" stroke-width="1.6"/><path d="M${X(hp)} ${Y(ly)} A${(q.width * s).toFixed(2)} ${(q.width * s).toFixed(2)} 0 0 ${sweep} ${X(op)} ${Y(q.at)}" fill="none" stroke="#26302b" stroke-width="0.9" stroke-dasharray="3 2"/>`);
    } else {
      const lx = q.at + q.dir * q.width;
      const sweep = (q.dir > 0) === q.hingeAtStart ? 0 : 1;
      o.push(`<line x1="${X(q.at)}" y1="${Y(hp)}" x2="${X(lx)}" y2="${Y(hp)}" stroke="#26302b" stroke-width="1.6"/><path d="M${X(lx)} ${Y(hp)} A${(q.width * s).toFixed(2)} ${(q.width * s).toFixed(2)} 0 0 ${sweep} ${X(q.at)} ${Y(op)}" fill="none" stroke="#26302b" stroke-width="0.9" stroke-dasharray="3 2"/>`);
    }
  }
  // Module labels on floor plans; room labels on module plans.
  const fs = Math.max(9, Math.min(15, s * 0.95));
  if (g.modules?.length) {
    for (const m of g.modules) {
      const cx = +X(m.rect.x + m.rect.w / 2), cy = +Y(m.rect.y + m.rect.h / 2);
      o.push(`<rect x="${X(m.rect.x)}" y="${Y(m.rect.y)}" width="${(m.rect.w * s).toFixed(2)}" height="${(m.rect.h * s).toFixed(2)}" fill="none" stroke="#8b4d36" stroke-width="1.4" stroke-dasharray="6 3"/>`);
      o.push(`<text x="${cx}" y="${cy - 3}" text-anchor="middle" font-size="${fs + 1}" font-weight="600" fill="#8b4d36" paint-order="stroke" stroke="#fbfaf6" stroke-width="3">${esc(m.id)}</text><text x="${cx}" y="${cy + fs + 1}" text-anchor="middle" font-size="${fs - 1}" fill="#8b4d36" paint-order="stroke" stroke="#fbfaf6" stroke-width="3">${m.beds} beds</text>`);
    }
    for (const r of g.rooms.filter((r) => !r.module)) {
      const cx = +X(r.rect.x + r.rect.w / 2), cy = +Y(r.rect.y + r.rect.h / 2);
      const small = r.rect.w * s < 90;
      o.push(`<text x="${cx}" y="${cy}" text-anchor="middle" font-size="${fs - (small ? 2 : 0)}" font-weight="600" fill="#26302b" paint-order="stroke" stroke="#fbfaf6" stroke-width="3"${small && r.rect.h > r.rect.w ? ` transform="rotate(-90 ${cx} ${cy})"` : ""}>${esc(r.short ?? r.name)}</text>`);
    }
  } else {
    for (const r of g.rooms.filter((r) => !r.partOf)) {
      const nParts = g.rooms.filter((q) => q.partOf === r.id).length;
      const [lx, ly] = r.labelAt ? [r.rect.x + r.labelAt[0], r.rect.y + r.labelAt[1]] : [r.rect.x + r.rect.w / 2, r.rect.y + r.rect.h / 2];
      const cx = +X(lx), cy = +Y(ly);
      const a = g.rooms.filter((q) => q.id === r.id || q.partOf === r.id).reduce((t, q) => t + area(q.rect), 0);
      const f2 = fs - 3.5;
      const lines = nParts ? [`${a.toFixed(0)} sf${r.beds ? ` · ${r.beds} bed${r.beds > 1 ? "s" : ""}` : ""}${r.accessible ? " · accessible" : ""}`] : a < 70 ? [`${a.toFixed(0)} sf`] : [`${ftin(r.rect.w)} × ${ftin(r.rect.h)}`, `${a.toFixed(0)} sf${r.beds ? ` · ${r.beds} bed${r.beds > 1 ? "s" : ""}` : ""}${r.accessible ? " · accessible" : ""}`];
      o.push(`<text x="${cx}" y="${cy - f2 * 0.6}" text-anchor="middle" font-size="${fs}" font-weight="600" fill="#26302b" paint-order="stroke" stroke="#fbfaf6" stroke-width="3.5">${esc(r.short ?? r.name)}</text>`);
      lines.forEach((t, i) => o.push(`<text x="${cx}" y="${(cy + f2 * 0.6 + (i + 0.4) * (f2 + 2)).toFixed(1)}" text-anchor="middle" font-size="${f2}" fill="#4a524d" paint-order="stroke" stroke="#fbfaf6" stroke-width="3">${t}</text>`));
    }
  }
  // Dimensions: overall + chain along the top.
  o.push(dims(spec, res, X, Y, s));
  // Title block.
  const ty = bb.h * s + pad * 2 + 6, L = 40;
  o.push(`<line x1="${L}" y1="${ty}" x2="${W - L}" y2="${ty}" stroke="#26302b" stroke-width="1"/>`);
  o.push(`<text x="${L}" y="${ty + 28}" font-size="20" font-weight="700" fill="#26302b">${esc(spec.title)}</text>`);
  o.push(`<text x="${L}" y="${ty + 50}" font-size="13" fill="#26302b">${esc(spec.subtitle || "")}</text>`);
  o.push(`<text x="${L}" y="${ty + 70}" font-size="13" fill="#26302b">${schedule.beds} beds · envelope ${ftin(bb.w)} × ${ftin(bb.h)} = ${schedule.envelope.grossArea.toLocaleString("en-US")} sf${schedule.grossAreaPerBed ? ` · ${schedule.grossAreaPerBed} sf per bed` : ""}</text>`);
  o.push(`<text x="${L}" y="${ty + 94}" font-size="11.5" fill="#8b4d36" font-weight="700">SCHEMATIC EXPLORATION · v${esc(spec.version)} · ${esc(spec.date)} · Dimensions are exploratory assumptions (studies/assumptions.json), not measurements.</text>`);
  o.push(`<text x="${L}" y="${ty + 112}" font-size="11" fill="#4a524d">Not code-reviewed, not an accessibility determination, not for construction. Orientation not established (no north arrow).</text>`);
  o.push(`<text x="${L}" y="${ty + 128}" font-size="11" fill="#4a524d">Independent student design study by Ivan Minier, drawn with AI assistance. Not a UVM design or an adopted part of the Trinity Redistricting proposal.</text>`);
  // Graphic scale of the assumed dimensions, top-right of the title block.
  const SL = s < 8 ? 50 : 10, half = SL / 2;
  const sbx = W - L - SL * s, sby = ty + 30;
  o.push(`<g aria-hidden="true"><rect x="${sbx}" y="${sby}" width="${half * s}" height="5" fill="#26302b"/><rect x="${sbx + half * s}" y="${sby}" width="${half * s}" height="5" fill="#fbfaf6" stroke="#26302b"/><text x="${sbx}" y="${sby - 5}" font-size="10" fill="#26302b">0</text><text x="${sbx + half * s}" y="${sby - 5}" font-size="10" fill="#26302b" text-anchor="middle">${half}</text><text x="${sbx + SL * s}" y="${sby - 5}" font-size="10" fill="#26302b" text-anchor="end">${SL} ft</text><text x="${sbx + SL * s}" y="${sby + 20}" font-size="9.5" fill="#4a524d" text-anchor="end">graphic scale of assumed dimensions</text></g>`);
  o.push(`</svg>`);
  return o.join("\n");
}

function dims(spec, res, X, Y, s) {
  const { g, bb } = res;
  const o = [];
  const tick = (x, y) => `<line x1="${(+x - 4).toFixed(1)}" y1="${(+y + 4).toFixed(1)}" x2="${(+x + 4).toFixed(1)}" y2="${(+y - 4).toFixed(1)}" stroke="#26302b" stroke-width="1.2"/>`;
  const hdim = (x1, x2, yOff, label) => {
    const y = (+Y(bb.y) - yOff).toFixed(1);
    o.push(`<line x1="${X(x1)}" y1="${y}" x2="${X(x2)}" y2="${y}" stroke="#26302b" stroke-width="0.8"/>${tick(X(x1), y)}${tick(X(x2), y)}`);
    o.push(`<text x="${((+X(x1) + +X(x2)) / 2).toFixed(1)}" y="${(+y - 5).toFixed(1)}" text-anchor="middle" font-size="10.5" fill="#26302b">${label}</text>`);
  };
  const vdim = (y1, y2, xOff, label) => {
    const x = (+X(bb.x) - xOff).toFixed(1);
    o.push(`<line x1="${x}" y1="${Y(y1)}" x2="${x}" y2="${Y(y2)}" stroke="#26302b" stroke-width="0.8"/>${tick(x, Y(y1))}${tick(x, Y(y2))}`);
    const cy = ((+Y(y1) + +Y(y2)) / 2).toFixed(1);
    o.push(`<text x="${(+x - 6).toFixed(1)}" y="${cy}" text-anchor="middle" font-size="10.5" fill="#26302b" transform="rotate(-90 ${(+x - 6).toFixed(1)} ${cy})">${label}</text>`);
  };
  hdim(bb.x, bb.x + bb.w, 46, ftin(bb.w));
  vdim(bb.y, bb.y + bb.h, 46, ftin(bb.h));
  if (!g.modules?.length || spec.chainDims !== false) {
    // Chain of top-row rooms (or modules on floor plans).
    const top = (g.modules?.length ? g.modules.map((m) => m.rect) : g.rooms.map((r) => r.rect)).filter((r) => Math.abs(r.y - bb.y) < EPS).sort((p, q) => p.x - q.x);
    const xs = [...new Set(top.flatMap((r) => [r.x, r.x + r.w]).map((v) => +v.toFixed(3)))].sort((a, b) => a - b);
    if (xs.length > 2) for (let i = 0; i < xs.length - 1; i++) hdim(xs[i], xs[i + 1], 22, (xs[i + 1] - xs[i]) * s < 34 ? "" : ftin(xs[i + 1] - xs[i]));
    const left = (g.modules?.length ? g.modules.map((m) => m.rect) : g.rooms.map((r) => r.rect)).filter((r) => Math.abs(r.x - bb.x) < EPS);
    const ys = [...new Set(left.flatMap((r) => [r.y, r.y + r.h]).map((v) => +v.toFixed(3)))].sort((a, b) => a - b);
    if (ys.length > 2) for (let i = 0; i < ys.length - 1; i++) vdim(ys[i], ys[i + 1], 22, (ys[i + 1] - ys[i]) * s < 34 ? "" : ftin(ys[i + 1] - ys[i]));
  }
  if (spec.dimsAllSides) {
    const rects = g.rooms.map((r) => r.rect);
    const by = +Y(bb.y + bb.h) + 22, rx = +X(bb.x + bb.w) + 22;
    const bot = [...new Set(rects.filter((r) => Math.abs(r.y + r.h - bb.y - bb.h) < EPS).flatMap((r) => [r.x, r.x + r.w]).map((v) => +v.toFixed(3)))].sort((a, b) => a - b);
    for (let i = 0; i < bot.length - 1; i++) {
      const [x1, x2] = [bot[i], bot[i + 1]];
      o.push(`<line x1="${X(x1)}" y1="${by}" x2="${X(x2)}" y2="${by}" stroke="#26302b" stroke-width="0.8"/>${tick(X(x1), by)}${tick(X(x2), by)}`);
      if ((x2 - x1) * s >= 34) o.push(`<text x="${((+X(x1) + +X(x2)) / 2).toFixed(1)}" y="${by + 14}" text-anchor="middle" font-size="10.5" fill="#26302b">${ftin(x2 - x1)}</text>`);
    }
    const rgt = [...new Set(rects.filter((r) => Math.abs(r.x + r.w - bb.x - bb.w) < EPS).flatMap((r) => [r.y, r.y + r.h]).map((v) => +v.toFixed(3)))].sort((a, b) => a - b);
    for (let i = 0; i < rgt.length - 1; i++) {
      const [y1, y2] = [rgt[i], rgt[i + 1]];
      o.push(`<line x1="${rx}" y1="${Y(y1)}" x2="${rx}" y2="${Y(y2)}" stroke="#26302b" stroke-width="0.8"/>${tick(rx, Y(y1))}${tick(rx, Y(y2))}`);
      const cy = ((+Y(y1) + +Y(y2)) / 2).toFixed(1);
      if ((y2 - y1) * s >= 34) o.push(`<text x="${rx + 14}" y="${cy}" text-anchor="middle" font-size="10.5" fill="#26302b" transform="rotate(90 ${rx + 14} ${cy})">${ftin(y2 - y1)}</text>`);
    }
  }
  return o.join("");
}

function itemSvg(it, X, Y, s) {
  const { x, y, w, h } = it.rect;
  const px = +X(x), py = +Y(y), pw = w * s, ph = h * s;
  const base = `<rect x="${px.toFixed(2)}" y="${py.toFixed(2)}" width="${pw.toFixed(2)}" height="${ph.toFixed(2)}" fill="#ffffff" stroke="#6b706b" stroke-width="0.9"/>`;
  const label = (t) => (Math.min(pw, ph) > 16 ? `<text x="${(px + pw / 2).toFixed(1)}" y="${(py + ph / 2 + 3).toFixed(1)}" text-anchor="middle" font-size="${Math.max(7, Math.min(9.5, s * 0.6))}" fill="#6b706b">${t}</text>` : "");
  switch (it.kind) {
    case "bed": {
      const head = it.head ?? "N";
      const pd = 0.9 * s;
      const pil = head === "N" ? [px + 3, py + 3, pw - 6, pd] : head === "S" ? [px + 3, py + ph - pd - 3, pw - 6, pd] : head === "W" ? [px + 3, py + 3, pd, ph - 6] : [px + pw - pd - 3, py + 3, pd, ph - 6];
      return base + `<rect x="${pil[0].toFixed(2)}" y="${pil[1].toFixed(2)}" width="${pil[2].toFixed(2)}" height="${pil[3].toFixed(2)}" rx="3" fill="none" stroke="#6b706b" stroke-width="0.8"/>`;
    }
    case "wardrobe":
      return base + `<line x1="${px}" y1="${py}" x2="${px + pw}" y2="${py + ph}" stroke="#9aa09a" stroke-width="0.7"/><line x1="${px + pw}" y1="${py}" x2="${px}" y2="${py + ph}" stroke="#9aa09a" stroke-width="0.7"/>`;
    case "shower":
      return base + `<line x1="${px}" y1="${py}" x2="${px + pw}" y2="${py + ph}" stroke="#9aa09a" stroke-width="0.7"/><line x1="${px + pw}" y1="${py}" x2="${px}" y2="${py + ph}" stroke="#9aa09a" stroke-width="0.7"/><circle cx="${px + pw / 2}" cy="${py + ph / 2}" r="${Math.max(2, s * 0.2)}" fill="none" stroke="#6b706b" stroke-width="0.8"/>`;
    case "wc":
      return base.replace('fill="#ffffff"', 'fill="#ffffff" rx="3"') + `<ellipse cx="${px + pw / 2}" cy="${py + ph * 0.62}" rx="${pw * 0.36}" ry="${ph * 0.3}" fill="none" stroke="#6b706b" stroke-width="0.8"/>`;
    case "lav":
    case "sink":
      return base + `<ellipse cx="${px + pw / 2}" cy="${py + ph / 2}" rx="${pw * 0.3}" ry="${ph * 0.3}" fill="none" stroke="#6b706b" stroke-width="0.8"/>`;
    case "range":
      return base + [0.3, 0.7].flatMap((a) => [0.3, 0.7].map((b) => `<circle cx="${px + pw * a}" cy="${py + ph * b}" r="${Math.min(pw, ph) * 0.13}" fill="none" stroke="#6b706b" stroke-width="0.8"/>`)).join("");
    case "table-round":
      return `<ellipse cx="${px + pw / 2}" cy="${py + ph / 2}" rx="${pw / 2}" ry="${ph / 2}" fill="#ffffff" stroke="#6b706b" stroke-width="0.9"/>`;
    case "stair": {
      let t = base;
      const n = Math.floor(it.rect.h / 0.92);
      for (let i = 1; i < n; i++) t += `<line x1="${px}" y1="${(py + (i * ph) / n).toFixed(2)}" x2="${px + pw}" y2="${(py + (i * ph) / n).toFixed(2)}" stroke="#9aa09a" stroke-width="0.6"/>`;
      return t;
    }
    case "elevator":
      return base + `<line x1="${px}" y1="${py}" x2="${px + pw}" y2="${py + ph}" stroke="#6b706b" stroke-width="0.8"/><line x1="${px + pw}" y1="${py}" x2="${px}" y2="${py + ph}" stroke="#6b706b" stroke-width="0.8"/>`;
    case "spiral": {
      const cx = px + pw / 2, cy = py + ph / 2, r = Math.min(pw, ph) / 2;
      let t = `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="#ffffff" stroke="#6b706b" stroke-width="0.9"/><circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(r * 0.16).toFixed(2)}" fill="none" stroke="#6b706b" stroke-width="0.8"/>`;
      for (let k = 0; k < 12; k++) { const an = (k / 12) * 2 * Math.PI; t += `<line x1="${(cx + Math.cos(an) * r * 0.16).toFixed(2)}" y1="${(cy + Math.sin(an) * r * 0.16).toFixed(2)}" x2="${(cx + Math.cos(an) * r).toFixed(2)}" y2="${(cy + Math.sin(an) * r).toFixed(2)}" stroke="#9aa09a" stroke-width="0.6"/>`; }
      return t + (Math.min(pw, ph) > 40 ? `<text x="${cx.toFixed(1)}" y="${(cy + r + 11).toFixed(1)}" text-anchor="middle" font-size="9" fill="#6b706b">spiral stair</text>` : "");
    }
    case "fridge": return base + label("REF");
    case "washer": return base + label("W/D");
    case "desk": return base + label("desk");
    case "sofa": return base.replace('fill="#ffffff"', 'fill="#ffffff" rx="4"');
    default: return base + label(it.label ?? "");
  }
}

// ---------------------------------------------------------------- DXF (R12 ASCII)
function dxf(spec, res) {
  const { g } = res;
  const out = [];
  const p = (...a) => out.push(...a.map(String));
  const Yf = (v) => -v; // flip to y-up
  const line = (x1, y1, x2, y2, layer) => p(0, "LINE", 8, layer, 10, x1.toFixed(4), 20, Yf(y1).toFixed(4), 30, 0, 11, x2.toFixed(4), 21, Yf(y2).toFixed(4), 31, 0);
  const rect = (r, layer) => { line(r.x, r.y, r.x + r.w, r.y, layer); line(r.x + r.w, r.y, r.x + r.w, r.y + r.h, layer); line(r.x + r.w, r.y + r.h, r.x, r.y + r.h, layer); line(r.x, r.y + r.h, r.x, r.y, layer); };
  const text = (x, y, h, s, layer) => p(0, "TEXT", 8, layer, 10, x.toFixed(4), 20, Yf(y).toFixed(4), 30, 0, 40, h, 1, String(s).replace(/[^\x20-\x7e]/g, "-"), 72, 1, 11, x.toFixed(4), 21, Yf(y).toFixed(4), 31, 0);
  const layers = ["WALLS", "WALLS-EXT", "DOORS", "WINDOWS", "FURNITURE", "FIXTURES", "ROOMS", "TEXT", "MODULES"];
  p(0, "SECTION", 2, "HEADER", 9, "$ACADVER", 1, "AC1009", 9, "$INSBASE", 10, 0, 20, 0, 30, 0, 0, "ENDSEC");
  p(0, "SECTION", 2, "TABLES", 0, "TABLE", 2, "LAYER", 70, layers.length);
  layers.forEach((l, i) => p(0, "LAYER", 2, l, 70, 0, 62, [7, 7, 1, 5, 8, 4, 9, 7, 6][i], 6, "CONTINUOUS"));
  p(0, "ENDTAB", 0, "ENDSEC", 0, "SECTION", 2, "ENTITIES");
  for (const l of geometry(res)) line(l.x1, l.y1, l.x2, l.y2, l.weight === "ext" ? "WALLS-EXT" : "WALLS");
  for (const w of g.windows) { const q = w.seg; if (!q) continue; if (q.orient === "h") { line(q.from, q.at - 0.2, q.to, q.at - 0.2, "WINDOWS"); line(q.from, q.at + 0.2, q.to, q.at + 0.2, "WINDOWS"); } else { line(q.at - 0.2, q.from, q.at - 0.2, q.to, "WINDOWS"); line(q.at + 0.2, q.from, q.at + 0.2, q.to, "WINDOWS"); } }
  for (const d of g.doors) {
    const q = d.seg; if (!q || d.kind === "opening") continue;
    const hp = q.hingeAtStart ? q.from : q.to, op = q.hingeAtStart ? q.to : q.from;
    let cx, cy, leaf, jamb; // angles in y-up degrees
    if (q.orient === "h") { cx = hp; cy = q.at; line(hp, q.at, hp, q.at + q.dir * q.width, "DOORS"); leaf = q.dir > 0 ? 270 : 90; jamb = op > hp ? 0 : 180; }
    else { cx = q.at; cy = hp; line(q.at, hp, q.at + q.dir * q.width, hp, "DOORS"); leaf = q.dir > 0 ? 0 : 180; jamb = op > hp ? 270 : 90; }
    const [a1, a2] = ((jamb - leaf + 360) % 360) === 90 ? [leaf, jamb] : [jamb, leaf];
    p(0, "ARC", 8, "DOORS", 10, cx.toFixed(4), 20, Yf(cy).toFixed(4), 30, 0, 40, q.width.toFixed(4), 50, a1, 51, a2);
  }
  for (const it of g.items) rect(it.rect, ["wc", "lav", "sink", "shower", "range", "fridge", "washer", "stair", "elevator", "counter", "tub"].includes(it.kind) ? "FIXTURES" : "FURNITURE");
  for (const m of g.modules || []) rect(m.rect, "MODULES");
  for (const r of g.rooms.filter((r) => !r.partOf)) {
    const cx = r.rect.x + r.rect.w / 2, cy = r.rect.y + r.rect.h / 2;
    if (!r.module || !g.modules?.length) text(cx, cy, Math.min(0.9, r.rect.w / 10), r.name, "TEXT");
    if (!r.module) text(cx, cy + 1.2, 0.55, `${(r.rect.w * r.rect.h).toFixed(0)} SF`, "TEXT");
  }
  const bb = res.bb;
  text(bb.x + bb.w / 2, bb.y + bb.h + 3, 1, `${spec.title} - SCHEMATIC v${spec.version} - EXPLORATORY DIMENSIONS - NOT FOR CONSTRUCTION - UNITS: FEET`, "TEXT");
  p(0, "ENDSEC", 0, "EOF");
  return out.join("\n") + "\n";
}

const g_has = (res, k) => (res.g[k] || []).length > 0;

// ---------------------------------------------------------------- main
const args = process.argv.slice(2);
if (args[0] === "--snapshot") {
  const id = args[1];
  const spec = loadSpec(id);
  const dir = join(PLANS, "history", id);
  mkdirSync(dir, { recursive: true });
  const dest = join(dir, `v${spec.version}.json`);
  if (existsSync(dest)) { console.error(`${dest} exists; bump "version" in the spec first.`); process.exit(1); }
  copyFileSync(join(PLANS, `${id}.json`), dest);
  console.log(`snapshot ${dest}`);
  process.exit(0);
}
const CHECK = args.includes("--check");
const ids = args.filter((a) => !a.startsWith("--"));
const targets = ids.length ? ids : listSpecs();
let failed = 0;
const index = [];
for (const id of targets) {
  const spec = loadSpec(id);
  const res = resolve(spec);
  const status = res.errors.length ? "FAIL" : "ok  ";
  console.log(`${status} ${id} v${spec.version}: ${res.schedule.beds} beds, ${res.schedule.envelope.grossArea} sf envelope, ${res.errors.length} errors, ${res.warnings.length} warnings`);
  for (const e of res.errors) console.log(`       error: ${e}`);
  for (const w of res.warnings) console.log(`       warn:  ${w}`);
  if (res.errors.length) failed++;
  if (CHECK) continue;
  const dir = spec.round ? join(ROOT, "studies", "rounds", "out", spec.round, "plans", id) : join(OUT, id);
  mkdirSync(dir, { recursive: true });
  const base = `${id}-v${spec.version}`;
  const svgText = svg(spec, res);
  const [, svgW, svgH] = svgText.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
  writeFileSync(join(dir, `${base}.svg`), svgText);
  writeFileSync(join(dir, `${base}.dxf`), dxf(spec, res));
  const extraChecks = [...(g_has(res, "zones") ? ["clearance zones (desk chair, bed side, fixture fronts, kitchen aisles, wardrobe doors) are inside the room and free of furniture"] : []), ...(g_has(res, "turning") ? ["accessible rooms fit a 5'-0\" clear turning square and have 3'-0\" doors (approximate; not an accessibility-code determination)"] : [])];
  const report = { ...res.schedule, checks: { errors: res.errors, warnings: res.warnings, checked: [...extraChecks, "rooms do not overlap", "every door sits on a wall shared by the rooms it joins and fits it", "every room is reachable from the entry/corridor", "windows only on declared exterior walls and fit them", "furniture and fixtures sit inside their room and do not overlap", "door swings are clear of furniture and fixtures", "declared beds equal beds drawn and beds counted", "bedroom area per bed against a study threshold", "room areas reconcile to the envelope"], notChecked: ["building, fire, or accessibility code compliance", "turning circles and accessible clearances", "structure, shafts, and mechanical space", "egress travel distance", "furniture fit beyond rectangle overlap"] } };
  writeFileSync(join(dir, `${base}.json`), JSON.stringify(report, null, 2) + "\n");
  const csv = ["id,module,name,type,category,width_ft,depth_ft,area_sf,beds", ...res.schedule.rooms.map((r) => [r.id, r.module ?? "", `"${r.name}"`, r.type, r.category, r.width, r.depth, r.area, r.beds].join(","))].join("\n");
  writeFileSync(join(dir, `${base}-schedule.csv`), csv + "\n");
  if (spec.round) continue; // round drafts are private: never in the public site index
  index.push({ id, version: spec.version, svgW, svgH, description: spec.description, designNotes: spec.designNotes, title: spec.title, subtitle: spec.subtitle, study: spec.study, option: spec.option, beds: res.schedule.beds, grossArea: res.schedule.envelope.grossArea, width: res.bb.w, depth: res.bb.h, grossAreaPerBed: res.schedule.grossAreaPerBed, files: { svg: `/studies/plans/${id}/${base}.svg`, png: `/studies/plans/${id}/${base}.png`, pdf: `/studies/plans/${id}/${base}.pdf`, dxf: `/studies/plans/${id}/${base}.dxf`, csv: `/studies/plans/${id}/${base}-schedule.csv`, json: `/studies/plans/${id}/${base}.json` }, warnings: res.warnings.length, areaByCategory: res.schedule.areaByCategory, modules: res.schedule.modules, rooms: res.schedule.rooms.filter(() => !spec.instances?.length) });
}
if (!CHECK && !ids.length) writeFileSync(join(ROOT, "src", "data", "plans-index.json"), JSON.stringify(index, null, 2) + "\n");
if (failed) { console.error(`${failed} plan(s) failed checks`); process.exit(1); }
