import Link from "next/link";

type Props = {
  href: string;
  icon: string;
  title: string;
  description: string;
};

export default function PickerCard({ href, icon, title, description }: Props) {
  return (
    <Link
      href={href}
      className="hover-lift"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "18px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        textDecoration: "none",
      }}
    >
      <span
        style={{
          width: "52px",
          height: "52px",
          flexShrink: 0,
          borderRadius: "14px",
          background: "linear-gradient(145deg, var(--raised), var(--bg))",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
        }}
      >
        {icon}
      </span>
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            color: "var(--text)",
            fontSize: "15px",
            fontWeight: 600,
            marginBottom: "2px",
          }}
        >
          {title}
        </span>
        <span style={{ display: "block", color: "var(--text-muted)", fontSize: "12px" }}>
          {description}
        </span>
      </span>
    </Link>
  );
}
