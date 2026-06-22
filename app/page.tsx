import Link from "next/link";
import Image from "next/image";
import { photos } from "@/data/photos";
import { getAllPosts } from "@/lib/blog";
import { projects } from "@/data/portfolio";

export default function Home() {
  const latestPhotos = photos.slice(0, 3);
  const latestPosts = getAllPosts().slice(0, 2);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="py-24 md:py-36">
        <p className="text-sm tracking-widest uppercase text-[var(--accent)] mb-6">
          Software Engineer &amp; Photographer
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mb-8 max-w-2xl">
          Hello, I&apos;m Rezpa.
        </h1>
        <p className="text-lg text-[var(--muted)] leading-relaxed max-w-xl mb-10">
          I build software, take photographs, and write about both. Based in
          Indonesia — occasionally found on volcanoes or in coffee shops with a
          laptop.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/portfolio"
            className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-full hover:opacity-80 transition-opacity"
          >
            View My Work
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 border border-[var(--border)] text-[var(--foreground)] text-sm font-medium rounded-full hover:border-[var(--foreground)] transition-colors"
          >
            Read the Blog
          </Link>
        </div>
      </section>

      {/* Latest Photos */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-xl font-semibold tracking-tight">Recent Photos</h2>
          <Link
            href="/photos"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {latestPhotos.map((photo) => (
            <Link key={photo.id} href="/photos" className="group block overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-[var(--border)]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 320px"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-xl font-semibold tracking-tight">From the Blog</h2>
          <Link
            href="/blog"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            See all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {latestPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="relative aspect-video overflow-hidden bg-[var(--border)] mb-4">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
              <div className="flex gap-3 mb-2 flex-wrap">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs tracking-wide uppercase text-[var(--accent)]">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-semibold text-lg leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{post.excerpt}</p>
              <p className="text-xs text-[var(--muted)] mt-3">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-xl font-semibold tracking-tight">Selected Work</h2>
          <Link
            href="/portfolio"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            See all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-video overflow-hidden bg-[var(--border)] mb-3">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="font-medium text-sm mb-1 group-hover:text-[var(--accent)] transition-colors">
                {project.title}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {project.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-[var(--muted)]">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
