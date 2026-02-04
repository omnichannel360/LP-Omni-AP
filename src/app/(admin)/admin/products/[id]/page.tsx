"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/product-form";
import VariantPricingForm from "@/components/admin/variant-pricing-form";

interface Product {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface Variant {
  id: string;
  thickness: string;
  size: string;
  face_color: string;
  colorway_code: string | null;
  sku: string | null;
  price_cents: number;
  is_available: boolean;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, variantsRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch(`/api/admin/variants?productId=${params.id}`),
        ]);

        if (productRes.status === 404) {
          router.push("/admin");
          return;
        }

        const productData = await productRes.json();
        setProduct(productData);

        if (variantsRes.ok) {
          const variantsData = await variantsRes.json();
          setVariants(Array.isArray(variantsData) ? variantsData : []);
        }
      } catch {
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e8751a]" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit: {product.name}</h1>
      <ProductForm initialData={product} />

      {/* Variant Pricing Section */}
      <div className="mt-12 border-t border-white/10 pt-10">
        <VariantPricingForm
          productId={product.id}
          productName={product.name}
          variants={variants}
          embedded
        />
      </div>
    </div>
  );
}
