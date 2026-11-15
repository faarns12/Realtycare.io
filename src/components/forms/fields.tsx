/**
 * Form inputs used by every form. Style them here once.
 * The `name` prop becomes the column name in your Google Sheet.
 */
import type { ComponentProps, ReactNode } from "react";

const base =
  "w-full rounded-xl border px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-muted/70 focus:ring-4";
const light = "border-line bg-mist text-ink focus:border-sky-600 focus:bg-paper focus:ring-sky-50";
const dark = "border-white/15 bg-white/5 text-white placeholder:text-navy-300 focus:border-sky-400 focus:ring-sky-400/15";

type FieldProps = { label: string; name: string; dark?: boolean; hint?: string; hideLabel?: boolean };

export function TextField({ label, name, dark: d, hint, hideLabel, className = "", ...rest }: FieldProps & ComponentProps<"input">) {
  const id = `f-${name}`;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : `text-[13px] font-semibold ${d ? "text-white" : "text-ink"}`}>
        {label}
      </label>
      <input id={id} name={name} className={`${base} ${d ? dark : light}`} {...rest} />
      {hint && <p className={`text-[12.5px] ${d ? "text-navy-300" : "text-muted"}`}>{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  name,
  options,
  dark: d,
  className = "",
  ...rest
}: FieldProps & { options: string[] } & ComponentProps<"select">) {
  const id = `f-${name}`;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className={`text-[13px] font-semibold ${d ? "text-white" : "text-ink"}`}>
        {label}
      </label>
      <select id={id} name={name} className={`${base} ${d ? dark : light} appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10`} style={{ backgroundImage: chevron }} defaultValue="" {...rest}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function TextArea({ label, name, dark: d, className = "", ...rest }: FieldProps & ComponentProps<"textarea">) {
  const id = `f-${name}`;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className={`text-[13px] font-semibold ${d ? "text-white" : "text-ink"}`}>
        {label}
      </label>
      <textarea id={id} name={name} rows={4} className={`${base} ${d ? dark : light} resize-y`} {...rest} />
    </div>
  );
}

export function Checkbox({ name, children, dark: d, required }: { name: string; children: ReactNode; dark?: boolean; required?: boolean }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 text-[12.5px] leading-relaxed ${d ? "text-navy-300" : "text-muted"}`}>
      <input type="checkbox" name={name} required={required} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-sky-600)]" />
      <span>{children}</span>
    </label>
  );
}

/** Invisible field that catches spam bots. */
export function Honeypot({ name }: { name: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name={name} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormMessage({ status, error, success, dark: d }: { status: string; error: string; success: string; dark?: boolean }) {
  if (status === "sent")
    return (
      <p role="status" className={`rounded-xl px-4 py-3 text-[14px] font-medium ${d ? "bg-sky-400/15 text-sky-300" : "bg-sky-50 text-sky-700"}`}>
        {success}
      </p>
    );
  if (status === "error")
    return (
      <p role="alert" className={`rounded-xl px-4 py-3 text-[14px] ${d ? "bg-red-500/15 text-red-200" : "bg-red-50 text-bad"}`}>
        {error}
      </p>
    );
  return null;
}

/** Consent wording for calls/texts. [LAWYER TO CONFIRM] before launch. */
export const consentText =
  "I agree that RealtyCare.io may call and text me at the number above, including with automated technology and an AI voice, about my enquiry. Consent isn’t a condition of purchase. Message and data rates may apply. Reply STOP to opt out.";

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B6678' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;
