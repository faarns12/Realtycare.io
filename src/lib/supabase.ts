/**
 * Server-side access to the Supabase `leads` table (see supabase/schema.sql).
 * Uses the REST API with the publishable key. Row level security decides what each request may do:
 * the public can only insert leads; reading and changing them needs a signed-in admin's access token.
 */

export const leadStatuses = ["new", "contacted", "booked", "won", "lost", "spam"] as const;
export type LeadStatus = (typeof leadStatuses)[number];
export const isLeadStatus = (v: unknown): v is LeadStatus => typeof v === "string" && (leadStatuses as readonly string[]).includes(v);

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  form_type: string;
  status: LeadStatus;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  data: Record<string, string>;
};

export const supabaseConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

export function supabaseEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY).");
  return { url: url.replace(/\/$/, ""), key };
}

/** Calls the Supabase REST API. Pass the admin's access token for admin-only operations. */
async function rest(path: string, init: RequestInit = {}, accessToken?: string) {
  const { url, key } = supabaseEnv();
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res;
}

const checkId = (id: string) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Bad lead id");
};

/** Public: used by the website's forms. */
export async function insertLead(lead: Pick<Lead, "form_type" | "first_name" | "last_name" | "email" | "phone" | "data">) {
  await rest("leads", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(lead) });
}

export type LeadFilter = {
  status?: LeadStatus;
  formType?: string;
  q?: string;
  /** ISO timestamps: created_at >= from and < to. */
  from?: string;
  to?: string;
};

function filterParams(f: LeadFilter, opts: { withStatus: boolean }) {
  const params = new URLSearchParams();
  if (opts.withStatus && f.status) params.set("status", `eq.${f.status}`);
  if (f.formType) params.set("form_type", `eq.${f.formType}`);
  if (f.from) params.append("created_at", `gte.${f.from}`);
  if (f.to) params.append("created_at", `lt.${f.to}`);
  if (f.q) {
    // Strip characters that have meaning in PostgREST filter syntax.
    const q = f.q.replace(/[(),*%:."\\]/g, " ").trim();
    if (q) params.set("or", `(first_name.ilike.*${q}*,last_name.ilike.*${q}*,email.ilike.*${q}*,phone.ilike.*${q}*)`);
  }
  return params;
}

/** One page of leads, newest first, plus the total number that match the filter. */
export async function listLeads(token: string, filter: LeadFilter, page: { offset: number; limit: number }) {
  const params = filterParams(filter, { withStatus: true });
  params.set("select", "*");
  params.set("order", "created_at.desc");
  params.set("offset", String(page.offset));
  params.set("limit", String(page.limit));
  const { url, key } = supabaseEnv();
  const res = await fetch(`${url}/rest/v1/leads?${params}`, {
    cache: "no-store",
    headers: { apikey: key, Authorization: `Bearer ${token}`, Prefer: "count=exact" },
  });
  // content-range looks like "0-24/123" (or "*/123" when the page is past the end).
  const total = Number(res.headers.get("content-range")?.split("/")[1]) || 0;
  if (res.status === 416) return { rows: [] as Lead[], total };
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return { rows: (await res.json()) as Lead[], total };
}

/** Number of leads in each status for the current filter (ignores the status filter itself). */
export async function countByStatus(token: string, filter: LeadFilter) {
  const params = filterParams(filter, { withStatus: false });
  params.set("select", "status");
  params.set("limit", "100000");
  const res = await rest(`leads?${params}`, {}, token);
  const rows = (await res.json()) as { status: LeadStatus }[];
  const counts = Object.fromEntries(leadStatuses.map((s) => [s, 0])) as Record<LeadStatus, number>;
  for (const r of rows) if (r.status in counts) counts[r.status]++;
  return { total: rows.length, ...counts };
}

/** Updates a lead. Throws if RLS blocked it (0 rows changed). */
export async function updateLead(token: string, id: string, patch: Partial<Pick<Lead, "status" | "notes">>) {
  checkId(id);
  const res = await rest(`leads?id=eq.${id}&select=id`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(patch) }, token);
  if (((await res.json()) as unknown[]).length === 0) throw new Error("Lead not found or not allowed.");
}

export async function deleteLead(token: string, id: string) {
  checkId(id);
  const res = await rest(`leads?id=eq.${id}&select=id`, { method: "DELETE", headers: { Prefer: "return=representation" } }, token);
  if (((await res.json()) as unknown[]).length === 0) throw new Error("Lead not found or not allowed.");
}
