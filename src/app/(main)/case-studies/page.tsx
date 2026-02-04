import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";

export const revalidate = 0;

export default async function CaseStudiesPage() {
  const { data: studies } = await supabaseAdmin
    .from("case_studies")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="py-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          CASE <span className="text-[#e8751a]">STUDIES</span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/60">
          In-depth looks at how our acoustic solutions solve real-world noise
          challenges across industries.
        </p>

        <div className="mt-12 space-y-8">
          {studies?.map((study) => (
            <Link
              key={study.id}
              href={`/case-studies/${study.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] transition-all hover:border-[#e8751a]/30 md:flex-row"
            >
              <div className="relative h-56 w-full shrink-0 bg-gradient-to-br from-[#1a1a1a] to-[#333] md:h-auto md:w-80">
                {study.thumbnail_url ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${study.thumbnail_url})` }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-12 w-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
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
                <h2 className="text-xl font-bold text-white group-hover:text-[#e8751a] transition-colors">
                  {study.title}
                </h2>
                {study.summary && (
                  <p className="mt-3 text-sm leading-relaxed text-white/50 line-clamp-3">
                    {study.summary}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#e8751a]">
                  Read Case Study
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
