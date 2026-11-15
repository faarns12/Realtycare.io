import Link from "next/link";
import { money, plans } from "@/content/plans";
import { Section, SectionHead } from "@/components/ui";

export function PlansTeaser() {
  return (
    <Section className="bg-mist">
      <SectionHead
        eyebrow="Pricing"
        title={
          <>
            Plans from $349 a month. <em className="accent">No setup fee.</em>
          </>
        }
        intro="Prices on the page. Every plan includes 60-second AI calling.*"
      />
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-5">
        {plans.map((p) => (
          <Link
            key={p.id}
            href="/pricing"
            className={`group rounded-2xl border p-4 transition-colors ${p.recommended ? "on-dark border-navy-900 bg-navy-900 text-white" : "border-line bg-paper hover:border-ink"} ${p.id === "brokerage" ? "col-span-2 md:col-span-1" : ""}`}
          >
            <p className="font-semibold">{p.name}</p>
            <p className="tabular mt-2 font-display text-[26px] font-semibold tracking-[-0.03em]">{p.fee == null ? "Custom" : money(p.fee)}</p>
            <p className={`text-[12.5px] ${p.recommended ? "text-navy-300" : "text-muted"}`}>
              {p.fee == null ? "for teams" : p.managesAds ? "/mo + ad budget" : "/mo"}
            </p>
            <p className={`mt-3 text-[13px] ${p.recommended ? "text-sky-300" : "text-sky-700"}`}>
              Up to {p.limits.leads?.toLocaleString("en-US")}
              {p.id === "brokerage" ? "+" : ""} leads →
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
