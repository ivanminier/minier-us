import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, join, parse } from 'node:path';

const jobs = [
  { src: 'public/media/lineup/icon.png', out: 'public/media/lineup/icon.webp', width: 512 },
  { src: 'public/media/lineup/icon.png', out: 'public/media/lineup/icon-256.webp', width: 256 },
  { src: 'public/media/lineup/src-welcome.png', out: 'public/media/lineup/welcome.webp', width: 900 },
  { src: 'public/media/lineup/src-sources.png', out: 'public/media/lineup/sources.webp', width: 900 },
  { src: 'public/media/lineup/src-profile.png', out: 'public/media/lineup/profile.webp', width: 900 },
  { src: 'public/media/lineup/src-home.png', out: 'public/media/lineup/home.webp', width: 900 },
  { src: 'public/media/lineup/src-home.png', out: 'public/media/lineup/home-sm.webp', width: 480 },
  { src: 'public/media/lineup/src-edit-home.png', out: 'public/media/lineup/edit-home.webp', width: 900 },
  { src: 'public/media/rental-record/icon.png', out: 'public/media/rental-record/icon.webp', width: 256 },
  { src: 'public/media/modeboard/icon.png', out: 'public/media/modeboard/icon.webp', width: 256 },
  { src: 'public/media/modeboard/src-profile-overview.png', out: 'public/media/modeboard/profile-overview.webp', width: 1400 },
  { src: 'public/media/modeboard/src-profile-overview.png', out: 'public/media/modeboard/profile-overview-sm.webp', width: 800 },
  { src: 'public/media/modeboard/src-appearance-dock.png', out: 'public/media/modeboard/appearance-dock.webp', width: 1400 },
  { src: 'public/media/modeboard/src-backups-restore.png', out: 'public/media/modeboard/backups-restore.webp', width: 1400 },
  { src: 'public/media/modeboard/src-menu-bar.png', out: 'public/media/modeboard/menu-bar.webp', width: 1400 },
  { src: 'public/media/modeboard/src-onboarding-focus.png', out: 'public/media/modeboard/onboarding-focus.webp', width: 1400 },
  { src: 'public/media/modeboard/src-getting-started.png', out: 'public/media/modeboard/getting-started.webp', width: 1400 },
  { src: 'public/media/tideframe/icon.png', out: 'public/media/tideframe/icon.webp', width: 512 },
  { src: 'public/media/trinity/logo.png', out: 'public/media/trinity/logo.webp', width: 256 },
  { src: 'public/media/trinity/src-home-hero.jpg', out: 'public/media/trinity/home-hero.webp', width: 1600 },
  { src: 'public/media/trinity/src-home-hero.jpg', out: 'public/media/trinity/home-hero-sm.webp', width: 800 },
  { src: 'public/media/trinity/src-map.jpg', out: 'public/media/trinity/map.webp', width: 1400 },
  { src: 'public/media/trinity/src-peaks.jpg', out: 'public/media/trinity/peaks.webp', width: 1400 },
  { src: 'public/media/trinity/src-rise.jpg', out: 'public/media/trinity/rise.webp', width: 1400 },
  { src: 'public/media/trinity/src-cottages.jpg', out: 'public/media/trinity/cottages.webp', width: 1400 },
  { src: 'public/media/trinity/src-vision.jpg', out: 'public/media/trinity/vision.webp', width: 1400 },
  { src: 'public/media/laundrylink/logo.png', out: 'public/media/laundrylink/logo.webp', width: 256 },
];

async function run() {
  for (const job of jobs) {
    await mkdir(dirname(job.out), { recursive: true });
    await sharp(job.src)
      .rotate()
      .resize({ width: job.width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(job.out);
    const info = await stat(job.out);
    console.log(`${job.out} ${(info.size / 1024).toFixed(0)}kb`);
  }
}

await run();
