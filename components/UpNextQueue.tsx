"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

// Books you've picked to read next but haven't started. Start one straight
// from here, or take it back off the list (it stays on your TBR).
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

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          gap: "14px",
        }}
      >
        {books.map((book, index) => {
          const busy = busyId === book.id;
          return (
            <div
              key={book.id}
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
              <Link href={`/book/${book.id}`} style={{ flex: "none", textDecoration: "none" }}>
                <BookCover cover={book.cover} title={book.title} author={book.author ?? undefined} size="md" />
              </Link>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    color: "var(--primary)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {index === 0 ? "Next up" : `Up next · #${index + 1}`}
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
                      textOverflow: "ellipsis",
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
                      disabled={busy}
                      style={{
                        padding: "8px 14px",
                        backgroundColor: "var(--primary)",
                        color: "var(--on-primary)",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: busy ? "not-allowed" : "pointer",
                        opacity: busy ? 0.6 : 1,
                      }}
                    >
                      {busy ? "Working..." : "📖 Start reading"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(book.id)}
                      disabled={busy}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "transparent",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: busy ? "not-allowed" : "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {error && <p style={{ color: "var(--danger)", fontSize: "13px", margin: "10px 0 0" }}>{error}</p>}
    </div>
  );
}