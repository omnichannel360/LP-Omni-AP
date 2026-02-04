import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_TOKEN = "lp-omni-ap-admin-authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === SESSION_TOKEN;
}

export function getSessionToken(): string {
  return SESSION_TOKEN;
}

export function getCookieName(): string {
  return COOKIE_NAME;
}
