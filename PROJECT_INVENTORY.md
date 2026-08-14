# Project inventory

Factual sources used for minier.us. Existing repositories were inspected, not modified.

## Ivan Minier

| Fact | Source |
| --- | --- |
| Name | Explicit site brief; Tideframe site `src/config.ts` founder field |
| Founder of Tideframe Labs | `tideframe-site/src/config.ts` |
| University of Vermont, Business Administration | Site brief; LinkedIn public listing titled “Student at the University of Vermont” |
| Vermont | Tideframe public copy; Trinity site |
| Primary email `ivan@minier.us` | Explicit site brief |
| School email `ivan.minier@uvm.edu` | Explicit site brief |
| Personal email `ivanfminier@gmail.com` | Explicit site brief |
| Instagram `@ivanminier` | `https://www.instagram.com/ivanminier/` returned HTTP 200 |
| LinkedIn `linkedin.com/in/ivanminier` | Public search result for Ivan Minier, UVM, Burlington, Vermont |
| GitHub `ivanminier` | `gh api user` |

## Tideframe Labs

| Fact | Source |
| --- | --- |
| Independent software studio in Vermont | `tideframe-site/src/config.ts` |
| Public site | `https://tideframelabs.com` HTTP 200 |
| Products: Modeboard, Rental Record; Lineup in development locally | Tideframe public catalog + local Lineup repo |
| Brand colors `--pacific #2b6d93`, `--tide #102a43`, `--glass #65b7a6` | `tideframe-site/src/index.css` |
| Logo | `tideframe-site/public/tideframe-icon-glossy.png` and SVG marks |

## Lineup

| Fact | Source |
| --- | --- |
| Tideframe product, not independently branded as a studio | Lineup README copyright; local repo |
| Player/organizer for user-supplied IPTV | `Lineup/README.md` |
| Xtream and M3U | README; onboarding screenshot “Choose or add a source” |
| Live TV, movies, series, guide, watchlist | README; Edit Home screenshot |
| Lineup Intelligence: names, categories, logos, guide matching, duplicates | `docs/LINEUP_INTELLIGENCE.md` |
| EPGShare01 as an external guide source | `docs/LINEUP_INTELLIGENCE.md`; `PROJECT_STATUS.md` |
| Public 1.0 platforms: iPhone, iPad, Apple TV | `Lineup.xcodeproj` `SUPPORTED_PLATFORMS`; `SUPPORTS_MACCATALYST = NO` |
| Native Mac app planned on the same engine, not shipping | `ARCHITECTURE.md` “Future Mac app” |
| Public 1.0 Mac deferred | `PROJECT_STATUS.md` 2026-08-08 scope freeze; still no macosx app target as of 2026-08-14 |
| Not publicly released / no App Store link | `PROJECT_STATUS.md` still not App Store ready |
| Demo catalog is fictional | README; screenshots labeled “Lineup Demo” |
| Status on this site | **In development** |

Media used: official app icon; device screenshots of welcome, source picker, profile, Home, and Edit Home. Watch History containing third-party channel names was not used.

## Tideframe Rental Record

| Fact | Source |
| --- | --- |
| Native local-first rental documentation | `LeaseLock/README.md`, `PRODUCT_SPEC.md` |
| Platforms iPhone, iPad, Mac | Tideframe `rental-record-product.json` |
| Tagline “Document your rental clearly.” | Official Tideframe product JSON |
| App Store | `https://apps.apple.com/us/app/tideframe-rental-record/id6796366130` (HTTP 200) |
| Product page | `https://tideframelabs.com/rental-record` |
| Features: guided rooms, evidence, reports, packages, hashes, optional iCloud backup | Product spec + Tideframe product JSON |
| Not a legal service | README / product spec |
| Pricing | Not hardcoded here. StoreKit prices live in the App Store. |

Media used: official Tideframe web screenshots and product icon, already using fictional rental data.

## Modeboard

| Fact | Source |
| --- | --- |
| Native Mac utility by Tideframe | `Modeboard/README.md`; Tideframe site |
| Official current tagline | “Switch your whole Mac workspace with one profile.” (`modeboard-product.json`, Modeboard page). Older line “Every Focus deserves its own Mac.” is not on the current official site. |
| Capabilities: apps/files, Dock, wallpaper, appearance, Desktop, menu bar, Focus Filter, Shortcuts, backups | Modeboard README + Tideframe Modeboard page |
| Available for Mac; download/purchase on Tideframe | Tideframe launch profile |
| One-time purchase model | Official Tideframe page. Price is not hardcoded here so it cannot go stale. |
| macOS 15+ | `modeboard-product.json` |

Media used: official Tideframe Modeboard screenshots and icon.

## Trinity Redistricting

| Fact | Source |
| --- | --- |
| Independent student-led housing feasibility vision | `Documents/trinity-site/README.md` and `about.html` |
| Authored by Ivan Minier | Trinity about page first-person copy |
| Public site | `https://trinityredistricting.com` |
| Not official UVM / not adopted / not a budget | Trinity README, homepage, about, footer |
| Peaks, Rise, Way, Cottages, documents, Trinity AI | Live site + local public site |
| Version 1.1 concept materials | Live homepage |

Media used: logo, home hero, district map, Peaks, Rise, Cottages images from the public Trinity site.

## UVM LaundryLink

| Fact | Source |
| --- | --- |
| Independent campus laundry tool by Ivan | Public GitHub `ivanminier/uvm-laundry-link` |
| Live site | `https://uvmlaundry.com` (CNAME in repo; HTTP 200). Also `https://uvm-laundry-link.pages.dev` |
| Real-time washer/dryer availability | Public HTML meta description + `src/App.js` |
| Rooms, status, search, favorites, SMS alerts, dark mode, PWA | `src/App.js` |
| Brand colors `#154734` / `#fdb515` | `src/App.js` |
| Not claimed as official UVM software | Independent student project; UVM mark used as campus identification on the existing public icon |

Media used: public LaundryLink icon from the live Pages deployment.

## Not published

- Provider credentials, playlists, stream URLs
- Private Lineup catalogs
- Rental evidence with real people or addresses
- Phone numbers, home address, payment details
- `.env` files, tokens, Keychain material
- Internal Lineup/Modeboard/LeaseLock source code
