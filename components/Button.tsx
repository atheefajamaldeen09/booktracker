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
      backgroundColor: "var(--primary)",
      color: "var(--on-primary)",
    },
    secondary: {
      backgroundColor: "var(--raised)",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
    danger: {
      backgroundColor: "var(--danger)",
      color: "var(--on-danger)",
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