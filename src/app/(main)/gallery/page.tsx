import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";

export const revalidate = 0;

export default async function ProjectsPage() {
  const { data: projects } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  return (
    <div className="py-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          OUR RECENT <span className="text-[#e8751a]">PROJECTS</span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/60">
          Explore our portfolio of acoustic panel installations across offices,
          healthcare, education, and commercial spaces throughout Australia.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <Link
              key={project.id}
              href={`/gallery/${project.slug}`}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a] transition-all hover:border-[#e8751a]/30"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#333] overflow-hidden">
                {project.thumbnail_url ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.thumbnail_url})` }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-12 w-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/40 flex items-center justify-center">
                  <span className="rounded-full bg-[#e8751a] px-4 py-2 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    View Project
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-[#e8751a] transition-colors">
                  {project.title}
                </h3>
                {project.summary && (
                  <p className="mt-2 text-sm text-white/50 line-clamp-2">
                    {project.summary}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-block rounded-sm border border-white/40 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white/80 transition-colors hover:border-[#e8751a] hover:text-[#e8751a]"
          >
            Check Our Products
          </Link>
        </div>
      </div>
    </div>
  );
}
