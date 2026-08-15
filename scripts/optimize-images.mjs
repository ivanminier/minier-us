/**
 * Regenerates the derived project media in public/media from its authoritative
 * source. Running it on an unchanged checkout is a no-op: every output below is
 * byte-identical to what is committed.
 *
 * The previous version of this script read `src-*.png` files that are no longer
 * in the repository and emitted sizes that were too small for the widths these
 * images actually render at, so running it would have undone the media fixes.
 * Sources now point at the project repositories, which are read but never
 * modified. Set MEDIA_SOURCE_ROOT if your checkouts live somewhere else.
 *
 * Not covered here: the Lineup iPhone screenshots (`welcome`, `sources`,
 * `profile`, `home`, `edit-home`) and `laundrylink/app.webp`. Their originals
 * are camera-roll exports outside any repository, identified only by IMG_ numbers,
 * so there is no stable path to point at. They are committed as-is.
 *
 *   node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import os from 'node:os';

const HOME = process.env.MEDIA_SOURCE_ROOT ?? os.homedir();
const TF = join(HOME, 'Developer/tideframe-site/public');
const RR = join(TF, 'products/rental-record/screenshots');
const TRINITY = join(HOME, 'Documents/trinity-site/assets/images');
const LINEUP = join(HOME, 'Developer/Lineup/App/Resources/Assets.xcassets');
const ICONS = 'assets/source';

/**
 * Modeboard's shipped screenshots are composited on solid black. Rendered
 * inside the site's light card that reads as an unintended second frame and
 * wastes about a tenth of the width, so we crop to the window and clear the
 * rounded-corner residue to transparent.
 */
async function cropToWindow(src) {
  const { width, height } = await sharp(src).metadata();
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const lit = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return Math.max(data[i], data[i + 1], data[i + 2]) > 12;
  };
  let top = 0, bottom = height - 1, left = 0, right = width - 1;
  a: for (; top < height; top++) for (let x = 0; x < width; x += 2) if (lit(x, top)) break a;
  b: for (; bottom > 0; bottom--) for (let x = 0; x < width; x += 2) if (lit(x, bottom)) break b;
  c: for (; left < width; left++) for (let y = 0; y < height; y += 2) if (lit(left, y)) break c;
  d: for (; right > 0; right--) for (let y = 0; y < height; y += 2) if (lit(right, y)) break d;

  const w = right - left + 1;
  const h = bottom - top + 1;
  const px = await sharp(src).extract({ left, top, width: w, height: h }).ensureAlpha().raw().toBuffer();

  const seen = new Uint8Array(w * h);
  const stack = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const i = y * w + x;
    if (seen[i]) continue;
    seen[i] = 1;
    const p = i * 4;
    if (Math.max(px[p], px[p + 1], px[p + 2]) > 30) continue;
    px[p + 3] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return sharp(px, { raw: { width: w, height: h, channels: 4 } });
}

/** [source, output stem, [[width, filename suffix, quality?], ...], defaultQuality?, transform?] */
const jobs = [
  // Icons. The originals live in assets/source rather than public/ because no
  // page requests them; everything under public/ is deployed verbatim.
  [`${ICONS}/lineup/icon.png`, 'public/media/lineup/icon', [[512, ''], [256, '-256']], 90],
  [`${ICONS}/rental-record/icon.png`, 'public/media/rental-record/icon', [[256, '']], 90],
  [`${ICONS}/modeboard/icon.png`, 'public/media/modeboard/icon', [[256, '']], 90],
  [`${ICONS}/tideframe/icon.png`, 'public/media/tideframe/icon', [[512, '']], 90],
  [`${ICONS}/trinity/logo.png`, 'public/media/trinity/logo', [[256, '']], 92],
  [`${ICONS}/laundrylink/logo.png`, 'public/media/laundrylink/logo', [[512, ''], [256, '-sm']], 92],

  // Lineup — the shipping Apple TV top-shelf art, straight from the app's
  // asset catalog at 4640x1440. The banner renders up to 1380px CSS, so the
  // 2784 candidate covers a 2x display exactly; both smaller widths are exact
  // integer divisions of the source, so nothing is resampled off-grid.
  [`${LINEUP}/App Icon & Top Shelf Image.brandassets/Top Shelf Image Wide.imageset/shelf2x.png`,
    'public/media/lineup/topshelf', [[2784, ''], [1392, '-md'], [800, '-sm']], 90],

  // Modeboard — official current-generation captures, black backdrop removed.
  [`${TF}/screenshots/modeboard-profile-overview.png`, 'public/media/modeboard/profile-overview', [[1442, ''], [760, '-sm']], 86, cropToWindow],
  [`${TF}/screenshots/modeboard-appearance-dock.png`, 'public/media/modeboard/appearance-dock', [[1442, ''], [760, '-sm']], 86, cropToWindow],
  [`${TF}/screenshots/modeboard-menu-bar-desktop.png`, 'public/media/modeboard/menu-bar', [[1442, ''], [760, '-sm']], 86, cropToWindow],
  [`${TF}/screenshots/modeboard-backups-restore.png`, 'public/media/modeboard/backups-restore', [[1442, ''], [760, '-sm']], 86, cropToWindow],
  [`${TF}/screenshots/modeboard-onboarding-focus.png`, 'public/media/modeboard/onboarding-focus', [[1442, ''], [760, '-sm']], 86, cropToWindow],
  [`${TF}/screenshots/modeboard-getting-started.png`, 'public/media/modeboard/getting-started', [[1442, ''], [760, '-sm']], 86, cropToWindow],

  // Rental Record — official raw captures, full responsive ladders.
  ...['cases', 'room', 'evidence', 'report', 'privacy'].map((n) => [
    `${RR}/raw/iphone/rental-record-iphone-${n}.png`, `public/media/rental-record/iphone-${n}`,
    [[1320, ''], [880, '-md'], [440, '-sm']], 84,
  ]),
  ...['overview', 'room'].map((n) => [
    `${RR}/raw/ipad/rental-record-ipad-${n}.png`, `public/media/rental-record/ipad-${n}`,
    [[1548, ''], [1032, '-md'], [516, '-sm']], 84,
  ]),
  ...['cases', 'inspection', 'report'].map((n) => [
    `${RR}/raw/mac/rental-record-mac-${n}.png`, `public/media/rental-record/mac-${n}`,
    [[2560, ''], [1440, '-md'], [960, '-sm']], 82,
  ]),

  // Trinity — public site imagery. Sources verified by content, not filename:
  // trinity-rise-hero.jpg is an aerial site plan, not the Rise rendering.
  // The 2400px candidates are only fetched by wide high-density displays and are
  // downscaled ~1.7x when they render, so they carry a lower quality than the
  // -md variants without any visible cost.
  [`${TRINITY}/home-hero.jpg`, 'public/media/trinity/home-hero', [[2400, '', 68], [1400, '-md', 78], [800, '-sm', 80]]],
  [`${TRINITY}/master-plan-map.jpg`, 'public/media/trinity/map', [[2400, '', 70], [1400, '-md', 78], [760, '-sm', 80]]],
  [`${TRINITY}/trinity-peaks-hero.jpg`, 'public/media/trinity/peaks', [[2400, '', 66], [1400, '-md', 76], [760, '-sm', 80]]],
  [`${TRINITY}/trinity-rise.jpg`, 'public/media/trinity/rise', [[1536, '', 74], [1100, '-md', 78], [760, '-sm', 80]]],
  [`${TRINITY}/cottages-renovation.jpg`, 'public/media/trinity/cottages', [[2400, '', 66], [1400, '-md', 76], [760, '-sm', 80]]],
];

let missing = 0;
for (const [src, stem, widths, quality, transform] of jobs) {
  if (!existsSync(src)) {
    console.warn(`skip (source not found): ${src}`);
    missing++;
    continue;
  }
  await mkdir(dirname(stem), { recursive: true });
  const base = transform ? await transform(src) : sharp(src).rotate();
  for (const [width, suffix, q] of widths) {
    const out = `${stem}${suffix}.webp`;
    await base.clone().resize({ width, withoutEnlargement: true }).webp({ quality: q ?? quality, effort: 6 }).toFile(out);
    const info = await stat(out);
    console.log(`${out} ${(info.size / 1024).toFixed(0)}kb`);
  }
}
if (missing) console.warn(`\n${missing} source(s) were not found. Set MEDIA_SOURCE_ROOT to your checkout root.`);
