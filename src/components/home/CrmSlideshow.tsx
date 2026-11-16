"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./CrmSlideshow.module.css";

const slides = [
  { src: "calling-overview", title: "AI calling dashboard", width: 1152, height: 530 },
  { src: "leads", title: "Lead inbox", width: 1152, height: 650 },
  { src: "appointments", title: "Appointment calendar", width: 1152, height: 880 },
];

export function CrmSlideshow() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
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

  const playing = visible && !paused && !interacting && !reduced;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((value) => (value + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [playing, active]);

  return (
    <div ref={root} className={styles.player} role="region" aria-roledescription="carousel" aria-label="RealtyCare product screenshots" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false); }}>
      <div className={styles.stage} aria-live={playing ? "off" : "polite"}>
        {slides.map((slide, index) => (
          <div key={slide.src} className={styles.slide} data-active={active === index} data-playing={playing} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.title}`} aria-hidden={active !== index}>
            <Image src={`/images/crm/${slide.src}.webp`} alt={`Actual RealtyCare CRM: ${slide.title}`} width={slide.width} height={slide.height} sizes="(min-width: 1024px) 620px, 95vw" className={styles.image} loading="eager" />
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <div className={styles.dots} aria-label="Choose a screenshot">
          {slides.map((slide, index) => (
            <button key={slide.src} type="button" className={styles.dot} data-active={active === index} aria-label={`Show ${slide.title}`} aria-current={active === index ? "true" : undefined} onClick={() => { setActive(index); setPaused(true); }}><span /></button>
          ))}
        </div>
        {!reduced && <button type="button" className={styles.toggle} onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{paused ? <path d="m9 5 10 7-10 7V5Z" /> : <path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" />}</svg>
        </button>}
      </div>
    </div>
  );
}
