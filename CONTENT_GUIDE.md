# How to update minier.us

You do not need to be a web developer. Change the files below, then commit and push `main`. Cloudflare rebuilds the site.

## Homepage copy

Open `src/data/site.ts`.

- `tagline` is the large sentence
- `lede` is the paragraph under it
- `title` and `description` are the browser/search text

## Email and social links

- Emails: `src/data/site.ts` → `emails`
- Instagram, LinkedIn, GitHub: `src/data/socials.ts`
- Tideframe URL: `src/data/site.ts` → `tideframe`

## Project status, platforms, and descriptions

Open `src/data/projects.ts`.

Each project has:

- `statusLabel` (for example `In development` or `On the App Store`)
- `oneLiner`
- `summary`
- `platforms`
- `links`
- `hero` and `gallery` image paths

If Lineup ships, change its `status` to `'available'` and add the real App Store URL to `links`. Do not invent a link.

## Screenshots

1. Put the file in `public/media/<project>/`.
2. Prefer `.webp`. Keep originals out of the repo if they are huge.
3. Point the matching `src` in `src/data/projects.ts` at the new file.
4. Write honest `alt` text.

Lineup screenshots should be demo-catalog only. Do not publish real provider names, logos you do not own, or login details.

## Add an idea

Create a Markdown file in `src/content/ideas/`:

```md
---
title: The title
date: "2026-09-01"
summary: One sentence.
---

The note itself.
```

It will appear on `/ideas` automatically.

## Add another project

1. Add an object to `projects` in `src/data/projects.ts`.
2. Add the slug to `featuredOrder` if it should appear on the homepage.
3. Create `src/pages/work/your-slug.astro`. You can copy an existing work page.
4. Add images under `public/media/your-slug/`.

## Deployment

Pushing `main` to GitHub should rebuild Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`

Locally:

```sh
npm install
npm run dev
npm run build
```
