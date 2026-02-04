"use client";

import { useEffect, useState } from "react";

interface RewardType {
  id: string;
  name: string;
  description: string | null;
  points_cost: number;
  reward_value_cents: number | null;
}

interface RedeemedReward {
  id: string;
  voucher_code: string;
  points_spent: number;
  status: string;
  redeemed_at: string;
  expires_at: string | null;
  reward_types: { name: string; description: string | null };
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardType[]>([]);
  const [history, setHistory] = useState<RedeemedReward[]>([]);
  const [memberPoints, setMemberPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    code: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/rewards").then((r) => r.json()),
      fetch("/api/rewards/history").then((r) => r.json()),
      fetch("/api/member/auth/session").then((r) => r.json()),
    ])
      .then(([rewardsData, historyData, sessionData]) => {
        setRewards(Array.isArray(rewardsData) ? rewardsData : []);
        setHistory(Array.isArray(historyData) ? historyData : []);
        if (sessionData.member) {
          setMemberPoints(sessionData.member.pointsBalance);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function redeemReward(rewardId: string) {
    setRedeeming(rewardId);
    setSuccess(null);

    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardTypeId: rewardId }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to redeem");
        return;
      }

      const data = await res.json();
      setSuccess({ code: data.voucherCode, name: data.rewardName });
      setMemberPoints((prev) => prev - data.pointsSpent);

      // Refresh history
      const historyRes = await fetch("/api/rewards/history");
      const historyData = await historyRes.json();
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch {
      alert("Something went wrong");
    } finally {
      setRedeeming(null);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Rewards</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-24 rounded-xl border border-white/10 bg-[#0a0a0a]" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-xl border border-white/10 bg-[#0a0a0a]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rewards</h1>

      {/* Points Balance */}
      <div className="mb-8 rounded-xl border border-[#e8751a]/20 bg-[#e8751a]/5 p-6 text-center">
        <p className="text-sm text-gray-400">Your Points Balance</p>
        <p className="text-4xl font-bold text-[#e8751a] mt-1">
          {memberPoints}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Earn 1 point for every $100 spent
        </p>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-6 text-center">
          <p className="text-green-400 font-semibold">
            Reward Redeemed Successfully!
          </p>
          <p className="text-white mt-2">{success.name}</p>
          <p className="mt-3 font-mono text-2xl text-[#e8751a] tracking-wider">
            {success.code}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Save this voucher code for use
          </p>
        </div>
      )}

      {/* Available Rewards */}
      <h2 className="text-lg font-semibold text-white mb-4">
        Available Rewards
      </h2>
      {rewards.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-8 text-center mb-8">
          <p className="text-gray-400">
            No rewards available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5"
            >
              <h3 className="font-semibold text-white">{reward.name}</h3>
              {reward.description && (
                <p className="text-sm text-gray-400 mt-1">
                  {reward.description}
                </p>
              )}
              {reward.reward_value_cents && (
                <p className="text-sm text-[#e8751a] mt-2">
                  Value: ${(reward.reward_value_cents / 100).toFixed(2)}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[#e8751a]">
                  {reward.points_cost} pts
                </span>
                <button
                  onClick={() => redeemReward(reward.id)}
                  disabled={
                    memberPoints < reward.points_cost ||
                    redeeming === reward.id
                  }
                  className="rounded-lg bg-[#e8751a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#d06815] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {redeeming === reward.id
                    ? "Redeeming..."
                    : memberPoints < reward.points_cost
                    ? "Not Enough Points"
                    : "Redeem"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Redemption History */}
      <h2 className="text-lg font-semibold text-white mb-4">Your Vouchers</h2>
      {history.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-8 text-center">
          <p className="text-gray-400">
            No vouchers yet. Redeem your points above!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a0a0a] p-4"
            >
              <div>
                <p className="font-medium text-white">
                  {item.reward_types.name}
                </p>
                <p className="font-mono text-sm text-[#e8751a] mt-0.5">
                  {item.voucher_code}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Redeemed{" "}
                  {new Date(item.redeemed_at).toLocaleDateString("en-AU")}
                  {item.expires_at &&
                    ` · Expires ${new Date(item.expires_at).toLocaleDateString(
                      "en-AU"
                    )}`}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    item.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : item.status === "used"
                      ? "bg-gray-500/10 text-gray-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {item.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {item.points_spent} pts
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
