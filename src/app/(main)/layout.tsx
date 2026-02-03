import Sidebar from "@/components/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <main className="main-content h-screen overflow-y-auto pt-16 lg:ml-[260px] lg:pt-0">
        {children}
      </main>
    </>
  );
}
