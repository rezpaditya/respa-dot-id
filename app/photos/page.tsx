import type { Metadata } from "next";
import PhotoGallery from "@/components/PhotoGallery";
import { photos } from "@/data/photos";

export const metadata: Metadata = {
  title: "Photos",
  description: "A collection of photographs from travels across Indonesia and beyond.",
};

export default function PhotosPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-14">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">Photos</h1>
        <p className="text-[var(--muted)] max-w-md leading-relaxed">
          A visual journal — landscapes, streets, people, and quiet moments from
          travels across Indonesia and beyond.
        </p>
      </div>
      <PhotoGallery photos={photos} />
    </div>
  );
}
