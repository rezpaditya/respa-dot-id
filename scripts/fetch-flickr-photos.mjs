#!/usr/bin/env node
// scripts/fetch-flickr-photos.mjs
// Downloads your public Flickr photos into public/photos/ and rewrites data/photos.ts
// Run locally: node scripts/fetch-flickr-photos.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const FLICKR_USER_ID = "197247054@N04";
const OUT_DIR = join(ROOT, "public", "photos");
const DATA_FILE = join(ROOT, "data", "photos.ts");

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "respa-dot-id/1.0 (personal website photo sync)" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// Flickr public RSS feed — no API key required
async function fetchPhotoList() {
  const feedUrl = `https://www.flickr.com/services/feeds/photos_public.gne?id=${FLICKR_USER_ID}&format=atom&count=50`;
  console.log("Fetching Flickr feed...");
  const res = await fetchWithRetry(feedUrl);
  const xml = await res.text();

  // Extract entries from Atom feed
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(
    (m) => m[1]
  );

  const photos = entries.map((entry, i) => {
    // Title
    const titleMatch = entry.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") : `Photo ${i + 1}`;

    // Flickr page URL
    const linkMatch = entry.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
    const flickrUrl = linkMatch ? linkMatch[1] : "";

    // Photo ID from URL (e.g. /photos/user/12345678/)
    const idMatch = flickrUrl.match(/\/photos\/[^/]+\/(\d+)/);
    const photoId = idMatch ? idMatch[1] : String(i);

    // Image URL from <link rel="enclosure"> or <img> inside content
    // The feed embeds a medium image: https://live.staticflickr.com/.../xxx_m.jpg
    // Replace _m with _b to get large (1024px)
    const imgMatch = entry.match(/https:\/\/live\.staticflickr\.com\/[^"'\s]+_m\.jpg/);
    const mediumUrl = imgMatch ? imgMatch[0] : null;
    const largeUrl = mediumUrl ? mediumUrl.replace("_m.jpg", "_b.jpg") : null;

    return { photoId, title, flickrUrl, mediumUrl, largeUrl };
  });

  return photos.filter((p) => p.largeUrl);
}

async function downloadImage(url, destPath) {
  if (existsSync(destPath)) {
    console.log(`  ✓ Already exists: ${destPath.split("/public/")[1]}`);
    return;
  }
  const res = await fetchWithRetry(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buffer);
  console.log(`  ↓ Downloaded: ${destPath.split("/public/")[1]} (${Math.round(buffer.length / 1024)} KB)`);
}

async function getImageDimensions(filePath) {
  // Read JPEG dimensions from EXIF/SOF markers without external deps
  const buf = readFileSync(filePath);
  for (let i = 0; i < buf.length - 8; i++) {
    // SOF0, SOF1, SOF2 markers
    if (buf[i] === 0xff && (buf[i + 1] === 0xc0 || buf[i + 1] === 0xc1 || buf[i + 1] === 0xc2)) {
      const height = (buf[i + 5] << 8) | buf[i + 6];
      const width = (buf[i + 7] << 8) | buf[i + 8];
      if (width > 0 && height > 0) return { width, height };
    }
  }
  return { width: 1024, height: 768 }; // fallback
}

function generateDataFile(photos) {
  const entries = photos
    .map(
      (p, i) => `  {
    id: "${i + 1}",
    src: "/photos/${p.filename}",
    alt: ${JSON.stringify(p.title)},
    width: ${p.width},
    height: ${p.height},
  }`
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
${entries},
];
`;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const photoList = await fetchPhotoList();
  console.log(`Found ${photoList.length} photos in feed`);

  if (photoList.length === 0) {
    console.error("No photos found. Make sure your Flickr photos are public.");
    process.exit(1);
  }

  const results = [];
  for (const photo of photoList) {
    const filename = `${photo.photoId}.jpg`;
    const destPath = join(OUT_DIR, filename);

    try {
      await downloadImage(photo.largeUrl, destPath);
      const { width, height } = await getImageDimensions(destPath);
      results.push({ ...photo, filename, width, height });
    } catch (err) {
      console.warn(`  ✗ Failed to download ${photo.photoId}: ${err.message}`);
    }
  }

  console.log(`\nDownloaded ${results.length} photos to public/photos/`);

  // Rewrite data/photos.ts
  const dataContent = generateDataFile(results);
  writeFileSync(DATA_FILE, dataContent);
  console.log(`Updated data/photos.ts`);

  console.log(`
Done! Next steps:
  git add public/photos/ data/photos.ts
  git commit -m "feat: add real Flickr photos"
  git push
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
