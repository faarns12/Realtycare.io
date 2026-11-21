/** Supabase Auth session helpers shared by the admin pages and src/proxy.ts (no next/headers here). */
import { supabaseEnv } from "./supabase";

export const ACCESS_COOKIE = "rc_at";
export const REFRESH_COOKIE = "rc_rt";
export const COOKIE_PATH = "/admin";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // stay signed in for up to 30 days of inactivity

export type Session = { access_token: string; refresh_token: string; expires_in: number };

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: COOKIE_PATH,
  maxAge,
});

/** Access cookie expires a minute before the token does, so we never send an expired token. */
export const accessMaxAge = (s: Session) => Math.max(60, s.expires_in - 60);
export const refreshMaxAge = REFRESH_MAX_AGE;

async function authRequest(grant: "password" | "refresh_token", body: object): Promise<Session | null> {
  const { url, key } = supabaseEnv();
  const res = await fetch(`${url}/auth/v1/token?grant_type=${grant}`, {
    method: "POST",
    cache: "no-store",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return (await res.json()) as Session;
}

export const signInWithPassword = (email: string, password: string) => authRequest("password", { email, password });
export const refreshSession = (refresh_token: string) => authRequest("refresh_token", { refresh_token });

