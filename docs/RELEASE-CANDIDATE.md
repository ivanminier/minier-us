# minier.us release candidate 1 (RC1)

Status: **prepared, not merged, not deployed to production.** Production `minier.us` still serves `main` at `d44a40f` (27 Oct 2026). RC1 is the head of branch `claude/cloud-environment-setup-t7xvt7`.

## What RC1 publishes

The professional repositioning only: homepage, About, résumé, work organisation, and the expanded Trinity case study. The software portfolio pages keep their content unchanged.

### Routes (15, the same set as the live site; nothing added or removed)

| Route | Change vs live |
|---|---|
| `/` | New "Built environment" section (Trinity case study + public proposal links, aerial concept image); lede mentions housing |
| `/about/` | Paragraph on the residential-development goal; prior Business Administration and Marketing study |
| `/resume/` | Prior study line; Trinity entry expanded; design studies listed as "in progress"; housing capability line. PDF regenerated (2 pages) |
| `/work/` | Grouped into Built environment / Software & products / Communication & research; "in progress" note for the design studies (no link) |
| `/work/trinity-redistricting/` | Expanded case study: v1.3 figures read from the proposal's own data, contribution table, constraints, alternatives, timeline, lessons. No links to unpublished pages |
| `/work/modeboard/` | Only the "Next project" teaser text (Trinity's one-liner) |
| All other pages | Visible text unchanged (stylesheet reference and site metadata only) |

### Files added to the public build (3)
`/media/trinity/northside.webp`, `/media/trinity/peaks-bedroom.webp`, `/media/trinity/rise-apartments.webp`: AI-assisted Trinity renderings from the public proposal, labelled as such in the case study.

### Files changed
All HTML pages (see above) and `/ivan-minier-resume.pdf`. No files are removed.

## Held back (in the repository, NOT published)

| Item | Where it is kept | Why |
|---|---|---|
| Studies pages (`/studies/*`, 6 pages) | `src/pages/_studies/` (underscore = not built) | Floor plans have known architectural problems (see `docs/trinity-studies/07-QUALITY-REVIEW.md`) |
| Six v1 plan drawings and exports | `studies/staging/public-studies/plans/` | Same |
| Development workbook download | `studies/staging/public-studies/trinity-rise-development-model.xlsx` | Exploratory; conclusions not to be published as feasibility findings |
| Admissions presentation page + PDF | `src/pages/_portfolio/`, `studies/staging/ivan-minier-trinity-portfolio.pdf`, `studies/staging/portfolio-print-images/` | To be rebuilt after the studies improve |
| Study-only media | `studies/staging/studies-media/` | Used only by held-back pages |
| Round 1 drafts (18 plans) | Private local branch + owner backups + private review page; **not** in this branch | Unfinished |
| Room-level UVM reference data | Private only; never in this branch | Restricted source |

Tools that used to write into `public/` now write to `studies/staging/`. The admissions-PDF print step skips itself while that page is held back.

**To publish the studies later:** `git mv src/pages/_studies src/pages/studies`, `git mv src/pages/_portfolio src/pages/portfolio`, move `studies/staging/public-studies` back to `public/studies` and the other staging files back to their original paths, then restore the nav item and links. All of these were removed in the RC1 commit, so that diff shows each one.

## Checks run on RC1
- `npm run check` (Trinity v1.3 facts sync + plan geometry): pass. `npm run build`: 15 pages.
- QA: 15 pages × desktop/phone × light/dark (60 runs) with axe-core 4.10.2. 0 console errors, 0 failed requests, 0 overflow, 0 broken internal links (31), 1 h1 per page. One pre-existing axe note on `/resume/` (landmark nesting, also present on live).
- No link from any published page to `/studies` or `/portfolio`.
- No room-level UVM figures, no credentials (scanned before every push).

## Previewing
- Full-page screenshots: `trinity-review/rc1-preview/` in the session workspace.
- Cloudflare builds a preview of every pushed branch (production is only `main`). After this RC1 commit is pushed, the branch preview is at `https://claude-cloud-environment-set.minier-us.pages.dev`. Preview URLs are reachable by anyone who has the link, and are not linked from minier.us.
- **Note:** an older preview from the first push (`https://2c6cf5fa.minier-us.pages.dev`, commit `23cc017`) still contains the studies pages, plans, workbook, and admissions PDF. Removing it means deleting that preview deployment in Cloudflare, which needs your approval.

## Approval and merge (not done)
1. You review the preview and screenshots.
2. On approval: merge this branch into `main` (pull request). Cloudflare Pages then deploys production.
3. Verify `minier.us` after the deploy.

## trinityredistricting.com: kept separate
- The trinity-site branch (commit `9cda1f7`, the two cross-link notes) must **not** be merged until the destination pages exist on minier.us.
- **Warning:** the Trinity Worker's Cloudflare build trigger "Deploy non-production branches" runs `npm run cf:deploy` for every non-`main` branch, which **deploys to production**. A push on 6 Nov briefly put the cross-links live; with the owner's approval the live site was rolled back to version 1157 (`22874f4`, with the `KB_REFRESH_TOKEN` variable restored). Do not push trinity-site branches until that trigger is changed, for example to `npx wrangler versions upload`, which creates preview versions without deploying.
