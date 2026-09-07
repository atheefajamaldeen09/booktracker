"use client";

import { useState } from "react";
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
  BookMarked,
  Shuffle,
  Menu,
  X,
} from "lucide-react";

// Side nav on desktop — all pages
const sideNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bookshelf", label: "My Bookshelf", icon: BookOpen },
  { href: "/library", label: "Library", icon: Library },
  { href: "/series", label: "Series", icon: BookMarked },
  { href: "/add", label: "Add Book", icon: PlusCircle },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/stats", label: "Stats", icon: BarChart2 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          { href: "/library", label: "📚 TBR" },
          { href: "/wishlist", label: "💛 Wishlist" },
          { href: "/dnf", label: "🚫 Did Not Finish" },
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

      {/* ── MOBILE TOP BAR with Hamburger ── */}
      <div
        id="mobile-top-bar"
        style={{
          backgroundColor: "#2A1C0F",
          borderBottom: "1px solid #4A3020",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          zIndex: 51,
        }}
      >
        <h1
          style={{
            color: "#C8813A",
            fontSize: "18px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          ☕ BookTracker
        </h1>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#C8813A",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "fixed",
              top: "56px",
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 49,
            }}
          />

          {/* Menu */}
          <nav
            style={{
              position: "fixed",
              top: "56px",
              right: 0,
              bottom: 0,
              width: "280px",
              backgroundColor: "#2A1C0F",
              borderLeft: "1px solid #4A3020",
              zIndex: 50,
              overflowY: "auto",
              padding: "16px",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {sideNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "12px",
                    marginBottom: "4px",
                    backgroundColor: isActive ? "#3D2B18" : "transparent",
                    color: isActive ? "#C8813A" : "#A89070",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div style={{ borderTop: "1px solid #4A3020", margin: "12px 0" }} />

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
              Quick Access
            </p>
            {[
              { href: "/library", label: "📚 TBR" },
              { href: "/wishlist", label: "💛 Wishlist" },
              { href: "/dnf", label: "🚫 Did Not Finish" },
            ].map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  marginBottom: "4px",
                  color: "#A89070",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}

      {/* ── Responsive styles ── */}
      <style>{`
        @media (min-width: 768px) {
          #side-nav {
            display: flex !important;
          }
          #mobile-top-bar {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          #side-nav {
            display: none !important;
          }
          #mobile-top-bar {
            display: flex !important;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}