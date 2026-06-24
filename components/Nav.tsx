"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/photos", label: "Photos" },
  { href: "/blog", label: "Blog" },
  { href: "/portfolio", label: "Portfolio" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-sm border-b border-[var(--border)]">
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-widest uppercase text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
        >
          Respa Putra
        </Link>
        <ul className="flex gap-7">
          {links.slice(1).map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm tracking-wide transition-colors ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-[var(--foreground)] font-medium"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
