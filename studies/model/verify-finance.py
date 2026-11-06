#!/usr/bin/env python3
"""Recalculates the workbook in LibreOffice (headless) and checks every formula cell
against the Python results in src/data/finance.json. Exit 1 on any mismatch or error value."""
import json, shutil, subprocess, sys, tempfile
from pathlib import Path
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[2]
XLSX = ROOT / "public/studies/trinity-rise-development-model.xlsx"
data = json.loads((ROOT / "src/data/finance.json").read_text())

tmp = Path(tempfile.mkdtemp())
src = tmp / "in.xlsx"
shutil.copy(XLSX, src)
subprocess.run(["soffice", "--headless", "--calc", "--convert-to", "xlsx", "--outdir", str(tmp / "out"), str(src)],
               check=True, capture_output=True, timeout=180)
wb = load_workbook(tmp / "out" / "in.xlsx", data_only=True)
fails, checked = [], 0

def close(a, b):
    return abs(a - b) <= max(0.01, abs(b) * 1e-9)

wm = wb["Model"]
for key, row in data["cells"]["model"].items():
    for col, s in (("C", "A"), ("D", "B")):
        got = wm[f"{col}{row}"].value
        exp = data["results"][s][key]
        checked += 1
        if exp is None:
            if got not in ("n/a", None):
                fails.append(f"Model {key} {s}: expected n/a, got {got}")
        elif not isinstance(got, (int, float)) or not close(got, exp):
            fails.append(f"Model {key} {s}: LibreOffice {got} vs Python {exp}")
ws = wb["Sensitivity"]
r0 = data["cells"]["sensRow0"]
for i, row in enumerate(data["sensitivity"]["rent"]):
    for j, exp in enumerate(row):
        got = ws.cell(row=r0 + i, column=3 + j).value
        checked += 1
        if not isinstance(got, (int, float)) or abs(got - exp) > 0.5:
            fails.append(f"Sensitivity r{i} c{j}: {got} vs {exp}")
p0 = data["cells"]["premRow0"]
for i, p in enumerate(data["premium"]):
    got = ws.cell(row=p0 + 1 + i, column=3).value
    checked += 1
    if not isinstance(got, (int, float)) or abs(got - p["extraRentPerMonth"]) > 0.5:
        fails.append(f"Premium {p['premiumPerBed']}: {got} vs {p['extraRentPerMonth']}")
# No error values anywhere.
for sh in wb.worksheets:
    for row in sh.iter_rows():
        for c in row:
            if isinstance(c.value, str) and c.value.startswith("#"):
                fails.append(f"{sh.title}!{c.coordinate} = {c.value}")
tl = wb["Timeline"]
total = tl.cell(row=tl.max_row, column=2).value
checked += 1
if total != sum(t["months"] for t in data["timeline"]):
    fails.append(f"Timeline total {total}")
print(f"checked {checked} formula results against Python: {len(fails)} mismatches")
for f in fails:
    print("  " + f)
sys.exit(1 if fails else 0)
