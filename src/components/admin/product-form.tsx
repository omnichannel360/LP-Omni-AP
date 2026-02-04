"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Design {
  design_key: string;
  label: string;
  title: string;
  description: string;
  hero_images: { url: string; caption: string }[];
}

interface Colorway {
  name: string;
  code: string;
  hex: string;
}

interface Spec {
  label: string;
  value: string;
}

interface HowToStep {
  step: number;
  title: string;
  description: string;
}

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  category: string;
  surface: string;
  description: string;
  gradient: string;
  status: string;
  breadcrumb_category: string;
  breadcrumb_type: string;
  breadcrumb_series: string;
  breadcrumb_availability: string;
  colorways: Colorway[];
  specs: Spec[];
  resources: string[];
  resource_links: { type: string; label: string }[];
  build_thicknesses: string[];
  build_sizes: string[];
  build_face_colors: string[];
  sustainability_content: string;
  custom_content: string;
  custom_button_text: string;
  custom_button_link: string;
  how_to_specify: HowToStep[];
  related_product_ids: string[];
  sort_order: number;
  designs?: Design[];
}

const defaultProduct: ProductData = {
  name: "",
  slug: "",
  category: "",
  surface: "",
  description: "",
  gradient: "from-amber-900/40 to-stone-900/60",
  status: "active",
  breadcrumb_category: "",
  breadcrumb_type: "",
  breadcrumb_series: "",
  breadcrumb_availability: "",
  colorways: [],
  specs: [],
  resources: [],
  resource_links: [],
  build_thicknesses: [],
  build_sizes: [],
  build_face_colors: [],
  sustainability_content: "",
  custom_content: "",
  custom_button_text: "Talk to Us",
  custom_button_link: "/contact",
  how_to_specify: [
    { step: 1, title: "", description: "" },
    { step: 2, title: "", description: "" },
    { step: 3, title: "", description: "" },
  ],
  related_product_ids: [],
  sort_order: 0,
  designs: [],
};

export default function ProductForm({
  initialData,
}: {
  initialData?: Record<string, unknown>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const merged = initialData
    ? { ...defaultProduct, ...initialData }
    : defaultProduct;

  const [form, setForm] = useState<ProductData>(merged as ProductData);

  const updateField = useCallback(
    (field: keyof ProductData, value: unknown) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const autoSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, []);

  const handleSave = async () => {
    setError("");
    setSaving(true);

    try {
      const isEdit = !!form.id;
      const url = isEdit ? `/api/products/${form.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    file: File,
    folder: string
  ): Promise<{ url: string; storage_path: string } | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "designs", label: "Designs" },
    { id: "colorways", label: "Colorways" },
    { id: "specs", label: "Specifications" },
    { id: "resources", label: "Resources" },
    { id: "build", label: "Build Options" },
    { id: "content", label: "Content" },
    { id: "howto", label: "How to Specify" },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-[#0a0a0a] rounded-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-[#e8751a] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6">
        {/* BASIC INFO */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <SectionTitle>Basic Information</SectionTitle>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Product Name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    updateField("name", e.target.value);
                    if (!form.id) {
                      updateField("slug", autoSlug(e.target.value));
                    }
                  }}
                  className="input"
                  placeholder="e.g. Woven Ceiling Frames"
                />
              </Field>
              <Field label="Slug">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className="input"
                  placeholder="auto-generated-from-name"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="input"
                  placeholder="e.g. Woven, Frames, Panels"
                />
              </Field>
              <Field label="Surface">
                <input
                  type="text"
                  value={form.surface}
                  onChange={(e) => updateField("surface", e.target.value)}
                  className="input"
                  placeholder="e.g. Ceiling Frames, Wall"
                />
              </Field>
            </div>

            <Field label="Short Description">
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="input h-24 resize-none"
                placeholder="Brief product description for listing cards"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="input"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </Field>
              <Field label="Sort Order">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    updateField("sort_order", parseInt(e.target.value) || 0)
                  }
                  className="input"
                />
              </Field>
            </div>

            <Field label="Card Gradient (Tailwind classes)">
              <input
                type="text"
                value={form.gradient}
                onChange={(e) => updateField("gradient", e.target.value)}
                className="input"
                placeholder="from-amber-900/40 to-stone-900/60"
              />
            </Field>

            <SectionTitle>Breadcrumbs</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <input
                  type="text"
                  value={form.breadcrumb_category}
                  onChange={(e) =>
                    updateField("breadcrumb_category", e.target.value)
                  }
                  className="input"
                  placeholder="e.g. Ceiling"
                />
              </Field>
              <Field label="Type">
                <input
                  type="text"
                  value={form.breadcrumb_type}
                  onChange={(e) =>
                    updateField("breadcrumb_type", e.target.value)
                  }
                  className="input"
                  placeholder="e.g. Frames"
                />
              </Field>
              <Field label="Series">
                <input
                  type="text"
                  value={form.breadcrumb_series}
                  onChange={(e) =>
                    updateField("breadcrumb_series", e.target.value)
                  }
                  className="input"
                  placeholder="e.g. Woven"
                />
              </Field>
              <Field label="Availability">
                <input
                  type="text"
                  value={form.breadcrumb_availability}
                  onChange={(e) =>
                    updateField("breadcrumb_availability", e.target.value)
                  }
                  className="input"
                  placeholder="e.g. Premier, WoodGrain"
                />
              </Field>
            </div>
          </div>
        )}

        {/* DESIGNS */}
        {activeTab === "designs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionTitle>Designs</SectionTitle>
              <button
                onClick={() =>
                  updateField("designs", [
                    ...(form.designs || []),
                    {
                      design_key: "",
                      label: "",
                      title: "",
                      description: "",
                      hero_images: [],
                    },
                  ])
                }
                className="btn-secondary"
              >
                + Add Design
              </button>
            </div>

            {(form.designs || []).map((design, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#111] rounded-lg border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#e8751a]">
                    Design #{idx + 1}
                  </span>
                  <button
                    onClick={() =>
                      updateField(
                        "designs",
                        (form.designs || []).filter((_, i) => i !== idx)
                      )
                    }
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Key">
                    <input
                      type="text"
                      value={design.design_key}
                      onChange={(e) => {
                        const updated = [...(form.designs || [])];
                        updated[idx] = {
                          ...updated[idx],
                          design_key: e.target.value,
                        };
                        updateField("designs", updated);
                      }}
                      className="input"
                      placeholder="e.g. buffalo"
                    />
                  </Field>
                  <Field label="Label">
                    <input
                      type="text"
                      value={design.label}
                      onChange={(e) => {
                        const updated = [...(form.designs || [])];
                        updated[idx] = {
                          ...updated[idx],
                          label: e.target.value,
                        };
                        updateField("designs", updated);
                      }}
                      className="input"
                      placeholder="e.g. Buffalo"
                    />
                  </Field>
                </div>
                <Field label="Title">
                  <input
                    type="text"
                    value={design.title}
                    onChange={(e) => {
                      const updated = [...(form.designs || [])];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      updateField("designs", updated);
                    }}
                    className="input"
                    placeholder="e.g. Woven, Buffalo"
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    value={design.description}
                    onChange={(e) => {
                      const updated = [...(form.designs || [])];
                      updated[idx] = {
                        ...updated[idx],
                        description: e.target.value,
                      };
                      updateField("designs", updated);
                    }}
                    className="input h-20 resize-none"
                  />
                </Field>

                {/* Hero Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">
                      Hero Images
                    </label>
                    <label className="btn-secondary text-xs cursor-pointer">
                      Upload Image
                      <input
                        type="file"
                        accept="image/webp,image/jpeg,image/png"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const result = await handleImageUpload(
                            file,
                            `products/${form.slug || "temp"}/hero`
                          );
                          if (result) {
                            const updated = [...(form.designs || [])];
                            updated[idx] = {
                              ...updated[idx],
                              hero_images: [
                                ...updated[idx].hero_images,
                                { url: result.url, caption: "" },
                              ],
                            };
                            updateField("designs", updated);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {design.hero_images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {design.hero_images.map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="relative group rounded-lg overflow-hidden bg-black/20"
                        >
                          <img
                            src={img.url}
                            alt={img.caption || "Hero"}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            onClick={() => {
                              const updated = [...(form.designs || [])];
                              updated[idx] = {
                                ...updated[idx],
                                hero_images: updated[idx].hero_images.filter(
                                  (_, i) => i !== imgIdx
                                ),
                              };
                              updateField("designs", updated);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(form.designs || []).length === 0 && (
              <p className="text-gray-600 text-sm text-center py-8">
                No designs added yet. Click &quot;+ Add Design&quot; to get
                started.
              </p>
            )}
          </div>
        )}

        {/* COLORWAYS */}
        {activeTab === "colorways" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Colorways</SectionTitle>
              <button
                onClick={() =>
                  updateField("colorways", [
                    ...form.colorways,
                    { name: "", code: "", hex: "#888888" },
                  ])
                }
                className="btn-secondary"
              >
                + Add Color
              </button>
            </div>

            {form.colorways.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_100px_40px] gap-2 text-xs text-gray-500 px-1">
                  <span>Name</span>
                  <span>Code</span>
                  <span>Color</span>
                  <span />
                </div>
                {form.colorways.map((cw, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_1fr_100px_40px] gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={cw.name}
                      onChange={(e) => {
                        const updated = [...form.colorways];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        updateField("colorways", updated);
                      }}
                      className="input text-sm"
                      placeholder="Pure Oak"
                    />
                    <input
                      type="text"
                      value={cw.code}
                      onChange={(e) => {
                        const updated = [...form.colorways];
                        updated[idx] = { ...updated[idx], code: e.target.value };
                        updateField("colorways", updated);
                      }}
                      className="input text-sm"
                      placeholder="PO-001"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cw.hex}
                        onChange={(e) => {
                          const updated = [...form.colorways];
                          updated[idx] = { ...updated[idx], hex: e.target.value };
                          updateField("colorways", updated);
                        }}
                        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs text-gray-500">{cw.hex}</span>
                    </div>
                    <button
                      onClick={() =>
                        updateField(
                          "colorways",
                          form.colorways.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            {form.colorways.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-8">
                No colorways added yet.
              </p>
            )}
          </div>
        )}

        {/* SPECIFICATIONS */}
        {activeTab === "specs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Specifications</SectionTitle>
              <button
                onClick={() =>
                  updateField("specs", [
                    ...form.specs,
                    { label: "", value: "" },
                  ])
                }
                className="btn-secondary"
              >
                + Add Spec
              </button>
            </div>

            {form.specs.map((spec, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_40px] gap-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => {
                    const updated = [...form.specs];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    updateField("specs", updated);
                  }}
                  className="input text-sm"
                  placeholder="Label (e.g. Material)"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => {
                    const updated = [...form.specs];
                    updated[idx] = { ...updated[idx], value: e.target.value };
                    updateField("specs", updated);
                  }}
                  className="input text-sm"
                  placeholder="Value (e.g. PET Felt)"
                />
                <button
                  onClick={() =>
                    updateField(
                      "specs",
                      form.specs.filter((_, i) => i !== idx)
                    )
                  }
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  x
                </button>
              </div>
            ))}

            {form.specs.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-8">
                No specifications added yet.
              </p>
            )}
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === "resources" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Resources</SectionTitle>
              <button
                onClick={() =>
                  updateField("resources", [...form.resources, ""])
                }
                className="btn-secondary"
              >
                + Add Resource
              </button>
            </div>

            {form.resources.map((res, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_40px] gap-2">
                <input
                  type="text"
                  value={res}
                  onChange={(e) => {
                    const updated = [...form.resources];
                    updated[idx] = e.target.value;
                    updateField("resources", updated);
                  }}
                  className="input text-sm"
                  placeholder="e.g. Specification Sheet"
                />
                <button
                  onClick={() =>
                    updateField(
                      "resources",
                      form.resources.filter((_, i) => i !== idx)
                    )
                  }
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  x
                </button>
              </div>
            ))}

            {form.resources.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-8">
                No resources added yet.
              </p>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <SectionTitle>Resource Links</SectionTitle>
                <button
                  onClick={() =>
                    updateField("resource_links", [
                      ...form.resource_links,
                      { type: "", label: "" },
                    ])
                  }
                  className="btn-secondary"
                >
                  + Add Link
                </button>
              </div>

              {form.resource_links.map((link, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_1fr_40px] gap-2 mt-2"
                >
                  <input
                    type="text"
                    value={link.type}
                    onChange={(e) => {
                      const updated = [...form.resource_links];
                      updated[idx] = { ...updated[idx], type: e.target.value };
                      updateField("resource_links", updated);
                    }}
                    className="input text-sm"
                    placeholder="Type (e.g. pdf)"
                  />
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...form.resource_links];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      updateField("resource_links", updated);
                    }}
                    className="input text-sm"
                    placeholder="Label"
                  />
                  <button
                    onClick={() =>
                      updateField(
                        "resource_links",
                        form.resource_links.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUILD OPTIONS */}
        {activeTab === "build" && (
          <div className="space-y-8">
            <ListEditor
              label="Thicknesses"
              items={form.build_thicknesses}
              onChange={(items) => updateField("build_thicknesses", items)}
              placeholder="e.g. 12mm"
            />
            <ListEditor
              label="Sizes"
              items={form.build_sizes}
              onChange={(items) => updateField("build_sizes", items)}
              placeholder='e.g. 4"H x 12"W x 12"L'
            />
            <ListEditor
              label="Face Colors"
              items={form.build_face_colors}
              onChange={(items) => updateField("build_face_colors", items)}
              placeholder="e.g. WoodGrain"
            />
          </div>
        )}

        {/* CONTENT */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <SectionTitle>Content Blocks</SectionTitle>

            <Field label="Sustainability Content">
              <textarea
                value={form.sustainability_content}
                onChange={(e) =>
                  updateField("sustainability_content", e.target.value)
                }
                className="input h-32 resize-none"
                placeholder="Sustainability section text..."
              />
            </Field>

            <Field label="Custom Content Block">
              <textarea
                value={form.custom_content}
                onChange={(e) => updateField("custom_content", e.target.value)}
                className="input h-32 resize-none"
                placeholder="Custom section text..."
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Custom Button Text">
                <input
                  type="text"
                  value={form.custom_button_text}
                  onChange={(e) =>
                    updateField("custom_button_text", e.target.value)
                  }
                  className="input"
                />
              </Field>
              <Field label="Custom Button Link">
                <input
                  type="text"
                  value={form.custom_button_link}
                  onChange={(e) =>
                    updateField("custom_button_link", e.target.value)
                  }
                  className="input"
                />
              </Field>
            </div>
          </div>
        )}

        {/* HOW TO SPECIFY */}
        {activeTab === "howto" && (
          <div className="space-y-6">
            <SectionTitle>How to Specify Steps</SectionTitle>

            {form.how_to_specify.map((step, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#111] rounded-lg border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#e8751a]">
                    Step {step.step}
                  </span>
                  <button
                    onClick={() =>
                      updateField(
                        "how_to_specify",
                        form.how_to_specify.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Title">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...form.how_to_specify];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      updateField("how_to_specify", updated);
                    }}
                    className="input"
                    placeholder="Step title"
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    value={step.description}
                    onChange={(e) => {
                      const updated = [...form.how_to_specify];
                      updated[idx] = {
                        ...updated[idx],
                        description: e.target.value,
                      };
                      updateField("how_to_specify", updated);
                    }}
                    className="input h-20 resize-none"
                    placeholder="Step description"
                  />
                </Field>
              </div>
            ))}

            <button
              onClick={() =>
                updateField("how_to_specify", [
                  ...form.how_to_specify,
                  {
                    step: form.how_to_specify.length + 1,
                    title: "",
                    description: "",
                  },
                ])
              }
              className="btn-secondary"
            >
              + Add Step
            </button>
          </div>
        )}
      </div>

      {/* Save bar */}
      <div className="sticky bottom-0 mt-6 flex items-center justify-between bg-[#111] border border-white/10 rounded-xl p-4">
        <button
          onClick={() => router.push("/admin")}
          className="px-5 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.category || !form.surface}
          className="px-8 py-2.5 bg-[#e8751a] hover:bg-[#d46815] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        >
          {saving
            ? "Saving..."
            : form.id
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>

      {/* Inline styles for form elements */}
      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #e8751a;
        }
        .input::placeholder {
          color: #444;
        }
        select.input {
          cursor: pointer;
        }
        select.input option {
          background: #111;
          color: white;
        }
        .btn-secondary {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #e8751a;
          background: rgba(232, 117, 26, 0.1);
          border: 1px solid rgba(232, 117, 26, 0.2);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(232, 117, 26, 0.2);
        }
      `}</style>
    </div>
  );
}

// Helper components
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-3 mb-4">
      {children}
    </h3>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionTitle>{label}</SectionTitle>
        <button
          onClick={() => onChange([...items, ""])}
          className="btn-secondary"
        >
          + Add
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="grid grid-cols-[1fr_40px] gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const updated = [...items];
              updated[idx] = e.target.value;
              onChange(updated);
            }}
            className="input text-sm"
            placeholder={placeholder}
          />
          <button
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            x
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-gray-600 text-sm text-center py-4">
          No items added yet.
        </p>
      )}
    </div>
  );
}
