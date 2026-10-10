"use client";

import { useState, useTransition } from "react";
import { useCanEdit } from "@/components/Viewer";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, PartyPopper } from "lucide-react";
import ProgressRing from "@/components/ProgressRing";
import Celebration from "@/components/Celebration";
import { setGoal, deleteGoal } from "@/lib/actions/goals";
import ThemeText from "@/components/ThemeText";

type Props = {
  year: number;
  target: number | null;
  booksRead: number;
};

function paceInfo(year: number, target: number, booksRead: number) {
  const now = new Date();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const yearFraction = Math.min(
    Math.max((now.getTime() - start.getTime()) / (end.getTime() - start.getTime()), 0),
    1
  );
  const expected = target * yearFraction;
  const diff = Math.round(booksRead - expected);
  const monthsLeft = Math.max(12 - now.getMonth() - now.getDate() / 31, 0.5);
  const remaining = Math.max(target - booksRead, 0);
  return {
    diff,
    perMonth: remaining / monthsLeft,
    remaining,
  };
}

const quickPicks = [12, 24, 36, 52];

export default function GoalCard({ year, target, booksRead }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(target === null);
  const [value, setValue] = useState(target ? String(target) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [replay, setReplay] = useState(0);
  const canEdit = useCanEdit();
  const [, startTransition] = useTransition();

  const reached = target !== null && booksRead >= target;
  const isCurrentYear = year === new Date().getFullYear();

  const save = async (n: number) => {
    setSaving(true);
    setError("");
    const result = await setGoal(year, n);
    setSaving(false);
    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }
    // Refresh and close the form together so the new goal appears in one step
    startTransition(() => {
      router.refresh();
      setEditing(false);
    });
  };

  const remove = async () => {
    if (!confirm(`Remove your ${year} reading goal?`)) return;
    setSaving(true);
    await deleteGoal(year);
    setSaving(false);
    setValue("");
    setEditing(true);
    router.refresh();
  };

  const pace = target ? paceInfo(year, target, booksRead) : null;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, var(--surface) 0%, var(--raised) 100%)",
        border: `1px solid ${reached ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "22px",
        padding: "clamp(20px, 4vw, 32px)",
        boxShadow: reached ? "0 0 40px rgb(var(--accent-rgb) / 0.18)" : "var(--shadow-md)",
      }}
    >
      {reached && (
        <Celebration
          key={replay}
          storageKey={`goal-celebrated-${year}-${target}`}
          force={replay > 0}
        />
      )}

      {/* Decorative steam swirl */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-40px",
          top: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgb(var(--primary-rgb) / 0.15), transparent 70%)",
        }}
      />

      {!canEdit && target === null ? (
        // Guests can't set goals; just say there isn't one yet
        <div style={{ position: "relative" }}>
          <h2 style={{ color: "var(--text)", fontSize: "22px", margin: "0 0 6px 0" }}>No goal set for {year}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
            {booksRead} {booksRead === 1 ? "book" : "books"} finished so far this year.
          </p>
        </div>
      ) : editing && canEdit ? (
        <div style={{ position: "relative", maxWidth: "460px" }}>
          <h2 style={{ color: "var(--text)", fontSize: "22px", margin: "0 0 6px 0" }}>
            {target ? `Edit your ${year} goal` : `Set your ${year} reading goal`}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 20px 0" }}>
            How many books would you like to read this year? Progress updates
            automatically every time you finish a book.
          </p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {quickPicks.map((n) => (
              <button
                key={n}
                onClick={() => setValue(String(n))}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: `1px solid ${value === String(n) ? "var(--primary)" : "var(--border)"}`,
                  backgroundColor: value === String(n) ? "var(--primary)" : "var(--bg)",
                  color: value === String(n) ? "var(--on-primary)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {n} books
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(value);
              if (!isNaN(n)) save(n);
            }}
            style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
          >
            <input
              type="number"
              min={1}
              max={1000}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 30"
              style={{
                flex: "1 1 140px",
                padding: "12px 16px",
                backgroundColor: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--text)",
                fontSize: "16px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={saving || !value}
              style={{
                padding: "12px 22px",
                backgroundColor: "var(--primary)",
                color: "var(--on-primary)",
                border: "none",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: saving || !value ? "not-allowed" : "pointer",
                opacity: saving || !value ? 0.5 : 1,
              }}
            >
              {saving ? "Saving..." : "Save Goal"}
            </button>
            {target && (
              <button
                type="button"
                onClick={() => {
                  setValue(String(target));
                  setEditing(false);
                }}
                style={{
                  padding: "12px 18px",
                  backgroundColor: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </form>
          {error && (
            <p style={{ color: "var(--danger)", fontSize: "13px", marginTop: "10px" }}>{error}</p>
          )}
          {booksRead > 0 && (
            <p style={{ color: "var(--text-faint)", fontSize: "13px", marginTop: "14px" }}>
              You&apos;ve already finished {booksRead} {booksRead === 1 ? "book" : "books"} in {year}.
            </p>
          )}
        </div>
      ) : (
        target !== null && (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "clamp(20px, 5vw, 40px)",
              flexWrap: "wrap",
            }}
          >
            <ProgressRing value={booksRead} max={target} size={180}>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--text)",
                  fontSize: "44px",
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {booksRead}
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
                of {target} books
              </span>
            </ProgressRing>

            <div style={{ flex: "1 1 240px", minWidth: 0 }}>
              <p
                style={{
                  color: "var(--primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  margin: "0 0 6px 0",
                }}
              >
                {year} Reading Goal
              </p>

              {reached ? (
                <>
                  <h2 style={{ color: "var(--accent)", fontSize: "26px", margin: "0 0 8px 0" }}>
                    Goal reached! 🎉
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
                    {booksRead === target ? (
                      <>
                        You read all {target} books you planned. <ThemeText id="goalTreat" />
                      </>
                    ) : (
                      `You smashed it — ${booksRead - target} more than you planned!`
                    )}
                  </p>
                </>
              ) : (
                <>
                  <h2 style={{ color: "var(--text)", fontSize: "26px", margin: "0 0 8px 0" }}>
                    {pace!.remaining} {pace!.remaining === 1 ? "book" : "books"} to go
                  </h2>
                  {isCurrentYear && (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
                      {pace!.diff > 0 ? (
                        <ThemeText id="ahead" n={pace!.diff} />
                      ) : pace!.diff < 0 ? (
                        `You're ${-pace!.diff} ${pace!.diff === -1 ? "book" : "books"} behind schedule — about ${pace!.perMonth.toFixed(1)} a month will get you there.`
                      ) : (
                        <ThemeText id="onSchedule" />
                      )}
                    </p>
                  )}
                </>
              )}

              {/* Linear bar for a quick read */}
              <div
                style={{
                  height: "8px",
                  backgroundColor: "var(--bg)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    width: `${Math.min((booksRead / target) * 100, 100)}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, var(--primary), var(--accent))",
                    borderRadius: "999px",
                    transition: "width 1s ease-out",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button data-owner-only onClick={() => setEditing(true)} className="goal-btn">
                  <Pencil size={14} /> Edit goal
                </button>
                {reached && (
                  <button onClick={() => setReplay((r) => r + 1)} className="goal-btn">
                    <PartyPopper size={14} /> Celebrate again
                  </button>
                )}
                <button data-owner-only onClick={remove} disabled={saving} className="goal-btn">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        )
      )}

      <style>{`
        .goal-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }
        .goal-btn:hover {
          color: var(--text);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
