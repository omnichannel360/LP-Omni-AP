"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getSampleCart,
  removeSampleFromCart,
  removeSampleColorway,
  clearSampleCart,
  SampleCartItem,
} from "@/lib/sample-cart";

export default function SampleCartPage() {
  const [items, setItems] = useState<SampleCartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getSampleCart());
    setMounted(true);
  }, []);

  function handleRemoveColorway(productId: string, colorCode: string) {
    const updated = removeSampleColorway(productId, colorCode);
    setItems(updated);
    window.dispatchEvent(new Event("sample-cart-updated"));
  }

  function handleRemoveProduct(productId: string) {
    const updated = removeSampleFromCart(productId);
    setItems(updated);
    window.dispatchEvent(new Event("sample-cart-updated"));
  }

  function handleClear() {
    clearSampleCart();
    setItems([]);
    window.dispatchEvent(new Event("sample-cart-updated"));
  }

  if (!mounted) return null;

  const totalColors = items.reduce((s, i) => s + i.colorways.length, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Color Sample Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <p className="text-gray-400 mb-4">
            Your sample cart is empty. Browse products and select color samples.
          </p>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-[#e8751a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    {item.productName}
                  </h2>
                  <button
                    onClick={() => handleRemoveProduct(item.productId)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove All
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {item.colorways.map((cw) => (
                    <div
                      key={cw.code}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111] px-3 py-2"
                    >
                      <div
                        className="h-8 w-8 rounded-sm border border-white/20"
                        style={{ backgroundColor: cw.hex }}
                      />
                      <div>
                        <p className="text-sm text-white">{cw.name}</p>
                        <p className="text-xs text-gray-500">{cw.code}</p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveColorway(item.productId, cw.code)
                        }
                        className="ml-2 text-gray-500 hover:text-red-400"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
            <div>
              <p className="text-sm text-gray-400">
                {totalColors} color sample{totalColors !== 1 ? "s" : ""} from{" "}
                {items.length} product{items.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Free color samples. Ships in 1-2 business days.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5"
              >
                Clear Cart
              </button>
              <Link
                href="/member/samples/checkout"
                className="rounded-lg bg-[#e8751a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
              >
                Checkout Samples
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
