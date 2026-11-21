"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./demo.module.css";

/**
 * Shared engine for the scripted product demos: a fake cursor walks through
 * `script`, moving to elements marked `data-t="<id>"`, clicking, typing and
 * firing actions. Plays only while on screen and never with reduced motion.
 */
export type DemoStep<A extends string> = {
  /** data-t id of the element to move to; omit to leave the cursor where it is. */
  t?: string;
  click?: boolean;
  action?: A;
  /** [field, text]: typed one character at a time via onType. */
  type?: [string, string];
  toast?: string;
  /** How long to stay on this step after arriving (ms). */
  hold: number;
};

const MOVE_MS = 850;
const TYPE_MS = 70;

type Handlers<A extends string> = {
  onAction: (action: A) => void;
  onType?: (field: string, text: string) => void;
  /** Called when the script ends, before it starts again. Reset demo state here. */
  onLoop: () => void;
};

export function useDemo<A extends string>(script: DemoStep<A>[], handlers: Handlers<A>) {
  const root = useRef<HTMLDivElement>(null);
  const latest = useRef(handlers);
  latest.current = handlers;

  const [step, setStep] = useState(0);
  const [cursor, setCursor] = useState({ x: -40, y: -40 });
  const [clicks, setClicks] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  // Start the cursor near the bottom middle of the demo.
  useEffect(() => {
    const box = root.current;
    if (box) setCursor({ x: box.clientWidth * 0.55, y: box.clientHeight * 0.9 });
  }, []);

  // Toasts hide on their own timer so a step change never leaves one stuck.
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  const playing = visible && !reduced;

  useEffect(() => {
    const box = root.current;
    if (!playing || !box) return;
    const current = script[step];
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    let arrive = 0;
    box.querySelectorAll("[data-hot]").forEach((el) => el.removeAttribute("data-hot"));
    const target = current.t ? box.querySelector<HTMLElement>(`[data-t="${current.t}"]`) : null;
    if (target) {
      const a = box.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      setCursor({ x: b.left - a.left + Math.min(b.width * 0.5, 60), y: b.top - a.top + b.height * 0.55 });
      arrive = MOVE_MS;
      later(() => target.setAttribute("data-hot", ""), MOVE_MS - 150);
    }

    if (current.click) later(() => setClicks((n) => n + 1), arrive);
    if (current.action) later(() => latest.current.onAction(current.action!), arrive + (current.click ? 140 : 0));
    if (current.toast) later(() => setToast(current.toast!), arrive + 300);
    const typing = current.type;
    if (typing) {
      const [field, text] = typing;
      for (let i = 0; i < text.length; i++) later(() => latest.current.onType?.(field, text.slice(0, i + 1)), arrive + 220 + i * TYPE_MS);
    }

    const total = arrive + current.hold + (typing ? 220 + typing[1].length * TYPE_MS : 0);
    later(() => {
      if (step + 1 < script.length) { setStep(step + 1); return; }
      latest.current.onLoop();
      setClicks(0);
      setStep(0);
    }, total);

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [playing, step, script]);

  return { root, step, cursor, clicks, toast, reduced };
}

export function DemoCursor({ x, y, clicks, color = "#0b7a4b" }: { x: number; y: number; clicks: number; color?: string }) {
  return (
    <div className={styles.cursor} style={{ left: x, top: y, "--click": color } as React.CSSProperties}>
      {clicks > 0 && <span key={`r${clicks}`} className={styles.ripple} />}
      <svg key={`c${clicks}`} className={clicks > 0 ? styles.press : undefined} viewBox="0 0 24 24">
        <path d="M5 3.2v15.6c0 .6.7.9 1.1.5l3.6-3.4 2.4 5.6c.2.4.6.6 1 .4l2-.9c.4-.2.6-.6.4-1l-2.4-5.5h5c.6 0 .9-.7.5-1.1L6.1 2.7c-.4-.4-1.1-.1-1.1.5Z" />
      </svg>
    </div>
  );
}

export function DemoToast({ text }: { text: string | null }) {
  const [shown, setShown] = useState(text);
  useEffect(() => { if (text) setShown(text); }, [text]);
  return (
    <div className={styles.toast} data-open={Boolean(text)}>
      <span className={styles.toastIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
      {shown}
    </div>
  );
}

export function Icon({ d, className }: { d: string; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}
