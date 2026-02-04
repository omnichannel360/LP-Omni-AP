"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
  CartItem,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getCart());
    setMounted(true);
  }, []);

  function handleQuantity(variantId: string, qty: number) {
    const updated = updateCartQuantity(variantId, qty);
    setItems(updated);
    window.dispatchEvent(new Event("cart-updated"));
  }

  function handleRemove(variantId: string) {
    const updated = removeFromCart(variantId);
    setItems(updated);
    window.dispatchEvent(new Event("cart-updated"));
  }

  if (!mounted) return null;

  const total = getCartTotal(items);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          <p className="mt-4 text-gray-400">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0a0a0a] p-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {item.variantDescription}
                  </p>
                  <p className="text-sm text-[#e8751a] font-medium mt-1">
                    ${(item.priceCents / 100).toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantity(item.variantId, item.quantity - 1)
                    }
                    className="h-8 w-8 rounded border border-white/10 text-white hover:bg-white/5 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-white text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantity(item.variantId, item.quantity + 1)
                    }
                    className="h-8 w-8 rounded border border-white/10 text-white hover:bg-white/5 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="text-right w-24">
                  <p className="font-semibold text-white">
                    ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.variantId)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 border-b border-white/10 pb-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="text-white">
                  ${(total / 100).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="text-[#e8751a]">
                ${(total / 100).toFixed(2)}
              </span>
            </div>
            <Link
              href="/member/checkout"
              className="mt-6 block w-full rounded-lg bg-[#e8751a] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#d06815]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
