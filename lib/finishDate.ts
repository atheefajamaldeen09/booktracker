// When you finished a book, as precisely as you remember it.
// Old reads often only have a year (or a month), and that's fine: they still
// count toward that year, they just stay off the daily reading calendar.

export type FinishPrecision = "day" | "month" | "year";

// What you pick: a year, then optionally a month (0–11) and a day.
// No year means you don't remember when you finished it.
export type FinishPick = { year: number | null; month: number | null; day: number | null };

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const EARLIEST_YEAR = 1950;

export const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

// Today as a pick, in the reader's own time zone
export function todayPick(): FinishPick {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
}

// Picked dates are stored at midday UTC so they land on the same calendar day
// (and year) whatever time zone the server or browser is in.
export function pickToDate(pick: FinishPick): { date: Date | null; precision: FinishPrecision | null } | null {
  const { year, month, day } = pick;
  if (year === null) return { date: null, precision: null };

  const latestYear = new Date().getFullYear() + 1; // a little slack for time zones
  if (!Number.isInteger(year) || year < EARLIEST_YEAR || year > latestYear) return null;
  if (month === null) return { date: new Date(Date.UTC(year, 0, 1, 12)), precision: "year" };

  if (!Number.isInteger(month) || month < 0 || month > 11) return null;
  if (day === null) return { date: new Date(Date.UTC(year, month, 1, 12)), precision: "month" };

  if (!Number.isInteger(day) || day < 1 || day > daysInMonth(year, month)) return null;
  return { date: new Date(Date.UTC(year, month, day, 12)), precision: "day" };
}

export function dateToPick(date: Date | string | null, precision: string | null): FinishPick {
  if (!date) return { year: null, month: null, day: null };
  const d = new Date(date);
  return {
    year: d.getUTCFullYear(),
    month: precision === "year" ? null : d.getUTCMonth(),
    day: precision === "year" || precision === "month" ? null : d.getUTCDate(),
  };
}

// "14 March 2023", "March 2023", "2023" — or null when there's no date
export function formatFinish(date: Date | string | null, precision: string | null) {
  if (!date) return null;
  const d = new Date(date);
  if (precision === "year") return String(d.getUTCFullYear());
  if (precision === "month") return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
