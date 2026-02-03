import ProductHeader from "@/components/product-header";
import ProductFooter from "@/components/product-footer";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="product-scroll h-screen overflow-y-auto">
      <ProductHeader />
      <main className="pt-20">
        {children}
      </main>
      <ProductFooter />
    </div>
  );
}
