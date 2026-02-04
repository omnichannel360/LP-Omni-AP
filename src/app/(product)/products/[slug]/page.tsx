import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import ProductDetail from "./product-detail";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch product by slug
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch designs for this product
  const { data: designs } = await supabaseAdmin
    .from("designs")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  return (
    <ProductDetail
      product={product}
      designs={designs || []}
    />
  );
}
