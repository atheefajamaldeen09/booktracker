"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { updateReadingProgress } from "@/lib/actions/books";

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
          backgroundColor: "#2A1C0F",
          border: "1px solid #4A3020",
          borderRadius: "14px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📖</div>
        <h3
          style={{
            color: "#F5ECD7",
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          No books currently reading
        </h3>
        <p style={{ color: "#A89070", fontSize: "14px", marginBottom: "16px" }}>
          Start a book from your TBR to track your progress
        </p>
        <Link
          href="/library"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#C8813A",
            color: "#F5ECD7",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Browse Library
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
              backgroundColor: "#2A1C0F",
              border: "1px solid #4A3020",
              borderRadius: "14px",
              padding: "16px",
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
                    color: "#F5ECD7",
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
                    color: "#C8813A",
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
                          color: "#A89070",
                          fontSize: "12px",
                          margin: 0,
                        }}
                      >
                        Progress
                      </p>
                      <p
                        style={{
                          color: "#F5ECD7",
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
                        backgroundColor: "#1C1009",
                        border: "1px solid #4A3020",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          backgroundColor: "#C8813A",
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </Link>

            {/* Quick Update */}
            {book.pageCount && (
              <>
                {!isExpanded ? (
                  <button
                    onClick={() => setExpandedId(book.id)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#3D2B18",
                      border: "1px solid #4A3020",
                      borderRadius: "10px",
                      color: "#F5ECD7",
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
                      backgroundColor: "#1C1009",
                      border: "1px solid #4A3020",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    <label
                      style={{
                        color: "#A89070",
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
                        backgroundColor: "#2A1C0F",
                        border: "1px solid #4A3020",
                        borderRadius: "8px",
                        color: "#F5ECD7",
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
                              ? "#3D2B18"
                              : "#C8813A",
                          border: "none",
                          borderRadius: "8px",
                          color: "#F5ECD7",
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
                          border: "1px solid #4A3020",
                          borderRadius: "8px",
                          color: "#A89070",
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