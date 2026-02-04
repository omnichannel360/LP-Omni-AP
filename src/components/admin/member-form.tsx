"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MemberFormProps {
  member?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company: string | null;
    phone: string | null;
    discount_percent: number;
    is_active: boolean;
    points_balance: number;
  };
}

export default function MemberForm({ member }: MemberFormProps) {
  const router = useRouter();
  const isEditing = !!member;

  const [email, setEmail] = useState(member?.email || "");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(member?.first_name || "");
  const [lastName, setLastName] = useState(member?.last_name || "");
  const [company, setCompany] = useState(member?.company || "");
  const [phone, setPhone] = useState(member?.phone || "");
  const [discountPercent, setDiscountPercent] = useState(
    member?.discount_percent?.toString() || "0"
  );
  const [pointsBalance, setPointsBalance] = useState(
    member?.points_balance?.toString() || "0"
  );
  const [isActive, setIsActive] = useState(member?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/members/${member.id}`
        : "/api/admin/members";

      const body = isEditing
        ? {
            firstName,
            lastName,
            company,
            phone,
            discountPercent: parseFloat(discountPercent) || 0,
            pointsBalance: parseInt(pointsBalance) || 0,
            isActive,
          }
        : {
            email,
            password,
            firstName,
            lastName,
            company,
            phone,
            discountPercent: parseFloat(discountPercent) || 0,
          };

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save member");
        return;
      }

      router.push("/admin/members");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            First Name *
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Last Name *
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Email *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isEditing}
          className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none disabled:opacity-50"
        />
      </div>

      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Company
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Discount (%)
        </label>
        <input
          type="number"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          min="0"
          max="100"
          step="0.01"
          className="w-full max-w-[200px] rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Member-specific discount. Applied if higher than global discount.
        </p>
      </div>

      {isEditing && (
        <div className="flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-gray-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#e8751a] peer-checked:after:translate-x-full" />
          </label>
          <span className="text-sm text-gray-300">Active</span>
        </div>
      )}

      {isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Points Balance
          </label>
          <input
            type="number"
            value={pointsBalance}
            onChange={(e) => setPointsBalance(e.target.value)}
            min="0"
            step="1"
            className="w-full max-w-[200px] rounded-lg border border-white/10 bg-[#111] px-4 py-2.5 text-white focus:border-[#e8751a] focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Manually adjust the member&apos;s loyalty points.
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#e8751a] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEditing
            ? "Update Member"
            : "Create Member"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/members")}
          className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-gray-300 hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
