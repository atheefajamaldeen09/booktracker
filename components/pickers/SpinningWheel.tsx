"use client";

import { useState } from "react";

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

export default function SpinningWheel({ books, onSelect }: Props) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

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

  const segmentAngle = 360 / books.length;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const spins = 5 + Math.random() * 5;
    const randomOffset = Math.random() * 360;
    const totalRotation = spins * 360 + randomOffset;

    setRotation((prev) => prev + totalRotation);

    setTimeout(() => {
      setIsSpinning(false);

      const normalizedRotation = (rotation + totalRotation) % 360;
      const selectedIndex =
        Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) %
        books.length;

      onSelect(books[selectedIndex]);
    }, 4000);
  };

  const getSegmentColor = (index: number) => {
    const colors = ["#3D2B18", "#2A1C0F", "#4A3020", "#1C1009"];
    return colors[index % colors.length];
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        userSelect: "none",
      }}
    >
      {/* Pointer */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderTop: "30px solid #C8813A",
          marginBottom: "-10px",
          zIndex: 10,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        }}
      />

      {/* Wheel Container */}
      <div
        style={{
          position: "relative",
          width: "min(90vw, 400px)",
          height: "min(90vw, 400px)",
        }}
      >
        {/* Wheel */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "8px solid #4A3020",
            position: "relative",
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)"
              : "transform 0.3s ease-out",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            overflow: "visible",
          }}
        >
          {/* Draw segments */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            {books.map((book, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

              const x1 = 100 + 100 * Math.cos(startAngle);
              const y1 = 100 + 100 * Math.sin(startAngle);
              const x2 = 100 + 100 * Math.cos(endAngle);
              const y2 = 100 + 100 * Math.sin(endAngle);

              const largeArc = segmentAngle > 180 ? 1 : 0;

              const textAngle = index * segmentAngle + segmentAngle / 2;
              const textRadius = 60;

              return (
                <g key={book.id}>
                  {/* Segment */}
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={getSegmentColor(index)}
                    stroke="#1C1009"
                    strokeWidth="0.5"
                  />

                  {/* Text centered in segment */}
                  <text
                    x="100"
                    y="100"
                    fill="#F5ECD7"
                    fontSize="5"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle} 100 100) translate(0, -${textRadius})`}
                  >
                    {book.title.length > 18
                      ? book.title.substring(0, 18) + "..."
                      : book.title}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Center button - rotates with wheel, always says SPIN */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "25%",
              height: "25%",
              minWidth: "80px",
              minHeight: "80px",
              borderRadius: "50%",
              backgroundColor: isSpinning ? "#6B5040" : "#C8813A",
              border: "4px solid #F5ECD7",
              color: "#F5ECD7",
              fontSize: "clamp(12px, 2.5vw, 18px)",
              fontWeight: "bold",
              cursor: isSpinning ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              transition: "background-color 0.2s",
            }}
          >
            SPIN
          </button>
        </div>
      </div>

      <p
        style={{
          color: "#A89070",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        {isSpinning ? "Spinning..." : "Click SPIN to choose your next book!"}
      </p>
    </div>
  );
}