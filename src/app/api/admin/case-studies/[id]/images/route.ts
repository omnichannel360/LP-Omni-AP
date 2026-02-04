import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// Add image to case study
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { imageUrl, caption } = body;

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL required" }, { status: 400 });
  }

  // Get max position
  const { data: existing } = await supabaseAdmin
    .from("case_study_images")
    .select("position")
    .eq("case_study_id", id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabaseAdmin
    .from("case_study_images")
    .insert({
      case_study_id: id,
      image_url: imageUrl,
      caption: caption || null,
      position: (existing?.position || 0) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// Delete image from case study
export async function DELETE(request: NextRequest) {
  const imageId = request.nextUrl.searchParams.get("imageId");
  if (!imageId) {
    return NextResponse.json({ error: "Image ID required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("case_study_images")
    .delete()
    .eq("id", imageId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
