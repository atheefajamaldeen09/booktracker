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
  color = "#C8813A",
  subtitle,
}: Props) {
  return (
    <div
      style={{
        backgroundColor: "#2A1C0F",
        border: "1px solid #4A3020",
        borderRadius: "14px",
        padding: "20px",
        textAlign: "center",
        transition: "all 0.2s",
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
      <p
        style={{
          color,
          fontSize: "28px",
          fontWeight: "bold",
          margin: "0 0 4px 0",
        }}
      >
        {value}
      </p>
      <p
        style={{
          color: "#A89070",
          fontSize: "13px",
          margin: 0,
        }}
      >
        {label}
      </p>
      {subtitle && (
        <p
          style={{
            color: "#6B5040",
            fontSize: "11px",
            marginTop: "4px",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}