"use client";

import Link from "next/link";
import Celebration from "@/components/Celebration";

type Props = {
  year: number;
  target: number;
};

// Shown on the book page right after the book that completes the yearly goal
export default function GoalReachedBanner({ year, target }: Props) {
  return (
    <>
      <Celebration storageKey={`goal-celebrated-${year}-${target}`} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
          padding: "16px 20px",
          marginBottom: "24px",
          borderRadius: "16px",
          border: "1px solid var(--accent)",
          background: "linear-gradient(135deg, rgb(var(--accent-rgb) / 0.18), rgb(var(--primary-rgb) / 0.08))",
        }}
      >
        <span style={{ fontSize: "30px" }}>🏆</span>
        <div style={{ flex: "1 1 200px" }}>
          <p style={{ color: "var(--accent)", fontWeight: 700, margin: 0, fontSize: "16px" }}>
            You reached your {year} reading goal!
          </p>
          <p style={{ color: "var(--text-muted)", margin: "2px 0 0 0", fontSize: "13px" }}>
            {target} books finished. That calls for a celebratory latte.
          </p>
        </div>
        <Link
          href="/goals"
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            backgroundColor: "var(--accent)",
            color: "var(--on-primary)",
            fontWeight: 700,
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          See your goal
        </Link>
      </div>
    </>
  );
}
