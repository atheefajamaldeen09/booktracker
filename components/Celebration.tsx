"use client";

import { useEffect, useMemo, useState } from "react";

const COLORS = ["var(--primary)", "var(--accent)", "var(--text)", "var(--success)", "var(--star)", "var(--danger)"];
const PIECES = 90;

type Props = {
  // Unique key so the burst only plays automatically once (e.g. "goal-2026-30")
  storageKey: string;
  // Play even if it has been seen before (remount with a new key to replay)
  force?: boolean;
};

// Confetti burst used when a reading goal is reached
export default function Celebration({ storageKey, force = false }: Props) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(storageKey) === "1";
    } catch {
      // Storage unavailable — just celebrate
    }
    if (seen && !force) return;

    // Short delay so the page has painted before the confetti starts
    const start = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, "1");
      } catch {}
      setPlaying(true);
    }, 200);
    const stop = setTimeout(() => setPlaying(false), 5000);
    return () => {
      clearTimeout(start);
      clearTimeout(stop);
    };
  }, [storageKey, force]);

  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        left: (i * 37) % 100,
        delay: ((i * 13) % 20) / 10,
        duration: 2.6 + ((i * 7) % 15) / 10,
        size: 6 + ((i * 5) % 7),
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    []
  );

  if (!playing) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 2000,
      }}
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.round ? p.size : p.size * 1.6}px`,
            backgroundColor: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}
