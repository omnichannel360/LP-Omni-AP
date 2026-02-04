import { createSupabaseServerClient } from "./supabase-auth";
import { supabaseAdmin } from "./supabase-server";

export interface MemberSession {
  userId: string;
  memberId: string;
  email: string;
  firstName: string;
  lastName: string;
  pointsBalance: number;
  discountPercent: number;
}

export async function getMemberSession(): Promise<MemberSession | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: member } = await supabaseAdmin
      .from("members")
      .select("*")
      .eq("auth_user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!member) return null;

    return {
      userId: user.id,
      memberId: member.id,
      email: member.email,
      firstName: member.first_name,
      lastName: member.last_name,
      pointsBalance: member.points_balance,
      discountPercent: Number(member.discount_percent),
    };
  } catch {
    return null;
  }
}

export async function requireMember(): Promise<MemberSession> {
  const session = await getMemberSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function isMember(): Promise<boolean> {
  const session = await getMemberSession();
  return session !== null;
}
