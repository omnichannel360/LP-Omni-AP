import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acoustic Panels Australia",
  description: "Premium acoustic solutions for commercial and residential spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar />
        {/* Main content offset by sidebar width on desktop */}
        <main className="main-content h-screen overflow-y-auto pt-16 lg:ml-[260px] lg:pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
