"use client";

import { useState } from "react";
import Link from "next/link";

/* ───────────────────── DATA ───────────────────── */

const designPatterns = [
  { id: "buffalo", label: "Buffalo", icon: "grid" },
  { id: "gingham", label: "Gingham", icon: "check" },
  { id: "pincheck", label: "Pincheck", icon: "dots" },
  { id: "tartan", label: "Tartan", icon: "cross" },
  { id: "tattersall", label: "Tattersall", icon: "lines" },
  { id: "windowpane", label: "Windowpane", icon: "square" },
];

const colorways = [
  { name: "Picket Fence", code: "WQ01", hex: "#c8bfb0" },
  { name: "Loft", code: "WQ06", hex: "#7a6e60" },
  { name: "White Elm", code: "WQ07", hex: "#d9d0c4" },
  { name: "Lyed Larch", code: "WQ30", hex: "#b5a88e" },
  { name: "White Oak", code: "WQ13", hex: "#ccc3b0" },
  { name: "Baltic Birch", code: "WQ12", hex: "#8a7e6e" },
  { name: "Knotty Spruce", code: "WQ29", hex: "#6e6354" },
  { name: "French Bobbin", code: "WQ08", hex: "#a09080" },
  { name: "Boat Shed", code: "WQ02", hex: "#5a5044" },
  { name: "Nordic Plank", code: "WQ15", hex: "#9e9080" },
  { name: "Boardwalk", code: "WQ10", hex: "#7e7264" },
  { name: "Mocha Legno", code: "WQ25", hex: "#6a5e50" },
  { name: "Mountain Lodge", code: "WQ24", hex: "#5e5448" },
  { name: "Wine Barrel", code: "WQ03", hex: "#4e4438" },
  { name: "Log Cabin", code: "WQ04", hex: "#544a3e" },
  { name: "Natural Oak", code: "WQ16", hex: "#b8a888" },
  { name: "Woodland Fog", code: "WQ22", hex: "#8e8878" },
  { name: "Driftwood", code: "WQ21", hex: "#7a7468" },
  { name: "Weathered Slate", code: "WQ14", hex: "#686058" },
  { name: "Petrified Ash", code: "WQ23", hex: "#5e5a50" },
  { name: "Antique Chest", code: "WQ11", hex: "#6e5840" },
  { name: "European Larch", code: "WQ17", hex: "#8a7050" },
  { name: "Fumed Oak", code: "WQ19", hex: "#504030" },
  { name: "Teak", code: "WQ18", hex: "#6e5438" },
  { name: "Charred Larch", code: "WQ09", hex: "#3a3028" },
  { name: "Shadow Oak", code: "WQ28", hex: "#484038" },
  { name: "Barn Door", code: "WQ05", hex: "#5a4e40" },
  { name: "Black Walnut", code: "WQ20", hex: "#3e3428" },
  { name: "Scorched Timber", code: "WQ26", hex: "#342c24" },
  { name: "Espresso Oak", code: "WQ27", hex: "#4a3e30" },
];

const specs = [
  { label: "Surface", value: "Ceiling" },
  { label: "Material", value: "Felt (100% polyester)" },
  { label: "Recycled Content", value: "60% minimum" },
  { label: "NRC Rating", value: "Testing in progress" },
  { label: "Thickness", value: '1/2" (12mm)' },
  { label: "Dimensions", value: '4" H x 24" W x 24" L\n6" H x 24" W x 24" L' },
  { label: "Fire Test", value: "ASTM E84-17a Class A" },
  { label: "Lead Time", value: "3–6 weeks" },
  { label: "Origin", value: "Manufactured and assembled in Australia" },
];

const resources = [
  "Specification Sheet",
  "Colorways",
  "Installation Guide",
  "Care Guide",
  "Warranty",
  "Material Safety",
  "LEED Contributions",
];

/* ───────────────────── ICONS ───────────────────── */

function DownloadIcon() {
  return (
    <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

/* ───────────────────── PATTERN ICON ───────────────────── */

function PatternIcon({ type }: { type: string }) {
  const size = 48;
  const stroke = "#e8751a";

  switch (type) {
    case "grid":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="18" height="18" stroke={stroke} strokeWidth="2" />
          <rect x="26" y="4" width="18" height="18" stroke={stroke} strokeWidth="2" />
          <rect x="4" y="26" width="18" height="18" stroke={stroke} strokeWidth="2" />
          <rect x="26" y="26" width="18" height="18" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case "check":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <path d="M4 4h40M4 16h40M4 28h40M4 40h40" stroke={stroke} strokeWidth="1.5" />
          <path d="M4 4v40M16 4v40M28 4v40M40 4v40" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case "dots":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {[12, 24, 36].map((y) =>
            [12, 24, 36].map((x) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill={stroke} />
            ))
          )}
        </svg>
      );
    case "cross":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <path d="M4 4h40v40H4z" stroke={stroke} strokeWidth="1.5" />
          <path d="M4 24h40M24 4v40" stroke={stroke} strokeWidth="2" />
          <path d="M4 4l40 40M44 4L4 44" stroke={stroke} strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case "lines":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <path d="M4 12h40M4 24h40M4 36h40" stroke={stroke} strokeWidth="2" />
          <path d="M12 4v40M24 4v40M36 4v40" stroke={stroke} strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case "square":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <rect x="4" y="4" width="40" height="40" stroke={stroke} strokeWidth="2" />
          <rect x="14" y="14" width="20" height="20" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

/* ───────────────────── STEP ICONS ───────────────────── */

function StepIcon({ step }: { step: number }) {
  const c = "#e8751a";
  if (step === 1)
    return (
      <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
        <circle cx="20" cy="24" r="10" stroke={c} strokeWidth="2" />
        <rect x="36" y="14" width="16" height="20" rx="2" stroke={c} strokeWidth="2" />
        <path d="M14 44l8-8 6 6 10-10 12 12" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (step === 2)
    return (
      <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="4" stroke={c} strokeWidth="2" />
        <path d="M8 24h48" stroke={c} strokeWidth="1.5" />
        <path d="M24 8v48" stroke={c} strokeWidth="1.5" />
        <circle cx="16" cy="16" r="4" fill={c} opacity="0.3" />
        <circle cx="40" cy="40" r="6" fill={c} opacity="0.2" />
      </svg>
    );
  return (
    <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
      <path d="M12 20h40M12 32h40M12 44h40" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M20 8l-8 12M44 8l8 12" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <rect x="24" y="48" width="16" height="8" rx="2" stroke={c} strokeWidth="2" />
    </svg>
  );
}

/* ───────────────────── PAGE COMPONENT ───────────────────── */

export default function ProductDetail() {
  const [activeDesign, setActiveDesign] = useState("buffalo");
  const [selectedColor, setSelectedColor] = useState("WQ01");
  const [selectedThickness, setSelectedThickness] = useState("12mm");
  const [selectedSize, setSelectedSize] = useState('4"H x 12"W x 12"L');
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const heroImages = [
    { bg: "from-[#3a3028] via-[#5a4e40] to-[#8a7e6e]", caption: "Woven, Buffalo Ceiling Frames | French Bobbin | WoodGrain Collection" },
    { bg: "from-[#5a5044] via-[#7a6e60] to-[#a09080]", caption: "Woven, Buffalo Ceiling Frames | Nordic Plank | WoodGrain Collection" },
    { bg: "from-[#6e5438] via-[#8a7050] to-[#b8a888]", caption: "Woven, Buffalo Ceiling Frames | European Larch | WoodGrain Collection" },
  ];

  const currentSelected = colorways.find((c) => c.code === selectedColor);

  return (
    <div className="bg-[#1a1a1a] text-white">
      {/* ─── Design Pattern Tabs ─── */}
      <section className="border-b border-white/10 bg-[#111]">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 overflow-x-auto px-6 py-4 lg:gap-10 lg:px-10">
          {designPatterns.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveDesign(p.id)}
              className={`flex shrink-0 flex-col items-center gap-2 transition-colors ${
                activeDesign === p.id ? "text-[#e8751a]" : "text-white/50 hover:text-white/80"
              }`}
            >
              <PatternIcon type={p.icon} />
              <span className="text-[11px] font-semibold uppercase tracking-widest">{p.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Breadcrumb ─── */}
      <div className="mx-auto max-w-[1400px] px-6 pt-6 lg:px-10">
        <nav className="flex items-center gap-2 text-[13px] text-white/40">
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">Ceiling</Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">Frames</Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">Woven</Link>
          <span>/</span>
          <span className="text-[#e8751a] font-medium">Buffalo</span>
        </nav>
        <p className="mt-1 text-[13px] text-white/40">
          Available in: <span className="text-white/60">Premier,</span>{" "}
          <span className="font-semibold text-[#e8751a]">WoodGrain</span>
        </p>
      </div>

      {/* ─── Hero Section ─── */}
      <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Woven, Buffalo
            </h1>
            <p className="mt-6 leading-relaxed text-white/70">
              Woven&apos;s Buffalo design is defined by its bold, evenly spaced grid, creating a
              striking yet balanced aesthetic. This pattern brings a sense of structure and warmth
              to any setting. Carefully engineered, it provides an ideal blend of openness and
              acoustic performance, making it well-suited for high-traffic areas. Easily integrated
              with ceiling elements such as sprinklers, speakers, and lighting, the Buffalo design
              enhances both functionality and visual appeal.
            </p>

            {/* Resource Links */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { icon: "doc", label: "Resources" },
                { icon: "symbol", label: "Design Symbols" },
                { icon: "palette", label: "Color Samples" },
                { icon: "box", label: "Product Samples" },
                { icon: "mail", label: "Request a Quote" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-2 rounded border border-white/10 px-3 py-2.5 text-[13px] text-white/70 transition-colors hover:border-[#e8751a]/50 hover:text-[#e8751a]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Hero Image Carousel */}
          <div className="relative overflow-hidden rounded-lg">
            <div
              className={`flex aspect-[4/3] items-end bg-gradient-to-br ${heroImages[heroImageIndex].bg} p-6`}
            >
              {/* Decorative pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <rect width="60" height="60" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              <p className="relative z-10 text-[13px] text-white/70">
                {heroImages[heroImageIndex].caption}
              </p>
            </div>

            {/* Carousel Nav */}
            <button
              onClick={() => setHeroImageIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/80 transition-colors hover:bg-black/70"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={() => setHeroImageIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/80 transition-colors hover:bg-black/70"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Colorways ─── */}
      <section className="border-t border-white/10 bg-[#151515]">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-bold">Colorways</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded border border-white/20 px-4 py-2 text-[13px] text-white/70 transition-colors hover:border-[#e8751a] hover:text-[#e8751a]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.25 7.11h.008v.008h-.008V7.11zm0 0V3.375" />
                </svg>
                Print
              </button>
              <button className="flex items-center gap-2 rounded bg-[#e8751a] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#d46815]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h1.5c.621 0 1.125.504 1.125 1.125V4.5M6.75 21h10.5" />
                </svg>
                Order Color Samples
              </button>
            </div>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
            {colorways.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedColor(c.code)}
                className={`group text-left transition-all ${
                  selectedColor === c.code ? "scale-105" : "hover:scale-[1.02]"
                }`}
              >
                <div
                  className={`aspect-[3/4] w-full rounded-sm border-2 transition-colors ${
                    selectedColor === c.code
                      ? "border-[#e8751a]"
                      : "border-transparent group-hover:border-white/30"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
                <p className={`mt-2 text-[12px] font-semibold leading-tight ${
                  selectedColor === c.code ? "text-[#e8751a]" : "text-white/80"
                }`}>
                  {c.name}
                </p>
                <p className="text-[11px] text-white/40">{c.code}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Build a Product Sample ─── */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <h2 className="mb-2 text-3xl font-bold">Build a product sample.</h2>
          <p className="mb-10 text-white/60">
            Build your product, download a PDF, and order a custom sample.
          </p>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Selectors */}
            <div className="space-y-8">
              {/* 1. Select design */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-white/80">1. Select design</label>
                <select
                  value={activeDesign}
                  onChange={(e) => setActiveDesign(e.target.value)}
                  className="w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                >
                  {designPatterns.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* 2. Select thickness */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-white/80">2. Select thickness</label>
                <select
                  value={selectedThickness}
                  onChange={(e) => setSelectedThickness(e.target.value)}
                  className="w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                >
                  <option value="12mm">12mm</option>
                </select>
              </div>

              {/* 3. Select size */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-white/80">3. Select size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                >
                  <option value='4"H x 12"W x 12"L'>4&quot;H x 12&quot;W x 12&quot;L</option>
                  <option value='6"H x 12"W x 12"L'>6&quot;H x 12&quot;W x 12&quot;L</option>
                </select>
              </div>

              {/* 4. Select face color */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-white/80">4. Select face color</label>
                <select
                  className="mb-4 w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                  defaultValue="woodgrain"
                >
                  <option value="woodgrain">WoodGrain</option>
                </select>

                {/* Mini color swatches */}
                <div className="flex flex-wrap gap-2">
                  {colorways.slice(0, 20).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setSelectedColor(c.code)}
                      className={`h-7 w-7 rounded-sm border-2 transition-colors ${
                        selectedColor === c.code ? "border-[#e8751a]" : "border-transparent hover:border-white/40"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
                {currentSelected && (
                  <p className="mt-3 text-sm text-white/60">
                    <span className="font-semibold text-white/80">{currentSelected.name}</span>{" "}
                    <span className="text-white/40">{currentSelected.code}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="rounded bg-[#222] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#333]">
                  Print
                </button>
                <button className="rounded bg-[#e8751a] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#d46815]">
                  Order Product Sample
                </button>
              </div>

              <p className="text-[12px] text-white/40">
                Note: Sample is a section of the full product.<br />
                Product samples are limited to a maximum of 5. Ships in 1–2 days.
              </p>
            </div>

            {/* Right: Sample Preview */}
            <div className="flex items-center justify-center">
              <div
                className="aspect-square w-full max-w-[400px] rounded-lg"
                style={{
                  backgroundColor: currentSelected?.hex || "#c8bfb0",
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 20px,
                      rgba(255,255,255,0.03) 20px,
                      rgba(255,255,255,0.03) 40px
                    )
                  `,
                }}
              >
                <div className="flex h-full items-end p-6">
                  <p className="text-[13px] text-white/60">
                    {currentSelected?.name} — {currentSelected?.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-white/50">
            Need color samples, too?{" "}
            <button className="text-[#e8751a] underline transition-colors hover:text-[#d46815]">
              Order them here.
            </button>
          </p>
        </div>
      </section>

      {/* ─── Resources & Specs ─── */}
      <section className="border-t border-white/10 bg-[#151515]">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2">
            {/* Resources */}
            <div>
              <h2 className="mb-8 text-3xl font-bold">Resources</h2>
              <ul className="divide-y divide-white/10">
                {resources.map((r) => (
                  <li key={r}>
                    <button className="flex w-full items-center justify-between py-4 text-left text-[15px] text-white/80 transition-colors hover:text-[#e8751a]">
                      <span>{r}</span>
                      <DownloadIcon />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specs */}
            <div>
              <h2 className="mb-8 text-3xl font-bold">Specs</h2>
              <table className="w-full">
                <tbody className="divide-y divide-white/10">
                  {specs.map((s) => (
                    <tr key={s.label}>
                      <td className="whitespace-nowrap py-3.5 pr-6 text-[14px] font-semibold text-white/60">
                        {s.label}
                      </td>
                      <td className="py-3.5 text-[14px] text-white/80 whitespace-pre-line">
                        {s.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sustainability & Custom ─── */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2">
            {/* Sustainability */}
            <div>
              <h2 className="mb-4 text-3xl font-bold">Sustainability</h2>
              <p className="leading-relaxed text-white/70">
                We help designers, architects, and owners meet their clean building goals by testing
                all of our products against internationally recognized environmental and human safety
                standards to protect our employees, our customers, and future generations. Read more
                about our sustainability work{" "}
                <Link href="/about" className="text-[#e8751a] underline transition-colors hover:text-[#d46815]">
                  here
                </Link>
                .
              </p>
            </div>

            {/* Custom */}
            <div>
              <h2 className="mb-4 text-3xl font-bold">Custom</h2>
              <p className="mb-6 leading-relaxed text-white/70">
                Our design engineers and fabricators stand ready to serve on your design team,
                marrying their deep understanding of the art and science of soundscaping to your
                vision with custom cutting, printing, shaping, and technical advice to soundscape
                your designs. Let us help you.
              </p>
              <Link
                href="/contact"
                className="inline-block rounded-sm border-2 border-white/30 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#e8751a] hover:text-[#e8751a]"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How to Specify ─── */}
      <section className="border-t border-white/10 bg-[#151515]">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <h2 className="mb-12 text-3xl font-bold">How to specify</h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {[
              {
                step: 1,
                title: "1. Choose your surfaces.",
                desc: "Soundscape your space by placing enough sound absorption where it has the greatest impact. Hint: adjoining surfaces with sound absorbing materials reduce reverberation faster.",
              },
              {
                step: 2,
                title: "2. Select a color, pattern, or cut.",
                desc: "Choose from our broad palette and pattern gallery to create your own unique design. Select a slat profile, overall tile size, and color combination.",
              },
              {
                step: 3,
                title: "3. Measure your installation space.",
                desc: "Take the dimensions and get in touch so we can help you soundscape your space efficiently. Let us know the type and size of the ceiling grid supporting your frame.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-6 flex justify-center">
                  <StepIcon step={item.step} />
                </div>
                <h3 className="mb-3 text-lg font-bold text-[#e8751a]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Related Products ─── */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <h2 className="mb-10 text-3xl font-bold">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Rafter", type: "Frames", surface: "Ceiling", gradient: "from-[#4a3e30] to-[#6e5840]" },
              { name: "Fillet", type: "Frames", surface: "Ceiling", gradient: "from-[#5a5044] to-[#8a7e6e]" },
              { name: "Trout", type: "Gills", surface: "Ceiling", gradient: "from-[#3a3028] to-[#5e5448]" },
              { name: "Box", type: "Vista", surface: "Ceiling", gradient: "from-[#6a5e50] to-[#9e9080]" },
            ].map((product) => (
              <Link
                key={product.name}
                href={`/products/${product.name.toLowerCase()}`}
                className="group"
              >
                <div className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${product.gradient} transition-transform group-hover:scale-[1.02]`}>
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-16 w-16 text-white/20" viewBox="0 0 48 48" fill="none">
                      <rect x="4" y="4" width="18" height="18" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="26" y="4" width="18" height="18" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="4" y="26" width="18" height="18" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="26" y="26" width="18" height="18" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-[13px] text-white/50">{product.type}</p>
                  <p className="font-semibold text-white group-hover:text-[#e8751a]">{product.name}</p>
                  <p className="text-[13px] text-white/50">{product.surface}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
