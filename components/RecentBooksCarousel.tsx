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
      <div
        style={{
          backgroundColor: "#2A1C0F",
          border: "1px solid #4A3020",
          borderRadius: "14px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#A89070", fontSize: "14px" }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <h2
        style={{
          color: "#C8813A",
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "8px",
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
                minWidth: "140px",
                maxWidth: "140px",
                backgroundColor: isHovered ? "#3D2B18" : "#2A1C0F",
                border: `1px solid ${isHovered ? "#C8813A" : "#4A3020"}`,
                borderRadius: "12px",
                padding: "12px",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={{ marginBottom: "10px" }}>
                <BookCover
                  cover={book.cover}
                  title={book.title}
                  author={book.author ?? undefined}
                  size="sm"
                />
              </div>

              <h3
                style={{
                  color: "#F5ECD7",
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
                  color: "#A89070",
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
                <p style={{ color: "#E8A030", fontSize: "11px", margin: 0 }}>
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