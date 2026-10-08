type ProgressBarProps = {
  current: number;
  total: number;
  showLabel?: boolean;
};

export default function ProgressBar({
  current,
  total,
  showLabel = true,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Page {current} of {total}
          </span>
          <span style={{ color: "var(--primary)", fontSize: "12px", fontWeight: "600" }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "var(--raised)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "var(--primary)",
            borderRadius: "999px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}