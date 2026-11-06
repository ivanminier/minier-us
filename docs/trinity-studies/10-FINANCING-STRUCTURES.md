# Financing structures: university-financed vs. hypothetical private luxury (preliminary)

Generated 2026-11-06 by `studies/model/financing-structures.py` from `financing-structures-inputs.json`.

**Status:** a separate, preliminary analysis for discussion. It is **not** a feasibility conclusion, appraisal, or recommendation. Most inputs are illustrative placeholders (marked below). The existing workbook stays unchanged as **Preliminary scenario v1** (6 Nov 2026).

## Why two structures

The v1 model tested one building against its own rents, which is a *project-finance* test. A university and a private developer finance housing in fundamentally different ways:

| | University-financed (public benefit) | Hypothetical private luxury student housing |
|---|---|---|
| Owner | UVM | A private developer, typically on university land under a ground lease, or off campus |
| How debt is repaid | Usually system-wide housing revenue bonds; all halls' revenues back all debt | Project-level loan backed only by this building's income |
| Cost of capital | Lower (tax-exempt borrowing possible); no profit target | Higher; lenders and investors require a yield on cost and returns |
| Rent setting | Rates set across the housing system and tied to policy and affordability goals | Market rents for the product, 12-month leases, by the bed |
| Extra costs | Few: no developer fee, no property tax in most cases | Developer fee, financing fees, possible property tax, ground rent |
| Test that matters | System debt capacity and rate impact across all residents | Yield on cost, debt-service coverage, investor return |
| Mission fit for Trinity | Matches the public proposal's student-benefit framing | A hypothetical comparison only; not proposed for Trinity |

Common program: 300 beds of four-bedroom apartments; base cost $233,000/bed before contingency (benchmark from another university, not a Trinity estimate); contingency 5% (illustrative).

## U. University-financed

Rent anchor: $12,090 per bed per academic year (UVM AY 2026-27 University Heights Suite Single, room only, **sourced**). Summer income $0/bed (illustrative). Opex $5,000/bed (illustrative). Occupancy 97% (illustrative). Bonds over 30 years at the rates shown (illustrative). "Equity share" means reserves, gifts, or state or other funds that need no debt service (illustrative).

| Equity share | Bond rate | TDC | Debt service / bed | Annual shortfall at anchor rate | Per bed | Rate to break even | Rate for 1.20× coverage |
|---|---|---|---|---|---|---|---|
| 0% | 4.0% | $76,624,380 | $14,771 | $2,413,005 | $8,043 | $20,382 | $23,428 |
| 0% | 5.0% | $77,431,725 | $16,790 | $3,018,855 | $10,063 | $22,464 | $25,926 |
| 25% | 4.0% | $75,817,035 | $10,961 | $1,270,190 | $4,234 | $16,455 | $18,715 |
| 25% | 5.0% | $76,422,544 | $12,428 | $1,710,357 | $5,701 | $17,968 | $20,530 |
| 50% | 4.0% | $75,009,690 | $7,230 | $150,719 | $502 | $12,608 | $14,099 |
| 50% | 5.0% | $75,413,362 | $8,176 | $434,684 | $1,449 | $13,584 | $15,270 |

**How to read it.** A positive shortfall is the amount the housing system would have to cover each year from other halls' rates, reserves, or other sources if this building were charged today's anchor rate. A university would normally judge this at the **system** level, by its total housing revenues against all its housing debt. That requires UVM data this study doesn't have (system beds, existing debt service, reserves, and rating constraints), so no system-level rate impact is calculated.

## P. Hypothetical private luxury student housing

Explicitly hypothetical. **Not proposed for the UVM project.** No market rents are assumed: the table shows the rent per bed per month the deal would *need* to reach each untrended yield-on-cost target. Compare with surveyed Burlington-area comparables once collected.

Assumptions (all illustrative): developer fee 4%; loan-to-cost 60%; financing fees 1.5% of the loan; construction interest 7.5% over 24 months at 55% average draw; opex $5,500/bed; property tax $1,500/bed; occupancy 95%; other income 3%; 12-month leases. Ground rent is the annual payment to the landowner (the university) under a ground lease.

| Premium cost / bed | Ground rent / bed / yr | TDC / bed | Rent/bed/month @ 6.0% YoC | Rent/bed/month @ 6.5% YoC | Rent/bed/month @ 7.0% YoC |
|---|---|---|---|---|---|
| $0 | $0 | $269,321 | $1,972 | $2,087 | $2,202 |
| $0 | $750 | $269,321 | $2,036 | $2,151 | $2,266 |
| $25,000 | $0 | $298,218 | $2,120 | $2,247 | $2,374 |
| $25,000 | $750 | $298,218 | $2,184 | $2,311 | $2,438 |
| $50,000 | $0 | $327,115 | $2,268 | $2,407 | $2,546 |
| $50,000 | $750 | $327,115 | $2,332 | $2,471 | $2,610 |

**Not modelled:** land acquisition (assumed ground-leased), rent growth, refinancing or exit, equity waterfall and IRR, lease-up timing, property-tax treatment under a university ground lease, insurance, and market absorption.

## What this does and does not show

- With no equity, the building alone falls short of today's academic-year room rate by roughly $8,000-$10,000 per bed per year under these illustrative inputs. It approaches break-even (about $500-$1,450 per bed short) only when about half the cost is funded without debt, from reserves, gifts, or other sources.
- The private structure pays more for capital and fees and must hit a return target, so it needs 12-month market rents well above UVM's room rate; whether Burlington's market supports them is unknown until comparables are surveyed.
- Premium features change required rent modestly per month relative to the base cost of the building; the base cost per bed is the dominant driver in both structures.
- Neither table is a feasibility conclusion. The decisive missing inputs are a Trinity-specific cost estimate, UVM's housing-system financial data, and surveyed comparable rents.

## Inputs and status

See `studies/model/financing-structures-inputs.json`. Every value is marked SOURCED or ILLUSTRATIVE there. Replace the illustrative values with professional or market data before any use.

