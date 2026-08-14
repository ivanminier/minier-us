# V2 audit — minier.us

Internal notes from browsing the live Pages production build (`https://minier-us.pages.dev`) on 2026-08-14. Local DNS in this environment could not resolve `minier.us` (no A record from 1.1.1.1); NS already point at Cloudflare. Content is the same Pages project.

Viewports captured: 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1728×1117. Light and dark sampled.

## Identity

The tagline is strong and should stay. The site is product-rich and Ivan is thin. There is no “currently” line, no portrait slot, and little first-person authorship on case studies. A visitor understands products faster than they understand the person.

The IM black square reads like a generic portfolio monogram. “Theme” as a nav pill is utilitarian.

## Hierarchy

Homepage order is correct: Lineup → Rental Record → Modeboard → Trinity → LaundryLink, then Tideframe, then contact. Tideframe vs independent is labeled, but the homepage laundry block is only a green square, so it reads as leftover.

## Typography

System sans is appropriate. The serif stack is unused. Headlines are large and confident. About and case-study body copy is a bit long and aphoristic. The word “calm” and “systems” repeat.

## Composition

Hero is three screenshots in a CSS grid, not one art-directed piece. Lineup phone dominates well; Modeboard and Trinity sit in a stack to the right. No Rental Record in the hero. No depth, no overlap, no controlled scale.

Homepage Lineup feature repeats the same iPhone Home shot already used in the hero. Rental Record iPhone is a tall isolated device. LaundryLink is a logo tile.

## Project storytelling

Case studies share one skeleton: problem / approach / what it does / why this shape. Useful, but identical. No project-facts block (creator, role, official home). Lineup is iPhone-only visually. Work index is a text list — below the homepage.

## Multimedia

Still images only. No video. No scroll-linked motion beyond CSS hover. Lineup gallery has three dark empty-looking phone frames (lazy-load / black chrome). LaundryLink has no UI screenshots.

## Navigation

IA is right. Mobile menu exists. Theme control needs an icon. Overlay focus trap / Escape / scroll lock not fully productized.

## Responsiveness

No horizontal overflow at tested widths. Mobile homepage stacks cleanly. Tablet (768/1024) collapses early; some two-column compositions could remain. Email bar is fine at 375.

## Accessibility

Skip link, landmarks, and visible focus exist. Theme button text is “Theme”. Mobile menu likely does not trap focus or close on Escape. `alumniOf` in Person schema is wrong while Ivan is enrolled. External arrows are not screen-reader distinguished.

## Performance

Static Astro, no analytics. Large leftover PNGs exist (`lineup/icon.png` 778 KB). LCP is the Lineup phone WebP. No AVIF.

## SEO / schema

Canonicals use `https://minier.us`. Sitemap and robots exist. Person schema uses `alumniOf` (incorrect) and `sameAs` includes Tideframe/Trinity sites. Lineup SoftwareApplication should not invent an Offer.

## Factual accuracy

- Lineup platforms on site: iPhone, iPad, Apple TV. Xcode target matches that. Mac is documented as a *future* native app; `SUPPORTS_MACCATALYST = NO`. Do not invent Mac screenshots. May describe Mac as planned on the same engine; listing it as a current running surface would be false.
- Lineup copy says “calm live, movies…” — theme word overuse.
- Tideframe descriptor: “Native software for Mac, iPhone, and iPad” omits Apple TV.
- Modeboard official site tagline is still “Switch your whole Mac workspace with one profile.” Older “Every Focus deserves its own Mac” is not on the current official site.
- LaundryLink year 2025 is consistent with an earlier campus project.

## Opportunities for more personality

- Currently strip
- Project facts with Ivan as creator
- Real LaundryLink UI
- Art-directed hero
- Visual /work index
- Stronger Lineup Intelligence stage
- About as a real project arc
- Ideas rewritten as notes, not generated essays
- Theme icon, wordmark, quieter copy
