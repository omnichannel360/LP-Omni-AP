import { supabaseAdmin } from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/project-gallery";

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
    <div className="min-h-screen bg-[#111]">
      {/* Back link */}
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-6 pb-4">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#e8751a] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>
      </div>

      {/* Gallery Component (banner + tiles + lightbox) */}
      <ProjectGallery
        title={project.title}
        summary={project.summary}
        images={images || []}
      />

      {/* Minimal description */}
      {project.description && (
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-10">
          <p className="text-sm text-white/50 max-w-3xl leading-relaxed">
            {project.description.split("\n")[0]}
          </p>
        </div>
      )}
    </div>
  );
}
