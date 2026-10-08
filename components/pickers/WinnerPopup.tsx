"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import BookCover from "@/components/BookCover";
import Button from "@/components/Button";
import { startReading } from "@/lib/actions/books";
import { useState } from "react";
import { useCanEdit } from "@/components/Viewer";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  genres: string[] | null;
  pageCount: number | null;
  series?: {
    seriesId: number;
    seriesName: string;
    position: number;
  } | null;
};

type Props = {
  book: Book;
  onClose: () => void;
  // Spin again straight away (hidden when there's only one eligible book)
  onRespin?: () => void;
};

export default function WinnerPopup({ book, onClose, onRespin }: Props) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const canEdit = useCanEdit();

  const handleStartReading = async () => {
    setStarting(true);
    await startReading(book.id);
    router.push(`/book/${book.id}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 999,
          animation: "fadeIn 0.3s ease-out",
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--primary)",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 1000,
          boxShadow: "0 24px 70px rgba(0, 0, 0, 0.6), 0 0 40px rgb(var(--primary-rgb) / 0.25)",
          animation: "popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <X size={24} />
        </button>

        {/* Winner Title */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p
            style={{
              color: "var(--primary)",
              fontSize: "26px", fontFamily: "var(--font-heading)",
              fontWeight: "bold",
              margin: "0 0 8px 0",
              textShadow: "0 2px 8px rgb(var(--primary-rgb) / 0.3)",
            }}
          >
            ☕ Your next read ☕
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Fresh from the pot — fate has chosen!
          </p>
        </div>

        {/* Book Info */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "24px",
            alignItems: "flex-start",
          }}
        >
          <BookCover
            cover={book.cover}
            title={book.title}
            author={book.author ?? undefined}
            size="lg"
          />

          <div style={{ flex: 1 }}>
            <h2
              style={{
                color: "var(--text)",
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "8px",
                lineHeight: "1.3",
              }}
            >
              {book.title}
            </h2>
            <p
              style={{
                color: "var(--primary)",
                fontSize: "16px",
                marginBottom: "12px",
              }}
            >
              by {book.author}
            </p>

            {book.series && (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  marginBottom: "8px",
                }}
              >
                📚 {book.series.seriesName} - Book {book.series.position}
              </p>
            )}

            {book.pageCount && (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                📄 {book.pageCount} pages
              </p>
            )}

            {book.genres && book.genres.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                }}
              >
                {book.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    style={{
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                      fontSize: "11px",
                      padding: "4px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {canEdit && (
            <Button onClick={handleStartReading} disabled={starting} fullWidth>
              {starting ? "Starting..." : "📖 Start Reading This Book"}
            </Button>
          )}

          <button
            onClick={() => router.push(`/book/${book.id}`)}
            style={{
              padding: "12px",
              backgroundColor: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--text-muted)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            View Details
          </button>

          <button
            onClick={onRespin ?? onClose}
            style={{
              padding: "12px",
              backgroundColor: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--text-muted)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {onRespin ? "🔄 Re-spin" : "Close"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes popIn {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}