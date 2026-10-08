"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { updateReadingProgress } from "@/lib/actions/books";
import { useCanEdit } from "@/components/Viewer";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  currentPage: number | null;
  pageCount: number | null;
};

type Props = {
  books: Book[];
};

export default function CurrentlyReadingWidget({ books }: Props) {
  const canEdit = useCanEdit();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newPage, setNewPage] = useState<{ [key: number]: string }>({});
  const [updating, setUpdating] = useState<number | null>(null);

  const handleQuickUpdate = async (bookId: number, currentPage: number, pageCount: number) => {
    const pageValue = newPage[bookId];
    if (!pageValue) return;

    const page = parseInt(pageValue);
    if (isNaN(page) || page < currentPage || page > pageCount) return;

    setUpdating(bookId);
    await updateReadingProgress(bookId, page, currentPage);
    setNewPage({ ...newPage, [bookId]: "" });
    setExpandedId(null);
    setUpdating(null);
    router.refresh();
  };

  if (books.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px dashed var(--border)",
          borderRadius: "18px",
          padding: "28px 24px",
          textAlign: "center",
          height: "calc(100% - 40px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📖</div>
        <h3
          style={{
            color: "var(--text)",
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          No books currently reading
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
          Start a book from your TBR to track your progress
        </p>
        <Link
          href="/library?shelf=tbr"
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
          Browse your TBR
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {books.map((book) => {
        const progress = book.pageCount
          ? Math.round(((book.currentPage || 0) / book.pageCount) * 100)
          : 0;
        const isExpanded = expandedId === book.id;

        return (
          <div
            key={book.id}
            style={{
              background: "linear-gradient(135deg, var(--surface), var(--raised))",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              padding: "18px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <Link
              href={`/book/${book.id}`}
              style={{
                display: "flex",
                gap: "16px",
                textDecoration: "none",
                marginBottom: "12px",
              }}
            >
              <BookCover
                cover={book.cover}
                title={book.title}
                author={book.author ?? undefined}
                size="md"
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    color: "var(--text)",
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                    lineHeight: "1.3",
                  }}
                >
                  {book.title}
                </h3>
                <p
                  style={{
                    color: "var(--primary)",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                >
                  {book.author}
                </p>

                {book.pageCount && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "12px",
                          margin: 0,
                        }}
                      >
                        Progress
                      </p>
                      <p
                        style={{
                          color: "var(--text)",
                          fontSize: "12px",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        {progress}% ({book.currentPage || 0} / {book.pageCount})
                      </p>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "10px",
                        backgroundColor: "var(--bg)",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, var(--primary), var(--accent))",
                          borderRadius: "999px",
                          transition: "width 0.6s ease-out",
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </Link>

            {/* Quick Update */}
            {canEdit && book.pageCount && (
              <>
                {!isExpanded ? (
                  <button
                    onClick={() => setExpandedId(book.id)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "var(--raised)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      color: "var(--text)",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    📊 Quick Update Progress
                  </button>
                ) : (
                  <div
                    style={{
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <label
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Update to page:
                    </label>
                    <input
                      type="number"
                      value={newPage[book.id] || ""}
                      onChange={(e) =>
                        setNewPage({ ...newPage, [book.id]: e.target.value })
                      }
                      placeholder={`Current: ${book.currentPage || 0}`}
                      min={book.currentPage || 0}
                      max={book.pageCount}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text)",
                        fontSize: "14px",
                        outline: "none",
                        marginBottom: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() =>
                          handleQuickUpdate(
                            book.id,
                            book.currentPage || 0,
                            book.pageCount ?? 0
                          )
                        }
                        disabled={
                          updating === book.id ||
                          !newPage[book.id] ||
                          parseInt(newPage[book.id]) <= (book.currentPage || 0)
                        }
                        style={{
                          flex: 1,
                          padding: "8px",
                          backgroundColor:
                            updating === book.id ||
                            !newPage[book.id] ||
                            parseInt(newPage[book.id]) <= (book.currentPage || 0)
                              ? "var(--primary)"
                              : "var(--primary)",
                          border: "none",
                          borderRadius: "8px",
                          color: "var(--on-primary)",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor:
                            updating === book.id ||
                            !newPage[book.id] ||
                            parseInt(newPage[book.id]) <= (book.currentPage || 0)
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            updating === book.id ||
                            !newPage[book.id] ||
                            parseInt(newPage[book.id]) <= (book.currentPage || 0)
                              ? 0.5
                              : 1,
                        }}
                      >
                        {updating === book.id ? "Updating..." : "Update"}
                      </button>
                      <button
                        onClick={() => {
                          setExpandedId(null);
                          setNewPage({ ...newPage, [book.id]: "" });
                        }}
                        disabled={updating === book.id}
                        style={{
                          flex: 1,
                          padding: "8px",
                          backgroundColor: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-muted)",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}