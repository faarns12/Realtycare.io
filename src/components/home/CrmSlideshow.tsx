"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./CrmSlideshow.module.css";

/** A rectangle in percent of the screenshot: [left, top, width, height]. */
type Rect = [number, number, number, number];

/** One beat of the scripted "someone is using the CRM" demo. Coordinates are % of the screenshot. */
type Step = {
  x: number;
  y: number;
  /** How long to stay after arriving (ms). */
  hold?: number;
  click?: boolean;
  /** Highlight ring around the element under the cursor. */
  ring?: Rect;
  /** Camera zoom (1 = none). Persists until a later step changes it. */
  zoom?: number;
  /** Text typed into the slide's input after arriving. */
  type?: string;
  /** Small notification shown after the click. */
  toast?: string;
};

type Slide = { src: string; title: string; width: number; height: number; input?: Rect; script: Step[] };

const slides: Slide[] = [
  {
    src: "calling-overview", title: "AI calling dashboard", width: 1152, height: 530,
    script: [
      { x: 58, y: 88, hold: 500 },
      { x: 12, y: 32, ring: [0, 16.4, 24, 27.6], hold: 1000 },
      { x: 63, y: 32, ring: [50.7, 16.4, 24, 27.6], hold: 900 },
      { x: 41, y: 54, click: true, ring: [36.4, 50.8, 9.1, 6.2], zoom: 1.35, hold: 1200 },
      { x: 24, y: 69.5, ring: [15.8, 65.8, 29.2, 7], hold: 1300 },
      { x: 92, y: 6, click: true, zoom: 1, ring: [83.8, 1.5, 15.9, 9], toast: "Showing all-time results", hold: 1600 },
    ],
  },
  {
    src: "leads", title: "Lead inbox", width: 1152, height: 650, input: [4.6, 38.3, 73, 4.6],
    script: [
      { x: 50, y: 92, hold: 400 },
      { x: 30, y: 40.5, click: true, ring: [1.3, 37.2, 78.7, 6.6], zoom: 1.25, type: "Live Test", hold: 800 },
      { x: 20.5, y: 59.2, click: true, ring: [15.8, 56.6, 8.9, 5.4], hold: 900 },
      { x: 13, y: 75.8, zoom: 1, ring: [0.3, 71, 99.4, 10], hold: 1000 },
      { x: 69.5, y: 75.8, click: true, ring: [65.8, 72.5, 7.2, 6.5], toast: "Lead status updated", hold: 1400 },
      { x: 95, y: 5.8, click: true, ring: [89.4, 2.3, 10.6, 7.2], toast: "New lead form opened", hold: 1500 },
    ],
  },
  {
    src: "appointments", title: "Appointment calendar", width: 1152, height: 880,
    script: [
      { x: 55, y: 95, hold: 400 },
      { x: 87, y: 30.3, click: true, ring: [83.3, 28.4, 7.4, 4], hold: 700 },
      { x: 79.4, y: 30.3, click: true, ring: [75.6, 28.2, 7.6, 4.2], hold: 700 },
      { x: 42, y: 68.5, click: true, zoom: 1.3, ring: [38.1, 64.5, 9.2, 8.1], hold: 1000 },
      { x: 84.8, y: 72.8, click: true, ring: [69.4, 70.7, 29.3, 4.6], toast: "Appointment booked · Thu 19, 10 AM", hold: 1700 },
      { x: 91.5, y: 4.5, zoom: 1, ring: [83.1, 1.9, 16.5, 5.3], hold: 1100 },
    ],
  },
];

const MOVE_MS = 950;
const TYPE_MS = 80;

export function CrmSlideshow({ bare = false }: { bare?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [typed, setTyped] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    return () => { media.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  const goTo = useCallback((index: number) => {
    setActive(index);
    setStep(0);
    setClicks(0);
    setTyped("");
    setToast(null);
  }, []);

  // In the laptop mockup the demo keeps running under the visitor's mouse; elsewhere hover pauses it.
  const playing = visible && !paused && !(interacting && !bare) && !reduced;

  // Drive the scripted cursor: move → (click / type / toast) → hold → next step or next slide.
  useEffect(() => {
    if (!playing) return;
    const script = slides[active].script;
    const current = script[step];
    const arrive = step === 0 ? 250 : MOVE_MS;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    if (current.click) later(() => setClicks((value) => value + 1), arrive);
    if (current.toast) {
      later(() => setToast(current.toast!), arrive + 180);
      later(() => setToast(null), arrive + 180 + 2200);
    }
    const text = current.type ?? "";
    for (let i = 0; i < text.length; i++) later(() => setTyped(text.slice(0, i + 1)), arrive + 250 + i * TYPE_MS);

    const total = arrive + (current.hold ?? 900) + (text ? 250 + text.length * TYPE_MS : 0);
    later(() => {
      if (document.hidden) return;
      if (step + 1 < script.length) setStep(step + 1);
      else goTo((active + 1) % slides.length);
    }, total);
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [playing, active, step, goTo]);

  return (
    <div ref={root} className={bare ? `${styles.player} ${styles.bare}` : styles.player} role="region" aria-roledescription="carousel" aria-label="RealtyCare product screenshots" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false); }}>
      <div className={styles.stage} aria-live={playing ? "off" : "polite"}>
        {slides.map((slide, index) => {
          const isActive = active === index;
          const script = slide.script;
          const current = isActive ? script[step] : script[0];
          const zoom = isActive ? script.slice(0, step + 1).reduce((value, s) => s.zoom ?? value, 1) : 1;
          const ring = isActive ? current.ring : undefined;
          return (
            <div key={slide.src} className={styles.slide} data-active={isActive} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.title}`} aria-hidden={!isActive}>
              <div className={styles.fit}>
                <div className={styles.frame} style={{ "--r": slide.width / slide.height } as CSSProperties}>
                  <div className={styles.camera} style={{ transform: `scale(${zoom})`, transformOrigin: `${current.x}% ${current.y}%` }}>
                    <Image src={`/images/crm/${slide.src}.webp`} alt={`Actual RealtyCare CRM: ${slide.title}`} width={slide.width} height={slide.height} sizes="(min-width: 1024px) 860px, 95vw" className={styles.image} loading="eager" />

                    {!reduced && slide.input && isActive && typed && (
                      <div className={styles.typed} style={rectStyle(slide.input)} aria-hidden="true">{typed}<i className={styles.caret} /></div>
                    )}

                    {!reduced && (
                      <div className={styles.ring} data-on={Boolean(ring)} style={ring ? rectStyle(ring) : undefined} aria-hidden="true" />
                    )}

                    {!reduced && isActive && (
                      <div className={styles.cursor} style={{ left: `${current.x}%`, top: `${current.y}%` }} aria-hidden="true">
                        {clicks > 0 && <span key={`r${clicks}`} className={styles.ripple} />}
                        <svg key={`c${clicks}`} className={clicks > 0 ? styles.press : undefined} viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 3.2v15.6c0 .6.7.9 1.1.5l3.6-3.4 2.4 5.6c.2.4.6.6 1 .4l2-.9c.4-.2.6-.6.4-1l-2.4-5.5h5c.6 0 .9-.7.5-1.1L6.1 2.7c-.4-.4-1.1-.1-1.1.5Z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {!reduced && isActive && (
                    <div className={styles.toast} data-on={Boolean(toast)} aria-hidden="true">
                      <span className={styles.toastIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                      </span>
                      {toast}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.controls}>
        <div className={styles.dots} aria-label="Choose a screenshot">
          {slides.map((slide, index) => (
            <button key={slide.src} type="button" className={styles.dot} data-active={active === index} aria-label={`Show ${slide.title}`} aria-current={active === index ? "true" : undefined} onClick={() => goTo(index)}><span /></button>
          ))}
        </div>
        {!reduced && <button type="button" className={styles.toggle} onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{paused ? <path d="m9 5 10 7-10 7V5Z" /> : <path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" />}</svg>
        </button>}
      </div>
    </div>
  );
}

function rectStyle([left, top, width, height]: Rect): CSSProperties {
  return { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` };
}
