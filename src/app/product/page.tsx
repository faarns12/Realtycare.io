import type { Metadata } from "next";
import type { ReactNode } from "react";
import { bookHref, sixtySecondFootnote } from "@/content/site";
import { AdsMock, AutomationMock, CallLogMock, PipelineMock } from "@/components/product/Mocks";
import { CtaBand } from "@/components/CtaBand";
import { ButtonLink, Check, Container, Section, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Product",
  description: "AI calling, CRM and pipeline, automated follow-up, ads and websites for realtors, in one platform.",
};

const features: { id: string; eyebrow: string; title: ReactNode; body: string; points: string[]; mock: ReactNode }[] = [
  {
    id: "calling",
    eyebrow: "AI Calling",
    title: (
      <>
        Every new lead gets a call <em className="accent">in under a minute.*</em>
      </>
    ),
    body: "Your AI assistant calls, says it’s an AI working for you, qualifies the lead with your questions and books the appointment or transfers the call to you.",
    points: ["Natural voice, your script and your questions", "Books onto your calendar or live-transfers hot leads", "Every call recorded, summarised and saved"],
    mock: <CallLogMock />,
  },
  {
    id: "crm",
    eyebrow: "CRM & Pipeline",
    title: (
      <>
        One pipeline from <em className="accent">new lead to closed.</em>
      </>
    ),
    body: "Leads move through New, Contacted, Qualified, Appointment and Closed as the AI works them. Drag a card to move it yourself, or connect the CRM you already use.",
    points: ["Lead table with source, status and last contact", "Notes, calls and texts on one timeline", "Works with your existing CRM [LIST SUPPORTED CRMs]"],
    mock: <PipelineMock />,
  },
  {
    id: "automation",
    eyebrow: "Automation",
    title: (
      <>
        Follow-up that keeps going <em className="accent">for 12 months.</em>
      </>
    ),
    body: "Most leads aren’t ready on day one. Calls, texts and emails keep them warm on a set schedule until they are, then the AI books them.",
    points: ["Calls, texts and emails on one schedule", "Stops automatically when a lead replies or books", "Old-lead reactivation on Pro"],
    mock: <AutomationMock />,
  },
  {
    id: "ads",
    eyebrow: "Marketing & Ads",
    title: (
      <>
        Ads that bring leads, <em className="accent">and a team that calls them.</em>
      </>
    ),
    body: "On Growth and Pro we run your Facebook, Instagram and Google campaigns, design the ads and build the landing pages. You see spend, leads and cost per lead in one place.",
    points: ["New ad designs every month", "Landing pages built to capture leads", "Your ad budget goes straight to Meta or Google"],
    mock: <AdsMock />,
  },
];

const compliance = [
  ["Consent first", "We only call and text leads who agreed to be contacted on your forms."],
  ["Do Not Call checks", "Numbers are checked against the National Do Not Call Registry and your own list."],
  ["Calling hours", "Calls go out between 8am and 9pm in the lead’s time zone (stricter where state law says so)."],
  ["AI disclosure", "The assistant says it’s an AI at the start of every call."],
];

export default function ProductPage() {
  return (
    <>
      <section className="pb-12 pt-10 text-center sm:pt-16">
        <Container>
          <p className="mx-auto mb-5 inline-flex rounded-full border border-line bg-mist px-3 py-1 text-[13px] font-medium text-muted">The operating system for your real estate business</p>
          <h1 className="mx-auto max-w-4xl text-[44px] font-semibold sm:text-[68px]">
            Everything between the ad <em className="accent">and the appointment.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] text-muted">AI calling, CRM, follow-up, ads and websites in one platform, so no lead waits and nothing falls through the cracks.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={bookHref} arrow>
              Book a strategy call
            </ButtonLink>
            <ButtonLink href="/#demo" variant="outline">
              Hear the AI call you
            </ButtonLink>
          </div>
          <nav aria-label="Features" className="mt-10 flex flex-wrap justify-center gap-2">
            {features.map((f) => (
              <a key={f.id} href={`#${f.id}`} className="rounded-full border border-line px-4 py-2 text-[14px] font-medium hover:border-ink">
                {f.eyebrow}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      {features.map((f, i) => (
        <Section key={f.id} id={f.id} className={i % 2 ? "bg-mist" : ""}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 ? "lg:order-2" : ""}>
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-sky-700">{f.eyebrow}</p>
              <h2 className="text-[34px] font-semibold sm:text-[44px]">{f.title}</h2>
              <p className="mt-4 text-[16.5px] text-muted">{f.body}</p>
              <ul className="mt-6 grid gap-3 text-[15px]">
                {f.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Check className="mt-1 h-4 w-4 text-sky-600" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">{f.mock}</div>
          </div>
        </Section>
      ))}

      <Section id="compliance">
        <SectionHead
          eyebrow="Built for US rules"
          title={
            <>
              Fast, and <em className="accent">by the book.</em>
            </>
          }
          intro="Calling leads quickly only helps if it’s done properly. These are on for every account."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {compliance.map(([t, b]) => (
            <div key={t} className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
              <h3 className="text-[18px] font-semibold">{t}</h3>
              <p className="mt-2 text-[14.5px] text-muted">{b}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[12px] text-muted">Screens show example data. {sixtySecondFootnote}</p>
      </Section>

      <CtaBand />
    </>
  );
}
