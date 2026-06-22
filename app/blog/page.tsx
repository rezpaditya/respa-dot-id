import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing about software engineering, travel, and photography.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-14">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">Blog</h1>
        <p className="text-[var(--muted)] max-w-md leading-relaxed">
          Writing about software engineering, travel, and the occasional
          intersection of the two.
        </p>
      </div>

      <div className="grid gap-0 divide-y divide-[var(--border)]">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group grid md:grid-cols-[1fr_280px] gap-6 md:gap-10 py-10 items-start"
          >
            <div>
              <div className="flex gap-3 mb-3 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs tracking-wide uppercase text-[var(--accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-semibold tracking-tight mb-3 group-hover:text-[var(--accent)] transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-[var(--muted)] leading-relaxed text-sm mb-4">
                {post.excerpt}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {post.coverImage && (
              <div className="relative aspect-video overflow-hidden bg-[var(--border)] order-first md:order-last">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
