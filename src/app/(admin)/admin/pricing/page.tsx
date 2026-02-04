import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function AdminPricing() {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, name, category, slug")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  // Get variant counts per product
  const { data: variants } = await supabaseAdmin
    .from("product_variants")
    .select("product_id");

  const countMap: Record<string, number> = {};
  (variants || []).forEach((v) => {
    countMap[v.product_id] = (countMap[v.product_id] || 0) + 1;
  });

  const items = products || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Pricing Management</h1>
        <p className="text-gray-400 text-sm mt-1">
          Set variant pricing for each product
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/admin/pricing/${product.id}`}
            className="group rounded-xl border border-white/10 bg-[#0a0a0a] p-6 hover:border-[#e8751a]/30 transition-colors"
          >
            <p className="text-xs uppercase tracking-wider text-[#e8751a] mb-1">
              {product.category}
            </p>
            <h3 className="text-lg font-bold text-white group-hover:text-[#e8751a] transition-colors">
              {product.name}
            </h3>
            <p className="mt-3 text-sm text-gray-400">
              {countMap[product.id] || 0} variant
              {(countMap[product.id] || 0) !== 1 ? "s" : ""} configured
            </p>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No active products. Create products first.
        </div>
      )}
    </div>
  );
}
