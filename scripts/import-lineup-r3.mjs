import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const source =
  "/Users/ivanminier/Developer/Lineup/artifacts/marketing/lineup/2026-10-27-r3/";
const selected = {
  home: "iphone/01-home",
  tv: "appletv/01-home",
  guide: "ipad/02-guide",
  review: "ipad/08-smart-lineup",
  multiview: "appletv/03-multiview",
  series: "iphone/05-series-detail",
};
const manifest = JSON.parse(
  await readFile(source + "web/manifest.json", "utf8"),
);
const result = {};
await mkdir("public/media/lineup/r3", { recursive: true });
for (const [key, value] of Object.entries(selected)) {
  const m = manifest.images.find((x) => x.image === "web/" + value + ".webp");
  const input = await readFile(source + m.image);
  const hash = createHash("sha256").update(input).digest("hex").slice(0, 10);
  const meta = await sharp(input).metadata();
  const widths = [
    ...new Set([
      Math.min(480, meta.width),
      Math.min(960, meta.width),
      meta.width,
    ]),
  ];
  const variants = [];
  for (const w of widths) {
    const name = `${key}-${hash}-${w}.webp`;
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile("public/media/lineup/r3/" + name);
    variants.push({ src: "/media/lineup/r3/" + name, width: w });
  }
  result[key] = {
    src: variants.at(-1).src,
    srcset: variants.map((x) => `${x.src} ${x.width}w`).join(", "),
    width: meta.width,
    height: meta.height,
    alt: m.alt,
    caption: m.caption,
    proRequired: m.proRequired,
    presentation:
      meta.height > meta.width
        ? "device"
        : key === "tv" || key === "multiview"
          ? "tv"
          : "screen",
  };
}
await writeFile(
  "src/data/lineup-media.json",
  JSON.stringify(result, null, 2) + "\n",
);
await writeFile(
  "public/media/lineup/r3/provenance.json",
  JSON.stringify(
    {
      revision: "2026-10-27-r3",
      source: "Approved local web derivatives; raw captures untouched",
      images: result,
    },
    null,
    2,
  ) + "\n",
);
await writeFile(
  "public/media/lineup/r3/CREDITS.md",
  await readFile(source + "MEDIA_CREDITS.md"),
);
console.log("Imported", Object.keys(result));
