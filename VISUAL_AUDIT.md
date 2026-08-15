# Visual audit — minier.us

Every defect found during the full visual/interaction QA pass on
`audit/full-visual-qa`, with its root cause and repair. Each entry was confirmed
in a real browser before the fix and re-confirmed after it.

Before/after screenshots live in `.audit/before/` and `.audit/after/` (gitignored),
captured at 14 viewports from 320×568 to 1920×1080, in light and dark, in Chromium
and WebKit.

---

## Critical

### C1 — Project galleries collapsed to 15px slivers on every phone and tablet

**Pages** `/work/lineup`, `/work/rental-record`, `/work/modeboard`, `/work/trinity-redistricting`
**Viewport** every width ≤ 900px (verified 320, 375, 390, 430, 768, 834, 900)
**Confirmed on production** yes — `https://minier.us/work/rental-record` at 390px returned six `15×30px` figures

**Problem.** The gallery on all four project pages rendered every screenshot at
about 15×30 pixels on a phone and 43×94 on a tablet. Six unreadable slivers in a
row where the project gallery should be.

**Root cause.** `src/styles/global.css` — the `max-width: 900px` block reset
`.gallery figure` and `.gallery figure.wide` to `grid-column: span 1`, but never
reset the `.gallery` container itself, which stayed at
`grid-template-columns: repeat(12, 1fr)`. Each figure therefore occupied one
twelfth of the width instead of the whole of it.

**Fix.** Move `.gallery` into the single-column list in that media query and
change the figures to `grid-column: auto`.

**Verified.** Minimum figure width across the four pages at 320px went from 13px
to 283px; at 768px from 43px to 722px.

---

### C2 — LaundryLink was represented by a failure state

**Pages** `/`, `/work`, `/work/uvm-laundrylink`, and the social card
**Confirmed on production** yes

**Problem.** The only LaundryLink image on the site was a capture of the live app
showing **"No Laundry Rooms Found — We couldn't find any laundry rooms at the
moment."** It appeared as the flagship product shot on three pages, and was baked
into `og/laundrylink.png` directly beside the headline "See what is open first."
The alt text described "the live campus interface" and the caption claimed "This
is the actual product interface."

**Root cause.** The screenshot was taken while the campus data feed was down. I
verified the feed is still down: `https://api.uvmlaundry.com/rooms` returns
Cloudflare error 1033, and the live site renders "Could Not Update Data".

**Fix.** LaundryLink is now shown by its authentic identity mark
(`laundrylink/logo.webp`, from the live deployment) in a `.mark-card`, with a
plain statement of the actual situation on the project page: the site is live,
the campus machine feed it reads from is offline, and interface screenshots
return when the feed does. The social card uses the mark too.

No populated screen was staged — the project repository contains no screenshots
or fixtures, and fabricating a working state was not an option.

**Open.** When `api.uvmlaundry.com` is back, capture the real room and machine
views and restore a product screenshot. `laundrylink/app.webp` is kept in the
repo for that swap.

---

## Major

### M1 — `/tideframe` rendered a phone screenshot 727×1579

**Viewport** ≥ 901px
**Problem.** Rental Record's portrait iPhone capture rendered 727px wide and
1579px tall — more than twice the height of the Lineup and Modeboard rows above
and below it, with roughly 700px of empty column beside its copy.

**Root cause.** `src/pages/tideframe.astro` branched on `project.theme ===
'cinematic'` to decide between the width-capped `.device-phone` and the uncapped
`.shot`. Rental Record's theme is `paper`, so its portrait screenshot landed in
`.shot`, which has no maximum width.

**Fix.** Branch on the shape of the image (`hero.width < hero.height`) rather
than the colour theme, and give non-cinematic phones a neutral
`.device-frame-stage`. The phone is now capped at 280px.

---

### M2 — `/work/rental-record` blew the iPad screenshot up to 1366×1821

**Viewport** ≥ 1024px
**Problem.** A portrait iPad capture rendered at full container width and 1821px
tall, taller than the viewport, with the app content in the top portion and a
large empty area below.

**Root cause.** The gallery assigned `class="wide"` (span 12) by array index —
`index > 2` — which caught the portrait iPad entry along with the two landscape
Mac entries.

**Fix.** Drive the frame and span from the media's own `presentation`
(`device` / `tablet` / `screen`) instead of its index, and give tablets a
`.device-tablet` container capped at 520px.

---

### M3 — `sizes` was wrong for every full-width image, so blurry sources were chosen

**Pages** `/work/modeboard`, `/work/trinity-redistricting`, `/work/rental-record`
**Viewport** ≥ 1024px, worst on 2× displays

**Problem.** The Modeboard and Trinity heroes were visibly soft. Measured: an
800px-wide source rendering at 1298 CSS px on a 2× display — 0.31× the pixels
needed. The Mac screenshots picked the 960px candidate for a 1378px slot.

**Root cause.** `ProjectMedia.astro` hard-coded
`sizes="(max-width: 700px) 92vw, 720px"` for every image, while several render at
the full 1380px container width.

**Fix.** `sizes` now derives from an explicit `presentation` on the media
(`device` 360px, `tablet` 520px, `screen`/`editorial` full container), with a
per-call-site override for narrower slots. Also re-imported the official
higher-resolution sources: Modeboard 1600px originals, Rental Record's official
440/880/1320 (iPhone), 516/1032/1548 (iPad) and 960/1440/2560 (Mac) ladders, and
Trinity from the 2466–4096px site originals.

**Verified.** Every full-width image except the source-limited ones listed under
"Remaining" now resolves at ≥ 0.85× of the pixels a 2× display asks for.

---

### M4 — Declared dimensions did not match the files, reserving the wrong box

**Problem.** Thirteen images declared `width`/`height` attributes that disagreed
with the actual file, so the browser reserved a differently-shaped box and
reflowed on load. Worst offenders:

| Image | Declared | Actual | Error |
| --- | --- | --- | --- |
| `trinity/home-hero.webp` | 1600×1000 | 1600×633 | 37% |
| `laundrylink/app.webp` | 780×1694 | 780×1492 | 12% |
| `trinity/peaks.webp` | 1400×900 | 1400×800 | 11% |
| `trinity/cottages.webp` | 1400×900 | 1400×824 | 8% |
| `trinity/rise.webp` | 1400×900 | 1400×933 | 4% |
| `lineup/topshelf.webp` | 1600×480 | 1600×497 | 3.5% |
| `trinity/map.webp` | 1400×900 | 1400×886 | 1.6% |
| all four Lineup phones | 900×1950 | 900×1957 | 0.6% |

**Fix.** Corrected every declaration in `src/data/projects.ts` and in the two
inline `<img>` tags, and documented on the type that these must match the file.

**Verified.** The dimension check now reports "all declared dimensions match the
files"; CLS is 0 on every Lighthouse run.

---

### M5 — Modeboard screenshots shipped with a baked-in black frame

**Pages** `/`, `/work`, `/work/modeboard`, `/tideframe`, and the social card

**Problem.** All six Modeboard captures were the macOS window composited on solid
black with 69px left/right, 48px top and ~93px bottom margins — about 10% of the
width and 13% of the height was dead black. Placed inside the site's warm
off-white rounded `.shot` card, that read as an unintended second frame with the
card's radius clipping black corners, and the window sat visibly off-centre
because the top and bottom margins differed.

**Fix.** Re-imported from the official 1600×1207 captures, cropped to the window,
and flood-filled the rounded-corner residue to transparent so the card surface
shows through in both themes. Result: 1436×1046 with no matte.

**Note.** `tideframe-site/design-source/screenshots-original/` holds 2184×1648
PNGs, but comparing them by content rather than filename shows they are an older
Modeboard build (no Default profile, a "Setup" page instead of "Getting Started").
They were not used.

---

### M6 — The Lineup block left ~500px of empty black

**Pages** `/` and `/work/lineup`
**Viewport** ≥ 901px

**Problem.** `.lineup-stage` put a 780px-tall phone beside a 3.2:1 banner 262px
tall in an `align-items: end` row, leaving roughly 500px of empty black above the
banner — about 40% of the flagship project's card. The banner is dark navy
artwork and was close to invisible against the near-black stage.

**Fix.** The homepage stage now carries three real product screenshots (Sources →
Home → Edit Home), which fills the wide band and matches the copy. The
`/work/lineup` hero is a compact centred stage holding the Home screenshot, and
the Apple TV top-shelf banner moved into the gallery as a full-width figure on
the light page background, where its artwork is legible, with a caption naming
what it is.

---

### M7 — The homepage hero cropped three of its four screenshots

**Viewport** ≥ 901px

**Problem.** Each hero layer had a fixed percentage height with
`object-fit: cover`, so:

- **Lineup** lost the iPhone status bar at the top and was cut mid-poster at the
  bottom, with the tab bar gone.
- **Rental Record** was a 16%-wide vertical slice showing half-words —
  "…ases", "…tinue Current Inspection", "…ple Street Apartment" — and was mostly
  hidden behind Lineup. It read as a half-loaded card.
- **Modeboard** lost the window title bar and traffic lights.

This is the distinction the brief asks for: an intentional composition crop keeps
the subject whole and lets the frame decide where the picture ends, whereas these
cut through UI chrome and words. They were broken crops, not art direction.

**Fix.** Every layer now carries the aspect ratio of the screenshot inside it, so
the overlap is the composition and nothing is cropped. Positions were retuned so
Rental Record no longer sits under Lineup at all — a small overlap clipped the
first character off every label, which looks like a fault rather than a stack, so
the depth now comes from the offset baseline and shadow instead.

**Verified.** At 1024, 1280, 1440 and 1920 all four screenshots render complete
and legible.

---

### M8 — Opening the mobile menu then widening the window locked page scrolling

**Problem.** With the menu open, resizing or rotating past 900px hid the panel by
CSS but left `body { overflow: hidden }` and the toggle reading "Close". The page
could not be scrolled.

**Fix.** A `matchMedia('(min-width: 901px)')` listener closes the menu and
releases the scroll lock, without stealing focus.

---

### M9 — The mobile menu focus trap did not hold in WebKit

**Found by** testing in Playwright WebKit as well as Chromium.

**Problem.** In WebKit, Tab from the first menu item escaped the open panel to
the page's skip link and then oscillated between the skip link and the close
button. Chromium was unaffected, so this only showed up in the Safari-family
engine — the one Ivan actually uses.

**Root cause.** The trap only intercepted Tab when focus was on the first or last
item and otherwise deferred to native sequential focus, which orders things
differently inside a fixed-position panel in WebKit. A related `offsetParent`
check for visibility is also unreliable there.

**Fix.** Drive the whole cycle explicitly — compute the index and move with
wraparound on every Tab — and use `getClientRects()` for the visibility test.

**Verified.** Identical, contained cycles in both engines:
`Work → Tideframe → About → Ideas → Contact → Theme → Close → Work`.

---

## Moderate

### Md1 — The same screen appeared five times on `/work/rental-record`
The "Cases" screen was shown as iPhone, iPad and Mac in the device row, and then
the iPad and Mac versions were repeated in the gallery below. Split the device
row into its own `devices` field so the gallery no longer reuses it, and gave the
gallery different screens: iPad room, Mac inspection, Mac report.

### Md2 — Device scale was inverted
`.devices-row` used `0.7fr / 1fr / 1.2fr` while `.device-phone` capped at 360px,
which made the iPhone the tallest element and the Mac the smallest. Retuned to
`0.62fr / 0.92fr / 1.6fr` with a 260px phone and 420px tablet cap so the row
reads iPhone → iPad → Mac.

### Md3 — `/work` squeezed the Mac screenshot to ~120px
The Rental Record teaser used `.devices-row`, a three-column grid, with only two
children, so the 1.6fr track sat empty and the Mac window was unreadable. Added a
two-column `.devices-pair`.

### Md4 — No captions anywhere
`caption` was supported by the component but never populated, so the Trinity
gallery showed four unlabelled renderings while the copy names Peaks, Rise, Way
and the Cottages, and the Modeboard and Rental Record galleries gave no
indication which capability each screen demonstrated. Captions added throughout.

### Md5 — Modeboard led with a retired tagline
`/work/modeboard` opened with "Every Focus deserves its own Mac.", which
`PROJECT_INVENTORY.md` itself flags as not on the current official site. Removed;
the current official line was already the page's `h1`.

### Md6 — Social cards cropped their screenshots
`og/rental-record.png` cut the iPhone capture off at both the top and bottom with
no safe margin. All product cards now fit the screenshot whole inside a margin
instead of cropping it, and `og/modeboard.png` was re-cut because removing the
black matte changed the source aspect.

### Md7 — `/ideas` published a developer instruction
The public page read "Add a Markdown file in `src/content/ideas` to publish
another one." Removed.

### Md8 — Nested `<figure>` elements
`ProjectMedia` emitted a `<figure>` that pages then wrapped in another `<figure>`.
The component now emits a bare `<img>` and pages own the figure and caption.

### Md9 — The 404 page advertised a canonical URL
`404.html` emitted `<link rel="canonical" href="https://minier.us/404/">`, a
soft-404 signal. It now emits `<meta name="robots" content="noindex">` instead.
The route still returns a real HTTP 404.

### Md10 — Icons could be stretched by the flex row
`/tideframe` set `width`/`height` inline on the project icons inside a flex
`.meta-row`, where the default `align-items: stretch` can distort them. Added an
explicit `.meta-icon` rule with `flex: none` and `align-self: center`.

### Md11 — The Lineup phone had no edge on the cinematic stage
`.device-phone`'s `#0b0d10` background against `.cinematic`'s `#0d1114` gave the
device no separation. Added a light border and deeper shadow inside `.cinematic`.

---

## Minor

- Dead CSS removed: `.composition`, `.phone`, `.paper`, `.shot-stack`,
  `.icon-lede`, `.media-stage.sticky`.
- `/tideframe` images had no `loading`, `decoding` or `srcset`; they now go
  through `ProjectMedia`.
- The homepage hero layers had no `sizes`, so the browser assumed `100vw` and
  fetched the 1320px Rental Record capture for a 226px slot.
- `lineup/icon-256.webp` existed but was unused; `/tideframe` now uses it for its
  40px icon slot instead of the 512px file.
- `scripts/optimize-images.mjs` read `src-*.png` files that are no longer in the
  repository and emitted the old undersized widths — running it would have
  reverted the media fixes. Rewritten to match the pipeline that actually ships.

---

## Checked and found correct — no change made

- **Horizontal overflow.** Swept 320→1920 in 20px steps across eleven pages in
  both engines, before and after. Clean throughout; this was never broken.
- **Theme.** Toggle both directions, persistence across navigation and reload,
  and `prefers-color-scheme` for a first-time visitor all behaved correctly.
- **Copy button.** Writes `ivan@minier.us` to the clipboard, shows "Copied", and
  reverts after 1.8s.
- **Escape, focus restoration and body scroll lock** on the mobile menu were
  already correct.
- **All 12 external links** resolve (LinkedIn returns 999, which is its standard
  bot response, not a broken link).
- **Metadata.** Titles, descriptions, canonicals, per-project OG and Twitter
  images, JSON-LD, favicons, Apple touch icon, `robots.txt` and the sitemap were
  all correct and were left alone.
- **404** already returned a real HTTP 404 with working navigation.
- **Trinity map legibility.** The map was never cropped — it sits in a container
  that respects its aspect ratio. Only its resolution was raised.
- **Lineup screenshots** were checked individually against the screens their alt
  text describes; each was the correct screen, and none exposes provider
  credentials.

---

## Remaining limitations

1. **LaundryLink has no product screenshot.** The campus feed is offline. This is
   the one item that needs revisiting when the API returns.
2. **Modeboard screenshots are source-limited.** The best available captures of
   the current build are 1600×1207, giving 1436px after removing the matte. Full
   width on a 1440px+ 2× display asks for about 2756px, so these render at ~0.52×.
   Fixing this needs new captures from the Mac app, which is outside this repo.
3. **`lineup/topshelf.webp` (1600px)** renders at 1378 CSS px, so ~0.58× on a 2×
   display. Same constraint.
4. **`trinity/rise.webp`** — the only source for that rendering is 1536px wide;
   the other Trinity images had 2400px+ originals available.
5. **Unused large originals still ship.** `lineup/icon.png` (760K) and
   `rental-record/icon.png` (376K) are pipeline sources no page requests, but
   everything under `public/` is deployed. Left in place deliberately rather than
   deleted; removing them is a one-line change if you want the bundle smaller.
6. **Homepage desktop Lighthouse performance is 99, not 100**, on a Speed Index
   of 1.2s. FCP, LCP, CLS and TBT all score 1.0 and the page is 212 KiB total.
