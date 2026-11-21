"use client";

import { useState, useTransition } from "react";
import type { Lead, LeadStatus } from "@/lib/supabase";
import { removeLead, saveNotes, setStatus } from "./actions";
import { statusStyle } from "./status";
import { formatWhen } from "./dates";

/** Friendly labels for the extra fields saved in `data`. Unknown keys are shown as-is. */
const fieldLabels: Record<string, string> = {
  brokerage: "Brokerage or team",
  state: "State",
  monthly_leads: "New leads a month",
  ad_budget: "Monthly ad budget",
  current_crm: "CRM today",
  message: "Message",
  consent: "Consent to calls/texts",
  page: "Submitted from",
  utm_source: "UTM source",
  utm_medium: "UTM medium",
  utm_campaign: "UTM campaign",
  utm_content: "UTM content",
  utm_term: "UTM term",
  fbclid: "Facebook click ID",
  gclid: "Google click ID",
  user_agent: "Browser",
};
const hidden = new Set(["first_name", "last_name", "email", "phone", "submitted_at"]);

export function LeadRow({ lead, formLabel }: { lead: Lead; formLabel: string }) {
  const [open, setOpen] = useState(false);
  const [status, setLocalStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saved, setSaved] = useState("");
  const [pending, start] = useTransition();
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(" ") || "No name";
  const extra = Object.entries(lead.data ?? {}).filter(([k, v]) => !hidden.has(k) && String(v).trim());

  const changeStatus = (next: LeadStatus) => {
    const before = status;
    setLocalStatus(next);
    start(async () => {
      try { await setStatus(lead.id, next); } catch { setLocalStatus(before); alertSoft("Couldn’t change the status. Try again."); }
    });
  };
  const alertSoft = (msg: string) => { setSaved(msg); setTimeout(() => setSaved(""), 3000); };

  return (
    <li className={pending ? "opacity-70" : undefined}>
      <div className="grid items-center gap-3 px-4 py-4 sm:px-5 md:grid-cols-[1.4fr_1.6fr_1fr_auto]">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 items-center gap-3 text-left" aria-expanded={open}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-50 text-[13px] font-bold text-sky-800">
            {name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold">{name}</span>
            <span className="block text-[12.5px] text-muted">{formLabel} · {formatWhen(lead.created_at)}</span>
          </span>
        </button>

        <div className="min-w-0 text-[14px]">
          {lead.email && <a href={`mailto:${lead.email}`} className="block truncate hover:text-sky-700 hover:underline">{lead.email}</a>}
          {lead.phone && <a href={`tel:${lead.phone}`} className="block text-muted hover:text-sky-700 hover:underline">{lead.phone}</a>}
        </div>

        <label className="relative">
          <span className="sr-only">Status for {name}</span>
          <span className={`pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${statusStyle[status].dot}`} />
          <select value={status} onChange={(e) => changeStatus(e.target.value as LeadStatus)} className={`w-full appearance-none rounded-full border py-2 pl-7 pr-8 text-[13.5px] font-semibold ${statusStyle[status].pill}`}>
            {Object.entries(statusStyle).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
        </label>

        <button type="button" onClick={() => setOpen((v) => !v)} className="justify-self-start rounded-full px-3 py-2 text-[13.5px] font-semibold text-sky-700 hover:bg-sky-50 md:justify-self-end">
          {open ? "Hide" : "Details"}
        </button>
      </div>

      {open && (
        <div className="grid gap-6 border-t border-line bg-mist/60 px-4 py-5 sm:px-5 lg:grid-cols-[1.3fr_1fr]">
          <dl className="grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-2">
            {extra.length === 0 && <p className="text-muted">No extra details.</p>}
            {extra.map(([k, v]) => (
              <div key={k} className={k === "message" || k === "user_agent" ? "sm:col-span-2" : undefined}>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">{fieldLabels[k] ?? k.replace(/_/g, " ")}</dt>
                <dd className={`mt-0.5 whitespace-pre-wrap break-words ${k === "user_agent" ? "text-[12px] text-muted" : ""}`}>{String(v)}</dd>
              </div>
            ))}
          </dl>
          <div className="grid content-start gap-2">
            <label htmlFor={`notes-${lead.id}`} className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Internal notes</label>
            <textarea id={`notes-${lead.id}`} value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Called, left voicemail…" className="rounded-xl border border-line bg-paper px-3 py-2.5 text-[14px] outline-none focus:border-sky-600" />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" disabled={pending} onClick={() => start(async () => { try { await saveNotes(lead.id, notes); alertSoft("Saved"); } catch { alertSoft("Couldn’t save. Try again."); } })} className="rounded-full bg-navy-900 px-4 py-2 text-[13.5px] font-semibold text-white disabled:opacity-60">
                Save notes
              </button>
              <button type="button" disabled={pending} onClick={() => { if (window.confirm(`Delete ${name}? This can’t be undone.`)) start(async () => { try { await removeLead(lead.id); } catch { alertSoft("Couldn’t delete. Try again."); } }); }} className="rounded-full px-3 py-2 text-[13.5px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">
                Delete
              </button>
              {saved && <span className="text-[13px] text-muted" role="status">{saved}</span>}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
