import type { LeadStatus } from "@/lib/supabase";

/** Label and colours for each lead status in the admin dashboard. */
export const statusStyle: Record<LeadStatus, { label: string; dot: string; pill: string }> = {
  new: { label: "New", dot: "bg-sky-500", pill: "bg-sky-50 text-sky-800 border-sky-200" },
  contacted: { label: "Contacted", dot: "bg-amber-500", pill: "bg-amber-50 text-amber-800 border-amber-200" },
  booked: { label: "Call booked", dot: "bg-violet-500", pill: "bg-violet-50 text-violet-800 border-violet-200" },
  won: { label: "Won", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  lost: { label: "Lost", dot: "bg-slate-400", pill: "bg-slate-100 text-slate-700 border-slate-200" },
  spam: { label: "Spam", dot: "bg-red-500", pill: "bg-red-50 text-red-700 border-red-200" },
};
