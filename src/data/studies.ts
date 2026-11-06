import plansIndex from "./plans-index.json";
import testfit from "./testfit.json";
import finance from "./finance.json";
import assumptions from "../../studies/assumptions.json";

export { testfit, finance, assumptions };

export type PlanEntry = (typeof plansIndex)[number];
export const plans = plansIndex as PlanEntry[];
export const plan = (id: string) => {
  const p = plans.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown plan ${id}; run npm run plans`);
  return p;
};

export const studyNav = [
  { href: "/studies", label: "Overview" },
  { href: "/studies/peaks", label: "A · Trinity Peaks" },
  { href: "/studies/rise", label: "B · Trinity Rise" },
  { href: "/studies/test-fit", label: "Test fits" },
  { href: "/studies/development-model", label: "Development model" },
  { href: "/studies/method", label: "Method & sources" },
] as const;

export const usd = (v: number) =>
  "$" + Math.round(v).toLocaleString("en-US");
export const usdM = (v: number) => "$" + (v / 1e6).toFixed(1) + "M";
export const pct = (v: number, d = 1) => (v * 100).toFixed(d) + "%";
export const num = (v: number) => Math.round(v).toLocaleString("en-US");
export const ftin = (v: number) => {
  const t = Math.round(v * 12);
  const f = Math.floor(t / 12);
  const i = t - f * 12;
  return `${f}'-${i}"`;
};
