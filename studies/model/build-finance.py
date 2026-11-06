#!/usr/bin/env python3
"""Builds the preliminary Trinity Rise development workbook from finance-inputs.json.

Writes public/studies/trinity-rise-development-model.xlsx with live formulas, and
src/data/finance.json with the same results computed in Python. Run
`python3 studies/model/verify-finance.py` afterwards to recalculate the workbook in
LibreOffice and confirm every formula matches the Python values.

This is a portfolio exercise. It is not the Trinity Redistricting capital study and must
not be read as a cost estimate, rent proposal, or investment analysis.
"""
import json
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parents[2]
CFG = json.loads((ROOT / "studies/model/finance-inputs.json").read_text())
OUT_XLSX = ROOT / "public/studies/trinity-rise-development-model.xlsx"
OUT_JSON = ROOT / "src/data/finance.json"

INP = {i["key"]: i for i in CFG["inputs"]}
SC = ["A", "B"]


def pmt(rate, n, pv):
    return pv * rate / (1 - (1 + rate) ** -n)


# ------------------------------------------------------------------ Python model
def compute(s, overrides=None):
    v = {k: INP[k][s] for k in INP}
    if overrides:
        v.update(overrides)
    r = {}
    r["units"] = v["beds"] / v["bedsPerUnit"]
    r["netSf"] = v["beds"] * v["unitSfPerBed"]
    r["gsf"] = r["netSf"] / v["efficiency"]
    r["baseCost"] = v["beds"] * (v["costPerBed"] + v["premiumPerBed"])
    r["contAmt"] = r["baseCost"] * v["contingency"]
    r["costBeforeFin"] = r["baseCost"] + r["contAmt"]
    r["hard"] = r["costBeforeFin"] * v["hardShare"]
    r["soft"] = r["costBeforeFin"] - r["hard"]
    r["constLoan"] = r["costBeforeFin"] * v["ltc"]
    r["capInterest"] = r["constLoan"] * v["constRate"] * v["constMonths"] / 12 * v["avgDraw"]
    r["tdc"] = r["costBeforeFin"] + r["capInterest"]
    r["tdcPerBed"] = r["tdc"] / v["beds"]
    r["tdcPerGsf"] = r["tdc"] / r["gsf"]
    r["permDebt"] = r["tdc"] * v["ltc"]
    r["equity"] = r["tdc"] - r["permDebt"]
    r["debtService"] = pmt(v["permRate"], v["termYears"], r["permDebt"]) if r["permDebt"] else 0.0
    r["opex"] = v["beds"] * (v["opexPerBed"] + v["taxPerBed"])
    collect = v["beds"] * v["occupancy"] * (1 + v["otherIncome"])
    r["rentForDscr"] = (v["dscrTarget"] * r["debtService"] + r["opex"]) / collect
    r["rentForYield"] = (v["yieldTarget"] * r["tdc"] + r["opex"]) / collect
    # Rent used: A = sourced anchor; B = the higher of the two required rents (no market rent assumed).
    r["rent"] = v["rentAnchor"] if v["rentAnchor"] else max(r["rentForDscr"], r["rentForYield"])
    r["rentMonthly"] = r["rent"] / v["leaseMonths"]
    r["gpr"] = v["beds"] * r["rent"]
    r["egi"] = r["gpr"] * v["occupancy"] * (1 + v["otherIncome"])
    r["noi"] = r["egi"] - r["opex"]
    r["dscr"] = r["noi"] / r["debtService"] if r["debtService"] else None
    r["yoc"] = r["noi"] / r["tdc"]
    r["value"] = r["noi"] / v["capRate"]
    r["margin"] = (r["value"] - r["tdc"]) / r["tdc"]
    r["rentForDscrMonthly"] = r["rentForDscr"] / v["leaseMonths"]
    r["rentForYieldMonthly"] = r["rentForYield"] / v["leaseMonths"]
    return v, r


def sens_rent(cost, rate):
    """Scenario A structure: rent per bed per academic year needed for the DSCR target."""
    _, r = compute("A", {"costPerBed": cost, "permRate": rate})
    return r["rentForDscr"]


def premium_rent(prem):
    """Scenario B: extra rent per bed per month needed to keep the yield target, vs. no premium."""
    _, base = compute("B", {"premiumPerBed": 0})
    _, withp = compute("B", {"premiumPerBed": prem})
    return (withp["rentForYield"] - base["rentForYield"]) / INP["leaseMonths"]["B"]


# ------------------------------------------------------------------ workbook
wb = Workbook()
H = Font(bold=True)
T = Font(bold=True, size=14)
NOTE = Font(italic=True, color="555555")
FILL = {"SOURCED": "DCEFE2", "STUDY": "DDE7F3", "ILLUSTRATIVE": "FBE9D0", "SOURCED / BLANK": "DCEFE2"}
thin = Side(style="thin", color="BBBBBB")

ws = wb.active
ws.title = "README"
lines = [
    ("Trinity Rise — preliminary development study (portfolio exercise)", T),
    ("Ivan Minier · Trinity Residential Design Studies · built " + CFG["asOf"], None),
    ("", None),
    ("What this is: an editable arithmetic model comparing two scenarios for a 300-bed Trinity Rise of four-bedroom apartments.", None),
    ("What it is not: a cost estimate, rent proposal, appraisal, or investment analysis; not the Trinity Redistricting capital study; not reviewed by UVM or any professional.", None),
    ("Scenario A: " + CFG["scenarios"]["A"], None),
    ("Scenario B: " + CFG["scenarios"]["B"], None),
    ("", None),
    ("Colour key on the Inputs sheet: green = SOURCED, blue = STUDY (from this portfolio's drawings/test fit), orange = ILLUSTRATIVE (no market basis; replace before use).", None),
    ("Scenario B has no market rent. The model reports the rent B would NEED to meet its targets; enter surveyed comparables in Inputs!D16 to compare.", None),
    ("Edit only the Inputs sheet. Model and Sensitivity are formulas. Source of truth for inputs: studies/model/finance-inputs.json.", None),
]
for i, (t, f) in enumerate(lines, 1):
    c = ws.cell(row=i, column=1, value=t)
    if f:
        c.font = f
ws.column_dimensions["A"].width = 150

# Inputs sheet
wi = wb.create_sheet("Inputs")
wi.append(["Key", "Input", "Scenario A", "Scenario B", "Unit", "Status", "Source / note"])
for c in wi[1]:
    c.font = H
ROW = {}
for i, it in enumerate(CFG["inputs"], 2):
    wi.append([it["key"], it["label"], it["A"], it["B"], it["unit"], it["status"], it["source"]])
    ROW[it["key"]] = i
    for col in range(1, 8):
        wi.cell(row=i, column=col).fill = PatternFill("solid", fgColor=FILL.get(it["status"], "FFFFFF"))
    if it["unit"] == "%":
        for col in (3, 4):
            wi.cell(row=i, column=col).number_format = "0.0%"
    elif it["unit"].startswith("USD"):
        for col in (3, 4):
            wi.cell(row=i, column=col).number_format = "$#,##0"
for col, w in zip("ABCDEFG", (14, 58, 13, 13, 14, 16, 120)):
    wi.column_dimensions[col].width = w
assert ROW["rentAnchor"] == 16, "README refers to Inputs!D16"


def ref(key, s):
    return f"Inputs!{'C' if s == 'A' else 'D'}{ROW[key]}"


# Model sheet: rows of (key, label, formula-template, number format)
wm = wb.create_sheet("Model")
wm.append(["Key", "Line", "Scenario A", "Scenario B", "How it is calculated"])
for c in wm[1]:
    c.font = H
M = {}
spec = [
    ("units", "Apartments", "={beds}/{bedsPerUnit}", "#,##0", "beds / beds per apartment"),
    ("netSf", "Apartment area (sf)", "={beds}*{unitSfPerBed}", "#,##0", "beds x area per bed"),
    ("gsf", "Gross building area (sf)", "={@netSf}/{efficiency}", "#,##0", "apartment area / efficiency"),
    ("baseCost", "Base development cost", "={beds}*({costPerBed}+{premiumPerBed})", "$#,##0", "beds x (cost per bed + premium)"),
    ("contAmt", "Additional contingency", "={@baseCost}*{contingency}", "$#,##0", ""),
    ("costBeforeFin", "Cost before financing", "={@baseCost}+{@contAmt}", "$#,##0", ""),
    ("hard", "  of which hard cost (display)", "={@costBeforeFin}*{hardShare}", "$#,##0", "illustrative split"),
    ("soft", "  of which soft cost (display)", "={@costBeforeFin}-{@hard}", "$#,##0", ""),
    ("constLoan", "Construction debt", "={@costBeforeFin}*{ltc}", "$#,##0", ""),
    ("capInterest", "Capitalized construction interest", "={@constLoan}*{constRate}*{constMonths}/12*{avgDraw}", "$#,##0", "debt x rate x years x average outstanding"),
    ("tdc", "Total development cost", "={@costBeforeFin}+{@capInterest}", "$#,##0", ""),
    ("tdcPerBed", "TDC per bed", "={@tdc}/{beds}", "$#,##0", ""),
    ("tdcPerGsf", "TDC per gross sf", "={@tdc}/{@gsf}", "$#,##0", ""),
    ("permDebt", "Permanent debt", "={@tdc}*{ltc}", "$#,##0", ""),
    ("equity", "Equity / institutional funds", "={@tdc}-{@permDebt}", "$#,##0", ""),
    ("debtService", "Annual debt service", "=IF({@permDebt}>0,PMT({permRate},{termYears},-{@permDebt}),0)", "$#,##0", "level payment"),
    ("opex", "Operating expenses incl. tax/PILOT", "={beds}*({opexPerBed}+{taxPerBed})", "$#,##0", ""),
    ("rentForDscr", "Rent per bed per lease needed for DSCR target", "=({dscrTarget}*{@debtService}+{@opex})/({beds}*{occupancy}*(1+{otherIncome}))", "$#,##0", "solves NOI = DSCR x debt service"),
    ("rentForYield", "Rent per bed per lease needed for yield target", "=({yieldTarget}*{@tdc}+{@opex})/({beds}*{occupancy}*(1+{otherIncome}))", "$#,##0", "solves NOI = target yield x TDC"),
    ("rent", "Rent per bed per lease used", "=IF(ISNUMBER({rentAnchor}),{rentAnchor},MAX({@rentForDscr},{@rentForYield}))", "$#,##0", "A: UVM anchor; B: required rent (no market rent assumed)"),
    ("rentMonthly", "  per month of lease", "={@rent}/{leaseMonths}", "$#,##0", ""),
    ("gpr", "Gross potential rent", "={beds}*{@rent}", "$#,##0", ""),
    ("egi", "Effective gross income", "={@gpr}*{occupancy}*(1+{otherIncome})", "$#,##0", ""),
    ("noi", "Net operating income", "={@egi}-{@opex}", "$#,##0", ""),
    ("dscr", "Debt-service coverage", "=IF({@debtService}>0,{@noi}/{@debtService},\"n/a\")", "0.00\"x\"", ""),
    ("yoc", "Yield on cost", "={@noi}/{@tdc}", "0.00%", ""),
    ("value", "Stabilized value at exit cap rate", "={@noi}/{capRate}", "$#,##0", "illustrative cap rate"),
    ("margin", "Development margin (value / TDC - 1)", "=({@value}-{@tdc})/{@tdc}", "0.0%", ""),
    ("rentForDscrMonthly", "DSCR rent per month of lease", "={@rentForDscr}/{leaseMonths}", "$#,##0", ""),
    ("rentForYieldMonthly", "Yield rent per month of lease", "={@rentForYield}/{leaseMonths}", "$#,##0", ""),
]
for i, (key, label, tmpl, fmt, how) in enumerate(spec, 2):
    M[key] = i
for i, (key, label, tmpl, fmt, how) in enumerate(spec, 2):
    row = [key, label]
    for s in SC:
        f = tmpl
        for k in INP:
            f = f.replace("{" + k + "}", ref(k, s))
        for k, r in M.items():
            f = f.replace("{@" + k + "}", f"{'C' if s == 'A' else 'D'}{r}")
        row.append(f)
    row.append(how)
    wm.append(row)
    for col in (3, 4):
        wm.cell(row=i, column=col).number_format = fmt
for col, w in zip("ABCDE", (20, 48, 18, 18, 50)):
    wm.column_dimensions[col].width = w

# Sensitivity sheet
wsn = wb.create_sheet("Sensitivity")
S = CFG["sensitivity"]
wsn.append(["Scenario A structure: rent per bed per academic year needed to meet the DSCR target, by development cost per bed (rows) and permanent rate (columns). Other inputs from the Inputs sheet."])
wsn["A1"].font = H
wsn.append(["Cost per bed", "Benchmark"] + S["rate"])
for c in wsn[2]:
    c.font = H
for j in range(len(S["rate"])):
    wsn.cell(row=2, column=3 + j).number_format = "0.0%"
SENS_ROW0 = 3
for i, (cost, note) in enumerate(zip(S["costPerBed"], S["costPerBedNotes"])):
    r = SENS_ROW0 + i
    wsn.cell(row=r, column=1, value=cost).number_format = "$#,##0"
    wsn.cell(row=r, column=2, value=note)
    for j in range(len(S["rate"])):
        col = get_column_letter(3 + j)
        A = lambda k: ref(k, "A")
        # cost before financing, TDC, debt service, rent — inline so each cell is self-contained.
        cbf = f"({A('beds')}*($A{r}+{A('premiumPerBed')})*(1+{A('contingency')}))"
        tdc = f"({cbf}*(1+{A('ltc')}*{A('constRate')}*{A('constMonths')}/12*{A('avgDraw')}))"
        ds = f"PMT({col}$2,{A('termYears')},-{tdc}*{A('ltc')})"
        opex = f"({A('beds')}*({A('opexPerBed')}+{A('taxPerBed')}))"
        f = f"=({A('dscrTarget')}*{ds}+{opex})/({A('beds')}*{A('occupancy')}*(1+{A('otherIncome')}))"
        wsn.cell(row=r, column=3 + j, value=f).number_format = "$#,##0"
r = SENS_ROW0 + len(S["costPerBed"]) + 1
wsn.cell(row=r, column=1, value="Compare: UVM AY 2026-27 University Heights Suite Single (room only)").font = NOTE
wsn.cell(row=r, column=3, value=f"={ref('rentAnchor', 'A')}").number_format = "$#,##0"
PREM_ROW0 = r + 2
wsn.cell(row=PREM_ROW0, column=1, value="Scenario B: extra rent per bed per month needed to keep the yield target, by premium cost per bed").font = H
for i, prem in enumerate(S["premiumPerBed"]):
    rr = PREM_ROW0 + 1 + i
    wsn.cell(row=rr, column=1, value=prem).number_format = "$#,##0"
    B = lambda k: ref(k, "B")
    factor = f"(1+{B('contingency')})*(1+{B('ltc')}*{B('constRate')}*{B('constMonths')}/12*{B('avgDraw')})"
    f = f"={B('yieldTarget')}*{B('beds')}*$A{rr}*{factor}/({B('beds')}*{B('occupancy')}*(1+{B('otherIncome')}))/{B('leaseMonths')}"
    wsn.cell(row=rr, column=3, value=f).number_format = "$#,##0"
wsn.column_dimensions["A"].width = 16
wsn.column_dimensions["B"].width = 52
for col in "CDEF":
    wsn.column_dimensions[col].width = 14

# Timeline + sources
wt = wb.create_sheet("Timeline")
wt.append(["Phase", "Months", "Status"])
for c in wt[1]:
    c.font = H
for t in CFG["timeline"]:
    wt.append([t["phase"], t["months"], t["status"]])
n = len(CFG["timeline"])
wt.append(["Sequential total (upper bound; phases may overlap)", f"=SUM(B2:B{n + 1})", "calculated"])
wt.column_dimensions["A"].width = 64
wt.column_dimensions["C"].width = 40

wsrc = wb.create_sheet("Sources")
wsrc.append(["Source", "URL", "Observed", "Used for"])
for c in wsrc[1]:
    c.font = H
for row in [
    ("UVM Housing & Dining, Costs: AY 2026-27 and 2027-28 room rates", "https://www.uvm.edu/housingdining/costs", "2026-11-06", "Scenario A rent anchor (Premium tier, UHN/UHS Suite Single $12,090)"),
    ("Trinity Redistricting v1.3 facts: rise_beds, bench_vt, bench_unc, catamount_woods, rise_per_bed", "https://trinityredistricting.com/proposal.html", "release 2026-10-29", "Bed baseline and per-bed cost benchmarks"),
    ("This portfolio's plans rise-r4a / rise-r4b v1 and test fit", "https://minier.us/studies/", "2026-11-06", "Apartment area per bed, efficiency"),
]:
    wsrc.append(list(row))
wsrc.column_dimensions["A"].width = 80
wsrc.column_dimensions["B"].width = 48
wsrc.column_dimensions["D"].width = 60

OUT_XLSX.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT_XLSX)

# ------------------------------------------------------------------ JSON for the site
res = {s: compute(s)[1] for s in SC}
out = {
    "_about": "Generated by studies/model/build-finance.py; verified against LibreOffice recalculation by verify-finance.py.",
    "asOf": CFG["asOf"],
    "scenarios": CFG["scenarios"],
    "inputs": CFG["inputs"],
    "results": res,
    "sensitivity": {
        "costPerBed": S["costPerBed"], "notes": S["costPerBedNotes"], "rate": S["rate"],
        "rent": [[round(sens_rent(c, r)) for r in S["rate"]] for c in S["costPerBed"]],
    },
    "premium": [{"premiumPerBed": p, "extraRentPerMonth": round(premium_rent(p))} for p in S["premiumPerBed"]],
    "timeline": CFG["timeline"],
    "cells": {"model": M, "sensRow0": SENS_ROW0, "premRow0": PREM_ROW0},
}
OUT_JSON.write_text(json.dumps(out, indent=2) + "\n")
for s in SC:
    r = res[s]
    print(f"{s}: TDC ${r['tdc']/1e6:.1f}M (${r['tdcPerBed']:,.0f}/bed), rent used ${r['rent']:,.0f}/lease (${r['rentMonthly']:,.0f}/mo), "
          f"NOI ${r['noi']/1e6:.2f}M, DSCR {r['dscr']:.2f}, YoC {r['yoc']:.2%}, rent for DSCR ${r['rentForDscr']:,.0f}, rent for yield ${r['rentForYield']:,.0f}")
