"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Library,
  PlusCircle,
  BarChart2,
  Settings,
  Target,
  Heart,
} from "lucide-react";

// Bottom mobile nav — only 5 most important pages
const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bookshelf", label: "Shelf", icon: BookOpen },
  { href: "/library", label: "Library", icon: Library },
  { href: "/add", label: "Add", icon: PlusCircle },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

// Side nav on desktop — all pages
const sideNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bookshelf", label: "My Bookshelf", icon: BookOpen },
  { href: "/library", label: "Library", icon: Library },
  { href: "/add", label: "Add Book", icon: PlusCircle },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/stats", label: "Stats", icon: BarChart2 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* ── SIDE NAV — desktop only ── */}
      <nav
        style={{
          backgroundColor: "#2A1C0F",
          borderRight: "1px solid #4A3020",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "210px",
          display: "none",
          flexDirection: "column",
          padding: "24px 12px",
          zIndex: 50,
          overflowY: "auto",
        }}
        id="side-nav"
      >
        {/* App title */}
        <div style={{ marginBottom: "32px", padding: "0 12px" }}>
          <h1
            style={{
              color: "#C8813A",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            ☕ BookTracker
          </h1>
          <p style={{ color: "#A89070", fontSize: "12px", marginTop: "4px" }}>
            Your reading companion
          </p>
        </div>

        {/* Main Nav Links */}
        {sideNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "12px",
                marginBottom: "4px",
                backgroundColor: isActive ? "#3D2B18" : "transparent",
                color: isActive ? "#C8813A" : "#A89070",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid #4A3020",
            margin: "12px 0",
          }}
        />

        {/* Extra shelf links */}
        <p
          style={{
            color: "#6B5040",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "0 12px",
            marginBottom: "8px",
          }}
        >
          Shelves
        </p>
        {[
          { href: "/library", label: "📚 TBR", active: pathname === "/library" },
          { href: "/wishlist", label: "💛 Wishlist", active: pathname === "/wishlist" },
          { href: "/dnf", label: "🚫 Did Not Finish", active: pathname === "/dnf" },
        ].map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 12px",
              borderRadius: "12px",
              marginBottom: "4px",
              backgroundColor: "transparent",
              color: "#A89070",
              textDecoration: "none",
              fontSize: "13px",
              transition: "all 0.2s",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ── BOTTOM NAV — mobile only ── */}
      <nav
        id="bottom-nav"
        style={{
          backgroundColor: "#2A1C0F",
          borderTop: "1px solid #4A3020",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "10px 8px",
          zIndex: 50,
        }}
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              <Icon
                size={22}
                style={{ color: isActive ? "#C8813A" : "#A89070" }}
              />
              <span
                style={{
                  color: isActive ? "#C8813A" : "#A89070",
                  fontSize: "10px",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (min-width: 768px) {
          #side-nav {
            display: flex !important;
          }
          #bottom-nav {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          #side-nav {
            display: none !important;
          }
          #bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}