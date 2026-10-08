import React from "react";

type CardProps = {
  children: React.ReactNode;
  raised?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export default function Card({
  children,
  raised = false,
  onClick,
  style,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: raised ? "var(--raised)" : "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}