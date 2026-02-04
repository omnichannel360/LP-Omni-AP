import { getMemberSession } from "@/lib/member-auth";
import Link from "next/link";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getMemberSession();

  // Not logged in — show only the login page wrapper
  if (!session) {
    return (
      <div className="min-h-screen bg-[#111] text-white">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Member Navigation Bar */}
      <header className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-[#e8751a]">
            AP Acoustic
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link
              href="/member/dashboard"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/member/orders"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/member/rewards"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Rewards
            </Link>
            <Link
              href="/member/samples"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Samples
            </Link>
            <Link
              href="/member/cart"
              className="relative text-sm text-gray-300 hover:text-white transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </Link>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <span className="text-sm text-[#e8751a]">
                {session.firstName} {session.lastName}
              </span>
              <span className="rounded-full bg-[#e8751a]/10 px-2 py-0.5 text-xs text-[#e8751a]">
                {session.pointsBalance} pts
              </span>
              <form action="/api/member/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
