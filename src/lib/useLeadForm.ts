"use client";

import { useState } from "react";
import { HONEYPOT, type FormType } from "@/lib/forms";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Sends a form to /api/lead.
 * Usage:  const { status, error, onSubmit } = useLeadForm("consultation");
 *         <form onSubmit={onSubmit}> ...inputs with name="..." </form>
 * Every input's `name` becomes a column in the sheet.
 */
export function useLeadForm(formType: FormType, opts?: { extra?: () => Record<string, string>; onSent?: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data: Record<string, string> = {};
    new FormData(form).forEach((v, k) => (data[k] = typeof v === "string" ? v : ""));
    form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((c) => {
      if (c.name) data[c.name] = c.checked ? "yes" : "";
    });

    const params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"].forEach((k) => {
      const v = params.get(k);
      if (v) data[k] = v;
    });

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_type: formType, page: window.location.pathname, ...opts?.extra?.(), ...data }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || "Something went wrong. Please try again.");
      setStatus("sent");
      form.reset();
      opts?.onSent?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return { status, error, onSubmit, honeypotName: HONEYPOT };
}
