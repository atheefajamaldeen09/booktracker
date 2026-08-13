"use client";

import { useState } from "react";

type Props = {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
};

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

  const handleClick = (starIndex: number, isLeftHalf: boolean) => {
    if (readonly) return;
    const newRating = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    onRatingChange(newRating);
  };

  const handleMouseMove = (
    starIndex: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (readonly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    setHoverRating(isLeftHalf ? starIndex + 0.5 : starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
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
            onMouseMove={(e) => handleMouseMove(starIndex, e)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const isLeftHalf = x < rect.width / 2;
              handleClick(starIndex, isLeftHalf);
            }}
            style={{
              position: "relative",
              width: `${starSize}px`,
              height: `${starSize}px`,
              cursor: readonly ? "default" : "pointer",
              fontSize: `${starSize}px`,
              lineHeight: 1,
            }}
          >
            {/* Background star (empty) */}
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "#4A3020",
              }}
            >
              ★
            </span>

            {/* Foreground star (filled or half-filled) */}
            {(isFilled || isHalfFilled) && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  color: hoverRating ? "#F5C842" : "#E8A030",
                  overflow: "hidden",
                  width: isHalfFilled ? "50%" : "100%",
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