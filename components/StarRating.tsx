"use client";

import { useState } from "react";

type StarRatingProps = {
  rating: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
};

export default function StarRating({
  rating,
  onRate,
  readOnly = false,
  size = 24,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (e: React.MouseEvent, starIndex: number) => {
    if (readOnly || !onRate) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;
    onRate(isHalf ? starIndex - 0.5 : starIndex);
  };

  const handleMouseMove = (e: React.MouseEvent, starIndex: number) => {
    if (readOnly) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;
    setHovered(isHalf ? starIndex - 0.5 : starIndex);
  };

  const displayRating = hovered !== null ? hovered : rating;

  return (
    <div
      style={{ display: "flex", gap: "2px" }}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = displayRating >= star;
        const isHalf = !isFull && displayRating >= star - 0.5;

        return (
          <div
            key={star}
            onClick={(e) => handleClick(e, star)}
            onMouseMove={(e) => handleMouseMove(e, star)}
            style={{
              position: "relative",
              width: `${size}px`,
              height: `${size}px`,
              cursor: readOnly ? "default" : "pointer",
              fontSize: `${size}px`,
              lineHeight: 1,
            }}
          >
            {/* Empty star base */}
            <span style={{ color: "#4A3020", position: "absolute" }}>★</span>

            {/* Filled or half filled star on top */}
            {(isFull || isHalf) && (
              <span
                style={{
                  color: "#E8A030",
                  position: "absolute",
                  overflow: "hidden",
                  width: isFull ? "100%" : "50%",
                }}
              >
                ★
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}