import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("position", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, summary, description, thumbnailUrl, isPublished } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const { data: maxPos } = await supabaseAdmin
      .from("projects")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert({
        title,
        slug,
        summary: summary || null,
        description: description || null,
        thumbnail_url: thumbnailUrl || null,
        is_published: isPublished ?? true,
        position: (maxPos?.position || 0) + 1,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
