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
    tbr: "#C8813A",
    reading: "#D4A853",
    read: "#7A9E7E",
    wishlist: "#A89070",
    dnf: "#8B3A3A",
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
          backgroundColor: "#2A1C0F",
          border: "1px solid #4A3020",
          borderRadius: "14px",
        }}
      >
        <p style={{ color: "#A89070", fontSize: "14px" }}>
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
              backgroundColor: isHovered ? "#3D2B18" : "#2A1C0F",
              border: `1px solid ${isHovered ? "#C8813A" : "#4A3020"}`,
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
                    color: "#C8813A",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Book {book.position}
                </span>
                <span
                  style={{
                    backgroundColor: "#2A1C0F",
                    border: `1px solid ${shelfColors[book.shelf] || "#4A3020"}`,
                    color: shelfColors[book.shelf] || "#A89070",
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
                  color: "#F5ECD7",
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
                  color: "#A89070",
                  fontSize: "12px",
                  marginBottom: "6px",
                }}
              >
                {book.author}
              </p>

              {book.rating && book.rating > 0 && (
                <p style={{ color: "#E8A030", fontSize: "11px" }}>
                  {"★".repeat(Math.floor(book.rating))}
                  {book.rating % 1 >= 0.5 ? "½" : ""} {book.rating}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#A89070",
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