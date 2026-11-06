#!/usr/bin/env python3
"""Separate, preliminary analysis: university-financed housing vs. a hypothetical private
luxury student-housing development, for the same 300-bed Trinity Rise program.

Writes docs/trinity-studies/10-FINANCING-STRUCTURES.md. Does not change the existing
workbook (public/studies/trinity-rise-development-model.xlsx), which remains the
"Preliminary scenario v1". Nothing here is a validated feasibility conclusion.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
IN = json.loads((ROOT / "studies/model/financing-structures-inputs.json").read_text())
OUT = ROOT / "docs/trinity-studies/10-FINANCING-STRUCTURES.md"


def pmt(rate, years, pv):
    return pv * rate / (1 - (1 + rate) ** -years) if pv else 0.0


usd = lambda v: f"${v:,.0f}"
C = IN["common"]
beds = C["beds"]
base = beds * C["costPerBed"] * (1 + C["contingency"])  # before financing

# ---------------- U: university-financed
U = IN["university"]
u_rows = []
for eq in U["equityShare"]:
    for r in U["bondRate"]:
        debt0 = base * (1 - eq)
        capint = debt0 * r * U["constMonths"] / 12 * U["avgDraw"]
        tdc = base + capint
        debt = tdc * (1 - eq)
        ds = pmt(r, U["termYears"], debt)
        opex = beds * U["opexPerBed"]
        collect = beds * U["occupancy"]
        egi = collect * (U["rentAnchor"] + U["summerIncomePerBed"])
        gap = ds + opex - egi  # annual shortfall at the anchor rate (break-even basis)
        need_be = (ds + opex) / collect - U["summerIncomePerBed"]
        need_12 = (1.2 * ds + opex) / collect - U["summerIncomePerBed"]
        u_rows.append(dict(eq=eq, r=r, tdc=tdc, ds_bed=ds / beds, gap=gap, gap_bed=gap / beds, need_be=need_be, need_12=need_12))

# ---------------- P: hypothetical private luxury
P = IN["private"]
p_rows = []
for prem in P["premiumPerBed"]:
    hardsoft = beds * (C["costPerBed"] + prem) * (1 + C["contingency"])
    devfee = hardsoft * P["developerFee"]
    loan0 = (hardsoft + devfee) * P["ltc"]
    fin_fees = loan0 * P["financingFees"]
    capint = loan0 * P["constRate"] * P["constMonths"] / 12 * P["avgDraw"]
    tdc = hardsoft + devfee + fin_fees + capint
    for gr in P["groundRentPerBed"]:
        opex = beds * (P["opexPerBed"] + P["taxPerBed"] + gr)
        collect = beds * P["occupancy"] * (1 + P["otherIncome"])
        need = {y: ((y * tdc + opex) / collect) / 12 for y in P["yieldTargets"]}
        p_rows.append(dict(prem=prem, gr=gr, tdc=tdc, tdc_bed=tdc / beds, need=need))

L = []
w = L.append
w("# Financing structures: university-financed vs. hypothetical private luxury (preliminary)\n")
w(f"Generated {IN['asOf']} by `studies/model/financing-structures.py` from `financing-structures-inputs.json`.\n")
w("**Status:** a separate, preliminary analysis for discussion. It is **not** a feasibility conclusion, appraisal, or recommendation. Most inputs are illustrative placeholders (marked below). The existing workbook stays unchanged as **Preliminary scenario v1** (6 Nov 2026).\n")
w("## Why two structures\n")
w("The v1 model tested one building against its own rents, which is a *project-finance* test. A university and a private developer finance housing in fundamentally different ways:\n")
w("| | University-financed (public benefit) | Hypothetical private luxury student housing |")
w("|---|---|---|")
for a, b, c in IN["contrast"]:
    w(f"| {a} | {b} | {c} |")
w("")
w(f"Common program: {beds} beds of four-bedroom apartments; base cost {usd(C['costPerBed'])}/bed before contingency (benchmark from another university, not a Trinity estimate); contingency {C['contingency']:.0%} (illustrative).\n")
w("## U. University-financed\n")
w(f"Rent anchor: {usd(U['rentAnchor'])} per bed per academic year (UVM AY 2026-27 University Heights Suite Single, room only, **sourced**). Summer income {usd(U['summerIncomePerBed'])}/bed (illustrative). Opex {usd(U['opexPerBed'])}/bed (illustrative). Occupancy {U['occupancy']:.0%} (illustrative). Bonds over {U['termYears']} years at the rates shown (illustrative). \"Equity share\" means reserves, gifts, or state or other funds that need no debt service (illustrative).\n")
w("| Equity share | Bond rate | TDC | Debt service / bed | Annual shortfall at anchor rate | Per bed | Rate to break even | Rate for 1.20× coverage |")
w("|---|---|---|---|---|---|---|---|")
for x in u_rows:
    w(f"| {x['eq']:.0%} | {x['r']:.1%} | {usd(x['tdc']/1e6*1e6)} | {usd(x['ds_bed'])} | {usd(x['gap'])} | {usd(x['gap_bed'])} | {usd(x['need_be'])} | {usd(x['need_12'])} |")
w("")
w("**How to read it.** A positive shortfall is the amount the housing system would have to cover each year from other halls' rates, reserves, or other sources if this building were charged today's anchor rate. A university would normally judge this at the **system** level, by its total housing revenues against all its housing debt. That requires UVM data this study doesn't have (system beds, existing debt service, reserves, and rating constraints), so no system-level rate impact is calculated.\n")
w("## P. Hypothetical private luxury student housing\n")
w("Explicitly hypothetical. **Not proposed for the UVM project.** No market rents are assumed: the table shows the rent per bed per month the deal would *need* to reach each untrended yield-on-cost target. Compare with surveyed Burlington-area comparables once collected.\n")
w(f"Assumptions (all illustrative): developer fee {P['developerFee']:.0%}; loan-to-cost {P['ltc']:.0%}; financing fees {P['financingFees']:.1%} of the loan; construction interest {P['constRate']:.1%} over {P['constMonths']} months at {P['avgDraw']:.0%} average draw; opex {usd(P['opexPerBed'])}/bed; property tax {usd(P['taxPerBed'])}/bed; occupancy {P['occupancy']:.0%}; other income {P['otherIncome']:.0%}; 12-month leases. Ground rent is the annual payment to the landowner (the university) under a ground lease.\n")
hdr = " | ".join(f"Rent/bed/month @ {y:.1%} YoC" for y in P["yieldTargets"])
w(f"| Premium cost / bed | Ground rent / bed / yr | TDC / bed | {hdr} |")
w("|---|---|---|" + "---|" * len(P["yieldTargets"]))
for x in p_rows:
    cells = " | ".join(usd(x["need"][y]) for y in P["yieldTargets"])
    w(f"| {usd(x['prem'])} | {usd(x['gr'])} | {usd(x['tdc_bed'])} | {cells} |")
w("")
w("**Not modelled:** land acquisition (assumed ground-leased), rent growth, refinancing or exit, equity waterfall and IRR, lease-up timing, property-tax treatment under a university ground lease, insurance, and market absorption.\n")
w("## What this does and does not show\n")
for b in IN["takeaways"]:
    w(f"- {b}")
w("\n## Inputs and status\n")
w("See `studies/model/financing-structures-inputs.json`. Every value is marked SOURCED or ILLUSTRATIVE there. Replace the illustrative values with professional or market data before any use.\n")
OUT.write_text("\n".join(L) + "\n")
print(f"wrote {OUT.relative_to(ROOT)}")
for x in u_rows:
    print(f"U eq={x['eq']:.0%} r={x['r']:.1%} DS/bed={x['ds_bed']:,.0f} shortfall/bed={x['gap_bed']:,.0f} break-even={x['need_be']:,.0f}")
for x in p_rows:
    print(f"P prem={x['prem']} gr={x['gr']} tdc/bed={x['tdc_bed']:,.0f} need={ {k: round(v) for k, v in x['need'].items()} }")
