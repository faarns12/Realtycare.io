import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken, isAdminToken } from "@/lib/adminAuth";
import { countByStatus, isLeadStatus, leadStatuses, listLeads, supabaseConfigured, type LeadFilter } from "@/lib/supabase";
import { formTypes, isFormType } from "@/lib/forms";
import { logout } from "./actions";
import { LeadRow } from "./LeadRow";
import { statusStyle } from "./status";
import { addDays, isYmd, presets, startOfDay, zoneLabel } from "./dates";

export const metadata: Metadata = { title: "Leads dashboard", robots: { index: false, follow: false } };

const formLabels: Record<string, string> = Object.fromEntries(Object.entries(formTypes).map(([k, v]) => [k, v.tab]));
const PAGE_SIZES = [25, 50, 100] as const;

type Params = { status?: string; form?: string; q?: string; from?: string; to?: string; page?: string; per?: string };

export default async function AdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  const token = supabaseConfigured() ? await getAccessToken() : null;
  if (!token || !(await isAdminToken(token).catch(() => false))) redirect("/admin/login");

  const sp = await searchParams;
  const status = isLeadStatus(sp.status) ? sp.status : undefined;
  const formType = isFormType(sp.form) ? sp.form : undefined;
  const q = (sp.q ?? "").slice(0, 80);
  let from = isYmd(sp.from) ? sp.from : undefined;
  let to = isYmd(sp.to) ? sp.to : undefined;
  if (from && to && from > to) [from, to] = [to, from];
  const per = PAGE_SIZES.find((n) => String(n) === sp.per) ?? 25;
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);

  /** Builds an /admin URL from the current filters plus changes. Changing a filter resets to page 1. */
  const link = (patch: Partial<Params>) => {
    const next: Params = { status, form: formType, q: q || undefined, from, to, per: per === 25 ? undefined : String(per), page: undefined, ...patch };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  const filter: LeadFilter = {
    status,
    formType,
    q,
    from: from ? startOfDay(from).toISOString() : undefined,
    to: to ? startOfDay(addDays(to, 1)).toISOString() : undefined,
  };

  let error = "";
  let leads: Awaited<ReturnType<typeof listLeads>>["rows"] = [];
  let total = 0;
  let counts: Awaited<ReturnType<typeof countByStatus>> | null = null;
  try {
    const [list, c] = await Promise.all([listLeads(token, filter, { offset: (page - 1) * per, limit: per }), countByStatus(token, filter)]);
    leads = list.rows;
    total = list.total;
    counts = c;
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load leads.";
  }

  const pages = Math.max(1, Math.ceil(total / per));
  if (!error && page > pages) redirect(link({ page: pages > 1 ? String(pages) : undefined }));

  const quick = presets();
  const activePreset = quick.find((p) => p.from === from && p.to === to)?.key;
  const filtered = Boolean(q || formType || status || from || to);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sky-700">RealtyCare admin</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.5rem)] font-bold">Leads</h1>
          <p className="mt-1 text-[15px] text-muted">Every form submitted on the website. Change a status to keep track.</p>
        </div>
        <form action={logout}>
          <button className="rounded-full border border-line px-4 py-2 text-[14px] font-semibold hover:bg-mist">Sign out</button>
        </form>
      </div>

      {error && <p className="mt-8 rounded-xl border border-gold-400/50 bg-gold-50 p-4 text-[14px] text-gold-800">{error}</p>}

      {counts && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <StatCard href={link({ status: undefined })} label={from || to ? "All in range" : "All leads"} value={counts.total} active={!status} />
          {leadStatuses.map((s) => (
            <StatCard key={s} href={link({ status: s })} label={statusStyle[s].label} value={counts[s]} active={status === s} dot={statusStyle[s].dot} />
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-3 rounded-[var(--radius-card)] border border-line bg-paper p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[13px] font-semibold text-muted">Date</span>
          <Chip href={link({ from: undefined, to: undefined })} active={!from && !to}>All time</Chip>
          {quick.map((p) => (
            <Chip key={p.key} href={link({ from: p.from, to: p.to })} active={activePreset === p.key}>{p.label}</Chip>
          ))}
        </div>

        <form className="flex flex-wrap items-end gap-3" action="/admin">
          {status && <input type="hidden" name="status" value={status} />}
          {per !== 25 && <input type="hidden" name="per" value={per} />}
          <label className="grid min-w-[220px] flex-[2] gap-1 text-[12px] font-semibold text-muted">
            Search
            <input name="q" defaultValue={q} placeholder="Name, email or phone…" className="rounded-full border border-line bg-mist px-4 py-2.5 text-[14px] font-normal text-ink outline-none focus:border-sky-600" />
          </label>
          <label className="grid flex-1 gap-1 text-[12px] font-semibold text-muted">
            Form
            <select name="form" defaultValue={formType ?? ""} className="rounded-full border border-line bg-mist px-4 py-2.5 text-[14px] font-normal text-ink">
              <option value="">All forms</option>
              {Object.entries(formLabels).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[12px] font-semibold text-muted">
            From
            <input type="date" name="from" defaultValue={from} className="rounded-full border border-line bg-mist px-4 py-2 text-[14px] font-normal text-ink" />
          </label>
          <label className="grid gap-1 text-[12px] font-semibold text-muted">
            To
            <input type="date" name="to" defaultValue={to} className="rounded-full border border-line bg-mist px-4 py-2 text-[14px] font-normal text-ink" />
          </label>
          <button className="rounded-full bg-navy-900 px-5 py-2.5 text-[14px] font-semibold text-white">Apply</button>
          {filtered && <Link href={per === 25 ? "/admin" : `/admin?per=${per}`} className="self-center py-2 text-[14px] font-semibold text-sky-700 hover:underline">Clear all</Link>}
        </form>
        <p className="text-[12px] text-muted">Dates and times are in {zoneLabel()} ({process.env.NEXT_PUBLIC_ADMIN_TIMEZONE || "America/New_York"}).</p>
      </div>

      <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper">
        {leads.length === 0 ? (
          <p className="p-10 text-center text-[15px] text-muted">{error ? "—" : filtered ? "No leads match these filters." : "No leads yet."}</p>
        ) : (
          <ul className="divide-y divide-line">
            {leads.map((lead) => <LeadRow key={lead.id} lead={lead} formLabel={formLabels[lead.form_type] ?? lead.form_type} />)}
          </ul>
        )}
      </div>

      {total > 0 && (
        <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[14px]">
          <p className="text-muted">
            Showing <b className="text-ink">{(page - 1) * per + 1}–{Math.min(page * per, total)}</b> of <b className="text-ink">{total}</b>
          </p>
          <div className="flex items-center gap-1">
            <PageLink href={page > 1 ? link({ page: page - 1 > 1 ? String(page - 1) : undefined }) : undefined} label="Previous page">‹</PageLink>
            {pageList(page, pages).map((n, i) =>
              n === null ? (
                <span key={`gap${i}`} className="px-1 text-muted">…</span>
              ) : (
                <PageLink key={n} href={link({ page: n > 1 ? String(n) : undefined })} active={n === page} label={`Page ${n}`}>{n}</PageLink>
              ),
            )}
            <PageLink href={page < pages ? link({ page: String(page + 1) }) : undefined} label="Next page">›</PageLink>
          </div>
          <div className="flex items-center gap-1 text-muted">
            Per page
            {PAGE_SIZES.map((n) => (
              <Link key={n} href={link({ per: n === 25 ? undefined : String(n) })} className={`rounded-full px-2.5 py-1 font-semibold ${n === per ? "bg-navy-900 text-white" : "hover:bg-mist"}`}>{n}</Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

/** Page numbers with gaps, e.g. 1 … 4 5 6 … 12. */
function pageList(current: number, total: number): (number | null)[] {
  const keep = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push(null);
    out.push(n);
  });
  return out;
}

function PageLink({ href, active, label, children }: { href?: string; active?: boolean; label: string; children: React.ReactNode }) {
  const cls = `grid h-9 min-w-9 place-items-center rounded-full px-2 font-semibold ${active ? "bg-sky-600 text-white" : "border border-line bg-paper"}`;
  if (!href) return <span aria-disabled="true" aria-label={label} className={`${cls} opacity-40`}>{children}</span>;
  return <Link href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`${cls} ${active ? "" : "hover:border-line-strong"}`}>{children}</Link>;
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${active ? "border-sky-600 bg-sky-50 text-sky-800" : "border-line hover:border-line-strong"}`}>
      {children}
    </Link>
  );
}

function StatCard({ href, label, value, active, dot }: { href: string; label: string; value: number; active: boolean; dot?: string }) {
  return (
    <Link href={href} className={`rounded-2xl border p-4 transition-colors ${active ? "border-sky-600 bg-sky-50" : "border-line bg-paper hover:border-line-strong"}`}>
      <p className="flex items-center gap-2 text-[13px] text-muted">{dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}{label}</p>
      <p className="tabular mt-1 text-[26px] font-bold leading-none">{value}</p>
    </Link>
  );
}
