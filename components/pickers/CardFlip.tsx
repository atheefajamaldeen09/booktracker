/* eslint-disable react-hooks/purity */
"use client";

import { useState } from "react";
import BookCover from "@/components/BookCover";

type Book = {
  id: number;
  title: string;
  author: string | null;
  cover: string | null;
  genres: string[] | null;
  pageCount: number | null;
};

type Props = {
  books: Book[];
  onSelect: (book: Book) => void;
};

export default function CardFlip({ books, onSelect }: Props) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  if (books.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: "#A89070",
        }}
      >
        <p>No books match your filters. Adjust filters to see books.</p>
      </div>
    );
  }

  const shuffle = () => {
    if (isShuffling) return;

    setIsShuffling(true);
    setSelectedBook(null);
    setFlippedCards(new Set());

    // Shuffle animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * Math.min(books.length, 6));
      const selected = books[randomIndex];
      
      // Flip cards one by one
      let count = 0;
      const interval = setInterval(() => {
        setFlippedCards((prev) => new Set([...prev, count]));
        count++;
        
        if (count >= Math.min(books.length, 6)) {
          clearInterval(interval);
          
          // Show selected card after all are flipped
          setTimeout(() => {
            setSelectedBook(selected);
            onSelect(selected);
            setIsShuffling(false);
          }, 500);
        }
      }, 200);
    }, 1000);
  };

  const displayBooks = books.slice(0, 6); // Show max 6 cards

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
      }}
    >
      {/* Status Text */}
      <p style={{ color: "#A89070", fontSize: "14px", textAlign: "center", marginBottom: "16px" }}>
        {isShuffling
          ? "Shuffling cards..."
          : selectedBook
          ? "Your destiny!"
          : "Draw your next read!"}
      </p>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          perspective: "1000px",
        }}
      >
        {displayBooks.map((book, index) => {
          const isFlipped = flippedCards.has(index);
          const isSelected = selectedBook?.id === book.id;

          return (
            <div
              key={book.id}
              style={{
                width: "140px",
                height: "200px",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s",
                transform: isShuffling
                  ? `translateY(${Math.random() * 20 - 10}px) rotate(${
                      Math.random() * 10 - 5
                    }deg) ${isFlipped ? "rotateY(180deg)" : ""}`
                  : isSelected
                  ? "scale(1.1) rotateY(180deg)"
                  : isFlipped
                  ? "rotateY(180deg)"
                  : "rotateY(0)",
                cursor: isShuffling ? "default" : "pointer",
              }}
            >
              {/* Card Back */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  backgroundColor: "#2A1C0F",
                  border: "3px solid #C8813A",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    opacity: 0.3,
                  }}
                >
                  📖
                </div>
              </div>

              {/* Card Front */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  backgroundColor: "#1C1009",
                  border: isSelected ? "3px solid #C8813A" : "3px solid #4A3020",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: isSelected
                    ? "0 8px 32px rgba(200, 129, 58, 0.5)"
                    : "0 4px 16px rgba(0,0,0,0.4)",
                }}
              >
                <BookCover
                  cover={book.cover}
                  title={book.title}
                  author={book.author ?? undefined}
                  size="md"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Shuffle Button */}
      <button
        onClick={shuffle}
        disabled={isShuffling}
        style={{
          padding: "14px 32px",
          backgroundColor: isShuffling ? "#6B5040" : "#C8813A",
          color: "#F5ECD7",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: isShuffling ? "not-allowed" : "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          transition: "all 0.2s",
          transform: isShuffling ? "scale(0.95)" : "scale(1)",
        }}
      >
        {isShuffling ? "🔄 Shuffling..." : "🎴 Shuffle & Draw"}
      </button>

      {/* Selected Book Info */}
      {selectedBook && !isShuffling && (
        <div
          style={{
            backgroundColor: "#2A1C0F",
            border: "2px solid #C8813A",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
            maxWidth: "400px",
            boxShadow: "0 8px 32px rgba(200, 129, 58, 0.3)",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          <p
            style={{
              color: "#C8813A",
              fontSize: "20px",
              fontWeight: "bold",
              margin: "0 0 12px 0",
            }}
          >
            ✨ Your Next Read ✨
          </p>
          <p
            style={{
              color: "#F5ECD7",
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 6px 0",
            }}
          >
            {selectedBook.title}
          </p>
          <p
            style={{
              color: "#A89070",
              fontSize: "14px",
              margin: "0 0 12px 0",
            }}
          >
            by {selectedBook.author}
          </p>
          {selectedBook.pageCount && (
            <p
              style={{
                color: "#6B5040",
                fontSize: "12px",
                margin: 0,
              }}
            >
              📄 {selectedBook.pageCount} pages
            </p>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}