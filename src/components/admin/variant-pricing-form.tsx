"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  thickness: string;
  size: string;
  face_color: string;
  colorway_code: string | null;
  sku: string | null;
  price_cents: number;
  is_available: boolean;
}

interface Props {
  productId: string;
  productName: string;
  variants: Variant[];
}

export default function VariantPricingForm({
  productId,
  productName,
  variants: initialVariants,
}: Props) {
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // New variant form state
  const [thickness, setThickness] = useState("");
  const [size, setSize] = useState("");
  const [faceColor, setFaceColor] = useState("");
  const [colorwayCode, setColorwayCode] = useState("");
  const [sku, setSku] = useState("");
  const [priceDollars, setPriceDollars] = useState("");

  async function addVariant(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          thickness,
          size,
          faceColor,
          colorwayCode: colorwayCode || null,
          sku: sku || null,
          priceCents: Math.round(parseFloat(priceDollars) * 100),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add variant");
        return;
      }

      const newVariant = await res.json();
      setVariants((prev) => [...prev, newVariant]);
      setShowAdd(false);
      setThickness("");
      setSize("");
      setFaceColor("");
      setColorwayCode("");
      setSku("");
      setPriceDollars("");
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function updatePrice(variantId: string, newPriceCents: number) {
    const res = await fetch(`/api/admin/variants/${variantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceCents: newPriceCents }),
    });

    if (res.ok) {
      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId ? { ...v, price_cents: newPriceCents } : v
        )
      );
    }
  }

  async function toggleAvailability(variantId: string, current: boolean) {
    const res = await fetch(`/api/admin/variants/${variantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !current }),
    });

    if (res.ok) {
      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId ? { ...v, is_available: !current } : v
        )
      );
    }
  }

  async function deleteVariant(variantId: string) {
    if (!confirm("Delete this variant?")) return;

    const res = await fetch(`/api/admin/variants/${variantId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:border-[#e8751a] focus:outline-none";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{productName}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {variants.length} variant{variants.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
          >
            + Add Variant
          </button>
          <button
            onClick={() => router.push("/admin/pricing")}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/5"
          >
            Back
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {showAdd && (
        <form
          onSubmit={addVariant}
          className="mb-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">
            New Variant
          </h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Thickness *
              </label>
              <input
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                required
                placeholder="e.g. 25mm"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Size *
              </label>
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                placeholder="e.g. 600x600"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Face Color *
              </label>
              <input
                value={faceColor}
                onChange={(e) => setFaceColor(e.target.value)}
                required
                placeholder="e.g. White"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Colorway Code
              </label>
              <input
                value={colorwayCode}
                onChange={(e) => setColorwayCode(e.target.value)}
                placeholder="e.g. BUF-WHT"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">SKU</label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. APA-BUF-25-600"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Price (AUD) *
              </label>
              <input
                type="number"
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#e8751a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Variant"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-white/10 px-5 py-2 text-sm text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Thickness
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Size
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Face Color
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                SKU
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Price (AUD)
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Available
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No variants yet. Click &quot;Add Variant&quot; to create
                  pricing options.
                </td>
              </tr>
            ) : (
              variants.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-white">{v.thickness}</td>
                  <td className="px-4 py-3 text-gray-300">{v.size}</td>
                  <td className="px-4 py-3 text-gray-300">{v.face_color}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                    {v.sku || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      defaultValue={(v.price_cents / 100).toFixed(2)}
                      min="0"
                      step="0.01"
                      onBlur={(e) => {
                        const newCents = Math.round(
                          parseFloat(e.target.value) * 100
                        );
                        if (newCents !== v.price_cents) {
                          updatePrice(v.id, newCents);
                        }
                      }}
                      className="w-24 rounded border border-white/10 bg-transparent px-2 py-1 text-right text-white text-sm focus:border-[#e8751a] focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleAvailability(v.id, v.is_available)}
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        v.is_available
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {v.is_available ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteVariant(v.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
