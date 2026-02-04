"use client";

import { useEffect, useState } from "react";

interface RewardType {
  id: string;
  name: string;
  description: string | null;
  points_cost: number;
  reward_value_cents: number | null;
  is_active: boolean;
}

export default function AdminRewards() {
  const [rewards, setRewards] = useState<RewardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pointsCost, setPointsCost] = useState("");
  const [rewardValueDollars, setRewardValueDollars] = useState("");

  useEffect(() => {
    fetch("/api/admin/rewards")
      .then((r) => r.json())
      .then((data) => {
        setRewards(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function addReward(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          pointsCost: parseInt(pointsCost),
          rewardValueCents: rewardValueDollars
            ? Math.round(parseFloat(rewardValueDollars) * 100)
            : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add reward");
        return;
      }

      const newReward = await res.json();
      setRewards((prev) => [...prev, newReward]);
      setShowAdd(false);
      setName("");
      setDescription("");
      setPointsCost("");
      setRewardValueDollars("");
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/admin/rewards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });

    if (res.ok) {
      setRewards((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_active: !current } : r))
      );
    }
  }

  async function deleteReward(id: string) {
    if (!confirm("Delete this reward type?")) return;

    const res = await fetch(`/api/admin/rewards/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRewards((prev) => prev.filter((r) => r.id !== id));
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:border-[#e8751a] focus:outline-none";

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Rewards</h1>
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
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
          <h1 className="text-2xl font-bold">Rewards</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage reward types that members can redeem with points
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
        >
          + Add Reward
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {showAdd && (
        <form
          onSubmit={addReward}
          className="mb-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-4">
            New Reward Type
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Name *
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. $10 Coffee Voucher"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Points Cost *
              </label>
              <input
                type="number"
                value={pointsCost}
                onChange={(e) => setPointsCost(e.target.value)}
                required
                min="1"
                placeholder="e.g. 50"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Value (AUD)
              </label>
              <input
                type="number"
                value={rewardValueDollars}
                onChange={(e) => setRewardValueDollars(e.target.value)}
                min="0"
                step="0.01"
                placeholder="e.g. 10.00"
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
              {saving ? "Adding..." : "Add Reward"}
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
                Reward
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Points Cost
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Value
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rewards.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No reward types yet. Click &quot;Add Reward&quot; to create
                  one.
                </td>
              </tr>
            ) : (
              rewards.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{r.name}</p>
                    {r.description && (
                      <p className="text-xs text-gray-400">{r.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-[#e8751a] font-medium">
                    {r.points_cost} pts
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {r.reward_value_cents
                      ? `$${(r.reward_value_cents / 100).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(r.id, r.is_active)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.is_active
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {r.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteReward(r.id)}
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
