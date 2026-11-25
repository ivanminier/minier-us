import sharp from "sharp";
import { readFile } from "node:fs/promises";
const [m, lineup, rental, sameMinute, trinity] = await Promise.all(
  ["lineup", "lineup-current", "rental-record", "same-minute", "trinity"].map(
    async (name) => JSON.parse(await readFile(`src/data/${name}-media.json`, "utf8")),
  ),
);
const requested = new Set(process.argv.slice(2));
for (const [key, title, subtitle, bg, fg, img] of [
  [
    "home-r3",
    "Ivan Minier",
    "Communication, design & things that work.",
    "#f5f1e9",
    "#202522",
    m.tv.src,
  ],
  [
    "lineup-r3",
    "Lineup",
    "Your sources. A better way to watch. Coming soon.",
    "#0b1420",
    "#eef5ff",
    m.tv.src,
  ],
  [
    "home-direct",
    "Ivan Minier",
    "Communication, design & things that work.",
    "#f5f1e9",
    "#202522",
    lineup.tv.src,
  ],
  [
    "lineup-direct",
    "Lineup",
    "A player and organizer for your own television sources.",
    "#0b1420",
    "#eef5ff",
    lineup.tv.src,
  ],
  [
    "rental-record-update",
    "Rental Record",
    "A guided record from move-in to move-out.",
    "#f2ead9",
    "#202522",
    rental.report.src,
  ],
  [
    "same-minute",
    "Same Minute",
    "A focus timer for two.",
    "#e3eee7",
    "#18352d",
    sameMinute.together.src,
  ],
  [
    "trinity-v14",
    "Trinity Redistricting",
    "An independent student housing proposal for UVM.",
    "#edf0e7",
    "#24392d",
    trinity.district.src,
  ],
  [
    "share-r3",
    "Ivan Minier",
    "Public Communication · Product builder · Tideframe Labs",
    "#f5f1e9",
    "#202522",
    null,
  ],
]) {
  if (requested.size && !requested.has(key)) continue;
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${bg}"/><text x="60" y="80" font-family="sans-serif" font-size="22" fill="${fg}">MINIER.US / SELECTED WORK</text><text x="60" y="470" font-family="serif" font-size="76" fill="${fg}">${title}</text><text x="60" y="535" font-family="sans-serif" font-size="26" fill="${fg}">${subtitle.replaceAll("&", "&amp;")}</text></svg>`,
  );
  const layers = [{ input: svg, left: 0, top: 0 }];
  if (img)
    layers.push({
      input: await sharp("public" + img)
        .resize({ width: 580, height: 326, fit: "contain", background: bg })
        .toBuffer(),
      left: 560,
      top: 100,
    });
  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: bg },
  })
    .composite(layers)
    .png()
    .toFile("public/media/og/" + key + ".png");
}
