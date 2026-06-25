import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content/blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(contentDir, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        coverImage: data.coverImage ?? "",
        tags: data.tags ?? [],
      } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Strip the first image from the body if it's already used as the cover
  // to prevent it rendering twice (once as hero, once in the MDX content).
  let cleanContent = content.trimStart();
  if (data.coverImage) {
    cleanContent = cleanContent
      .replace(/^\[!\[.*?\]\(.*?\)\]\(.*?\)\s*\n?/, "")
      .replace(/^!\[.*?\]\(.*?\)\s*\n?/, "")
      .trimStart();
  }

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? "",
    tags: data.tags ?? [],
    content: cleanContent,
  };
}
