"use client";

import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  position: number;
  is_visible: boolean;
  open_in_new_tab: boolean;
}

export default function AdminNavigation() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");

  useEffect(() => {
    fetch("/api/admin/navigation")
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function updateItem(id: string, field: string, value: unknown) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function moveItem(id: string, direction: "up" | "down") {
    setItems((prev) => {
      const sorted = [...prev].sort((a, b) => a.position - b.position);
      const idx = sorted.findIndex((i) => i.id === id);
      if (direction === "up" && idx > 0) {
        const temp = sorted[idx].position;
        sorted[idx].position = sorted[idx - 1].position;
        sorted[idx - 1].position = temp;
      } else if (direction === "down" && idx < sorted.length - 1) {
        const temp = sorted[idx].position;
        sorted[idx].position = sorted[idx + 1].position;
        sorted[idx + 1].position = temp;
      }
      return sorted.sort((a, b) => a.position - b.position);
    });
  }

  async function saveAll() {
    setSaving(true);
    const res = await fetch("/api/admin/navigation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (res.ok) {
      setSuccess("Navigation saved");
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  }

  async function addItem() {
    if (!newLabel || !newHref) return;
    const res = await fetch("/api/admin/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newLabel,
        href: newHref,
        position: items.length + 1,
      }),
    });
    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewLabel("");
      setNewHref("");
      setShowAdd(false);
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    const res = await fetch(`/api/admin/navigation/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:border-[#e8751a] focus:outline-none";

  if (loading) return <div><h1 className="text-2xl font-bold mb-6">Navigation Menu</h1><p className="text-gray-500">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Navigation Menu</h1>
          <p className="text-gray-400 text-sm mt-1">Manage sidebar and header navigation links</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAdd(!showAdd)} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
            + Add Link
          </button>
          <button onClick={saveAll} disabled={saving} className="rounded-lg bg-[#e8751a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50">
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">{success}</div>
      )}

      {showAdd && (
        <div className="mb-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-5 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Label</label>
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Blog" className={inputClass} />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">URL</label>
            <input value={newHref} onChange={(e) => setNewHref(e.target.value)} placeholder="e.g. /blog" className={inputClass} />
          </div>
          <button onClick={addItem} className="rounded-lg bg-[#e8751a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d06815]">Add</button>
        </div>
      )}

      <div className="space-y-2">
        {items.sort((a, b) => a.position - b.position).map((item, idx) => (
          <div key={item.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] px-5 py-4">
            {/* Reorder buttons */}
            <div className="flex flex-col gap-1">
              <button onClick={() => moveItem(item.id, "up")} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </button>
              <button onClick={() => moveItem(item.id, "down")} disabled={idx === items.length - 1} className="text-gray-500 hover:text-white disabled:opacity-20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            {/* Label */}
            <input
              value={item.label}
              onChange={(e) => updateItem(item.id, "label", e.target.value)}
              className="w-40 rounded border border-white/10 bg-transparent px-2 py-1 text-sm text-white focus:border-[#e8751a] focus:outline-none"
            />

            {/* URL */}
            <input
              value={item.href}
              onChange={(e) => updateItem(item.id, "href", e.target.value)}
              className="flex-1 rounded border border-white/10 bg-transparent px-2 py-1 text-sm text-gray-400 focus:border-[#e8751a] focus:outline-none"
            />

            {/* Visible toggle */}
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={item.is_visible}
                onChange={(e) => updateItem(item.id, "is_visible", e.target.checked)}
                className="accent-[#e8751a]"
              />
              Visible
            </label>

            {/* Delete */}
            <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
