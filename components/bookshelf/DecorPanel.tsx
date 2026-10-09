"use client";

import { Decoration, DECORATION_TYPES, type DecorationType } from "./Decorations";
import type { ShelfDecorSettings } from "@/lib/actions/bookshelf";

const NAMES: Record<DecorationType, string> = {
  plant: "Potted plant",
  roses: "Roses",
  stack: "Book stack",
  candles: "Candles",
  gifts: "Gift boxes",
  radio: "Radio",
  clock: "Alarm clock",
  cat: "Sleepy cat",
  mug: "Coffee mug",
  frame: "Picture frame",
  lantern: "Lantern",
  globe: "Globe",
};

// Pick which ornaments may appear on the shelf, plus the lights and ivy
export default function DecorPanel({
  settings,
  onChange,
  onClose,
}: {
  settings: ShelfDecorSettings;
  onChange: (next: ShelfDecorSettings) => void;
  onClose: () => void;
}) {
  const toggle = (type: DecorationType) =>
    onChange({
      ...settings,
      hidden: settings.hidden.includes(type) ? settings.hidden.filter((h) => h !== type) : [...settings.hidden, type],
    });

  const chip = (on: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "10px 6px 8px",
    borderRadius: "14px",
    border: `1.5px solid ${on ? "var(--primary)" : "var(--border)"}`,
    backgroundColor: on ? "rgb(var(--primary-rgb) / 0.12)" : "var(--bg)",
    color: on ? "var(--text)" : "var(--text-faint)",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    opacity: on ? 1 : 0.6,
  });

  return (
    <div
      role="dialog"
      aria-label="Shelf decorations"
      style={{
        marginBottom: "22px",
        padding: "18px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "14px" }}>
        <div>
          <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "15px", margin: 0 }}>Decorations</p>
          <p style={{ color: "var(--text-faint)", fontSize: "12px", margin: "2px 0 0" }}>
            Tap to show or hide. Changes save automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "7px 14px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "var(--primary)",
            color: "var(--on-primary)",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Done
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: "10px" }}>
        {DECORATION_TYPES.map((type) => {
          const on = !settings.hidden.includes(type);
          return (
            <button key={type} type="button" aria-pressed={on} onClick={() => toggle(type)} style={chip(on)}>
              <span style={{ width: "48px", height: "52px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                <span style={{ display: "block", width: "100%", height: "100%" }}>
                  <Decoration type={type} seed={1} />
                </span>
              </span>
              {NAMES[type]}
            </button>
          );
        })}
        <button type="button" aria-pressed={settings.lights} onClick={() => onChange({ ...settings, lights: !settings.lights })} style={chip(settings.lights)}>
          <span style={{ fontSize: "30px", lineHeight: "52px" }}>✨</span>
          Fairy lights
        </button>
        <button type="button" aria-pressed={settings.ivy} onClick={() => onChange({ ...settings, ivy: !settings.ivy })} style={chip(settings.ivy)}>
          <span style={{ fontSize: "30px", lineHeight: "52px" }}>🌿</span>
          Hanging ivy
        </button>
      </div>
    </div>
  );
}
