/**
 * RealtyCare logo: roof + "C" for Care, with a call signal.
 * `tone="dark"` = for navy backgrounds. `markOnly` = icon without the name.
 * Static files for print/social live in /public/brand.
 */
type Props = { tone?: "light" | "dark"; markOnly?: boolean; className?: string };

export function LogoMark({ tone = "light", className = "h-9 w-9" }: { tone?: "light" | "dark"; className?: string }) {
  const ink = tone === "dark" ? "#FFFFFF" : "#0F1E2E";
  const signal = tone === "dark" ? "#00C2FF" : "#0789C2";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M9 30 L32 9.5 L55 30" fill="none" stroke={ink} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40.6 31.4 A12.6 12.6 0 1 0 40.6 49.6" fill="none" stroke={ink} strokeWidth="5.5" strokeLinecap="round" />
      <circle cx="44.6" cy="40.5" r="3.4" fill={signal} />
      <path d="M50.8 33.2 A9.6 9.6 0 0 1 50.8 47.8" fill="none" stroke={signal} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ tone = "light", markOnly = false, className = "" }: Props) {
  const dark = tone === "dark";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark tone={tone} />
      {!markOnly && (
        <span className={`font-display text-[21px] font-[650] tracking-[-0.035em] leading-none ${dark ? "text-white" : "text-navy-900"}`}>
          RealtyCare<span className={`font-[500] ${dark ? "text-sky-400" : "text-sky-600"}`}>.io</span>
        </span>
      )}
    </span>
  );
}
