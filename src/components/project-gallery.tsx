"use client";

import { useState, useCallback, useEffect } from "react";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

interface ProjectGalleryProps {
  title: string;
  summary: string | null;
  images: GalleryImage[];
}

export default function ProjectGallery({ title, summary, images }: ProjectGalleryProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const nextBanner = useCallback(() => {
    if (images.length === 0) return;
    setCurrentBanner((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevBanner = useCallback(() => {
    if (images.length === 0) return;
    setCurrentBanner((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const nextLightbox = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return;
    setLightboxIndex((prev) => (prev! + 1) % images.length);
  }, [lightboxIndex, images.length]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return;
    setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [lightboxIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  const hasImages = images.length > 0;

  return (
    <>
      {/* Banner Slider */}
      {hasImages && (
        <div className="relative w-full aspect-[21/9] bg-[#0a0a0a] overflow-hidden group">
          {/* Current banner image */}
          <img
            src={images[currentBanner].image_url}
            alt={images[currentBanner].caption || title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              {title}
            </h1>
            {summary && (
              <p className="mt-2 text-sm text-white/70 max-w-2xl line-clamp-2">{summary}</p>
            )}
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevBanner}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-3 right-6 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentBanner
                        ? "bg-[#e8751a] w-5"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/80">
              {currentBanner + 1} / {images.length}
            </div>
          )}
        </div>
      )}

      {/* No images fallback banner */}
      {!hasImages && (
        <div className="relative w-full aspect-[21/9] bg-gradient-to-br from-[#1a1a1a] to-[#333] flex items-end">
          <div className="p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{title}</h1>
            {summary && <p className="mt-2 text-sm text-white/70 max-w-2xl">{summary}</p>}
          </div>
        </div>
      )}

      {/* Image Tiles Grid — 4x2 */}
      {hasImages && (
        <div className="px-6 lg:px-10 py-1 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-4 gap-[3px]">
            {images.slice(0, 8).map((img, idx) => (
              <button
                key={img.id}
                onClick={() => openLightbox(idx)}
                className="relative aspect-square overflow-hidden bg-[#1a1a1a] group/tile focus:outline-none"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || `Project image ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/tile:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/tile:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Show more tiles if more than 8 images */}
          {images.length > 8 && (
            <div className="grid grid-cols-4 gap-[3px] mt-[3px]">
              {images.slice(8).map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => openLightbox(idx + 8)}
                  className="relative aspect-square overflow-hidden bg-[#1a1a1a] group/tile focus:outline-none"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || `Project image ${idx + 9}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/tile:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/tile:bg-black/30 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].caption || "Project image"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Caption */}
          {images[lightboxIndex].caption && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white/80 max-w-lg text-center">
              {images[lightboxIndex].caption}
            </div>
          )}
        </div>
      )}
    </>
  );
}
