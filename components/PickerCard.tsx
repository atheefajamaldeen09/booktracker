"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  href: string;
  icon: string;
  title: string;
  description: string;
};

export default function PickerCard({ href, icon, title, description }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: isHovered ? "#3D2B18" : "#2A1C0F",
        border: `2px solid ${isHovered ? "#C8813A" : "#4A3020"}`,
        borderRadius: "14px",
        textDecoration: "none",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>{icon}</div>
      <h3
        style={{
          color: "#F5ECD7",
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "6px",
          textAlign: "center",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "#A89070",
          fontSize: "12px",
          textAlign: "center",
          margin: 0,
        }}
      >
        {description}
      </p>
    </Link>
  );
}