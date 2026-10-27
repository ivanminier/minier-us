# Portfolio master redesign — validation

27 October 2026. Applies to the complete 14-page public route set and custom 404.
This report records pre-publication validation; final delivery reports actual deployment results.

## Scope and sources

Rebuilt the composition and information architecture of Home, Work, all five
project pages, About, Résumé, Contact, Tideframe, Notes, and both retained notes.
Shared navigation is Work / About / Résumé / Contact; Studio and Notes remain
in the footer. Each subject has its own palette, type families, layout and
story sequence. The existing Astro stack and GitHub → Cloudflare Pages workflow
are retained. No runtime dependencies, analytics, backend, or services added.

Facts were checked against both rendered pages of the supplied private résumé,
current Tideframe product metadata, retained project material, and Lineup's
r3 README, capture report, media credits, reviews and web/launch manifests,
plus current project status and limitations. The private résumé was not copied
into the site. No private address, phone, secondary email, or Dscout earnings
appear in the public résumé. Ongoing supplied roles and dates are centralized
in `src/data/experience.ts`; product statuses remain in `src/data/projects.ts`.

Formal degree wording remains an owner question: the supplied résumé uses
B.S. Community Development and Applied Economics / Public Communications
concentration; the owner specifies current major Public Communication. Public
wording follows the owner's requested Public Communication / CDAE / CALS /
expected May 2028. No completed degree or separate concentration is inferred.

## Visual inspection and revisions

Before: all live sitemap routes were read and captured at 1280px. After: entire
pages captured at 1280px and 390px, plus authored dark-theme full-page captures.
Representative before/after opening contact sheets are in `evidence/`. Full
local evidence and machine-readable results remain under `.audit/master/`.

Revisions after rendering included reducing homepage overlap so both actual
interfaces remain recognizable, replacing a small full-report preview with a
readable authentic cropped report excerpt, making Trinity a wide Work feature
instead of leaving a grid void, retaining the studio mark's square geometry and
using the approved light monochrome mark on the dark studio page, and keeping
résumé sections together across the two printed pages. Both final PDF pages
were rendered and visually checked, including footer numbering.

## Automated and interaction checks

- `npm run build`: 15 static pages, including custom 404; sitemap generated.
- `tsc --noEmit`: passes. Astro build validates page compilation; no separate
  Astro language-server check package is installed.
- 98 responsive scenarios: 14 routes × six widths (320, 390, 820, 1280, 1920,
  landscape 844×390), plus 14 effective 640px layouts representing a 1280px
  browser viewport at 200% zoom. No horizontal overflow, missing source images,
  or page JavaScript errors. Every route has one main H1.
- axe-core 4.10.3 WCAG A/AA: 28 desktop route/theme combinations, zero reported
  violations. Automated checks supplement visual and keyboard review; they do
  not establish exhaustive assistive-technology acceptance.
- 30 Chromium/WebKit interaction checks pass: skip link, menu initial focus and
  focus cycle, Escape/return focus, resize/scroll unlock, theme changes and
  persistence, full-size image dialog and return focus, clipboard success/content
  (Chromium), clipboard failure feedback (both), Print control, real 404 response,
  and absent 404 canonical. WebKit link traversal uses its Option-Tab convention.
- 14 sitemap routes, 42 unique links and 24 selected image/social paths checked
  in the production preview: no internal failures. Canonicals inspected.
- Product/project external destinations returned HTTP 200, including Tideframe's
  three product pages, Trinity/documents, and LaundryLink's active domain. The
  latter does not establish live laundry data availability. No forms or
  purchases submitted. Existing redirect definitions preserved; live responses
  are checked after deployment.

## Media and performance

All rendered Lineup screen images now use selected approved r3 derivatives
with measured intrinsic dimensions and content-hashed filenames. The actual
phone pixels were visually checked: 9:41, full battery, original fictional
artwork. Screens are authentic simulator captures; raw files remain untouched.
Multiview and Smart Lineup are labeled Pro. Local generation script, public
provenance manifest and complete credits are included. New Home/Lineup social
cards use r3 pixels and versioned filenames. Legacy unreferenced files remain
for asset preservation; no rendered page references the obsolete phone image.

Six Modeboard width descriptors were corrected from 1442 to the actual 1436px.
The Rental Record report excerpt is a crop from the existing Mac report image;
its full source remains linked. It adds no invented text or interface elements.

Self-hosted fonts are actual Latin WOFF2 subsets with upstream OFL licenses.
The complete font directory is 552 KB; routes link only their selected families.
Twelve fresh-context Chromium production-preview samples (six routes × phone /
desktop) measured 37–81 KB font payload, 48–401 KB initial transferred bytes,
32–96 ms LCP and 0–0.030 CLS. These are unthrottled localhost samples, **not**
Lighthouse scores, mobile-network predictions, or field Core Web Vitals.

## Publication

Publication uses a normal commit and push, followed by deployment status and live verification. `main` was checked via GitHub
and is not protected; the clean checkout was fast-forwarded to the existing
published refresh before implementation. No force push or bypass is authorized.
