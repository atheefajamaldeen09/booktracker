"use client";

// Where you stopped and why — used when adding a book as DNF, moving a book to
// DNF, and editing a DNF book's note. Both are optional.
const QUICK_REASONS = [
  "Lost interest",
  "Too slow",
  "Couldn't connect with the characters",
  "Writing style wasn't for me",
  "Not in the mood right now",
];

export default function DnfFields({
  page,
  reason,
  pageCount,
  onPageChange,
  onReasonChange,
  surface = "var(--surface)",
}: {
  page: string;
  reason: string;
  pageCount?: number | null;
  onPageChange: (page: string) => void;
  onReasonChange: (reason: string) => void;
  // Background for the inputs, to stand out from whatever they sit on
  surface?: string;
}) {
  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: surface,
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };
  const label: React.CSSProperties = {
    color: "var(--text-muted)",
    fontSize: "12px",
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <div>
        <label style={label}>
          Stopped at page <span style={{ textTransform: "none", letterSpacing: 0, opacity: 0.7 }}>(if you remember)</span>
        </label>
        <input
          type="number"
          min={0}
          max={pageCount ?? undefined}
          value={page}
          onChange={(e) => onPageChange(e.target.value)}
          placeholder={pageCount ? `out of ${pageCount}` : "e.g. 80"}
          style={{ ...input, maxWidth: "180px" }}
        />
      </div>
      <div>
        <label style={label}>Why did you stop?</label>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
          {QUICK_REASONS.map((r) => {
            const on = reason === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onReasonChange(on ? "" : r)}
                aria-pressed={on}
                style={{
                  padding: "5px 11px",
                  borderRadius: "999px",
                  border: `1px solid ${on ? "var(--danger)" : "var(--border)"}`,
                  backgroundColor: on ? "var(--danger-bg)" : "transparent",
                  color: on ? "var(--text)" : "var(--text-muted)",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
        <textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Or in your own words…"
          rows={2}
          style={{ ...input, resize: "vertical", fontFamily: "inherit" }}
        />
      </div>
    </div>
  );
}

// "80" → 80, "" → null
export const parsePage = (page: string) => {
  const n = parseInt(page);
  return Number.isNaN(n) || n < 0 ? null : n;
};
