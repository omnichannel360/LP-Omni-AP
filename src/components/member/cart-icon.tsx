"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, getCartCount } from "@/lib/cart";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(getCartCount(getCart()));
    updateCount();

    // Listen for cart updates
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  return (
    <Link href="/member/cart" className="relative text-gray-300 hover:text-white transition-colors">
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#e8751a] text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
