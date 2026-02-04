import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("navigation_items")
    .select("*")
    .order("position", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, href, position, isVisible, openInNewTab } = body;

    if (!label || !href) {
      return NextResponse.json({ error: "Label and URL are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("navigation_items")
      .insert({
        label,
        href,
        position: position || 0,
        is_visible: isVisible ?? true,
        open_in_new_tab: openInNewTab ?? false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items array required" }, { status: 400 });
    }

    for (const item of items) {
      await supabaseAdmin
        .from("navigation_items")
        .update({
          label: item.label,
          href: item.href,
          position: item.position,
          is_visible: item.is_visible,
          open_in_new_tab: item.open_in_new_tab,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
