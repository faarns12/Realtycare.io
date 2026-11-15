"use client";

import { useRouter } from "next/navigation";
import { useLeadForm } from "@/lib/useLeadForm";
import { Button } from "@/components/ui";
import { Checkbox, consentText, FormMessage, Honeypot, SelectField, TextArea, TextField } from "./fields";

const states = "Alabama,Alaska,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,District of Columbia,Florida,Georgia,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Ohio,Oklahoma,Oregon,Pennsylvania,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virginia,Washington,West Virginia,Wisconsin,Wyoming".split(",");

/** Full strategy-call form on /book. Saves to the "Strategy calls" tab, then opens /thank-you. */
export function BookForm() {
  const router = useRouter();
  const { status, error, onSubmit, honeypotName } = useLeadForm("strategy_call", { onSent: () => router.push("/thank-you") });
  return (
    <form onSubmit={onSubmit} className="relative grid gap-4">
      <Honeypot name={honeypotName} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="First name" name="first_name" autoComplete="given-name" required />
        <TextField label="Last name" name="last_name" autoComplete="family-name" />
        <TextField label="Email" name="email" type="email" autoComplete="email" required />
        <TextField label="Mobile" name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
        <TextField label="Brokerage or team" name="brokerage" autoComplete="organization" />
        <SelectField label="State" name="state" options={states} />
        <SelectField label="New leads a month" name="monthly_leads" options={["Under 25", "25–50", "50–150", "150–300", "300–600", "600+"]} />
        <SelectField label="Monthly ad budget" name="ad_budget" options={["I don’t run ads", "Under $1,000", "$1,000–$2,500", "$2,500–$5,000", "$5,000+"]} />
        <TextField label="CRM you use today" name="current_crm" placeholder="e.g. Follow Up Boss, kvCORE, none" className="sm:col-span-2" />
      </div>
      <TextArea label="Anything we should know?" name="message" placeholder="Your market, lead sources, what’s not working…" />
      <Checkbox name="consent">{consentText}</Checkbox>
      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto sm:justify-self-start">
        {status === "sending" ? "Sending…" : "Request my strategy call"}
      </Button>
      <FormMessage status={status} error={error} success="Thanks. Taking you to the next step…" />
    </form>
  );
}
