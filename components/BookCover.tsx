"use client";

import { useState } from "react";

type BookCoverProps = {
  cover: string | null;
  title: string;
  author?: string;
  size?: "sm" | "md" | "lg";
};

export default function BookCover({
  cover,
  title,
  author,
  size = "md",
}: BookCoverProps) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: { width: "48px", height: "72px", fontSize: "8px" },
    md: { width: "80px", height: "120px", fontSize: "10px" },
    lg: { width: "120px", height: "180px", fontSize: "12px" },
  };

  const { width, height, fontSize } = sizes[size];

  const getPlaceholderColor = (text: string) => {
    const colors = [
      { bg: "#3D2416", border: "#6B3A1F" },
      { bg: "#1F2D1F", border: "#3A5C3A" },
      { bg: "#1F1F3D", border: "#3A3A6B" },
      { bg: "#3D1F2D", border: "#6B3A52" },
      { bg: "#2D2416", border: "#5C4A1F" },
      { bg: "#1F2D2D", border: "#3A5C5C" },
    ];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const placeholderColor = getPlaceholderColor(title);

  if (!cover || imgError) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: placeholderColor.bg,
          border: `1px solid ${placeholderColor.border}`,
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          boxSizing: "border-box",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "20px" }}>📖</span>
        <span
          style={{
            color: "var(--text-muted)",
            fontSize,
            textAlign: "center",
            lineHeight: "1.3",
            wordBreak: "break-word",
          }}
        >
          {title}
        </span>
        {author && (
          <span
            style={{
              color: "var(--text-faint)",
              fontSize: "8px",
              textAlign: "center",
            }}
          >
            {author}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={cover}
      alt={title}
      onError={() => setImgError(true)}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "6px",
        flexShrink: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        display: "block",
      }}
    />
  );
}