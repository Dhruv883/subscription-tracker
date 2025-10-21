import type { BillingCycle } from "@/types/subscription";

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

// Normalize a user-entered date string to YYYY-MM-DD for Postgres 'date' columns.
// Supports inputs like 'dd-mm-yyyy', 'dd/mm/yyyy', 'dd.mm.yyyy' and already-ISO 'yyyy-mm-dd' variants.
export function normalizeToISODate(input: string): string | null {
  if (!input) return null;
  const s = input.trim();
  // yyyy-mm-dd or yyyy/mm/dd or yyyy.mm.dd
  let m = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);
  if (m) {
    const [, y, mo, d] = m;
    const yy = parseInt(y, 10);
    const mm = parseInt(mo, 10);
    const dd = parseInt(d, 10);
    if (isValidYMD(yy, mm, dd)) return `${y}-${pad2(mm)}-${pad2(dd)}`;
    return null;
  }
  // dd-mm-yyyy or dd/mm/yyyy or dd.mm.yyyy
  m = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    const yy = parseInt(y, 10);
    const mm = parseInt(mo, 10);
    const dd = parseInt(d, 10);
    if (isValidYMD(yy, mm, dd)) return `${y}-${pad2(mm)}-${pad2(dd)}`;
    return null;
  }
  // Fallback: try Date parsing and format to YYYY-MM-DD
  const dt = new Date(s);
  if (!isNaN(dt.getTime())) {
    const yy = dt.getFullYear();
    const mm = dt.getMonth() + 1;
    const dd = dt.getDate();
    if (isValidYMD(yy, mm, dd)) return `${yy}-${pad2(mm)}-${pad2(dd)}`;
  }
  return null;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isValidYMD(y: number, m: number, d: number) {
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

// --- New helpers for month navigation and recurrence calculations ---
export function startOfMonth(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1, 0, 0, 0, 0);
}

export function endOfMonth(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function addMonthsClamp(date: Date, months: number): Date {
  // Clamp to end of month when the original day doesn't exist in the target month
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const targetYear = y + Math.floor((m + months) / 12);
  const targetMonth = (m + months) % 12;
  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  const day = Math.min(d, lastDay);
  return new Date(
    targetYear,
    targetMonth,
    day,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
}

export function monthsDiff(from: Date, to: Date): number {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  );
}

type OccurrenceArgs = {
  anchorIso: string;
  billingCycle: BillingCycle;
  customEvery?: number;
  customUnit?: "day" | "week" | "month" | "year";
  year: number;
  monthIndex: number; // 0-11
};

// Returns the first occurrence on or after the start of the target month, if it falls within the month; otherwise null.
export function getOccurrenceInMonth(args: OccurrenceArgs): Date | null {
  const { anchorIso, billingCycle, customEvery, customUnit, year, monthIndex } =
    args;
  if (!anchorIso) return null;
  const anchor = new Date(anchorIso);
  if (isNaN(anchor.getTime())) return null;

  const start = startOfMonth(year, monthIndex);
  const end = endOfMonth(year, monthIndex);

  // Determine period step
  let stepDays = 0;
  let stepMonths = 0;
  switch (billingCycle) {
    case "weekly":
      stepDays = 7;
      break;
    case "monthly":
      stepMonths = 1;
      break;
    case "quarterly":
      stepMonths = 3;
      break;
    case "yearly":
      stepMonths = 12;
      break;
    case "custom": {
      const n = customEvery && customEvery > 0 ? customEvery : 0;
      if (!n || !customUnit) return null;
      if (customUnit === "day") stepDays = n;
      else if (customUnit === "week") stepDays = n * 7;
      else if (customUnit === "month") stepMonths = n;
      else if (customUnit === "year") stepMonths = n * 12;
      break;
    }
    default:
      break;
  }

  // If anchor is before start, jump forward in multiples of the period
  let candidate: Date = anchor;

  if (stepMonths > 0) {
    if (candidate < start) {
      const diff = monthsDiff(candidate, start);
      const steps = Math.ceil(diff / stepMonths);
      candidate = addMonthsClamp(candidate, steps * stepMonths);
    }
    // If candidate still before start due to clamping day-of-month, step one more time
    while (candidate < start) {
      candidate = addMonthsClamp(candidate, stepMonths);
    }
  } else if (stepDays > 0) {
    if (candidate < start) {
      const msDiff = start.getTime() - candidate.getTime();
      const daysDiff = Math.ceil(msDiff / (24 * 60 * 60 * 1000));
      const steps = Math.ceil(daysDiff / stepDays);
      candidate = addDays(candidate, steps * stepDays);
    }
    while (candidate < start) {
      candidate = addDays(candidate, stepDays);
    }
  } else {
    // Unknown or unsupported cycle; treat anchor as the only occurrence
    if (candidate < start) return null;
  }

  if (candidate >= start && candidate <= end) return candidate;
  return null;
}

// Returns all occurrences within the target month (inclusive). For monthly/quarterly/yearly
// and custom month/year periods, at most one occurrence is returned. For weekly and custom
// day/week periods, multiple occurrences per month can be returned.
export function getOccurrencesInMonth(args: OccurrenceArgs): Date[] {
  const { anchorIso, billingCycle, customEvery, customUnit, year, monthIndex } =
    args;
  if (!anchorIso) return [];
  const anchor = new Date(anchorIso);
  if (isNaN(anchor.getTime())) return [];

  const start = startOfMonth(year, monthIndex);
  const end = endOfMonth(year, monthIndex);

  // Determine period step
  let stepDays = 0;
  let stepMonths = 0;
  switch (billingCycle) {
    case "weekly":
      stepDays = 7;
      break;
    case "monthly":
      stepMonths = 1;
      break;
    case "quarterly":
      stepMonths = 3;
      break;
    case "yearly":
      stepMonths = 12;
      break;
    case "custom": {
      const n = customEvery && customEvery > 0 ? customEvery : 0;
      if (!n || !customUnit) return [];
      if (customUnit === "day") stepDays = n;
      else if (customUnit === "week") stepDays = n * 7;
      else if (customUnit === "month") stepMonths = n;
      else if (customUnit === "year") stepMonths = n * 12;
      break;
    }
    default:
      break;
  }

  const results: Date[] = [];
  let candidate: Date = anchor;

  if (stepMonths > 0) {
    if (candidate < start) {
      const diff = monthsDiff(candidate, start);
      const steps = Math.ceil(diff / stepMonths);
      candidate = addMonthsClamp(candidate, steps * stepMonths);
    }
    while (candidate < start) candidate = addMonthsClamp(candidate, stepMonths);
    if (candidate >= start && candidate <= end) results.push(candidate);
    // Next month step will jump out of the current month, so no loop needed
  } else {
    // stepDays > 0 (weekly or custom day/week). If stepDays==0, treat anchor as one-off
    if (stepDays > 0) {
      if (candidate < start) {
        const msDiff = start.getTime() - candidate.getTime();
        const daysDiff = Math.ceil(msDiff / (24 * 60 * 60 * 1000));
        const steps = Math.ceil(daysDiff / stepDays);
        candidate = addDays(candidate, steps * stepDays);
      }
      while (candidate <= end) {
        if (candidate >= start) results.push(new Date(candidate.getTime()));
        candidate = addDays(candidate, stepDays);
      }
    } else {
      // Unknown or unsupported cycle; treat anchor as the only occurrence
      if (candidate >= start && candidate <= end) results.push(candidate);
    }
  }

  return results;
}
