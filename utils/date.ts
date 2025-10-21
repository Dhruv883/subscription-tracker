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
