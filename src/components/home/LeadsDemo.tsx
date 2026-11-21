"use client";

import { useState } from "react";
import { DemoCursor, DemoToast, Icon, useDemo, type DemoStep } from "./demo/useDemo";
import styles from "./LeadsDemo.module.css";

/**
 * A live, scripted replica of the RealtyCare Leads page: a cursor adds a lead,
 * changes its status and opens the lead profile. Purely decorative (aria-hidden);
 * the surrounding card carries the accessible label.
 */

type Status = "new" | "follow" | "dnc" | "old" | "unq" | "appt";
const statusLabel: Record<Status, string> = {
  new: "New", follow: "Follow up (3-6 mo)", dnc: "Do not call", old: "Old lead (activated)", unq: "Unqualified", appt: "Appointment set",
};

type Row = { initials: string; name: string; company?: string; note: string; email: string; phone: string; status: Status; score: string };
const baseRows: Row[] = [
  { initials: "JW", name: "Jennifer Wilson", company: "City Hall", note: "Wants 3-bed near schools", email: "jennifer.wilson@example.com", phone: "(215) 555-0139", status: "follow", score: "580-619" },
  { initials: "AB", name: "Aisha Brown", note: "Pre-approved, $420k", email: "aisha.brown@example.com", phone: "(215) 555-0149", status: "old", score: "660-699" },
  { initials: "RM", name: "Robert Martinez", note: "Selling in spring", email: "robert.martinez@example.com", phone: "(215) 555-0116", status: "unq", score: "700-739" },
  { initials: "BA", name: "Brian Anderson", note: "Asked about condos", email: "brian.anderson@example.com", phone: "(215) 555-0125", status: "new", score: "580-619" },
];
const NEW_NAME = "Emily Carter";
const NEW_PHONE = "(918) 555-0188";

type Action = "openAdd" | "save" | "menu" | "setAppt" | "openDetail" | "closeDetail";
const script: DemoStep<Action>[] = [
  { t: "search", hold: 600 },
  { t: "add", click: true, action: "openAdd", hold: 600 },
  { t: "f-name", click: true, type: ["name", NEW_NAME], hold: 250 },
  { t: "f-phone", click: true, type: ["phone", NEW_PHONE], hold: 250 },
  { t: "f-source", hold: 450 },
  { t: "save", click: true, action: "save", toast: "New lead captured · AI is calling", hold: 1500 },
  { t: "status-new", click: true, action: "menu", hold: 550 },
  { t: "opt-appt", click: true, action: "setAppt", toast: "Status changed to Appointment set", hold: 1300 },
  { t: "name-new", click: true, action: "openDetail", hold: 1100 },
  { t: "stats", hold: 1300 },
  { t: "note", hold: 1200 },
  { t: "call-lead", hold: 1300 },
  { t: "close", click: true, action: "closeDetail", hold: 1400 },
];

export function LeadsDemo() {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [added, setAdded] = useState(false);
  const [menu, setMenu] = useState(false);
  const [status, setStatus] = useState<Status>("new");
  const [detail, setDetail] = useState(false);

  const { root, step, cursor, clicks, toast, reduced } = useDemo(script, {
    onAction: (action) => {
      switch (action) {
        case "openAdd": setAddOpen(true); break;
        case "save": setAddOpen(false); setAdded(true); break;
        case "menu": setMenu(true); break;
        case "setAppt": setMenu(false); setStatus("appt"); break;
        case "openDetail": setDetail(true); break;
        case "closeDetail": setDetail(false); break;
      }
    },
    onType: (field, text) => (field === "name" ? setName(text) : setPhone(text)),
    onLoop: () => { setAdded(false); setStatus("new"); setName(""); setPhone(""); },
  });

  const rows: (Row & { fresh?: boolean })[] = added
    ? [{ initials: "EC", name: NEW_NAME, company: "Facebook lead", note: "Looking to buy in 3 months", email: "emily.carter@example.com", phone: NEW_PHONE, status, score: "700-739", fresh: true }, ...baseRows]
    : baseRows;
  const visibleRows = rows.slice(0, 4);

  return (
    <div ref={root} className={styles.demo} aria-hidden="true">
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}><Icon d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />YOUR LEAD WORKSPACE</p>
            <p className={styles.title}>Leads</p>
            <p className={styles.sub}>Find the right lead, follow up, and keep every conversation moving.</p>
          </div>
          <div className={styles.headActions}>
            <span className={styles.btnGhost}><Icon d="M12 15V3m0 0L7 8m5-5 5 5M5 21h14" />Import</span>
            <span className={styles.btnGreen} data-t="add"><Icon d="M12 5v14M5 12h14" />Add Lead</span>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.search} data-t="search"><Icon d="m21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />Search by name, email, phone, company…</div>
          <div className={styles.filterRow}>
            <span className={styles.select}>All statuses<Chevron /></span>
            <span className={styles.select}>All websites<Chevron /></span>
            <span className={styles.input}>Credit score</span>
            <span className={styles.input}>Income</span>
            <span className={styles.input}>mm/dd/yyyy</span>
            <span className={styles.chipBtn}>Archived</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <span className={styles.tabActive}>All leads ({rows.length})</span>
          <span className={styles.tab}><i data-s="new" />New</span>
          <span className={styles.tab}><i data-s="follow" />Call back</span>
          <span className={styles.tab}><i data-s="appt" />Appointment set</span>
        </div>

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.thead}>
            <span>NAME</span><span>NOTE</span><span>CONTACT</span><span>STATUS</span><span>CREDIT SCORE</span>
          </div>
          {visibleRows.map((row) => (
            <div key={row.name} className={styles.row} data-fresh={row.fresh || undefined}>
              <span className={styles.nameCell} data-t={row.fresh ? "name-new" : undefined}>
                <span className={styles.avatar}>{row.initials}</span>
                <span><b>{row.name}</b>{row.company && <small>{row.company}</small>}</span>
              </span>
              <span><span className={styles.note}><Icon d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" />{row.note}</span></span>
              <span className={styles.contact}><span>{row.email}</span><span>{row.phone}</span></span>
              <span className={styles.statusCell}>
                <span className={styles.status} data-s={row.status} data-t={row.fresh ? "status-new" : undefined}><i />{statusLabel[row.status]}</span>
                {row.fresh && (
                  <span className={styles.menu} data-open={menu}>
                    {(["new", "follow", "appt", "unq"] as Status[]).map((s) => (
                      <span key={s} className={styles.menuItem} data-t={s === "appt" ? "opt-appt" : undefined}><i data-s={s} />{statusLabel[s]}</span>
                    ))}
                  </span>
                )}
              </span>
              <span className={styles.score}>{row.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add lead modal */}
      <div className={styles.scrim} data-open={addOpen || detail} />
      <div className={styles.modal} data-open={addOpen}>
        <p className={styles.modalTitle}>Add lead</p>
        <p className={styles.modalSub}>New leads are called by your AI within 60 seconds.</p>
        <span className={styles.field}>Full name<span data-t="f-name" data-focus={addOpen && step === 2}>{name}{addOpen && step === 2 && <i className={styles.caret} />}</span></span>
        <span className={styles.field}>Phone<span data-t="f-phone" data-focus={addOpen && step === 3}>{phone}{addOpen && step === 3 && <i className={styles.caret} />}</span></span>
        <span className={styles.field}>Source<span data-t="f-source">Facebook lead ads<Chevron /></span></span>
        <div className={styles.modalActions}><span className={styles.btnGhost}>Cancel</span><span className={styles.btnGreen} data-t="save">Save lead</span></div>
      </div>

      {/* Lead detail drawer */}
      <div className={styles.drawer} data-open={detail}>
        <div className={styles.drawerHead}>
          <span className={styles.avatarLg}>EC</span>
          <div>
            <p className={styles.drawerName}>{NEW_NAME}</p>
            <p className={styles.drawerSub}>Lead profile · realtycare</p>
            <span className={styles.status} data-s={status}><i />{statusLabel[status]}</span>
          </div>
          <span className={styles.close} data-t="close"><Icon d="m6 6 12 12M18 6 6 18" /></span>
        </div>
        <div className={styles.drawerActions}>
          <span className={styles.btnGreen} data-t="call-lead"><Icon d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />Call lead</span>
          <span className={styles.btnGhost}><Icon d="M4 4h16v16H4zM4 6l8 7 8-7" />Email lead</span>
        </div>
        <div className={styles.stats} data-t="stats">
          <span><small>Credit score</small><b>700-739</b></span>
          <span><small>Household income</small><b>$85k-$100k</b></span>
          <span><small>Lead source</small><b className={styles.small}>Facebook</b></span>
        </div>
        <div className={styles.panel} data-t="note">
          <p className={styles.panelTitle}>Follow-up note</p>
          <p className={styles.noteBox}>Showing booked · Tue 10 AM, 412 Maple Ave</p>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Contact information</p>
          <div className={styles.info}>
            <span><small>Email</small>emily.carter@example.com</span>
            <span><small>Phone</small>{NEW_PHONE}</span>
            <span><small>Timeline</small>3 months</span>
            <span><small>Pre-approved</small>Yes</span>
          </div>
        </div>
      </div>

      <DemoToast text={toast} />
      {!reduced && <DemoCursor x={cursor.x} y={cursor.y} clicks={clicks} />}
    </div>
  );
}


function Chevron() {
  return <svg className={styles.chev} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>;
}
