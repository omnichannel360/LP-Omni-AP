"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import { addSampleToCart } from "@/lib/sample-cart";
import { jsPDF } from "jspdf";

/* ═══════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════ */

interface Colorway {
  name: string;
  code: string;
  hex: string;
}

interface Spec {
  label: string;
  value: string;
}

interface HowToStep {
  step: number;
  title: string;
  description: string;
}

interface Design {
  id: string;
  design_key: string;
  label: string;
  title: string;
  description: string;
  hero_images: { url: string; caption: string }[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  surface: string;
  description: string;
  gradient: string;
  breadcrumb_category: string;
  breadcrumb_type: string;
  breadcrumb_series: string;
  breadcrumb_availability: string;
  colorways: Colorway[];
  specs: Spec[];
  resources: string[];
  build_thicknesses: string[];
  build_sizes: string[];
  build_face_colors: string[];
  sustainability_content: string;
  custom_content: string;
  custom_button_text: string;
  custom_button_link: string;
  how_to_specify: HowToStep[];
}

/* ═══════════════════════════════════════════════════════════════════
   ISOMETRIC 3D PATTERN ICONS
   ═══════════════════════════════════════════════════════════════════ */

function DesignThumbnail({ design, active }: { design: string; active: boolean }) {
  const s = active ? "#e8751a" : "#e8751a80";
  const bg = active ? "#2a2520" : "#222";
  const w = active ? "1.4" : "1";

  const baseBox = (
    <>
      <path d="M50 14 L82 30 L50 46 L18 30 Z" stroke={s} strokeWidth={w} fill="none" />
      <line x1="50" y1="14" x2="50" y2="6" stroke={s} strokeWidth={w} />
      <line x1="82" y1="30" x2="82" y2="22" stroke={s} strokeWidth={w} />
      <line x1="18" y1="30" x2="18" y2="22" stroke={s} strokeWidth={w} />
      <line x1="50" y1="46" x2="50" y2="38" stroke={s} strokeWidth={w} />
      <path d="M50 6 L82 22 L50 38 L18 22 Z" stroke={s} strokeWidth={w} fill="none" />
    </>
  );

  const renderPattern = () => {
    switch (design) {
      case "buffalo":
        return (
          <>
            {baseBox}
            <path d="M50 6 L50 38" stroke={s} strokeWidth="0.6" />
            <path d="M18 22 L82 22" stroke={s} strokeWidth="0.6" />
            <line x1="34" y1="14" x2="34" y2="30" stroke={s} strokeWidth="0.5" />
            <line x1="66" y1="14" x2="66" y2="30" stroke={s} strokeWidth="0.5" />
          </>
        );
      case "gingham":
        return (
          <>
            {baseBox}
            <path d="M34 10 L50 18 L34 26 L18 18 Z" stroke={s} strokeWidth="0.5" fill={s} fillOpacity="0.15" />
            <path d="M66 18 L82 26 L66 34 L50 26 Z" stroke={s} strokeWidth="0.5" fill={s} fillOpacity="0.15" />
            <path d="M50 6 L50 38" stroke={s} strokeWidth="0.5" />
            <path d="M18 22 L82 22" stroke={s} strokeWidth="0.5" />
          </>
        );
      case "pincheck":
        return (
          <>
            {baseBox}
            {[26, 34, 42, 50, 58, 66, 74].map((x) => (
              <line key={x} x1={x} y1="8" x2={x} y2="36" stroke={s} strokeWidth="0.3" />
            ))}
            {[10, 14, 18, 22, 26, 30, 34].map((y) => (
              <line key={y} x1="20" y1={y} x2="80" y2={y} stroke={s} strokeWidth="0.3" />
            ))}
          </>
        );
      case "tartan":
        return (
          <>
            {baseBox}
            <line x1="34" y1="10" x2="34" y2="30" stroke={s} strokeWidth="1.8" />
            <line x1="66" y1="10" x2="66" y2="30" stroke={s} strokeWidth="1.8" />
            <line x1="20" y1="22" x2="80" y2="22" stroke={s} strokeWidth="1.8" />
            <line x1="50" y1="6" x2="50" y2="38" stroke={s} strokeWidth="0.4" />
            <line x1="20" y1="15" x2="80" y2="15" stroke={s} strokeWidth="0.4" />
            <line x1="20" y1="29" x2="80" y2="29" stroke={s} strokeWidth="0.4" />
          </>
        );
      case "tattersall":
        return (
          <>
            {baseBox}
            <line x1="34" y1="10" x2="34" y2="34" stroke={s} strokeWidth="0.6" />
            <line x1="50" y1="6" x2="50" y2="38" stroke={s} strokeWidth="0.6" />
            <line x1="66" y1="10" x2="66" y2="34" stroke={s} strokeWidth="0.6" />
            <line x1="22" y1="15" x2="78" y2="15" stroke={s} strokeWidth="0.6" />
            <line x1="18" y1="22" x2="82" y2="22" stroke={s} strokeWidth="0.6" />
            <line x1="22" y1="29" x2="78" y2="29" stroke={s} strokeWidth="0.6" />
          </>
        );
      case "windowpane":
        return (
          <>
            {baseBox}
            <line x1="50" y1="6" x2="50" y2="38" stroke={s} strokeWidth="1" />
            <line x1="18" y1="22" x2="82" y2="22" stroke={s} strokeWidth="1" />
          </>
        );
      default:
        // Generic pattern for unknown designs
        return (
          <>
            {baseBox}
            <line x1="50" y1="6" x2="50" y2="38" stroke={s} strokeWidth="0.6" />
            <line x1="18" y1="22" x2="82" y2="22" stroke={s} strokeWidth="0.6" />
          </>
        );
    }
  };

  return (
    <div
      className={`flex h-[72px] w-[100px] items-center justify-center rounded-md border transition-colors ${
        active
          ? "border-[#e8751a]/60 bg-[#2a2520]"
          : "border-white/10 bg-[#222] hover:border-white/20"
      }`}
      style={{ backgroundColor: bg }}
    >
      <svg width="100" height="52" viewBox="0 0 100 52" fill="none">
        {renderPattern()}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ICONS
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
   DEFAULT GRADIENT for hero when no image URL exists
   ═══════════════════════════════════════════════════════════════════ */

const defaultGradients: Record<string, string> = {
  buffalo: "from-[#3a3028] via-[#5a4e40] to-[#8a7e6e]",
  gingham: "from-[#5a5044] via-[#7a6e60] to-[#a09080]",
  pincheck: "from-[#6e5438] via-[#8a7050] to-[#b8a888]",
  tartan: "from-[#4a3e30] via-[#6e5840] to-[#9e9080]",
  tattersall: "from-[#5e5448] via-[#7a7468] to-[#9e9080]",
  windowpane: "from-[#6a5e50] via-[#8a7e6e] to-[#b8a888]",
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

interface Variant {
  id: string;
  thickness: string;
  size: string;
  face_color: string;
  colorway_code: string | null;
  price_cents: number;
}

export default function ProductDetail({
  product,
  designs,
  isMember = false,
}: {
  product: Product;
  designs: Design[];
  isMember?: boolean;
}) {
  const colorways: Colorway[] = product.colorways || [];
  const specs: Spec[] = product.specs || [];
  const resources: string[] = product.resources || [];
  const buildThicknesses: string[] = product.build_thicknesses || ["12mm"];
  const buildSizes: string[] = product.build_sizes || [];
  const buildFaceColors: string[] = product.build_face_colors || [];
  const howToSteps: HowToStep[] = product.how_to_specify || [];

  const [activeDesignId, setActiveDesignId] = useState(
    designs[0]?.design_key || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    colorways[0]?.code || ""
  );
  const [selectedThickness, setSelectedThickness] = useState(
    buildThicknesses[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState(buildSizes[0] || "");
  const [heroIdx, setHeroIdx] = useState(0);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Sample selection mode
  const [sampleMode, setSampleMode] = useState(false);
  const [selectedSamples, setSelectedSamples] = useState<Set<string>>(new Set());
  const [sampleAdded, setSampleAdded] = useState(false);
  const colorwaysSectionRef = useRef<HTMLDivElement>(null);

  // Fetch variants for members
  useEffect(() => {
    if (!isMember) return;
    fetch(`/api/products/${product.id}/variants`)
      .then((r) => r.json())
      .then((data) => {
        const list: Variant[] = Array.isArray(data) ? data : [];
        setVariants(list);
      })
      .catch(() => {});
  }, [product.id, isMember]);

  // Find matching variant when build options change
  const findVariant = useCallback(() => {
    if (variants.length === 0) return;
    const match = variants.find(
      (v) =>
        v.thickness === selectedThickness &&
        v.size === selectedSize
    );
    setSelectedVariant(match || null);
  }, [variants, selectedThickness, selectedSize]);

  useEffect(() => {
    findVariant();
  }, [findVariant]);

  function handleAddToCart() {
    if (!selectedVariant) return;
    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantDescription: `${selectedVariant.thickness} / ${selectedVariant.size} / ${selectedVariant.face_color}`,
      thickness: selectedVariant.thickness,
      size: selectedVariant.size,
      faceColor: selectedVariant.face_color,
      priceCents: selectedVariant.price_cents,
      quantity,
    });
    window.dispatchEvent(new Event("cart-updated"));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  // Exit sample mode when clicking outside colorways section
  useEffect(() => {
    if (!sampleMode) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        colorwaysSectionRef.current &&
        !colorwaysSectionRef.current.contains(e.target as Node)
      ) {
        setSampleMode(false);
        setSelectedSamples(new Set());
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sampleMode]);

  function toggleSampleColor(code: string) {
    setSelectedSamples((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function handleAddSamplesToCart() {
    if (selectedSamples.size === 0) return;
    const selected = colorways.filter((c) => selectedSamples.has(c.code));
    addSampleToCart({
      productId: product.id,
      productName: product.name,
      colorways: selected.map((c) => ({
        code: c.code,
        name: c.name,
        hex: c.hex,
      })),
    });
    window.dispatchEvent(new Event("sample-cart-updated"));
    setSampleAdded(true);
    setTimeout(() => {
      setSampleAdded(false);
      setSampleMode(false);
      setSelectedSamples(new Set());
    }, 1500);
  }

  function handlePrintColorways() {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = 297;
    const pageH = 210;
    const margin = 15;
    const usableW = pageW - margin * 2;

    // Header background
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, pageW, 38, "F");

    // Brand name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(232, 117, 26);
    doc.text("AP Acoustic", margin, 18);

    // Tagline
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text("Acoustic Panels Australia", margin, 26);

    // Product name
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`${product.name} — Colorways`, margin, 34);

    // Orange accent line
    doc.setDrawColor(232, 117, 26);
    doc.setLineWidth(0.8);
    doc.line(margin, 39, pageW - margin, 39);

    // Colorway grid
    const cols = 8;
    const swatchW = (usableW - (cols - 1) * 4) / cols;
    const swatchH = swatchW * 1.3;
    const startY = 46;
    let x = margin;
    let y = startY;

    colorways.forEach((c, i) => {
      if (i > 0 && i % cols === 0) {
        x = margin;
        y += swatchH + 14;
      }
      // Check if we need a new page
      if (y + swatchH + 14 > pageH - 20) {
        doc.addPage();
        doc.setFillColor(26, 26, 26);
        doc.rect(0, 0, pageW, 12, "F");
        doc.setFontSize(8);
        doc.setTextColor(200, 200, 200);
        doc.text(`${product.name} — Colorways (continued)`, margin, 8);
        y = 18;
        x = margin;
      }

      // Draw swatch
      const hex = c.hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      doc.setFillColor(r, g, b);
      doc.roundedRect(x, y, swatchW, swatchH, 1, 1, "F");

      // Border
      doc.setDrawColor(80, 80, 80);
      doc.setLineWidth(0.2);
      doc.roundedRect(x, y, swatchW, swatchH, 1, 1, "S");

      // Color name
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      doc.text(c.name, x + swatchW / 2, y + swatchH + 4, { align: "center" });

      // Color code
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(c.code, x + swatchW / 2, y + swatchH + 8, { align: "center" });

      x += swatchW + 4;
    });

    // Footer
    const lastPage = doc.getNumberOfPages();
    for (let p = 1; p <= lastPage; p++) {
      doc.setPage(p);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `AP Acoustic — ${product.name} Colorways | www.apacoustic.com.au`,
        pageW / 2,
        pageH - 8,
        { align: "center" }
      );
      doc.text(`Page ${p} of ${lastPage}`, pageW - margin, pageH - 8, {
        align: "right",
      });
    }

    doc.save(`${product.name.replace(/\s+/g, "-")}-Colorways.pdf`);
  }

  // Compute starting price from variants
  const startingPrice =
    variants.length > 0
      ? Math.min(...variants.map((v) => v.price_cents))
      : null;

  const activeDesign = designs.find((d) => d.design_key === activeDesignId) || designs[0];
  const currentColor = colorways.find((c) => c.code === selectedColor);
  const heroImages = activeDesign?.hero_images || [];
  const heroGradient =
    defaultGradients[activeDesign?.design_key] ||
    product.gradient ||
    "from-[#3a3028] to-[#5a4e40]";

  const switchDesign = (key: string) => {
    setActiveDesignId(key);
    setHeroIdx(0);
  };

  // If no designs, show a simpler page
  if (designs.length === 0) {
    return (
      <div className="w-full bg-[#1a1a1a] text-white">
        <section className="mx-auto max-w-[1400px] px-8 sm:px-10 py-14 lg:px-16">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="mt-4 text-white/70">{product.description}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1a1a1a] text-white">

      {/* ── DESIGN PATTERN TABS ── */}
      <section className="border-b border-white/10 bg-[#1a1a1a] pt-6">
        <div className="mx-auto flex max-w-[1400px] items-end gap-6 overflow-x-auto px-8 sm:px-10 pb-6 pt-4 lg:gap-10 lg:px-16">
          {designs.map((d) => {
            const isActive = d.design_key === activeDesignId;
            return (
              <button
                key={d.design_key}
                onClick={() => switchDesign(d.design_key)}
                className="group flex shrink-0 flex-col items-center gap-3"
              >
                <DesignThumbnail design={d.design_key} active={isActive} />
                <span
                  className={`text-[11px] uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? "font-bold text-[#e8751a]"
                      : "font-medium text-[#e8751a]/50 group-hover:text-[#e8751a]/80"
                  }`}
                >
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── BREADCRUMB ── */}
      <div className="mx-auto max-w-[1400px] px-8 sm:px-10 pt-8 lg:px-16">
        <nav className="flex items-center gap-2 text-[13px] text-white/40">
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">
            {product.breadcrumb_category || product.category}
          </Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">
            {product.breadcrumb_type || product.surface}
          </Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-[#e8751a]">
            {product.breadcrumb_series || product.category}
          </Link>
          <span>/</span>
          <span className="font-medium text-[#e8751a]">{activeDesign?.label}</span>
        </nav>
        {product.breadcrumb_availability && (
          <p className="mt-1 text-[13px] text-white/40">
            Available in:{" "}
            {product.breadcrumb_availability.split(",").map((item, i, arr) => (
              <span key={i}>
                {i < arr.length - 1 ? (
                  <span className="text-white/60">{item.trim()}, </span>
                ) : (
                  <span className="font-semibold text-[#e8751a]">{item.trim()}</span>
                )}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* ── HERO — title, description, resource links + image ── */}
      <section className="mx-auto max-w-[1400px] px-8 sm:px-10 py-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {activeDesign?.title}
            </h1>
            {isMember && startingPrice ? (
              <p className="mt-3 text-lg">
                <span className="font-bold text-[#e8751a]">
                  From ${(startingPrice / 100).toFixed(2)}
                </span>
                <span className="ml-1.5 text-sm text-white/40">AUD per unit</span>
              </p>
            ) : !isMember ? (
              <p className="mt-3">
                <Link
                  href="/member/login"
                  className="text-sm text-[#e8751a] hover:underline"
                >
                  Login for pricing
                </Link>
              </p>
            ) : null}
            <p className="mt-4 leading-relaxed text-white/70">
              {activeDesign?.description}
            </p>

            <div className="mt-10">
              <div className="grid grid-cols-2 gap-x-8">
                <button className="flex items-center gap-3 border-b border-white/10 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="resources" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Resources</span>
                </button>
                <button className="flex items-center gap-3 border-b border-white/10 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="design-symbols" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Design Symbols</span>
                </button>
                <button className="flex items-center gap-3 border-b border-white/10 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="color-samples" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Color Samples</span>
                </button>
                <button className="flex items-center gap-3 border-b border-white/10 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="product-samples" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Product Samples</span>
                </button>
                <button className="flex items-center gap-3 py-4 text-left transition-colors hover:text-[#e8751a]">
                  <ResourceIcon type="request-quote" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-white/70">Request a Quote</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Hero Carousel */}
          <div className="relative overflow-hidden rounded-lg">
            {heroImages[heroIdx]?.url ? (
              <div className="aspect-[4/3] relative">
                <img
                  src={heroImages[heroIdx].url}
                  alt={heroImages[heroIdx].caption || ""}
                  className="w-full h-full object-cover"
                />
                <p className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-[13px] text-white/70">
                  {heroImages[heroIdx]?.caption}
                </p>
              </div>
            ) : (
              <div className={`flex aspect-[4/3] items-end bg-gradient-to-br ${heroGradient} p-6`}>
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
            )}
            {heroImages.length > 1 && (
              <>
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── COLORWAYS ── */}
      {colorways.length > 0 && (
        <section className="border-t border-white/10 bg-[#151515]" ref={colorwaysSectionRef}>
          <div className="mx-auto max-w-[1400px] px-8 sm:px-10 py-14 lg:px-16">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-3xl font-bold">
                Colorways
                {sampleMode && (
                  <span className="ml-3 text-sm font-normal text-[#e8751a]">
                    — Select colors for samples
                  </span>
                )}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handlePrintColorways}
                  className="flex items-center gap-2 rounded border border-white/20 px-4 py-2 text-[13px] text-white/70 transition-colors hover:border-[#e8751a] hover:text-[#e8751a]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5z" />
                  </svg>
                  Print
                </button>
                {sampleMode ? (
                  <button
                    onClick={handleAddSamplesToCart}
                    disabled={selectedSamples.size === 0}
                    className={`flex items-center gap-2 rounded px-5 py-2 text-[13px] font-semibold transition-colors ${
                      selectedSamples.size > 0
                        ? "bg-[#e8751a] text-white hover:bg-[#d46815]"
                        : "bg-[#e8751a]/30 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {sampleAdded
                      ? "Added!"
                      : selectedSamples.size > 0
                      ? `Add ${selectedSamples.size} Sample${selectedSamples.size > 1 ? "s" : ""} to Cart`
                      : "Select Colors"}
                  </button>
                ) : (
                  <button
                    onClick={() => setSampleMode(true)}
                    className="flex items-center gap-2 rounded bg-[#e8751a] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#d46815]"
                  >
                    Order Color Samples
                  </button>
                )}
              </div>
            </div>

            <div className={`grid gap-4 transition-all ${
              sampleMode
                ? "grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
                : "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
            }`}>
              {colorways.map((c) => {
                const isSelected = selectedSamples.has(c.code);
                return sampleMode ? (
                  <button
                    key={c.code}
                    onClick={() => toggleSampleColor(c.code)}
                    className={`group text-left transition-all ${
                      isSelected ? "scale-[1.03]" : "hover:scale-[1.01]"
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`aspect-[3/4] w-full rounded-sm border-2 transition-all ${
                          isSelected
                            ? "border-[#e8751a] shadow-lg shadow-[#e8751a]/20"
                            : "border-transparent group-hover:border-white/30"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                      {/* Checkbox overlay */}
                      <div
                        className={`absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                          isSelected
                            ? "border-[#e8751a] bg-[#e8751a]"
                            : "border-white/50 bg-black/40"
                        }`}
                      >
                        {isSelected && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className={`mt-1.5 text-[11px] font-semibold leading-tight ${
                      isSelected ? "text-[#e8751a]" : "text-white/80"
                    }`}>
                      {c.name}
                    </p>
                    <p className="text-[10px] text-white/40">{c.code}</p>
                  </button>
                ) : (
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
                );
              })}
            </div>

            {sampleMode && (
              <p className="mt-4 text-[12px] text-white/40">
                Click colors to select them, then click &quot;Add to Cart&quot;. Click anywhere outside this section to cancel.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── BUILD A PRODUCT SAMPLE ── */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-8 sm:px-10 py-14 lg:px-16">
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
                    <option key={d.design_key} value={d.design_key}>{d.label}</option>
                  ))}
                </select>
              </div>

              {buildThicknesses.length > 0 && (
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-white/80">2. Select thickness</label>
                  <select
                    value={selectedThickness}
                    onChange={(e) => setSelectedThickness(e.target.value)}
                    className="w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                  >
                    {buildThicknesses.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              {buildSizes.length > 0 && (
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-white/80">3. Select size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                  >
                    {buildSizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {buildFaceColors.length > 0 && (
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-white/80">4. Select face color</label>
                  <select
                    className="mb-4 w-full max-w-[240px] rounded border border-white/20 bg-[#1a1a1a] px-4 py-3 text-sm text-white focus:border-[#e8751a] focus:outline-none"
                    defaultValue={buildFaceColors[0]}
                  >
                    {buildFaceColors.map((fc) => (
                      <option key={fc} value={fc.toLowerCase()}>{fc}</option>
                    ))}
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
              )}

              {/* Pricing & Add to Cart */}
              {isMember ? (
                <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5 space-y-4">
                  {selectedVariant ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#e8751a]">
                          ${(selectedVariant.price_cents / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-white/40">AUD per unit</span>
                      </div>
                      <p className="text-xs text-white/50">
                        {selectedVariant.thickness} · {selectedVariant.size} · {selectedVariant.face_color}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded border border-white/10">
                          <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="px-3 py-2 text-white/60 hover:text-white"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm text-white">{quantity}</span>
                          <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-3 py-2 text-white/60 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 rounded bg-[#e8751a] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#d46815]"
                        >
                          {addedToCart ? "Added!" : "Add to Cart"}
                        </button>
                      </div>
                    </>
                  ) : variants.length > 0 ? (
                    <p className="text-sm text-white/50">
                      Select a valid combination to see pricing.
                    </p>
                  ) : (
                    <p className="text-sm text-white/50">
                      No pricing configured for this product yet.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
                  <p className="text-sm text-white/50 mb-3">
                    Pricing is available to members only.
                  </p>
                  <Link
                    href="/member/login"
                    className="inline-block rounded bg-[#e8751a] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#d46815]"
                  >
                    Login for Pricing
                  </Link>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button className="rounded bg-[#222] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#333]">
                  Print
                </button>
                <button className="rounded bg-[#222] px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#333]">
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

      {/* ── RESOURCES & SPECS ── */}
      {(resources.length > 0 || specs.length > 0) && (
        <section className="border-t border-white/10 bg-[#151515]">
          <div className="mx-auto max-w-[1400px] px-8 sm:px-10 py-14 lg:px-16">
            <div className="grid gap-14 lg:grid-cols-2">
              {resources.length > 0 && (
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
              )}

              {specs.length > 0 && (
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
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── SUSTAINABILITY & CUSTOM ── */}
      {(product.sustainability_content || product.custom_content) && (
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-[1400px] px-8 sm:px-10 py-14 lg:px-16">
            <div className="grid gap-14 lg:grid-cols-2">
              {product.sustainability_content && (
                <div>
                  <h2 className="mb-4 text-3xl font-bold">Sustainability</h2>
                  <p className="leading-relaxed text-white/70">
                    {product.sustainability_content}{" "}
                    <Link href="/about" className="text-[#e8751a] underline hover:text-[#d46815]">
                      Read more
                    </Link>
                    .
                  </p>
                </div>
              )}
              {product.custom_content && (
                <div>
                  <h2 className="mb-4 text-3xl font-bold">Custom</h2>
                  <p className="mb-6 leading-relaxed text-white/70">
                    {product.custom_content}
                  </p>
                  <Link
                    href={product.custom_button_link || "/contact"}
                    className="inline-block rounded-sm border-2 border-white/30 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-[#e8751a] hover:text-[#e8751a]"
                  >
                    {product.custom_button_text || "Talk to Us"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW TO SPECIFY ── */}
      {howToSteps.length > 0 && (
        <section className="border-t border-white/10 bg-[#151515]">
          <div className="mx-auto max-w-[1400px] px-8 sm:px-10 py-14 lg:px-16">
            <h2 className="mb-12 text-3xl font-bold">How to specify</h2>
            <div className="grid gap-10 sm:grid-cols-3">
              {howToSteps.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mb-6 flex justify-center">
                    <StepIcon step={item.step} />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-[#e8751a]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-white/60">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED PRODUCTS ── */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-8 sm:px-10 py-14 lg:px-16">
          <h2 className="mb-10 text-3xl font-bold">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Rafter", type: "Frames", surface: "Ceiling", gradient: "from-[#4a3e30] to-[#6e5840]" },
              { name: "Fillet", type: "Frames", surface: "Ceiling", gradient: "from-[#5a5044] to-[#8a7e6e]" },
              { name: "Trout", type: "Gills", surface: "Ceiling", gradient: "from-[#3a3028] to-[#5e5448]" },
              { name: "Box", type: "Vista", surface: "Ceiling", gradient: "from-[#6a5e50] to-[#9e9080]" },
            ].map((rp) => (
              <Link
                key={rp.name}
                href={`/products/${rp.name.toLowerCase()}`}
                className="group"
              >
                <div className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${rp.gradient} transition-transform group-hover:scale-[1.02]`}>
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
                  <p className="text-[13px] text-white/50">{rp.type}</p>
                  <p className="font-semibold text-white group-hover:text-[#e8751a]">{rp.name}</p>
                  <p className="text-[13px] text-white/50">{rp.surface}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
