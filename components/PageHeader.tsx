import React from "react";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
};

// Consistent page heading used at the top of every page
export default function PageHeader({ eyebrow, title, subtitle, action }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "32px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        {eyebrow && (
          <p
            style={{
              color: "var(--primary)",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              margin: "0 0 8px 0",
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          style={{
            color: "var(--text)",
            fontSize: "clamp(26px, 4vw, 34px)",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              margin: "8px 0 0 0",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
