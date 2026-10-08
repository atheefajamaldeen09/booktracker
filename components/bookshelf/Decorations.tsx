import { useId } from "react";
import styles from "./Bookshelf.module.css";

export type DecorationType =
  | "plant"
  | "succulent"
  | "candles"
  | "cat"
  | "mug"
  | "stack"
  | "bookend"
  | "globe";

export const DECORATION_TYPES: DecorationType[] = [
  "plant",
  "candles",
  "cat",
  "stack",
  "succulent",
  "mug",
  "globe",
  "bookend",
];

// Footprint on the shelf (px at full scale)
export const DECORATION_SIZE: Record<DecorationType, { w: number; h: number }> = {
  plant: { w: 80, h: 118 },
  succulent: { w: 64, h: 78 },
  candles: { w: 60, h: 98 },
  cat: { w: 54, h: 86 },
  mug: { w: 66, h: 74 },
  stack: { w: 96, h: 56 },
  bookend: { w: 30, h: 126 },
  globe: { w: 62, h: 100 },
};

const fill = (v: string) => ({ fill: `var(${v})` });
const shade = { fill: "#000", opacity: 0.18 };
const shine = { fill: "#fff", opacity: 0.14 };

function Pot({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const inset = w * 0.12;
  return (
    <g>
      <path d={`M${x + 3} ${y + 7} H${x + w - 3} L${x + w - 3 - inset} ${y + h} H${x + 3 + inset} Z`} style={fill("--deco-pot")} />
      <path d={`M${x + w * 0.62} ${y + 7} H${x + w - 3} L${x + w - 3 - inset} ${y + h} H${x + w * 0.62 - inset * 0.4} Z`} style={shade} />
      <rect x={x} y={y} width={w} height={9} rx={2} style={fill("--deco-pot")} />
      <rect x={x} y={y} width={w} height={3} rx={1.5} style={shine} />
    </g>
  );
}

function Plant() {
  return (
    <svg viewBox="0 0 80 118" width="100%" height="100%">
      <g>
        <path d="M40 80 C38 60 30 44 14 34 C20 52 29 67 40 80Z" style={fill("--deco-leaf-dark")} />
        <path d="M40 80 C42 58 52 40 70 30 C63 50 53 66 40 80Z" style={fill("--deco-leaf")} />
        <path d="M40 80 C35 56 37 28 45 6 C52 32 47 58 40 80Z" style={fill("--deco-leaf")} />
        <path d="M40 80 C33 66 20 60 4 62 C15 72 28 77 40 80Z" style={fill("--deco-leaf")} />
        <path d="M40 80 C49 68 62 63 78 66 C67 75 53 79 40 80Z" style={fill("--deco-leaf-dark")} />
        <path d="M40 80 C40 60 42 36 45 8" stroke="#000" strokeOpacity="0.18" strokeWidth="1" fill="none" />
        <path d="M40 80 C46 62 56 46 70 30" stroke="#000" strokeOpacity="0.18" strokeWidth="1" fill="none" />
        <path d="M40 80 C34 62 26 48 14 34" stroke="#fff" strokeOpacity="0.15" strokeWidth="1" fill="none" />
      </g>
      <Pot x={17} y={78} w={46} h={40} />
    </svg>
  );
}

function Succulent() {
  const leaves = [-70, -40, -14, 14, 40, 70];
  return (
    <svg viewBox="0 0 64 78" width="100%" height="100%">
      {leaves.map((a, i) => (
        <path
          key={a}
          d="M32 52 C26 40 27 28 32 18 C37 28 38 40 32 52Z"
          transform={`rotate(${a} 32 52)`}
          style={fill(i % 2 ? "--deco-leaf" : "--deco-leaf-dark")}
        />
      ))}
      {[-30, 0, 30].map((a) => (
        <path key={a} d="M32 52 C29 45 29 38 32 31 C35 38 35 45 32 52Z" transform={`rotate(${a} 32 52)`} style={fill("--deco-leaf")} />
      ))}
      <Pot x={14} y={50} w={36} h={28} />
    </svg>
  );
}

function Candles() {
  const id = useId();
  return (
    <svg viewBox="0 0 60 98" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" style={{ stopColor: "var(--deco-flame)", stopOpacity: 0.55 }} />
          <stop offset="100%" style={{ stopColor: "var(--deco-flame)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <circle cx="18" cy="30" r="22" fill={`url(#${id}-glow)`} className={styles.glow} />
      <circle cx="40" cy="48" r="18" fill={`url(#${id}-glow)`} className={styles.glow} />
      {/* tall candle */}
      <rect x="10" y="38" width="16" height="54" rx="2" style={fill("--deco-wax")} />
      <path d="M10 40 h16 v6 c-2 0 -2 6 -4 6 s-1 -4 -3 -4 s-2 8 -4 8 s-2 -6 -5 -6z" style={{ ...fill("--deco-wax"), filter: "brightness(1.08)" }} />
      <rect x="20" y="38" width="6" height="54" style={shade} />
      <line x1="18" y1="38" x2="18" y2="32" stroke="#2a1d14" strokeWidth="1.2" />
      <path className={styles.flame} d="M18 18 C22 24 22 30 18 32 C14 30 14 24 18 18Z" style={fill("--deco-flame")} />
      <path className={styles.flame} d="M18 24 C20 27 20 30 18 31 C16 30 16 27 18 24Z" fill="#fff8e0" />
      {/* short candle */}
      <rect x="32" y="56" width="16" height="36" rx="2" style={fill("--deco-wax")} />
      <rect x="42" y="56" width="6" height="36" style={shade} />
      <line x1="40" y1="56" x2="40" y2="50" stroke="#2a1d14" strokeWidth="1.2" />
      <path className={styles.flameAlt} d="M40 37 C44 43 44 48 40 50 C36 48 36 43 40 37Z" style={fill("--deco-flame")} />
      <path className={styles.flameAlt} d="M40 42 C42 45 42 48 40 49 C38 48 38 45 40 42Z" fill="#fff8e0" />
      {/* brass tray */}
      <ellipse cx="29" cy="93" rx="28" ry="5" style={fill("--deco-metal")} />
      <ellipse cx="29" cy="92" rx="28" ry="2" style={shine} />
    </svg>
  );
}

function Cat() {
  return (
    <svg viewBox="0 0 54 86" width="100%" height="100%">
      <path d="M41 80 C54 78 56 62 48 56" stroke="var(--deco-ceramic)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M11 84 C6 62 12 42 27 40 C42 42 48 62 43 84 Z" style={fill("--deco-ceramic")} />
      <path d="M30 41 C42 44 48 62 43 84 H33 C38 66 36 50 30 41Z" style={shade} />
      <path d="M15 24 L17 7 L26 17 Z" style={fill("--deco-ceramic")} />
      <path d="M39 24 L37 7 L28 17 Z" style={fill("--deco-ceramic")} />
      <path d="M18 20 L18.5 12 L23 17 Z" fill="#000" opacity="0.15" />
      <path d="M36 20 L35.5 12 L31 17 Z" fill="#000" opacity="0.15" />
      <circle cx="27" cy="28" r="13" style={fill("--deco-ceramic")} />
      <path d="M21 27 q2 -2.5 4 0" stroke="#2a1d14" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M29 27 q2 -2.5 4 0" stroke="#2a1d14" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M25.5 31 h3 l-1.5 1.8z" fill="#c9776b" />
      <path d="M16 41 Q27 47 38 41" stroke="var(--deco-metal)" strokeWidth="2.5" fill="none" />
      <circle cx="27" cy="45" r="2.4" style={fill("--deco-metal")} />
      <ellipse cx="20" cy="22" rx="4" ry="2.5" style={shine} />
    </svg>
  );
}

function Mug() {
  return (
    <svg viewBox="0 0 66 74" width="100%" height="100%" style={{ overflow: "visible" }}>
      <path className={styles.steam} d="M22 18 c-4 -6 4 -9 0 -16" stroke="var(--text-faint)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path className={styles.steamAlt} d="M32 20 c-4 -6 4 -9 0 -16" stroke="var(--text-faint)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M48 36 c14 0 14 22 0 22" stroke="var(--deco-mug)" strokeWidth="6" fill="none" />
      <rect x="6" y="26" width="44" height="46" rx="7" style={fill("--deco-mug")} />
      <rect x="36" y="26" width="14" height="46" rx="7" style={shade} />
      <ellipse cx="28" cy="28" rx="21" ry="4" fill="#3a2214" />
      <ellipse cx="28" cy="28" rx="21" ry="4" fill="none" style={{ stroke: "var(--deco-mug)" }} strokeWidth="2" />
      <path d="M20 46 c3 -6 13 -6 16 0 c-2 6 -14 6 -16 0z" fill="#000" opacity="0.12" />
    </svg>
  );
}

function Stack({ seed }: { seed: number }) {
  const cloth = ["#7a3b2e", "#2f4a3a", "#2c3e5c", "#8a6a2f", "#5a2f4a", "#46607a"];
  const books = [
    { x: 4, w: 88, h: 16 },
    { x: 10, w: 78, h: 14 },
    { x: 2, w: 84, h: 18 },
  ];
  let y = 56;
  return (
    <svg viewBox="0 0 96 56" width="100%" height="100%">
      {books.map((b, i) => {
        y -= b.h;
        const color = cloth[(seed + i * 2) % cloth.length];
        return (
          <g key={i}>
            <rect x={b.x} y={y} width={b.w} height={b.h} rx={2} fill={color} />
            <rect x={b.x + b.w - 8} y={y + 2} width={6} height={b.h - 4} fill="#efe3cf" />
            <rect x={b.x + 6} y={y + b.h / 2 - 1} width={b.w * 0.4} height={2} fill="rgba(240,205,140,0.7)" />
            <rect x={b.x} y={y} width={b.w} height={3} style={shine} />
          </g>
        );
      })}
    </svg>
  );
}

function Bookend() {
  return (
    <svg viewBox="0 0 30 126" width="100%" height="100%">
      <rect x="2" y="118" width="28" height="8" rx="2" style={fill("--deco-metal")} />
      <path d="M2 126 V20 C2 8 18 4 22 14 C24 20 18 24 18 30 V126 Z" style={fill("--deco-metal")} />
      <path d="M12 126 V30 C12 24 18 20 18 30 V126Z" style={shade} />
      <circle cx="10" cy="60" r="5" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M4 22 C6 12 14 8 18 12" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function Globe() {
  return (
    <svg viewBox="0 0 62 100" width="100%" height="100%">
      <ellipse cx="31" cy="95" rx="18" ry="4" style={fill("--deco-metal")} />
      <rect x="29" y="74" width="4" height="20" style={fill("--deco-metal")} />
      <circle cx="31" cy="42" r="24" style={fill("--deco-globe")} />
      <path d="M18 30 c6 -4 12 -2 14 4 c2 6 -6 8 -4 14 c1 4 -6 6 -9 2 c-4 -5 -6 -14 -1 -20z" style={fill("--deco-leaf")} />
      <path d="M38 22 c6 2 10 8 9 14 c-4 2 -8 -2 -10 -6 c-1 -3 -2 -6 1 -8z" style={fill("--deco-leaf")} />
      <path d="M36 52 c4 -2 9 0 8 5 c-2 4 -8 5 -9 1z" style={fill("--deco-leaf")} />
      <circle cx="31" cy="42" r="24" fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="1" />
      <path d="M31 42 m-24 0 a24 24 0 0 0 48 0" fill="#000" opacity="0.14" />
      <ellipse cx="23" cy="32" rx="7" ry="4" style={shine} />
      <path d="M5 50 A27 27 0 0 0 54 26" stroke="var(--deco-metal)" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function Decoration({ type, seed = 0 }: { type: DecorationType; seed?: number }) {
  switch (type) {
    case "plant":
      return <Plant />;
    case "succulent":
      return <Succulent />;
    case "candles":
      return <Candles />;
    case "cat":
      return <Cat />;
    case "mug":
      return <Mug />;
    case "stack":
      return <Stack seed={seed} />;
    case "bookend":
      return <Bookend />;
    case "globe":
      return <Globe />;
  }
}
