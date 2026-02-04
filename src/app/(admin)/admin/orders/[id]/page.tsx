"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderStatusBadge from "@/components/admin/order-status-badge";

interface OrderItem {
  id: string;
  product_name: string;
  variant_description: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal_cents: number;
  discount_percent: number;
  discount_amount_cents: number;
  total_cents: number;
  points_earned: number;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_company: string | null;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postcode: string;
  shipping_country: string;
  shipping_phone: string | null;
  notes: string | null;
  created_at: string;
  members: {
    first_name: string;
    last_name: string;
    email: string;
    company: string | null;
  };
  order_items: OrderItem[];
}

export default function AdminOrderDetail() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.error ? null : data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-white/10" />
        <div className="h-64 rounded-xl border border-white/10 bg-[#0a0a0a]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Order not found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-[#e8751a] hover:underline"
          >
            &larr; All Orders
          </Link>
          <h1 className="text-2xl font-bold mt-2">{order.order_number}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(order.created_at).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <OrderStatusBadge orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left font-medium text-gray-400">
                    Product
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-400">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-400">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-400">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.variant_description}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">
                      ${(item.unit_price_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      ${(item.line_total_cents / 100).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
            <h3 className="font-semibold text-white mb-3">Customer</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                {order.members.first_name} {order.members.last_name}
              </p>
              <p className="text-gray-500">{order.members.email}</p>
              {order.members.company && (
                <p className="text-gray-500">{order.members.company}</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
            <h3 className="font-semibold text-white mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">
                  ${(order.subtotal_cents / 100).toFixed(2)}
                </span>
              </div>
              {order.discount_amount_cents > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Discount ({order.discount_percent}%)
                  </span>
                  <span className="text-green-400">
                    -${(order.discount_amount_cents / 100).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
                <span className="text-white">Total</span>
                <span className="text-[#e8751a]">
                  ${(order.total_cents / 100).toFixed(2)}
                </span>
              </div>
              {order.points_earned > 0 && (
                <p className="text-xs text-[#e8751a]">
                  +{order.points_earned} points awarded
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
            <h3 className="font-semibold text-white mb-3">Shipping</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                {order.shipping_first_name} {order.shipping_last_name}
              </p>
              {order.shipping_company && <p>{order.shipping_company}</p>}
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && (
                <p>{order.shipping_address_line2}</p>
              )}
              <p>
                {order.shipping_city}, {order.shipping_state}{" "}
                {order.shipping_postcode}
              </p>
              {order.shipping_phone && <p>{order.shipping_phone}</p>}
            </div>
            {order.notes && (
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-xs text-gray-400">Notes:</p>
                <p className="text-sm text-gray-300">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
