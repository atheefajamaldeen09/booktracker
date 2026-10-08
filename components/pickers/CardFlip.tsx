"use client";

import { useState, useEffect, useRef } from "react";
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
  // Changing this number triggers a fresh spin (used by the "Re-spin" button)
  spinSignal?: number;
};

function drawDeck(books: Book[]) {
  const copy = [...books];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 6);
}

export default function CardFlip({ books, onSelect, spinSignal = 0 }: Props) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  // Up to 6 cards drawn at random from the whole eligible TBR
  const [deck, setDeck] = useState<Book[]>(() => drawDeck(books));
  // Random wobble for each card while shuffling, set when a shuffle starts
  const [wobble, setWobble] = useState<{ y: number; r: number }[]>([]);


  const shuffle = () => {
    if (isShuffling) return;

    const newDeck = drawDeck(books);
    setDeck(newDeck);
    setWobble(newDeck.map(() => ({ y: Math.random() * 20 - 10, r: Math.random() * 10 - 5 })));
    setIsShuffling(true);
    setSelectedBook(null);
    setFlippedCards(new Set());

    // Shuffle animation
    setTimeout(() => {
      const selected = newDeck[Math.floor(Math.random() * newDeck.length)];

      // Flip cards one by one
      let count = 0;
      const interval = setInterval(() => {
        setFlippedCards((prev) => new Set([...prev, count]));
        count++;
        
        if (count >= newDeck.length) {
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

  const displayBooks = deck;

  // Re-spin requested from the winner popup
  const spinRef = useRef(shuffle);
  useEffect(() => {
    spinRef.current = shuffle;
  });
  useEffect(() => {
    if (spinSignal > 0) spinRef.current();
  }, [spinSignal]);

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
      <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", marginBottom: "16px" }}>
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
          gridTemplateColumns: "repeat(3, minmax(0, 140px))",
          gap: "clamp(10px, 3vw, 20px)",
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
                width: "100%",
                aspectRatio: "7 / 10",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s",
                transform: isShuffling
                  ? `translateY(${wobble[index]?.y ?? 0}px) rotate(${
                      wobble[index]?.r ?? 0
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
                  backgroundColor: "var(--surface)",
                  border: "3px solid var(--primary)",
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
                  backgroundColor: "var(--bg)",
                  border: isSelected ? "3px solid var(--primary)" : "3px solid var(--border)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: isSelected
                    ? "0 8px 32px rgb(var(--primary-rgb) / 0.5)"
                    : "0 4px 16px rgba(0,0,0,0.4)",
                }}
              >
                {book.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.cover}
                    alt={book.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BookCover
                      cover={book.cover}
                      title={book.title}
                      author={book.author ?? undefined}
                      size="md"
                    />
                  </div>
                )}
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
          backgroundColor: isShuffling ? "var(--text-faint)" : "var(--primary)",
          color: isShuffling ? "var(--text-muted)" : "var(--on-primary)",
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
            backgroundColor: "var(--surface)",
            border: "2px solid var(--primary)",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
            maxWidth: "400px",
            boxShadow: "0 8px 32px rgb(var(--primary-rgb) / 0.3)",
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          <p
            style={{
              color: "var(--primary)",
              fontSize: "20px",
              fontWeight: "bold",
              margin: "0 0 12px 0",
            }}
          >
            ✨ Your Next Read ✨
          </p>
          <p
            style={{
              color: "var(--text)",
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 6px 0",
            }}
          >
            {selectedBook.title}
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              margin: "0 0 12px 0",
            }}
          >
            by {selectedBook.author}
          </p>
          {selectedBook.pageCount && (
            <p
              style={{
                color: "var(--text-faint)",
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