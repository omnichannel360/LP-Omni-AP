import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function AdminMembers() {
  const { data: members } = await supabaseAdmin
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  const items = members || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-gray-400 text-sm mt-1">
            {items.length} member{items.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Link
          href="/admin/members/new"
          className="rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]"
        >
          + Add Member
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">
                Company
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Discount
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Points
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No members yet. Click &quot;Add Member&quot; to create one.
                </td>
              </tr>
            ) : (
              items.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-white font-medium">
                    {m.first_name} {m.last_name}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{m.email}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {m.company || "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">
                    {Number(m.discount_percent) > 0
                      ? `${m.discount_percent}%`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[#e8751a] font-medium">
                      {m.points_balance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        m.is_active
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {m.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="text-[#e8751a] hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
