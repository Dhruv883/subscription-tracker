export function formatDate(iso: string, short = false) {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = short
    ? { month: "short", day: "2-digit" }
    : { year: "numeric", month: "short", day: "2-digit" };
  return new Intl.DateTimeFormat("en-US", opts).format(d);
}

export function addDaysIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function sampleDate(daysAhead: number) {
  return addDaysIso(daysAhead);
}
