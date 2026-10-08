"use client";

import { Check } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { setTheme, useTheme } from "@/lib/useTheme";

// Big preview cards for the Settings page
export function ThemeGallery() {
  const current = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
        gap: "14px",
      }}
    >
      {THEMES.map((theme) => {
        const active = theme.id === current;
        const c = theme.colors;
        return (
          <button
            key={theme.id}
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(theme.id)}
            className="hover-lift"
            style={{
              position: "relative",
              textAlign: "left",
              padding: "10px",
              borderRadius: "18px",
              border: `2px solid ${active ? "var(--primary)" : "var(--border)"}`,
              backgroundColor: "var(--surface)",
              cursor: "pointer",
              boxShadow: active ? "var(--glow)" : "none",
            }}
          >
            {/* Miniature of the app in this theme */}
            <div
              aria-hidden
              style={{
                display: "flex",
                height: "112px",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: c.bg,
                border: `1px solid ${c.surface}`,
              }}
            >
              <div style={{ width: "26%", backgroundColor: c.surface, padding: "10px 7px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "5px", backgroundColor: c.primary }} />
                {[70, 90, 60, 80].map((w, i) => (
                  <span
                    key={w}
                    style={{ height: "4px", width: `${w}%`, borderRadius: "4px", backgroundColor: i === 1 ? c.primary : c.text, opacity: i === 1 ? 1 : 0.25 }}
                  />
                ))}
              </div>
              <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "7px" }}>
                <span style={{ height: "7px", width: "55%", borderRadius: "4px", backgroundColor: c.text, opacity: 0.85 }} />
                <span style={{ height: "4px", width: "35%", borderRadius: "4px", backgroundColor: c.text, opacity: 0.3 }} />
                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                  {[c.primary, c.accent, c.surface].map((color, i) => (
                    <span key={i} style={{ flex: 1, height: "34px", borderRadius: "7px", backgroundColor: color, opacity: i === 2 ? 1 : 0.9 }} />
                  ))}
                </div>
                <span style={{ height: "10px", width: "40%", borderRadius: "6px", backgroundColor: c.primary, marginTop: "auto" }} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 4px 4px" }}>
              <span style={{ fontSize: "20px" }}>{theme.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "14px", margin: 0 }}>{theme.name}</p>
                <p style={{ color: "var(--text-faint)", fontSize: "12px", margin: "2px 0 0" }}>{theme.mood}</p>
              </div>
              {active && (
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--primary)",
                    color: "var(--on-primary)",
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Compact row of swatches for the sidebar — change the mood in one tap
export function ThemeDots() {
  const current = useTheme();
  const active = THEMES.find((t) => t.id === current)!;

  return (
    <div style={{ padding: "0 10px" }}>
      <p
        style={{
          color: "var(--text-faint)",
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          margin: "0 0 10px",
        }}
      >
        Mood · <span style={{ textTransform: "none", letterSpacing: 0 }}>{active.name}</span>
      </p>
      <div role="radiogroup" aria-label="Theme" style={{ display: "flex", gap: "8px" }}>
        {THEMES.map((theme) => {
          const selected = theme.id === current;
          return (
            <button
              key={theme.id}
              role="radio"
              aria-checked={selected}
              aria-label={theme.name}
              title={`${theme.name} — ${theme.mood}`}
              onClick={() => setTheme(theme.id)}
              style={{
                width: "26px",
                height: "26px",
                padding: 0,
                borderRadius: "50%",
                cursor: "pointer",
                background: `linear-gradient(135deg, ${theme.colors.bg} 0 50%, ${theme.colors.primary} 50% 100%)`,
                border: `2px solid ${selected ? "var(--text)" : "var(--border)"}`,
                boxShadow: selected ? "0 0 0 3px rgb(var(--primary-rgb) / 0.3)" : "none",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
