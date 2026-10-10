"use client";

import { useState } from "react";

type Props = {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
};

// Drawn rather than typed as "★": a font's star doesn't fill its box evenly,
// so cutting the box in half didn't cut the star in half
const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", flex: "none", fill: color }}
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

export default function StarRating({
  rating,
  onRatingChange,
  size = "md",
  readonly = false,
}: Props) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const starSize = sizes[size];

  // Left half of a star is the half rating, right half the whole one
  const ratingAt = (starIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    return isLeftHalf ? starIndex + 0.5 : starIndex + 1;
  };

  const displayRating = hoverRating || rating;

  return (
    <div
      style={{
        display: "flex",
        gap: size === "sm" ? "2px" : size === "md" ? "4px" : "6px",
      }}
    >
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const isFilled = displayRating >= starIndex + 1;
        const isHalfFilled =
          displayRating > starIndex && displayRating < starIndex + 1;

        return (
          <div
            key={starIndex}
            onMouseMove={(e) => {
              if (!readonly) setHoverRating(ratingAt(starIndex, e));
            }}
            onMouseLeave={() => {
              if (!readonly) setHoverRating(0);
            }}
            onClick={(e) => {
              if (!readonly) onRatingChange(ratingAt(starIndex, e));
            }}
            style={{
              position: "relative",
              width: `${starSize}px`,
              height: `${starSize}px`,
              cursor: readonly ? "default" : "pointer",
            }}
          >
            {/* Background star (empty) */}
            <Star size={starSize} color="var(--border)" />

            {/* Foreground star (filled or half-filled) */}
            {(isFilled || isHalfFilled) && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  overflow: "hidden",
                  width: isHalfFilled ? "50%" : "100%",
                }}
              >
                <Star size={starSize} color={hoverRating ? "#F5C842" : "var(--star)"} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
