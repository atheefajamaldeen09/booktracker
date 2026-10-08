type Props = {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  subtitle?: string;
};

export default function StatsCard({
  icon,
  label,
  value,
  color = "var(--primary)",
  subtitle,
}: Props) {
  return (
    <div
      className="hover-lift"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "18px",
        height: "100%",
      }}
    >
      {/* Colored accent along the top edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: color,
          opacity: 0.8,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            backgroundColor: "var(--raised)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "17px",
          }}
        >
          {icon}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--text)",
          fontSize: "32px",
          fontWeight: 600,
          lineHeight: 1,
          margin: 0,
        }}
      >
        {value}
      </p>
      {subtitle && (
        <p
          style={{
            color: "var(--text-faint)",
            fontSize: "12px",
            margin: "8px 0 0 0",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
