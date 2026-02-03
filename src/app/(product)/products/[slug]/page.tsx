"use client";

import { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   DATA — per-design content that changes when you switch tabs
   ═══════════════════════════════════════════════════════════════════ */

interface DesignData {
  id: string;
  label: string;
  title: string;
  description: string;
  heroGradients: { bg: string; caption: string }[];
}

const designs: DesignData[] = [
  {
    id: "buffalo",
    label: "Buffalo",
    title: "Woven, Buffalo",
    description:
      "Woven\u2019s Buffalo design is defined by its bold, evenly spaced grid, creating a striking yet balanced aesthetic. This pattern brings a sense of structure and warmth to any setting. Carefully engineered, it provides an ideal blend of openness and acoustic performance, making it well-suited for high-traffic areas. Easily integrated with ceiling elements such as sprinklers, speakers, and lighting, the Buffalo design enhances both functionality and visual appeal.",
    heroGradients: [
      { bg: "from-[#3a3028] via-[#5a4e40] to-[#8a7e6e]", caption: "Woven, Buffalo Ceiling Frames | French Bobbin | WoodGrain Collection" },
      { bg: "from-[#5a5044] via-[#7a6e60] to-[#a09080]", caption: "Woven, Buffalo Ceiling Frames | Nordic Plank | WoodGrain Collection" },
    ],
  },
  {
    id: "gingham",
    label: "Gingham",
    title: "Woven, Gingham",
    description:
      "Woven\u2019s Gingham design features a classic alternating checked pattern that radiates warmth and familiarity. With balanced proportions and refined detail, Gingham brings a sense of comfort to any ceiling installation while maintaining exceptional acoustic control in open-plan environments.",
    heroGradients: [
      { bg: "from-[#5a5044] via-[#7a6e60] to-[#a09080]", caption: "Woven, Gingham Ceiling Frames | Loft | WoodGrain Collection" },
      { bg: "from-[#8a7e6e] via-[#a09080] to-[#c8bfb0]", caption: "Woven, Gingham Ceiling Frames | White Elm | WoodGrain Collection" },
    ],
  },
  {
    id: "pincheck",
    label: "Pincheck",
    title: "Woven, Pincheck",
    description:
      "Woven\u2019s Pincheck design offers a refined, small-scale texture that appears solid from a distance while revealing intricate detail up close. This understated pattern is perfect for environments where subtle elegance and acoustic performance are equally important.",
    heroGradients: [
      { bg: "from-[#6e5438] via-[#8a7050] to-[#b8a888]", caption: "Woven, Pincheck Ceiling Frames | European Larch | WoodGrain Collection" },
      { bg: "from-[#504030] via-[#6e5438] to-[#8a7050]", caption: "Woven, Pincheck Ceiling Frames | Teak | WoodGrain Collection" },
    ],
  },
  {
    id: "tartan",
    label: "Tartan",
    title: "Woven, Tartan",
    description:
      "Woven\u2019s Tartan design brings a bold, intersecting pattern of wide and narrow bands that commands attention. Inspired by traditional textile craft, this design transforms ceiling planes into dynamic architectural features while delivering outstanding sound absorption.",
    heroGradients: [
      { bg: "from-[#4a3e30] via-[#6e5840] to-[#9e9080]", caption: "Woven, Tartan Ceiling Frames | Log Cabin | WoodGrain Collection" },
      { bg: "from-[#3e3428] via-[#5a4e40] to-[#7a6e60]", caption: "Woven, Tartan Ceiling Frames | Black Walnut | WoodGrain Collection" },
    ],
  },
  {
    id: "tattersall",
    label: "Tattersall",
    title: "Woven, Tattersall",
    description:
      "Woven\u2019s Tattersall design features a subtle grid of evenly spaced lines creating a clean, structured pattern. This refined design offers an understated elegance ideal for professional settings where acoustic performance meets sophisticated aesthetic.",
    heroGradients: [
      { bg: "from-[#5e5448] via-[#7a7468] to-[#9e9080]", caption: "Woven, Tattersall Ceiling Frames | Driftwood | WoodGrain Collection" },
      { bg: "from-[#686058] via-[#8e8878] to-[#b5a88e]", caption: "Woven, Tattersall Ceiling Frames | Weathered Slate | WoodGrain Collection" },
    ],
  },
  {
    id: "windowpane",
    label: "Windowpane",
    title: "Woven, Windowpane",
    description:
      "Woven\u2019s Windowpane design creates a clean, wide-set grid that defines space with architectural clarity. The generous proportions between lines give this pattern an open, airy quality while the woven felt delivers exceptional noise reduction.",
    heroGradients: [
      { bg: "from-[#6a5e50] via-[#8a7e6e] to-[#b8a888]", caption: "Woven, Windowpane Ceiling Frames | Natural Oak | WoodGrain Collection" },
      { bg: "from-[#7e7264] via-[#9e9080] to-[#ccc3b0]", caption: "Woven, Windowpane Ceiling Frames | Boardwalk | WoodGrain Collection" },
    ],
  },
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
  { label: "Lead Time", value: "3\u20136 weeks" },
  { label: "Origin", value: "Manufactured and assembled in Australia" },
];

const downloadResources = [
  "Specification Sheet",
  "Colorways",
  "Installation Guide",
  "Care Guide",
  "Warranty",
  "Material Safety",
  "LEED Contributions",
];

/* ═══════════════════════════════════════════════════════════════════
   ISOMETRIC 3D PATTERN ICONS — matching Acoufelt style
   ═══════════════════════════════════════════════════════════════════ */

function IsometricIcon({ design, active }: { design: string; active: boolean }) {
  const s = active ? "#1a1a1a" : "#888";
  const w = active ? "1.2" : "0.8";

  // All icons at 100x80 with isometric 3D ceiling-frame perspective
  switch (design) {
    case "buffalo":
      return (
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
          {/* Base plane (isometric) */}
          <path d="M50 10 L90 30 L50 50 L10 30 Z" stroke={s} strokeWidth={w} fill="none" />
          {/* Vertical risers */}
          <line x1="50" y1="10" x2="50" y2="2" stroke={s} strokeWidth={w} />
          <line x1="90" y1="30" x2="90" y2="22" stroke={s} strokeWidth={w} />
          <line x1="10" y1="30" x2="10" y2="22" stroke={s} strokeWidth={w} />
          <line x1="50" y1="50" x2="50" y2="42" stroke={s} strokeWidth={w} />
          {/* Top plane */}
          <path d="M50 2 L90 22 L50 42 L10 22 Z" stroke={s} strokeWidth={w} fill="none" />
          {/* Grid lines horizontal */}
          <line x1="30" y1="12" x2="70" y2="32" stroke={s} strokeWidth={w} />
          <line x1="70" y1="12" x2="30" y2="32" stroke={s} strokeWidth={w} />
          {/* Inner grid */}
          <path d="M50 2 L50 42" stroke={s} strokeWidth="0.6" />
          <path d="M10 22 L90 22" stroke={s} strokeWidth="0.6" />
          {/* Cross members */}
          <line x1="30" y1="6" x2="30" y2="26" stroke={s} strokeWidth="0.6" />
          <line x1="70" y1="6" x2="70" y2="26" stroke={s} strokeWidth="0.6" />
          <line x1="30" y1="18" x2="70" y2="18" stroke={s} strokeWidth="0.6" />
          <line x1="30" y1="26" x2="70" y2="26" stroke={s} strokeWidth="0.6" />
          {/* Bottom risers */}
          <line x1="30" y1="26" x2="30" y2="36" stroke={s} strokeWidth="0.6" />
          <line x1="70" y1="26" x2="70" y2="36" stroke={s} strokeWidth="0.6" />
        </svg>
      );

    case "gingham":
      return (
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
          <path d="M50 10 L90 30 L50 50 L10 30 Z" stroke={s} strokeWidth={w} fill="none" />
          <line x1="50" y1="10" x2="50" y2="2" stroke={s} strokeWidth={w} />
          <line x1="90" y1="30" x2="90" y2="22" stroke={s} strokeWidth={w} />
          <line x1="10" y1="30" x2="10" y2="22" stroke={s} strokeWidth={w} />
          <line x1="50" y1="50" x2="50" y2="42" stroke={s} strokeWidth={w} />
          <path d="M50 2 L90 22 L50 42 L10 22 Z" stroke={s} strokeWidth={w} fill="none" />
          {/* Gingham: alternating filled/empty cells */}
          <path d="M30 6 L50 16 L30 26 L10 16 Z" stroke={s} strokeWidth="0.5" fill={active ? "#1a1a1a" : "#aaa"} fillOpacity="0.1" />
          <path d="M70 6 L90 16 L70 26 L50 16 Z" stroke={s} strokeWidth="0.5" fill={active ? "#1a1a1a" : "#aaa"} fillOpacity="0.1" />
          <path d="M30 18 L50 28 L30 38 L10 28 Z" stroke={s} strokeWidth="0.5" fill={active ? "#1a1a1a" : "#aaa"} fillOpacity="0.1" />
          <path d="M70 18 L90 28 L70 38 L50 28 Z" stroke={s} strokeWidth="0.5" fill={active ? "#1a1a1a" : "#aaa"} fillOpacity="0.1" />
          {/* Grid */}
          <path d="M50 2 L50 42" stroke={s} strokeWidth="0.6" />
          <path d="M10 22 L90 22" stroke={s} strokeWidth="0.6" />
        </svg>
      );

    case "pincheck":
      return (
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
          <path d="M50 10 L90 30 L50 50 L10 30 Z" stroke={s} strokeWidth={w} fill="none" />
          <line x1="50" y1="10" x2="50" y2="2" stroke={s} strokeWidth={w} />
          <line x1="90" y1="30" x2="90" y2="22" stroke={s} strokeWidth={w} />
          <line x1="10" y1="30" x2="10" y2="22" stroke={s} strokeWidth={w} />
          <line x1="50" y1="50" x2="50" y2="42" stroke={s} strokeWidth={w} />
          <path d="M50 2 L90 22 L50 42 L10 22 Z" stroke={s} strokeWidth={w} fill="none" />
          {/* Pincheck: dense small grid pattern */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`h${i}`} x1={18 + i * 16} y1={7 + i * 3} x2={18 + i * 16} y2={27 + i * 3} stroke={s} strokeWidth="0.4" />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line key={`v${i}`} x1="14" y1={10 + i * 8} x2="86" y2={18 + i * 8} stroke={s} strokeWidth="0.4" />
          ))}
        </svg>
      );

    case "tartan":
      return (
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
          <path d="M50 10 L90 30 L50 50 L10 30 Z" stroke={s} strokeWidth={w} fill="none" />
          <line x1="50" y1="10" x2="50" y2="2" stroke={s} strokeWidth={w} />
          <line x1="90" y1="30" x2="90" y2="22" stroke={s} strokeWidth={w} />
          <line x1="10" y1="30" x2="10" y2="22" stroke={s} strokeWidth={w} />
          <line x1="50" y1="50" x2="50" y2="42" stroke={s} strokeWidth={w} />
          <path d="M50 2 L90 22 L50 42 L10 22 Z" stroke={s} strokeWidth={w} fill="none" />
          {/* Tartan: thick + thin crossing lines */}
          <line x1="30" y1="6" x2="30" y2="26" stroke={s} strokeWidth="1.5" />
          <line x1="70" y1="6" x2="70" y2="26" stroke={s} strokeWidth="1.5" />
          <line x1="50" y1="2" x2="50" y2="42" stroke={s} strokeWidth="0.4" />
          <line x1="10" y1="22" x2="90" y2="22" stroke={s} strokeWidth="1.5" />
          <line x1="14" y1="14" x2="86" y2="14" stroke={s} strokeWidth="0.4" />
          <line x1="14" y1="30" x2="86" y2="30" stroke={s} strokeWidth="0.4" />
        </svg>
      );

    case "tattersall":
      return (
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
          <path d="M50 10 L90 30 L50 50 L10 30 Z" stroke={s} strokeWidth={w} fill="none" />
          <line x1="50" y1="10" x2="50" y2="2" stroke={s} strokeWidth={w} />
          <line x1="90" y1="30" x2="90" y2="22" stroke={s} strokeWidth={w} />
          <line x1="10" y1="30" x2="10" y2="22" stroke={s} strokeWidth={w} />
          <line x1="50" y1="50" x2="50" y2="42" stroke={s} strokeWidth={w} />
          <path d="M50 2 L90 22 L50 42 L10 22 Z" stroke={s} strokeWidth={w} fill="none" />
          {/* Tattersall: evenly spaced thin lines */}
          <line x1="30" y1="6" x2="30" y2="36" stroke={s} strokeWidth="0.6" />
          <line x1="50" y1="2" x2="50" y2="42" stroke={s} strokeWidth="0.6" />
          <line x1="70" y1="6" x2="70" y2="36" stroke={s} strokeWidth="0.6" />
          <line x1="14" y1="14" x2="86" y2="14" stroke={s} strokeWidth="0.6" />
          <line x1="10" y1="22" x2="90" y2="22" stroke={s} strokeWidth="0.6" />
          <line x1="14" y1="30" x2="86" y2="30" stroke={s} strokeWidth="0.6" />
        </svg>
      );

    case "windowpane":
      return (
        <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
          <path d="M50 10 L90 30 L50 50 L10 30 Z" stroke={s} strokeWidth={w} fill="none" />
          <line x1="50" y1="10" x2="50" y2="2" stroke={s} strokeWidth={w} />
          <line x1="90" y1="30" x2="90" y2="22" stroke={s} strokeWidth={w} />
          <line x1="10" y1="30" x2="10" y2="22" stroke={s} strokeWidth={w} />
          <line x1="50" y1="50" x2="50" y2="42" stroke={s} strokeWidth={w} />
          <path d="M50 2 L90 22 L50 42 L10 22 Z" stroke={s} strokeWidth={w} fill="none" />
          {/* Windowpane: single wide-set cross */}
          <line x1="50" y1="2" x2="50" y2="42" stroke={s} strokeWidth="1" />
          <line x1="10" y1="22" x2="90" y2="22" stroke={s} strokeWidth="1" />
        </svg>
      );

    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   RESOURCE LINK ICONS — matching Acoufelt exactly
   ═══════════════════════════════════════════════════════════════════ */

function ResourceIcon({ type }: { type: string }) {
  const c = "#555";
  switch (type) {
    case "resources":
      return (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="2" width="16" height="20" rx="1" stroke={c} strokeWidth="1.2" />
          <line x1="8" y1="7" x2="16" y2="7" stroke={c} strokeWidth="1" />
          <line x1="8" y1="11" x2="16" y2="11" stroke={c} strokeWidth="1" />
          <line x1="8" y1="15" x2="13" y2="15" stroke={c} strokeWidth="1" />
        </svg>
      );
    case "design-symbols":
      return (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M3 20 L12 4 L21 20 Z" stroke={c} strokeWidth="1.2" fill="none" />
          <line x1="12" y1="12" x2="12" y2="16" stroke={c} strokeWidth="1" />
          <circle cx="12" cy="10" r="0.5" fill={c} />
        </svg>
      );
    case "color-samples":
      return (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M12 4 A8 8 0 0 1 20 12" stroke={c} strokeWidth="1.2" />
          <path d="M12 4 A8 8 0 0 0 4 12" stroke={c} strokeWidth="1.2" />
          <path d="M4 12 A8 8 0 0 0 12 20" stroke={c} strokeWidth="1.2" />
          <path d="M20 12 A8 8 0 0 1 12 20" stroke={c} strokeWidth="1.2" />
          <line x1="12" y1="4" x2="12" y2="20" stroke={c} strokeWidth="0.8" />
          <line x1="4" y1="12" x2="20" y2="12" stroke={c} strokeWidth="0.8" />
        </svg>
      );
    case "product-samples":
      return (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="14" rx="1" stroke={c} strokeWidth="1.2" />
          <path d="M3 10 L21 10" stroke={c} strokeWidth="1" />
          <rect x="6" y="13" width="4" height="4" rx="0.5" stroke={c} strokeWidth="0.8" />
        </svg>
      );
    case "request-quote":
      return (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M3 5 A9 9 0 0 1 21 5" stroke={c} strokeWidth="1.2" fill="none" />
          <line x1="3" y1="5" x2="3" y2="12" stroke={c} strokeWidth="1.2" />
          <line x1="21" y1="5" x2="21" y2="12" stroke={c} strokeWidth="1.2" />
          <circle cx="12" cy="14" r="3" stroke={c} strokeWidth="1" />
          <line x1="12" y1="12" x2="12" y2="14" stroke={c} strokeWidth="0.8" />
          <line x1="12" y1="14" x2="13.5" y2="15" stroke={c} strokeWidth="0.8" />
        </svg>
      );
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MISC ICONS
   ═══════════════════════════════════════════════════════════════════ */

function DownloadIcon() {
  return (
    <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

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

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function ProductDetail() {
  const [activeDesignId, setActiveDesignId] = useState("buffalo");
  const [selectedColor, setSelectedColor] = useState("WQ01");
  const [selectedThickness, setSelectedThickness] = useState("12mm");
  const [selectedSize, setSelectedSize] = useState('4"H x 12"W x 12"L');
  const [heroIdx, setHeroIdx] = useState(0);

  const activeDesign = designs.find((d) => d.id === activeDesignId) || designs[0];
  const currentColor = colorways.find((c) => c.code === selectedColor);
  const heroImages = activeDesign.heroGradients;

  // Reset hero index when switching designs
  const switchDesign = (id: string) => {
    setActiveDesignId(id);
    setHeroIdx(0);
  };

  return (
    <div className="bg-[#1a1a1a] text-white">

      {/* ──────────────────────────────────────────────────────────
          DESIGN PATTERN TABS — light bg, isometric icons
          ────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#ddd] bg-[#f0efed]">
        <div className="mx-auto flex max-w-[1400px] items-end gap-4 overflow-x-auto px-6 py-6 lg:gap-8 lg:px-10">
          {designs.map((d) => {
            const isActive = d.id === activeDesignId;
            return (
              <button
                key={d.id}
                onClick={() => switchDesign(d.id)}
                className={`group flex shrink-0 flex-col items-center gap-3 transition-opacity ${
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <IsometricIcon design={d.id} active={isActive} />
                <span
                  className={`text-[11px] uppercase tracking-[0.15em] ${
                    isActive
                      ? "font-bold text-[#1a1a1a]"
                      : "font-medium text-[#666]"
                  }`}
                >
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          BREADCRUMB
          ────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 pt-8 lg:px-10">
        <nav className="flex items-center gap-2 text-[13px] text-white/40">
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">Ceiling</Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">Frames</Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">Woven</Link>
          <span>/</span>
          <span className="font-medium text-[#e8751a]">{activeDesign.label}</span>
        </nav>
        <p className="mt-1 text-[13px] text-white/40">
          Available in: <span className="text-white/60">Premier,</span>{" "}
          <span className="font-semibold text-[#e8751a]">WoodGrain</span>
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────
          HERO — title, description, resource links + image
          ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {activeDesign.title}
            </h1>
            <p className="mt-6 leading-relaxed text-white/70">
              {activeDesign.description}
            </p>

            {/* ── Resource Links (Acoufelt 2-col with separators) ── */}
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-x-8">
                {/* Row 1 */}
                <button className="flex items-center gap-3 border-b border-white/10 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="resources" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Resources</span>
                </button>
                <button className="flex items-center gap-3 border-b border-white/10 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="design-symbols" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Design Symbols</span>
                </button>
                {/* Row 2 */}
                <button className="flex items-center gap-3 border-b border-white/10 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="color-samples" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Color Samples</span>
                </button>
                <button className="flex items-center gap-3 border-b border-white/10 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="product-samples" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Product Samples</span>
                </button>
                {/* Row 3 */}
                <button className="flex items-center gap-3 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="request-quote" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Request a Quote</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Hero Carousel */}
          <div className="relative overflow-hidden rounded-lg">
            <div className={`flex aspect-[4/3] items-end bg-gradient-to-br ${heroImages[heroIdx]?.bg} p-6`}>
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <rect width="60" height="60" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#heroGrid)" />
                </svg>
              </div>
              <p className="relative z-10 text-[13px] text-white/70">
                {heroImages[heroIdx]?.caption}
              </p>
            </div>
            <button
              onClick={() => setHeroIdx((p) => (p === 0 ? heroImages.length - 1 : p - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/80 hover:bg-black/70"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setHeroIdx((p) => (p === heroImages.length - 1 ? 0 : p + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white/80 hover:bg-black/70"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          COLORWAYS
          ────────────────────────────────────────────────────────── */}
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

      {/* ──────────────────────────────────────────────────────────
          BUILD A PRODUCT SAMPLE
          ────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <h2 className="mb-2 text-3xl font-bold">Build a product sample.</h2>
          <p className="mb-10 text-white/60">
            Build your product, download a PDF, and order a custom sample.
          </p>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-white/80">1. Select design</label>
                <select
                  value={activeDesignId}
                  onChange={(e) => switchDesign(e.target.value)}
                  className="w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                >
                  {designs.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

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

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-white/80">4. Select face color</label>
                <select
                  className="mb-4 w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                  defaultValue="woodgrain"
                >
                  <option value="woodgrain">WoodGrain</option>
                </select>

                <div className="flex flex-wrap gap-2">
                  {colorways.map((c) => (
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
                {currentColor && (
                  <p className="mt-3 text-sm text-white/60">
                    <span className="font-semibold text-white/80">{currentColor.name}</span>{" "}
                    <span className="text-white/40">{currentColor.code}</span>
                  </p>
                )}
              </div>

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

            <div className="flex items-center justify-center">
              <div
                className="aspect-square w-full max-w-[400px] rounded-lg"
                style={{
                  backgroundColor: currentColor?.hex || "#c8bfb0",
                  backgroundImage:
                    "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,0.03) 20px,rgba(255,255,255,0.03) 40px)",
                }}
              >
                <div className="flex h-full items-end p-6">
                  <p className="text-[13px] text-white/60">
                    {currentColor?.name} — {currentColor?.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-white/50">
            Need color samples, too?{" "}
            <button className="text-[#e8751a] underline hover:text-[#d46815]">
              Order them here.
            </button>
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          RESOURCES & SPECS
          ────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#151515]">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <h2 className="mb-8 text-3xl font-bold">Resources</h2>
              <ul className="divide-y divide-white/10">
                {downloadResources.map((r) => (
                  <li key={r}>
                    <button className="flex w-full items-center justify-between py-4 text-left text-[15px] text-white/80 transition-colors hover:text-[#e8751a]">
                      <span>{r}</span>
                      <DownloadIcon />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-8 text-3xl font-bold">Specs</h2>
              <table className="w-full">
                <tbody className="divide-y divide-white/10">
                  {specs.map((s) => (
                    <tr key={s.label}>
                      <td className="whitespace-nowrap py-3.5 pr-6 text-[14px] font-semibold text-white/60">
                        {s.label}
                      </td>
                      <td className="whitespace-pre-line py-3.5 text-[14px] text-white/80">
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

      {/* ──────────────────────────────────────────────────────────
          SUSTAINABILITY & CUSTOM
          ────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Sustainability</h2>
              <p className="leading-relaxed text-white/70">
                We help designers, architects, and owners meet their clean building goals by testing
                all of our products against internationally recognized environmental and human safety
                standards to protect our employees, our customers, and future generations. Read more
                about our sustainability work{" "}
                <Link href="/about" className="text-[#e8751a] underline hover:text-[#d46815]">
                  here
                </Link>
                .
              </p>
            </div>
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

      {/* ──────────────────────────────────────────────────────────
          HOW TO SPECIFY
          ────────────────────────────────────────────────────────── */}
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

      {/* ──────────────────────────────────────────────────────────
          RELATED PRODUCTS
          ────────────────────────────────────────────────────────── */}
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
