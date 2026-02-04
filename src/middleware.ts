import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "./lib/supabase-middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // --- Admin routes (cookie-based auth) ---
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("admin_session");
    if (session?.value !== "lp-omni-ap-admin-authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  // --- Member routes (Supabase Auth) ---
  if (pathname.startsWith("/member") && pathname !== "/member/login") {
    const supabase = createSupabaseMiddlewareClient(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/member/login", request.url));
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};
