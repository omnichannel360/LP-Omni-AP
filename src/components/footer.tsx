import Link from "next/link";

const footerLinks = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/contact", label: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-white">
              LP-Omni-AP
            </Link>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Your tagline goes here.
            </p>
          </div>

          {/* Links */}
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-400 dark:border-zinc-800">
          &copy; {new Date().getFullYear()} LP-Omni-AP. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
