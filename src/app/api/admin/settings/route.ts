import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("global_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { globalDiscountPercent, pointsPerDollarSpent } = body;

  // Get existing settings row
  const { data: existing } = await supabaseAdmin
    .from("global_settings")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    return NextResponse.json(
      { error: "Settings not found" },
      { status: 404 }
    );
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (globalDiscountPercent !== undefined)
    updates.global_discount_percent = globalDiscountPercent;
  if (pointsPerDollarSpent !== undefined)
    updates.points_per_dollar_spent = pointsPerDollarSpent;

  const { data, error } = await supabaseAdmin
    .from("global_settings")
    .update(updates)
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
