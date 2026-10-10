"use client";

import { daysInMonth, EARLIEST_YEAR, MONTH_NAMES, todayPick, type FinishPick } from "@/lib/finishDate";

// Year → month → day, each optional after the one before it.
// Pick only a year when that's all you remember.
export default function FinishDateSelect({
  value,
  onChange,
  compact = false,
}: {
  value: FinishPick;
  onChange: (pick: FinishPick) => void;
  // Smaller selects and no hint, for long lists of books
  compact?: boolean;
}) {
  const today = todayPick();
  const years = Array.from({ length: today.year! - EARLIEST_YEAR + 1 }, (_, i) => today.year! - i);
  const isThisYear = value.year === today.year;
  const isThisMonth = isThisYear && value.month === today.month;
  const months = MONTH_NAMES.slice(0, isThisYear ? today.month! + 1 : 12);
  const dayCount =
    value.year !== null && value.month !== null
      ? isThisMonth
        ? today.day!
        : daysInMonth(value.year, value.month)
      : 0;

  // A new year or month starts fresh: the old month/day belonged to the old date
  // (and books added before this existed all got today's month and day)
  const setYear = (raw: string) => onChange({ year: raw ? Number(raw) : null, month: null, day: null });
  const setMonth = (raw: string) => onChange({ year: value.year, month: raw === "" ? null : Number(raw), day: null });
  const setDay = (raw: string) => onChange({ ...value, day: raw ? Number(raw) : null });

  const select: React.CSSProperties = {
    padding: compact ? "7px 8px" : "10px 12px",
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: compact ? "13px" : "14px",
    outline: "none",
    minWidth: 0,
    cursor: "pointer",
  };
  const disabled: React.CSSProperties = { ...select, opacity: 0.45, cursor: "not-allowed" };

  const hint =
    value.year === null
      ? "No date — it still counts in your total books read."
      : value.month === null
      ? `Counts toward ${value.year}, but stays off the daily calendar.`
      : value.day === null
      ? `Counts toward ${MONTH_NAMES[value.month]} ${value.year}, but stays off the daily calendar.`
      : null;

  return (
    <div>
      <div style={{ display: "flex", gap: compact ? "6px" : "8px", flexWrap: "wrap", alignItems: "center" }}>
        <select
          aria-label="Year finished"
          value={value.year ?? ""}
          onChange={(e) => setYear(e.target.value)}
          style={{ ...select, flex: compact ? "0 0 auto" : "1 1 110px" }}
        >
          <option value="">Not sure</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          aria-label="Month finished"
          value={value.month ?? ""}
          onChange={(e) => setMonth(e.target.value)}
          disabled={value.year === null}
          style={{ ...(value.year === null ? disabled : select), flex: compact ? "0 0 auto" : "1 1 130px" }}
        >
          <option value="">{compact ? "Month?" : "Any month"}</option>
          {months.map((m, i) => (
            <option key={m} value={i}>
              {compact ? m.slice(0, 3) : m}
            </option>
          ))}
        </select>
        <select
          aria-label="Day finished"
          value={value.day ?? ""}
          onChange={(e) => setDay(e.target.value)}
          disabled={value.month === null}
          style={{ ...(value.month === null ? disabled : select), flex: compact ? "0 0 auto" : "1 1 90px" }}
        >
          <option value="">{compact ? "Day?" : "Any day"}</option>
          {Array.from({ length: dayCount }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {!compact && (
          <button
            type="button"
            onClick={() => onChange(todayPick())}
            style={{
              padding: "10px 12px",
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Today
          </button>
        )}
      </div>
      {!compact && hint && (
        <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "8px 0 0 0" }}>{hint}</p>
      )}
    </div>
  );
}
