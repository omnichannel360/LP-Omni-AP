import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getMemberSession } from "@/lib/member-auth";

export async function GET() {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("redeemed_rewards")
    .select("*, reward_types(name, description)")
    .eq("member_id", session.memberId)
    .order("redeemed_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
