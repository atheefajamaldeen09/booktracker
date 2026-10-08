"use client";

import { useState } from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  shelf: string;
  rating: number | null;
  position: number;
};

type Props = {
  books: Book[];
};

export default function SeriesBooksList({ books }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const shelfColors: Record<string, string> = {
    tbr: "var(--primary)",
    reading: "var(--accent)",
    read: "var(--success)",
    wishlist: "var(--text-muted)",
    dnf: "var(--danger)",
  };

  const shelfLabels: Record<string, string> = {
    tbr: "📚 TBR",
    reading: "📖 Reading",
    read: "✅ Read",
    wishlist: "💛 Wishlist",
    dnf: "🚫 DNF",
  };

  if (books.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          No books added to this series yet.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {books.map((book) => {
        const isHovered = hoveredId === book.id;

        return (
          <Link
            key={book.id}
            href={`/book/${book.id}`}
            style={{
              display: "flex",
              gap: "14px",
              backgroundColor: isHovered ? "var(--raised)" : "var(--surface)",
              border: `1px solid ${isHovered ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "14px",
              padding: "14px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={() => setHoveredId(book.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <BookCover
              cover={book.cover}
              title={book.title}
              author={book.author ?? undefined}
              size="sm"
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    color: "var(--primary)",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Book {book.position}
                </span>
                <span
                  style={{
                    backgroundColor: "var(--surface)",
                    border: `1px solid ${shelfColors[book.shelf] || "var(--border)"}`,
                    color: shelfColors[book.shelf] || "var(--text-muted)",
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {shelfLabels[book.shelf] || book.shelf}
                </span>
              </div>

              <h3
                style={{
                  color: "var(--text)",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  lineHeight: "1.3",
                }}
              >
                {book.title}
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  marginBottom: "6px",
                }}
              >
                {book.author}
              </p>

              {book.rating && book.rating > 0 && (
                <p style={{ color: "var(--star)", fontSize: "11px" }}>
                  {"★".repeat(Math.floor(book.rating))}
                  {book.rating % 1 >= 0.5 ? "½" : ""} {book.rating}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "var(--text-muted)",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              ›
            </div>
          </Link>
        );
      })}
    </div>
  );
}