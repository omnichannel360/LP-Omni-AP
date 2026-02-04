import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reward_types")
    .select("*")
    .order("points_cost", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, pointsCost, rewardValueCents } = body;

    if (!name || !pointsCost) {
      return NextResponse.json(
        { error: "Name and points cost are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("reward_types")
      .insert({
        name,
        description: description || null,
        points_cost: pointsCost,
        reward_value_cents: rewardValueCents || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
