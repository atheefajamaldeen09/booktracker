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
        backgroundColor: "#2A1C0F",
        border: "1px solid #4A3020",
        borderRadius: "14px",
        padding: "14px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#C8813A";
        e.currentTarget.style.backgroundColor = "#3D2B18";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#4A3020";
        e.currentTarget.style.backgroundColor = "#2A1C0F";
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
            color: "#F5ECD7",
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
            color: "#C8813A",
            fontSize: "12px",
            marginBottom: "6px",
          }}
        >
          {book.author}
        </p>
        {book.pageCount && (
          <p style={{ color: "#A89070", fontSize: "11px", marginBottom: "4px" }}>
            📄 {book.pageCount} pages
          </p>
        )}
        {book.rating && (
          <p style={{ color: "#E8A030", fontSize: "11px", marginBottom: "4px" }}>
            {"★".repeat(Math.floor(book.rating))}
            {book.rating % 1 >= 0.5 ? "½" : ""} {book.rating}
          </p>
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
                  backgroundColor: "#3D2B18",
                  border: "1px solid #4A3020",
                  color: "#A89070",
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
                  backgroundColor: tag.color || "#C8813A",
                  color: "#F5ECD7",
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
          color: "#A89070",
          fontSize: "18px",
          flexShrink: 0,
        }}
      >
        ›
      </div>
    </div>
  );
}