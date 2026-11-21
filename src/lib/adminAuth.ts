/**
 * Admin login for /admin using Supabase Auth (email + password).
 * The session's access and refresh tokens live in httpOnly cookies; src/proxy.ts refreshes them
 * before they expire. Who may see leads is decided in the database (public.admin_emails + RLS).
 */
import { cookies } from "next/headers";
import { supabaseConfigured, supabaseEnv } from "./supabase";
import { ACCESS_COOKIE, COOKIE_PATH, REFRESH_COOKIE, accessMaxAge, cookieOptions, refreshMaxAge, type Session } from "./adminSession";

export { signInWithPassword } from "./adminSession";

export const adminConfigured = supabaseConfigured;

export async function saveSession(s: Session) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, s.access_token, cookieOptions(accessMaxAge(s)));
  jar.set(REFRESH_COOKIE, s.refresh_token, cookieOptions(refreshMaxAge));
}

export async function clearSession() {
  const jar = await cookies();
  const token = jar.get(ACCESS_COOKIE)?.value;
  if (token && supabaseConfigured()) {
    const { url, key } = supabaseEnv();
    await fetch(`${url}/auth/v1/logout`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${token}` } }).catch(() => {});
  }
  jar.delete({ name: ACCESS_COOKIE, path: COOKIE_PATH });
  jar.delete({ name: REFRESH_COOKIE, path: COOKIE_PATH });
}

/** The signed-in admin's access token, or null. */
export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

/** Whether the signed-in user is on the admin list (checked by the database itself). */
export async function isAdminToken(token: string) {
  const { url, key } = supabaseEnv();
  const res = await fetch(`${url}/rest/v1/rpc/is_admin`, {
    method: "POST",
    cache: "no-store",
    headers: { apikey: key, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  });
  return res.ok && (await res.json()) === true;
}
