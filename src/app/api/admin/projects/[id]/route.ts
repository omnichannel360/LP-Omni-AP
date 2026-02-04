import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  // Fetch gallery images
  const { data: gallery } = await supabaseAdmin
    .from("project_gallery")
    .select("*")
    .eq("project_id", id)
    .order("position", { ascending: true });

  return NextResponse.json({ ...project, gallery: gallery || [] });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, slug, summary, description, thumbnailUrl, isPublished, gallery } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (slug !== undefined) updates.slug = slug;
  if (summary !== undefined) updates.summary = summary;
  if (description !== undefined) updates.description = description;
  if (thumbnailUrl !== undefined) updates.thumbnail_url = thumbnailUrl;
  if (isPublished !== undefined) updates.is_published = isPublished;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update gallery images if provided
  if (gallery !== undefined && Array.isArray(gallery)) {
    // Delete existing gallery images
    await supabaseAdmin.from("project_gallery").delete().eq("project_id", id);

    // Insert new gallery images
    if (gallery.length > 0) {
      const galleryRows = gallery.map((img: { image_url: string; caption?: string }, idx: number) => ({
        project_id: id,
        image_url: img.image_url,
        caption: img.caption || null,
        position: idx,
      }));
      await supabaseAdmin.from("project_gallery").insert(galleryRows);
    }
  }

  // Fetch updated gallery
  const { data: updatedGallery } = await supabaseAdmin
    .from("project_gallery")
    .select("*")
    .eq("project_id", id)
    .order("position", { ascending: true });

  return NextResponse.json({ ...data, gallery: updatedGallery || [] });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
