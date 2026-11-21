/**
 * Keeps the /admin Supabase session alive: when the short-lived access token has expired
 * but a refresh token is present, swap it for a new pair before the page renders.
 */
import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, accessMaxAge, cookieOptions, refreshMaxAge, refreshSession } from "@/lib/adminSession";

export async function proxy(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (access || !refresh || !process.env.SUPABASE_URL) return NextResponse.next();

  const session = await refreshSession(refresh).catch(() => null);
  if (!session) {
    const res = NextResponse.next();
    res.cookies.delete({ name: REFRESH_COOKIE, path: "/admin" });
    return res;
  }

  // Make the new token visible to this request's render, and store it in the browser.
  request.cookies.set(ACCESS_COOKIE, session.access_token);
  request.cookies.set(REFRESH_COOKIE, session.refresh_token);
  const res = NextResponse.next({ request: { headers: request.headers } });
  res.cookies.set(ACCESS_COOKIE, session.access_token, cookieOptions(accessMaxAge(session)));
  res.cookies.set(REFRESH_COOKIE, session.refresh_token, cookieOptions(refreshMaxAge));
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
