"use client";

import { useEffect, useState } from "react";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  author: string;
  is_published: boolean;
  published_at: string;
}

export default function AdminCaseStudies() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("AP Acoustic Team");

  useEffect(() => {
    fetch("/api/admin/case-studies")
      .then((r) => r.json())
      .then((d) => { setStudies(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function generateSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function addStudy(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/case-studies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, summary, content, author }),
    });
    if (res.ok) {
      const s = await res.json();
      setStudies((prev) => [s, ...prev]);
      setTitle(""); setSlug(""); setSummary(""); setContent(""); setAuthor("AP Acoustic Team");
      setShowAdd(false);
      setSuccess("Case study created");
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  }

  async function togglePublish(id: string, current: boolean) {
    const res = await fetch(`/api/admin/case-studies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    if (res.ok) {
      setStudies((prev) => prev.map((s) => (s.id === id ? { ...s, is_published: !current } : s)));
    }
  }

  async function deleteStudy(id: string) {
    if (!confirm("Delete this case study?")) return;
    const res = await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
    if (res.ok) setStudies((prev) => prev.filter((s) => s.id !== id));
  }

  const inputClass = "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:border-[#e8751a] focus:outline-none";

  if (loading) return <div><h1 className="text-2xl font-bold">Case Studies</h1><p className="text-gray-500 mt-4">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Case Studies</h1>
          <p className="text-gray-400 text-sm mt-1">Manage blog-style case study articles</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="rounded-lg bg-[#e8751a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d06815]">
          + New Case Study
        </button>
      </div>

      {success && <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">{success}</div>}

      {showAdd && (
        <form onSubmit={addStudy} className="mb-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Author</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Summary</label>
              <input value={summary} onChange={(e) => setSummary(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Content (Markdown)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="## Section heading..." className={inputClass} />
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
              <th className="px-4 py-3 text-left font-medium text-gray-400">Author</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">Published</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white font-medium max-w-xs truncate">{s.title}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{s.author}</td>
                <td className="px-4 py-3 text-center text-gray-500 text-xs">
                  {new Date(s.published_at).toLocaleDateString("en-AU")}
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => togglePublish(s.id, s.is_published)} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.is_published ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {s.is_published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteStudy(s.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
