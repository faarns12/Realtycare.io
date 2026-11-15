import { Container } from "@/components/ui";

const services = [
  { title: "AI calling", body: "Calls, qualifies and books new leads, then follows up for months.", icon: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" },
  { title: "Ads", body: "Facebook, Instagram and Google campaigns that bring local buyers and sellers.", icon: "M3 11l15-6v14L3 13zM7 13v5a2 2 0 004 0v-4" },
  { title: "Websites", body: "Property sites and landing pages built to capture leads.", icon: "M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" },
  { title: "CRM", body: "Every contact, call, text and appointment in one pipeline.", icon: "M4 6h16M4 12h10M4 18h6M18 14l2 2-4 4h-2v-2z" },
];

const vendors = [
  ["Inside sales agent", "$1,988"],
  ["CRM + dialer", "$108"],
  ["Texting + email tools", "$125"],
  ["Website", "$149"],
  ["Ad agency", "$750"],
];

export function OneTeam() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="on-dark overflow-hidden rounded-[var(--radius-sheet)] bg-navy-900 px-5 py-12 text-white sm:px-10 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[34px] font-semibold text-white sm:text-[48px]">
              One team instead of <em className="accent">five different vendors.</em>
            </h2>
            <p className="mt-4 text-[17px] text-navy-300">Lead generation, AI calling, websites, CRM and follow-up, working together on one monthly bill.</p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.title} className="flex gap-4 rounded-2xl border border-white/10 bg-navy-800 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-400/15 text-sky-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={s.icon} />
                  </svg>
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-[14.5px] text-navy-300">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-navy-300">The usual stack, per month</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {vendors.map(([k, v]) => (
                  <li key={k} className="rounded-full border border-white/12 px-3 py-1.5 text-[13px] text-white/85">
                    {k} <span className="tabular text-navy-300">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:text-right">
              <p className="text-[13px] text-navy-300">Usual total, before ad budget</p>
              <p className="tabular font-serif text-[48px] leading-none text-white line-through decoration-white/30">$3,120</p>
              <p className="mt-1 text-[14px] text-sky-300">RealtyCare Growth: $1,499 with ads managed</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
