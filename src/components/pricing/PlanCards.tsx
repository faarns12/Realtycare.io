import { bookHref } from "@/content/site";
import { money, plans } from "@/content/plans";
import { ButtonLink, Check, Cross } from "@/components/ui";

export function PlanCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
      {plans.map((p) => {
        const dark = !!p.recommended;
        return (
          <article
            key={p.id}
            className={`relative flex flex-col rounded-[var(--radius-card)] p-5 ${
              dark ? "on-dark bg-navy-900 text-white shadow-[var(--shadow-pop)] lg:-my-3 lg:py-8" : "border border-line bg-paper shadow-[var(--shadow-card)]"
            }`}
          >
            {dark && <span className="mb-3 self-start rounded-full bg-gold-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-navy-900">Recommended</span>}
            <h3 className={`text-[22px] font-semibold ${dark ? "text-white" : ""}`}>{p.name}</h3>
            <p className={`mt-1 min-h-[42px] text-[13.5px] ${dark ? "text-navy-300" : "text-muted"}`}>{p.pitch}</p>

            <p className="tabular mt-4 font-display text-[38px] font-semibold leading-none tracking-[-0.04em]">
              {p.fee == null ? "Custom" : money(p.fee)}
              {p.fee != null && <span className={`ml-1 text-[14px] font-medium tracking-normal ${dark ? "text-navy-300" : "text-muted"}`}>/mo</span>}
            </p>
            <p className={`mt-1 min-h-[20px] text-[13px] ${dark ? "text-sky-300" : "text-muted"}`}>{p.managesAds && p.fee != null ? "+ your ad budget" : p.fee == null ? "Priced for your team" : "No ad budget needed"}</p>

            <p className={`mt-4 border-t pt-4 text-[14px] font-semibold ${dark ? "border-white/10" : "border-line"}`}>
              {p.id === "brokerage" ? "1,000+" : `Up to ${p.limits.leads}`} leads called a month
            </p>

            <ButtonLink
              href={bookHref}
              variant={dark ? "bright" : "dark"}
              className="mt-4 w-full"
            >
              {p.fee == null ? "Contact us" : "Book a call"}
            </ButtonLink>

            <ul className="mt-5 grid gap-2 text-[13.5px]">
              {p.includes.map((i) => (
                <li key={i} className="flex gap-2">
                  <Check className={`mt-0.5 h-4 w-4 ${dark ? "text-sky-400" : "text-sky-600"}`} />
                  {i}
                </li>
              ))}
            </ul>
            {p.notIncluded && (
              <>
                <p className={`mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] ${dark ? "text-navy-300" : "text-muted"}`}>Not included</p>
                <ul className={`mt-2 grid gap-2 text-[13.5px] ${dark ? "text-navy-300" : "text-muted"}`}>
                  {p.notIncluded.map((i) => (
                    <li key={i} className="flex gap-2">
                      <Cross className={`mt-0.5 h-4 w-4 ${dark ? "text-navy-300" : "text-muted"}`} />
                      {i}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
