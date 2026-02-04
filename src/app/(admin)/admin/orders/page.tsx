"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrderStatusBadge from "@/components/admin/order-status-badge";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
  created_at: string;
  members: { first_name: string; last_name: string; email: string };
  order_items: { id: string }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
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
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-400 text-sm mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Order
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Customer
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Items
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Total
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Date
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-mono text-xs text-white">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm">
                      {order.members.first_name} {order.members.last_name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {order.members.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {order.order_items.length}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#e8751a]">
                    ${(order.total_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <OrderStatusBadge
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-[#e8751a] hover:underline text-xs"
                    >
                      View
                    </Link>
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
