import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import VariantPricingForm from "@/components/admin/variant-pricing-form";

export const revalidate = 0;

export default async function ProductPricing({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id, name")
    .eq("id", productId)
    .single();

  if (!product) {
    notFound();
  }

  const { data: variants } = await supabaseAdmin
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("thickness")
    .order("size")
    .order("face_color");

  return (
    <VariantPricingForm
      productId={product.id}
      productName={product.name}
      variants={variants || []}
    />
  );
}
