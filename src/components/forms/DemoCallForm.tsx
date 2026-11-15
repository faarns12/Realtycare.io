"use client";

import { useLeadForm } from "@/lib/useLeadForm";
import { Button } from "@/components/ui";
import { Checkbox, consentText, FormMessage, Honeypot, TextField } from "./fields";

/**
 * "Get called by the AI" demo on the home page. Saves to the "Demo calls" tab,
 * and starts a real Vapi call if the VAPI_* environment variables are set.
 */
export function DemoCallForm() {
  const { status, error, onSubmit, honeypotName } = useLeadForm("demo_call");
  return (
    <form onSubmit={onSubmit} className="relative grid gap-4">
      <Honeypot name={honeypotName} />
      <TextField label="First name" name="first_name" placeholder="Sarah" autoComplete="given-name" required />
      <TextField label="US mobile number" name="phone" type="tel" placeholder="(555) 123-4567" autoComplete="tel" inputMode="tel" required />
      <Checkbox name="consent" required>
        {consentText}
      </Checkbox>
      <Button type="submit" disabled={status === "sending"} className="w-full">
        {status === "sending" ? "Requesting…" : "Call me now"}
      </Button>
      <FormMessage
        status={status}
        error={error}
        success="Request received. During calling hours, your phone should ring within a minute."
      />
    </form>
  );
}
