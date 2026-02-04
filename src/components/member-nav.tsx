"use client";

import { useState } from "react";
import Link from "next/link";

interface MemberNavProps {
  firstName: string;
  lastName: string;
  pointsBalance: number;
}

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/member/dashboard", label: "Dashboard" },
  { href: "/member/orders", label: "Orders" },
  { href: "/member/rewards", label: "Rewards" },
  { href: "/member/cart", label: "Order Cart" },
  { href: "/member/samples", label: "Sample Cart" },
];

export default function MemberNav({
  firstName,
  lastName,
  pointsBalance,
}: MemberNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#e8751a]">
          AP Acoustic
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <span className="text-sm text-[#e8751a]">
              {firstName} {lastName}
            </span>
            <span className="rounded-full bg-[#e8751a]/10 px-2 py-0.5 text-xs text-[#e8751a]">
              {pointsBalance} pts
            </span>
            <form action="/api/member/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-gray-400 transition-colors hover:text-red-400"
              >
                Logout
              </button>
            </form>
          </div>
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            /* X icon */
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <nav className="border-t border-white/10 px-4 pb-4 pt-2 sm:px-6 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <span className="text-sm text-[#e8751a]">
                {firstName} {lastName}
              </span>
              <span className="rounded-full bg-[#e8751a]/10 px-2 py-0.5 text-xs text-[#e8751a]">
                {pointsBalance} pts
              </span>
            </div>
            <form action="/api/member/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-red-400"
              >
                Logout
              </button>
            </form>
          </div>
        </nav>
      )}
    </header>
  );
}
