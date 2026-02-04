import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { thickness, size, faceColor, colorwayCode, sku, priceCents, isAvailable } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (thickness !== undefined) updates.thickness = thickness;
  if (size !== undefined) updates.size = size;
  if (faceColor !== undefined) updates.face_color = faceColor;
  if (colorwayCode !== undefined) updates.colorway_code = colorwayCode;
  if (sku !== undefined) updates.sku = sku;
  if (priceCents !== undefined) updates.price_cents = priceCents;
  if (isAvailable !== undefined) updates.is_available = isAvailable;

  const { data, error } = await supabaseAdmin
    .from("product_variants")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("product_variants")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
