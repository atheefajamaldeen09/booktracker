"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Pin, X } from "lucide-react";
import BookCover from "@/components/BookCover";
import { startReading, unqueueBook } from "@/lib/actions/books";
import { useCanEdit } from "@/components/Viewer";

type QueuedBook = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  pageCount: number | null;
};

// Roughly how long a book takes at an average pace, as a friendly hint
function readingTimeHint(pages: number | null) {
  if (!pages) return null;
  const hours = pages / 40; // about 40 pages an hour
  if (hours < 1.5) return "about an hour";
  return `about ${Math.round(hours)} hours`;
}

// Books you've picked to read next but haven't started. The first one gets a
// bigger "Next up" card; any others wait below it. Start one straight from
// here, or take it back off the list (it stays on your TBR).
export default function UpNextQueue({ books }: { books: QueuedBook[] }) {
  const router = useRouter();
  const canEdit = useCanEdit();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (books.length === 0) return null;

  const handleStart = async (bookId: number) => {
    setBusyId(bookId);
    setError(null);
    const result = await startReading(bookId);
    if (!result.success) {
      setError("Couldn't start that book — try again.");
      setBusyId(null);
      return;
    }
    router.push(`/book/${bookId}`);
  };

  const handleRemove = async (bookId: number) => {
    setBusyId(bookId);
    setError(null);
    const result = await unqueueBook(bookId);
    setBusyId(null);
    if (!result.success) {
      setError("Couldn't remove that book — try again.");
      return;
    }
    router.refresh();
  };

  const startButton = (bookId: number, large: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: large ? "11px 20px" : "8px 14px",
    backgroundColor: "var(--primary)",
    color: "var(--on-primary)",
    border: "none",
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: large ? "14px" : "13px",
    cursor: busyId === bookId ? "not-allowed" : "pointer",
    opacity: busyId === bookId ? 0.6 : 1,
    boxShadow: "0 4px 14px rgb(var(--primary-rgb) / 0.3)",
  });

  const removeButton = (bookId: number): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "transparent",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "13px",
    cursor: busyId === bookId ? "not-allowed" : "pointer",
  });

  const [first, ...rest] = books;
  const hint = readingTimeHint(first.pageCount);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* The book you're reading next */}
      <div
        className="hover-lift"
        style={{
          position: "relative",
          display: "flex",
          gap: "22px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "22px",
          borderRadius: "20px",
          border: "1px solid rgb(var(--primary-rgb) / 0.35)",
          background:
            "radial-gradient(circle at 0% 0%, rgb(var(--primary-rgb) / 0.18), transparent 55%), var(--surface)",
          overflow: "hidden",
        }}
      >
        <Link
          href={`/book/${first.id}`}
          aria-label={`Open ${first.title}`}
          style={{
            flex: "none",
            textDecoration: "none",
            borderRadius: "8px",
            boxShadow: "0 12px 28px rgb(0 0 0 / 0.35)",
            transform: "rotate(-2deg)",
            lineHeight: 0,
          }}
        >
          <BookCover cover={first.cover} title={first.title} author={first.author ?? undefined} size="lg" />
        </Link>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              backgroundColor: "rgb(var(--primary-rgb) / 0.16)",
              color: "var(--primary)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <Pin size={12} fill="currentColor" /> Next up
          </span>

          <Link href={`/book/${first.id}`} style={{ textDecoration: "none" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text)",
                fontSize: "24px",
                fontWeight: 600,
                lineHeight: 1.2,
                margin: "10px 0 4px",
              }}
            >
              {first.title}
            </h3>
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
            {first.author}
            {first.pageCount ? ` · ${first.pageCount} pages` : ""}
            {hint ? ` · ${hint}` : ""}
          </p>

          {canEdit && (
            <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleStart(first.id)}
                disabled={busyId === first.id}
                style={startButton(first.id, true)}
              >
                <BookOpen size={16} /> {busyId === first.id ? "Starting..." : "Start reading"}
              </button>
              <button
                type="button"
                onClick={() => handleRemove(first.id)}
                disabled={busyId === first.id}
                style={removeButton(first.id)}
              >
                <X size={14} /> Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Everything else waiting in line */}
      {rest.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "12px",
          }}
        >
          {rest.map((book, index) => (
            <div
              key={book.id}
              className="hover-lift"
              style={{
                display: "flex",
                gap: "14px",
                padding: "14px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                minWidth: 0,
              }}
            >
              <Link
                href={`/book/${book.id}`}
                aria-label={`Open ${book.title}`}
                style={{ flex: "none", textDecoration: "none", lineHeight: 0 }}
              >
                <BookCover cover={book.cover} title={book.title} author={book.author ?? undefined} size="md" />
              </Link>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    color: "var(--primary)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Then · #{index + 2}
                </p>
                <Link href={`/book/${book.id}`} style={{ textDecoration: "none" }}>
                  <p
                    style={{
                      color: "var(--text)",
                      fontWeight: 600,
                      fontSize: "15px",
                      lineHeight: 1.3,
                      margin: "4px 0 2px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {book.title}
                  </p>
                </Link>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
                  {book.author}
                  {book.pageCount ? ` · ${book.pageCount} pages` : ""}
                </p>

                {canEdit && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "10px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => handleStart(book.id)}
                      disabled={busyId === book.id}
                      style={startButton(book.id, false)}
                    >
                      <BookOpen size={14} /> {busyId === book.id ? "Working..." : "Start"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(book.id)}
                      disabled={busyId === book.id}
                      aria-label={`Remove ${book.title} from Up Next`}
                      style={removeButton(book.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: "var(--danger)", fontSize: "13px", margin: 0 }}>{error}</p>}
    </div>
  );
}