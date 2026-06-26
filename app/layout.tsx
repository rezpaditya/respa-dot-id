import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Respa Putra",
    template: "%s — Respa Putra",
  },
  description:
    "Software engineer and photographer based in Indonesia. Sharing code, travel stories, and visual work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Nav />
        <main className="flex-1 pt-16">{children}</main>
        <footer className="border-t border-[var(--border)] py-8 mt-24">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--muted)]">
            <span>© {new Date().getFullYear()} Respa Putra</span>
            <span>Built with Next.js · Deployed on Cloud Run</span>
          </div>
        </footer>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FCYGKV6D51"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FCYGKV6D51');
        `}</Script>
      </body>
    </html>
  );
}
