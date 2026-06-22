import type { Metadata } from "next";
import Image from "next/image";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Software engineering projects — web applications, tools, and systems.",
};

export default function PortfolioPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-14">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">Portfolio</h1>
        <p className="text-[var(--muted)] max-w-md leading-relaxed">
          A selection of software projects I&apos;ve designed and built — from
          internal tools to consumer apps.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-[var(--border)] mb-5">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay arrow */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <span className="text-white text-2xl">↗</span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-semibold text-base mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </h2>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {project.description}
                </p>
              </div>
              <span className="text-xs text-[var(--muted)] shrink-0 mt-0.5">
                {project.year}
              </span>
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mt-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 border border-[var(--border)] text-[var(--muted)] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
