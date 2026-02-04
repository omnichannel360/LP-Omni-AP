"use client";

import { useEffect, useState } from "react";

interface SampleRequest {
  id: string;
  request_number: string;
  product_name: string;
  selected_colorways: { code: string; name: string; hex: string }[];
  status: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_city: string;
  shipping_state: string;
  created_at: string;
  members?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminSamplesPage() {
  const [requests, setRequests] = useState<SampleRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/samples")
      .then((r) => r.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/samples/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Sample Requests</h1>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg border border-white/10 bg-[#0a0a0a]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sample Requests</h1>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
          No sample requests yet.
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                <th className="px-4 py-3 font-medium">Request #</th>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Colors</th>
                <th className="px-4 py-3 font-medium">Ship To</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs text-[#e8751a]">
                    {req.request_number}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white">
                      {req.members?.first_name} {req.members?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {req.members?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-white">
                    {req.product_name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {req.selected_colorways?.map((cw) => (
                        <div
                          key={cw.code}
                          className="h-6 w-6 rounded-sm border border-white/20"
                          style={{ backgroundColor: cw.hex }}
                          title={`${cw.name} (${cw.code})`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {req.shipping_city}, {req.shipping_state}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        statusColors[req.status] || ""
                      } bg-transparent cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
