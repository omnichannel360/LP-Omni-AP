import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.isActive !== undefined) updates.is_active = body.isActive;
  if (body.description !== undefined) updates.description = body.description;
  if (body.discountValue !== undefined)
    updates.discount_value = body.discountValue;
  if (body.maxUses !== undefined) updates.max_uses = body.maxUses;
  if (body.expiresAt !== undefined) updates.expires_at = body.expiresAt;

  const { data, error } = await supabaseAdmin
    .from("discount_codes")
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
    .from("discount_codes")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
