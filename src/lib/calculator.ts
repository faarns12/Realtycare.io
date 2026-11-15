/**
 * Calculator maths, kept separate from the UI so it is easy to read and test.
 * All amounts are USD per month.
 */
import { overage, plans, type Plan, type PlanId } from "@/content/plans";

/** Default assumptions. Visitors can change these under "Fine-tune the assumptions". */
export const defaults = {
  adBudget: 1500,
  commission: 8000,
  otherLeads: 0,
  follower: "offshore" as Follower,
  costPerLead: 5.25, // $1,500 -> ~286 leads
  conversionPct: 1.67, // ~4–6 clients per 300 leads
  crm: 108, // Follow Up Boss $69 + $39 dialer
  texting: 75,
  email: 50,
  website: 149,
  agency: 750,
};

export const followers = {
  self: { label: "I do it myself", cost: 0, note: "your time" },
  offshore: { label: "Offshore caller (ISA)", cost: 1988, note: "~$1,988/mo" },
  us: { label: "US-based caller (ISA)", cost: 5500, note: "~$5,500/mo" },
} as const;
export type Follower = keyof typeof followers;

/** How much each lead uses, on average. */
export const usagePerLead = { minutes: 5, texts: 8, emails: 10 };

export type Inputs = typeof defaults & { agencyRunsAds: boolean };

export function recommendPlan(adBudget: number, leads: number): PlanId {
  if (leads > 1000) return "brokerage";
  if (adBudget >= 2500) return "pro";
  if (adBudget >= 1000) return "growth";
  if (adBudget === 0 && leads <= 50) return "solo";
  return "essentials";
}

export function planCost(plan: Plan, adBudget: number, leads: number, agencyFee: number) {
  if (plan.fee == null || plan.limits.leads == null) return null;
  const extraLeads = Math.max(0, Math.round(leads) - plan.limits.leads);
  const covered = Math.min(leads, plan.limits.leads);
  const extraMinutes = Math.max(0, covered * usagePerLead.minutes - (plan.limits.minutes ?? Infinity));
  const extraTexts = Math.max(0, covered * usagePerLead.texts - (plan.limits.texts ?? Infinity));
  const leadOverage = extraLeads * overage.perLead;
  const otherOverage = extraMinutes * overage.perMinute + extraTexts * overage.perText;
  const outsideAgency = !plan.managesAds && adBudget > 0 ? agencyFee : 0;
  return {
    fee: plan.fee,
    extraLeads,
    leadOverage,
    otherOverage,
    outsideAgency,
    total: plan.fee + adBudget + leadOverage + otherOverage + outsideAgency,
  };
}

export function calculate(input: Inputs, chosen?: PlanId) {
  const adLeads = input.adBudget > 0 ? input.adBudget / Math.max(0.5, input.costPerLead) : 0;
  const leads = adLeads + input.otherLeads;
  const rate = input.conversionPct / 100;
  const clients = { low: leads * rate * 0.8, mid: leads * rate, high: leads * rate * 1.2 };
  const commission = {
    low: clients.low * input.commission,
    mid: clients.mid * input.commission,
    high: clients.high * input.commission,
  };

  const recommended = recommendPlan(input.adBudget, leads);
  const planId = chosen ?? recommended;
  const plan = plans.find((p) => p.id === planId)!;
  const agencyFee = input.agencyRunsAds ? input.agency : 0;
  const ours = planCost(plan, input.adBudget, leads, agencyFee);

  const usualLines = [
    { label: "Ad budget", amount: input.adBudget },
    { label: followers[input.follower].label.replace("I do it myself", "Caller (you)"), amount: followers[input.follower].cost },
    { label: "CRM + dialer", amount: input.crm },
    { label: "Texting tool", amount: input.texting },
    { label: "Email marketing", amount: input.email },
    { label: "Website with listings", amount: input.website },
    { label: "Ad manager or agency", amount: input.adBudget > 0 ? input.agency : 0 },
  ];
  const usualTotal = usualLines.reduce((s, l) => s + l.amount, 0);
  const callingHours = Math.round((leads * 8 * 3) / 60); // ~8 attempts x 3 min per lead

  const usage = {
    leads: { used: leads, cap: plan.fee == null ? null : plan.limits.leads },
    minutes: { used: leads * usagePerLead.minutes, cap: plan.limits.minutes },
    texts: { used: leads * usagePerLead.texts, cap: plan.limits.texts },
    emails: { used: leads * usagePerLead.emails, cap: plan.limits.emails },
  };

  const warnings: string[] = [];
  if (plan.suggestedAdBudget > 0 && input.adBudget < plan.suggestedAdBudget)
    warnings.push(`${plan.name} manages your ads. It works best with an ad budget of at least $${plan.suggestedAdBudget.toLocaleString("en-US")} a month.`);
  if (!plan.managesAds && input.adBudget >= 1000)
    warnings.push("Growth includes ad management, so you wouldn’t need an outside agency.");
  if (ours && plan.limits.leads != null && leads > plan.limits.leads) {
    const next = plans[plans.findIndex((p) => p.id === plan.id) + 1];
    const nextCost = next ? planCost(next, input.adBudget, leads, next.managesAds ? 0 : agencyFee) : null;
    if (next && nextCost && nextCost.total < ours.total)
      warnings.push(`You’re over this plan’s lead limit. ${next.name} would cost $${Math.round(ours.total - nextCost.total).toLocaleString("en-US")} less a month at this volume.`);
    else warnings.push(`You’re over this plan’s lead limit by ${Math.round(leads - plan.limits.leads)} leads. Extra leads are $2 each.`);
  }

  return {
    adLeads,
    leads,
    clients,
    commission,
    recommended,
    plan,
    ours,
    usualLines,
    usualTotal,
    savings: ours ? usualTotal - ours.total : null,
    callingHours,
    usage,
    warnings,
  };
}

export type Result = ReturnType<typeof calculate>;
