import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, slug, summary, description, thumbnailUrl, isPublished } = body;

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
  return NextResponse.json(data);
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
