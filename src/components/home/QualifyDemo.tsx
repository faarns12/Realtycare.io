"use client";

import { useEffect, useState } from "react";
import { DemoCursor, DemoToast, Icon, useDemo, type DemoStep } from "./demo/useDemo";
import styles from "./QualifyDemo.module.css";

/**
 * A live, scripted replica of AI lead qualification: the AI fills in budget,
 * timeline, location and pre-approval, scores the lead, and the AI Lead Summary
 * updates. Purely decorative (aria-hidden).
 */

const criteria = [
  { id: "budget", label: "Budget", ask: "What price range are you looking at?", answer: "$400k – $450k", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { id: "timeline", label: "Timeline", ask: "When are you hoping to move?", answer: "Within 3 months", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2" },
  { id: "location", label: "Location", ask: "Which areas are you considering?", answer: "South Tulsa, OK", icon: "M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" },
  { id: "preapproval", label: "Pre-approval", ask: "Have you been pre-approved yet?", answer: "Yes · First Bank", icon: "M9 12l2 2 4-4M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z" },
] as const;
type Field = (typeof criteria)[number]["id"];

type Action = Field | "score" | "qualify";
const script: DemoStep<Action>[] = [
  { t: "panel", hold: 700 },
  ...criteria.map((c) => ({ t: c.id, action: c.id, type: [c.id, c.answer] as [string, string], hold: 650 })),
  { t: "score", action: "score", hold: 1500 },
  { action: "qualify", toast: "Emily Carter marked as Qualified", hold: 700 },
  { t: "donut", hold: 1500 },
  { t: "recent-emily", hold: 1300 },
  { t: "view-leads", click: true, hold: 1500 },
];

const empty: Record<Field, string> = { budget: "", timeline: "", location: "", preapproval: "" };

export function QualifyDemo() {
  const [asking, setAsking] = useState<Field | null>(null);
  const [answers, setAnswers] = useState(empty);
  const [score, setScore] = useState(0);
  const [qualified, setQualified] = useState(false);

  const { root, cursor, clicks, toast, reduced } = useDemo(script, {
    onAction: (action) => {
      if (action === "score") { setAsking(null); setScore(92); }
      else if (action === "qualify") setQualified(true);
      else setAsking(action);
    },
    onType: (field, text) => setAnswers((a) => ({ ...a, [field]: text })),
    onLoop: () => { setAnswers(empty); setScore(0); setQualified(false); setAsking(null); },
  });

  // Count the score up.
  const [shownScore, setShownScore] = useState(0);
  useEffect(() => {
    if (score === 0) { setShownScore(0); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1100);
      setShownScore(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const done = criteria.filter((c) => answers[c.id] === c.answer).length;
  const total = qualified ? 2 : 1;
  const q = qualified ? 1 : 0;
  const pct = (n: number) => `${Math.round((n / total) * 1000) / 10}%`;
  const C = 2 * Math.PI * 40;

  return (
    <div ref={root} className={styles.demo} aria-hidden="true">
      <div className={styles.page}>
        {/* Left: AI lead summary + recent */}
        <div className={styles.left}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardIcon}><Icon d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></span>
              <div><p className={styles.cardTitle}>AI Lead Summary</p><p className={styles.cardSub}>Lead qualification across your websites</p></div>
              <span className={styles.pill} data-t="view-leads">View Leads →</span>
            </div>
            <div className={styles.summary}>
              <div className={styles.donut} data-t="donut">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className={styles.track} />
                  <circle cx="50" cy="50" r="40" className={styles.seg} strokeDasharray={`${(q / total) * C} ${C}`} />
                </svg>
                <span><b key={total} className={styles.pop}>{total}</b><small>Total Leads</small></span>
              </div>
              <div className={styles.legend}>
                <Legend dot="#0b7a4b" label="Qualified" n={q} p={pct(q)} />
                <Legend dot="#a7e3c3" label="Follow-up" n={0} p="0%" />
                <Legend dot="#cbd5e1" label="Not qualified" n={1} p={pct(1)} />
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.recentTitle}>Recent qualifications</p>
            <div className={styles.recent} data-t="recent-emily">
              <span className={styles.avatar}>EC</span>
              <span className={styles.recentWho}><b>Emily Carter</b><small>Facebook lead · just now</small></span>
              <span className={styles.badge} data-s={qualified ? "q" : done ? "ai" : "new"}>{qualified ? "Qualified" : done ? "AI qualifying…" : "New"}</span>
            </div>
            <div className={styles.recent}>
              <span className={styles.avatar}>JW</span>
              <span className={styles.recentWho}><b>Jennifer Wilson</b><small>Website · 2h ago</small></span>
              <span className={styles.badge} data-s="f">Follow-up</span>
            </div>
          </div>
        </div>

        {/* Right: live qualification */}
        <div className={styles.panel} data-t="panel">
          <div className={styles.panelHead}>
            <span className={styles.panelAvatar}>EC</span>
            <div><p className={styles.panelName}>Qualifying Emily Carter</p><p className={styles.panelSub}><i className={styles.live} />AI call in progress</p></div>
          </div>

          <p className={styles.ask} key={asking ?? "none"}>
            {asking ? <>AI: “{criteria.find((c) => c.id === asking)!.ask}”</> : done === 4 ? "All four answers captured." : "Listening for the lead’s answers…"}
          </p>

          <div className={styles.criteria}>
            {criteria.map((c) => {
              const value = answers[c.id];
              const ok = value === c.answer;
              return (
                <div key={c.id} className={styles.row} data-t={c.id} data-active={asking === c.id} data-ok={ok}>
                  <span className={styles.rowIcon}><Icon d={c.icon} /></span>
                  <span className={styles.rowText}><small>{c.label}</small><b>{value || "—"}{asking === c.id && !ok && <i className={styles.caret} />}</b></span>
                  <span className={styles.check}><Icon d="m5 12.5 4.5 4.5L19 7.5" /></span>
                </div>
              );
            })}
          </div>

          <div className={styles.score} data-t="score">
            <div className={styles.scoreTop}><span>Lead score</span><b>{shownScore}<small>/100</small></b></div>
            <div className={styles.meter}><span style={{ width: `${score}%` }} /></div>
            <span className={styles.hot} data-on={score > 0}>🔥 Hot lead · ready for a showing</span>
          </div>
        </div>
      </div>

      <DemoToast text={toast} />
      {!reduced && <DemoCursor x={cursor.x} y={cursor.y} clicks={clicks} />}
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
