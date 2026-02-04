"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface CaseStudyImage {
  id: string;
  image_url: string;
  caption: string;
}

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  thumbnail_url: string | null;
  banner_url: string | null;
  author: string;
  is_published: boolean;
  images: CaseStudyImage[];
}

export default function EditCaseStudyPage() {
  const params = useParams();
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const contentImgInputRef = useRef<HTMLInputElement>(null);

  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [images, setImages] = useState<CaseStudyImage[]>([]);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    fetch(`/api/admin/case-studies/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setCaseStudy(data);
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setAuthor(data.author || "AP Acoustic Team");
        setSummary(data.summary || "");
        setContent(data.content || "");
        setThumbnailUrl(data.thumbnail_url || "");
        setBannerUrl(data.banner_url || "");
        setIsPublished(data.is_published);
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/case-studies");
      });
  }, [params.id, router]);

  function generateSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function uploadImage(file: File, folder: string): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  }

  async function handleBannerUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading("banner");
    const url = await uploadImage(files[0], "case-studies/banners");
    if (url) setBannerUrl(url);
    setUploading("");
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  }

  async function handleThumbnailUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading("thumbnail");
    const url = await uploadImage(files[0], "case-studies/thumbnails");
    if (url) setThumbnailUrl(url);
    setUploading("");
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  }

  async function handleContentImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading("content");

    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i], "case-studies/content");
      if (url) {
        // Add to case study images list
        const res = await fetch(`/api/admin/case-studies/${params.id}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: url }),
        });
        if (res.ok) {
          const img = await res.json();
          setImages((prev) => [...prev, img]);
        }
      }
    }

    setUploading("");
    if (contentImgInputRef.current) contentImgInputRef.current.value = "";
  }

  function insertImageAtCursor(imageUrl: string, caption?: string) {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const imgMarkdown = `\n![${caption || "image"}](${imageUrl})\n`;

    const newContent =
      content.substring(0, start) + imgMarkdown + content.substring(end);
    setContent(newContent);

    // Move cursor after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPos = start + imgMarkdown.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }

  async function deleteContentImage(imageId: string) {
    const res = await fetch(
      `/api/admin/case-studies/${params.id}/images?imageId=${imageId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    }
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/case-studies/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        author,
        summary,
        content,
        thumbnailUrl,
        bannerUrl,
        isPublished,
      }),
    });

    if (res.ok) {
      setSuccess("Case study saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
  }

  // Simple markdown to HTML for preview
  function renderPreview(md: string) {
    let html = md
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#e8751a] pl-4 my-4 text-gray-400 italic">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-300">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 mb-4">')
      .replace(/\n/g, "<br>");
    return `<p class="text-gray-300 mb-4">${html}</p>`;
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white focus:border-[#e8751a] focus:outline-none";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e8751a]" />
      </div>
    );
  }

  if (!caseStudy) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/case-studies"
            className="text-sm text-gray-500 hover:text-gray-300 mb-2 inline-block"
          >
            &larr; Back to Case Studies
          </Link>
          <h1 className="text-2xl font-bold">Edit Case Study</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsPublished(!isPublished)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              isPublished
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#e8751a] px-6 py-2 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Title *</label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (slug === generateSlug(caseStudy.title)) {
                  setSlug(generateSlug(e.target.value));
                }
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Slug *</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Summary</label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Banner & Thumbnail Images */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Banner */}
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold mb-3">Banner Image</h2>
          <p className="text-xs text-gray-500 mb-3">
            Wide banner displayed at the top of the case study page.
          </p>
          {bannerUrl ? (
            <div className="relative group">
              <img
                src={bannerUrl}
                alt="Banner"
                className="w-full h-40 object-cover rounded-lg border border-white/10"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white/20 rounded text-xs text-white hover:bg-white/30"
                >
                  Replace
                </button>
                <button
                  onClick={() => setBannerUrl("")}
                  className="px-3 py-1.5 bg-red-500/30 rounded text-xs text-red-300 hover:bg-red-500/50"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[#e8751a]/30"
              onClick={() => bannerInputRef.current?.click()}
            >
              <svg className="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-xs">
                {uploading === "banner" ? "Uploading..." : "Click to upload banner"}
              </p>
            </div>
          )}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/webp,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleBannerUpload(e.target.files)}
          />
          <input
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="Or paste URL..."
            className={`mt-2 ${inputClass}`}
          />
        </div>

        {/* Thumbnail */}
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
          <h2 className="text-lg font-semibold mb-3">Thumbnail Image</h2>
          <p className="text-xs text-gray-500 mb-3">
            Shown on the case studies listing page.
          </p>
          {thumbnailUrl ? (
            <div className="relative group">
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-full h-40 object-cover rounded-lg border border-white/10"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => thumbInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white/20 rounded text-xs text-white hover:bg-white/30"
                >
                  Replace
                </button>
                <button
                  onClick={() => setThumbnailUrl("")}
                  className="px-3 py-1.5 bg-red-500/30 rounded text-xs text-red-300 hover:bg-red-500/50"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[#e8751a]/30"
              onClick={() => thumbInputRef.current?.click()}
            >
              <svg className="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-xs">
                {uploading === "thumbnail" ? "Uploading..." : "Click to upload thumbnail"}
              </p>
            </div>
          )}
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/webp,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleThumbnailUpload(e.target.files)}
          />
          <input
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="Or paste URL..."
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      {/* Content Editor + Image Panel */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Content Editor (2/3) */}
        <div className="col-span-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Content (Markdown)</h2>
            <div className="flex rounded-lg border border-white/10 overflow-hidden">
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 text-xs ${
                  activeTab === "edit"
                    ? "bg-[#e8751a] text-white"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 text-xs ${
                  activeTab === "preview"
                    ? "bg-[#e8751a] text-white"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Markdown toolbar */}
          {activeTab === "edit" && (
            <div className="flex gap-1 mb-2 border-b border-white/10 pb-2">
              <button
                onClick={() => {
                  const ta = contentRef.current;
                  if (!ta) return;
                  const s = ta.selectionStart;
                  const e = ta.selectionEnd;
                  const selected = content.substring(s, e);
                  const newContent = content.substring(0, s) + `## ${selected || "Heading"}` + content.substring(e);
                  setContent(newContent);
                }}
                className="px-2 py-1 text-xs text-gray-400 hover:bg-white/10 rounded"
                title="Heading"
              >
                H2
              </button>
              <button
                onClick={() => {
                  const ta = contentRef.current;
                  if (!ta) return;
                  const s = ta.selectionStart;
                  const e = ta.selectionEnd;
                  const selected = content.substring(s, e);
                  const newContent = content.substring(0, s) + `**${selected || "bold text"}**` + content.substring(e);
                  setContent(newContent);
                }}
                className="px-2 py-1 text-xs text-gray-400 hover:bg-white/10 rounded font-bold"
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => {
                  const ta = contentRef.current;
                  if (!ta) return;
                  const s = ta.selectionStart;
                  const newContent = content.substring(0, s) + "\n> Quote text\n" + content.substring(s);
                  setContent(newContent);
                }}
                className="px-2 py-1 text-xs text-gray-400 hover:bg-white/10 rounded"
                title="Quote"
              >
                &quot;
              </button>
              <button
                onClick={() => {
                  const ta = contentRef.current;
                  if (!ta) return;
                  const s = ta.selectionStart;
                  const newContent = content.substring(0, s) + "\n- List item\n" + content.substring(s);
                  setContent(newContent);
                }}
                className="px-2 py-1 text-xs text-gray-400 hover:bg-white/10 rounded"
                title="List"
              >
                &bull; List
              </button>
            </div>
          )}

          {activeTab === "edit" ? (
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={24}
              className={`font-mono text-xs leading-relaxed ${inputClass}`}
              placeholder="Write your case study content in Markdown..."
            />
          ) : (
            <div
              className="prose prose-invert max-w-none p-4 rounded-lg border border-white/10 bg-[#111] min-h-[400px] overflow-auto text-sm"
              dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
            />
          )}
        </div>

        {/* Image Panel (1/3) */}
        <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Content Images</h2>
            <button
              onClick={() => contentImgInputRef.current?.click()}
              disabled={!!uploading}
              className="rounded bg-[#e8751a] px-3 py-1 text-xs font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
            >
              {uploading === "content" ? "..." : "+ Upload"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Click an image to insert it at your cursor position in the content
            editor.
          </p>

          <input
            ref={contentImgInputRef}
            type="file"
            accept="image/webp,image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={(e) => handleContentImageUpload(e.target.files)}
          />

          {images.length === 0 ? (
            <div
              className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-[#e8751a]/30"
              onClick={() => contentImgInputRef.current?.click()}
            >
              <svg className="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-gray-600 text-xs">Upload content images</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group rounded-lg border border-white/10 overflow-hidden"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || "Content image"}
                    className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => insertImageAtCursor(img.image_url, img.caption)}
                    title="Click to insert at cursor"
                  />
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => insertImageAtCursor(img.image_url, img.caption)}
                      className="p-1 rounded bg-black/70 text-green-400 hover:bg-green-500/30 text-[10px]"
                      title="Insert at cursor"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteContentImage(img.id)}
                      className="p-1 rounded bg-black/70 text-red-400 hover:bg-red-500/30 text-[10px]"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-1.5 text-[10px] text-gray-500 truncate">
                    {img.image_url.split("/").pop()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
