"use client";

import { useEffect, useState } from "react";

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  min_order_cents: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

export default function AdminDiscounts() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed_amount">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderDollars, setMinOrderDollars] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    fetch("/api/admin/discounts")
      .then((r) => r.json())
      .then((data) => {
        setCodes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function generateCode() {
    const res = await fetch("/api/admin/discounts/generate");
    const data = await res.json();
    setCode(data.code);
  }

  function resetForm() {
    setCode("");
    setDescription("");
    setDiscountType("percentage");
    setDiscountValue("");
    setMinOrderDollars("");
    setMaxUses("");
    setExpiresAt("");
  }

  async function addCode(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          description: description || null,
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderCents: minOrderDollars
            ? Math.round(parseFloat(minOrderDollars) * 100)
            : 0,
          maxUses: maxUses ? parseInt(maxUses) : null,
          expiresAt: expiresAt || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create discount code");
        return;
      }

      const newCode = await res.json();
      setCodes((prev) => [newCode, ...prev]);
      setShowAdd(false);
      resetForm();
      setSuccess("Discount code created successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/discounts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) {
      setCodes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c))
      );
    }
  }

  async function deleteCode(id: string) {
    if (!confirm("Delete this discount code?")) return;
    const res = await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCodes((prev) => prev.filter((c) => c.id !== id));
    }
  }

  function copyCode(text: string) {
    navigator.clipboard.writeText(text);
    setSuccess(`Copied "${text}" to clipboard`);
    setTimeout(() => setSuccess(""), 2000);
  }

  function isExpired(code: DiscountCode) {
    if (!code.expires_at) return false;
    return new Date(code.expires_at) < new Date();
  }

  function isMaxed(code: DiscountCode) {
    if (!code.max_uses) return false;
    return code.current_uses >= code.max_uses;
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:border-[#e8751a] focus:outline-none";

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Discount Codes</h1>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded border border-white/10 bg-[#0a0a0a]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Discount Codes</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage promo codes for member checkout
          </p>
        </div>
        <button
          onClick={() => {
            setShowAdd(!showAdd);
            if (!showAdd) generateCode();
          }}
          className="rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
        >
          + Create Code
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {showAdd && (
        <form
          onSubmit={addCode}
          className="mb-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">
            New Discount Code
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Code *
              </label>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. SAVE10"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5"
                >
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Summer sale discount"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Discount Type *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType("percentage")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    discountType === "percentage"
                      ? "bg-[#e8751a]/10 text-[#e8751a] border border-[#e8751a]/30"
                      : "bg-[#111] text-gray-400 border border-white/10 hover:border-white/20"
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType("fixed_amount")}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    discountType === "fixed_amount"
                      ? "bg-[#e8751a]/10 text-[#e8751a] border border-[#e8751a]/30"
                      : "bg-[#111] text-gray-400 border border-white/10 hover:border-white/20"
                  }`}
                >
                  Fixed Amount ($)
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Discount Value *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  placeholder={
                    discountType === "percentage" ? "e.g. 10" : "e.g. 25.00"
                  }
                  className={inputClass}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {discountType === "percentage" ? "%" : "AUD"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Min Order (AUD)
              </label>
              <input
                type="number"
                value={minOrderDollars}
                onChange={(e) => setMinOrderDollars(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0 (no minimum)"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Max Uses
              </label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min="1"
                placeholder="Unlimited"
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">
                Expires At
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className={inputClass + " max-w-xs"}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank for no expiry
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#e8751a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAdd(false);
                resetForm();
              }}
              className="rounded-lg border border-white/10 px-5 py-2 text-sm text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
          <p className="text-xs text-gray-400">Total Codes</p>
          <p className="text-2xl font-bold text-white mt-1">{codes.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
          <p className="text-xs text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {codes.filter((c) => c.is_active && !isExpired(c) && !isMaxed(c)).length}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
          <p className="text-xs text-gray-400">Total Uses</p>
          <p className="text-2xl font-bold text-[#e8751a] mt-1">
            {codes.reduce((sum, c) => sum + c.current_uses, 0)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Code
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Discount
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Uses
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Expires
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No discount codes yet. Click &quot;Create Code&quot; to get
                  started.
                </td>
              </tr>
            ) : (
              codes.map((c) => {
                const expired = isExpired(c);
                const maxed = isMaxed(c);
                return (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copyCode(c.code)}
                        className="group flex items-center gap-2"
                      >
                        <span className="font-mono text-sm font-bold text-[#e8751a]">
                          {c.code}
                        </span>
                        <svg
                          className="h-3.5 w-3.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      {c.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {c.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">
                        {c.discount_type === "percentage"
                          ? `${c.discount_value}%`
                          : `$${Number(c.discount_value).toFixed(2)}`}
                      </span>
                      {c.min_order_cents > 0 && (
                        <p className="text-xs text-gray-500">
                          Min: ${(c.min_order_cents / 100).toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-300">
                      {c.current_uses}
                      {c.max_uses ? ` / ${c.max_uses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {expired ? (
                        <span className="rounded-full bg-gray-500/10 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                          Expired
                        </span>
                      ) : maxed ? (
                        <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
                          Maxed Out
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleActive(c.id, c.is_active)}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            c.is_active
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {c.is_active ? "Active" : "Inactive"}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-400">
                      {c.expires_at
                        ? new Date(c.expires_at).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteCode(c.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
