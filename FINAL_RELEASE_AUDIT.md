# Final release audit

Measured against the local production build at `http://127.0.0.1:4323` on 2026-08-14 with Lighthouse 12.6.1.

## Lighthouse

| Page | Form | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Desktop | 100 | 100 | 100 | 100 | 0.7s | 0 | 0ms |
| `/` | Mobile | 97 | 100 | 100 | 100 | 2.6s | 0 | 0ms |
| `/work/lineup` | Mobile | 100 | 100 | 100 | 100 | 1.4s | 0 | 0ms |
| `/work/trinity-redistricting` | Desktop | 100 | 100 | 100 | 100 | 0.4s | 0 | 0ms |

Homepage mobile Performance is 97 because LCP is the hero Lineup image on a throttled mobile profile. Not treated as a defect.

## Schema

- Person/ProfilePage: Ivan Minier, `worksFor` Tideframe Labs, `sameAs` LinkedIn/Instagram/GitHub only. No `alumniOf`, no street, no phone.
- Lineup: SoftwareApplication, no Offer.
- Rental Record: SoftwareApplication with Offer `price: 0` USD (free to install on the App Store). No subscription prices.
- Modeboard: SoftwareApplication, no ratings.
- Trinity: CreativeWork by Ivan Minier.
- LaundryLink: WebApplication.

## SEO

Canonicals are `https://minier.us/...`. robots.txt references `https://minier.us/sitemap-index.xml`. Sitemap uses apex URLs. Project OG images are unique.

## Platforms

Lineup public list: iPhone · iPad · Apple TV, plus **Mac planned**. Xcode still has no shipping Mac target.

## Email

Website still shows `ivan@minier.us` as primary. MX/SPF/DKIM were not changed.
