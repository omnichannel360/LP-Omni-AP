"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface GalleryImage {
  id?: string;
  image_url: string;
  caption: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  gallery: GalleryImage[];
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  useEffect(() => {
    fetch(`/api/admin/projects/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setProject(data);
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setSummary(data.summary || "");
        setDescription(data.description || "");
        setThumbnailUrl(data.thumbnail_url || "");
        setIsPublished(data.is_published);
        setGallery(
          (data.gallery || []).map((g: GalleryImage) => ({
            id: g.id,
            image_url: g.image_url,
            caption: g.caption || "",
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/projects");
      });
  }, [params.id, router]);

  function generateSlug(t: string) {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "projects");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newImages: GalleryImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      if (url) {
        newImages.push({ image_url: url, caption: "" });
      }
    }

    setGallery((prev) => [...prev, ...newImages]);

    // Auto-set thumbnail to first image if none set
    if (!thumbnailUrl && newImages.length > 0) {
      setThumbnailUrl(newImages[0].image_url);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(idx: number) {
    const removed = gallery[idx];
    setGallery((prev) => prev.filter((_, i) => i !== idx));
    // If removed image was thumbnail, clear it
    if (removed.image_url === thumbnailUrl) {
      setThumbnailUrl("");
    }
  }

  function moveImage(idx: number, direction: "up" | "down") {
    setGallery((prev) => {
      const arr = [...prev];
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return arr;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr;
    });
  }

  function updateCaption(idx: number, caption: string) {
    setGallery((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, caption } : img))
    );
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/projects/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        summary,
        description,
        thumbnailUrl,
        isPublished,
        gallery: gallery.map((g) => ({
          image_url: g.image_url,
          caption: g.caption,
        })),
      }),
    });

    if (res.ok) {
      setSuccess("Project saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    }
    setSaving(false);
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

  if (!project) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/projects"
            className="text-sm text-gray-500 hover:text-gray-300 mb-2 inline-block"
          >
            &larr; Back to Projects
          </Link>
          <h1 className="text-2xl font-bold">Edit Project</h1>
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
                if (slug === generateSlug(project.title)) {
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
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Description (full content)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className={inputClass}
          />
        </div>
      </div>

      {/* Image Gallery */}
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Project Images</h2>
            <p className="text-xs text-gray-500 mt-1">
              Upload images and select one as the thumbnail for the gallery
              tiles.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-[#e8751a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d06815] disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "+ Upload Images"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/webp,image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </div>

        {gallery.length === 0 ? (
          <div
            className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center cursor-pointer hover:border-[#e8751a]/30"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              className="w-12 h-12 mx-auto text-gray-600 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">
              Click to upload project images
            </p>
            <p className="text-gray-600 text-xs mt-1">
              PNG, JPG, WebP up to 5MB each
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                className={`relative group rounded-xl border-2 overflow-hidden ${
                  img.image_url === thumbnailUrl
                    ? "border-[#e8751a]"
                    : "border-white/10"
                }`}
              >
                {/* Thumbnail badge */}
                {img.image_url === thumbnailUrl && (
                  <div className="absolute top-2 left-2 z-10 bg-[#e8751a] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    THUMBNAIL
                  </div>
                )}

                {/* Image */}
                <div className="aspect-video bg-black/50">
                  <img
                    src={img.image_url}
                    alt={img.caption || `Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Controls overlay */}
                <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setThumbnailUrl(img.image_url)}
                    title="Set as thumbnail"
                    className="p-1.5 rounded bg-black/70 text-white hover:bg-[#e8751a] text-xs"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveImage(idx, "up")}
                    disabled={idx === 0}
                    title="Move left"
                    className="p-1.5 rounded bg-black/70 text-white hover:bg-white/20 disabled:opacity-30 text-xs"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveImage(idx, "down")}
                    disabled={idx === gallery.length - 1}
                    title="Move right"
                    className="p-1.5 rounded bg-black/70 text-white hover:bg-white/20 disabled:opacity-30 text-xs"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeImage(idx)}
                    title="Remove"
                    className="p-1.5 rounded bg-black/70 text-red-400 hover:bg-red-500/30 text-xs"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Caption */}
                <div className="p-2">
                  <input
                    value={img.caption}
                    onChange={(e) => updateCaption(idx, e.target.value)}
                    placeholder="Add caption..."
                    className="w-full bg-transparent text-xs text-gray-400 border-0 outline-none focus:text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
            ))}

            {/* Upload more card */}
            <div
              className="aspect-video border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#e8751a]/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto text-gray-600 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-xs text-gray-600">Add more</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail URL (manual override) */}
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Thumbnail URL (Manual Override)
        </h2>
        <p className="text-xs text-gray-500 mb-2">
          You can also click the checkmark on any gallery image to set it as the
          thumbnail, or paste a URL here.
        </p>
        <div className="flex gap-3">
          <input
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://..."
            className={`flex-1 ${inputClass}`}
          />
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Thumbnail preview"
              className="w-16 h-16 rounded-lg object-cover border border-white/10"
            />
          )}
        </div>
      </div>
    </div>
  );
}
