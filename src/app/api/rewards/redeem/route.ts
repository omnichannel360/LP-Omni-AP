import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberSession } from "@/lib/member-auth";
import { generateVoucherCode } from "@/lib/voucher-code";

export async function POST(request: NextRequest) {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rewardTypeId } = await request.json();

    if (!rewardTypeId) {
      return NextResponse.json(
        { error: "Reward type ID is required" },
        { status: 400 }
      );
    }

    // Get reward type
    const { data: reward } = await supabaseAdmin
      .from("reward_types")
      .select("*")
      .eq("id", rewardTypeId)
      .eq("is_active", true)
      .single();

    if (!reward) {
      return NextResponse.json(
        { error: "Reward not found or inactive" },
        { status: 404 }
      );
    }

    // Check points balance
    const { data: member } = await supabaseAdmin
      .from("members")
      .select("points_balance")
      .eq("id", session.memberId)
      .single();

    if (!member || member.points_balance < reward.points_cost) {
      return NextResponse.json(
        { error: "Insufficient points" },
        { status: 400 }
      );
    }

    const voucherCode = generateVoucherCode();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 12); // 12 months expiry

    // Create redeemed reward
    const { data: redeemed, error: redeemError } = await supabaseAdmin
      .from("redeemed_rewards")
      .insert({
        member_id: session.memberId,
        reward_type_id: rewardTypeId,
        points_spent: reward.points_cost,
        voucher_code: voucherCode,
        status: "active",
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (redeemError) {
      return NextResponse.json({ error: redeemError.message }, { status: 500 });
    }

    // Deduct points
    await supabaseAdmin
      .from("members")
      .update({
        points_balance: member.points_balance - reward.points_cost,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.memberId);

    // Add points ledger entry
    await supabaseAdmin.from("points_ledger").insert({
      member_id: session.memberId,
      change_amount: -reward.points_cost,
      reason: `Redeemed: ${reward.name}`,
      reference_type: "reward",
      reference_id: redeemed.id,
    });

    return NextResponse.json({
      voucherCode,
      rewardName: reward.name,
      pointsSpent: reward.points_cost,
      expiresAt: expiresAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
