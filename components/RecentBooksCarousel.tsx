"use client";

import { useState } from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  rating?: number | null;
};

type Props = {
  books: Book[];
  title: string;
  emptyMessage: string;
  showRating?: boolean;
};

export default function RecentBooksCarousel({
  books,
  title,
  emptyMessage,
  showRating = false,
}: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (books.length === 0) {
    return (
      <div>
        <h2 className="section-title">{title}</h2>
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">{title}</h2>

      <div
        style={{
          display: "flex",
          gap: "14px",
          overflowX: "auto",
          padding: "4px 2px 10px",
          scrollSnapType: "x proximity",
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
                flexDirection: "column",
                minWidth: "132px",
                maxWidth: "132px",
                transform: isHovered ? "translateY(-3px)" : "none",
                boxShadow: isHovered ? "var(--shadow-md)" : "none",
                backgroundColor: isHovered ? "var(--raised)" : "var(--surface)",
                border: `1px solid ${isHovered ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "14px",
                padding: "14px 12px",
                textDecoration: "none",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={{ marginBottom: "12px", display: "flex", justifyContent: "center" }}>
                <BookCover
                  cover={book.cover}
                  title={book.title}
                  author={book.author ?? undefined}
                  size="md"
                />
              </div>

              <h3
                style={{
                  color: "var(--text)",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                  lineHeight: "1.3",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {book.title}
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  marginBottom: showRating ? "6px" : "0",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {book.author}
              </p>

              {showRating && book.rating && book.rating > 0 && (
                <p style={{ color: "var(--star)", fontSize: "11px", margin: 0 }}>
                  {"★".repeat(Math.floor(book.rating))}
                  {book.rating % 1 >= 0.5 ? "½" : ""}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}