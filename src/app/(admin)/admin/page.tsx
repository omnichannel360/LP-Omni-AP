"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  surface: string;
  status: string;
  created_at: string;
  sort_order: number;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e8751a]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 bg-[#e8751a] hover:bg-[#d46815] text-white text-sm font-medium rounded-lg transition-colors"
          >
            + Add Product
          </Link>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-medium rounded-lg transition-colors border border-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-white/10">
          <p className="text-gray-500 text-lg mb-4">No products yet</p>
          <Link
            href="/admin/products/new"
            className="inline-block px-6 py-3 bg-[#e8751a] hover:bg-[#d46815] text-white rounded-lg transition-colors"
          >
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Surface
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        /{product.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {product.surface}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="px-3 py-1.5 text-xs text-[#e8751a] hover:text-[#d46815] bg-[#e8751a]/10 hover:bg-[#e8751a]/20 rounded-md transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
