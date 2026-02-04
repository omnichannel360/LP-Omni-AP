import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { firstName, lastName, company, phone, discountPercent, pointsBalance, isActive } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (firstName !== undefined) updates.first_name = firstName;
  if (lastName !== undefined) updates.last_name = lastName;
  if (company !== undefined) updates.company = company;
  if (phone !== undefined) updates.phone = phone;
  if (discountPercent !== undefined) updates.discount_percent = discountPercent;
  if (pointsBalance !== undefined) updates.points_balance = pointsBalance;
  if (isActive !== undefined) updates.is_active = isActive;

  const { data, error } = await supabaseAdmin
    .from("members")
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

  // Get the member to find their auth_user_id
  const { data: member } = await supabaseAdmin
    .from("members")
    .select("auth_user_id")
    .eq("id", id)
    .single();

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Delete member record
  const { error } = await supabaseAdmin.from("members").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Delete auth user
  await supabaseAdmin.auth.admin.deleteUser(member.auth_user_id);

  return NextResponse.json({ success: true });
}
