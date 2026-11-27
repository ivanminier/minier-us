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
3. Update the image entry in the matching `src/data/*-media.json` file. Projects with inline image data use `src/data/projects.ts`.
4. Write honest `alt` text.

Lineup screenshots should be demo-catalog only. Do not publish real provider names, logos you do not own, or login details.

The November 2026 refresh uses these sources.

- Lineup uses the November 25 iPhone simulator captures, the direct October 27 simulator captures for iPad and Apple TV, and a direct iPhone Duo capture from the submission set. The demo artwork and video credits are under `public/media/lineup/r3/`.
- Rental Record uses the fictional Maple Street screenshots and icon from LeaseLock’s `AppStoreScreenshots/Release-1.2.1-20` folder.
- Same Minute uses the screenshots and icon in the Tideframe site’s `public/products/same-minute` folder.
- LaundryLink uses direct production captures from November 27, 2026. Update `src/data/laundrylink-media.json` with the new dimensions and responsive filenames when replacing them. Use a new URL for a changed social image because assets under `/media/` are cached as immutable.
- Trinity uses the November proposal’s `assets/images/exterior-studies` and `phasing-diagram.svg`. Keep the AI-assisted appearance studies labeled and identify the Blender massing study in its caption.


## Add an idea

Create a Markdown file in `src/content/ideas/`:

```md
---
title: The title
date: "2026-09-01"
summary: One sentence.
project: same-minute
---

The note itself.
```

It will appear on `/ideas` automatically.

## Add another project

1. Add an object to `projects` in `src/data/projects.ts`.
2. Add a `WorkCard` in `src/pages/work/index.astro` and, for a homepage feature, in `src/pages/index.astro`. The studio page lists all projects with `studio: "tideframe"`.
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
npm run dev -- --background
npm run build
```
