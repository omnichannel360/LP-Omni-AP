"use client";

import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [globalDiscount, setGlobalDiscount] = useState("0");
  const [pointsRate, setPointsRate] = useState("0.01");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.global_discount_percent !== undefined) {
          setGlobalDiscount(data.global_discount_percent.toString());
        }
        if (data.points_per_dollar_spent !== undefined) {
          setPointsRate(data.points_per_dollar_spent.toString());
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          globalDiscountPercent: parseFloat(globalDiscount) || 0,
          pointsPerDollarSpent: parseFloat(pointsRate) || 0.01,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      // Ignore
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="animate-pulse h-48 rounded-xl border border-white/10 bg-[#0a0a0a]" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Global Settings</h1>

      {success && (
        <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          Settings saved successfully.
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="max-w-xl rounded-xl border border-white/10 bg-[#0a0a0a] p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Global Discount (%)
          </label>
          <input
            type="number"
            value={globalDiscount}
            onChange={(e) => setGlobalDiscount(e.target.value)}
            min="0"
            max="100"
            step="0.01"
            className="w-full max-w-[200px] rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Applies to all members. If a member has a higher personal discount,
            their discount is used instead.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Points per Dollar Spent
          </label>
          <input
            type="number"
            value={pointsRate}
            onChange={(e) => setPointsRate(e.target.value)}
            min="0"
            step="0.001"
            className="w-full max-w-[200px] rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Default: 0.01 (1 point per $100 spent). Points are awarded when
            orders are marked as delivered.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#e8751a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
