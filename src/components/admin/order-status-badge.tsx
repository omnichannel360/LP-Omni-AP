"use client";

import { useState } from "react";

interface Props {
  orderId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  shipped: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function OrderStatusBadge({
  orderId,
  currentStatus,
  onStatusChange,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  async function handleChange(newStatus: string) {
    if (newStatus === status) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      }
    } catch {
      // Ignore
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={updating}
      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize focus:outline-none ${
        statusColors[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
      } ${updating ? "opacity-50" : ""}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
