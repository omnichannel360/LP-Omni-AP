"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, getCartTotal, clearCart, CartItem } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Shipping form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) {
      router.push("/member/cart");
      return;
    }
    setItems(cart);
    setMounted(true);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shipping: {
            firstName,
            lastName,
            company,
            addressLine1,
            addressLine2,
            city,
            state,
            postcode,
            country: "Australia",
            phone,
            notes,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to place order");
        return;
      }

      const order = await res.json();
      clearCart();
      window.dispatchEvent(new Event("cart-updated"));
      router.push(`/member/orders/${order.id}?placed=true`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  const total = getCartTotal(items);
  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#e8751a] focus:outline-none";

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    First Name *
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Last Name *
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Company
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Address Line 1 *
                </label>
                <input
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Address Line 2
                </label>
                <input
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    City *
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    State *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    <option value="NSW">NSW</option>
                    <option value="VIC">VIC</option>
                    <option value="QLD">QLD</option>
                    <option value="SA">SA</option>
                    <option value="WA">WA</option>
                    <option value="TAS">TAS</option>
                    <option value="NT">NT</option>
                    <option value="ACT">ACT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Postcode *
                  </label>
                  <input
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    required
                    pattern="[0-9]{4}"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Order Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 border-b border-white/10 pb-4 mb-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-white truncate">{item.productName}</p>
                    <p className="text-gray-500 text-xs">
                      {item.variantDescription} x{item.quantity}
                    </p>
                  </div>
                  <span className="text-white shrink-0">
                    ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="text-[#e8751a]">
                ${(total / 100).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Applicable discounts will be applied at order confirmation.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 block w-full rounded-lg bg-[#e8751a] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
