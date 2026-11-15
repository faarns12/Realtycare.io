/**
 * Product screen previews for the /product page. All data is example data.
 */
const callRows = [
  { name: "Jessica Lane", src: "Facebook", outcome: "Booked", time: "0:42", dur: "3:14" },
  { name: "Marcus Reed", src: "Website", outcome: "Qualified", time: "0:38", dur: "2:51" },
  { name: "Priya Shah", src: "Zillow", outcome: "Follow up", time: "0:55", dur: "1:20" },
  { name: "Tom Becker", src: "Facebook", outcome: "No answer · texted", time: "0:31", dur: "—" },
  { name: "Ana Morales", src: "Open house", outcome: "Transferred", time: "0:47", dur: "4:02" },
];
const tone: Record<string, string> = {
  Booked: "bg-sky-50 text-sky-700",
  Qualified: "bg-gold-50 text-gold-800",
  Transferred: "bg-sky-50 text-sky-700",
};

export function CallLogMock() {
  return (
    <Frame title="AI Calling" sub="Today · 47 calls">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-[13px]">
          <thead className="text-left text-[11.5px] uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="py-2 font-semibold">Lead</th>
              <th className="py-2 font-semibold">Source</th>
              <th className="py-2 font-semibold">Called after</th>
              <th className="py-2 font-semibold">Outcome</th>
              <th className="py-2 text-right font-semibold">Recording</th>
            </tr>
          </thead>
          <tbody>
            {callRows.map((r) => (
              <tr key={r.name} className="border-t border-line">
                <td className="py-2.5 font-medium">{r.name}</td>
                <td className="py-2.5 text-muted">{r.src}</td>
                <td className="tabular py-2.5 font-mono text-[12.5px]">{r.time}</td>
                <td className="py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${tone[r.outcome] ?? "bg-mist text-muted"}`}>{r.outcome}</span>
                </td>
                <td className="tabular py-2.5 text-right text-muted">{r.dur === "—" ? "—" : `▶ ${r.dur}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

const stages = [
  { name: "New lead", n: 32, cards: ["Chris Long", "Mia Park"] },
  { name: "Contacted", n: 21, cards: ["Leo Grant"] },
  { name: "Qualified", n: 14, cards: ["Marcus Reed", "Priya Shah"] },
  { name: "Booked", n: 6, cards: ["Jessica Lane"] },
  { name: "Closed", n: 2, cards: ["Ana Morales"] },
];
export function PipelineMock() {
  return (
    <Frame title="CRM & Pipeline" sub="75 active deals">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {stages.map((s, i) => (
          <div key={s.name} className={`rounded-xl p-2.5 ${i === 3 ? "bg-sky-50" : "bg-mist"} ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
            <p className="truncate text-[11.5px] font-semibold">{s.name}</p>
            <p className="tabular text-[11.5px] text-muted">{s.n} deals</p>
            <div className="mt-2 grid gap-1.5">
              {s.cards.map((c) => (
                <div key={c} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-[11.5px] leading-snug font-medium shadow-[0_1px_2px_rgb(15_30_46/0.05)]">
                  {c}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

const flow = [
  { when: "Instantly", what: "AI call", tone: "bg-navy-900 text-white" },
  { when: "+2 min", what: "Text if no answer", tone: "bg-paper" },
  { when: "+2 hours", what: "Second call", tone: "bg-paper" },
  { when: "Day 1", what: "Email with listings", tone: "bg-paper" },
  { when: "Day 3, 7, 14", what: "Call + text check-ins", tone: "bg-paper" },
  { when: "Monthly, 12 months", what: "Market update + call", tone: "bg-sky-50" },
];
export function AutomationMock() {
  return (
    <Frame title="Automation" sub="New lead follow-up">
      <ol className="grid gap-2">
        {flow.map((f, i) => (
          <li key={f.when} className="grid grid-cols-[100px_1fr] items-center gap-3">
            <span className="tabular text-[12px] text-muted">{f.when}</span>
            <span className={`relative rounded-xl border border-line px-3 py-2 text-[13px] font-medium ${f.tone}`}>
              {f.what}
              {i < flow.length - 1 && <span aria-hidden="true" className="absolute -bottom-2 left-5 h-2 w-px bg-line-strong" />}
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

export function AdsMock() {
  const kpis = [
    ["Spend", "$1,500"],
    ["Leads", "291"],
    ["Cost per lead", "$5.15"],
    ["Booked", "11"],
  ];
  const bars = [32, 41, 38, 52, 47, 60, 58, 66, 61, 72, 70, 78];
  return (
    <Frame title="Marketing & Ads" sub="Facebook + Instagram · this month">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {kpis.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-mist p-3">
            <p className="text-[12px] text-muted">{k}</p>
            <p className="tabular font-display text-[20px] font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 240 70" className="mt-4 h-24 w-full" aria-hidden="true">
        {[17.5, 35, 52.5].map((y) => (
          <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="#E3E8EF" />
        ))}
        {bars.map((b, i) => (
          <rect key={i} x={i * 20 + 4} y={70 - b * 0.85} width="12" height={b * 0.85} rx="3" fill={i === bars.length - 1 ? "#0789C2" : "#BFE9FB"} />
        ))}
      </svg>
      <p className="text-[12px] text-muted">Leads per week</p>
    </Frame>
  );
}

function Frame({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper shadow-[var(--shadow-pop)]">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-mist px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex gap-1" aria-hidden="true">
            <i className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <i className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <i className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </span>
          <span className="ml-2 text-[13px] font-semibold">{title}</span>
        </div>
        <span className="text-[12px] text-muted">{sub}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
