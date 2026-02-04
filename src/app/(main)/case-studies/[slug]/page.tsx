import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export const revalidate = 0;

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

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

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
      elements.push(
        <h2 key={key++} className="mt-10 mb-4 text-2xl font-bold text-white">
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

  return (
    <div className="py-16">
      <div className="mx-auto max-w-[900px] px-6 lg:px-10">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#e8751a] transition-colors mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Case Studies
        </Link>

        <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#333] mb-8">
          {study.thumbnail_url && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${study.thumbnail_url})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
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

        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-8">
          {study.title}
        </h1>

        <article>{study.content ? renderContent(study.content) : null}</article>

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
