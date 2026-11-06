import snapshot from "./trinity-facts.json";

/**
 * Trinity Redistricting figures for the portfolio, read from the synced snapshot of the
 * authoritative trinity-site data (see scripts/sync-trinity-facts.mjs). Never type a
 * Trinity figure directly into a page: add it to the sync list and read it from here.
 */
type Fact = {
  id: string;
  label: string;
  value: string;
  low?: number;
  high?: number;
  units?: string;
  meaning?: string;
  status: string;
  formula?: string;
};
const facts = snapshot.facts as Record<string, Fact>;

/** Typographic ranges: "1,450-1,600" → "1,450–1,600". */
export const dash = (s: string) => s.replace(/([\dMK%])-(\$?\d)/g, "$1–$2");

export const trinityRelease = snapshot.release;
export const trinitySource = snapshot.source;
export const tf = (id: string) => {
  const f = facts[id];
  if (!f) throw new Error(`Unknown Trinity fact ${id}; add it to scripts/sync-trinity-facts.mjs`);
  return { ...f, text: dash(f.value) };
};

/** Status labels as used on trinityredistricting.com. */
export const statusLabel: Record<string, string> = {
  external: "Externally supported fact",
  "owner-confirmed": "Owner-confirmed observation",
  assumption: "Authored planning assumption",
  calculated: "Calculated result",
  scenario: "Unapproved scenario",
  unresolved: "Unresolved",
  validated: "Professionally validated",
};

export const trinityFigures = {
  peaksBeds: tf("peaks_beds").text,
  riseBeds: tf("rise_beds").text,
  newBeds: tf("new_beds").text,
  replacedBeds: tf("replacement_beds").text,
  netNewBeds: tf("net_new_beds").text,
  capitalRange: tf("capital_range").text,
  riseHeight: "8–12 stories",
  zoningCeiling: "55 feet",
};
