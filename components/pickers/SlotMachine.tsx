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
};

const ReelColumn = ({ 
  index, 
  books, 
  isSpinning 
}: { 
  index: number; 
  books: Book[]; 
  isSpinning: boolean;
}) => {
  const displayBooks = [
    books[(index - 1 + books.length) % books.length],
    books[index],
    books[(index + 1) % books.length],
  ];

  return (
    <div
      style={{
        width: "120px",
        height: "400px",
        backgroundColor: "#1C1009",
        border: "3px solid #4A3020",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "inset 0 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          transition: isSpinning ? "none" : "all 0.3s ease-out",
        }}
      >
        {displayBooks.map((book, i) => (
          <div
            key={`${book.id}-${i}`}
            style={{
              width: "100px",
              height: "140px",
              opacity: i === 1 ? 1 : 0.4,
              transform: i === 1 ? "scale(1)" : "scale(0.85)",
              transition: "all 0.3s",
            }}
          >
            <BookCover
              cover={book.cover}
              title={book.title}
              author={book.author ?? undefined}
              size="md"
            />
          </div>
        ))}
      </div>

      {/* Center highlight */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          right: "0",
          height: "160px",
          transform: "translateY(-50%)",
          border: "2px solid #C8813A",
          borderRadius: "8px",
          pointerEvents: "none",
          boxShadow: "0 0 20px rgba(200, 129, 58, 0.3)",
        }}
      />
    </div>
  );
};

export default function SlotMachine({ books, onSelect }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reel1Index, setReel1Index] = useState(0);
  const [reel2Index, setReel2Index] = useState(0);
  const [reel3Index, setReel3Index] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  const intervalRef1 = useRef<NodeJS.Timeout | null>(null);
  const intervalRef2 = useRef<NodeJS.Timeout | null>(null);
  const intervalRef3 = useRef<NodeJS.Timeout | null>(null);

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

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedBook(null);

    const targetIndex = Math.floor(Math.random() * books.length);

    // Reel 1
    intervalRef1.current = setInterval(() => {
      setReel1Index((prev) => (prev + 1) % books.length);
    }, 100);

    setTimeout(() => {
      if (intervalRef1.current) clearInterval(intervalRef1.current);
      setReel1Index(targetIndex);
    }, 1500);

    // Reel 2
    intervalRef2.current = setInterval(() => {
      setReel2Index((prev) => (prev + 1) % books.length);
    }, 100);

    setTimeout(() => {
      if (intervalRef2.current) clearInterval(intervalRef2.current);
      setReel2Index(targetIndex);
    }, 2500);

    // Reel 3
    intervalRef3.current = setInterval(() => {
      setReel3Index((prev) => (prev + 1) % books.length);
    }, 100);

    setTimeout(() => {
      if (intervalRef3.current) clearInterval(intervalRef3.current);
      setReel3Index(targetIndex);
      setIsSpinning(false);
      setSelectedBook(books[targetIndex]);
      onSelect(books[targetIndex]);
    }, 3500);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    return () => {
      if (intervalRef1.current) clearInterval(intervalRef1.current);
      if (intervalRef2.current) clearInterval(intervalRef2.current);
      if (intervalRef3.current) clearInterval(intervalRef3.current);
    };
  }, []);

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
        {isSpinning ? "Spinning..." : "Pull the lever!"}
      </p>

      {/* Slot Machine */}
      <div
        style={{
          backgroundColor: "#2A1C0F",
          border: "4px solid #4A3020",
          borderRadius: "20px",
          padding: "32px 24px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <ReelColumn index={reel1Index} books={books} isSpinning={isSpinning} />
          <ReelColumn index={reel2Index} books={books} isSpinning={isSpinning} />
          <ReelColumn index={reel3Index} books={books} isSpinning={isSpinning} />
        </div>

        {/* Lever */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={spin}
            disabled={isSpinning}
            style={{
              width: "80px",
              height: "120px",
              background: isSpinning
                ? "linear-gradient(180deg, #6B5040 0%, #4A3020 100%)"
                : "linear-gradient(180deg, #C8813A 0%, #8B5A2B 100%)",
              border: "3px solid #F5ECD7",
              borderRadius: "12px",
              position: "relative",
              cursor: isSpinning ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              transform: isSpinning ? "translateY(20px)" : "translateY(0)",
              boxShadow: isSpinning
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 8px 16px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-40px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                backgroundColor: "#8B5A2B",
                borderRadius: "50%",
                border: "3px solid #F5ECD7",
              }}
            />
            <span
              style={{
                color: "#F5ECD7",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              PULL
            </span>
          </button>
        </div>
      </div>

      {/* Winner Display */}
      {selectedBook && !isSpinning && (
        <div
          style={{
            backgroundColor: "#2A1C0F",
            border: "2px solid #C8813A",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
            maxWidth: "300px",
            boxShadow: "0 8px 32px rgba(200, 129, 58, 0.3)",
            animation: "winnerPop 0.5s ease-out",
          }}
        >
          <p
            style={{
              color: "#C8813A",
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 8px 0",
            }}
          >
            🎉 WINNER! 🎉
          </p>
          <p
            style={{
              color: "#F5ECD7",
              fontSize: "16px",
              fontWeight: "600",
              margin: "0 0 4px 0",
            }}
          >
            {selectedBook.title}
          </p>
          <p
            style={{
              color: "#A89070",
              fontSize: "14px",
              margin: 0,
            }}
          >
            by {selectedBook.author}
          </p>
        </div>
      )}

      <style>{`
        @keyframes winnerPop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}