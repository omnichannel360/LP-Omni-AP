"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  position: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => { setProjects(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function generateSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, summary }),
    });
    if (res.ok) {
      const p = await res.json();
      setProjects((prev) => [...prev, p]);
      setTitle(""); setSlug(""); setSummary("");
      setShowAdd(false);
      setSuccess("Project created");
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  }

  async function togglePublish(id: string, current: boolean) {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    if (res.ok) {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, is_published: !current } : p)));
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  const inputClass = "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:border-[#e8751a] focus:outline-none";

  if (loading) return <div><h1 className="text-2xl font-bold">Projects</h1><p className="text-gray-500 mt-4">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Manage project gallery entries</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]">
          + Add Project
        </button>
      </div>

      {success && <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">{success}</div>}

      {showAdd && (
        <form onSubmit={addProject} className="mb-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input value={title} onChange={(e) => { setTitle(e.target.value); setSlug(generateSlug(e.target.value)); }} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Slug *</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-[#e8751a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50">
              {saving ? "Creating..." : "Create"}
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-white/10 px-5 py-2 text-sm text-gray-300 hover:bg-white/5">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-left font-medium text-gray-400">Title</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">Slug</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white font-medium">{p.title}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">/gallery/{p.slug}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => togglePublish(p.id, p.is_published)} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.is_published ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {p.is_published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteProject(p.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
