"use client";

import { useState, useEffect } from "react";
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
import { ThemeDots } from "./ThemePicker";

const mainNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: Library },
  { href: "/bookshelf", label: "My Bookshelf", icon: BookOpen },
  { href: "/series", label: "Series", icon: BookMarked },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/random-picker", label: "Pick Next Read", icon: Shuffle },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/stats", label: "Stats", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

const shelfLinks = [
  { href: "/library?shelf=tbr", label: "To Be Read", dot: "var(--primary)" },
  { href: "/library?shelf=reading", label: "Currently Reading", dot: "var(--accent)" },
  { href: "/library?shelf=read", label: "Read", dot: "var(--success)" },
  { href: "/dnf", label: "Did Not Finish", dot: "var(--danger)" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function Logo() {
  return (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "38px",
          height: "38px",
          borderRadius: "12px",
          background: "linear-gradient(145deg, var(--primary), var(--primary-deep))",
          boxShadow: "var(--shadow-md)",
          fontSize: "20px",
        }}
      >
        <span className="hero-emoji" />
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--text)",
            fontSize: "19px",
            fontWeight: 600,
          }}
        >
          BookTracker
        </span>
        <span style={{ color: "var(--text-faint)", fontSize: "11px", marginTop: "2px" }}>
          brewed for readers
        </span>
      </span>
    </Link>
  );
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <Link
        data-owner-only
        href="/add"
        onClick={onNavigate}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "11px 14px",
          borderRadius: "12px",
          margin: "0 0 20px 0",
          background: "linear-gradient(135deg, var(--primary-hover), var(--primary))",
          color: "var(--on-primary)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 700,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <PlusCircle size={18} />
        Add a Book
      </Link>

      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="nav-link"
            data-active={active}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "12px",
              marginBottom: "2px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <p
        style={{
          color: "var(--text-faint)",
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          padding: "0 12px",
          margin: "24px 0 8px",
        }}
      >
        Shelves
      </p>
      {shelfLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="nav-link"
          data-active={false}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "10px",
            marginBottom: "2px",
            textDecoration: "none",
            fontSize: "13px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: item.dot,
              flexShrink: 0,
            }}
          />
          {item.label}
        </Link>
      ))}
    </>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // The private-library and unlock screens stand on their own
  if (pathname === "/private" || pathname === "/unlock") return null;

  return (
    <>
      {/* ── SIDE NAV — desktop only ── */}
      <nav
        id="side-nav"
        style={{
          background: "linear-gradient(180deg, var(--surface) 0%, var(--bg-deep) 100%)",
          borderRight: "1px solid var(--border-soft)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "230px",
          display: "none",
          flexDirection: "column",
          padding: "24px 14px",
          zIndex: 50,
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "0 6px", marginBottom: "28px" }}>
          <Logo />
        </div>
        <NavLinks pathname={pathname} />
        <div style={{ marginTop: "auto", paddingTop: "28px" }}>
          <ThemeDots />
        </div>
      </nav>

      {/* ── MOBILE TOP BAR ── */}
      <div
        id="mobile-top-bar"
        style={{
          backgroundColor: "var(--nav-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-soft)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          zIndex: 51,
        }}
      >
        <Logo />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          style={{
            background: "var(--raised)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text)",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              zIndex: 49,
              animation: "navFade 0.2s ease-out",
            }}
          />
          <nav
            style={{
              position: "fixed",
              top: "59px",
              right: 0,
              bottom: 0,
              width: "min(290px, 85vw)",
              background: "linear-gradient(180deg, var(--surface) 0%, var(--bg-deep) 100%)",
              borderLeft: "1px solid var(--border-soft)",
              zIndex: 50,
              overflowY: "auto",
              padding: "20px 14px",
              animation: "slideIn 0.25s ease-out",
            }}
          >
            <NavLinks pathname={pathname} onNavigate={() => setMobileMenuOpen(false)} />
            <div style={{ marginTop: "28px" }}>
              <ThemeDots />
            </div>
          </nav>
        </>
      )}

      <style>{`
        .nav-link {
          color: var(--text-muted);
          transition: background-color 0.15s, color 0.15s;
        }
        .nav-link:hover {
          background-color: var(--raised);
          color: var(--text);
        }
        .nav-link[data-active="true"] {
          background-color: var(--raised);
          color: var(--primary);
          box-shadow: inset 3px 0 0 var(--primary);
        }
        @media (min-width: 768px) {
          #side-nav { display: flex !important; }
          #mobile-top-bar { display: none !important; }
        }
        @media (max-width: 767px) {
          #side-nav { display: none !important; }
          #mobile-top-bar { display: flex !important; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes navFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
