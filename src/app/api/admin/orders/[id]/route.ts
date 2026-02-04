import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, members(first_name, last_name, email, company), order_items(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  const validStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Get order before update to check if transitioning to delivered
  const { data: existingOrder } = await supabaseAdmin
    .from("orders")
    .select("*, members(id, points_balance)")
    .eq("id", id)
    .single();

  if (!existingOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Update order status
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award points when transitioning to "delivered"
  if (
    status === "delivered" &&
    existingOrder.status !== "delivered" &&
    existingOrder.points_earned === 0
  ) {
    const { data: settings } = await supabaseAdmin
      .from("global_settings")
      .select("points_per_dollar_spent")
      .limit(1)
      .single();

    const pointsRate = settings ? Number(settings.points_per_dollar_spent) : 0.01;
    const totalDollars = existingOrder.total_cents / 100;
    const pointsEarned = Math.floor(totalDollars * pointsRate);

    if (pointsEarned > 0) {
      const member = existingOrder.members as { id: string; points_balance: number };

      // Update order with points earned
      await supabaseAdmin
        .from("orders")
        .update({ points_earned: pointsEarned })
        .eq("id", id);

      // Update member points balance
      await supabaseAdmin
        .from("members")
        .update({
          points_balance: member.points_balance + pointsEarned,
          updated_at: new Date().toISOString(),
        })
        .eq("id", member.id);

      // Add points ledger entry
      await supabaseAdmin.from("points_ledger").insert({
        member_id: member.id,
        change_amount: pointsEarned,
        reason: `Order ${existingOrder.order_number} delivered`,
        reference_type: "order",
        reference_id: id,
      });
    }
  }

  return NextResponse.json(order);
}
