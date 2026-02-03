"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Projects" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/account", label: "My Account" },
];

export default function ProductHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.svg"
            alt="Acoustic Panels Australia"
            width={180}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium tracking-wide text-white/80 transition-colors hover:text-[#e8751a]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-4 rounded-sm bg-[#e8751a] px-6 py-2.5 text-[13px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#d46815]"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-20 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute left-0 right-0 top-20 z-50 border-b border-white/10 bg-[#111111] px-6 py-6 lg:hidden">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-[15px] font-medium text-white/90 transition-colors hover:text-[#e8751a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-white/10 pt-4">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="inline-block rounded-sm bg-[#e8751a] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#d46815]"
              >
                Contact Us
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
