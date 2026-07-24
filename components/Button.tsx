import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const base: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    border: "none",
    width: fullWidth ? "100%" : "auto",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "#C8813A",
      color: "#F5ECD7",
    },
    secondary: {
      backgroundColor: "#3D2B18",
      color: "#F5ECD7",
      border: "1px solid #4A3020",
    },
    danger: {
      backgroundColor: "#8B3A3A",
      color: "#F5ECD7",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}