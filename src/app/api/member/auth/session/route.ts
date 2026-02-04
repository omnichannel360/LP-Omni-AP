import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/member-auth";

export async function GET() {
  const session = await getMemberSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    member: session,
  });
}
