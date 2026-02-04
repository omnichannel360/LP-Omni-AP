import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    // Fetch original project
    const { data: original, error: fetchErr } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !original) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get max position
    const { data: maxPos } = await supabaseAdmin
      .from("projects")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .single();

    // Create duplicate
    const { data: duplicate, error: insertErr } = await supabaseAdmin
      .from("projects")
      .insert({
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy-${Date.now().toString(36)}`,
        summary: original.summary,
        description: original.description,
        thumbnail_url: original.thumbnail_url,
        is_published: false,
        position: (maxPos?.position || 0) + 1,
      })
      .select()
      .single();

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

    // Duplicate gallery images
    const { data: gallery } = await supabaseAdmin
      .from("project_gallery")
      .select("*")
      .eq("project_id", id)
      .order("position", { ascending: true });

    if (gallery && gallery.length > 0) {
      const galleryRows = gallery.map((img) => ({
        project_id: duplicate.id,
        image_url: img.image_url,
        caption: img.caption,
        position: img.position,
      }));
      await supabaseAdmin.from("project_gallery").insert(galleryRows);
    }

    return NextResponse.json(duplicate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
