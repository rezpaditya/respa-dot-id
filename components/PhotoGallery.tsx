"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { Photo } from "@/data/photos";

interface Props {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: Props) {
  const [index, setIndex] = useState(-1);

  const open = useCallback((i: number) => setIndex(i), []);

  const slides = photos.map((p) => ({
    src: p.src,
    alt: p.alt,
    width: p.width,
    height: p.height,
  }));

  return (
    <>
      <div
        style={{
          columns: "3 280px",
          gap: "8px",
        }}
      >
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => open(i)}
            className="block w-full mb-2 overflow-hidden group cursor-zoom-in focus:outline-none"
            style={{ breakInside: "avoid" }}
          >
            <div className="relative overflow-hidden bg-[var(--border)]">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
                <div className="text-white text-xs">
                  {photo.location && <span>{photo.location}</span>}
                  {photo.year && <span className="ml-2 opacity-75">·{photo.year}</span>}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        on={{ view: ({ index: i }) => setIndex(i) }}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
        }}
      />
    </>
  );
}
