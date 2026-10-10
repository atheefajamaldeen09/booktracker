"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import StarRating from "@/components/StarRating";
import FinishDateSelect from "@/components/FinishDateSelect";
import { setFinishDate, updateRating } from "@/lib/actions/books";
import type { FinishPick } from "@/lib/finishDate";

type Book = {
  id: number;
  title: string;
  author: string;
  cover: string | null;
  rating: number | null;
  dateCompleted: string | null;
  dateCompletedPrecision: string | null;
};

type Status = "saving" | "saved" | "error";

// Wait for a pause before saving, so picking year → month → day is one save
const SAVE_DELAY = 600;
// How many books to show before "Show all"
const PREVIEW = 3;

const NO_DATE: FinishPick = { year: null, month: null, day: null };

// Finished books still missing a rating or a finish date, fixable right here.
// A row stays put once it's filled in, so you can still change your mind.
export default function LooseEnds({ books }: { books: Book[] }) {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [picks, setPicks] = useState<Record<number, FinishPick>>({});
  const [status, setStatus] = useState<Record<number, Status>>({});
  const [showAll, setShowAll] = useState(false);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const pending = timers.current;
    return () => Object.values(pending).forEach(clearTimeout);
  }, []);

  const mark = (bookId: number, value: Status) => setStatus((s) => ({ ...s, [bookId]: value }));

  const rate = async (bookId: number, rating: number) => {
    setRatings((r) => ({ ...r, [bookId]: rating }));
    mark(bookId, "saving");
    const result = await updateRating(bookId, rating).catch(() => ({ success: false }));
    mark(bookId, result.success ? "saved" : "error");
  };

  const date = (bookId: number, pick: FinishPick) => {
    setPicks((p) => ({ ...p, [bookId]: pick }));
    mark(bookId, "saving");
    clearTimeout(timers.current[bookId]);
    timers.current[bookId] = setTimeout(async () => {
      const result = await setFinishDate(bookId, pick).catch(() => ({ success: false }));
      mark(bookId, result.success ? "saved" : "error");
    }, SAVE_DELAY);
  };

  const needsRating = (b: Book) => b.rating === null;
  const needsDate = (b: Book) => b.dateCompleted === null;
  const isDone = (b: Book) =>
    (!needsRating(b) || ratings[b.id] > 0) && (!needsDate(b) || (picks[b.id]?.year ?? null) !== null);

  const left = books.filter((b) => !isDone(b)).length;
  const list = showAll ? books : books.slice(0, PREVIEW);

  const label: React.CSSProperties = {
    color: "var(--text-muted)",
    fontSize: "12px",
    width: "62px",
    flex: "none",
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        padding: "16px",
      }}
    >
      <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 14px 0" }}>
        {left === 0
          ? "All tidied up — every one of these has its stars and its date now. ✨"
          : `${left} finished ${left === 1 ? "book is" : "books are"} missing a rating or a finish date. Fill them in here — it saves as you go.`}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {list.map((book) => (
          <div
            key={book.id}
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              backgroundColor: "var(--bg)",
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

              {needsRating(book) && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: needsDate(book) ? "8px" : 0 }}>
                  <span style={label}>Rating</span>
                  <StarRating rating={ratings[book.id] ?? 0} onRatingChange={(r) => rate(book.id, r)} />
                  {ratings[book.id] > 0 && (
                    <span style={{ color: "var(--text)", fontSize: "13px" }}>{ratings[book.id]} / 5</span>
                  )}
                </div>
              )}

              {needsDate(book) && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={label}>Finished</span>
                  <FinishDateSelect compact value={picks[book.id] ?? NO_DATE} onChange={(pick) => date(book.id, pick)} />
                </div>
              )}

              <SaveStatus status={status[book.id]} />
            </div>
          </div>
        ))}
      </div>

      {books.length > PREVIEW && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            marginTop: "12px",
            background: "none",
            border: "none",
            padding: 0,
            color: "var(--primary)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showAll ? "Show fewer" : `Show all ${books.length}`}
        </button>
      )}
    </div>
  );
}

function SaveStatus({ status }: { status?: Status }) {
  if (!status) return null;
  const text = { saving: "Saving…", saved: "Saved ✓", error: "Didn't save — try again" }[status];
  const color = { saving: "var(--text-faint)", saved: "var(--success)", error: "var(--danger)" }[status];
  return (
    <span role="status" style={{ display: "block", marginTop: "6px", color, fontSize: "12px", fontWeight: 600 }}>
      {text}
    </span>
  );
}
