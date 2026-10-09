import { useId, type CSSProperties, type ReactNode } from "react";
import styles from "./Bookshelf.module.css";

export type DecorationType =
  | "plant"
  | "roses"
  | "stack"
  | "candles"
  | "gifts"
  | "radio"
  | "clock"
  | "cat"
  | "mug"
  | "frame"
  | "lantern"
  | "globe";

export const DECORATION_TYPES: DecorationType[] = [
  "plant",
  "stack",
  "candles",
  "roses",
  "radio",
  "cat",
  "gifts",
  "mug",
  "clock",
  "frame",
  "lantern",
  "globe",
];

// Ornaments slim enough to stand beside ten books on a phone
export const SLIM_DECORATIONS: DecorationType[] = ["cat", "roses", "clock", "lantern"];

// Size in px next to a 340px-tall book; the shelf scales these with the books
export const DECORATION_SIZE: Record<DecorationType, { w: number; h: number }> = {
  plant: { w: 150, h: 230 },
  roses: { w: 100, h: 240 },
  stack: { w: 140, h: 170 },
  candles: { w: 130, h: 160 },
  gifts: { w: 120, h: 160 },
  radio: { w: 150, h: 130 },
  clock: { w: 100, h: 140 },
  cat: { w: 100, h: 160 },
  mug: { w: 150, h: 150 },
  frame: { w: 130, h: 170 },
  lantern: { w: 100, h: 190 },
  globe: { w: 120, h: 200 },
};

/*
  Drawn like a cosy storybook illustration: soft theme colors, a thin warm
  outline round every shape, and flat cel shading (a highlight stripe on the
  lit left side, a shadow on the right) so things still read as solid.
*/

const LINE = "#2a1c14";
const SOIL = "#3a2618";
// Lying books on the shelf pick up the theme palette
const BOOK_COLORS = ["--deco-pot", "--deco-globe", "--deco-mug", "--deco-leaf-dark", "--deco-metal", "--wood-light"];

// Rounded so server and browser print identical paths
const n = (x: number) => Math.round(x * 100) / 100;
const col = (c: string) => (c.startsWith("--") ? `var(${c})` : c);
const paint = (c: string): CSSProperties => ({ fill: col(c) });

// The outline stays a crisp hairline whatever size the ornament is drawn at
const ink = {
  stroke: LINE,
  strokeOpacity: 0.8,
  strokeWidth: 1.4,
  strokeLinejoin: "round",
  strokeLinecap: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

// Path builders
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;
const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y}Z`;
// Upright cylinder body; draw its top ellipse separately
const cylinder = (x: number, y: number, w: number, h: number, ry: number) =>
  `M${x} ${y} V${y + h} A${w / 2} ${ry} 0 0 0 ${x + w} ${y + h} V${y} Z`;
// Tapered body, wide at the top (pots)
const taper = (cx: number, top: number, bottom: number, rTop: number, rBot: number, ry: number) =>
  `M${cx - rTop} ${top} L${cx - rBot} ${bottom} A${rBot} ${ry} 0 0 0 ${cx + rBot} ${bottom} L${cx + rTop} ${top} Z`;

type Ids = { id: string; url: (name: string) => string };
const useIds = (): Ids => {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return { id, url: (name) => `url(#${id}-${name})` };
};

function Defs({ id }: { id: string }) {
  const stops = (list: [number, string, number][]) =>
    list.map(([o, c, a], i) => <stop key={i} offset={o} stopColor={c} stopOpacity={a} />);
  return (
    <defs>
      {/* Hard-edged cel shading: highlight stripe left, shadow right */}
      <linearGradient id={`${id}-cel`} x1="0" x2="1">
        {stops([
          [0, "#fff", 0],
          [0.14, "#fff", 0],
          [0.14, "#fff", 0.3],
          [0.24, "#fff", 0.3],
          [0.24, "#fff", 0],
          [0.66, "#000", 0],
          [0.66, "#000", 0.17],
          [1, "#000", 0.17],
        ])}
      </linearGradient>
      <radialGradient id={`${id}-ball`} cx="0.4" cy="0.36" r="0.72">
        {stops([
          [0, "#fff", 0.32],
          [0.22, "#fff", 0.32],
          [0.22, "#fff", 0],
          [0.76, "#000", 0],
          [0.76, "#000", 0.17],
          [1, "#000", 0.17],
        ])}
      </radialGradient>
      <linearGradient id={`${id}-fall`} x1="0" x2="0" y1="0" y2="1">
        {stops([
          [0, "#fff", 0.18],
          [0.16, "#fff", 0.18],
          [0.16, "#fff", 0],
          [0.68, "#000", 0],
          [0.68, "#000", 0.15],
          [1, "#000", 0.15],
        ])}
      </linearGradient>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0" style={{ stopColor: col("--deco-flame"), stopOpacity: 0.55 }} />
        <stop offset="0.45" style={{ stopColor: col("--deco-flame"), stopOpacity: 0.16 }} />
        <stop offset="1" style={{ stopColor: col("--deco-flame"), stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );
}

// A filled, shaded, outlined shape
function Shape({ d, c, ids, shade = "cel" }: { d: string; c: string; ids: Ids; shade?: "cel" | "ball" | "fall" | "none" }) {
  return (
    <g>
      <path d={d} style={paint(c)} />
      {shade !== "none" && <path d={d} fill={ids.url(shade)} />}
      <path d={d} fill="none" {...ink} />
    </g>
  );
}

// A thick stroke with an outline (handles, stems, tails)
function Tube({ d, c, w }: { d: string; c: string; w: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={LINE} strokeOpacity="0.8" strokeWidth={w + 2.4} />
      <path d={d} style={{ stroke: col(c) }} strokeWidth={w} />
    </g>
  );
}

// Flat shadow where the object stands on the shelf
const Ground = ({ cx, cy, rx }: { cx: number; cy: number; rx: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={Math.max(2.5, rx * 0.1)} fill="#000" opacity="0.28" />
);

// A leaf with a light half, a shaded half and a midrib
function Leaf({ x, y, len, w, rot, dark = false }: { x: number; y: number; len: number; w: number; rot: number; dark?: boolean }) {
  const whole = `M0 0 C${w} ${-len * 0.2} ${w * 0.8} ${-len * 0.78} 0 ${-len} C${-w * 0.8} ${-len * 0.78} ${-w} ${-len * 0.2} 0 0Z`;
  const half = `M0 0 C${w} ${-len * 0.2} ${w * 0.8} ${-len * 0.78} 0 ${-len} Q${w * 0.1} ${-len * 0.5} 0 0Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={whole} style={paint(dark ? "--deco-leaf-dark" : "--deco-leaf")} />
      <path d={half} fill="#000" opacity={dark ? 0.2 : 0.14} />
      <path d={whole} fill="none" {...ink} />
      <path d={`M0 -2 Q${w * 0.1} ${-len * 0.5} 0 ${-len * 0.9}`} fill="none" {...ink} strokeOpacity="0.4" />
      <path d={`M${-w * 0.42} ${-len * 0.36} q${w * 0.06} ${-len * 0.2} ${w * 0.2} ${-len * 0.3}`} stroke="#fff" strokeOpacity="0.45" strokeWidth={Math.max(1.2, w * 0.1)} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Heart({ x, y, s, rot }: { x: number; y: number; s: number; rot: number }) {
  const d = "M0 10 C-10 4 -10 -7 -4 -8 C-1.5 -8.5 0 -6 0 -5 C0 -6 1.5 -8.5 4 -8 C10 -7 10 4 0 10Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={d} style={paint("--deco-leaf")} />
      <path d="M0 10 C10 4 10 -7 4 -8 C1.5 -8.5 0 -6 0 -5Z" fill="#000" opacity="0.16" />
      <path d={d} fill="none" {...ink} />
    </g>
  );
}

function Flame({ x, y, s = 1, alt = false, ids }: { x: number; y: number; s?: number; alt?: boolean; ids: Ids }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-8" r="26" fill={ids.url("glow")} className={styles.glow} />
      <g className={alt ? styles.flameAlt : styles.flame}>
        <path d="M0 -20 C6 -12 7 -4 0 0 C-7 -4 -6 -12 0 -20Z" style={paint("--deco-flame")} {...ink} />
        <path d="M0 -11 C3 -7 3 -3 0 -1.5 C-3 -3 -3 -7 0 -11Z" fill="#fff6dc" />
      </g>
    </g>
  );
}

// Pillar candle with a melted rim, standing with its foot at `bottom`
function Candle({ x, w, top, bottom, ids, alt }: { x: number; w: number; top: number; bottom: number; ids: Ids; alt?: boolean }) {
  const ry = w * 0.18;
  const cx = x + w / 2;
  return (
    <g>
      <Shape d={cylinder(x, top, w, bottom - top, ry)} c="--deco-wax" ids={ids} />
      <path d={`M${x} ${top + 1} q1 10 2.5 12 q2 2 3 -2 q1 -6 3 -1 q1 3 2.5 -1 q1 -6 0 -8`} style={paint("--deco-wax")} />
      <path d={`M${x} ${top + 1} q1 10 2.5 12 q2 2 3 -2 q1 -6 3 -1 q1 3 2.5 -1`} fill="none" {...ink} strokeOpacity="0.45" />
      <path d={ell(cx, top, w / 2, ry)} style={paint("--deco-wax")} {...ink} />
      <path d={ell(cx, top + 0.6, w / 2 - 3, ry - 1.6)} fill="#000" opacity="0.08" />
      <path d={`M${cx} ${top} v-6`} stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
      <Flame ids={ids} x={cx} y={top - 5} s={0.85} alt={alt} />
    </g>
  );
}

// A book lying flat with its spine towards you
function LyingBook({ x, y, w, h, c, ids }: { x: number; y: number; w: number; h: number; c: string; ids: Ids }) {
  return (
    <g>
      <Shape d={rr(x, y, w, h, 2.5)} c={c} ids={ids} shade="fall" />
      <rect x={x + 7} y={y + 1} width="3" height={h - 2} fill="#000" opacity="0.18" />
      <rect x={x + w - 10} y={y + 1} width="3" height={h - 2} fill="#000" opacity="0.18" />
      <rect x={x + w * 0.3} y={y + h / 2 - 1.5} width={w * 0.4} height="3" rx="1.5" fill="#fff" opacity="0.5" />
    </g>
  );
}

function svg(viewBox: string, ids: Ids, children: ReactNode) {
  return (
    <svg viewBox={viewBox} width="100%" height="100%" style={{ overflow: "visible" }}>
      <Defs id={ids.id} />
      {children}
    </svg>
  );
}

function Plant() {
  const ids = useIds();
  const back = [
    { x: 64, y: 118, len: 66, w: 24, rot: -48 },
    { x: 88, y: 116, len: 66, w: 24, rot: 50 },
    { x: 76, y: 100, len: 64, w: 22, rot: 8 },
  ];
  const front = [
    { x: 70, y: 112, len: 74, w: 28, rot: -12 },
    { x: 58, y: 138, len: 52, w: 21, rot: -72 },
    { x: 94, y: 138, len: 52, w: 21, rot: 72 },
    { x: 66, y: 132, len: 54, w: 22, rot: -34 },
    { x: 86, y: 130, len: 52, w: 21, rot: 32 },
  ];
  const stem = (l: { x: number; y: number }, i: number) => (
    <path key={i} d={`M75 150 Q${(75 + l.x) / 2} ${l.y + 20} ${l.x} ${l.y}`} style={{ stroke: col("--deco-leaf-dark") }} strokeWidth="3" fill="none" strokeLinecap="round" />
  );
  return svg(
    "0 0 150 230",
    ids,
    <>
      <Ground cx={75} cy={226} rx={40} />
      {back.map(stem)}
      {back.map((l, i) => <Leaf key={i} {...l} dark />)}
      {front.map(stem)}
      {front.map((l, i) => <Leaf key={i} {...l} />)}
      <Shape d={taper(75, 160, 222, 36, 27, 5)} c="--deco-pot" ids={ids} />
      <path d="M43 190 q8 -6 16 0 t16 0 t16 0 t16 0" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" />
      <Shape d={rr(31, 146, 88, 16, 4)} c="--deco-pot" ids={ids} />
      <path d={ell(75, 146, 44, 6)} style={paint("--deco-pot")} {...ink} />
      <path d={ell(75, 146.5, 38, 4)} fill={SOIL} />
    </>
  );
}

function Roses() {
  const ids = useIds();
  const roses = [
    { x: 30, y: 74, r: 12 },
    { x: 56, y: 56, r: 13 },
    { x: 74, y: 88, r: 11 },
    { x: 46, y: 100, r: 12 },
  ];
  const buds = [
    { x: 20, y: 104, rot: -30 },
    { x: 80, y: 60, rot: 25 },
    { x: 66, y: 34, rot: 8 },
  ];
  const dots = [[38, 52], [70, 70], [24, 90], [84, 104], [60, 108], [32, 120], [40, 36]];
  return svg(
    "0 0 100 240",
    ids,
    <>
      <Ground cx={50} cy={237} rx={30} />
      {[...roses, ...buds].map((f, i) => (
        <path key={i} d={`M50 152 Q${(50 + f.x) / 2} ${(152 + f.y) / 2 + 8} ${f.x} ${f.y}`} style={{ stroke: col("--deco-leaf-dark") }} strokeWidth="2.2" fill="none" />
      ))}
      <Leaf x={40} y={124} len={26} w={10} rot={-60} />
      <Leaf x={60} y={128} len={24} w={9} rot={58} />
      <Leaf x={36} y={92} len={20} w={8} rot={-40} dark />
      <Leaf x={66} y={104} len={20} w={8} rot={46} dark />
      {/* Baby's breath */}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" style={paint("--deco-wax")} {...ink} strokeOpacity="0.5" />
      ))}
      {buds.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.rot})`}>
          <path d="M0 -12 C6 -6 6 2 0 4 C-6 2 -6 -6 0 -12Z" style={paint("--deco-pot")} {...ink} />
          <path d="M-5 0 Q0 6 5 0 L3 5 H-3Z" style={paint("--deco-leaf")} {...ink} />
        </g>
      ))}
      {roses.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.r / 12})`}>
          <Shape d={ell(0, 0, 12, 11)} c="--deco-pot" ids={ids} shade="ball" />
          {/* Petals spiralling into the middle */}
          <path d="M-7 3 C-9 -6 2 -10 7 -4 C10 1 4 7 -1 5 C-5 3 -4 -3 0 -3 C3 -3 3 1 1 1" fill="none" {...ink} strokeOpacity="0.55" />
          <path d="M-10 4 C-6 10 6 10 10 4" fill="none" {...ink} strokeOpacity="0.4" />
        </g>
      ))}
      {/* Round-bellied jug */}
      <Shape d="M39 146 H61 L58 157 C58 163 80 172 80 198 C80 221 67 235 61 236 H39 C33 235 20 221 20 198 C20 172 42 163 42 157 Z" c="--deco-ceramic" ids={ids} />
      <path d={ell(50, 146, 11, 3)} style={paint("--deco-ceramic")} {...ink} />
      <path d={ell(50, 146.5, 8, 1.8)} fill={SOIL} opacity="0.7" />
      <path d="M22 192 Q50 202 78 192" fill="none" style={{ stroke: col("--deco-pot") }} strokeWidth="3" />
      {[30, 42, 54, 66].map((x) => (
        <circle key={x} cx={x + 2} cy={209} r="2.2" style={paint("--deco-pot")} />
      ))}
    </>
  );
}

function Stack({ seed }: { seed: number }) {
  const ids = useIds();
  const c = (k: number) => BOOK_COLORS[(seed + k * 2) % BOOK_COLORS.length];
  const succulent = seed % 2 === 0;
  return svg(
    "0 0 140 170",
    ids,
    <>
      <Ground cx={70} cy={168} rx={66} />
      <LyingBook x={6} y={144} w={128} h={23} c={c(0)} ids={ids} />
      <LyingBook x={16} y={124} w={110} h={20} c={c(1)} ids={ids} />
      <LyingBook x={10} y={108} w={116} h={16} c={c(2)} ids={ids} />
      <LyingBook x={22} y={90} w={96} h={18} c={c(3)} ids={ids} />
      {succulent ? (
        <g>
          {[-62, -32, 0, 32, 62].map((rot, i) => (
            <Leaf key={i} x={70} y={72} len={i === 2 ? 30 : 24} w={9} rot={rot} dark={i % 2 === 1} />
          ))}
          <Leaf x={70} y={74} len={18} w={8} rot={-18} />
          <Leaf x={70} y={74} len={18} w={8} rot={18} />
          <Shape d={taper(70, 76, 89, 16, 12, 3)} c="--deco-ceramic" ids={ids} />
          <Shape d={rr(52, 70, 36, 8, 2.5)} c="--deco-ceramic" ids={ids} />
        </g>
      ) : (
        <Candle x={58} w={24} top={52} bottom={89} ids={ids} />
      )}
    </>
  );
}

function Candles() {
  const ids = useIds();
  return svg(
    "0 0 130 160",
    ids,
    <>
      <Ground cx={65} cy={156} rx={62} />
      {/* Shallow tray */}
      <Shape d="M4 140 Q6 154 20 154 H110 Q124 154 126 140 Z" c="--deco-metal" ids={ids} />
      <path d={ell(65, 140, 61, 7)} style={paint("--deco-metal")} {...ink} />
      <path d={ell(65, 140, 54, 5)} fill="#000" opacity="0.12" />
      <Candle x={14} w={30} top={58} bottom={140} ids={ids} />
      <Candle x={86} w={28} top={82} bottom={140} ids={ids} alt />
      <Candle x={46} w={34} top={98} bottom={142} ids={ids} />
    </>
  );
}

function Gifts() {
  const ids = useIds();
  return svg(
    "0 0 120 160",
    ids,
    <>
      <Ground cx={60} cy={157} rx={56} />
      {/* Big box: front, lid seen from above, side in shade */}
      <Shape d="M96 108 L110 100 V148 L96 156 Z" c="--deco-pot" ids={ids} shade="none" />
      <path d="M96 108 L110 100 V148 L96 156 Z" fill="#000" opacity="0.22" />
      <Shape d="M8 108 L22 100 H110 L96 108 Z" c="--deco-pot" ids={ids} shade="none" />
      <path d="M8 108 L22 100 H110 L96 108 Z" fill="#fff" opacity="0.2" />
      <Shape d="M8 108 H96 V156 H8 Z" c="--deco-pot" ids={ids} />
      {[[20, 118], [36, 146], [72, 116], [84, 144], [26, 136], [80, 130]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill="#fff" opacity="0.45" />
      ))}
      <Shape d="M47 108 H57 V156 H47 Z" c="--deco-wax" ids={ids} shade="none" />
      <Shape d="M8 127 H96 V136 H8 Z" c="--deco-wax" ids={ids} shade="none" />
      <path d="M96 127 L110 119 V128 L96 136 Z" style={paint("--deco-wax")} {...ink} opacity="0.85" />
      {/* Small box on top */}
      <path d="M78 72 L90 65 V97 L78 104 Z" style={paint("--deco-ceramic")} {...ink} />
      <path d="M78 72 L90 65 V97 L78 104 Z" fill="#000" opacity="0.2" />
      <path d="M24 72 L36 65 H90 L78 72 Z" style={paint("--deco-ceramic")} {...ink} />
      <Shape d="M24 72 H78 V104 H24 Z" c="--deco-ceramic" ids={ids} />
      <Shape d="M46 72 H55 V104 H46 Z" c="--deco-pot" ids={ids} shade="none" />
      <path d="M50.5 72 L62.5 65" style={{ stroke: col("--deco-pot") }} strokeWidth="7" />
      {/* Bow */}
      <g transform="translate(56 67)">
        <path d="M0 0 C-6 -14 -24 -12 -18 -3 C-14 2 -6 2 0 0Z" style={paint("--deco-pot")} {...ink} />
        <path d="M0 0 C6 -14 24 -12 18 -3 C14 2 6 2 0 0Z" style={paint("--deco-pot")} {...ink} />
        <path d="M0 0 C6 -14 24 -12 18 -3 C14 2 6 2 0 0Z" fill="#000" opacity="0.15" />
        <path d="M-2 1 L-9 12 M2 1 L8 11" style={{ stroke: col("--deco-pot") }} strokeWidth="4" strokeLinecap="round" />
        <path d={ell(0, 0, 4, 3.5)} style={paint("--deco-pot")} {...ink} />
      </g>
    </>
  );
}

function Radio() {
  const ids = useIds();
  return svg(
    "0 0 150 130",
    ids,
    <>
      <Ground cx={75} cy={127} rx={68} />
      <Tube d="M42 44 C42 18 108 18 108 44" c="--deco-metal" w={4} />
      <path d={rr(22, 116, 16, 8, 2)} style={paint("--wood-dark")} {...ink} />
      <path d={rr(112, 116, 16, 8, 2)} style={paint("--wood-dark")} {...ink} />
      <Shape d={rr(8, 40, 134, 80, 16)} c="--wood-light" ids={ids} shade="fall" />
      {/* Speaker cloth */}
      <Shape d={rr(22, 54, 62, 54, 9)} c="--deco-wax" ids={ids} shade="none" />
      {[62, 69, 76, 83, 90, 97].map((y) => (
        <path key={y} d={`M28 ${y} H78`} stroke={LINE} strokeOpacity="0.3" strokeWidth="1.2" />
      ))}
      {/* Tuning dial and knobs */}
      <Shape d={ell(112, 72, 18, 18)} c="--deco-ceramic" ids={ids} shade="ball" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (Math.PI * (200 + i * 17.5)) / 180;
        return <path key={i} d={`M${n(112 + Math.cos(a) * 14)} ${n(72 + Math.sin(a) * 14)} L${n(112 + Math.cos(a) * 11)} ${n(72 + Math.sin(a) * 11)}`} stroke={LINE} strokeOpacity="0.6" strokeWidth="1.2" />;
      })}
      <path d="M112 72 L104 62" stroke="#b4433a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="112" cy="72" r="2.4" fill={LINE} />
      <Shape d={ell(101, 104, 7, 7)} c="--deco-metal" ids={ids} shade="ball" />
      <Shape d={ell(123, 104, 7, 7)} c="--deco-metal" ids={ids} shade="ball" />
    </>
  );
}

function Clock() {
  const ids = useIds();
  return svg(
    "0 0 100 140",
    ids,
    <>
      <Ground cx={50} cy={137} rx={36} />
      <Tube d="M32 108 L22 134" c="--deco-metal" w={4} />
      <Tube d="M68 108 L78 134" c="--deco-metal" w={4} />
      <Tube d="M30 34 Q50 12 70 34" c="--deco-metal" w={3} />
      {/* Bells */}
      <g transform="rotate(-28 30 46)">
        <Shape d="M14 50 A16 16 0 0 1 46 50 Z" c="--deco-metal" ids={ids} />
      </g>
      <g transform="rotate(28 70 46)">
        <Shape d="M54 50 A16 16 0 0 1 86 50 Z" c="--deco-metal" ids={ids} />
      </g>
      <Shape d={ell(50, 82, 36, 36)} c="--deco-pot" ids={ids} shade="ball" />
      <Shape d={ell(50, 82, 28, 28)} c="--deco-wax" ids={ids} shade="none" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * i) / 6;
        const r1 = i % 3 === 0 ? 20 : 23;
        return <path key={i} d={`M${n(50 + Math.sin(a) * r1)} ${n(82 - Math.cos(a) * r1)} L${n(50 + Math.sin(a) * 25)} ${n(82 - Math.cos(a) * 25)}`} stroke={LINE} strokeOpacity="0.7" strokeWidth={i % 3 === 0 ? 2 : 1.2} strokeLinecap="round" />;
      })}
      <path d="M50 82 L50 64 M50 82 L63 88" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M50 82 L38 74" stroke="#b4433a" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="50" cy="82" r="2.6" style={paint("--deco-metal")} {...ink} />
      <path d="M30 66 A26 26 0 0 1 44 58" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.4" strokeLinecap="round" />
    </>
  );
}

function Cat() {
  const ids = useIds();
  return svg(
    "0 0 100 160",
    ids,
    <>
      <Ground cx={50} cy={157} rx={40} />
      <Tube d="M74 150 C98 146 98 118 84 108" c="--deco-ceramic" w={10} />
      <Shape d="M22 156 C10 122 20 84 50 80 C80 84 90 122 78 156 Z" c="--deco-ceramic" ids={ids} shade="ball" />
      <path d="M34 156 C30 140 32 126 38 116" fill="none" {...ink} strokeOpacity="0.4" />
      <path d="M66 156 C70 140 68 126 62 116" fill="none" {...ink} strokeOpacity="0.4" />
      <Shape d={ell(36, 152, 9, 6)} c="--deco-ceramic" ids={ids} shade="none" />
      <Shape d={ell(64, 152, 9, 6)} c="--deco-ceramic" ids={ids} shade="none" />
      {/* Ears and head */}
      <Shape d="M25 48 L27 15 L49 34 Z" c="--deco-ceramic" ids={ids} shade="none" />
      <Shape d="M75 48 L73 15 L51 34 Z" c="--deco-ceramic" ids={ids} shade="none" />
      <path d="M31 40 L32 25 L42 34 Z" fill="#e3a49a" />
      <path d="M69 40 L68 25 L58 34 Z" fill="#e3a49a" />
      <Shape d={ell(50, 56, 28, 26)} c="--deco-ceramic" ids={ids} shade="ball" />
      {/* Sleepy face */}
      <path d="M35 56 q5 4 10 0 M55 56 q5 4 10 0" stroke={LINE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="34" cy="65" rx="5" ry="3" fill="#e3a49a" opacity="0.7" />
      <ellipse cx="66" cy="65" rx="5" ry="3" fill="#e3a49a" opacity="0.7" />
      <path d="M47 63 h6 l-3 3z" fill="#c9776b" />
      <path d="M50 66 q-3 4 -6 2 M50 66 q3 4 6 2" stroke={LINE} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M30 63 L16 60 M30 66 L16 68 M70 63 L84 60 M70 66 L84 68" stroke={LINE} strokeOpacity="0.5" strokeWidth="0.9" />
      {/* Collar and bell */}
      <path d="M29 79 Q50 90 71 79" style={{ stroke: col("--deco-pot") }} strokeWidth="5" fill="none" strokeLinecap="round" />
      <Shape d={ell(50, 90, 5, 5)} c="--deco-metal" ids={ids} shade="ball" />
    </>
  );
}

function Mug({ seed }: { seed: number }) {
  const ids = useIds();
  return svg(
    "0 0 150 150",
    ids,
    <>
      <Ground cx={74} cy={148} rx={70} />
      <LyingBook x={4} y={122} w={138} h={24} c={BOOK_COLORS[seed % BOOK_COLORS.length]} ids={ids} />
      <LyingBook x={16} y={100} w={114} h={22} c={BOOK_COLORS[(seed + 3) % BOOK_COLORS.length]} ids={ids} />
      <Tube d="M96 60 c22 0 22 30 0 30" c="--deco-mug" w={7} />
      <Shape d="M46 52 V88 Q46 100 58 100 H86 Q98 100 98 88 V52 Z" c="--deco-mug" ids={ids} />
      <path d="M72 84 C64 78 62 72 67 70 C69 69 71 70 72 72 C73 70 75 69 77 70 C82 72 80 78 72 84Z" style={paint("--deco-pot")} />
      <path d={ell(72, 52, 26, 6)} style={paint("--deco-mug")} {...ink} />
      <path d={ell(72, 53, 22, 4)} fill="#5a3420" />
      <path className={styles.steam} d="M64 42 c-6 -8 6 -12 0 -22" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path className={styles.steamAlt} d="M80 44 c-6 -8 6 -12 0 -22" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  );
}

function Frame() {
  const ids = useIds();
  const clip = `${ids.id}-pic`;
  return svg(
    "0 0 130 170",
    ids,
    <>
      <Ground cx={64} cy={167} rx={52} />
      <g transform="rotate(-4 64 166)">
        <path d="M70 60 L96 166" stroke={LINE} strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" />
        <Shape d={rr(14, 14, 100, 150, 5)} c="--deco-metal" ids={ids} />
        <Shape d={rr(25, 25, 78, 128, 2)} c="--deco-wax" ids={ids} shade="none" />
        <clipPath id={clip}>
          <rect x="34" y="34" width="60" height="110" />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <rect x="34" y="34" width="60" height="110" style={paint("--deco-globe")} />
          <circle cx="74" cy="66" r="9" style={paint("--deco-flame")} {...ink} />
          <path d="M34 106 Q50 88 66 102 T94 96 V144 H34Z" style={paint("--deco-leaf")} {...ink} />
          <path d="M34 122 Q56 108 76 118 T94 114 V144 H34Z" style={paint("--deco-leaf-dark")} {...ink} />
          <path d="M44 102 l5 -14 l5 14z M54 104 l4 -10 l4 10z" style={paint("--deco-leaf-dark")} {...ink} />
        </g>
        <rect x="34" y="34" width="60" height="110" fill="none" {...ink} />
        <path d="M38 38 H60 L38 76 Z" fill="#fff" opacity="0.2" />
      </g>
    </>
  );
}

function Lantern() {
  const ids = useIds();
  return svg(
    "0 0 100 190",
    ids,
    <>
      <Ground cx={50} cy={187} rx={40} />
      <circle cx="50" cy="134" r="70" fill={ids.url("glow")} className={styles.glow} />
      <ellipse cx="50" cy="24" rx="10" ry="12" fill="none" stroke={LINE} strokeOpacity="0.8" strokeWidth="6" />
      <ellipse cx="50" cy="24" rx="10" ry="12" fill="none" style={{ stroke: col("--deco-metal") }} strokeWidth="3.5" />
      <Shape d="M12 66 L50 34 L88 66 Z" c="--deco-metal" ids={ids} />
      <Shape d={rr(8, 64, 84, 9, 2.5)} c="--deco-metal" ids={ids} shade="fall" />
      {/* Glass, glowing candle */}
      <path d={rr(16, 73, 68, 96, 1)} style={paint("--deco-flame")} opacity="0.16" />
      <Candle x={40} w={20} top={132} bottom={168} ids={ids} />
      <path d="M24 80 L24 156" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
      <path d={rr(16, 73, 68, 96, 1)} fill="none" {...ink} />
      {[12, 48, 82].map((x) => (
        <Shape key={x} d={rr(x, 73, x === 48 ? 4 : 6, 96, 1)} c="--deco-metal" ids={ids} shade="none" />
      ))}
      <Shape d={rr(16, 118, 68, 4, 1)} c="--deco-metal" ids={ids} shade="none" />
      <Shape d={rr(8, 168, 84, 13, 3)} c="--deco-metal" ids={ids} shade="fall" />
    </>
  );
}

function Globe() {
  const ids = useIds();
  const clip = `${ids.id}-earth`;
  return svg(
    "0 0 120 200",
    ids,
    <>
      <Ground cx={60} cy={196} rx={36} />
      <Shape d="M28 194 Q30 180 60 180 Q90 180 92 194 Z" c="--wood-light" ids={ids} />
      <Shape d={rr(56, 128, 8, 54, 2)} c="--deco-metal" ids={ids} />
      <clipPath id={clip}>
        <circle cx="60" cy="84" r="44" />
      </clipPath>
      <circle cx="60" cy="84" r="44" style={paint("--deco-globe")} />
      <g clipPath={`url(#${clip})`} transform="rotate(-18 60 84)">
        <path d="M30 58 c10 -8 26 -4 28 6 c2 10 -10 14 -7 24 c2 8 -10 12 -16 4 c-7 -9 -12 -24 -5 -34z" style={paint("--deco-leaf")} {...ink} />
        <path d="M70 44 c11 2 22 14 20 24 c-7 4 -15 -2 -19 -10 c-2 -6 -6 -11 -1 -14z" style={paint("--deco-leaf")} {...ink} />
        <path d="M66 100 c8 -4 20 0 18 10 c-4 9 -18 12 -20 4z" style={paint("--deco-leaf")} {...ink} />
        <ellipse cx="60" cy="84" rx="44" ry="13" fill="none" stroke="#fff" strokeOpacity="0.3" />
        <ellipse cx="60" cy="84" rx="20" ry="44" fill="none" stroke="#fff" strokeOpacity="0.25" />
      </g>
      <circle cx="60" cy="84" r="44" fill={ids.url("ball")} />
      <circle cx="60" cy="84" r="44" fill="none" {...ink} />
      <Tube d="M42 38 A48 48 0 0 1 78 130" c="--deco-metal" w={4} />
    </>
  );
}

export function Decoration({ type, seed = 0 }: { type: DecorationType; seed?: number }) {
  switch (type) {
    case "plant":
      return <Plant />;
    case "roses":
      return <Roses />;
    case "stack":
      return <Stack seed={seed} />;
    case "candles":
      return <Candles />;
    case "gifts":
      return <Gifts />;
    case "radio":
      return <Radio />;
    case "clock":
      return <Clock />;
    case "cat":
      return <Cat />;
    case "mug":
      return <Mug seed={seed} />;
    case "frame":
      return <Frame />;
    case "lantern":
      return <Lantern />;
    case "globe":
      return <Globe />;
  }
}

// A string of warm bulbs draped across the top of a shelf
export function FairyLights({ seed }: { seed: number }) {
  const count = 13;
  const sag = 0.55; // how far the wire dips, as a share of the strip height
  const bulbs = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    return { t, y: sag * (1 - (2 * t - 1) ** 2) };
  });
  return (
    <div className={styles.lights} aria-hidden>
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" width="100%" height="100%">
        <path d={`M0 0 Q50 ${sag * 20} 100 0`} stroke="#1a120c" strokeWidth="0.35" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          className={styles.bulb}
          style={
            {
              left: `${b.t * 100}%`,
              top: `${b.y * 100}%`,
              animationDelay: `${-((seed + i * 7) % 11) * 0.37}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

// Ivy trailing down from the shelf above, in one top corner
export function HangingIvy({ side, height }: { side: "left" | "right"; height: number }) {
  const vines = [
    { d: "M10 0 C14 30 4 60 12 96 C16 116 8 132 12 150", leaves: [[12, 16, 20], [8, 38, -30], [9, 60, 25], [13, 82, -20], [12, 104, 30], [10, 126, -15], [12, 146, 10]] },
    { d: "M28 0 C24 24 34 46 28 70", leaves: [[26, 12, -20], [31, 30, 30], [30, 48, -25], [28, 66, 15]] },
    { d: "M44 0 C46 14 40 24 44 36", leaves: [[45, 12, 25], [42, 30, -20]] },
  ];
  return (
    <svg
      viewBox="0 0 56 160"
      className={styles.ivy}
      width={Math.round((height * 56) / 160)}
      height={height}
      style={{ [side]: 0, transform: side === "right" ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      {vines.map((vine, i) => (
        <g key={i}>
          <path d={vine.d} style={{ stroke: col("--deco-leaf-dark") }} strokeWidth="1.6" fill="none" />
          {vine.leaves.map(([x, y, r], j) => (
            <Heart key={j} x={x} y={y} s={1 + ((i + j) % 3) * 0.12} rot={r + 180} />
          ))}
        </g>
      ))}
    </svg>
  );
}
