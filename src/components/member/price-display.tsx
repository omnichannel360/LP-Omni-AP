"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Variant {
  id: string;
  thickness: string;
  size: string;
  face_color: string;
  colorway_code: string | null;
  price_cents: number;
}

interface Props {
  productId: string;
  isMember: boolean;
  onSelectVariant?: (variant: Variant | null) => void;
}

export default function PriceDisplay({
  productId,
  isMember,
  onSelectVariant,
}: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selThickness, setSelThickness] = useState("");
  const [selSize, setSelSize] = useState("");
  const [selColor, setSelColor] = useState("");

  useEffect(() => {
    if (!isMember) {
      setLoading(false);
      return;
    }

    fetch(`/api/products/${productId}/variants`)
      .then((r) => r.json())
      .then((data) => {
        const list: Variant[] = Array.isArray(data) ? data : [];
        setVariants(list);
        if (list.length > 0) {
          setSelThickness(list[0].thickness);
          setSelSize(list[0].size);
          setSelColor(list[0].face_color);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId, isMember]);

  const handleVariantChange = useCallback(() => {
    if (!selThickness || !selSize || !selColor) return;
    const match = variants.find(
      (v) =>
        v.thickness === selThickness &&
        v.size === selSize &&
        v.face_color === selColor
    );
    onSelectVariant?.(match || null);
  }, [selThickness, selSize, selColor, variants, onSelectVariant]);

  useEffect(() => {
    handleVariantChange();
  }, [handleVariantChange]);

  if (!isMember) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
        <p className="text-sm text-gray-400">
          Pricing is available to members only.
        </p>
        <Link
          href="/member/login"
          className="mt-3 inline-block rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
        >
          Login for Pricing
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
        <p className="text-sm text-gray-400">
          No variants available for this product yet.
        </p>
      </div>
    );
  }

  const thicknesses = [...new Set(variants.map((v) => v.thickness))];
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.face_color))];

  const selected = variants.find(
    (v) =>
      v.thickness === selThickness &&
      v.size === selSize &&
      v.face_color === selColor
  );

  const selectClass =
    "rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:border-[#e8751a] focus:outline-none";

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Thickness</label>
          <select
            value={selThickness}
            onChange={(e) => setSelThickness(e.target.value)}
            className={selectClass + " w-full"}
          >
            {thicknesses.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Size</label>
          <select
            value={selSize}
            onChange={(e) => setSelSize(e.target.value)}
            className={selectClass + " w-full"}
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Color</label>
          <select
            value={selColor}
            onChange={(e) => setSelColor(e.target.value)}
            className={selectClass + " w-full"}
          >
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selected ? (
        <div className="flex items-center justify-between pt-2">
          <p className="text-2xl font-bold text-[#e8751a]">
            ${(selected.price_cents / 100).toFixed(2)}{" "}
            <span className="text-sm font-normal text-gray-400">AUD</span>
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 pt-2">
          This combination is not available.
        </p>
      )}
    </div>
  );
}
