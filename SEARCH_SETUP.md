# Google Search Console

Canonical site: **https://minier.us**

Sitemap: **https://minier.us/sitemap-index.xml**

robots.txt already points at that sitemap.

## Ivan’s steps

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add a **Domain** property for `minier.us`.
3. If Google asks for a DNS TXT record, add it in Cloudflare → **minier.us** → **DNS**. Do not change MX, SPF, DKIM, or nameservers.
4. Submit `https://minier.us/sitemap-index.xml`.
5. Use **URL Inspection** on `/`, `/work`, `/work/lineup`, `/about`, and `/contact`.
6. Request indexing once.
7. Watch Page Indexing and Search Performance. Do not repeatedly request indexing.

`.pages.dev` is a deployment host. It is not the canonical identity.
