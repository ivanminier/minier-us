# Trinity Residential Design Studies — source files

Independent schematic studies by Ivan Minier, produced with AI assistance. They extend the portfolio. They are **not** UVM designs, not adopted parts of the Trinity Redistricting proposal (trinityredistricting.com), and not measured, code-reviewed, or construction drawings.

```text
studies/
  assumptions.json        assumption register: every dimension and ratio, sourced or exploratory
  plans/<id>.json         editable plan specs (the source of truth for each drawing)
  plans/history/<id>/vN   frozen earlier versions
  tools/plans.mjs         generator + geometry checker (no dependencies)
  tools/render-previews.mjs  PNG/PDF previews via the environment's Playwright
  model/                  whole-building test fit and Trinity Rise development model
public/studies/plans/<id>/  generated SVG, PNG, PDF, DXF, schedule CSV/JSON (do not hand-edit)
```

## Commands

```sh
npm run plans          # regenerate SVG, DXF, schedules, check reports, src/data/plans-index.json
npm run plans:render   # regenerate PNG and PDF previews (needs Playwright + Chromium)
npm run check          # Trinity facts sync check + plan geometry checks (fails on any error)
node studies/tools/plans.mjs --snapshot <id>   # freeze the current spec as history/<id>/v<version>.json
```

## Revising a plan from written feedback

You can give an AI assistant instructions in plain words. The assistant edits the JSON spec, not the drawing:

> "In the Peaks six-person suite, make the lounge 2 ft deeper and move Bath 2 next to Bath 1."
> "Rise Option A: swap the flex room for a third bathroom."
> "Peaks floor: replace suites N7 and N8 with an accessible suite and a second floor lounge."

The assistant should follow these steps:

1. **Freeze the current version.** Run `node studies/tools/plans.mjs --snapshot <id>`. This copies the spec to `plans/history/<id>/v<version>.json`.
2. **Bump `version`** in `studies/plans/<id>.json` (for example `"1"` → `"2"`) and set `date`.
3. **Edit the spec.** All units are feet, origin top-left, y downward.
   - `rooms[]`: `{id, name, type, rect:[x,y,w,h], beds}`. Moving a wall means changing the `rect` of every room on both sides of it.
   - `doors[]`: `{between:[roomA, roomB|"OUT"], at, width, swing, hinge, kind}`. `at` is the distance from the start of the shared wall. `kind:"opening"` has no door leaf.
   - `windows[]`: `{room, side:"N|S|E|W", at, width}`. Windows are only allowed on sides listed in `exterior`.
   - `items[]`: furniture and fixtures `{room, kind, rect, head}`. Kinds: bed, desk, wardrobe, sofa, table-round, wc, lav, shower, range, fridge, counter, washer, stair, elevator.
   - `instances[]` (floor plans): `{id, plan, at:[x,y], flipX, flipY}`. These place other plan specs, so a change to a suite updates every floor that uses it.
   - `declaredBeds` must equal the beds the rooms carry.
   - Add any new dimension rule to `studies/assumptions.json` and cite its id in `assumptions`.
4. **Regenerate and check.** Run `npm run plans` and then `npm run plans:render`. The checker reports overlapping rooms, doors not on a shared wall, rooms with no access, windows on interior walls, furniture outside rooms or overlapping, door swings hitting furniture, bed-count mismatches, low area per bed, and unassigned envelope area. Fix every error. Explain any remaining warning in `designNotes.open`.
5. **Record the change** in `studies/CHANGELOG.md`: what changed, whose instruction it was (owner feedback or AI suggestion), and the before/after beds and area.
6. **Keep authorship separate.** Owner decisions go in `designNotes.owner`, AI suggestions in `designNotes.ai`, and unresolved questions in `designNotes.open`.

Old versions stay downloadable. The generator names files `<id>-v<version>.*`. To keep an old drawing public, regenerate it from its history file. Old version files under `public/` are not deleted automatically.

## What the checker does not check

Building, fire, and accessibility codes; accessible clearances and turning circles; egress travel distance; structure, shafts, and mechanical space; daylight quality; or anything about the real Trinity site. Each of these needs professional review.

## Design rounds

Iterative design-round drafts (room and suite types, floor configurations) are developed privately and are not part of this repository yet. The generator supports them through opt-in spec fields (`round`, `partOf`, pocket doors, `use` clearance zones, `accessible`, `showClear`, `dimsAllSides`); round output goes to `studies/rounds/out/<round>/`, never to the public site. `studies/tools/round-sheets.mjs <round>` builds a review packet from `studies/rounds/<round>.json`.
