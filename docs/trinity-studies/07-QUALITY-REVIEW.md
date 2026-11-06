# Independent quality review: Trinity portfolio deliverables

Date: 6 November 2026. Reviewer: Claude (AI). This is a critical review of my own earlier work, done at Ivan's request before anything is published. Ratings are candid.

Legend: **[Defect]** wrong or unusable, fix before publishing · **[Weak]** works but below portfolio grade · **[OK]** acceptable · **[Fixed in this pass]** corrected now (accuracy only).

---

## 0. Preservation and publication safety

- **Backups** (in the session scratchpad and sent to Ivan as downloads):
  - minier-us: a full git bundle (verified by cloning).
  - Both repos: incremental bundles of the new commits, `git format-patch` series, and source archives.
  - A deliverables folder (portfolio PDF, résumé PDF, workbook, floor-plan exports, docs and study sources) with SHA-256 checksums.
  - Restores were tested: the bundles and patches each reproduce the committed file trees exactly.
  - The trinity-site checkout here is **shallow**, so a standalone full bundle cannot be made. Its new commit is preserved as an incremental bundle and patch based on `22874f4`, which is already on GitHub.
- **Secrets scan** of the new commits in both repos: no tokens, keys, private keys, or the two credential values pasted earlier in chat. A high-entropy string scan of added lines found nothing.
- **UVM drawings:** none of the three UVM PDFs (UHeights, CCRH, and the earlier copy) are in either repository or embedded in any generated PDF. The only embedded raster images are the five Trinity renderings and the district map.
- **UVM reference data:** room-level transcriptions are kept privately and excluded from this version; only rounded typology notes remain.

## 1. Portfolio PDF, page by page

| Page | Content accuracy | Quality |
|---|---|---|
| Cover | OK | **[Weak]** Title wraps awkwardly ("and residential design / studies"). The rendering shows a tower that predates the current Rise massing. |
| 01 Overview | OK, figures match v1.3 | **[Weak]** About 55% of the page is empty. |
| 02 Role | OK. AI use stated. | **[Weak]** Text-only page. |
| 03 Site | OK | OK. The map is the strongest visual. |
| 04 Research | OK | **[Weak]** About 60% empty. The status column shows raw codes ("assumption"). |
| 05 Concepts | OK, labelled AI-assisted | **[Weak]** Three small renderings and one sentence. The cover image is repeated in spirit. |
| 06 Peaks plans | OK, but the University Heights comparison was over-generalized (see §5) | **[Defect]** Drawings are illegible at page size: room labels about 4 pt, title blocks unreadable. |
| 07 Floor + Rise | OK | **[Defect]** The typical-floor drawing is unreadable at this scale. |
| 08 Test fit + model | The "0.40×" headline is arithmetically right but misleading without context (§3) | **[Weak]** Jargon ("floor-plate equivalents"), and about 65% empty. |
| 09 Tradeoffs | The laundry row cites an unsupported University Heights claim | **[Weak]** About 65% empty. |
| 10 Findings | OK | **[Weak]** |

**Verdict:** accurate and honestly labelled, but **not yet admissions-grade.** Strong MRED/MRED+U and internship portfolios (Miami MRED+U leans toward design and urbanism; Clemson and ASU MRED lean toward finance and project management) usually show:

- The applicant's **own hand and judgment:** sketches, markups, iterations, decisions with reasons.
- **Legible drawings** at full-page scale, with a few enlarged details.
- **A clear one-page financial story** with sources.
- **Restraint:** fewer pages, each full.

The document currently reads as AI-produced, because every visual is either an AI rendering or an AI-drafted plan and nothing shows Ivan's own decisions. Your new Trinity Peaks brief is exactly the missing ingredient: it is your program and your design intent.

**Recommendation (needs approval):** rebuild the PDF after the first design iteration. Use about 10 full pages, one idea per page, and full-page plans with enlarged unit callouts. Add a "my decisions" column on design pages and a single sourced finance page. Hold publication of the current PDF.

## 2. Architectural plans: automatic checks vs. genuine validation

**What the automatic checker proves:** rectangles don't overlap; doors sit on shared walls; every room is reachable; furniture stays inside rooms; door swings don't hit furniture; bed counts match. It does **not** prove usability, code compliance, accessibility, structure, egress, or daylight. It is a drafting-consistency check, not architectural validation.

A manual review found real design defects the checker cannot see:

| Plan | Finding | Severity |
|---|---|---|
| P4-A, P6 doubles | Desk (y 0.5–2.5 ft) sits about **1 ft** from the bed head (y 3.5 ft) in the same column. There is no room for a desk chair, which needs about 2.5–3 ft. | **[Defect]** |
| R4-B (all 4 bedrooms) | The wardrobe sits **directly in front of the ensuite bathroom door.** You would have to climb past the wardrobe to reach the bathroom. | **[Defect]** |
| R4-A kitchen | Range-to-island clearance is about **1.5 ft**; 3.5–4 ft is the norm. | **[Defect]** |
| All Peaks plans | **No accessible rooms or bathrooms.** Student housing needs a share of mobility- and communication-accessible units (percentages to be confirmed by a professional). | **[Defect]** for a portfolio claiming completeness. Acceptable only if labelled "typical non-accessible module". |
| P4-B, P6 lounges | Interior lounges with no daylight in mid-floor positions | **[Weak]** (already disclosed) |
| All plans | Room areas are measured to rectangle edges (wall centrelines), not net interior, so they overstate net area by roughly 3–6%. | **[Weak]** (disclosed in the assumption register) |
| All plans | No structural grid. Module widths (25 ft, 44 ft, 56 ft) don't share a column bay, so suites can't stack on a real frame without adjustment. | **[Weak]**, important for realism |
| Floor A | 252-ft bar with stairs only at the ends. Egress distances, dead ends, shafts, and mechanical space are not checked. It is a counting device, not the building in your new brief (two towers, L-shaped plus straight, bridge). | **[Weak]**, now superseded by the brief |
| Doubles | 188 sf is more generous than University Heights (about 170) and CCRH (184–190). Fine, but it drives cost. | Note |
| Windows/daylight | One 4–6 ft window per bedroom; daylight is not modelled; the window-to-floor ratio is not calculated. | Note |
| Bathrooms | WC side clearance about 16 in from centreline (OK for a typical, non-accessible bathroom); showers 5 × 3 ft. Reasonable for schematic work. | **[OK]** |
| Dimensions | Spot-checked against the specs: rectangles, areas, and chain dimensions are internally consistent. | **[OK]** |

**Relationship between unit designs and the building:** the floor test fit correctly assembles real suites, which is the right method. But the building form is a generic bar, not your massing, so the test fit can't yet say anything about Trinity Peaks as designed.

## 3. Trinity Rise financial model

**Major inputs and sources**

| Input | Value | Source |
|---|---|---|
| Beds | 300 | Trinity v1.3 Rise baseline (low end) |
| Cost per bed | $233,000 | Virginia Tech 2026: $280M for 1,200 beds, a **traditional residence hall program at another university**, not apartments and not Burlington |
| Contingency | 5% | Illustrative |
| Capitalized interest | 5% × 24 months × 55% outstanding | Illustrative |
| Financing | A: 100% debt, 5%, 30 years · B: 60% LTC, 6.5% | Illustrative |
| Rent (A) | $12,090 per bed per academic year | UVM AY 2026-27, University Heights Suite Single (premium tier, **room only**, 9-month academic year) |
| Rent (B) | blank; the model solves for the rent required | — |
| Occupancy | 97% / 95% | Illustrative |
| Opex | $5,000 / $5,500 per bed; tax/PILOT $0 / $1,500 | Illustrative |
| Targets | DSCR 1.20 / 1.25; yield on cost 5.5% / 6.5%; cap 5.5% / 5.75% | Illustrative |

**Why Scenario A shows 0.40×** (all figures from the workbook):

- TDC = $69.9M base + $3.5M contingency + $4.0M capitalized interest = **$77.4M ($258,106/bed)**.
- Debt service on 100% of TDC at 5% over 30 years = **$5.04M/yr = $16,790 per bed**. That alone exceeds the full rent of $12,090 per bed. Even with **zero** operating costs, DSCR would be only **0.70×**.
- NOI = $3.52M effective income − $1.50M opex = **$2.02M ($6,727/bed)**, so 2.02 / 5.04 = **0.40×**.
- Gross rent yield on cost is only **4.7%**; NOI yield is **2.6%**.
- The **$25,926** "required rent" is the rent that makes NOI = 1.20 × debt service.

**Is the $12,090 comparison appropriate? Only partly.**

1. It is a real, sourced UVM rate, but for a **9-month, room-only university room**. Rise apartments have kitchens and could lease for 12 months, so the products differ.
2. The bigger problem is **structural**. UVM does not finance one building from that building's own rents. University housing is usually financed through **system-wide revenue bonds** and reserves, and rates are set across the whole housing system. A single-building debt-service test is a *private project-finance* test applied to a *university operating model*. Scenario A therefore overstates the "gap" as a building-level failure. The honest finding is narrower: **at UVM's current room rates, a new building at benchmark cost does not pay for itself on its own; it needs system revenues, reserves, gifts, or lower cost.**
3. **Missing items** for Scenario B as a true private deal: land or ground rent, developer fee, financing fees, property-tax treatment, lease-up losses, FF&E and replacement reserves, and **surveyed market rents**. B's 1.41× DSCR is **circular**: it is computed at the rent solved to hit the yield target.

**Recommendations (need approval before changing the model):**
- Split the model into A1 "UVM system-financed" (inputs: share of cost from reserves or gifts; system-wide rate impact, which needs UVM data) and A2 "project-level test" (what it is now, relabelled).
- Make B a real P3/private model with ground rent, developer fee, and comparable rents.
- Replace the public headline "covers 0.40× its debt service" with: "debt service at benchmark cost (≈$16,800/bed/yr) exceeds UVM's current academic-year room rate ($12,090), so a new building depends on system financing, equity, or lower cost". Same facts, correct framing. **[Fixed in this pass]** on the website and PDF.

## 4. The 55-foot limit: comparison roadmap

**Facts:** the adopted overlay sets an absolute 55-ft ceiling, as reported (not a legal review; the height-measurement method is unknown). The 2022 80-ft recommendation was tabled, not adopted.

**Where the designs sit by simple arithmetic:**

| Design | Height |
|---|---|
| Peaks v1.3 (5–6 residential floors over ground) | ≈74–84 ft |
| Your new Peaks brief (6 stories + ground in front + concealed loft) | ≈85–95 ft at typical floor heights, before roof slopes |
| Rise at 8–12 stories | ≈95–137 ft |

**No current Trinity design is compliant.** Zoning relief must never be assumed.

**Roadmap (to be run as a parallel comparison, not a sequence):**

| Track | Definition | What it tests |
|---|---|---|
| **C: Compliant** | ≤55 ft by the most conservative reading: ground plus about 3 residential floors at 10–10.5 ft, or about 4 with tight 9'-8" floors and a flat roof | Beds per footprint, lot coverage (40%), open space lost, cost per bed (more roof and foundation per bed) |
| **D: Design-dependent** | Uses grade (the brief's partly buried front) and roof form to stay under 55 ft *if* the CDO measures from average grade or to mid-roof | Needs a **planner's written reading** of the measurement rule before it counts |
| **R: Requires relief** | v1.3 heights and your brief | Same metrics plus approval path, timeline, political risk, and fallback |

**Comparison matrix for every option:** beds, net-new beds, GSF, footprint, coverage %, open space, height (ft, measured both ways), approval path, probability notes (qualitative only), cost per bed, and schedule.

**Decision gates:** (1) planner confirms the measurement method; (2) site survey and retained-building footprints; (3) only then pick which track the portfolio leads with. **The portfolio should always show Track C next to any Track R design.**

## 5. University Heights analysis: verification

Re-checked against the owner-supplied sheets on 6 Nov 2026 (detailed notes kept privately).

- The earlier description of a single "typical" University Heights suite was **over-generalized**: it held only for the sampled straight-wing suites. Other towers use paired private rooms sharing a bathroom (a Jack-and-Jill pattern).
- Bathroom types, room-to-rate mapping, and ground-floor uses were **inferred** from fixtures and sizes; the sheets do not label uses.
- The claim that University Heights centralises laundry was **not supported and is withdrawn**.
- Measurements on the compiled sheets are approximate (registered, not surveyed).
- **Missing:** accessible-room layouts, RA rooms, structural grid, floor heights.

**[Fixed in this pass]:** website and PDF wording narrowed; laundry claim removed.

**CCRH** (owner-supplied UVM sheets, reviewed privately): an L-shaped wing and a straight wing joined by a bridge on upper floors; double-loaded corridors; singles and doubles; ungendered pod-style bathrooms.

## 6. How minier.us presents you

**Accurate:** Public Communication student (expected May 2028); prior Business Administration and Marketing study (no institution named); founder of Tideframe Labs with released apps; residential development stated as a *goal*; explicit "not a licensed architect, planner, or developer".

**Overstatements found [Fixed in this pass]:**
- Résumé: "Produced original schematic suite and apartment plans…" and "Built a conceptual development model…". The plans and model were drafted by AI from your program. Now reads "Directed AI-assisted schematic plans…" and "Directed and reviewed an AI-assisted conceptual model…". **Before interviews, be ready to explain DSCR, yield on cost, and capitalized interest yourself.**
- Studies banner: "These are my own schematic explorations, drafted with AI assistance" now reads "Schematic explorations I directed; layouts drafted with AI assistance from my program and feedback."
- Capability line "conceptual development modeling (Excel)" now reads "reading and directing conceptual development models (Excel)".

**Still to confirm with you:** the contribution table on the case study (AI use in research and writing; who performed the Oct 29 audit).

## 7. Separation of the two sites

- **trinityredistricting.com** is unchanged except for two clearly labelled "related independent work" notes. No figures, sources, premium scenarios, or design-study content were added. **[OK]**
- **Risk 1:** the Rise note links to a minier.us page that includes a "hypothetical premium private" scenario and an amenity evaluation. It is clearly labelled, but a reader moving between the sites could conflate them. Mitigation: the note already disclaims; consider linking the Peaks note only, or linking to `/studies` (the overview) rather than `/studies/rise`.
- **Risk 2:** the portfolio's finance finding ("UVM-level rents don't carry new construction alone") could be quoted against the public proposal's affordability case. It is honest, but publish it deliberately and with the correct framing (§3).
- **Risk 3:** your new Peaks brief differs from the published v1.3 description (for example 2–3 RAs per floor rather than "about 36 RA rooms" in total, limited large triples, loft levels, 8 elevators). Keep it in the portfolio studies until you decide to adopt it. Any change to the public proposal should go through `data/facts.json` with a release note, not through the portfolio.

---

### Summary of changes made in this pass (accuracy only)
1. Corrected the University Heights statements (website Peaks page, PDF pages 6 and 9, reference doc, benchmark file).
2. Re-framed the finance headline (website and PDF).
3. Fixed AI-authorship overstatements (résumé, capability line, studies banner).

No design, model logic, layout, or trinity-site changes were made.
