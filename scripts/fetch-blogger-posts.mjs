#!/usr/bin/env node
// scripts/fetch-blogger-posts.mjs
// Imports blog posts from rezpaditya.blogspot.com into content/blog/ as MDX files.
// Fetches posts published from 2024-09-01 onwards.
// Run locally: node scripts/fetch-blogger-posts.mjs

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content", "blog");
const BLOG_HOST  = "rezpaditya.blogspot.com";
const FROM_DATE  = "2024-09-01T00:00:00";

// ── Fetch ─────────────────────────────────────────────────────────────────────

async function fetchPage(startIndex) {
  const url =
    `https://${BLOG_HOST}/feeds/posts/default` +
    `?published-min=${FROM_DATE}` +
    `&max-results=25` +
    `&start-index=${startIndex}` +
    `&alt=atom`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 respa-dot-id/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching feed`);
  return res.text();
}

async function fetchAllEntries() {
  const entries = [];
  for (let i = 1; ; i += 25) {
    process.stdout.write(`  Fetching posts ${i}–${i + 24}... `);
    const xml   = await fetchPage(i);
    const batch = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
    console.log(`got ${batch.length}`);
    entries.push(...batch);
    if (batch.length < 25) break;
  }
  return entries;
}

// ── Parse ─────────────────────────────────────────────────────────────────────

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

// Replace any respa.id image host with blogspot so images still work
// after the domain is reassigned.
function normalizeSrc(src) {
  return src
    .replace(/https?:\/\/(?:www\.)?respa\.id/g, `https://${BLOG_HOST}`)
    .trim();
}

function htmlToMd(html) {
  let s = html;

  // Normalize image hosts first
  s = s.replace(/https?:\/\/(?:www\.)?respa\.id/g, `https://${BLOG_HOST}`);

  // Headings
  for (let n = 4; n >= 1; n--) {
    const hashes = "#".repeat(n);
    s = s.replace(new RegExp(`<h${n}[^>]*>([\\s\\S]*?)<\\/h${n}>`, "gi"),
      (_, t) => `\n${hashes} ${stripTags(t).trim()}\n`);
  }

  // Images (handle both src-first and alt-first attribute orders)
  s = s.replace(/<img[^>]+>/gi, (tag) => {
    const srcM = tag.match(/src=['"]([^'"]+)['"]/i);
    const altM = tag.match(/alt=['"]([^'"]*)['"]/i);
    if (!srcM) return "";
    return `\n![${altM ? altM[1] : ""}](${normalizeSrc(srcM[1])})\n`;
  });

  // Links
  s = s.replace(/<a[^>]+href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => `[${stripTags(text).trim()}](${href})`);

  // Bold / italic
  s = s.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi,
    (_, t) => `**${stripTags(t).trim()}**`);
  s = s.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi,
    (_, t) => `*${stripTags(t).trim()}*`);

  // Blockquotes
  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    (_, t) => `\n> ${htmlToMd(t).trim().replace(/\n/g, "\n> ")}\n`);

  // Unordered lists
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) =>
    "\n" + [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m) => `- ${stripTags(m[1]).trim()}`).join("\n") + "\n"
  );

  // Ordered lists
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) =>
    "\n" + [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m, i) => `${i + 1}. ${stripTags(m[1]).trim()}`).join("\n") + "\n"
  );

  // Paragraphs
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => {
    const text = stripTags(t).trim();
    return text ? `\n${decodeEntities(text)}\n` : "";
  });

  // Line breaks & divs
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, (_, t) => `\n${htmlToMd(t)}\n`);

  // Strip any remaining tags and decode entities
  s = stripTags(s);
  s = decodeEntities(s);

  // Collapse 3+ blank lines to 2
  s = s.replace(/\n{3,}/g, "\n\n").trim();

  return s;
}

function parseEntry(raw) {
  // Title
  const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/);
  const title = decodeEntities(titleMatch?.[1] ?? "Untitled").trim();

  // Date
  const pubMatch = raw.match(/<published>(.*?)<\/published>/);
  const date = pubMatch?.[1]?.slice(0, 10) ?? "";

  // Slug — from the alternate href  e.g. /2024/10/my-post-title.html
  const altLink = raw.match(/<link rel=['"]alternate['"][^>]*href=['"]([^'"]+)['"]/);
  const postUrl = altLink?.[1] ?? "";
  const slugFromUrl = postUrl.match(/\/(\d{4}\/\d{2}\/)([^.]+)\.html/)?.[2] ?? "";
  const slug = slugFromUrl ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Tags
  const tags = [...raw.matchAll(/<category[^>]*term=['"]([^'"]+)['"]/g)].map((m) => m[1]);

  // Content (may be CDATA-wrapped or entity-encoded)
  const contentMatch = raw.match(/<content[^>]*>([\s\S]*?)<\/content>/);
  let html = contentMatch?.[1] ?? "";
  html = html.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  html = decodeEntities(html);

  // Cover image — first <img> in the content
  const firstImg = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  const coverImage = firstImg ? normalizeSrc(firstImg[1]) : "";

  // Excerpt — first non-empty paragraph, stripped
  const firstPara = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const excerpt = firstPara
    ? stripTags(decodeEntities(firstPara[1])).replace(/\s+/g, " ").trim().slice(0, 200)
    : "";

  const content = htmlToMd(html);

  return { title, date, slug, tags, coverImage, excerpt, content };
}

// ── Write MDX ─────────────────────────────────────────────────────────────────

function buildMdx({ title, date, excerpt, coverImage, tags, content }) {
  const lines = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `date: "${date}"`,
    `excerpt: ${JSON.stringify(excerpt)}`,
  ];
  if (coverImage) lines.push(`coverImage: ${JSON.stringify(coverImage)}`);
  if (tags.length) lines.push(`tags: [${tags.map((t) => JSON.stringify(t)).join(", ")}]`);
  lines.push("---", "", content, "");
  return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`Fetching posts from ${BLOG_HOST} (${FROM_DATE} → today)...`);
mkdirSync(CONTENT_DIR, { recursive: true });

const entries = await fetchAllEntries();
console.log(`\nParsing ${entries.length} entries...\n`);

let written = 0;
for (const raw of entries) {
  const post = parseEntry(raw);
  if (!post.date) continue;
  const file = join(CONTENT_DIR, `${post.slug}.mdx`);
  writeFileSync(file, buildMdx(post));
  console.log(`  ✓ ${post.date}  ${post.title}`);
  written++;
}

console.log(`\nDone — ${written} posts written to content/blog/`);
console.log(`\nNext steps:`);
console.log(`  git add content/blog/`);
console.log(`  git commit -m "feat: import blog posts from Blogger"`);
console.log(`  git push`);
