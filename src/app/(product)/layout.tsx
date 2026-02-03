import ProductHeader from "@/components/product-header";
import ProductFooter from "@/components/product-footer";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProductHeader />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <ProductFooter />
    </>
  );
}
