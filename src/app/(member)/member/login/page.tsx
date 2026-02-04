"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MemberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/member/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/member/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111]">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-white/10 bg-[#1a1a1a] p-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-[#e8751a]">
            AP Acoustic
          </Link>
          <h2 className="mt-4 text-xl font-semibold text-white">
            Member Login
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access pricing, ordering, and rewards
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-white placeholder-gray-500 focus:border-[#e8751a] focus:outline-none focus:ring-1 focus:ring-[#e8751a]"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-white placeholder-gray-500 focus:border-[#e8751a] focus:outline-none focus:ring-1 focus:ring-[#e8751a]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#e8751a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d06815] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/contact" className="text-[#e8751a] hover:underline">
            Contact us
          </Link>{" "}
          to request access.
        </p>
      </div>
    </div>
  );
}
