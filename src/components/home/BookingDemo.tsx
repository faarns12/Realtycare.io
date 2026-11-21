"use client";

import { useState } from "react";
import { DemoCursor, DemoToast, Icon, useDemo, type DemoStep } from "./demo/useDemo";
import styles from "./BookingDemo.module.css";

/**
 * A live, scripted replica of the RealtyCare appointment calendar: pick a day,
 * pick a time, confirm, and the booking lands on the calendar and agenda.
 * Purely decorative (aria-hidden).
 */

const TODAY = 16;
const PICK = 24;
const slots = ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
const PICK_SLOT = "10:00 AM";

type Action = "day" | "slots" | "slot" | "confirm";
const script: DemoStep<Action>[] = [
  { t: "today", hold: 600 },
  { t: `day-${PICK}`, click: true, action: "day", hold: 700 },
  { t: "book-day", click: true, action: "slots", hold: 700 },
  { t: "slot-10", click: true, action: "slot", hold: 600 },
  { t: "confirm", click: true, action: "confirm", toast: "Appointment booked · reminder SMS sent", hold: 1300 },
  { t: `day-${PICK}`, hold: 1200 },
  { t: "appt", hold: 1500 },
  { t: "stat-booked", hold: 1500 },
];

// November 2026 starts on a Sunday: 30 days + the first days of December.
const cells = Array.from({ length: 35 }, (_, i) => (i < 30 ? { day: i + 1, muted: false } : { day: i - 29, muted: true }));
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function BookingDemo() {
  const [day, setDay] = useState(TODAY);
  const [picking, setPicking] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const { root, cursor, clicks, toast, reduced } = useDemo(script, {
    onAction: (action) => {
      if (action === "day") setDay(PICK);
      if (action === "slots") setPicking(true);
      if (action === "slot") setSlot(PICK_SLOT);
      if (action === "confirm") { setPicking(false); setBooked(true); }
    },
    onLoop: () => { setDay(TODAY); setPicking(false); setSlot(null); setBooked(false); },
  });

  const n = booked ? 1 : 0;
  const dayLabel = fullDays[(day - 1) % 7];

  return (
    <div ref={root} className={styles.demo} aria-hidden="true">
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}><Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />YOUR BOOKING WORKSPACE</p>
            <p className={styles.title}>Appointments</p>
          </div>
          <span className={styles.btnGreen}><Icon d="M12 5v14M5 12h14" />Book Appointment</span>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <Stat tone="green" label="This Month" value={n} icon="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <Stat tone="blue" label="Booked" value={n} icon="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2" t="stat-booked" />
          <Stat tone="green" label="Completed" value={0} icon="m5 12.5 4.5 4.5L19 7.5" />
          <Stat tone="green" label="Selected Day" value={booked && day === PICK ? 1 : 0} icon="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        </div>

        <div className={styles.grid}>
          {/* Calendar */}
          <div className={styles.calendar}>
            <div className={styles.calHead}>
              <p>November 2026</p>
              <span className={styles.nav}><Icon d="m15 18-6-6 6-6" /></span>
              <span className={styles.nav}><Icon d="m9 18 6-6-6-6" /></span>
              <span className={styles.todayBtn} data-t="today">Today</span>
            </div>
            <div className={styles.weekdays}>{weekdays.map((w) => <span key={w}>{w}</span>)}</div>
            <div className={styles.days}>
              {cells.map((c, i) => {
                const isToday = !c.muted && c.day === TODAY;
                const selected = !c.muted && c.day === day;
                return (
                  <span key={i} className={styles.cell} data-muted={c.muted} data-selected={selected} data-t={!c.muted ? `day-${c.day}` : undefined}>
                    <i className={isToday ? styles.todayNum : undefined}>{c.day}</i>
                    {booked && !c.muted && c.day === PICK && <span className={styles.event}>10:00 Emily C.</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Daily agenda */}
          <div className={styles.agenda}>
            <div className={styles.agendaHead}>
              <p>Daily Agenda</p>
              <span className={styles.count} key={n}>{n} Appointment{n === 1 ? "" : "s"}</span>
            </div>
            <p className={styles.date}><Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />{dayLabel}, Nov {day}, 2026</p>

            <div className={styles.agendaBody}>
              {booked ? (
                <div className={styles.appt} data-t="appt">
                  <div className={styles.apptTime}><b>10:00</b><small>AM</small></div>
                  <div className={styles.apptInfo}>
                    <b>Showing · Emily Carter</b>
                    <small>412 Maple Ave, Tulsa</small>
                    <span className={styles.tags}><span className={styles.ok}>Confirmed</span><span>Reminder SMS sent</span></span>
                  </div>
                </div>
              ) : picking ? (
                <div className={styles.picker}>
                  <p className={styles.pickTitle}>Pick a time for Emily Carter</p>
                  <div className={styles.slots}>
                    {slots.map((s) => (
                      <span key={s} className={styles.slot} data-on={slot === s} data-t={s === PICK_SLOT ? "slot-10" : undefined}>{s}</span>
                    ))}
                  </div>
                  <span className={styles.confirm} data-ready={Boolean(slot)} data-t="confirm">Confirm booking</span>
                </div>
              ) : (
                <div className={styles.empty}>
                  <Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM9 16l2 2 4-4" />
                  <b>No appointments scheduled</b>
                  <small>Book a meeting to get things started.</small>
                </div>
              )}
            </div>

            {!booked && !picking && <span className={styles.bookDay} data-t="book-day"><Icon d="M12 5v14M5 12h14" />Book for This Day</span>}
            <p className={styles.tz}>All appointment times are shown in Central Time (CT).</p>
          </div>
        </div>
      </div>

      <DemoToast text={toast} />
      {!reduced && <DemoCursor x={cursor.x} y={cursor.y} clicks={clicks} />}
    </div>
  );
}

function Stat({ tone, label, value, icon, t }: { tone: "green" | "blue"; label: string; value: number; icon: string; t?: string }) {
  return (
    <div className={styles.stat} data-t={t}>
      <span className={styles.statIcon} data-tone={tone}><Icon d={icon} /></span>
      <div><small>{label}</small><b key={value} className={styles.pop}>{value}</b></div>
    </div>
  );
}
