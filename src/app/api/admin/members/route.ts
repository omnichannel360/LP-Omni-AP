import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, company, phone, discountPercent } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    // Create Supabase Auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create member record
    const { data: member, error: memberError } = await supabaseAdmin
      .from("members")
      .insert({
        auth_user_id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        company: company || null,
        phone: phone || null,
        discount_percent: discountPercent || 0,
      })
      .select()
      .single();

    if (memberError) {
      // Rollback: delete the auth user if member creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: memberError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
