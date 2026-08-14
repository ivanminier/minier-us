# minier.us

Personal website for Ivan Minier.

This is the public home for the person, not a second Tideframe store. Tideframe Labs remains the company. Lineup, Tideframe Rental Record, and Modeboard are Tideframe products. Trinity Redistricting and UVM LaundryLink are independent projects.

## Stack

- Astro and TypeScript
- Plain CSS
- Cloudflare Pages

## Local development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Editing content

See `CONTENT_GUIDE.md`.

Most copy lives in:

- `src/data/site.ts`
- `src/data/projects.ts`
- `src/data/socials.ts`
- `src/content/ideas/`

## Project structure

```text
src/
  components/
  content/ideas/
  data/
  layouts/
  pages/
  styles/
public/media/
```

## Deployment

GitHub repository `ivanminier/minier-us` → Cloudflare Pages.

- Framework: Astro
- Build command: `npm run build`
- Output: `dist`
- Domain: `https://minier.us`

Email forwarding is documented in `EMAIL_SETUP.md`.
