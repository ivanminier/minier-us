import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const W = 1200;
const H = 630;

async function card({ file, bg, img, imgLeft, imgTop, imgW, imgH, label, lines, dark = false, fit = 'cover' }) {
  const layers = [];
  if (img) {
    const prepared = await sharp(img)
      .resize({ width: imgW, height: imgH, fit, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    layers.push({ input: prepared, left: imgLeft, top: imgTop });
  }
  const ink = dark ? '#f4f0ea' : '#161412';
  const mute = dark ? '#a39a90' : '#6f6860';
  const text = lines
    .map((line, i) => `<tspan x="64" dy="${i === 0 ? 0 : 52}">${line}</tspan>`)
    .join('');
  const svg = Buffer.from(`<?xml version="1.0"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="64" y="92" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="22" letter-spacing="3" fill="${mute}">${label}</text>
  <text x="64" y="508" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="40" font-weight="600" fill="${ink}">${text}</text>
</svg>`);
  layers.push({ input: svg, left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: bg } })
    .composite(layers)
    .png({ quality: 90 })
    .toFile(file);
  console.log(file);
}

await mkdir('public/media/og', { recursive: true });

await card({
  file: 'public/media/og/home.png',
  bg: '#141210',
  img: 'public/media/lineup/home.webp',
  imgLeft: 800,
  imgTop: 42,
  imgW: 251,
  imgH: 546,
  fit: 'contain',
  label: 'IVAN MINIER',
  lines: ['I turn messy systems', 'into calm products.'],
  dark: true,
});

await card({
  file: 'public/media/og/lineup.png',
  bg: '#0d1114',
  img: 'public/media/lineup/home.webp',
  imgLeft: 790,
  imgTop: 42,
  imgW: 251,
  imgH: 546,
  fit: 'contain',
  label: 'LINEUP',
  lines: ['Your provider gives', 'you channels.'],
  dark: true,
});

await card({
  file: 'public/media/og/rental-record.png',
  bg: '#f3efe8',
  img: 'public/media/rental-record/iphone-cases.webp',
  imgLeft: 800,
  imgTop: 42,
  imgW: 251,
  imgH: 546,
  fit: 'contain',
  label: 'TIDEFRAME RENTAL RECORD',
  lines: ['Document your', 'rental clearly.'],
});

await card({
  file: 'public/media/og/modeboard.png',
  bg: '#ece7de',
  img: 'public/media/modeboard/profile-overview.webp',
  imgLeft: 470,
  imgTop: 66,
  imgW: 686,
  imgH: 500,
  fit: 'contain',
  label: 'MODEBOARD',
  lines: ['Switch your whole', 'Mac workspace.'],
});

await card({
  file: 'public/media/og/trinity.png',
  bg: '#e8efe8',
  img: 'public/media/trinity/home-hero.webp',
  imgLeft: 560,
  imgTop: 0,
  imgW: 640,
  imgH: 630,
  label: 'TRINITY REDISTRICTING',
  lines: ['An independent', 'housing vision.'],
});

await card({
  file: 'public/media/og/laundrylink.png',
  bg: '#154734',
  img: 'public/media/laundrylink/logo.webp',
  imgLeft: 800,
  imgTop: 175,
  imgW: 280,
  imgH: 280,
  label: 'UVM LAUNDRYLINK',
  lines: ['See what is', 'open first.'],
  dark: true,
});

await sharp('public/media/og/home.png').toFile('public/media/og/share.png');
await sharp('public/media/og/home.png').toFile('public/og.png');
