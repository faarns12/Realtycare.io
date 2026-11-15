"use client";

import { useMemo, useState } from "react";
import { money, plans, type PlanId } from "@/content/plans";
import { calculate, defaults, followers, type Follower, type Inputs } from "@/lib/calculator";
import { useLeadForm } from "@/lib/useLeadForm";
import { Button } from "@/components/ui";
import { FormMessage, Honeypot } from "@/components/forms/fields";

const n0 = (n: number) => Math.round(n).toLocaleString("en-US");
const toNum = (s: string) => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return isFinite(v) && v >= 0 ? v : 0;
};

export function Calculator() {
  const [input, setInput] = useState<Inputs>({ ...defaults, agencyRunsAds: false });
  const [chosen, setChosen] = useState<PlanId | null>(null);
  const r = useMemo(() => calculate(input, chosen ?? undefined), [input, chosen]);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInput((s) => ({ ...s, [k]: v }));

  const clientsText = r.leads > 0 ? (Math.round(r.clients.low) === Math.round(r.clients.high) ? String(Math.round(r.clients.low)) : `${Math.round(r.clients.low)}–${Math.round(r.clients.high)}`) : "0";
  const ourTotal = r.ours?.total ?? null;
  const maxBar = Math.max(input.adBudget, ourTotal ?? input.adBudget, r.commission.mid, 1);
  const maxSide = Math.max(r.usualTotal, ourTotal ?? 0, 1);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[380px_1fr]">
      {/* ---------- Inputs ---------- */}
      <form className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-card)] sm:p-6 lg:sticky lg:top-24" onSubmit={(e) => e.preventDefault()} aria-label="Your numbers">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-[18px] font-semibold">Your numbers</h2>
          <span className="text-[12px] text-muted">Updates as you type</span>
        </div>

        <MoneyField id="ad" label="Monthly ad budget" value={input.adBudget} onChange={(v) => set("adBudget", v)} suffix="/ month" side={input.adBudget > 0 ? `≈ ${n0(r.adLeads)} leads` : ""} />
        <input
          type="range"
          min={0}
          max={10000}
          step={250}
          value={Math.min(10000, input.adBudget)}
          onChange={(e) => set("adBudget", Number(e.target.value))}
          aria-label="Monthly ad budget slider"
          className="mt-3 w-full accent-[var(--color-sky-600)]"
        />
        <div className="tabular flex justify-between text-[11px] text-muted" aria-hidden="true">
          <span>$0</span><span>$2.5k</span><span>$5k</span><span>$7.5k</span><span>$10k</span>
        </div>
        <p className="mb-5 mt-1.5 text-[12.5px] text-muted">Paid to Facebook, Instagram or Google. Enter $0 if you don’t run ads.</p>

        <MoneyField id="com" label="Average commission per closing" value={input.commission} onChange={(v) => set("commission", v)} />
        <p className="mb-5 mt-1.5 text-[12.5px] text-muted">What you take home from one deal, before your own costs.</p>

        <MoneyField id="other" label="Leads you already get each month" value={input.otherLeads} onChange={(v) => set("otherLeads", v)} prefix="" suffix="leads" />
        <p className="mb-5 mt-1.5 text-[12.5px] text-muted">Zillow, your website, open houses, referrals. We call these too.</p>

        <fieldset className="mb-5">
          <legend className="mb-2 text-[13px] font-semibold">Who follows up with your leads today?</legend>
          <div className="grid gap-1.5">
            {(Object.keys(followers) as Follower[]).map((k) => (
              <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-[14px] transition-colors ${input.follower === k ? "border-sky-600 bg-sky-50" : "border-line hover:border-line-strong"}`}>
                <input type="radio" name="follower" checked={input.follower === k} onChange={() => set("follower", k)} className="accent-[var(--color-sky-600)]" />
                <span className="font-medium">{followers[k].label}</span>
                <span className="tabular ml-auto text-[12.5px] text-muted">{followers[k].note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <details className="border-t border-line pt-2">
          <summary className="flex min-h-10 cursor-pointer items-center text-[13px] font-semibold text-sky-700">Fine-tune the assumptions</summary>
          {(
            [
              ["costPerLead", "Cost per lead ($)"],
              ["conversionPct", "Leads that become clients (%)"],
              ["crm", "CRM + dialer ($/mo)"],
              ["texting", "Texting tool ($/mo)"],
              ["email", "Email marketing ($/mo)"],
              ["website", "Website with listings ($/mo)"],
              ["agency", "Ad manager or agency ($/mo)"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="grid grid-cols-[1fr_96px] items-center gap-3 py-1.5 text-[13px] text-muted">
              {label}
              <input
                inputMode="decimal"
                defaultValue={String(input[k])}
                onChange={(e) => set(k, toNum(e.target.value))}
                className="tabular w-full rounded-lg border border-line bg-mist px-2.5 py-2 text-right text-[14px] text-ink outline-none focus:border-sky-600"
              />
            </label>
          ))}
          <p className="mt-2 text-[12.5px] text-muted">Defaults: $1,500 in ads brings about 280–300 leads, and about 4–6 of every 300 leads become clients.</p>
        </details>
      </form>

      {/* ---------- Results ---------- */}
      <div className="grid min-w-0 gap-5" aria-live="polite">
        <section className="on-dark rounded-[var(--radius-card)] bg-navy-900 p-5 text-white sm:p-7" aria-label="Your estimate">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-navy-300">Your month, estimated</p>
            <p className="text-[12px] text-navy-300">At about ${input.costPerLead.toFixed(2)} per lead</p>
          </div>
          <div className="mt-5 grid sm:grid-cols-3">
            <Fig k="Leads" v={n0(r.leads)} s={input.otherLeads > 0 && input.adBudget > 0 ? `${n0(r.adLeads)} from ads + ${n0(input.otherLeads)} you get` : input.adBudget > 0 ? "from your ad budget" : input.otherLeads > 0 ? "leads you already get" : "add a budget or your leads"} />
            <Fig k="New clients" v={clientsText} s="if every lead is followed up" />
            <Fig k="Commission" v={money(r.commission.mid)} s={r.leads > 0 ? `likely ${money(r.commission.low)}–${money(r.commission.high)}` : "add leads to estimate"} gold />
          </div>
          <div className="mt-6 grid gap-2 border-t border-white/10 pt-5" aria-hidden="true">
            <Bar label="Ad budget" value={input.adBudget} max={maxBar} />
            <Bar label="Your total cost" value={ourTotal ?? input.adBudget} max={maxBar} text={ourTotal == null ? "Custom" : undefined} />
            <Bar label="Commission" value={r.commission.mid} max={maxBar} gold />
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-card)] sm:p-6" aria-labelledby="plan-h">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="plan-h" className="text-[18px] font-semibold">Pick a plan to see your exact monthly cost</h2>
            <p className="text-[13px] text-muted">No setup fee</p>
          </div>
          <fieldset className="grid grid-cols-3 gap-1 rounded-2xl border border-line bg-mist p-1 sm:grid-cols-5">
            <legend className="sr-only">Plan</legend>
            {plans.map((p) => (
              <label key={p.id} className={`relative grid cursor-pointer gap-0.5 rounded-xl border px-3 py-2.5 transition-colors ${r.plan.id === p.id ? "border-line-strong bg-paper shadow-[0_1px_3px_rgb(15_30_46/0.12)]" : "border-transparent hover:bg-paper"}`}>
                <input type="radio" name="plan" className="sr-only" checked={r.plan.id === p.id} onChange={() => setChosen(p.id)} />
                <span className="text-[14px] font-semibold">{p.name}</span>
                <span className="tabular text-[12px] text-muted">{p.fee == null ? "Custom" : `${money(p.fee)}/mo`}</span>
                {r.recommended === p.id && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-400" aria-label="fits your numbers" />}
              </label>
            ))}
          </fieldset>
          <p className="mt-2.5 flex items-center gap-2 text-[12.5px] text-muted">
            <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
            {r.recommended === r.plan.id
              ? `${r.plan.name} fits your numbers`
              : `${plans.find((p) => p.id === r.recommended)!.name} fits your numbers best. You’re viewing ${r.plan.name}.`}
          </p>

          <div className="mt-6 grid gap-7 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">What you pay each month</h3>
              <ul>
                {r.ours ? (
                  <>
                    <Line k={`${r.plan.name} plan`} v={money(r.ours.fee)} />
                    <Line k="Ad budget (to Meta/Google)" v={money(input.adBudget)} />
                    {r.plan.managesAds && input.adBudget > 0 && <Line k="Ad management" v="Included" tone="good" />}
                    {!r.plan.managesAds && input.adBudget > 0 && (r.ours.outsideAgency > 0 ? <Line k="Outside ad agency" v={money(r.ours.outsideAgency)} /> : <Line k="Ad management" v="You do it" tone="muted" />)}
                    {r.ours.extraLeads > 0 && <Line k={`${n0(r.ours.extraLeads)} extra leads at $2`} v={money(r.ours.leadOverage)} />}
                    {r.ours.otherOverage > 0.5 && <Line k="Extra minutes and texts" v={money(r.ours.otherOverage)} />}
                    <Line k="Total each month" v={money(r.ours.total)} total />
                  </>
                ) : (
                  <>
                    <Line k="Brokerage plan" v="Custom quote" />
                    <Line k="Ad budget (to Meta/Google)" v={money(input.adBudget)} />
                    <Line k="Total" v="Custom" total />
                  </>
                )}
              </ul>
              {!r.plan.managesAds && input.adBudget > 0 && (
                <fieldset className="mt-4">
                  <legend className="mb-2 text-[13px] font-semibold">Who runs your ads on this plan?</legend>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      [false, "I do"],
                      [true, `An agency · ${money(input.agency)}`],
                    ].map(([val, label]) => (
                      <label key={String(val)} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-[13.5px] ${input.agencyRunsAds === val ? "border-sky-600 bg-sky-50" : "border-line"}`}>
                        <input type="radio" name="runner" checked={input.agencyRunsAds === val} onChange={() => set("agencyRunsAds", val as boolean)} className="accent-[var(--color-sky-600)]" />
                        {label as string}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Your usage vs what’s included</h3>
              <Meter label="New leads called" used={r.usage.leads.used} cap={r.usage.leads.cap} unit="leads" />
              <Meter label="AI call minutes" used={r.usage.minutes.used} cap={r.usage.minutes.cap} unit="min" />
              <Meter label="Follow-up texts" used={r.usage.texts.used} cap={r.usage.texts.cap} unit="texts" />
              <Meter label="Follow-up emails" used={r.usage.emails.used} cap={r.usage.emails.cap} unit="emails" />
            </div>
          </div>
          {r.warnings.length > 0 && (
            <p className="mt-5 flex gap-3 rounded-xl border border-gold-400/50 bg-gold-50 px-4 py-3 text-[13.5px]">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-400 text-[12px] font-bold text-navy-900" aria-hidden="true">!</span>
              {r.warnings.join(" ")}
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper shadow-[var(--shadow-card)]" aria-labelledby="cmp-h">
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 sm:px-6">
            <h2 id="cmp-h" className="text-[18px] font-semibold">The usual way vs RealtyCare.io</h2>
            <p className="text-[13px] text-muted">Per month, including ad budget</p>
          </div>
          <div className="grid md:grid-cols-2">
            <div className="px-5 pb-6 pt-4 sm:px-6">
              <SideHead title="Separate tools and people" chip="Usual way" />
              <p className="tabular mt-3 font-serif text-[46px] leading-none">{money(r.usualTotal)}</p>
              <Scale value={r.usualTotal} max={maxSide} />
              <ul className="mt-3">
                {r.usualLines.filter((l) => l.amount > 0 || l.label === "Ad budget").map((l) => (
                  <Line key={l.label} k={l.label} v={money(l.amount)} />
                ))}
                {input.follower === "self" && <Line k="Your calling time" v={`~${r.callingHours} hrs`} tone="muted" />}
              </ul>
            </div>
            <div className="border-t border-line px-5 pb-6 pt-4 sm:px-6 md:border-l md:border-t-0">
              <SideHead title="Everything in one place" chip={r.plan.name} accent />
              <p className="tabular mt-3 font-serif text-[46px] leading-none">{ourTotal == null ? "Custom" : money(ourTotal)}</p>
              <Scale value={ourTotal ?? 0} max={maxSide} accent />
              <ul className="mt-3">
                <Line k="Ad budget" v={money(input.adBudget)} />
                <Line k={`${r.plan.name} plan`} v={r.ours ? money(r.ours.fee) : "Custom quote"} />
                {r.ours && r.ours.outsideAgency > 0 && <Line k="Outside ad agency" v={money(r.ours.outsideAgency)} />}
                {r.ours && r.ours.leadOverage + r.ours.otherOverage > 0.5 && <Line k="Extra usage" v={money(r.ours.leadOverage + r.ours.otherOverage)} />}
                <Line k="Calls within 60 seconds*" v="Included" tone="good" />
                <Line k={`${r.plan.followUp} of follow-up`} v="Included" tone="good" />
                {r.plan.managesAds && <Line k="Ad management" v="Included" tone="good" />}
              </ul>
            </div>
          </div>
          <SaveBar r={r} />
        </section>

        <EmailResults input={input} r={r} />
      </div>
    </div>
  );
}

/* ---------- Pieces ---------- */

function MoneyField({ id, label, value, onChange, prefix = "$", suffix, side }: { id: string; label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; side?: string }) {
  const [text, setText] = useState(value.toLocaleString("en-US"));
  const shown = toNum(text) === value ? text : value.toLocaleString("en-US");
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-semibold">{label}</label>
        {side && <span className="text-[12px] text-muted">{side}</span>}
      </div>
      <div className="flex items-center gap-1 rounded-xl border border-line bg-mist px-4 transition-colors focus-within:border-sky-600 focus-within:bg-paper focus-within:ring-4 focus-within:ring-sky-50">
        {prefix && <span className="text-[20px] text-muted" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={shown}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, "");
            setText(raw ? Number(raw).toLocaleString("en-US") : "");
            onChange(raw ? Number(raw) : 0);
          }}
          className="tabular w-full min-w-0 bg-transparent py-3 font-display text-[24px] font-semibold tracking-[-0.02em] outline-none"
        />
        {suffix && <span className="whitespace-nowrap text-[12px] text-muted">{suffix}</span>}
      </div>
    </div>
  );
}

function Fig({ k, v, s, gold }: { k: string; v: string; s: string; gold?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 border-t border-white/10 py-4 first:border-t-0 sm:block sm:border-l sm:border-t-0 sm:px-5 sm:py-0 sm:first:border-l-0 sm:first:pl-0">
      <p className="text-[13px] text-navy-300">{k}</p>
      <p className={`tabular row-span-2 whitespace-nowrap text-right font-serif text-[44px] leading-none sm:mt-2 sm:text-left sm:text-[clamp(40px,4.4vw,58px)] ${gold ? "text-gold-400" : "text-white"}`}>{v}</p>
      <p className="mt-0.5 text-[12.5px] text-navy-300 sm:mt-2">{s}</p>
    </div>
  );
}

function Bar({ label, value, max, gold, text }: { label: string; value: number; max: number; gold?: boolean; text?: string }) {
  return (
    <div className="grid grid-cols-[92px_1fr_76px] items-center gap-3 text-[12.5px] text-navy-300">
      <span>{label}</span>
      <span className="h-2 overflow-hidden rounded bg-white/10">
        <span className={`block h-full rounded transition-[width] duration-300 ${gold ? "bg-gold-400" : "bg-sky-400"}`} style={{ width: `${(value / max) * 100}%` }} />
      </span>
      <b className="tabular text-right font-semibold text-white">{text ?? money(value)}</b>
    </div>
  );
}

function Line({ k, v, total, tone }: { k: string; v: string; total?: boolean; tone?: "good" | "muted" }) {
  return (
    <li className={`flex justify-between gap-3 py-2.5 text-[14px] ${total ? "pt-4 text-[15px] font-bold" : "border-b border-line"}`}>
      <span>{k}</span>
      <span className={`tabular whitespace-nowrap ${total ? "text-[20px]" : "font-medium"} ${tone === "good" ? "text-sky-700" : tone === "muted" ? "font-normal text-muted" : ""}`}>{v}</span>
    </li>
  );
}

function Meter({ label, used, cap, unit }: { label: string; used: number; cap: number | null; unit: string }) {
  const over = cap != null && used > cap;
  const pct = cap == null ? 30 : Math.min(100, cap > 0 ? (used / cap) * 100 : 0);
  return (
    <div className="py-2">
      <div className="mb-1.5 flex justify-between gap-3 text-[13.5px]">
        <span>{label}</span>
        <span className="tabular whitespace-nowrap text-[12.5px] text-muted">
          <b className={over ? "text-bad" : "text-ink"}>{n0(used)}</b>
          {cap == null ? ` ${unit} · custom` : ` / ${n0(cap)} ${unit}`}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full border border-line bg-mist" role="img" aria-label={`${label}: ${n0(used)} of ${cap == null ? "custom" : n0(cap)}`}>
        <div className={`h-full rounded-full transition-[width] duration-300 ${over ? "bg-bad" : "bg-sky-600"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SideHead({ title, chip, accent }: { title: string; chip: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="font-sans text-[14px] font-semibold tracking-normal">{title}</h3>
      <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] ${accent ? "bg-sky-50 text-sky-700" : "bg-mist text-muted"}`}>{chip}</span>
    </div>
  );
}

function Scale({ value, max, accent }: { value: number; max: number; accent?: boolean }) {
  return (
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist">
      <div className={`h-full rounded-full transition-[width] duration-300 ${accent ? "bg-sky-600" : "bg-line-strong"}`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

function SaveBar({ r }: { r: ReturnType<typeof calculate> }) {
  if (r.savings == null)
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-mist px-5 py-4 sm:px-6">
        <p className="font-semibold">Brokerage pricing</p>
        <p className="text-[13px]">Priced for your team size and lead volume.</p>
      </div>
    );
  const save = r.savings;
  return (
    <div className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line px-5 py-4 sm:px-6 ${save >= 0 ? "bg-gold-50" : "bg-mist"}`}>
      <div className="flex flex-wrap items-baseline gap-x-4">
        <p className={`text-[14px] font-semibold ${save >= 0 ? "text-gold-800" : "text-muted"}`}>{save >= 0 ? "You could save every month" : "This plan costs more each month by"}</p>
        <p className="tabular font-serif text-[44px] leading-none">{money(Math.abs(save))}</p>
      </div>
      <div className="text-[13px]">
        <p>{save >= 0 ? `That’s ${money(save * 12)} a year.` : `It adds 60-second calling and ${r.plan.followUp} of follow-up.`}</p>
        <p>{r.leads > 0 ? `Plus about ${r.callingHours} hours of calling you don’t do yourself.` : "Every lead called within 60 seconds.*"}</p>
      </div>
    </div>
  );
}

/** Lets a realtor email themselves the breakdown. Their inputs and results are saved to the "Calculator" tab. */
function EmailResults({ input, r }: { input: Inputs; r: ReturnType<typeof calculate> }) {
  const { status, error, onSubmit, honeypotName } = useLeadForm("calculator", {
    extra: () => ({
      ad_budget: String(input.adBudget),
      commission: String(input.commission),
      other_leads: String(input.otherLeads),
      follows_up_today: followers[input.follower].label,
      est_leads: String(Math.round(r.leads)),
      est_clients: `${Math.round(r.clients.low)} to ${Math.round(r.clients.high)}`,
      est_commission: String(Math.round(r.commission.mid)),
      plan_viewed: r.plan.name,
      plan_recommended: plans.find((p) => p.id === r.recommended)!.name,
      plan_total: r.ours ? String(Math.round(r.ours.total)) : "custom",
      usual_total: String(Math.round(r.usualTotal)),
      monthly_savings: r.savings == null ? "" : String(Math.round(r.savings)),
    }),
  });
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-mist p-5 sm:p-6" aria-labelledby="email-h">
      <h2 id="email-h" className="text-[18px] font-semibold">Get this breakdown by email</h2>
      <p className="mt-1 text-[14px] text-muted">We’ll send your numbers and the plan that fits, so you can come back to them.</p>
      <form onSubmit={onSubmit} className="relative mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <Honeypot name={honeypotName} />
        <label className="sr-only" htmlFor="calc-name">First name</label>
        <input id="calc-name" name="first_name" placeholder="First name" autoComplete="given-name" className="rounded-xl border border-line bg-paper px-4 py-3 text-[15px] outline-none focus:border-sky-600" />
        <label className="sr-only" htmlFor="calc-email">Email</label>
        <input id="calc-email" name="email" type="email" required placeholder="Email address" autoComplete="email" className="rounded-xl border border-line bg-paper px-4 py-3 text-[15px] outline-none focus:border-sky-600" />
        <Button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Email me"}</Button>
      </form>
      <div className="mt-3">
        <FormMessage status={status} error={error} success="Sent. Check your inbox in a few minutes." />
      </div>
    </section>
  );
}
