"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import FinishDateSelect from "@/components/FinishDateSelect";
import { setFinishDate } from "@/lib/actions/books";
import { dateToPick, type FinishPick } from "@/lib/finishDate";

type Book = {
  id: number;
  title: string;
  author: string;
  cover: string | null;
  dateCompleted: string | null;
  dateCompletedPrecision: string | null;
};

type Status = "saving" | "saved" | "error";
type Filter = "thisYear" | "noDate" | "all";

// Wait for a pause before saving, so picking year → month → day is one save
const SAVE_DELAY = 600;

export default function FinishDatesList({ books, currentYear }: { books: Book[]; currentYear: number }) {
  const [picks, setPicks] = useState<Record<number, FinishPick>>(() =>
    Object.fromEntries(books.map((b) => [b.id, dateToPick(b.dateCompleted, b.dateCompletedPrecision)]))
  );
  const [status, setStatus] = useState<Record<number, Status>>({});
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Which list a book is in is decided once, so a row doesn't vanish
  // the moment you move it to another year
  const [groups] = useState(() => {
    const initial = (b: Book) => dateToPick(b.dateCompleted, b.dateCompletedPrecision).year;
    return {
      thisYear: books.filter((b) => initial(b) === currentYear),
      noDate: books.filter((b) => initial(b) === null),
      all: books,
    };
  });
  const [filter, setFilter] = useState<Filter>(groups.thisYear.length ? "thisYear" : "all");

  useEffect(() => {
    const pending = timers.current;
    return () => Object.values(pending).forEach(clearTimeout);
  }, []);

  const change = (bookId: number, pick: FinishPick) => {
    setPicks((p) => ({ ...p, [bookId]: pick }));
    setStatus((s) => ({ ...s, [bookId]: "saving" }));
    clearTimeout(timers.current[bookId]);
    timers.current[bookId] = setTimeout(async () => {
      const result = await setFinishDate(bookId, pick).catch(() => ({ success: false }));
      setStatus((s) => ({ ...s, [bookId]: result.success ? "saved" : "error" }));
    }, SAVE_DELAY);
  };

  // Live count of books per year, so you can see your history take shape
  const perYear = new Map<number | null, number>();
  Object.values(picks).forEach((p) => perYear.set(p.year, (perYear.get(p.year) ?? 0) + 1));
  const yearCounts = Array.from(perYear)
    .filter(([y]) => y !== null)
    .sort((a, b) => b[0]! - a[0]!) as [number, number][];
  const undated = perYear.get(null) ?? 0;

  if (books.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 24px",
          backgroundColor: "var(--surface)",
          border: "1px dashed var(--border)",
          borderRadius: "16px",
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        Your Read shelf is empty — books you mark as read will show up here.
      </div>
    );
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: "thisYear", label: `Marked ${currentYear} (${groups.thisYear.length})` },
    { id: "noDate", label: `No date (${groups.noDate.length})` },
    { id: "all", label: `All read (${groups.all.length})` },
  ];
  const list = groups[filter];

  return (
    <div>
      {/* Books per year, updating as you go */}
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "14px 16px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 0 10px 0",
          }}
        >
          Books per year
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {yearCounts.map(([year, count]) => (
            <span
              key={year}
              style={{
                padding: "4px 12px",
                borderRadius: "999px",
                backgroundColor: year === currentYear ? "var(--primary)" : "var(--raised)",
                color: year === currentYear ? "var(--on-primary)" : "var(--text)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {year} · {count}
            </span>
          ))}
          {undated > 0 && (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "999px",
                border: "1px dashed var(--border)",
                color: "var(--text-muted)",
                fontSize: "13px",
              }}
            >
              No date · {undated}
            </span>
          )}
        </div>
      </div>

      {/* Which books to show */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {tabs.map((tab) => {
          const active = tab.id === filter;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              aria-pressed={active}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                backgroundColor: active ? "var(--primary)" : "transparent",
                color: active ? "var(--on-primary)" : "var(--text-muted)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filter === "thisYear" && list.length > 0 && (
        <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 14px 0" }}>
          Books added as Read used to get today&apos;s date, so some of these may really be older reads.
        </p>
      )}

      {list.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "20px 0" }}>Nothing here.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {list.map((book) => (
            <div
              key={book.id}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "10px 14px",
              }}
            >
              <BookCover cover={book.cover} title={book.title} author={book.author} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link
                  href={`/book/${book.id}`}
                  style={{
                    display: "block",
                    color: "var(--text)",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {book.title}
                </Link>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    margin: "2px 0 8px 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {book.author}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <FinishDateSelect compact value={picks[book.id]} onChange={(pick) => change(book.id, pick)} />
                  <SaveStatus status={status[book.id]} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SaveStatus({ status }: { status?: Status }) {
  if (!status) return null;
  const text = { saving: "Saving…", saved: "Saved ✓", error: "Didn't save — try again" }[status];
  const color = { saving: "var(--text-faint)", saved: "var(--success)", error: "var(--danger)" }[status];
  return (
    <span role="status" style={{ color, fontSize: "12px", fontWeight: 600 }}>
      {text}
    </span>
  );
}
