"use client";

import Link from "next/link";
import { useState } from "react";

type SeriesWithStats = {
  id: number;
  name: string;
  totalBooks: number | null;
  totalOwned: number;
  totalRead: number;
};

type Props = {
  series: SeriesWithStats[];
};

export default function SeriesListView({ series }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (series.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
        <h2
          style={{
            color: "var(--text)",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          No series yet
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          Add a book that&apos;s part of a series to get started
        </p>
        <Link
          data-owner-only
          href="/add"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "var(--primary)",
            color: "var(--on-primary)",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          + Add Book
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "16px",
      }}
    >
      {series.map((s) => {
        const completionPercentage = s.totalBooks
          ? Math.round((s.totalRead / s.totalBooks) * 100)
          : s.totalOwned > 0
          ? Math.round((s.totalRead / s.totalOwned) * 100)
          : 0;

        const isHovered = hoveredId === s.id;

        return (
          <Link
            key={s.id}
            href={`/series/${s.id}`}
            style={{
              display: "block",
              backgroundColor: isHovered ? "var(--raised)" : "var(--surface)",
              border: `1px solid ${isHovered ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "14px",
              padding: "20px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <h3
              style={{
                color: "var(--text)",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "12px",
                lineHeight: "1.3",
              }}
            >
              📚 {s.name}
            </h3>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "999px",
                }}
              >
                {s.totalOwned} owned
              </span>

              {s.totalBooks && (
                <span
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontSize: "11px",
                    padding: "4px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {s.totalBooks} total
                </span>
              )}

              {s.totalRead > 0 && (
                <span
                  style={{
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--success)",
                    color: "var(--success)",
                    fontSize: "11px",
                    padding: "4px 8px",
                    borderRadius: "999px",
                  }}
                >
                  ✓ {s.totalRead} read
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <p
                  style={{
                    color: "var(--text-faint)",
                    fontSize: "11px",
                    margin: 0,
                  }}
                >
                  Progress
                </p>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "11px",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  {completionPercentage}%
                </p>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${completionPercentage}%`,
                    height: "100%",
                    backgroundColor: "var(--success)",
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}