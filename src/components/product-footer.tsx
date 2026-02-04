import Link from "next/link";
import Image from "next/image";

export default function ProductFooter() {
  return (
    <footer className="bg-[#111111] border-t border-white/10">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#1a1a1a] via-[#e8751a]/10 to-[#1a1a1a] py-16 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Let us help you get started
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          Transform your space with premium acoustic solutions tailored to your needs.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-sm border-2 border-[#e8751a] bg-transparent px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-[#e8751a] transition-colors hover:bg-[#e8751a] hover:text-white"
        >
          Request a Quote
        </Link>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/images/logo.webp"
              alt="Acoustic Panels Australia"
              width={160}
              height={44}
              className="mb-6 h-10 w-auto"
            />
            <p className="mb-4 text-sm text-white/60">
              Sign up for our newsletter for products, project updates, and more.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-sm border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#e8751a] focus:outline-none"
              />
              <button className="rounded-sm bg-[#e8751a] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#d46815]">
                Subscribe
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#e8751a]">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Order Samples
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Talk to an Expert
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#e8751a]">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="transition-colors hover:text-white">
                  Design + Manufacturing
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#e8751a]">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/products" className="transition-colors hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="transition-colors hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="transition-colors hover:text-white">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; 2025 Acoustic Panels Australia. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-[#e8751a] hover:text-[#e8751a]"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-[#e8751a] hover:text-[#e8751a]"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-[#e8751a] hover:text-[#e8751a]"
              aria-label="Pinterest"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z"/>
              </svg>
            </a>
          </div>

          <Link href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
