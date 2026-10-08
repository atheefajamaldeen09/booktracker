type EmptyStateProps = {
  icon: string;
  title: string;
  message: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  icon,
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "48px" }}>{icon}</span>
      <h3
        style={{
          color: "var(--text)",
          fontSize: "18px",
          fontWeight: "bold",
          margin: 0,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "14px",
          maxWidth: "280px",
          margin: 0,
          lineHeight: "1.5",
        }}
      >
        {message}
      </p>
      {action && <div style={{ marginTop: "8px" }}>{action}</div>}
    </div>
  );
}