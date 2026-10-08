"use client";

import { useRouter } from "next/navigation";
import BookCover from "@/components/BookCover";

type Tag = {
  id: number;
  name: string | null;
  color: string | null;
};

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  genres: string[] | null;
  pageCount: number | null;
  rating: number | null;
  shelf: string;
  bookTags?: Tag[];
};

export default function BookCard({ book }: { book: Book }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/book/${book.id}`)}
      style={{
        display: "flex",
        gap: "14px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "14px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.backgroundColor = "var(--raised)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.backgroundColor = "var(--surface)";
      }}
    >
      <BookCover
        cover={book.cover}
        title={book.title}
        author={book.author ?? undefined}
        size="sm"
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            color: "var(--text)",
            fontSize: "14px",
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
            color: "var(--primary)",
            fontSize: "12px",
            marginBottom: "6px",
          }}
        >
          {book.author}
        </p>
        {book.pageCount && (
          <p style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "4px" }}>
            📄 {book.pageCount} pages
          </p>
        )}
        {book.rating && book.rating > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
            <span style={{ color: "var(--star)", fontSize: "11px" }}>
              {"★".repeat(Math.floor(book.rating))}
              {book.rating % 1 >= 0.5 ? "½" : ""}
              {"☆".repeat(5 - Math.ceil(book.rating))}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>
              {book.rating}
            </span>
          </div>
        )}
        {book.genres && book.genres.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "4px",
              flexWrap: "wrap",
              marginBottom: "4px",
            }}
          >
            {book.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                style={{
                  backgroundColor: "var(--raised)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "999px",
                }}
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        {/* Tags */}
        {book.bookTags && book.bookTags.length > 0 && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {book.bookTags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                style={{
                  backgroundColor: tag.color || "var(--primary)",
                  color: "var(--text)",
                  fontSize: "10px",
                  fontWeight: "600",
                  padding: "2px 6px",
                  borderRadius: "999px",
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
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
    </div>
  );
}