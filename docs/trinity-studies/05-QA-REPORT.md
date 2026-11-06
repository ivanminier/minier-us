# QA report — 6 November 2026

All tests ran in a cloud session against local builds of the working tree. **Nothing was deployed.** "Live" checks read the currently deployed sites, which do not include these changes.

## minier.us (`ivanminier/minier-us`, branch `claude/cloud-environment-setup-t7xvt7`)

| Test | Result |
|---|---|
| `npm run check`: Trinity facts snapshot vs canonical v1.3 | ✅ matches release 1.3 (2026-10-29) |
| `npm run check`: plan geometry checks, 6 plans | ✅ 0 errors, 0 warnings. During drafting the checker caught 3 real conflicts (door swings into wardrobes); all were fixed. |
| `npm run build` | ✅ 22 pages (was 15) |
| TypeScript `tsc --noEmit` (project's own TS) | ✅ exit 0. `astro check` was **not run**: it prompts to install `@astrojs/check`, and no dependency was added. |
| DXF exports parsed by an independent library (ezdxf `recover`) | ✅ 6/6 files, 0 errors; LINE/ARC/TEXT on 9 named layers |
| Workbook: LibreOffice headless recalculation vs independent Python | ✅ 85 formula results, 0 mismatches, no `#` error cells |
| Playwright + axe-core 4.10.2: 22 pages × desktop 1440 and phone 390 × light and dark (88 runs) | ✅ 0 console errors, 0 failed requests, 0 horizontal overflow, 1 h1 per page, all images have alt text, 0 broken internal links (76 checked). axe: no violations except one **pre-existing** item (below). |
| axe issues found and **fixed** | dark-mode status-chip contrast (up to 27 nodes per page), a 4.02:1 chip dimmed by opacity, a heading-order skip on the development model page, clipped tables on phone in the portfolio presentation |
| Declared image dimensions vs real files | ✅ 40 raster images match (one wrong cover ratio caught and fixed) |
| Keyboard | ✅ first Tab reaches the skip link; plan figures open the image viewer with Enter; Escape closes it and focus returns; sub-nav marks the current page; scrollable tables are focusable and labelled; phone menu lists Studies |
| Downloads | ✅ workbook 200 (14 KB); 6 plans × SVG/PNG/PDF/DXF/CSV/JSON served; portfolio PDF 11 pages, letter landscape, 1.36 MB (reduced from 9.5 MB by switching print images to JPEG); résumé PDF still 2 pages |
| External links on new pages (trinityredistricting.com ×3, uvm.edu ×3) | ✅ all 200 |
| SEO and social | ✅ every new page has a title, description, canonical URL, and og:image (studies pages use plan PNGs) |

**Pre-existing, not changed:**
- `/resume/` has an `aside` inside `article` (axe "landmark-complementary-is-top-level", moderate). It was present in the baseline build.
- An empty `<img>` in the hidden image-viewer dialog is reported as "broken" on every page until opened. Baseline behaviour.

**Not tested:** real devices and Safari/WebKit (Chromium only); screen readers; Lighthouse performance scores; live Cloudflare behaviour of the new routes; print from browsers other than Chromium.

## trinityredistricting.com (`ivanminier/trinity-site`, same branch name)

| Test | Result |
|---|---|
| `npm run check` (content, docs, facts sync, knowledge index) | ✅ pass |
| `npm test` | ✅ 98/98 |
| `npm run build:site` (build gate) | ✅ passed |
| `scripts/verify-workbook.py` | ✅ ok (the regenerated xlsx was restored to avoid an unrelated timestamp diff) |
| Live deploy vs repo (`tests/verify-deploy.mjs`, read-only) | ✅ live = commit `22874f4`, release 1.3. One check failed **because of this session**: the proxy attaches the owner's admin token, so `/api/chat` correctly showed diagnostics. Re-run without the token to confirm. |
| Diff | 2 page notes (Peaks, Rise) + regenerated `knowledge-index.mjs`. No figures, sources, or documents changed. |

**Deploy-order dependency:** the new trinity-site notes link to `minier.us/studies/peaks` and `/studies/rise`. Those pages return 404 until minier.us is deployed, so deploy minier.us first.
