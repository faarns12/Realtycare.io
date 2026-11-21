/**
 * Dates in the admin dashboard all use one time zone, so the server, the browser and the
 * date filter agree on what "today" means. Change it with NEXT_PUBLIC_ADMIN_TIMEZONE (an IANA name).
 */
export const ADMIN_TIME_ZONE = process.env.NEXT_PUBLIC_ADMIN_TIMEZONE || "America/New_York";

/** Short label for the zone, e.g. "EST" or "GMT+6". */
export const zoneLabel = (date = new Date()) =>
  new Intl.DateTimeFormat("en-US", { timeZone: ADMIN_TIME_ZONE, timeZoneName: "short" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value ?? ADMIN_TIME_ZONE;

export const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { timeZone: ADMIN_TIME_ZONE, month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

/** "YYYY-MM-DD" for a moment, in the admin time zone. */
export const ymd = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: ADMIN_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);

export const isYmd = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

/** Milliseconds the zone is ahead of UTC at a given moment. */
function zoneOffset(at: number) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: ADMIN_TIME_ZONE, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(new Date(at))
      .map((p) => [p.type, p.value]),
  );
  const wall = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return wall - Math.floor(at / 1000) * 1000;
}

/** The UTC moment when the given calendar day starts in the admin time zone. */
export function startOfDay(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - zoneOffset(guess);
  t = guess - zoneOffset(t); // second pass handles daylight-saving changes
  return new Date(t);
}

/** Adds whole days to a "YYYY-MM-DD" string. */
export function addDays(day: string, n: number) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Quick ranges shown above the list. `to` is inclusive. */
export function presets(now = new Date()) {
  const today = ymd(now);
  const monthStart = today.slice(0, 8) + "01";
  const lastMonthEnd = addDays(monthStart, -1);
  return [
    { key: "today", label: "Today", from: today, to: today },
    { key: "yesterday", label: "Yesterday", from: addDays(today, -1), to: addDays(today, -1) },
    { key: "7d", label: "Last 7 days", from: addDays(today, -6), to: today },
    { key: "30d", label: "Last 30 days", from: addDays(today, -29), to: today },
    { key: "month", label: "This month", from: monthStart, to: today },
    { key: "lastmonth", label: "Last month", from: lastMonthEnd.slice(0, 8) + "01", to: lastMonthEnd },
  ];
}
