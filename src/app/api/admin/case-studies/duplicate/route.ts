import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Case study ID required" }, { status: 400 });

    // Fetch original
    const { data: original, error: fetchErr } = await supabaseAdmin
      .from("case_studies")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !original) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    // Create duplicate
    const { data: duplicate, error: insertErr } = await supabaseAdmin
      .from("case_studies")
      .insert({
        title: `${original.title} (Copy)`,
        slug: `${original.slug}-copy-${Date.now().toString(36)}`,
        summary: original.summary,
        content: original.content,
        thumbnail_url: original.thumbnail_url,
        banner_url: original.banner_url,
        author: original.author,
        is_published: false,
      })
      .select()
      .single();

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

    // Duplicate content images
    const { data: images } = await supabaseAdmin
      .from("case_study_images")
      .select("*")
      .eq("case_study_id", id)
      .order("position", { ascending: true });

    if (images && images.length > 0) {
      const imageRows = images.map((img) => ({
        case_study_id: duplicate.id,
        image_url: img.image_url,
        caption: img.caption,
        position: img.position,
      }));
      await supabaseAdmin.from("case_study_images").insert(imageRows);
    }

    return NextResponse.json(duplicate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
