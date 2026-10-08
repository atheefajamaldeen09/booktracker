import Link from "next/link";
import ProgressRing from "@/components/ProgressRing";
import Celebration from "@/components/Celebration";

type Props = {
  year: number;
  target: number | null;
  booksRead: number;
};

// Annual goal summary shown on the home page
export default function DashboardGoal({ year, target, booksRead }: Props) {
  if (target === null) {
    return (
      <Link
        href="/goals"
        className="hover-lift"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          textAlign: "center",
          height: "100%",
          minHeight: "200px",
          padding: "24px",
          borderRadius: "18px",
          border: "1px dashed var(--border)",
          backgroundColor: "var(--surface)",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: "36px" }}>🎯</span>
        <span style={{ color: "var(--text)", fontWeight: 600, fontSize: "16px" }}>
          Set a {year} reading goal
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "13px", maxWidth: "220px" }}>
          {booksRead > 0
            ? `You've read ${booksRead} ${booksRead === 1 ? "book" : "books"} so far — how many more?`
            : "Pick a number and track it automatically as you finish books."}
        </span>
      </Link>
    );
  }

  const reached = booksRead >= target;
  const pct = Math.round(Math.min(booksRead / target, 1) * 100);

  return (
    <Link
      href="/goals"
      className="hover-lift"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        height: "100%",
        padding: "24px",
        borderRadius: "18px",
        border: `1px solid ${reached ? "var(--accent)" : "var(--border)"}`,
        background: "linear-gradient(160deg, var(--surface), var(--raised))",
        textDecoration: "none",
      }}
    >
      {reached && <Celebration storageKey={`goal-celebrated-${year}-${target}`} />}
      <span
        style={{
          color: "var(--primary)",
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
        }}
      >
        {year} Goal
      </span>
      <ProgressRing value={booksRead} max={target} size={136} stroke={11}>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--text)",
            fontSize: "32px",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {booksRead}
          <span style={{ color: "var(--text-faint)", fontSize: "18px" }}>/{target}</span>
        </span>
        <span style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>
          {pct}% complete
        </span>
      </ProgressRing>
      <span style={{ color: reached ? "var(--accent)" : "var(--text-muted)", fontSize: "13px" }}>
        {reached
          ? "🏆 Goal reached!"
          : `${target - booksRead} more to go`}
      </span>
    </Link>
  );
}
