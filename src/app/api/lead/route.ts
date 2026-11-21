/**
 * POST /api/lead
 * Receives every form on the site and saves it to Supabase (the /admin dashboard reads from there)
 * and/or your Google Sheet (through the Apps Script in /google-apps-script). Optionally starts a Vapi demo call.
 */
import { NextResponse } from "next/server";
import { formTypes, HONEYPOT, isFormType } from "@/lib/forms";
import { insertLead, supabaseConfigured } from "@/lib/supabase";

const MAX_FIELD = 2000;
const hits = new Map<string, number[]>(); // simple per-IP rate limit (per server instance)

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

/** Stops spreadsheet formulas being injected through a form ("=HYPERLINK(...)"). */
function clean(v: unknown) {
  let s = String(v ?? "").trim().slice(0, MAX_FIELD);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

/** US numbers: 10 digits -> +1XXXXXXXXXX. Anything else is kept as typed. */
function toE164(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return phone;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Try again in a minute." }, { status: 429 });

  // Bots fill the hidden field; pretend it worked and drop it.
  if (body[HONEYPOT]) return NextResponse.json({ ok: true });

  const type = body.form_type;
  if (!isFormType(type)) return NextResponse.json({ ok: false, error: "Unknown form." }, { status: 400 });

  const missing = formTypes[type].required.filter((k) => !String(body[k] ?? "").trim());
  if (missing.length) return NextResponse.json({ ok: false, error: "Please fill in: " + missing.join(", ").replace(/_/g, " ") }, { status: 400 });

  const email = String(body.email ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ ok: false, error: "That email address doesn’t look right." }, { status: 400 });

  const row: Record<string, string> = {
    submitted_at: new Date().toISOString(),
  };
  for (const [k, v] of Object.entries(body)) {
    if (k === HONEYPOT || k === "form_type") continue;
    row[k] = clean(k === "phone" ? toE164(String(v)) : v);
  }
  row.user_agent = clean(req.headers.get("user-agent"));

  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!supabaseConfigured() && !url) {
    console.warn("[lead] Neither Supabase nor GOOGLE_SHEET_WEBHOOK_URL is set. Submission:", type, row);
    if (process.env.NODE_ENV === "production")
      return NextResponse.json({ ok: false, error: "Our form isn’t connected yet. Please email us instead." }, { status: 500 });
  }

  // 1) Save to Supabase (powers the /admin leads dashboard)
  if (supabaseConfigured()) {
    // The sheet-safe prefix (') isn't needed in a database, so store the plain values.
    const data = Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v.replace(/^'(?=[=+\-@])/, "")]));
    const pick = (k: string) => data[k] || null;
    try {
      await insertLead({ form_type: type, first_name: pick("first_name"), last_name: pick("last_name"), email: pick("email"), phone: pick("phone"), data });
    } catch (err) {
      console.error("[lead] Could not save to Supabase:", err);
      return NextResponse.json({ ok: false, error: "Something went wrong saving your details. Please try again." }, { status: 502 });
    }
  }

  // 2) Also save to Google Sheets, if connected
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.GOOGLE_SHEET_SECRET ?? "", sheet: formTypes[type].tab, data: row }),
        redirect: "follow",
      });
      const out = await res.json().catch(() => ({ ok: res.ok }));
      if (!out.ok) throw new Error(out.error || "Sheet rejected the row");
    } catch (err) {
      console.error("[lead] Could not save to Google Sheets:", err);
      // Already in Supabase? Then the lead is safe, so don't make the visitor submit twice.
      if (!supabaseConfigured()) return NextResponse.json({ ok: false, error: "Something went wrong saving your details. Please try again." }, { status: 502 });
    }
  }

  // 3) Optional: start a real AI demo call through Vapi
  if (type === "demo_call" && process.env.VAPI_API_KEY && process.env.VAPI_ASSISTANT_ID && process.env.VAPI_PHONE_NUMBER_ID) {
    try {
      await fetch("https://api.vapi.ai/call", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          assistantId: process.env.VAPI_ASSISTANT_ID,
          phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
          customer: { number: toE164(String(body.phone)), name: String(body.first_name ?? "").slice(0, 40) },
        }),
      });
    } catch (err) {
      console.error("[lead] Vapi call failed:", err); // the row is already saved, so don't fail the form
    }
  }

  return NextResponse.json({ ok: true });
}
