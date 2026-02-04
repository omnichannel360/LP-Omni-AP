import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import CaseStudyLightbox from "@/components/case-study-lightbox";

export const revalidate = 0;

interface ContentImage {
  id: string;
  image_url: string;
  caption: string | null;
  position: number;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderContent(content: string, images: ContentImage[]) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  let h2Count = 0;

  // Insert images after every 2nd ## heading
  const imageInsertPoints = [2, 4, 6];
  let imageIdx = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Handle image markdown: ![caption](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      elements.push(
        <figure key={key++} className="my-8">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="w-full rounded-lg"
          />
          {imgMatch[1] && (
            <figcaption className="mt-2 text-center text-xs text-white/40 italic">
              {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      lines[i + 1]?.includes("---")
    ) {
      const headers = line
        .split("|")
        .filter((c) => c.trim())
        .map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(
          lines[i]
            .split("|")
            .filter((c) => c.trim())
            .map((c) => c.trim())
        );
        i++;
      }
      elements.push(
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded">
            <thead>
              <tr className="bg-white/5">
                {headers.map((h, j) => (
                  <th
                    key={j}
                    className="px-4 py-2 text-left font-semibold text-white/80 border-b border-white/10"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className="border-b border-white/5">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-2 text-white/60">
                      {formatInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      h2Count++;

      // Insert a pair of content images before certain headings
      if (
        imageInsertPoints.includes(h2Count) &&
        imageIdx < images.length
      ) {
        const img1 = images[imageIdx];
        const img2 = imageIdx + 1 < images.length ? images[imageIdx + 1] : null;
        imageIdx += 2;

        elements.push(
          <div key={key++} className="my-6 sm:my-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <figure className="relative aspect-[3/2] overflow-hidden rounded-lg bg-[#1a1a1a]">
              <img
                src={img1.image_url}
                alt={img1.caption || "Case study image"}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {img1.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                  <span className="text-xs text-white/70">{img1.caption}</span>
                </div>
              )}
            </figure>
            {img2 && (
              <figure className="relative aspect-[3/2] overflow-hidden rounded-lg bg-[#1a1a1a]">
                <img
                  src={img2.image_url}
                  alt={img2.caption || "Case study image"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {img2.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <span className="text-xs text-white/70">{img2.caption}</span>
                  </div>
                )}
              </figure>
            )}
          </div>
        );
      }

      elements.push(
        <h2 key={key++} className="mt-8 sm:mt-10 mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-white">
          {line.replace("## ", "")}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          className="mt-8 mb-3 text-lg font-bold text-[#e8751a]"
        >
          {line.replace("### ", "")}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={key++}
          className="my-6 border-l-4 border-[#e8751a] pl-6 italic text-white/70"
        >
          {line.replace(/^> /, "")}
        </blockquote>
      );
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-4 space-y-2 pl-6">
          {items.map((item, j) => (
            <li key={j} className="text-[15px] text-white/60 list-disc">
              {formatInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    elements.push(
      <p key={key++} className="mb-4 text-[15px] leading-relaxed text-white/60">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: study } = await supabaseAdmin
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!study) notFound();

  const { data: images } = await supabaseAdmin
    .from("case_study_images")
    .select("*")
    .eq("case_study_id", study.id)
    .order("position", { ascending: true });

  const contentImages = (images || []) as ContentImage[];
  const bannerUrl = study.banner_url || study.thumbnail_url;

  return (
    <div className="min-h-screen bg-[#111]">
      {/* Banner */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#0a0a0a] overflow-hidden">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={study.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#333]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-[900px]">
            <div className="flex items-center gap-3 text-xs text-white/60 mb-3">
              <span>{study.author}</span>
              <span>&middot;</span>
              <span>
                {new Date(study.published_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              {study.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Image Tiles (clickable with lightbox) */}
      {contentImages.length > 0 && (
        <CaseStudyLightbox images={contentImages} />
      )}

      {/* Back link + content */}
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#e8751a] transition-colors mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Case Studies
        </Link>

        <article>
          {study.content ? renderContent(study.content, contentImages) : null}
        </article>

        <div className="mt-16 rounded-xl border border-[#e8751a]/20 bg-[#e8751a]/5 p-8 text-center">
          <h3 className="text-xl font-bold text-white">
            Need acoustic solutions for your project?
          </h3>
          <p className="mt-2 text-sm text-white/60">
            Get in touch to discuss your requirements with our team.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-sm bg-[#e8751a] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#d46815]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
