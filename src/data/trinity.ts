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
  riseHeight: riseStories(),
  zoningCeiling: `${ceilingFeet()} feet`,
};

/** Story range from the synced Rise height fact, e.g. "8-12 stories (the author's ideal)" → "8–12 stories". */
function riseStories() {
  const m = tf("rise_height").value.match(/^(\d+-\d+) stories/);
  if (!m) throw new Error("rise_height no longer starts with a story range; update src/data/trinity.ts");
  return `${dash(m[1])} stories`;
}

/** Absolute height ceiling in feet from the synced zoning fact ("... an absolute 55-foot ceiling"). */
function ceilingFeet() {
  const m = tf("zoning_current").value.match(/absolute (\d+)-foot ceiling/);
  if (!m) throw new Error("zoning_current no longer states an absolute ceiling; update src/data/trinity.ts");
  return Number(m[1]);
}

/** The trinity-site commit the snapshot was copied from, for display. */
export const trinityPinned = { ...snapshot.pinned, short: snapshot.pinned.commit.slice(0, 7) };
export const trinityCeilingFt = ceilingFeet();
export const trinityRiseStoryRange = riseStories().replace(" stories", "");
