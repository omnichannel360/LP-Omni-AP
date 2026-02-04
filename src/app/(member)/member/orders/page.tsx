"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
  created_at: string;
  order_items: { id: string }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  processing: "bg-purple-500/10 text-purple-400",
  shipped: "bg-cyan-500/10 text-cyan-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-white/10 bg-[#0a0a0a]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-12 text-center">
          <p className="text-gray-400">No orders yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/member/orders/${order.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a0a0a] p-5 hover:border-[#e8751a]/30 transition-colors"
            >
              <div>
                <p className="font-semibold text-white">
                  {order.order_number}
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  &middot; {order.order_items.length} item
                  {order.order_items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    statusColors[order.status] || "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {order.status}
                </span>
                <span className="font-bold text-[#e8751a]">
                  ${(order.total_cents / 100).toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
