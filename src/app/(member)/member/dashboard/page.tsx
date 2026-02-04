"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MemberSession {
  firstName: string;
  lastName: string;
  email: string;
  pointsBalance: number;
  discountPercent: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  processing: "bg-purple-500/10 text-purple-400",
  shipped: "bg-cyan-500/10 text-cyan-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function MemberDashboard() {
  const [member, setMember] = useState<MemberSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/member/auth/session").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ])
      .then(([sessionData, ordersData]) => {
        if (sessionData.member) setMember(sessionData.member);
        setOrders(
          Array.isArray(ordersData) ? ordersData.slice(0, 5) : []
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 rounded-xl border border-white/10 bg-[#0a0a0a]" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-white/10 bg-[#0a0a0a]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] p-8 mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {member?.firstName}!
        </h1>
        <p className="text-gray-400 mt-1">{member?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <p className="text-sm text-gray-400">Points Balance</p>
          <p className="text-3xl font-bold text-[#e8751a] mt-1">
            {member?.pointsBalance || 0}
          </p>
          <Link
            href="/member/rewards"
            className="text-xs text-[#e8751a] hover:underline mt-2 inline-block"
          >
            Redeem rewards &rarr;
          </Link>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <p className="text-sm text-gray-400">Your Discount</p>
          <p className="text-3xl font-bold text-white mt-1">
            {member?.discountPercent || 0}%
          </p>
          <p className="text-xs text-gray-500 mt-2">Member discount rate</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <p className="text-sm text-gray-400">Total Orders</p>
          <p className="text-3xl font-bold text-white mt-1">{orders.length}</p>
          <Link
            href="/member/orders"
            className="text-xs text-[#e8751a] hover:underline mt-2 inline-block"
          >
            View all orders &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <Link
          href="/products"
          className="group flex items-center gap-4 rounded-xl border border-white/10 bg-[#0a0a0a] p-5 hover:border-[#e8751a]/30 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8751a]/10">
            <svg
              className="h-5 w-5 text-[#e8751a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-white group-hover:text-[#e8751a] transition-colors">
              Browse Products
            </p>
            <p className="text-sm text-gray-400">
              Explore our acoustic panel range
            </p>
          </div>
        </Link>
        <Link
          href="/member/cart"
          className="group flex items-center gap-4 rounded-xl border border-white/10 bg-[#0a0a0a] p-5 hover:border-[#e8751a]/30 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8751a]/10">
            <svg
              className="h-5 w-5 text-[#e8751a]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-white group-hover:text-[#e8751a] transition-colors">
              Shopping Cart
            </p>
            <p className="text-sm text-gray-400">View and manage your cart</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-8 text-center">
          <p className="text-gray-400">No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/member/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0a0a0a] px-4 py-3 hover:border-[#e8751a]/30 transition-colors"
            >
              <div>
                <span className="font-mono text-sm text-white">
                  {order.order_number}
                </span>
                <span className="text-gray-500 text-xs ml-2">
                  {new Date(order.created_at).toLocaleDateString("en-AU")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    statusColors[order.status] ||
                    "bg-gray-500/10 text-gray-400"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-semibold text-[#e8751a]">
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
