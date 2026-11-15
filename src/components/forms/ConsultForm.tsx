"use client";

import { useLeadForm } from "@/lib/useLeadForm";
import { Button } from "@/components/ui";
import { FormMessage, Honeypot, TextField } from "./fields";

/** Short form in the footer of every page. Saves to the "Consultations" tab. */
export function ConsultForm() {
  const { status, error, onSubmit, honeypotName } = useLeadForm("consultation");
  return (
    <form onSubmit={onSubmit} className="relative grid gap-3" noValidate={false}>
      <Honeypot name={honeypotName} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField dark hideLabel label="First name" name="first_name" placeholder="First name" autoComplete="given-name" required />
        <TextField dark hideLabel label="Last name" name="last_name" placeholder="Last name" autoComplete="family-name" />
      </div>
      <TextField dark hideLabel label="Email address" name="email" type="email" placeholder="Email address" autoComplete="email" required />
      <TextField dark hideLabel label="Phone number" name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" />
      <Button type="submit" variant="bright" disabled={status === "sending"} className="mt-1 w-full">
        {status === "sending" ? "Sending…" : "Request a consultation"}
      </Button>
      <FormMessage dark status={status} error={error} success="Thanks. We’ll email you within one business day." />
    </form>
  );
}
