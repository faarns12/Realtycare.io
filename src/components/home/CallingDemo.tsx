"use client";

import { useEffect, useState } from "react";
import { DemoCursor, DemoToast, Icon, useDemo, type DemoStep } from "./demo/useDemo";
import styles from "./CallingDemo.module.css";

/**
 * A live, scripted replica of the RealtyCare AI Calling Overview: a new lead
 * arrives, the AI calls it, the visitor listens in, and the booked appointment
 * flows into the dashboard. Purely decorative (aria-hidden).
 */

const lines = [
  { ai: true, text: "Hi Emily, I’m the AI assistant for Sarah Lane Realty. Are you hoping to move soon?" },
  { ai: false, text: "In the next 3 months. I’m already pre-approved." },
  { ai: true, text: "Great. Sarah can show you 412 Maple Ave Tuesday at 10 AM. Shall I book it?" },
  { ai: false, text: "Yes, please!" },
];

type Call = "off" | "ringing" | "live" | "done";
type Action = "lead" | "ring" | "live" | "listen" | "line" | "done" | "closeCall";
const script: DemoStep<Action>[] = [
  { t: "range", hold: 700 },
  { action: "lead", hold: 1500 },
  { action: "ring", hold: 1400 },
  { action: "live", hold: 500 },
  { t: "listen", click: true, action: "listen", hold: 700 },
  { action: "line", hold: 1600 },
  { action: "line", hold: 1300 },
  { action: "line", hold: 1700 },
  { action: "line", hold: 900 },
  { action: "done", toast: "Appointment booked · Tue 10 AM", hold: 1700 },
  { t: "close-call", click: true, action: "closeCall", hold: 900 },
  { t: "rate", hold: 1300 },
  { t: "summary", hold: 1400 },
  { t: "chart", hold: 1800 },
];

export function CallingDemo() {
  const [lead, setLead] = useState(false);
  const [banner, setBanner] = useState(false);
  const [call, setCall] = useState<Call>("off");
  const [listen, setListen] = useState(false);
  const [shown, setShown] = useState(0);
  const [booked, setBooked] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const { root, cursor, clicks, toast, reduced } = useDemo(script, {
    onAction: (action) => {
      switch (action) {
        case "lead": setLead(true); setBanner(true); break;
        case "ring": setBanner(false); setCall("ringing"); break;
        case "live": setCall("live"); break;
        case "listen": setListen(true); break;
        case "line": setShown((n) => n + 1); break;
        case "done": setCall("done"); setBooked(true); break;
        case "closeCall": setCall("off"); setListen(false); break;
      }
    },
    onLoop: () => { setLead(false); setBooked(false); setShown(0); setSeconds(0); },
  });

  // Call timer.
  useEffect(() => {
    if (call !== "live") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [call]);

  const total = lead ? 2 : 1;
  const today = lead ? 1 : 0;
  const rate = booked ? "50%" : "0%";
  const set = booked ? 1 : 0;
  const qualified = booked ? 1 : 0;
  const pct = (n: number) => `${Math.round((n / total) * 1000) / 10}%`;
  const C = 2 * Math.PI * 40;

  return (
    <div ref={root} className={styles.demo} aria-hidden="true">
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.head}>
          <div>
            <p className={styles.title}>AI Calling Overview</p>
            <p className={styles.sub}>Here’s what’s happening with your real estate business today.</p>
          </div>
          <span className={styles.range} data-t="range"><Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />All Time<Icon className={styles.chev} d="m6 9 6 6 6-6" /></span>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <Stat tone="green" icon="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 19v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" label="Total Leads" value={total} note="In selected period" />
          <Stat tone="green" icon="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" label="Today’s Leads" value={today} note="New leads today" />
          <Stat tone="blue" icon="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" label="Appointment Rate" value={rate} note="Appointment-set leads / total" t="rate" />
          <Stat tone="orange" icon="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" label="Appointments Set" value={set} note="In selected period" />
        </div>

        <div className={styles.grid}>
          {/* AI lead summary */}
          <div className={styles.card} data-t="summary">
            <div className={styles.cardHead}>
              <span className={styles.cardIcon}><Icon d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></span>
              <div><p className={styles.cardTitle}>AI Lead Summary</p><p className={styles.cardSub}>Lead qualification across your connected websites</p></div>
              <span className={styles.pill}>View Leads →</span>
            </div>
            <div className={styles.summary}>
              <div className={styles.donut}>
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className={styles.track} />
                  <circle cx="50" cy="50" r="40" className={styles.segQualified} strokeDasharray={`${(qualified / total) * C} ${C}`} />
                </svg>
                <span><b key={total} className={styles.pop}>{total}</b><small>Total Leads</small></span>
              </div>
              <div className={styles.legend}>
                <Legend dot="#0b7a4b" label="Qualified Leads" n={qualified} p={pct(qualified)} />
                <Legend dot="#a7e3c3" label="Needs Follow-up" n={0} p="0%" />
                <Legend dot="#cbd5e1" label="Not Qualified" n={1} p={pct(1)} />
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className={styles.card} data-t="chart">
            <div className={styles.cardHead}>
              <span className={styles.cardIcon}><Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></span>
              <div><p className={styles.cardTitle}>Appointments</p><p className={styles.cardSub}>Total appointments set over time</p></div>
              <span className={styles.link}>View All →</span>
            </div>
            <div className={styles.chart} data-booked={booked}>
              <p className={styles.empty}><Icon d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />Your appointment trend will appear after the first booking.</p>
              <div className={styles.bars}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <span key={day} className={styles.barCol}>
                    <span className={styles.bar} data-on={booked && day === "Tue"}>{day === "Tue" && <b>1</b>}</span>
                    <small>{day}</small>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New lead banner */}
      <div className={styles.banner} data-open={banner}>
        <span className={styles.bannerDot} />
        <b>New lead</b> Emily Carter · Facebook lead ad
      </div>

      {/* Live call panel */}
      <div className={styles.call} data-state={call} data-listen={listen}>
        <div className={styles.callHead}>
          <span className={styles.callAvatar}>EC<i /></span>
          <div className={styles.callWho}>
            <p>{call === "done" ? "Call complete" : call === "ringing" ? "AI is calling…" : "AI on the call"}</p>
            <small>Emily Carter · {call === "ringing" ? "Ringing" : `0:${String(seconds).padStart(2, "0")}`}</small>
          </div>
          {call === "done" ? (
            <span className={styles.close} data-t="close-call"><Icon d="m6 6 12 12M18 6 6 18" /></span>
          ) : (
            <span className={styles.listen} data-t="listen" data-on={listen}>
              <Icon d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
              {listen ? "Listening" : "Listen live"}
            </span>
          )}
        </div>
        <div className={styles.wave} data-on={call === "live"}>
          {Array.from({ length: 28 }, (_, i) => <span key={i} style={{ animationDelay: `${(i % 7) * 90}ms`, height: `${30 + ((i * 37) % 60)}%` }} />)}
        </div>
        <div className={styles.transcript}>
          {lines.slice(0, shown).map((line) => (
            <p key={line.text} className={styles.line} data-ai={line.ai}><small>{line.ai ? "AI assistant" : "Emily"}</small>{line.text}</p>
          ))}
        </div>
        <div className={styles.result} data-on={call === "done"}>
          <span>Qualified</span><span>Pre-approved</span><span>3 months</span><span className={styles.resultMain}>Appointment set · Tue 10 AM</span>
        </div>
      </div>

      <DemoToast text={toast} />
      {!reduced && <DemoCursor x={cursor.x} y={cursor.y} clicks={clicks} color="#0789c2" />}
    </div>
  );
}

function Stat({ tone, icon, label, value, note, t }: { tone: "green" | "blue" | "orange"; icon: string; label: string; value: number | string; note: string; t?: string }) {
  return (
    <div className={styles.stat} data-t={t}>
      <div className={styles.statHead}><span className={styles.statIcon} data-tone={tone}><Icon d={icon} /></span><p>{label}</p></div>
      <b key={String(value)} className={styles.pop}>{value}</b>
      <small>{note}</small>
    </div>
  );
}

function Legend({ dot, label, n, p }: { dot: string; label: string; n: number; p: string }) {
  return (
    <div className={styles.legendRow}>
      <span><i style={{ background: dot }} />{label}</span>
      <b key={n} className={styles.pop}>{n}</b>
      <small>{p}</small>
    </div>
  );
}
