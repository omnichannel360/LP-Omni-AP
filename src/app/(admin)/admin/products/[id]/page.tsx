"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/product-form";

interface Product {
  id: string;
  name: string;
  [key: string]: unknown;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.status === 404) {
          router.push("/admin");
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch {
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
    </div>
  );
}
