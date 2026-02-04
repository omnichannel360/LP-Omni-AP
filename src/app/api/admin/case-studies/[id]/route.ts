import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: caseStudy, error } = await supabaseAdmin
    .from("case_studies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  // Fetch content images
  const { data: images } = await supabaseAdmin
    .from("case_study_images")
    .select("*")
    .eq("case_study_id", id)
    .order("position", { ascending: true });

  return NextResponse.json({ ...caseStudy, images: images || [] });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, slug, summary, content, thumbnailUrl, bannerUrl, author, isPublished } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (slug !== undefined) updates.slug = slug;
  if (summary !== undefined) updates.summary = summary;
  if (content !== undefined) updates.content = content;
  if (thumbnailUrl !== undefined) updates.thumbnail_url = thumbnailUrl;
  if (bannerUrl !== undefined) updates.banner_url = bannerUrl;
  if (author !== undefined) updates.author = author;
  if (isPublished !== undefined) updates.is_published = isPublished;

  const { data, error } = await supabaseAdmin
    .from("case_studies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await supabaseAdmin.from("case_studies").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
