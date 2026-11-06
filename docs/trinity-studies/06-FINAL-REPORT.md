# Final report — portfolio and Trinity design studies (pre-publication review)

Status: **complete in working trees, committed locally only, not pushed or deployed.** Publishing needs your approval.

## 1. What was completed

- **Audit** (`01-AUDIT.md`): both repos and live sites inventoried. Live sites match their repos. The Trinity source of truth is identified as `trinity-site/data/facts.json` v1.3.
- **Data correction:** minier.us showed superseded v1.1 figures (1,850–2,100 beds; 1,400–1,650 net-new). It now reads v1.3 figures (1,750–2,000; ≈1,185–1,435) from a synced snapshot. The build fails if the snapshot drifts from a sibling trinity-site checkout. There is no cross-domain runtime dependency.
- **minier.us repositioned:** a homepage "Built environment" section, a "Studies" nav item, a work index grouped into Built environment, Software & products, and Communication & research, plus an About paragraph and résumé updates. All software work is kept.
- **Trinity case study** at the same URL, expanded into 12 sections. It includes a contribution table, a figures ledger with status chips, a version history of alternatives, a timeline, and lessons.
- **Residential Design Studies** (`/studies`, 6 pages): overview, Study A Peaks, Study B Rise, test fits, development model, and method and sources.
- **Floor-plan system:** editable JSON specs, a generator and checker, SVG/PNG/PDF/DXF/CSV/JSON exports, version history, and a written-feedback workflow (`studies/README.md`).
- **University Heights reference:** rounded typology notes compared with each option; detailed reference kept privately. The drawings themselves are not stored or published.
- **Test fits** and a **Trinity Rise development model** (an Excel workbook with live formulas, verified in LibreOffice).
- **Admissions portfolio:** `/portfolio/trinity` plus an 11-page PDF.
- **trinityredistricting.com:** short "related independent work" notes on the Peaks and Rise pages only.

## 2. Changes by site

**minier-us:** see `git show --stat` on the local commit. Main areas:
- `src/pages/{index,about,resume}.astro`, `src/pages/work/*`, `src/pages/studies/*`, `src/pages/portfolio/trinity.astro`
- `src/components/studies/*`, `src/data/{trinity,studies}.ts` plus generated JSON, `src/styles/global.css` (new `studies` theme and scoped `st-` classes)
- `scripts/{sync-trinity-facts,render-pdfs}.mjs`, `studies/**`, `public/studies/**`, `public/media/trinity/*`, both PDFs
- `package.json`: the `build` script now runs the facts check first. New `check`, `sync:trinity`, `plans`, and `plans:render` scripts. No new dependencies.

**trinity-site:** `trinity-peaks.html`, `trinity-rise.html` (one labelled section each), and `src/trinity-ai/knowledge-index.mjs` (regenerated, as the build requires).

## 3. Drawings and models created

| Item | Beds | Notes |
|---|---|---|
| Peaks P4-A: 2 doubles + 2 baths | 4 | 700 sf envelope |
| Peaks P4-B: 4 singles + lounge | 4 | 1,064 sf |
| Peaks P6: 2 doubles + 2 singles, no triples | 6 | 1,232 sf |
| Peaks typical floor A | 58 | 252' × 62', 269 sf/bed, built from P4-A and P6 |
| Rise R4-A: 4 bedrooms, 2 shared baths | 4 | 1,456 sf |
| Rise R4-B: 4 ensuite baths | 4 | same envelope |
| Test fit | — | Peaks 5–6 floors ≈ 74–84 ft (over 55 ft); ≤55 ft allows ~3 floors and about doubles the footprint; Rise reaches 300–400 beds at 8–12 stories only with 8–10 units per floor |
| Development model | — | Scenario A at the UVM $12,090 anchor covers 0.40× debt service and needs ≈$25.9k/bed/yr for 1.20×; Scenario B needs ≈$2,170/bed/month; a $25k/bed premium ≈ +$153/month |

## 4. Assumptions that remain unverified

Every plan dimension, all height arithmetic, all financing, opex, occupancy, targets, and cap rates, the 21-acre site area (secondary), ≈565 replaced beds, and the 55-ft ceiling and its measurement method. The full list is in `03-SOURCES-AND-ASSUMPTIONS.md`.

## 5. Needs your input or professional review

**Your decisions:**
- Confirm the contribution table on the case study, especially AI use in research and writing, and who performed the Oct 29 audit.
- Supply the institution for your prior Business Administration and Marketing study, or leave it unnamed.
- Approve the homepage and résumé wording.
- Choose next iterations: compact suite P4-C, centralised laundry, accessible units, Rise unit mix.

**Professional review:** licensed architect (layouts, accessibility, egress, structure), planner (overlay, height method), surveyor, cost estimator, and a market study for rents.

## 6. Tests

All passed, except one pre-existing résumé landmark warning and one session-caused false failure on the Trinity live check. Details are in `05-QA-REPORT.md`.

## 7. What to do next

1. Review the pages locally (`npm run build && npm run preview`) or with the screenshots, especially the case study's contribution table and the résumé.
2. Approve publishing. Deploy minier.us first, then trinity-site, because of the cross-links.
3. Re-run `tests/verify-deploy.mjs` from a session without the saved admin token.
4. Give written feedback on the plans. The workflow in `studies/README.md` regenerates everything.
5. Gather comparable rents and a planner's read of the overlay before extending the model.
