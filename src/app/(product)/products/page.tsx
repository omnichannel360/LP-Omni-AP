import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isMember } from "@/lib/member-auth";

interface Product {
  id: string;
  name: string;
  category: string;
  surface: string;
  slug: string;
  gradient: string;
  description: string;
}

export const revalidate = 0;

export default async function Products() {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, name, category, surface, slug, gradient, description")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  const items: Product[] = products || [];

  const memberLoggedIn = await isMember();

  // Fetch lowest price per product for members
  const priceMap: Record<string, number> = {};
  if (memberLoggedIn && items.length > 0) {
    const productIds = items.map((p) => p.id);
    const { data: variants } = await supabaseAdmin
      .from("product_variants")
      .select("product_id, price_cents")
      .in("product_id", productIds)
      .eq("is_available", true);

    if (variants) {
      for (const v of variants) {
        const current = priceMap[v.product_id];
        if (current === undefined || v.price_cents < current) {
          priceMap[v.product_id] = v.price_cents;
        }
      }
    }
  }

  return (
    <div className="w-full bg-[#1a1a1a] text-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#111] to-[#1a1a1a] py-20 text-center">
        <div className="mx-auto max-w-[800px] px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Product Range
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            Premium acoustic ceiling solutions designed for performance,
            sustainability, and beauty. Explore our collection of woven frames,
            panels, and custom solutions.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1400px] gap-6 overflow-x-auto px-6 lg:px-10">
          {["All Products", "Ceiling Frames", "Wall Panels", "Custom"].map(
            (tab, i) => (
              <button
                key={tab}
                className={`shrink-0 border-b-2 py-4 text-sm font-medium transition-colors ${
                  i === 0
                    ? "border-[#e8751a] text-[#e8751a]"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div
                className={`aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br ${product.gradient} transition-transform group-hover:scale-[1.02]`}
              >
                <div className="flex h-full items-center justify-center">
                  <svg
                    className="h-20 w-20 text-white/15"
                    viewBox="0 0 48 48"
                    fill="none"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="26"
                      y="4"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="4"
                      y="26"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="26"
                      y="26"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[12px] uppercase tracking-wider text-[#e8751a]">
                  {product.category} — {product.surface}
                </p>
                <h3 className="mt-1 text-xl font-bold text-white transition-colors group-hover:text-[#e8751a]">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-white/50">
                  {product.description}
                </p>
                {memberLoggedIn && priceMap[product.id] ? (
                  <p className="mt-2 text-sm font-semibold text-[#e8751a]">
                    From ${(priceMap[product.id] / 100).toFixed(2)} AUD
                  </p>
                ) : !memberLoggedIn ? (
                  <p className="mt-2 text-xs text-white/30">
                    Login for pricing
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
