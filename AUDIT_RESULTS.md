# Audit results — minier.us

Full visual, interaction, content and production audit run on branch
`audit/full-visual-qa`. Every defect below was confirmed in a real browser before
being fixed and re-confirmed afterwards. Per-defect detail, including root causes,
is in [`VISUAL_AUDIT.md`](./VISUAL_AUDIT.md). The asset-by-asset table is in
`.audit/reports/MEDIA_INVENTORY.md`.

## Summary

**26 defects found and fixed.**

| Severity | Count | What it covered |
| --- | --- | --- |
| Critical | 2 | Galleries destroyed on all mobile/tablet widths; LaundryLink represented by a failure state |
| Major | 7 | Grossly mis-scaled images, wrong `sizes`, wrong declared dimensions, a baked-in black frame, a 500px layout void, broken hero crops, two interaction faults |
| Moderate | 11 | Duplicate imagery, inverted device scale, missing captions, a retired tagline, cropped social cards, developer text in public copy, markup and SEO defects |
| Minor | 6 | Dead CSS, missing loading hints, over-fetched sources, a stale build script |

The audit also verified a long list of things that turned out to be **correct and
were left alone** — horizontal overflow, theme behaviour, the copy button, all
external links, every page's metadata and JSON-LD, and the 404 status code. Those
are listed at the end of `VISUAL_AUDIT.md`.

## Wrong or misrepresenting images corrected

| Page(s) | Was | Now | Why |
| --- | --- | --- | --- |
| `/`, `/work`, `/work/uvm-laundrylink`, `og/laundrylink.png` | `laundrylink/app.webp` — a capture of the live app reading "No Laundry Rooms Found" | `laundrylink/logo.webp` identity mark plus a factual note | The image advertised the product as broken. `api.uvmlaundry.com` returns Cloudflare 1033; there is no working state to capture and none was staged. |
| `/work/rental-record` gallery | `ipad-overview.webp` and `mac-cases.webp`, both already shown in the device row above | `ipad-room.webp`, `mac-inspection.webp`, `mac-report.webp` | The "Cases" screen appeared five times on one page. The new shots show different capabilities. |
| `/work/modeboard` gallery | four screenshots | five, adding `getting-started.webp` | An authentic screenshot that matched a capability section was sitting unused. |
| `/work/lineup` | top-shelf banner used as hero furniture on a near-black stage | banner moved into the gallery on the light page background, with a caption | Dark navy artwork was invisible on the cinematic card; it reads correctly on the light background. |
| `/`, `/work`, `/work/modeboard`, `/tideframe`, `og/modeboard.png` | Modeboard captures with a solid black matte baked in | re-imported from the official 1600×1207 captures, cropped to the window, corners transparent | ~10% of width and 13% of height was dead black inside a light card. |
| `/tideframe` | `lineup/icon.webp` (512px) for a 40px slot | `lineup/icon-256.webp` | A smaller authentic variant already existed and was unused. |

Rejected as a source after visual comparison:
`tideframe-site/design-source/screenshots-original/` holds 2184×1648 Modeboard
PNGs, but by content they are an older build (no Default profile, a "Setup" page
instead of "Getting Started"). Using them by filename would have shipped stale UI.

## Cropping and rendering fixes

| Page | Breakpoint | Issue | Solution |
| --- | --- | --- | --- |
| `/` hero | ≥901px | Lineup lost its status bar and was cut mid-poster; Rental Record was a 16%-wide slice of half-words; Modeboard lost its title bar | Each layer now carries its screenshot's aspect ratio; positions retuned so nothing overlaps into text |
| `/work/rental-record` | ≥1024px | portrait iPad rendered 1366×1821 | Frame and column span now come from the media's `presentation`, not its array index |
| `/tideframe` | ≥901px | portrait iPhone rendered 727×1579 | Branch on image orientation, not on the project's colour theme |
| `/work`, `/work/lineup`, `/work/rental-record`, `/work/modeboard`, `/work/trinity-redistricting` | ≤900px | gallery figures rendered 15×30px | `.gallery` container now collapses to one column, not just its figures |
| `/work` | ≥901px | Mac screenshot squeezed to ~120px by an empty third grid track | new two-column `.devices-pair` |
| `/work/rental-record` | ≥901px | device row read iPhone > iPad > Mac | track sizes and caps retuned to read iPhone → iPad → Mac |
| `/`, `/work/lineup` | ≥901px | ~500px of empty black in the Lineup card | stage rebuilt around real screenshots; hero given a compact centred stage |
| all pages with `srcset` | ≥1024px, 2× | small candidates chosen for full-width slots | `sizes` now derives from an explicit `presentation`, with per-site overrides |
| `og/rental-record.png`, `og/lineup.png`, `og/home.png`, `og/modeboard.png` | — | screenshots cropped at top and bottom with no safe margin | cards now fit the screenshot whole inside a margin |

## Spacing and layout fixes

- `.gallery` gained a larger row gap and `align-items: start` so captioned
  figures of different heights no longer stretch to match each other.
- `.devices-row` and the new `.devices-pair` were retuned for real device
  proportions and given responsive gaps.
- `/work/uvm-laundrylink`'s media block was centre-aligned while the rest of the
  page was left-aligned; it now matches.
- `/work/rental-record`'s device-row caption was inset relative to the images it
  described; both now use the same container.
- Dead layout CSS removed: `.composition`, `.phone`, `.paper`, `.shot-stack`,
  `.icon-lede`, `.media-stage.sticky`.

## Interaction fixes

- **Mobile menu, resize/rotate.** Opening the menu and then widening past 900px
  left `body { overflow: hidden }` in place with the toggle still reading
  "Close", so the page could not be scrolled. A `matchMedia` listener now closes
  it without stealing focus.
- **Mobile menu, focus trap in WebKit.** Tab escaped the open panel to the page's
  skip link and oscillated. The trap now drives the whole cycle explicitly rather
  than deferring to native sequential focus, and uses `getClientRects()` instead
  of `offsetParent` for its visibility test. Verified identical in both engines.

## Accessibility

- Focus containment in the mobile menu now works in WebKit, not only Chromium.
- Gallery images gained real `<figcaption>` text, and the nested `<figure>`
  inside `<figure>` markup was removed.
- Trinity's alt text now describes the district map's content rather than naming it.
- Lighthouse Accessibility is 100 on every page measured, before and after.

## Performance

Local production build, Lighthouse 13.4.1.

| Page | Form | Perf before | Perf after | LCP before | LCP after | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Desktop | 100 | 99 | 0.7s | 0.4s | 0 |
| `/` | Mobile | 97 | 99 | 2.6s | 1.7s | 0 |
| `/work/lineup` | Mobile | 100 | 100 | 1.4s | 1.3s | 0 |
| `/work/rental-record` | Mobile | — | 100 | — | 1.3s | 0 |
| `/work/modeboard` | Desktop | — | 100 | — | 0.4s | 0 |
| `/work/trinity-redistricting` | Desktop | 100 | 100 | 0.4s | 0.5s | 0 |

Accessibility, Best Practices and SEO are 100 on all six runs. The homepage is
212 KiB in total. Homepage desktop reads 99 on a Speed Index of 1.2s; FCP, LCP,
CLS and TBT all score 1.0. Homepage mobile improved because the hero images now
carry accurate `sizes` instead of defaulting to `100vw`.

Higher-resolution sources were added where the originals allowed it, but the
large candidates are only fetched by wide high-density displays and carry a lower
WebP quality, since they are downscaled roughly 1.7× when they render.

## Pages audited

`/`, `/work`, `/work/lineup`, `/work/rental-record`, `/work/modeboard`,
`/work/trinity-redistricting`, `/work/uvm-laundrylink`, `/tideframe`, `/about`,
`/ideas`, `/ideas/messy-catalogs`, `/ideas/housing-as-a-system`, `/contact`, and
a non-existent route to exercise the 404.

## Viewports tested

Screenshots at 320×568, 375×812, 390×844, 430×932, 768×1024, 834×1194, 1024×768,
1024×1366, 1280×800, 1366×768, 1440×900, 1512×982, 1728×1117, 1920×1080 — light
and dark at the phone, tablet and desktop anchors. Plus a programmatic sweep from
320px to 1920px in 20px steps on every page checking `scrollWidth > clientWidth`.

## Browsers

Chromium and WebKit, both via Playwright. WebKit found one defect Chromium did
not (the focus trap), which is why it was worth running.

## Remaining limitations

These are real and unresolved:

1. **LaundryLink still has no product screenshot.** The campus data feed is
   offline. Revisit when `api.uvmlaundry.com` is back; `laundrylink/app.webp` is
   kept in the repo for the swap.
2. **Modeboard screenshots are source-limited to 1436px** after the matte is
   removed. A full-width 2× display asks for ~2756px, so they render at ~0.52×.
   New captures from the Mac app would fix it.
3. **`lineup/topshelf.webp` (1600px)** and **`trinity/rise.webp` (1536px source)**
   are similarly source-limited, at ~0.58× and ~0.56×.
4. **Unused large originals still ship.** `lineup/icon.png` (760K) and
   `rental-record/icon.png` (376K) are pipeline sources that no page requests, but
   everything under `public/` is deployed. Left in place deliberately.
5. **Homepage desktop Lighthouse performance is 99, not 100**, on Speed Index alone.
