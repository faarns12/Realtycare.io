"use client";

import { useState } from "react";
import { DemoCursor, DemoToast, Icon, useDemo, type DemoStep } from "./demo/useDemo";
import styles from "./PipelineDemo.module.css";

/**
 * A live, scripted replica of the RealtyCare pipeline: a lead is dragged across
 * stages, its activity timeline is opened, and long-term follow-up is shown.
 * Purely decorative (aria-hidden).
 */

type Col = "new" | "contacted" | "application" | "appt";
const columns: { id: Col; label: string; icon: string }[] = [
  { id: "new", label: "New Lead", icon: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 19v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" },
  { id: "contacted", label: "Contacted", icon: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" },
  { id: "application", label: "Application", icon: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6ZM14 3v6h6M8 13h8M8 17h5" },
  { id: "appt", label: "Appointment Set", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" },
];

type Card = { id: string; initials: string; name: string; meta: string; tag: string; tone: "hot" | "blue" | "amber" | "green" };
const others: (Card & { col: Col })[] = [
  { id: "ml", initials: "ML", name: "Marcus Lee", meta: "Zillow · 1h ago", tag: "New", tone: "blue", col: "new" },
  { id: "ab", initials: "AB", name: "Aisha Brown", meta: "AI call · 0:58", tag: "Follow-up", tone: "amber", col: "contacted" },
  { id: "rm", initials: "RM", name: "Robert Martinez", meta: "Website form", tag: "Pre-approval", tone: "amber", col: "application" },
  { id: "dk", initials: "DK", name: "Daniel Kim", meta: "Thu · 2:00 PM", tag: "Showing", tone: "green", col: "appt" },
];
const emilyTag: Record<Col, Pick<Card, "meta" | "tag" | "tone">> = {
  new: { meta: "Facebook · 2m ago", tag: "Hot · 92", tone: "hot" },
  contacted: { meta: "AI call · 0:42", tag: "Qualified", tone: "green" },
  application: { meta: "AI call · 0:42", tag: "Qualified", tone: "green" },
  appt: { meta: "Tue · 10:00 AM", tag: "Showing", tone: "green" },
};

type Action = "grab" | "drop-contacted" | "drop-appt" | "open" | "close";
const script: DemoStep<Action>[] = [
  { t: "col-new", hold: 500 },
  { t: "card-emily", click: true, action: "grab", hold: 250 },
  { t: "drop-contacted", action: "drop-contacted", toast: "Emily Carter moved to Contacted", hold: 1000 },
  { t: "card-emily", click: true, action: "grab", hold: 250 },
  { t: "drop-appt", action: "drop-appt", toast: "Emily Carter moved to Appointment Set", hold: 1100 },
  { t: "card-emily", click: true, action: "open", hold: 2400 },
  { t: "close", click: true, action: "close", hold: 600 },
  { t: "followup", hold: 1700 },
];

export function PipelineDemo() {
  const [col, setCol] = useState<Col>("new");
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);

  const { root, cursor, clicks, toast, reduced } = useDemo(script, {
    onAction: (action) => {
      if (action === "grab") setDragging(true);
      if (action === "drop-contacted") { setDragging(false); setCol("contacted"); }
      if (action === "drop-appt") { setDragging(false); setCol("appt"); }
      if (action === "open") setOpen(true);
      if (action === "close") setOpen(false);
    },
    onLoop: () => { setCol("new"); setDragging(false); setOpen(false); },
  });

  const emily: Card = { id: "emily", initials: "EC", name: "Emily Carter", ...emilyTag[col] };
  // Where the dragged card is heading next.
  const dropTo: Col | null = dragging ? (col === "new" ? "contacted" : "appt") : null;

  return (
    <div ref={root} className={styles.demo} aria-hidden="true">
      <div className={styles.page}>
        <div className={styles.head}>
          <span className={styles.headIcon}><Icon d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" /></span>
          <div><p className={styles.title}>Pipeline</p><p className={styles.sub}>Track your leads across the sales journey</p></div>
          <span className={styles.link}>View Full Pipeline →</span>
        </div>

        <div className={styles.board}>
          {columns.map((c) => {
            const list = others.filter((o) => o.col === c.id);
            const hasEmily = col === c.id;
            const count = list.length + (hasEmily ? 1 : 0);
            return (
              <div key={c.id} className={styles.col} data-col={c.id} data-t={`col-${c.id}`} data-target={dropTo === c.id}>
                <div className={styles.colHead}>
                  <span>{c.label}</span>
                  <span className={styles.colCount}><Icon d={c.icon} /><b key={count} className={styles.pop}>{count}</b></span>
                </div>
                <div className={styles.list}>
                  {dropTo === c.id && <span className={styles.dropSlot} data-t={`drop-${c.id}`} />}
                  {hasEmily && <CardView card={emily} t="card-emily" lifted={dragging} fresh key={`emily-${col}`} />}
                  {list.map((o) => <CardView key={o.id} card={o} />)}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.followup} data-t="followup">
          <span className={styles.fuIcon}><Icon d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" /></span>
          <div className={styles.fuText}><b>12-month follow-up</b><small>Leads who aren’t ready yet get nurtured by AI calls and texts</small></div>
          <div className={styles.fuStats}>
            <span><b>38</b><small>in nurture</small></span>
            <span><b>30d</b><small>next touch</small></span>
          </div>
          <div className={styles.fuTrack}>{Array.from({ length: 12 }, (_, i) => <i key={i} data-on={i < 4} />)}</div>
        </div>
      </div>

      {/* Floating card that follows the cursor while dragging */}
      <div className={styles.ghost} data-on={dragging} style={{ left: cursor.x, top: cursor.y }}>
        <CardView card={emily} />
      </div>

      {/* Activity timeline */}
      <div className={styles.scrim} data-open={open} />
      <div className={styles.drawer} data-open={open}>
        <div className={styles.drawerHead}>
          <span className={styles.avatarLg}>EC</span>
          <div><p className={styles.drawerName}>Emily Carter</p><p className={styles.drawerSub}>Appointment Set · Facebook lead</p></div>
          <span className={styles.close} data-t="close"><Icon d="m6 6 12 12M18 6 6 18" /></span>
        </div>
        <p className={styles.timelineTitle}>Activity</p>
        <ol className={styles.timeline}>
          <Item tone="blue" icon="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" title="AI call · 0:42" body="Called 38 seconds after the form. Recording and transcript saved." time="Mon 9:14 AM" />
          <Item tone="green" icon="M9 12l2 2 4-4M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z" title="Qualified · score 92" body="$400k–$450k · 3 months · South Tulsa · pre-approved" time="Mon 9:15 AM" />
          <Item tone="purple" icon="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" title="Showing booked" body="Tue 10:00 AM · 412 Maple Ave" time="Mon 9:15 AM" />
          <Item tone="amber" icon="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2" title="Next step: reminder text" body="Scheduled automatically for Mon 6:00 PM" time="Upcoming" />
        </ol>
      </div>

      <DemoToast text={toast} />
      {!reduced && <DemoCursor x={cursor.x} y={cursor.y} clicks={clicks} />}
    </div>
  );
}

function CardView({ card, t, lifted, fresh }: { card: Card; t?: string; lifted?: boolean; fresh?: boolean }) {
  return (
    <div className={styles.card} data-t={t} data-lifted={lifted} data-fresh={fresh}>
      <span className={styles.avatar}>{card.initials}</span>
      <span className={styles.cardText}><b>{card.name}</b><small>{card.meta}</small></span>
      <span className={styles.tag} data-tone={card.tone}>{card.tag}</span>
    </div>
  );
}

function Item({ tone, icon, title, body, time }: { tone: string; icon: string; title: string; body: string; time: string }) {
  return (
    <li className={styles.item}>
      <span className={styles.itemIcon} data-tone={tone}><Icon d={icon} /></span>
      <div><p className={styles.itemTitle}>{title}<small>{time}</small></p><p className={styles.itemBody}>{body}</p></div>
    </li>
  );
}
