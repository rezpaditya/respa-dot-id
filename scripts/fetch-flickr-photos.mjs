#!/usr/bin/env node
// scripts/fetch-flickr-photos.mjs
// Fetches your public Flickr photo URLs and rewrites data/photos.ts.
// No downloads, no API key needed — photos are served directly from Flickr.
// Run once locally: node scripts/fetch-flickr-photos.mjs

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const FLICKR_USER_ID = "197247054@N04";
const DATA_FILE = join(ROOT, "data", "photos.ts");

async function fetchPhotoUrls() {
  const url = `https://www.flickr.com/services/feeds/photos_public.gne?id=${FLICKR_USER_ID}&format=atom`;
  console.log("Fetching Flickr feed...");
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 respa-dot-id/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — is your Flickr set to public?`);
  const xml = await res.text();

  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);

  return entries.map((entry, i) => {
    const titleMatch = entry.match(/<title[^>]*>(.*?)<\/title>/);
    const title = titleMatch
      ? titleMatch[1]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/<!\[CDATA\[|\]\]>/g, "")
          .trim()
      : `Photo ${i + 1}`;

    // The feed embeds a medium image (_m.jpg, ~240px).
    // Replace _m with _b to get the large version (1024px longest side).
    const imgMatch = entry.match(/https:\/\/live\.staticflickr\.com\/[^\s"']+_m\.jpg/);
    const src = imgMatch ? imgMatch[0].replace("_m.jpg", "_b.jpg") : null;

    return { id: String(i + 1), src, alt: title };
  }).filter((p) => p.src);
}

function buildDataFile(photos) {
  const rows = photos
    .map(
      (p) =>
        `  { id: "${p.id}", src: ${JSON.stringify(p.src)}, alt: ${JSON.stringify(p.alt)}, width: 1024, height: 683 }`
    )
    .join(",\n");

  return `export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  location?: string;
  year?: number;
}

export const photos: Photo[] = [
${rows},
];
`;
}

const photos = await fetchPhotoUrls();
console.log(`Found ${photos.length} photos`);
photos.forEach((p) => console.log(`  • ${p.alt}\n    ${p.src}`));

writeFileSync(DATA_FILE, buildDataFile(photos));
console.log(`\n✓ Updated data/photos.ts`);
console.log(`\nNext:\n  git add data/photos.ts\n  git commit -m "feat: use real Flickr photo URLs"\n  git push`);
