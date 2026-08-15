# Closeout — minier.us

Final maintenance pass on branch `maintenance/final-closeout`. Scope was the six
limitations left open by [`AUDIT_RESULTS.md`](./AUDIT_RESULTS.md), plus a
production verification. No redesign, no new content, no refactoring.

## Resolved today

**Apple TV top-shelf banner is no longer source-limited.** The authoritative art
is in the Lineup app's own asset catalog at 4640×1440
(`App Icon & Top Shelf Image.brandassets/Top Shelf Image Wide.imageset/shelf2x.png`).
It is pixel-identical artwork to what was already shipping, just not downscaled:
the site had a 1600px derivative rendering into a 1380px CSS slot, so a 2× display
got 0.58× the pixels it asked for. The ladder is now 2784 / 1392 / 800, all exact
integer divisions of the source, and `srcset`, `sizes`, `width` and `height` were
updated to match. The 2784 candidate is 13 KB.

**The six source PNGs no longer deploy.** `lineup/icon.png`,
`rental-record/icon.png`, `modeboard/icon.png`, `tideframe/icon.png`,
`trinity/logo.png` and `laundrylink/logo.png` were pipeline inputs sitting under
`public/`, so Cloudflare served ~1.8 MB that no page ever requests. They are
required for reproducible asset generation, so they moved to `assets/source/`
rather than being deleted, and `scripts/optimize-images.mjs` now reads them from
there. The only PNGs left under `public/media` are the OG cards, which are
requested by social metadata. Verified with `git mv`, so history is preserved.

**The image pipeline is documented accurately.** Its header claimed it
regenerated every image in `public/media`. It does not: the Lineup iPhone
screenshots and `laundrylink/app.webp` come from camera-roll exports outside any
repository, identified only by `IMG_` numbers, so there is no stable path to
point at. That exclusion is now stated in the file.

## Deliberately left alone

**Modeboard screenshots remain source-limited to 1436px.** Current captures were
not attempted, and this was the right call rather than a shortcut. Modeboard is
an unsandboxed macOS utility whose entire function is mutating the host: its own
`docs/SYSTEM_MUTATIONS.md` lists wallpaper, Light/Dark, accent and highlight
colors, Dock layout and pins, menu-bar items and Finder desktop visibility as
things a profile apply changes, and the apply path deliberately SIGTERMs and
relaunches Finder, `SystemUIServer` and `ControlCenter`. That same document
states real mutation testing belongs on a disposable macOS account. Reproducing
the site's screens on this Mac would have changed Ivan's actual system settings,
and the resulting captures would have shown his real Dock, apps and profile
names. The only isolated launch path is a `DEBUG`-only XCTest harness backed by a
synthetic preference suite and seeded fixture profiles — that is a debug build
showing staged data, not the shipping UI. Modeboard's views have moved on since
the July 14 captures, so the shipped screenshots are a real build but an older
one. Replacing them requires fresh approved captures from Ivan, taken on a
machine he is willing to have Modeboard reconfigure.

**LaundryLink screenshot deferred until the genuine live service returns.**
Checked once, not polled: `api.uvmlaundry.com` returns Cloudflare error 1033
(HTTP 530), and `uvmlaundry.com` itself loads but renders "Could Not Update
Data" and "No Laundry Rooms Found". There is no working state to photograph and
none was staged. The identity-mark treatment stays exactly as it is.

**`trinity/rise.webp` stays at 1536px.** `trinity-rise.jpg` (1536×1024) is the
only copy of that exterior rendering. The two larger neighbours were checked by
content, not filename, and are different images: `trinity-rise-hero.jpg`
(2560×1468) is an overhead aerial site plan and `trinity-rise-apartments.jpg`
(2528×1527) is an interior kitchen. Upscaling was not considered.

**Cloudflare edge propagation** is unchanged and not actionable from the
repository. Give a deployment a minute before judging it.

## Verification

| Check | Result |
| --- | --- |
| `npm run build` | 14 pages, clean |
| Image pipeline rerun | Byte-identical output; `git status` clean apart from the intended top-shelf change |
| Chromium | 10 pages × 390/768/1440/1728 at DPR 2 — no overflow, no broken images, no console errors, no aspect mismatch |
| WebKit | `/`, `/work/lineup`, `/work/modeboard`, `/work/uvm-laundrylink` — same, clean |
| Regression suite | 23/23, both engines |
| Lighthouse desktop `/` | 100 / 100 / 100 / 100, LCP 0.4s, CLS 0 |
| Lighthouse mobile `/` | 98 / 100 / 100 / 100, LCP 2.3s, CLS 0 |
| Lighthouse mobile `/work/lineup` | 100 / 100 / 100 / 100, CLS 0 |
| SEO | Apex canonicals on all 13 pages, no `.pages.dev`, unique OG card per project, sitemap and robots correct |
| Privacy | No keys, tokens, phone, address or provider credentials; no analytics or trackers; only the three intended public addresses |
| `https://minier.us` | 200 |
| `https://www.minier.us` | 301 → `https://minier.us/` |

Production, after the merge deployed:

| Check | Result |
| --- | --- |
| Branch preview | All 10 pages 200, `topshelf-md.webp` served, moved PNGs 404 as intended |
| Live smoke test | 31/31 — 10 pages in Chromium and 4 in WebKit at 390 and 1440, DPR 2: no overflow, no broken images, no console errors, galleries single-column on mobile |
| Theme toggle | light → dark, and reachable inside the open mobile menu |
| Lighthouse desktop `/` | 100 / 100 / 100 / 100, LCP 0.6s, CLS 0 |
| Lighthouse mobile `/` | 100, 100, 97 across three runs — network variance on LCP alone; the homepage does not reference any asset this pass touched |
| OG cards, sitemap, robots | All 200 with correct content types |
| `/definitely-not-real` | 404 |

The previous audit's 26 fixes were re-confirmed explicitly: galleries stay
single-column at ≤900px, LaundryLink shows no failure copy, Modeboard has no
black matte and still reads "Getting Started", Rental Record shows nine distinct
screens, the mobile menu closes on desktop resize, the focus trap holds in both
engines, 404 returns 404 and is `noindex`, the email is `ivan@minier.us`, Lineup's
Mac is still labelled planned, and Tideframe still reads "Native software for
Apple platforms."

The `sizes` sweep surfaced declarations that are conservative by up to 3% against
the real slot (and 22% for two images on `/tideframe`). Each was traced to the
candidate it actually selects: in every case the browser picks the same file it
would pick with an exact declaration, so nothing renders softer. Left alone.

## Project state

minier.us is closed out. The remaining media limitations are source limitations,
not site defects, and none can be resolved without new material from Ivan.
