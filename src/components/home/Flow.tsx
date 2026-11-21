"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow, Section, SectionHead } from "@/components/ui";
import { BookingDemo } from "./BookingDemo";
import { CallingDemo } from "./CallingDemo";
import { LeadsDemo } from "./LeadsDemo";
import { PipelineDemo } from "./PipelineDemo";
import { QualifyDemo } from "./QualifyDemo";

const demos = { leads: LeadsDemo, calling: CallingDemo, qualify: QualifyDemo, booking: BookingDemo, pipeline: PipelineDemo };
function LiveDemo({ name }: { name: keyof typeof demos }) {
  const Demo = demos[name];
  return <Demo />;
}
import styles from "./Flow.module.css";

/** Actual product screens captured from RealtyCare CRM, with contacts hidden. */
const steps = [
  {
    title: "Lead captured",
    body: "From your website, landing pages, Facebook lead ads or portals like Zillow. It lands in one inbox.",
    screen: "leads", label: "Your lead inbox", width: 1152, height: 650, live: "leads" as const,
    alt: "RealtyCare lead workspace with filters, qualification totals and the lead inbox. Contact details are blurred.",
  },
  {
    title: "AI calls within 60 seconds*",
    body: "Your AI assistant calls, introduces itself as an AI and starts a natural conversation.",
    screen: "calling-overview", label: "AI calling overview", width: 1152, height: 530, live: "calling" as const,
    alt: "Actual RealtyCare AI Calling Overview with lead totals, appointment metrics and AI lead summary.",
  },
  {
    title: "Lead qualified",
    body: "Budget, timeline, location and pre-approval, asked the way you would ask them.",
    screen: "qualification", label: "AI lead qualification", width: 544, height: 265, live: "qualify" as const,
    alt: "RealtyCare AI Lead Summary showing the qualification chart and qualified, follow-up and not-qualified categories.",
  },
  {
    title: "Appointment booked",
    body: "Qualified leads pick a time on your calendar, or get transferred to you live.",
    screen: "appointments", label: "Your appointment calendar", width: 1152, height: 880, live: "booking" as const,
    alt: "RealtyCare appointment workspace showing the monthly calendar, booking controls and daily agenda.",
  },
  {
    title: "Deal in your pipeline",
    body: "Every call, note and next step is in your CRM. Leads who aren’t ready stay on follow-up for 12 months.",
    screen: "pipeline", label: "Your CRM pipeline", width: 686, height: 253, live: "pipeline" as const,
    alt: "RealtyCare CRM pipeline showing New Lead, Contacted, Application and Appointment Set stages.",
  },
];

export function Flow() {
  const listRef = useRef<HTMLOListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<(typeof steps)[number] | null>(null);

  useEffect(() => {
    if (selected && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [selected]);

  useEffect(() => {
    if (!listRef.current || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    listRef.current.querySelectorAll("li").forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight) return;
      item.setAttribute("data-reveal", "true");
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="how-it-works" className={styles.section}>
      <SectionHead
        eyebrow="HOW REALTYCARE WORKS"
        title={<>From first inquiry to booked appointment, <span className="accent">here&rsquo;s the flow.</span></>}
        intro="See how RealtyCare captures, calls and qualifies new leads while you keep working your business."
      />
      <ol ref={listRef} className={styles.workflow}>
        {steps.map((step, i) => (
          <li key={step.title} className={styles.step}>
            {i < steps.length - 1 && (
              <svg className={styles.connector} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d={i % 2 ? "M50 0 C-7 32 -7 68 50 100" : "M50 0 C107 32 107 68 50 100"} />
              </svg>
            )}
            <span className={styles.number} aria-hidden="true">{i + 1}</span>
            <div className={styles.copy}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            <div className={styles.preview}>
              <button type="button" className={styles.screenCard} onClick={() => setSelected(step)} aria-label={`View larger screenshot: ${step.label}`} aria-haspopup="dialog">
                <span className={styles.screenBar}>
                  <span className={styles.screenBrand}><span className={styles.brandMark} aria-hidden="true" />RealtyCare<span className={styles.screenDivider}>/</span><span className={styles.screenLabel}>{step.label}</span></span>
                  <span className={styles.expand} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" /></svg></span>
                </span>
                <span className={styles.screenCanvas} data-live>
                  <LiveDemo name={step.live} />
                </span>
                <span className={styles.screenFooter}><span>Actual product screen</span><span className={styles.viewScreen}>View screen <Arrow className="h-3.5 w-3.5" /></span></span>
              </button>
            </div>
          </li>
        ))}
      </ol>
      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="crm-screen-title" onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        {selected && <div className={styles.dialogContent}>
          <div className={styles.dialogHeader}>
            <div><p className={styles.dialogEyebrow}>REALTYCARE CRM</p><h3 id="crm-screen-title">{selected.label}</h3></div>
            <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()} aria-label="Close screenshot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
          </div>
          <div className={styles.dialogImage}><Image src={`/images/crm/${selected.screen}.webp`} alt={selected.alt} width={selected.width} height={selected.height} sizes="92vw" /></div>
          <p className={styles.dialogCaption}>Actual product screen. Contact details are hidden.</p>
        </div>}
      </dialog>
    </Section>
  );
}
