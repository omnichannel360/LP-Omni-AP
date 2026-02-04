import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: project } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) notFound();

  const { data: images } = await supabaseAdmin
    .from("project_gallery")
    .select("*")
    .eq("project_id", project.id)
    .order("position", { ascending: true });

  return (
    <div className="py-16">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#e8751a] transition-colors mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#333] mb-10">
          {project.thumbnail_url && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.thumbnail_url})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {project.title}
            </h1>
          </div>
        </div>

        {project.description && (
          <div className="max-w-3xl mb-12">
            {project.description.split("\n").map((p: string, i: number) => (
              <p key={i} className="mb-4 text-[15px] leading-relaxed text-white/70">
                {p}
              </p>
            ))}
          </div>
        )}

        {images && images.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-white">
              Project <span className="text-[#e8751a]">Gallery</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#1a1a1a] border border-white/10"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img.image_url})` }}
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-sm text-white/80">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(!images || images.length === 0) && (
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-white/30">Gallery images coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
