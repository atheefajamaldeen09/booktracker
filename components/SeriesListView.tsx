"use client";

import Link from "next/link";
import { useState } from "react";
import BookCover from "@/components/BookCover";
import SeriesPips from "@/components/SeriesPips";
import { seriesSlots } from "@/lib/series";
import styles from "./Series.module.css";

type SeriesWithStats = {
  id: number;
  name: string;
  totalBooks: number | null;
  totalOwned: number;
  totalRead: number;
  books: { id: number; title: string; cover: string | null; shelf: string; position: number }[];
};

type Props = {
  series: SeriesWithStats[];
};

type Filter = "all" | "going" | "new" | "done";

// How many covers fit along a card's little shelf
const COVERS_SHOWN = 4;

// Finished means every book is read: all of the series when you know how
// long it is, otherwise all the ones you have
const isDone = (s: SeriesWithStats) => s.totalRead > 0 && s.totalRead >= (s.totalBooks ?? s.totalOwned);
const isCollected = (s: SeriesWithStats) => !!s.totalBooks && s.totalOwned >= s.totalBooks;

export default function SeriesListView({ series }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

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

  const groups: Record<Filter, SeriesWithStats[]> = {
    all: series,
    going: series.filter((s) => !isDone(s) && (s.totalRead > 0 || s.books.some((b) => b.shelf === "reading"))),
    new: series.filter((s) => s.totalRead === 0 && !s.books.some((b) => b.shelf === "reading")),
    done: series.filter(isDone),
  };
  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "going", label: "In progress" },
    { id: "new", label: "Not started" },
    { id: "done", label: "Finished" },
  ];

  return (
    <div>
      <div role="tablist" className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={filter === tab.id}
            className={styles.tab}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
            <span>{groups[tab.id].length}</span>
          </button>
        ))}
      </div>

      {groups[filter].length === 0 && (
        <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "24px 0" }}>
          No series here yet.
        </p>
      )}

      <div className={styles.grid}>
        {groups[filter].map((s) => {
          const slots = seriesSlots(s.books, s.totalBooks);
          const shown = slots.slice(0, COVERS_SHOWN);
          const hidden = slots.length - shown.length;
          const of = s.totalBooks ?? s.totalOwned;

          return (
            <Link key={s.id} href={`/series/${s.id}`} className={styles.card}>
              {isDone(s) ? (
                <span className={styles.ribbon}>Finished</span>
              ) : isCollected(s) ? (
                <span className={styles.ribbon} data-kind="collected">
                  All collected
                </span>
              ) : null}

              {/* The first few books, with gaps where one is missing */}
              <div className={styles.nook} aria-hidden>
                {shown.map((slot, i) =>
                  slot.book ? (
                    <BookCover key={i} cover={slot.book.cover} title={slot.book.title} size="sm" />
                  ) : (
                    <div key={i} className={styles.ghost}>
                      {slot.position}
                    </div>
                  )
                )}
                {hidden > 0 && <span className={styles.more}>+{hidden}</span>}
              </div>
              <div className={styles.board} />

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{s.name}</h3>
                <p className={styles.cardMeta}>
                  <strong>
                    {s.totalRead} of {of}
                  </strong>{" "}
                  read
                  {s.totalBooks
                    ? ` · ${s.totalOwned} on your shelf`
                    : " · series length not set"}
                </p>
                <SeriesPips books={s.books} totalBooks={s.totalBooks} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
