import { money, overage, plans, type Plan } from "@/content/plans";
import { Check } from "@/components/ui";

type RowDef = { label: string; get: (p: Plan) => string | boolean };

const n = (v: number | null) => (v == null ? "Custom" : v.toLocaleString("en-US"));

/** Add, remove or reorder comparison rows here. `true` shows a tick, "—" shows a dash. */
const rows: RowDef[] = [
  { label: "Monthly fee", get: (p) => (p.fee == null ? "Custom" : money(p.fee)) },
  { label: "Ad budget (paid to Meta/Google)", get: (p) => (p.suggestedAdBudget ? `From ${money(p.suggestedAdBudget)}` : p.id === "brokerage" ? "Custom" : "None needed") },
  { label: "New leads called", get: (p) => (p.id === "brokerage" ? "1,000+" : n(p.limits.leads)) },
  { label: "AI call minutes", get: (p) => n(p.limits.minutes) },
  { label: "Follow-up texts", get: (p) => n(p.limits.texts) },
  { label: "Follow-up emails", get: (p) => n(p.limits.emails) },
  { label: "Call within 60 seconds*", get: () => true },
  { label: "Qualifying and booking", get: () => true },
  { label: "Follow-up length", get: (p) => p.followUp },
  { label: "Live transfer of hot leads", get: (p) => p.table.liveTransfer },
  { label: "Ads managed for you", get: (p) => p.table.adsManaged },
  { label: "New ad designs", get: (p) => p.table.adDesigns },
  { label: "Social posts and videos", get: (p) => p.table.social },
  { label: "Website", get: (p) => p.table.website },
  { label: "Landing pages", get: (p) => p.table.landingPages },
  { label: "CRM", get: (p) => p.table.crm },
  { label: "Old-lead reactivation", get: (p) => p.table.reactivation },
  { label: "Reporting", get: (p) => p.table.reporting },
];

export function CompareTable() {
  return (
    <div>
      <p className="mb-3 text-[14px] text-muted">
        Monthly limits per plan. Extra leads ${overage.perLead} each, extra minutes ${overage.perMinute.toFixed(2)}, extra texts ${overage.perText.toFixed(2)}. We tell you before you go over.
      </p>
      <div className="relative overflow-x-auto rounded-[var(--radius-card)] border border-line bg-paper shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[820px] border-collapse text-[14px]">
          <caption className="sr-only">Plan comparison</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-paper p-4 text-left text-[13px] font-semibold text-muted">
                Each month
              </th>
              {plans.map((p) => (
                <th key={p.id} scope="col" className={`p-4 text-left text-[15px] font-semibold ${p.recommended ? "bg-sky-50 shadow-[inset_0_3px_0_var(--color-sky-600)]" : ""}`}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="sticky left-0 z-10 min-w-[170px] bg-paper px-4 py-3 text-left font-medium text-muted">
                  {r.label}
                </th>
                {plans.map((p) => {
                  const v = r.get(p);
                  return (
                    <td key={p.id} className={`tabular px-4 py-3 ${p.recommended ? "bg-sky-50" : ""} ${v === "—" ? "text-muted" : ""}`}>
                      {v === true ? <Check /> : v}
                      {v === true && <span className="sr-only">Included</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
