"use client";

import { useState, useTransition } from "react";
import { MOODS } from "@/lib/moods";
import { updateBookMoods } from "@/lib/actions/books";
import { useCanEdit } from "@/components/Viewer";

const COMMON_MOODS = 12;

// Tap moods on and off; they save straight away. Guests only see the chosen ones.
export default function MoodPicker({ bookId, initial }: { bookId: number; initial: string[] }) {
  const isGuest = !useCanEdit();
  const [moods, setMoods] = useState(initial);
  const [, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const toggle = (id: string) => {
    const next = moods.includes(id) ? moods.filter((m) => m !== id) : [...moods, id];
    setMoods(next);
    setError(false);
    startTransition(async () => {
      const result = await updateBookMoods(bookId, next);
      if (!result.success) {
        setMoods(moods);
        setError(true);
      }
    });
  };

  // The first dozen plus any you've picked, until you ask for the rest
  const shown = isGuest
    ? MOODS.filter((m) => moods.includes(m.id))
    : showAll
    ? MOODS
    : MOODS.filter((m, i) => i < COMMON_MOODS || moods.includes(m.id));
  if (shown.length === 0) return null;

  return (
    <section style={{ marginBottom: "28px" }}>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          margin: "0 0 10px",
        }}
      >
        Mood
        {!isGuest && (
          <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--text-faint)" }}>
            {" "}
            — how does this book feel?
          </span>
        )}
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {shown.map((m) => {
          const on = moods.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={on}
              disabled={isGuest}
              onClick={() => toggle(m.id)}
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                border: `1px solid ${on ? "var(--primary)" : "var(--border)"}`,
                backgroundColor: on ? "rgb(var(--primary-rgb) / 0.16)" : "var(--surface)",
                color: on ? "var(--text)" : "var(--text-muted)",
                fontSize: "13px",
                fontWeight: on ? 600 : 500,
                cursor: isGuest ? "default" : "pointer",
              }}
            >
              {m.emoji} {m.label}
            </button>
          );
        })}
        {!isGuest && MOODS.length > shown.length && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            style={{
              padding: "5px 12px",
              borderRadius: "999px",
              border: "1px dashed var(--border)",
              backgroundColor: "transparent",
              color: "var(--primary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + {MOODS.length - shown.length} more moods
          </button>
        )}
      </div>
      {error && <p style={{ color: "var(--danger)", fontSize: "13px", margin: "8px 0 0" }}>Couldn&apos;t save that — try again.</p>}
    </section>
  );
}
